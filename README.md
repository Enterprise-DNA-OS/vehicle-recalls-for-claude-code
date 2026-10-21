# Vehicle Recalls for Claude Code

The open-source vehicle recall desk that is just a database and Claude Code. Built by Enterprise DNA. Works with Claude Code, Codex, OpenCode or Cursor.

| Do it yourself | We customise it | We run it for you |
|---|---|---|
| Free, MIT. Follow the quick start below. | Your fields, evidence rules and Salesforce history. [Book a call](https://enterprisedna.co/omni/book/?offer=replace-software&utm_source=github&utm_medium=readme&utm_campaign=salesforce-automotive-cloud). | Installed and operated through Omni by Enterprise DNA. One setup fee, then a retainer. [See the offer](https://enterprisedna.co/omni/instead-of/salesforce-automotive-cloud?utm_source=github&utm_medium=readme&utm_campaign=salesforce-automotive-cloud). |

## The bill and the scope

Salesforce's Automotive Cloud Core list price is US$300 per user/month, billed annually. Twenty-five Core seats model US$90,000 a year before add-ons. This is a list-price scenario, not a verified customer invoice or savings promise. [Salesforce pricing](https://www.salesforce.com/automotive/pricing/), checked 21 October 2026.

This build covers the recall coordinator's desk: affected vehicles, campaign references, contact history, dealer assignments, remedy evidence and reporting dates. Automotive Cloud includes much more. The supplier retains safety decisions, approved recall wording, repair procedures and regulatory reporting. No command sends a message or files a report.

## Quick start

```bash
git clone https://github.com/Enterprise-DNA-OS/vehicle-recalls-for-claude-code.git
cd vehicle-recalls-for-claude-code
npm install
npm test
npm run demo
npm run view
npm run docs
```

Node 20 or later. PGlite runs locally without a server. DATABASE_URL selects a dedicated PostgreSQL 15+ database; DATA_DIR selects local storage. Use a fresh database and npm run migrate for business records. Demo vehicles, people and campaign references are fictional. Never mix demo records into operational data.

## Five weekly rituals

Triage affected vehicles, chase outstanding contact, reconcile dealer handoffs, verify remedy evidence and review campaign reporting. /weekly-review reads three current reports and drafts the Monday handover locally.

## Commands

33 CLI commands and 37 slash recipes. [Full syntax](docs/cli.md).

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

## Ten questions your desk answers today

/insights answers each question from existing data. These are shipped cross-record reports, not a claim that Salesforce cannot be configured to answer them.

1. Which coordinators have overdue affected vehicles?
2. Which campaigns combine missing notification evidence with unresolved vehicles?
3. Which dealers have missed appointments?
4. Which vehicle owners have had no recorded contact?
5. Which campaigns have imported completed claims that remain unverified?
6. Where is remedy evidence waiting on a separate reviewer?
7. Which regions have unresolved vehicles without a dealer?
8. Which progress reports are due with unresolved vehicles?
9. Which vehicles have repeated contact failures?
10. Which vehicles appear in more than one unresolved campaign?

## Your first hour: ten things to ask for

1. Put our business name and logo on the worksheets.
2. Register our official campaign and source reference.
3. Import a configured Salesforce report with a dry run.
4. Compare affected VINs and counts with the source export.
5. Show which imported records need reconciliation.
6. Show the unassigned dealer handoffs.
7. Record the outcome of a contact already completed.
8. Prepare the progress worksheet from the current records.
9. Add our business-unit field through /customise.
10. Add a read-only view for the next reporting meeting.

## Evidence, import and ownership

A source Completed status stays imported until reconciled. An assigned dealer and dated evidence are required before remedy verification. The verifier label must differ from the recorder. Every affected case must be complete before a campaign closes. [Rules and sources](docs/compliance.md).

An authorised administrator configures a Details Only CSV report for each campaign. One import command validates the file, rolls back errors and skips identical source rows. Attachments, permissions, existing communications and other suite functions need separate migration work. [Switching guide](docs/replace-salesforce-automotive-cloud.md).

npm run docs renders internal campaign progress, dealer handoff and remedy evidence documents. npm run view renders the week, dealers and evidence dashboards. brand.json controls their identity. /new-view adds a read-only report; /customise changes the model through a migration. [Why no front end](docs/why-no-front-end.md).

The free version uses a local trusted operator or dedicated database owner. Actor labels are not authenticated identities, and the activity record is not tamper-proof. A shared installation needs identity, permissions, backups and retention rules. Keep exported data and snapshots private.

## Verification

npm test uses temporary storage and tests every CLI command, imports, rollback, idempotence, evidence gates, drafts, exports, error exits and HTML escaping. The CI matrix covers Windows and Linux on Node 20 and 22 and a PostgreSQL 17 job. Read the actual CI run before claiming each platform passed.

## Your version

Omni by Enterprise DNA brings your Salesforce history across, builds your fields and review rules, connects the systems you need and operates the result. Screens and a different stack can be scoped. One setup fee, then a retainer.

[Book Sam's 30-minute call](https://enterprisedna.co/omni/book/?offer=replace-software&utm_source=github&utm_medium=readme&utm_campaign=salesforce-automotive-cloud).

MIT. Copyright 2026 Enterprise DNA. Salesforce is its owner's trademark. This independent project is not affiliated with Salesforce.
