---
description: Record the separate reviewers evidence decision
---
# Record the separate reviewers evidence decision

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- verify-remedy <remedy-id> --decision=accepted --evidence="<review-reference>" --actor="<reviewer>"
```

Accepted and rejected are the only decisions. Ask the authorised reviewer for the actual decision and evidence. Never verify your own prepared record or infer approval.

Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
