---
description: Record an authorised dealer and supporting reference
---
# Record an authorised dealer and supporting reference

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- add-dealer --name="<name>" --region="<region>" --evidence="<authorisation-reference>" --actor="<operator>"
```



Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
