---
description: Link a verified affected vehicle to a campaign
---
# Link a verified affected vehicle to a campaign

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- add-case --campaign=<code> --vehicle=<vin> --coordinator="<owner>" --due=YYYY-MM-DD --actor="<operator>"
```



Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
