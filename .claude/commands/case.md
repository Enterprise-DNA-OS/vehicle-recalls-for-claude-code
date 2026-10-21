---
description: Read one vehicle case, evidence and contact history
---
# Read one vehicle case, evidence and contact history

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- case <case-id-or-vin>
```



Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
