---
description: Check evidence and cited recall record rules
---
# Check evidence and cited recall record rules

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- compliance
```

Read docs/compliance.md. Report which check failed and its source. A clean check does not certify safety or legal compliance.

Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
