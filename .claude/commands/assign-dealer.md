---
description: Assign an authorised dealer with handoff evidence
---
# Assign an authorised dealer with handoff evidence

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- assign-dealer <case-id> --dealer="<name>" --evidence="<handoff-reference>" --actor="<operator>"
```



Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
