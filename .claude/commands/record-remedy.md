---
description: Record a dealer supplied remedy evidence reference
---
# Record a dealer supplied remedy evidence reference

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- record-remedy <case-id> --on=YYYY-MM-DD --evidence="<workshop-reference>" --actor="<operator>"
```



Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
