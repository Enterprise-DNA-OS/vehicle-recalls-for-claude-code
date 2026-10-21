---
description: Adapt a field or local rule with a migration
---
# Make it yours

Read CLAUDE.md and the schema. Confirm the intended field, label or local rule from the operator's request. Preserve official recall scope and evidence gates. Never weaken independent review or treat imported history as approval.

1. Inspect current values through the CLI and take a private export before changing business data.
2. Write the next numbered migration under supabase/migrations; never edit an applied migration.
3. Update CLI input validation, docs/cli.md, affected views, documents and this command library.
4. Add a meaningful test for the changed behaviour. Run npm test, apply npm run migrate to the intended database, then read the changed records and show the result.
5. Keep every migration compatible with PostgreSQL 15+ and PGlite. New exposed tables need RLS and no public grants; views use security_invoker=true.

For a regulatory rule change, first verify the official source and update docs/compliance.md with the operator's specialist interpretation. No automatic safety decisions, deletion, regulatory submission or sending.
