---
doc_id: reference/runtime-contracts
audience: maintainer
mode: mixed
review_policy: contract
stability: evolving
covers_surfaces: []
covers_sources: []
---
# Runtime contracts reference

This generated registry lists production environment-variable references, runtime paths/artifacts, schema identifiers, and status vocabularies extracted from package source. It intentionally excludes incidental source-code literals such as package metadata import paths.

<!-- pi-docs:begin name="runtime-contracts" generator="scripts/docs/generate.mjs" -->
### Environment variable references

| Name | Access | Provenance |
| --- | --- | --- |
| `ComSpec` | read | `src/core/common.ts:618`<br>`src/core/common.ts:629` |
| `path` | read | `src/core/common.ts:573` |
| `Path` | read | `src/core/common.ts:573` |
| `PATH` | read | `src/core/common.ts:573` |
| `PI_BG_DISABLE_PI_TELEMETRY` | read | `src/core/registry.ts:167` |
| `PI_BG_DISABLE_UPDATE_CHECK` | read | `src/extension.ts:387` |
| `PI_BG_MAX_OUTPUT_BYTES` | read | `src/core/registry.ts:45` |
| `PI_BG_REGISTRY_URL` | read | `src/extension.ts:396` |
| `PI_BG_SHELL` | read | `src/core/common.ts:614` |
| `PI_BG_SHELL_PATH` | read | `src/core/common.ts:615` |
| `PI_OFFLINE` | read | `src/extension.ts:388` |
| `SHELL` | read | `src/core/common.ts:610` |
| `SystemRoot` | read | `src/core/windows-taskkill.ts:96` |
| `WINDIR` | read | `src/core/windows-taskkill.ts:101` |

### Runtime paths and artifacts

| Kind | Path/artifact | Provenance |
| --- | --- | --- |
| directory | `.pi/tasks/<session-id>-<pid>/` | `src/core/registry.ts:407` |
| task-file | `.pi/tasks/<session-id>-<pid>/<task-id>.json` | `src/core/registry.ts:430` |
| task-file | `.pi/tasks/<session-id>-<pid>/<task-id>.output` | `src/core/registry.ts:429` |

### Schema identifiers

| Schema | Provenance |
| --- | --- |
| `prime-background-tasks.extension-request.v1` | `src/core/extension-api.ts:15` |
| `prime-background-tasks.extension-response.v1` | `src/core/extension-api.ts:16` |
| `prime-background-tasks.extension-terminal.v1` | `src/core/extension-api.ts:17` |
| `prime-background-tasks.input-token-calibration.v1` | `src/core/context/token-budget.ts:18` |

### Status vocabularies


```json
{
  "TASK_STATUS_VALUES": [
    "running",
    "completed",
    "failed",
    "killed"
  ],
  "TERMINAL_TASK_STATUS_VALUES": [
    "completed",
    "failed",
    "killed"
  ]
}
```
<!-- pi-docs:end name="runtime-contracts" -->

## Maintenance rule

If a runtime fact changes in source, update the owning subsystem/API doc and run `npm run docs:generate`. Do not hand-edit generated tables.
