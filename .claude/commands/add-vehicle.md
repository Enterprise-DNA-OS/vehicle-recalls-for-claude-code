---
description: Register a verified affected vehicle
---
# Register a verified affected vehicle

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- add-vehicle --vin=<vin> --model="<model>" --owner-ref="<protected-owner-reference>" --region="<region>" --actor="<operator>"
```



Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
