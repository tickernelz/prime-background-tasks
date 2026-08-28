---
doc_id: read-before-edit
audience: agent
mode: generated
review_policy: contract
stability: stable
covers_surfaces: []
covers_sources: []
---
# Read before editing production sources

Every production file under `src/**` and `extensions/**` has exactly one primary behavioral documentation owner. This file is generated from authored ownership frontmatter and owns no production source itself.

## Source ownership

| Source | Primary behavioral owner |
| --- | --- |
| `extensions/background-tasks.ts` | [subsystems/host-ui-and-telemetry](./subsystems/host-ui-and-telemetry.md) |
| `src/core/common.ts` | [subsystems/background-task-runtime](./subsystems/background-task-runtime.md) |
| `src/core/context/parent-snapshot.ts` | [concepts/context-projection-and-budgeting](./concepts/context-projection-and-budgeting.md) |
| `src/core/context/token-budget.ts` | [concepts/context-projection-and-budgeting](./concepts/context-projection-and-budgeting.md) |
| `src/core/context/visible-conversation-v2.ts` | [concepts/context-projection-and-budgeting](./concepts/context-projection-and-budgeting.md) |
| `src/core/durable-fs.ts` | [subsystems/child-launch-durability-and-safety](./subsystems/child-launch-durability-and-safety.md) |
| `src/core/extension-api.ts` | [api/eventbus-v1](./api/eventbus-v1.md) |
| `src/core/registry.ts` | [subsystems/background-task-runtime](./subsystems/background-task-runtime.md) |
| `src/core/task-files.ts` | [subsystems/child-launch-durability-and-safety](./subsystems/child-launch-durability-and-safety.md) |
| `src/core/update-check.ts` | [subsystems/host-ui-and-telemetry](./subsystems/host-ui-and-telemetry.md) |
| `src/core/windows-taskkill.ts` | [subsystems/background-task-runtime](./subsystems/background-task-runtime.md) |
| `src/extension.ts` | [subsystems/host-ui-and-telemetry](./subsystems/host-ui-and-telemetry.md) |
| `src/ui/background-tasks-manager.ts` | [subsystems/host-ui-and-telemetry](./subsystems/host-ui-and-telemetry.md) |

## Public surfaces

- `command:bg`
- `command:bg-clear`
- `command:bg-logs`
- `command:bg-tasks`
- `command:bg-update`
- `command:jobs`
- `command:kill`
- `command:tasks`
- `eventbus:background-task-v1`
- `renderer:background-task-notification`
- `tool:bg_kill`
- `tool:bg_logs`
- `tool:bg_run`
- `tool:bg_status`
