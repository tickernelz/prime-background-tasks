---
doc_id: commands/task-manager
audience: user
mode: mixed
review_policy: contract
stability: stable
covers_surfaces: [command:bg-tasks, command:tasks]
covers_sources: []
---
# `/tasks` and `/bg-tasks`

<!-- pi-docs:begin name="command-contract-tasks-bg-tasks" generator="scripts/docs/generate.mjs" -->
| Command | Description | Provenance |
| --- | --- | --- |
| `/tasks` | List background tasks, or open the interactive manager when the host renders custom components | `src/extension.ts:473` |
| `/bg-tasks` | List background tasks, or open the interactive manager when the host renders custom components | `src/extension.ts:482` |
<!-- pi-docs:end name="command-contract-tasks-bg-tasks" -->

List background tasks. `/tasks` and `/bg-tasks` are aliases. They open the interactive manager on hosts that invoke extension component factories, and otherwise notify the same list as text.

## Synopsis


`/tasks [exact-task-id]`

`/bg-tasks [exact-task-id]`

## When to use

Use these commands when you want the current task list with output paths, or the host UI when it is available: select tasks, inspect a live output tail, stop one or all running tasks, rerun a task, copy/show an output path, or review recent finished task history.

## Defaults

- No argument lists every task in this extension runtime.
- An exact task id opens detail view for that task in the manager and marks it seen. In the text path the id is prefix-resolved and only that task is listed; an unknown or ambiguous id is reported as an error notification.
- If there are no running tasks but finished history exists, the manager list opens in history mode.

## Lifecycle

The manager is an overlay. Opening it sets the status hint to `focused` and temporarily hides the `/bg-clear` hint; closing returns the status to the normal `/bg-tasks` hint. Opening a finished task's detail view marks that task seen. The text path does **not** mark anything seen; use [`/bg-clear`](bg-clear.md) to clear finished badges together.

List view sorts tasks as running, failed, killed, then completed; within a status, newest terminal/start time appears first. Status labels shown in the UI are `running`, `error` for `failed`, `stopped` for `killed`, and `done` for `completed`.

## Examples

```text
/tasks
/bg-tasks b1234
```

## Output/result

On hosts that render extension components the command opens the overlay. Otherwise it notifies the same task list `/jobs` renders, followed by one hint line:

```text
▶ b1234abcd running 3s pid=1234 — Daemon Probe
    output: .pi/tasks/session-1/b1234abcd.output
Task actions: /bg-logs <id>, /kill <id>, /bg-clear
```

With no tasks the text is `No background tasks in this Pi extension runtime.`

## Controls

List view:

- `↑`/`↓`: select.
- `PgUp`/`PgDn`: page selection.
- `Enter`/`→`: open output detail.
- `k`: stop selected running task.
- `a`, `A`, or `K`: stop all running tasks; press again to confirm.
- `h`: show/hide history.
- `R`: rerun selected task with notification enabled and wake disabled.
- `c`/`C`: show output path.
- `Esc`, `q`, `Q`, `x`, `X`: close.

Detail view:

- `←`: return to list.
- `↑`/`↓`/`PgUp`/`PgDn`: scroll output.
- `r`: refresh and resume following tail.
- `k`: stop running task.
- `R`: rerun task.
- `c`/`C`: show output path.
- close keys are the same as list view.

## Detail output tail semantics

The detail view reads a UI-only tail buffer of 128 KiB once per second while following. It displays 12 output lines. Scrolling up pauses live following and freezes the buffer so the view stays stable. Scrolling/pageing back to the bottom resumes follow mode; `r` also resumes follow and refreshes. This UI tail is larger than the model-facing log cap and is separate from [`bg_logs`](../tools/bg_logs.md).

## Errors

Stop, stop-all, rerun, and output-read failures are reported inside the manager as action messages. A missing output file appears as `Output file not found: <path>`. In the text path, an unknown or ambiguous task id is reported as `Background task list error: <reason>`.

## Runtime artifacts

The manager reads task snapshots and output files from the current extension runtime. It does not reattach to detached historical OS processes after Pi shutdown/reload.

## Safety boundaries

Stopping uses the same runtime kill path as [`/kill`](kill.md) and [`bg_kill`](../tools/bg_kill.md). Shell commands are not sandboxed; the manager only controls tracked tasks.

## Related docs

- [Status line and task list](../reference/shortcuts-and-dock.md)
- [`/jobs`](jobs.md)
- [`/logs`](bg-logs.md)
- [`/kill`](kill.md)
- [Host UI and telemetry](../subsystems/host-ui-and-telemetry.md)

## Source ownership/reference

Surface registration and dock wiring live in `src/extension.ts`; UI behavior is implemented in `src/ui/background-tasks-manager.ts` and owned by [host-ui-and-telemetry](../subsystems/host-ui-and-telemetry.md).
