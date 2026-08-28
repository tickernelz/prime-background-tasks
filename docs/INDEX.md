---
doc_id: INDEX
audience: user
mode: generated
review_policy: contract
stability: stable
covers_surfaces: []
covers_sources: []
---
# Documentation index

Generated navigation for every package-local documentation page. This index intentionally owns no public surface and no production source; ownership is explicit in each primary doc's frontmatter.

## Start here

- [Getting started](./getting-started.md)
- [Choose a workflow](./choose-a-workflow.md)
- [Read before editing production sources](./read-before-edit.md)
- [Runtime contracts](./reference/runtime-contracts.md)

## Docs by audience

### agent

| Doc | Mode | Review | Stability |
| --- | --- | --- | --- |
| [concepts/completion-delivery](./concepts/completion-delivery.md) | authored | contract | stable |
| [concepts/context-projection-and-budgeting](./concepts/context-projection-and-budgeting.md) | authored | behavioral | evolving |
| [read-before-edit](./read-before-edit.md) | generated | contract | stable |
| [tools/bg_kill](./tools/bg_kill.md) | mixed | contract | stable |
| [tools/bg_logs](./tools/bg_logs.md) | mixed | contract | stable |
| [tools/bg_run](./tools/bg_run.md) | mixed | contract | stable |
| [tools/bg_status](./tools/bg_status.md) | mixed | contract | stable |

### maintainer

| Doc | Mode | Review | Stability |
| --- | --- | --- | --- |
| [api/eventbus-v1](./api/eventbus-v1.md) | mixed | behavioral | evolving |
| [operations/configuration](./operations/configuration.md) | authored | contract | stable |
| [operations/releasing](./operations/releasing.md) | authored | contract | evolving |
| [operations/testing](./operations/testing.md) | authored | contract | evolving |
| [operations/troubleshooting](./operations/troubleshooting.md) | authored | contract | evolving |
| [reference/runtime-contracts](./reference/runtime-contracts.md) | mixed | contract | evolving |
| [subsystems/background-task-runtime](./subsystems/background-task-runtime.md) | authored | behavioral | stable |
| [subsystems/child-launch-durability-and-safety](./subsystems/child-launch-durability-and-safety.md) | authored | behavioral | evolving |
| [subsystems/docs-freshness-gate](./subsystems/docs-freshness-gate.md) | mixed | contract | stable |
| [subsystems/host-ui-and-telemetry](./subsystems/host-ui-and-telemetry.md) | authored | behavioral | stable |

### user

| Doc | Mode | Review | Stability |
| --- | --- | --- | --- |
| [choose-a-workflow](./choose-a-workflow.md) | authored | contract | stable |
| [commands/bg](./commands/bg.md) | mixed | contract | stable |
| [commands/bg-clear](./commands/bg-clear.md) | mixed | contract | stable |
| [commands/bg-logs](./commands/bg-logs.md) | mixed | contract | stable |
| [commands/bg-update](./commands/bg-update.md) | mixed | contract | stable |
| [commands/jobs](./commands/jobs.md) | mixed | contract | stable |
| [commands/kill](./commands/kill.md) | mixed | contract | stable |
| [commands/task-manager](./commands/task-manager.md) | mixed | contract | stable |
| [getting-started](./getting-started.md) | authored | contract | stable |
| [INDEX](./INDEX.md) | generated | contract | stable |
| [reference/shortcuts-and-dock](./reference/shortcuts-and-dock.md) | mixed | contract | stable |

## Docs by category

- **api**: [api/eventbus-v1](./api/eventbus-v1.md)
- **commands**: [commands/bg](./commands/bg.md), [commands/bg-clear](./commands/bg-clear.md), [commands/bg-logs](./commands/bg-logs.md), [commands/bg-update](./commands/bg-update.md), [commands/jobs](./commands/jobs.md), [commands/kill](./commands/kill.md), [commands/task-manager](./commands/task-manager.md)
- **concepts**: [concepts/completion-delivery](./concepts/completion-delivery.md), [concepts/context-projection-and-budgeting](./concepts/context-projection-and-budgeting.md)
- **operations**: [operations/configuration](./operations/configuration.md), [operations/releasing](./operations/releasing.md), [operations/testing](./operations/testing.md), [operations/troubleshooting](./operations/troubleshooting.md)
- **reference**: [reference/runtime-contracts](./reference/runtime-contracts.md), [reference/shortcuts-and-dock](./reference/shortcuts-and-dock.md)
- **root**: [choose-a-workflow](./choose-a-workflow.md), [getting-started](./getting-started.md), [INDEX](./INDEX.md), [read-before-edit](./read-before-edit.md)
- **subsystems**: [subsystems/background-task-runtime](./subsystems/background-task-runtime.md), [subsystems/child-launch-durability-and-safety](./subsystems/child-launch-durability-and-safety.md), [subsystems/docs-freshness-gate](./subsystems/docs-freshness-gate.md), [subsystems/host-ui-and-telemetry](./subsystems/host-ui-and-telemetry.md)
- **tools**: [tools/bg_kill](./tools/bg_kill.md), [tools/bg_logs](./tools/bg_logs.md), [tools/bg_run](./tools/bg_run.md), [tools/bg_status](./tools/bg_status.md)

## Public surface owners

| Surface | Primary doc |
| --- | --- |
| `command:bg` | [commands/bg](./commands/bg.md) |
| `command:bg-clear` | [commands/bg-clear](./commands/bg-clear.md) |
| `command:bg-logs` | [commands/bg-logs](./commands/bg-logs.md) |
| `command:bg-tasks` | [commands/task-manager](./commands/task-manager.md) |
| `command:bg-update` | [commands/bg-update](./commands/bg-update.md) |
| `command:jobs` | [commands/jobs](./commands/jobs.md) |
| `command:kill` | [commands/kill](./commands/kill.md) |
| `command:tasks` | [commands/task-manager](./commands/task-manager.md) |
| `eventbus:background-task-v1` | [api/eventbus-v1](./api/eventbus-v1.md) |
| `renderer:background-task-notification` | [concepts/completion-delivery](./concepts/completion-delivery.md) |
| `shortcut:ctrl+alt+c` | [reference/shortcuts-and-dock](./reference/shortcuts-and-dock.md) |
| `shortcut:shift+down` | [reference/shortcuts-and-dock](./reference/shortcuts-and-dock.md) |
| `tool:bg_kill` | [tools/bg_kill](./tools/bg_kill.md) |
| `tool:bg_logs` | [tools/bg_logs](./tools/bg_logs.md) |
| `tool:bg_run` | [tools/bg_run](./tools/bg_run.md) |
| `tool:bg_status` | [tools/bg_status](./tools/bg_status.md) |

## Public surface inventory

| Kind | Name | ID | Provenance |
| --- | --- | --- | --- |
| command | `bg` | `command:bg` | `src/extension.ts:449` |
| command | `bg-clear` | `command:bg-clear` | `src/extension.ts:491` |
| command | `bg-logs` | `command:bg-logs` | `src/extension.ts:550` |
| command | `bg-tasks` | `command:bg-tasks` | `src/extension.ts:483` |
| command | `bg-update` | `command:bg-update` | `src/extension.ts:499` |
| command | `jobs` | `command:jobs` | `src/extension.ts:537` |
| command | `kill` | `command:kill` | `src/extension.ts:581` |
| command | `tasks` | `command:tasks` | `src/extension.ts:475` |
| tool | `bg_kill` | `tool:bg_kill` | `src/extension.ts:776` |
| tool | `bg_logs` | `tool:bg_logs` | `src/extension.ts:731` |
| tool | `bg_run` | `tool:bg_run` | `src/extension.ts:614` |
| tool | `bg_status` | `tool:bg_status` | `src/extension.ts:700` |
| shortcut | `ctrl+alt+c` | `shortcut:ctrl+alt+c` | `src/extension.ts:529` |
| shortcut | `shift+down` | `shortcut:shift+down` | `src/extension.ts:522` |
| renderer | `background-task-notification` | `renderer:background-task-notification` | `src/extension.ts:358` |
| eventbus | `background-task-v1` | `eventbus:background-task-v1` | `src/core/extension-api.ts` |
