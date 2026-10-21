---
description: Record an appointment agreed with the dealer
---
# Record an appointment agreed with the dealer

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- schedule-remedy <case-id> --on=YYYY-MM-DD --evidence="<booking-reference>" --actor="<operator>"
```



Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
