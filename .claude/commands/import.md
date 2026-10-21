---
description: Import one configured Salesforce campaign report
---
# Import one configured Salesforce campaign report

Read CLAUDE.md and docs/cli.md. Use the actual records and references supplied by the operator. Resolve ambiguous names before any write.

```bash
npm run recalls -- import salesforce <file.csv> --campaign=<code> --actor="<operator>" --dry-run
```

Read docs/replace-salesforce-automotive-cloud.md. Run the dry run, compare counts and rows, then remove --dry-run only when the import is authorised. Source Completed stays imported. Never invent mappings or evidence.

Present the result in plain words with the record identifiers. Preserve reported errors. Never invent a successful result or alter safety decisions. Drafts remain private under drafts/.
