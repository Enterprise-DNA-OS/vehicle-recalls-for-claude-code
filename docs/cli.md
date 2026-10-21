# CLI reference

Node 20+. Run `npm run recalls -- <command>` or `node scripts/recalls.mjs <command>`. Every command accepts `--json`. Flags use `--name=value`; unknown flags, duplicate flags and extra positional arguments fail. Names match case-insensitively; IDs accept unique prefixes. Ambiguous references list candidates and exit 1.

Actor labels identify what the operator records. They are not login credentials. All date inputs use ISO YYYY-MM-DD. Evidence values are references to documents or actions that already exist.

## campaigns

Read campaign totals and reporting dates

```bash
npm run recalls -- campaigns
```



## vehicles

Read the affected vehicle register

```bash
npm run recalls -- vehicles
```



## dealers

Read authorised dealer references

```bash
npm run recalls -- dealers
```



## cases

Read affected cases and their status

```bash
npm run recalls -- cases
```



## case

Read one vehicle case, evidence and contact history

```bash
npm run recalls -- case <case-id-or-vin>
```



## recall-triage

Triage unresolved affected vehicles

```bash
npm run recalls -- recall-triage
```



## contact-chase

Find vehicle owners needing a follow-up

```bash
npm run recalls -- contact-chase
```



## dealer-handoffs

Review dealer assignments and appointments

```bash
npm run recalls -- dealer-handoffs
```



## remedy-review

Review evidence waiting for an independent verifier

```bash
npm run recalls -- remedy-review
```



## report-due

Check agreed campaign report dates

```bash
npm run recalls -- report-due
```



## attention

Find overdue, unassigned and unreconciled work

```bash
npm run recalls -- attention
```



## compliance

Check evidence and cited recall record rules

```bash
npm run recalls -- compliance
```

Read docs/compliance.md. Report which check failed and its source. A clean check does not certify safety or legal compliance.

## activity

Read the recorded activity history

```bash
npm run recalls -- activity
```



## insights

Answer ten cross-record questions

```bash
npm run recalls -- insights
```



## add-campaign

Register an approved recall campaign

```bash
npm run recalls -- add-campaign --code=<code> --title="<title>" --jurisdiction=AU --kind=voluntary --started=YYYY-MM-DD --owner="<owner>" --source="<official-reference>" --report-due=YYYY-MM-DD --actor="<operator>"
```

Jurisdiction: AU or NZ. Kind: voluntary or compulsory. Copy the official source and actual recall-action start date. The specialist supplies agreed report dates.

## add-dealer

Record an authorised dealer and supporting reference

```bash
npm run recalls -- add-dealer --name="<name>" --region="<region>" --evidence="<authorisation-reference>" --actor="<operator>"
```



## add-vehicle

Register a verified affected vehicle

```bash
npm run recalls -- add-vehicle --vin=<vin> --model="<model>" --owner-ref="<protected-owner-reference>" --region="<region>" --actor="<operator>"
```



## add-case

Link a verified affected vehicle to a campaign

```bash
npm run recalls -- add-case --campaign=<code> --vehicle=<vin> --coordinator="<owner>" --due=YYYY-MM-DD --actor="<operator>"
```



## activate

Reconcile an imported record into active work

```bash
npm run recalls -- activate <case-id> --coordinator="<owner>" --due=YYYY-MM-DD --evidence="<reconciliation-reference>" --actor="<operator>"
```



## assign-dealer

Assign an authorised dealer with handoff evidence

```bash
npm run recalls -- assign-dealer <case-id> --dealer="<name>" --evidence="<handoff-reference>" --actor="<operator>"
```



## record-contact

Record a contact that already happened

```bash
npm run recalls -- record-contact <case-id> --on=YYYY-MM-DD --outcome=reached --evidence="<contact-reference>" --next-due=YYYY-MM-DD --actor="<operator>"
```

Outcomes: attempted, reached, returned, wrong_contact. This records an event; it sends nothing.

## schedule-remedy

Record an appointment agreed with the dealer

```bash
npm run recalls -- schedule-remedy <case-id> --on=YYYY-MM-DD --evidence="<booking-reference>" --actor="<operator>"
```



## record-remedy

Record a dealer supplied remedy evidence reference

```bash
npm run recalls -- record-remedy <case-id> --on=YYYY-MM-DD --evidence="<workshop-reference>" --actor="<operator>"
```



## verify-remedy

Record the separate reviewers evidence decision

```bash
npm run recalls -- verify-remedy <remedy-id> --decision=accepted --evidence="<review-reference>" --actor="<reviewer>"
```

Accepted and rejected are the only decisions. Ask the authorised reviewer for the actual decision and evidence. Never verify your own prepared record or infer approval.

## reopen

Reopen completed work after an authorised review

```bash
npm run recalls -- reopen <case-id> --due=YYYY-MM-DD --evidence="<review-reference>" --actor="<operator>"
```



## notification

Record an official notification already submitted

```bash
npm run recalls -- notification <campaign-code> --on=YYYY-MM-DD --evidence="<receipt-reference>" --actor="<operator>"
```

 Nothing sends or files from this tool. Read the history first. External authority and approved wording remain with the supplier.

## campaign-report

Record a submitted progress report and next agreed date

```bash
npm run recalls -- campaign-report <campaign-code> --on=YYYY-MM-DD --next-due=YYYY-MM-DD --evidence="<receipt-reference>" --actor="<operator>"
```

 Nothing sends or files from this tool. Read the history first. External authority and approved wording remain with the supplier.

## close-campaign

Record an authorised campaign closure decision

```bash
npm run recalls -- close-campaign <campaign-code> --evidence="<external-closure-reference>" --actor="<operator>"
```

 Nothing sends or files from this tool. Read the history first. External authority and approved wording remain with the supplier.

## log

Record a follow-up reference

```bash
npm run recalls -- log <case-id> --evidence="<reference>" --actor="<operator>"
```



## import

Import one configured Salesforce campaign report

```bash
npm run recalls -- import salesforce <file.csv> --campaign=<code> --actor="<operator>" --dry-run
```

Read docs/replace-salesforce-automotive-cloud.md. Run the dry run, compare counts and rows, then remove --dry-run only when the import is authorised. Source Completed stays imported. Never invent mappings or evidence.

## export

Archive every domain record to a new private file

```bash
npm run recalls -- export --file=exports/<unique-name>.json
```



## weekly-review

Draft the Monday recall handover from three live reads

```bash
npm run recalls -- weekly-review
```

The command reads recall-triage, report-due and compliance and writes a private draft. Present the urgent vehicles, next reporting dates and evidence gaps with their owners. Never send the report.

## draft-follow-up

Draft an internal follow-up worksheet from the full history

```bash
npm run recalls -- draft-follow-up <case-id>
```

 Nothing sends or files from this tool. Read the history first. External authority and approved wording remain with the supplier.
