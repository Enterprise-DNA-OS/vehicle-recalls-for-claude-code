# Replace the recall desk in Salesforce Automotive Cloud

The free version covers the coordinator's affected-vehicle records and evidence workflow. It does not replace the whole Automotive Cloud suite or a manufacturer recall authority.

## Export

An authorised Salesforce administrator configures a flat report with one row per affected vehicle per product service campaign. Salesforce documents [Details Only CSV export](https://help.salesforce.com/s/articleView?id=sf.reports_export.htm&language=en_US&type=5). Its [Recall Inquiry workflow](https://help.salesforce.com/s/articleView?id=ind.auto_psc_set_up_recall_svc_proc.htm&language=en_US&type=5) uses product service campaigns and preferred partners. The columns below are our report contract, not universal default Salesforce labels. Report types and field labels depend on your organisation's configuration.

Export each campaign separately in UTF-8 CSV, Details Only, without totals. Use ISO YYYY-MM-DD dates. Keep the original export unchanged. Check the administrator's row count and campaign filter before import.

| Report label | Accepted alias | Destination |
|---|---|---|
| Case ID | Id | Unique source row identifier; use the affected-asset record ID, not a duplicated parent campaign ID |
| VIN | Vehicle Identification Number | Vehicle VIN, 17 letters/digits excluding I, O and Q |
| Model | Vehicle Model | Vehicle model label |
| Owner Reference | Owner Ref | Reference to the protected owner record |
| Region | | Vehicle region |
| Coordinator | Case Owner | Responsible coordinator label |
| Follow-up Date | Due Date | Local follow-up date |
| Status | | Preserved as source_status only |

## Import in one command

Install dependencies and migrate a fresh database. Register the campaign with /add-campaign using its approved scope, source reference and actual start date. Never seed business data with demo records.

```bash
npm run recalls -- import salesforce ./exports/campaign.csv --campaign=RECALL-2026-01 --actor="Coordinator" --dry-run --json
npm run recalls -- import salesforce ./exports/campaign.csv --campaign=RECALL-2026-01 --actor="Coordinator" --json
```

The entire file validates and imports in one transaction. A bad date, conflicting vehicle, changed source row or duplicate affected vehicle rolls back the whole file. Identical source records are skipped even after local work advances. Changed history requires explicit reconciliation, not silent overwrites. The demo-shaped fixture is tests/fixtures/salesforce.csv and contains fictional records.

## Reconcile before switching

Compare affected counts, VINs, campaign boundaries, source statuses and a sample of evidence against Salesforce. Imported records stay imported, including a source status of Completed. Use /activate with reconciliation evidence, then assign the authorised dealer and record and verify remedy evidence where appropriate. Never treat migration as evidence of work performed.

Attachments, permissions, portal access, emails, existing contact logs, service appointments, telematics, warranties and finance records do not come through this CSV import. Plan those separately if required. Export all local records with /export; the JSON archive contains every domain entity and event. It is an archive, not a tested automated restore command.

Run both records in parallel until the coordinator signs off reconciliation. Retain the source export and signed comparison privately. Switch only the covered workflow; cancel Salesforce only after all remaining dependencies have been checked. Enterprise DNA maps the exports and brings the agreed history across as part of the custom implementation.
