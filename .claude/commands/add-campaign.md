---
description: Register an approved recall campaign
---
# Register an approved recall campaign

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- add-campaign --code=<code> --title="<title>" --jurisdiction=AU --kind=voluntary --started=YYYY-MM-DD --owner="<owner>" --source="<official-reference>" --report-due=YYYY-MM-DD --actor="<operator>"
```

Jurisdiction: AU or NZ. Kind: voluntary or compulsory. Copy the official source and actual recall-action start date. The specialist supplies agreed report dates.

Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
