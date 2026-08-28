---
doc_id: reference/shortcuts-and-dock
audience: user
mode: mixed
review_policy: contract
stability: stable
covers_surfaces: []
covers_sources: []
---
# Status line and task list reference

<!-- pi-docs:begin name="shortcut-contracts" generator="scripts/docs/generate.mjs" -->
| Shortcut | Description | Provenance |
| --- | --- | --- |
<!-- pi-docs:end name="shortcut-contracts" -->

## Registered shortcuts

None. Prime Agent 0.8.1 runs interactive sessions through a daemon and only wires extension shortcuts for in-process sessions, so a registered shortcut could never fire for a CLI user. Use [`/bg-tasks`](../commands/task-manager.md) for the task list and [`/bg-clear`](../commands/bg-clear.md) to clear finished notices.

## Status line states

The status line appears when there are running tasks, unseen finished tasks, or an update segment. Count labels are:

- `running` for active tasks;
- `failed` for status `failed`;
- `stopped` for status `killed`;
- `done` for status `completed`.

Examples:

```text
bg 1 running · /bg-tasks
bg 1 done · /bg-tasks · /bg-clear
bg 1 running · 1 failed · 1 stopped · 1 done · /bg-tasks · /bg-clear
bg 1 running · /bg-tasks · ⬆ v999.0.0 /bg-update
bg 1 running · focused
```

The `/bg-clear` hint is hidden while the manager overlay is open, where the entry hint becomes `focused`. A finished task's badge is marked seen when its detail view opens in the manager; `/bg-clear` marks all currently unseen finished tasks seen. Listing tasks as text does not clear badges.

## Task list entry points

- [`/tasks`](../commands/task-manager.md)
- [`/bg-tasks`](../commands/task-manager.md)
- [`/jobs`](../commands/jobs.md)

`/tasks` and `/bg-tasks` open the interactive manager on hosts that invoke extension component factories, and otherwise notify the same task list as text. `/jobs` is always text.

## Manager output detail

The detail view follows a UI-only 128 KiB tail buffer, refreshes once per second while following, and shows 12 output lines. Scrolling up pauses following; reaching the bottom or pressing `r` resumes it. Under the Prime Agent 0.8.1 daemon the overlay never opens, so this view is unreachable there and the text list is used instead.

## Related docs

- [`/bg-clear`](../commands/bg-clear.md)
- [`/tasks` and `/bg-tasks`](../commands/task-manager.md)
- [`/bg-update`](../commands/bg-update.md)
- [Host UI and telemetry](../subsystems/host-ui-and-telemetry.md)

## Source ownership/reference

Status line and manager implementation is owned by [host-ui-and-telemetry](../subsystems/host-ui-and-telemetry.md).
