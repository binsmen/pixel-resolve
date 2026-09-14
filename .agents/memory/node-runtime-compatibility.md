---
name: Node runtime compatibility
description: Runtime alignment for imported Node applications using built-in APIs.
---

The Replit Node module and the project’s declared runtime should be kept aligned with built-in APIs used by the server. In particular, applications using `node:sqlite` require a Node release that provides that built-in module.

**Why:** Replit can have a different active Node version than the version suggested by `replit.nix`; a mismatched module causes startup failure before the Express server listens.

**How to apply:** When an imported Node app uses newer built-in modules, verify the active Node version and update the Replit module selection before diagnosing application code.