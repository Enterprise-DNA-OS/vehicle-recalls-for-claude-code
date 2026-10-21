# Recall record controls

Checked 21 October 2026. This is an administrative record system. The responsible supplier and its qualified advisers decide the recall scope, remedy, notification duties and closure. No command assesses defects, gives repair instructions, certifies safety or files anything.

| Check | Source and exact scope | Implementation |
|---|---|---|
| AU-NOTIFY and AU-LATE | [Australian vehicle recall guidance](https://www.vehiclerecalls.gov.au/guidance-suppliers-conducting-vehicle-recall): a supplier taking voluntary recall action for vehicles or components supplied in Australia must notify the department within two days. | Missing evidence is flagged immediately. A recorded notification after started_on + 2 calendar days is flagged for review. These date-only reminders do not calculate legal time limits. Record the actual start of recall action; do not use the date someone created this record. |
| REPORT-DUE | The same guidance requires progress reporting at a frequency agreed according to risk. | Flag the agreed report_due date, supplied by the operator. No invented fixed reporting interval. Record the submitted document reference and snapshot; no submission is made here. |
| Source and affected scope | [NZTA safety-related recalls](https://www.nzta.govt.nz/vehicles/choosing-the-right-vehicle/recalls-and-damaged-vehicles/safety-related-recalls) advises importers to check and clear recalls before arrival. | Every campaign requires an official source reference. Keep verified affected VINs and evidence; no automatic safety clearance or NZ notification deadline is inferred. |
| RECONCILE | Local control, not a legal rule. | Salesforce statuses remain history. A person must reconcile every imported case before operational use. No imported Complete status satisfies a remedy gate. |
| REMEDY-EVIDENCE | Local control, not a statutory certification. | Remedy evidence requires an assigned authorised dealer, a past performance date and a separate reviewer label. Completion records the reviewer decision, not a safety guarantee. |
| Closure | Local control, not regulator approval. | Every affected vehicle needs an accepted remedy record and complete state. AU campaigns need notification evidence. A closure reference records the responsible person's external decision. Imported cases block closure. |

Australian compulsory recalls have notice-specific directions. Consult that notice and record its dates with the responsible specialist; the voluntary two-day check does not apply to them. Overseas supply notification duties, serious-incident reporting and special campaigns need specialist handling. The checks cover only the records described above, not all legal obligations.

Actor names are labels, not authenticated identities or electronic signatures. A shared production installation needs verified identities, permissions, backups and a retention policy. Database owner access can change records. This is not a tamper-proof audit system. Owner Reference points to the protected customer system rather than copying addresses or personal narratives into drafts.

The CLI records evidence references, not uploaded attachments. Keep the original documents in your controlled document store. A missing flag is not proof of compliance.
