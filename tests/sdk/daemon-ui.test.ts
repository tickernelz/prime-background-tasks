import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import {
  ModelRuntime,
  createAgentSession,
  DefaultResourceLoader,
  SessionManager,
  SettingsManager,
  type AgentSession,
  type ExtensionUIContext,
} from '@earendil-works/pi-coding-agent';

const extensionPath = resolve('extensions/background-tasks.ts');
const roots: string[] = [];

interface DaemonNotification {
  message: string;
  type: string | undefined;
}

interface DaemonWidgetCall {
  key: string;
  crossedTheWire: boolean;
}

interface DaemonUiCalls {
  notifications: DaemonNotification[];
  statuses: Array<string | undefined>;
  widgets: DaemonWidgetCall[];
  footers: number;
  headers: number;
  customs: number;
}

function makeDaemonUi(base: ExtensionUIContext, calls: DaemonUiCalls): ExtensionUIContext {
  return {
    ...base,
    notify: (message: string, type?: 'info' | 'warning' | 'error') => {
      calls.notifications.push({ message, type });
    },
    setStatus: (_key: string, text: string | undefined) => {
      calls.statuses.push(text);
    },
    setWidget: (key: string, content: unknown) => {
      calls.widgets.push({
        key,
        crossedTheWire: content === undefined || Array.isArray(content),
      });
    },
    setFooter: () => {
      calls.footers += 1;
    },
    setHeader: () => {
      calls.headers += 1;
    },
    onTerminalInput: () => () => {},
    getEditorText: () => '',
    custom: ((): Promise<undefined> => {
      calls.customs += 1;
      return Promise.resolve(undefined);
    }) as ExtensionUIContext['custom'],
  };
}

interface DaemonHarness {
  session: AgentSession;
  calls: DaemonUiCalls;
}

async function daemonHarness(): Promise<DaemonHarness> {
  const root = await mkdtemp(join(tmpdir(), 'pi-bg-daemon-'));
  roots.push(root);
  const cwd = join(root, 'project');
  const agentDir = join(root, 'agent');
  await mkdir(cwd, { recursive: true });
  await mkdir(agentDir, { recursive: true });
  const settingsManager = SettingsManager.inMemory();
  const loader = new DefaultResourceLoader({
    cwd,
    agentDir,
    settingsManager,
    additionalExtensionPaths: [extensionPath],
    noExtensions: true,
    noSkills: true,
    noPromptTemplates: true,
    noContextFiles: true,
    noThemes: true,
  });
  await loader.reload();
  const modelRuntime = await ModelRuntime.create({
    authPath: join(agentDir, 'auth.json'),
    modelsPath: null,
  });
  const { session } = await createAgentSession({
    cwd,
    agentDir,
    resourceLoader: loader,
    sessionManager: SessionManager.inMemory(cwd),
    settingsManager,
    modelRuntime,
    noTools: 'builtin',
  });
  const calls: DaemonUiCalls = {
    notifications: [],
    statuses: [],
    widgets: [],
    footers: 0,
    headers: 0,
    customs: 0,
  };
  session.extensionRunner.setUIContext(
    makeDaemonUi(session.extensionRunner.getUIContext(), calls),
  );
  return { session, calls };
}

async function runCommand(session: AgentSession, name: string, args: string): Promise<void> {
  const command = session.extensionRunner
    .getRegisteredCommands()
    .find((registered) => registered.invocationName === name);
  assert.ok(command, `missing command ${name}`);
  await command.handler(args, session.extensionRunner.createCommandContext());
}

function lastNotification(calls: DaemonUiCalls): DaemonNotification {
  const notification = calls.notifications.at(-1);
  assert.ok(notification, 'expected at least one notification');
  return notification;
}

function startedTaskId(calls: DaemonUiCalls): string {
  const started = calls.notifications.find((entry) => entry.message.startsWith('Started '));
  assert.ok(started, 'expected a /bg start receipt');
  const match = /\(([0-9a-z]+)\)/u.exec(started.message);
  assert.ok(match?.[1], `could not read a task id from ${started.message}`);
  return match[1];
}

void describe('daemon ui shim', () => {
  void it('renders the task manager as text when custom components are dropped', async () => {
    const { session, calls } = await daemonHarness();
    try {
      await session.extensionRunner.emit({ type: 'session_start', reason: 'startup' });
      assert.equal(
        session.extensionRunner.hasUI(),
        true,
        'daemon sessions report hasUI true while the rich surface is inert',
      );

      await runCommand(
        session,
        'bg',
        `--name "Daemon Probe" node -e ${JSON.stringify('setTimeout(() => {}, 10000)')}`,
      );
      const taskId = startedTaskId(calls);

      const beforeCustoms = calls.customs;
      await runCommand(session, 'bg-tasks', '');
      assert.equal(
        calls.customs,
        beforeCustoms + 1,
        '/bg-tasks must still try the rich manager before falling back',
      );

      const rendered = lastNotification(calls);
      assert.equal(rendered.type, 'info');
      assert.match(rendered.message, /▶/u);
      assert.match(rendered.message, new RegExp(`${taskId} running`, 'u'));
      assert.match(rendered.message, /Daemon Probe/u);
      assert.match(rendered.message, /\n {4}output: /u);
      assert.match(rendered.message, /Task actions: \/bg-logs <id>, \/kill <id>, \/bg-clear/u);

      const status = calls.statuses.at(-1) ?? '';
      assert.match(status, /1 running/u);
      assert.match(status, /\/bg-tasks/u);
      assert.doesNotMatch(status, /Shift↓/u);

      assert.deepEqual(calls.widgets, [], 'the extension must not push widget traffic');
      assert.equal(calls.footers, 0);
      assert.equal(calls.headers, 0);
      assert.equal(session.extensionRunner.getShortcuts({}).has('shift+down'), false);
    } finally {
      await session.extensionRunner.emit({ type: 'session_shutdown', reason: 'quit' });
      session.dispose();
    }
  });

  void it('renders a deep-linked task and reports unknown ids instead of staying silent', async () => {
    const { session, calls } = await daemonHarness();
    try {
      await session.extensionRunner.emit({ type: 'session_start', reason: 'startup' });
      await runCommand(
        session,
        'bg',
        `--name "Deep Link" node -e ${JSON.stringify('setTimeout(() => {}, 10000)')}`,
      );
      const taskId = startedTaskId(calls);

      await runCommand(session, 'tasks', taskId);
      const deepLink = lastNotification(calls);
      assert.equal(deepLink.type, 'info');
      assert.match(deepLink.message, new RegExp(`${taskId} running`, 'u'));
      assert.match(deepLink.message, /Deep Link/u);

      await runCommand(session, 'bg-tasks', 'zzzzzzzzz');
      const missing = lastNotification(calls);
      assert.equal(missing.type, 'error');
      assert.match(missing.message, /Background task list error/u);
    } finally {
      await session.extensionRunner.emit({ type: 'session_shutdown', reason: 'quit' });
      session.dispose();
    }
  });

  void it('lists nothing gracefully when no task ever started', async () => {
    const { session, calls } = await daemonHarness();
    try {
      await session.extensionRunner.emit({ type: 'session_start', reason: 'startup' });
      await runCommand(session, 'bg-tasks', '');
      const rendered = lastNotification(calls);
      assert.equal(rendered.type, 'info');
      assert.match(rendered.message, /No background tasks in this Pi extension runtime\./u);
    } finally {
      await session.extensionRunner.emit({ type: 'session_shutdown', reason: 'quit' });
      session.dispose();
    }
  });
});

process.on('exit', () => {
  for (const root of roots) void rm(root, { recursive: true, force: true });
});
