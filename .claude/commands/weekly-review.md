---
description: Draft the Monday recall handover from three live reads
---
# Draft the Monday recall handover from three live reads

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- weekly-review
```

The command reads recall-triage, report-due and compliance and writes a private draft. Present the urgent vehicles, next reporting dates and evidence gaps with their owners. Never send the report.

Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
