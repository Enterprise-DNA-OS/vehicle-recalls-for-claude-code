# Vehicle Recalls for Claude Code

For the recall coordinator at a vehicle importer, distributor or dealer group. Track verified affected vehicles, contact attempts, authorised dealer handoffs, remedy evidence and agreed reporting dates. This is an administrative desk, not a vehicle safety authority.

## Rules

- Read from the CLI before answering. Never invent records, command results, evidence or approval.
- Use the official campaign scope and approved source. Never determine defects, affected VINs, repair methods, safety clearance or legal reportability.
- Never send owner communications or file regulatory reports. Draft internal worksheets only.
- Imported status is history. Reconcile it explicitly; no import can certify a remedy.
- Record remedies only from actual dealer evidence. A separate authorised human reviewer supplies the decision and evidence reference. Actor labels are not authentication.
- The supplier and its qualified advisers own notification timing, reporting frequency and closure. Date-only checks are reminders, not legal deadline calculations.
- Names may be ambiguous. List candidates and resolve the intended record before writing.
- Keep personal data in its protected source system; use owner references here. Keep generated files private.
- Do not delete records or weaken gates. /customise preserves history through a new migration and meaningful tests.

## Routes

- /campaigns: Read campaign totals and reporting dates.
- /vehicles: Read the affected vehicle register.
- /dealers: Read authorised dealer references.
- /cases: Read affected cases and their status.
- /case: Read one vehicle case, evidence and contact history.
- /recall-triage: Triage unresolved affected vehicles.
- /contact-chase: Find vehicle owners needing a follow-up.
- /dealer-handoffs: Review dealer assignments and appointments.
- /remedy-review: Review evidence waiting for an independent verifier.
- /report-due: Check agreed campaign report dates.
- /attention: Find overdue, unassigned and unreconciled work.
- /compliance: Check evidence and cited recall record rules.
- /activity: Read the recorded activity history.
- /insights: Answer ten cross-record questions.
- /add-campaign: Register an approved recall campaign.
- /add-dealer: Record an authorised dealer and supporting reference.
- /add-vehicle: Register a verified affected vehicle.
- /add-case: Link a verified affected vehicle to a campaign.
- /activate: Reconcile an imported record into active work.
- /assign-dealer: Assign an authorised dealer with handoff evidence.
- /record-contact: Record a contact that already happened.
- /schedule-remedy: Record an appointment agreed with the dealer.
- /record-remedy: Record a dealer supplied remedy evidence reference.
- /verify-remedy: Record the separate reviewers evidence decision.
- /reopen: Reopen completed work after an authorised review.
- /notification: Record an official notification already submitted.
- /campaign-report: Record a submitted progress report and next agreed date.
- /close-campaign: Record an authorised campaign closure decision.
- /log: Record a follow-up reference.
- /import: Import one configured Salesforce campaign report.
- /export: Archive every domain record to a new private file.
- /weekly-review: Draft the Monday recall handover from three live reads.
- /draft-follow-up: Draft an internal follow-up worksheet from the full history.
- /documents: Render branded internal paperwork.
- /view: Render private snapshots.
- /new-view: Add a read-only view.
- /customise: Adapt a field or local rule.

## Files

scripts/recalls.mjs is the CLI; docs/cli.md gives exact syntax. The database adapter selects a dedicated PostgreSQL DATABASE_URL or local PGlite DATA_DIR. Migrations are in supabase/migrations and fictional demo data in supabase/seed.sql. The owner role runs the CLI; no public Data API grants are provided. Shared production use needs authenticated roles and permissions.

brand.json controls business name, logo and colours. views.json and documents.json declare read-only HTML outputs. Never commit .data, exports, drafts, rendered records or credentials. Run npm install, npm test and npm run demo to verify. TEST_DATABASE_URL is for an empty disposable CI database only.

Omni by Enterprise DNA installs, customises and operates your version for a setup fee and retainer.
