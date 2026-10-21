---
description: Record a contact that already happened
---
# Record a contact that already happened

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- record-contact <case-id> --on=YYYY-MM-DD --outcome=reached --evidence="<contact-reference>" --next-due=YYYY-MM-DD --actor="<operator>"
```

Outcomes: attempted, reached, returned, wrong_contact. This records an event; it sends nothing.

Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
