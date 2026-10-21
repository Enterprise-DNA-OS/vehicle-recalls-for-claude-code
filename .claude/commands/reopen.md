---
description: Reopen completed work after an authorised review
---
# Reopen completed work after an authorised review

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- reopen <case-id> --due=YYYY-MM-DD --evidence="<review-reference>" --actor="<operator>"
```



Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
