# Attribution

prime-background-tasks is a hard fork of pi-background-tasks 2.4.2
(https://github.com/ismailsaleekh/pi-background-tasks), used under the ISC
license. The original copyright notice is preserved in LICENSE.

## What changed in the fork

The fork targets Prime Agent and keeps only durable background shell tasks:

- Removed the delegate, Fusion, attested-run, and Anthropic-attribution
  surfaces, together with their tests, docs, and runtime artifacts. Prime Agent
  ships its own `rlm` subagents, so those tools duplicated a native capability.
- Removed the `pi` child-process launcher and the Pi telemetry wrapper. Nothing
  in this package spawns an external agent binary any more.
- Renamed the `/logs` slash command to `/bg-logs`, which collides with a
  built-in command on the target host.

Tools kept: `bg_run`, `bg_status`, `bg_logs`, `bg_kill`.
