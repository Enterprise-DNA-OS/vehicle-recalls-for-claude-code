create function touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create table campaigns (
 id uuid primary key default gen_random_uuid(), code text not null unique check(btrim(code)<>''), title text not null check(btrim(title)<>''),
 jurisdiction text not null check(jurisdiction in ('AU','NZ')), kind text not null check(kind in ('voluntary','compulsory')),
 started_on date not null, owner text not null check(btrim(owner)<>''), source_ref text not null check(btrim(source_ref)<>''),
 notification_on date, notification_ref text, report_due date not null, state text not null default 'open' check(state in ('open','closed')),
 closure_ref text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(notification_on is null or notification_on>=started_on),
 check((notification_on is null)=(notification_ref is null)),
 check(notification_ref is null or btrim(notification_ref)<>''), check(report_due>=started_on),
 check(state<>'closed' or nullif(btrim(closure_ref),'') is not null)
);
create unique index campaigns_code_lower on campaigns(lower(code));
create table dealers (
 id uuid primary key default gen_random_uuid(), name text not null check(btrim(name)<>''), region text not null check(btrim(region)<>''),
 evidence_ref text not null check(btrim(evidence_ref)<>''), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index dealers_name_lower on dealers(lower(name));
create table vehicles (
 id uuid primary key default gen_random_uuid(), vin text not null unique check(vin ~ '^[A-HJ-NPR-Z0-9]{17}$'), model text not null check(btrim(model)<>''),
 owner_ref text not null check(btrim(owner_ref)<>''), region text not null check(btrim(region)<>''),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table recall_cases (
 id uuid primary key default gen_random_uuid(), campaign_id uuid not null references campaigns, vehicle_id uuid not null references vehicles,
 dealer_id uuid references dealers, coordinator text not null check(btrim(coordinator)<>''), due_on date not null,
 state text not null default 'open' check(state in ('imported','open','booked','awaiting_verification','complete')),
 appointment_on date, reconciliation_ref text, external_id text unique, source_status text, import_fingerprint text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(campaign_id,vehicle_id),
 check(state<>'booked' or (appointment_on is not null and dealer_id is not null))
);
create index cases_campaign on recall_cases(campaign_id);
create index cases_vehicle on recall_cases(vehicle_id);
create index cases_dealer on recall_cases(dealer_id);
create index cases_due_open on recall_cases(due_on) where state<>'complete';
create table contact_attempts (
 id uuid primary key default gen_random_uuid(), case_id uuid not null references recall_cases, contacted_on date not null,
 outcome text not null check(outcome in ('attempted','reached','returned','wrong_contact')), reference text not null check(btrim(reference)<>''),
 actor text not null check(btrim(actor)<>''), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index contacts_case on contact_attempts(case_id,contacted_on);
create table remedies (
 id uuid primary key default gen_random_uuid(), case_id uuid not null references recall_cases, dealer_id uuid not null references dealers,
 performed_on date not null, evidence_ref text not null check(btrim(evidence_ref)<>''), recorded_by text not null check(btrim(recorded_by)<>''),
 decision text not null default 'pending' check(decision in ('pending','accepted','rejected')), verified_by text, verification_ref text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(decision='pending' or (nullif(btrim(verified_by),'') is not null and nullif(btrim(verification_ref),'') is not null and lower(btrim(verified_by))<>lower(btrim(recorded_by))))
);
create index remedies_case on remedies(case_id);
create index remedies_dealer on remedies(dealer_id);
create unique index one_pending_remedy on remedies(case_id) where decision='pending';
create table progress_reports (
 id uuid primary key default gen_random_uuid(), campaign_id uuid not null references campaigns, reported_on date not null,
 reference text not null check(btrim(reference)<>''), actor text not null check(btrim(actor)<>''), snapshot jsonb not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index reports_campaign on progress_reports(campaign_id);
create table activity (
 id uuid primary key default gen_random_uuid(), case_id uuid references recall_cases, campaign_id uuid not null references campaigns,
 action text not null, actor text not null check(btrim(actor)<>''), reference text not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index activity_case on activity(case_id);
create index activity_campaign on activity(campaign_id);
do $$ declare t text; begin
 foreach t in array array['campaigns','dealers','vehicles','recall_cases','contact_attempts','remedies','progress_reports','activity'] loop
 execute format('create trigger %I before update on %I for each row execute function touch_updated_at()',t||'_updated',t);
 execute format('alter table %I enable row level security',t);
 execute format('revoke all on %I from public',t);
 end loop;
end $$;
create view case_work with (security_invoker=true) as
select r.id,r.campaign_id,r.vehicle_id,c.code as campaign,v.vin,v.model,v.owner_ref,v.region,r.coordinator,
 d.name as dealer,r.state,r.due_on,r.appointment_on,
 (select max(contacted_on) from contact_attempts a where a.case_id=r.id) as last_contact,
 (select count(*)::int from contact_attempts a where a.case_id=r.id) as attempts,
 (select count(*)::int from remedies e where e.case_id=r.id and e.decision='pending') as pending_evidence
from recall_cases r join campaigns c on c.id=r.campaign_id join vehicles v on v.id=r.vehicle_id left join dealers d on d.id=r.dealer_id;
create view campaign_summary with (security_invoker=true) as
select c.id,c.code,c.title,c.jurisdiction,c.kind,c.owner,c.state,c.started_on,c.report_due,c.notification_on,
 count(r.id)::int as affected,count(r.id) filter(where r.state='complete')::int as complete,
 count(r.id) filter(where r.state='imported')::int as imported,
 count(r.id) filter(where r.state not in ('complete','imported'))::int as active,
 count(r.id) filter(where r.state<>'complete' and r.due_on<current_date)::int as overdue
from campaigns c left join recall_cases r on c.id=r.campaign_id group by c.id;
create view attention_queue with (security_invoker=true) as
select id,campaign,vin,coordinator,dealer,due_on,'overdue follow-up'::text as reason from case_work where state not in ('complete','imported') and due_on<current_date
union all select id,campaign,vin,coordinator,dealer,due_on,'unreconciled import' from case_work where state='imported'
union all select id,campaign,vin,coordinator,dealer,due_on,'no contact recorded' from case_work where state not in ('complete','imported') and last_contact is null
union all select id,campaign,vin,coordinator,dealer,due_on,'dealer not assigned' from case_work where state not in ('complete','imported') and dealer is null
union all select id,campaign,vin,coordinator,dealer,due_on,'appointment missed' from case_work where state='booked' and appointment_on<current_date
union all select id,campaign,vin,coordinator,dealer,due_on,'remedy evidence awaits verification' from case_work where pending_evidence>0;
create view compliance_checks with (security_invoker=true) as
select id,code as record,'AU-NOTIFY'::text as rule,'Missing voluntary recall notification evidence; review the two-day duty now'::text as issue,
 'https://www.vehiclerecalls.gov.au/guidance-suppliers-conducting-vehicle-recall'::text as source
from campaigns where jurisdiction='AU' and kind='voluntary' and notification_on is null
union all select id,code,'AU-LATE','Recorded notification is after the date-based two-day reminder; specialist must assess timing',
 'https://www.vehiclerecalls.gov.au/guidance-suppliers-conducting-vehicle-recall'
from campaigns where jurisdiction='AU' and kind='voluntary' and notification_on>started_on+2
union all select id,code,'REPORT-DUE','Agreed progress report date has passed',
 'https://www.vehiclerecalls.gov.au/guidance-suppliers-conducting-vehicle-recall'
from campaigns where jurisdiction='AU' and state='open' and report_due<current_date
union all select id,campaign||' / '||vin,'RECONCILE','Imported status is historical until a person reconciles evidence','Local control: docs/compliance.md'
from case_work where state='imported'
union all select r.id,c.code||' / '||v.vin,'REMEDY-EVIDENCE','Completed record has no accepted remedy evidence','Local control: docs/compliance.md'
from recall_cases r join campaigns c on c.id=r.campaign_id join vehicles v on v.id=r.vehicle_id where r.state='complete'
 and not exists(select 1 from remedies m where m.case_id=r.id and m.decision='accepted');
revoke all on case_work,campaign_summary,attention_queue,compliance_checks from public;
