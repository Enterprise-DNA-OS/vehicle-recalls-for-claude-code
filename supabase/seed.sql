begin;
insert into campaigns(id,code,title,jurisdiction,kind,started_on,owner,source_ref,report_due,notification_on,notification_ref) values
('10000000-0000-4000-8000-000000000001','DEMO-AU-01','Fictional latch campaign','AU','voluntary',current_date-25,'Mia Chen','demo://approved-campaign-a',current_date-2,current_date-24,'demo://rover-receipt-a'),
('10000000-0000-4000-8000-000000000002','DEMO-AU-02','Fictional sensor campaign','AU','voluntary',current_date-5,'Noah Reed','demo://approved-campaign-b',current_date+7,null,null),
('10000000-0000-4000-8000-000000000003','DEMO-NZ-01','Fictional bracket campaign','NZ','voluntary',current_date-12,'Mia Chen','demo://approved-campaign-c',current_date+10,null,null)
on conflict do nothing;
insert into dealers(id,name,region,evidence_ref) values
('20000000-0000-4000-8000-000000000001','Demo Harbour Service','Auckland','demo://dealer-authority-1'),
('20000000-0000-4000-8000-000000000002','Demo Harbour West','Sydney','demo://dealer-authority-2'),
('20000000-0000-4000-8000-000000000003','Demo Southern Service','Melbourne','demo://dealer-authority-3') on conflict do nothing;
insert into vehicles(id,vin,model,owner_ref,region)
select ('30000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid,'TST0000000000000'||n,'Demo Van '||n,'demo://owner-'||n,case when n>4 then 'Auckland' else 'Sydney' end from generate_series(1,6) n on conflict do nothing;
insert into recall_cases(id,campaign_id,vehicle_id,dealer_id,coordinator,due_on,state,appointment_on,external_id,source_status,import_fingerprint) values
('40000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002','Mia Chen',current_date-4,'booked',current_date-2,null,null,null),
('40000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000002',null,'Mia Chen',current_date-3,'open',null,null,null,null),
('40000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000003','Noah Reed',current_date+3,'awaiting_verification',null,null,null,null),
('40000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000004',null,'Noah Reed',current_date+5,'imported',null,'DEMO-IMPORTED','Completed','demo'),
('40000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000001','Mia Chen',current_date+5,'complete',null,null,null,null),
('40000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000006','20000000-0000-4000-8000-000000000001','Noah Reed',current_date+3,'open',null,null,null,null)
on conflict do nothing;
insert into contact_attempts(id,case_id,contacted_on,outcome,reference,actor) values
('50000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001',current_date-10,'reached','demo://call-1','Mia Chen'),
('50000000-0000-4000-8000-000000000002','40000000-0000-4000-8000-000000000003',current_date-3,'reached','demo://call-2','Noah Reed'),
('50000000-0000-4000-8000-000000000003','40000000-0000-4000-8000-000000000005',current_date-7,'reached','demo://call-3','Mia Chen') on conflict do nothing;
insert into remedies(id,case_id,dealer_id,performed_on,evidence_ref,recorded_by,decision,verified_by,verification_ref) values
('60000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000003',current_date-1,'demo://workshop-evidence-1','Noah Reed','pending',null,null),
('60000000-0000-4000-8000-000000000002','40000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000001',current_date-2,'demo://workshop-evidence-2','Mia Chen','accepted','Ari Patel','demo://verification-2') on conflict do nothing;
commit;
