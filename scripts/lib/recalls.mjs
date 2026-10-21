import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {REPO_ROOT} from './db.mjs';
import {parseCsv,pick} from './csv.mjs';

export const TABLES=['campaigns','dealers','vehicles','recall_cases','contact_attempts','remedies','progress_reports','activity'];
export const READS={
 campaigns:'select code,owner,affected,complete,active,imported,overdue,report_due from campaign_summary order by code',
 vehicles:'select vin,model,owner_ref,region from vehicles order by vin',
 dealers:'select name,region,evidence_ref from dealers order by name',
 cases:'select campaign,vin,coordinator,dealer,state,due_on from case_work order by campaign,vin',
 'recall-triage':"select campaign,vin,coordinator,dealer,state,due_on from case_work where state<>'complete' order by due_on,vin",
 'contact-chase':"select campaign,vin,owner_ref,coordinator,last_contact,attempts from case_work where state not in ('complete','imported') and (last_contact is null or last_contact<current_date-7) order by last_contact nulls first,vin",
 'dealer-handoffs':"select campaign,vin,dealer,coordinator,state,appointment_on from case_work where state not in ('complete','imported') order by dealer nulls first,vin",
 'remedy-review':"select m.id,w.campaign,w.vin,w.dealer,m.performed_on,m.evidence_ref,m.recorded_by from remedies m join case_work w on w.id=m.case_id where decision='pending' order by m.performed_on,m.id",
 'report-due':"select code,jurisdiction,owner,report_due,affected,complete,active,imported from campaign_summary where state='open' and report_due<=current_date+7 order by report_due,code",
 attention:'select campaign,vin,coordinator,dealer,due_on,reason from attention_queue order by due_on,vin,reason',
 compliance:'select record,rule,issue,source from compliance_checks order by record,rule',
 activity:'select a.created_at,c.code as campaign,a.case_id,a.action,a.actor,a.reference from activity a join campaigns c on c.id=a.campaign_id order by a.created_at,a.id',
};
export const QUESTIONS=[
 ['Which coordinators have overdue affected vehicles?',"select coordinator,count(*)::int as overdue from case_work where state not in ('complete','imported') and due_on<current_date group by coordinator order by coordinator"],
 ['Which campaigns combine missing notification evidence with unresolved vehicles?',"select s.code,s.affected,s.active,s.imported from campaign_summary s join campaigns c on c.id=s.id where c.jurisdiction='AU' and c.kind='voluntary' and c.notification_on is null and s.affected>s.complete order by code"],
 ['Which dealers have missed appointments?',"select dealer,count(*)::int as missed from case_work where state='booked' and appointment_on<current_date group by dealer order by dealer"],
 ['Which vehicle owners have had no recorded contact?',"select campaign,vin,owner_ref,coordinator from case_work where last_contact is null and state not in ('complete','imported') order by campaign,vin"],
 ['Which campaigns have imported completed claims that remain unverified?',"select c.code,r.source_status,count(*)::int as records from recall_cases r join campaigns c on c.id=r.campaign_id where r.state='imported' group by c.code,r.source_status order by c.code,r.source_status"],
 ['Where is remedy evidence waiting on a separate reviewer?',READS['remedy-review']],
 ['Which regions have unresolved vehicles without a dealer?',"select region,campaign,count(*)::int as unresolved from case_work where dealer is null and state not in ('complete','imported') group by region,campaign order by region,campaign"],
 ['Which progress reports are due with unresolved vehicles?',"select code,report_due,active,imported from campaign_summary where state='open' and report_due<=current_date+7 and affected>complete order by report_due,code"],
 ['Which vehicles have repeated contact failures?',"select w.campaign,w.vin,count(*)::int as failures from contact_attempts a join case_work w on w.id=a.case_id where a.outcome in ('returned','wrong_contact','attempted') and w.state<>'complete' group by w.campaign,w.vin having count(*)>=2 order by w.campaign,w.vin"],
 ['Which vehicles appear in more than one unresolved campaign?',"select vin,count(*)::int as campaigns from case_work where state<>'complete' group by vin having count(*)>1 order by vin"],
];
const SPECS={
 ...Object.fromEntries(Object.keys(READS).map(k=>[k,[]])),
 insights:[],case:[],
 'add-campaign':['code','title','jurisdiction','kind','started','owner','source','report-due','actor'],
 'add-dealer':['name','region','evidence','actor'],
 'add-vehicle':['vin','model','owner-ref','region','actor'],
 'add-case':['campaign','vehicle','coordinator','due','actor'],
 activate:['coordinator','due','evidence','actor'],
 'assign-dealer':['dealer','evidence','actor'],
 'record-contact':['on','outcome','evidence','next-due','actor'],
 'schedule-remedy':['on','evidence','actor'],
 'record-remedy':['on','evidence','actor'],
 'verify-remedy':['decision','evidence','actor'],
 reopen:['due','evidence','actor'],
 notification:['on','evidence','actor'],
 'campaign-report':['on','next-due','evidence','actor'],
 'close-campaign':['evidence','actor'],
 log:['evidence','actor'],
 import:['campaign','dry-run','actor'],export:['file'],
 'weekly-review':[], 'draft-follow-up':[],
};
export const COMMANDS=Object.keys(SPECS);
const SINGLE=['case','activate','assign-dealer','record-contact','schedule-remedy','record-remedy','verify-remedy','reopen','notification','campaign-report','close-campaign','log','draft-follow-up'];
const today=()=>new Date().toISOString().slice(0,10);
function req(o,k){if(typeof o[k]!=='string'||!o[k].trim())throw Error(`Missing --${k}=value`);return o[k].trim();}
function date(v){if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v))||new Date(v).toISOString().slice(0,10)!==v)throw Error(`Invalid ISO date: ${v}`);return v;}
function past(v){date(v);if(v>today())throw Error('Event date cannot be in the future');return v;}
function choice(v,values){if(!values.includes(v))throw Error(`Expected one of ${values.join(', ')}`);return v;}
function vin(v){v=String(v).toUpperCase();if(!/^[A-HJ-NPR-Z0-9]{17}$/.test(v))throw Error('VIN must have 17 letters/digits excluding I, O and Q');return v;}
async function find(db,table,value,label,lock=false){
 if(!value)throw Error(`Missing ${table} reference`);
 const rows=await db.query(`select * from ${table} where id::text=$1 or lower(${label})=lower($1) order by id${lock?' for update':''}`,[value]);
 const found=rows.length?rows:await db.query(`select * from ${table} where starts_with(id::text,$1) or strpos(lower(${label}),lower($1))>0 order by id${lock?' for update':''}`,[value]);
 if(found.length!==1)throw Error(`${found.length?'Ambiguous':'Not found'} ${table}: ${value}${found.length?'\n'+found.map(x=>`${x.id}  ${x[label]}`).join('\n'):''}`);
 return found[0];
}
async function caseRow(db,id){
 const w=await find(db,'case_work',id,'vin');
 // All campaign writes acquire the campaign first, then the case, so closing cannot race an add or reopen.
 const c=await find(db,'campaigns',w.campaign_id,'code',true);
 const r=(await db.query('select * from recall_cases where id=$1 for update',[w.id]))[0];
 return {r,c,w};
}
function open(c){if(c.state!=='open')throw Error('Campaign is closed');}
function active(r){if(['complete','imported'].includes(r.state))throw Error('Case is not active; reconcile or reopen first');}
async function event(db,cid,rid,action,actor,reference){await db.query('insert into activity(campaign_id,case_id,action,actor,reference) values($1,$2,$3,$4,$5)',[cid,rid,action,actor,reference]);}
async function tx(db,fn,dry=false,readOnly=false){await db.exec(readOnly?'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY':'BEGIN');try{const v=await fn();await db.exec(dry?'ROLLBACK':'COMMIT');return v;}catch(e){await db.exec('ROLLBACK');throw e;}}
function saveDraft(name,body){const dir=path.resolve(process.env.OUTPUT_DIR||REPO_ROOT,'drafts');fs.mkdirSync(dir,{recursive:true,mode:0o700});const file=path.join(dir,`${name}-${randomUUID()}.md`);fs.writeFileSync(file,body,{mode:0o600,flag:'wx'});return {file};}

async function importCsv(db,file,o){
 const rows=parseCsv(fs.readFileSync(file,'utf8'));
 if(!rows.length)throw Error('Import contains no data rows');
 const records=rows.map((x,i)=>{
  const get=(...names)=>{const v=pick(x,...names).trim();if(!v)throw Error(`Row ${i+2}: missing ${names[0]}`);return v;};
  return {external:get('Case ID','Id'),vin:vin(get('VIN','Vehicle Identification Number')),model:get('Model','Vehicle Model'),owner:get('Owner Reference','Owner Ref'),region:get('Region'),coordinator:get('Coordinator','Case Owner'),due:date(get('Follow-up Date','Due Date')),status:get('Status')};
 });
 return tx(db,async()=>{
  const c=await find(db,'campaigns',req(o,'campaign'),'code',true);open(c);let inserted=0,skipped=0;
  for(const row of records)if(row.due<c.started_on)throw Error('Imported follow-up predates campaign');
  for(const row of records){
   const fingerprint=createHash('sha256').update(JSON.stringify({...row,campaign:c.id})).digest('hex');
   const old=(await db.query('select * from recall_cases where external_id=$1',[row.external]))[0];
   if(old){if(old.import_fingerprint!==fingerprint)throw Error(`Changed import ${row.external}; reconcile changes explicitly`);skipped++;continue;}
   let v=(await db.query('select * from vehicles where vin=$1',[row.vin]))[0];
   if(v){if(v.model!==row.model||v.owner_ref!==row.owner||v.region!==row.region)throw Error(`Vehicle details conflict for ${row.vin}`);}
   else [v]=await db.query('insert into vehicles(vin,model,owner_ref,region) values($1,$2,$3,$4) returning *',[row.vin,row.model,row.owner,row.region]);
   const [r]=await db.query("insert into recall_cases(campaign_id,vehicle_id,coordinator,due_on,state,external_id,source_status,import_fingerprint) values($1,$2,$3,$4,'imported',$5,$6,$7) returning *",[c.id,v.id,row.coordinator,row.due,row.external,row.status,fingerprint]);
   await event(db,c.id,r.id,'import',req(o,'actor'),`Salesforce ${row.external}; source status ${row.status}`);inserted++;
  }
  return {inserted,skipped,dry_run:!!o['dry-run'],state:'imported'};
 },!!o['dry-run']);
}

export async function run(db,cmd,args=[],o={}){
 if(!Object.hasOwn(SPECS,cmd))throw Error(`Unknown command ${cmd}; commands: ${COMMANDS.join(', ')}`);
 for(const k of Object.keys(o))if(k!=='json'&&!SPECS[cmd].includes(k))throw Error(`Unknown flag --${k}`);
 for(const k of ['json','dry-run'])if(o[k]!==undefined&&o[k]!==true)throw Error(`--${k} takes no value`);
 const arity=cmd==='import'?2:SINGLE.includes(cmd)?1:0;
 if(args.length!==arity)throw Error(`${cmd} requires ${arity} positional argument(s)`);
 if(SPECS[cmd].includes('actor'))req(o,'actor');
 if(READS[cmd])return db.query(READS[cmd]);
 if(cmd==='insights'){const out=[];for(const [question,sql]of QUESTIONS)out.push({question,rows:await db.query(sql)});return out;}
 if(cmd==='case'){
  const r=await find(db,'case_work',args[0],'vin');return {...r,contacts:await db.query('select * from contact_attempts where case_id=$1 order by contacted_on,id',[r.id]),remedies:await db.query('select * from remedies where case_id=$1 order by created_at,id',[r.id]),history:await db.query('select * from activity where case_id=$1 order by created_at,id',[r.id])};
 }
 if(cmd==='import'){if(args[0]!=='salesforce')throw Error('Import format must be salesforce');return importCsv(db,args[1],o);}
 if(cmd==='export')return tx(db,async()=>{
  const data={format:'vehicle-recalls-v1',exported_at:new Date().toISOString()},counts={};
  for(const t of TABLES){data[t]=await db.query(`select * from ${t} order by id`);counts[t]=data[t].length;}
  const file=path.resolve(req(o,'file'));fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n',{mode:0o600,flag:'wx'});return {file,counts};
 },false,true);
 if(cmd==='weekly-review')return tx(db,async()=>{let body='# Weekly recall handover\n\nInternal draft. Demo records are fictional. No regulatory submission.\n';for(const k of ['recall-triage','report-due','compliance'])body+=`\n## ${k}\n\n`+JSON.stringify(await db.query(READS[k]),null,2)+'\n';return saveDraft('weekly-review',body);},false,true);
 if(cmd==='draft-follow-up'){const r=await run(db,'case',args);return saveDraft('follow-up',`# Internal follow-up worksheet\n\nNot an owner notice or repair instruction. Use only the approved campaign wording after review. Nothing sends.\n\n${JSON.stringify(r,null,2)}\n`);}
 return tx(db,async()=>{
  const actor=req(o,'actor');
  if(cmd==='add-dealer')return (await db.query('insert into dealers(name,region,evidence_ref) values($1,$2,$3) returning *',[req(o,'name'),req(o,'region'),req(o,'evidence')]))[0];
  if(cmd==='add-vehicle')return (await db.query('insert into vehicles(vin,model,owner_ref,region) values($1,$2,$3,$4) returning *',[vin(req(o,'vin')),req(o,'model'),req(o,'owner-ref'),req(o,'region')]))[0];
  if(cmd==='add-campaign'){
   const started=past(req(o,'started')),due=date(req(o,'report-due'));
   const [c]=await db.query('insert into campaigns(code,title,jurisdiction,kind,started_on,owner,source_ref,report_due) values($1,$2,$3,$4,$5,$6,$7,$8) returning *',[req(o,'code'),req(o,'title'),choice(req(o,'jurisdiction'),['AU','NZ']),choice(req(o,'kind'),['voluntary','compulsory']),started,req(o,'owner'),req(o,'source'),due]);
   await event(db,c.id,null,cmd,actor,c.source_ref);return c;
  }
  if(cmd==='add-case'){
   const c=await find(db,'campaigns',req(o,'campaign'),'code',true);open(c);
   const v=await find(db,'vehicles',req(o,'vehicle'),'vin');const due=date(req(o,'due'));if(due<c.started_on)throw Error('Follow-up predates campaign');
   const [r]=await db.query('insert into recall_cases(campaign_id,vehicle_id,coordinator,due_on) values($1,$2,$3,$4) returning *',[c.id,v.id,req(o,'coordinator'),due]);await event(db,c.id,r.id,cmd,actor,c.source_ref);return r;
  }
  if(['notification','campaign-report','close-campaign'].includes(cmd)){
   const c=await find(db,'campaigns',args[0],'code',true);open(c);const evidence=req(o,'evidence');
   if(cmd==='notification'){
    const on=past(req(o,'on'));if(c.notification_ref)throw Error('Notification already recorded; preserve original evidence');
    await db.query('update campaigns set notification_on=$1,notification_ref=$2 where id=$3',[on,evidence,c.id]);
   }
   if(cmd==='campaign-report'){
    const on=past(req(o,'on')),next=date(req(o,'next-due'));if(on<c.started_on||next<=on)throw Error('Report dates are out of order');
    const last=(await db.query('select max(reported_on) as last from progress_reports where campaign_id=$1',[c.id]))[0].last;if(last&&on<last)throw Error('Report predates latest report');
    const snapshot=(await db.query('select * from campaign_summary where id=$1',[c.id]))[0];
    await db.query('insert into progress_reports(campaign_id,reported_on,reference,actor,snapshot) values($1,$2,$3,$4,$5)',[c.id,on,evidence,actor,JSON.stringify(snapshot)]);
    await db.query('update campaigns set report_due=$1 where id=$2',[next,c.id]);
   }
   if(cmd==='close-campaign'){
    const [s]=await db.query('select * from campaign_summary where id=$1',[c.id]);
    if(!s.affected||s.affected!==s.complete)throw Error('All affected vehicles must have verified remedy evidence');
    if((await db.query("select 1 from recall_cases r where campaign_id=$1 and not exists(select 1 from remedies m where m.case_id=r.id and m.decision='accepted')",[c.id])).length)throw Error('Accepted remedy evidence missing');
    if(c.jurisdiction==='AU'&&!c.notification_ref)throw Error('AU notification evidence required');
    await db.query("update campaigns set state='closed',closure_ref=$1 where id=$2",[evidence,c.id]);
   }
   await event(db,c.id,null,cmd,actor,evidence);return (await db.query('select * from campaigns where id=$1',[c.id]))[0];
  }
  if(cmd==='verify-remedy'){
   const m=await find(db,'remedies',args[0],'evidence_ref');const {r,c}=await caseRow(db,m.case_id);open(c);active(r);
   const current=(await db.query('select * from remedies where id=$1 for update',[m.id]))[0];
   if(current.decision!=='pending'||r.state!=='awaiting_verification')throw Error('Only pending remedy evidence can be verified');
   if(current.recorded_by.toLowerCase()===actor.toLowerCase())throw Error('Independent verifier required');
   const decision=choice(req(o,'decision'),['accepted','rejected']),evidence=req(o,'evidence');
   await db.query('update remedies set decision=$1,verified_by=$2,verification_ref=$3 where id=$4',[decision,actor,evidence,m.id]);
   await db.query('update recall_cases set state=$1,appointment_on=null where id=$2',[decision==='accepted'?'complete':'open',r.id]);
   await event(db,c.id,r.id,cmd,actor,evidence);return {id:m.id,decision,case_id:r.id};
  }
  const {r,c}=await caseRow(db,args[0]);open(c);const evidence=req(o,'evidence');
  if(cmd==='activate'){
   if(r.state!=='imported')throw Error('Only imported cases can be activated');const due=date(req(o,'due'));if(due<c.started_on)throw Error('Follow-up predates campaign');
   await db.query("update recall_cases set state='open',coordinator=$1,due_on=$2,reconciliation_ref=$3 where id=$4",[req(o,'coordinator'),due,evidence,r.id]);
  }else if(cmd==='reopen'){
   if(r.state!=='complete')throw Error('Only complete cases can be reopened');const due=date(req(o,'due'));if(due<c.started_on)throw Error('Follow-up predates campaign');
   await db.query("update recall_cases set state='open',due_on=$1,appointment_on=null where id=$2",[due,r.id]);
  }else{
   active(r);
   if(cmd==='assign-dealer'){
    if(r.state==='awaiting_verification')throw Error('Verify or reject pending evidence before changing dealer');
    const d=await find(db,'dealers',req(o,'dealer'),'name');await db.query("update recall_cases set dealer_id=$1,state='open',appointment_on=null where id=$2",[d.id,r.id]);
   }
   if(cmd==='record-contact'){
    const on=past(req(o,'on')),due=date(req(o,'next-due'));if(on<c.started_on||due<on)throw Error('Contact dates are out of order');
    await db.query('insert into contact_attempts(case_id,contacted_on,outcome,reference,actor) values($1,$2,$3,$4,$5)',[r.id,on,choice(req(o,'outcome'),['attempted','reached','returned','wrong_contact']),evidence,actor]);
    await db.query('update recall_cases set due_on=$1 where id=$2',[due,r.id]);
   }
   if(cmd==='schedule-remedy'){
    if(r.state==='awaiting_verification')throw Error('Verify or reject pending evidence before scheduling');if(!r.dealer_id)throw Error('Assign an authorised dealer first');
    const on=date(req(o,'on'));if(on<today())throw Error('New appointment must not be in the past');
    await db.query("update recall_cases set state='booked',appointment_on=$1 where id=$2",[on,r.id]);
   }
   if(cmd==='record-remedy'){
    if(!r.dealer_id)throw Error('Assign an authorised dealer first');const on=past(req(o,'on'));if(on<c.started_on)throw Error('Remedy predates campaign');
    const [m]=await db.query('insert into remedies(case_id,dealer_id,performed_on,evidence_ref,recorded_by) values($1,$2,$3,$4,$5) returning *',[r.id,r.dealer_id,on,evidence,actor]);
    await db.query("update recall_cases set state='awaiting_verification' where id=$1",[r.id]);await event(db,c.id,r.id,cmd,actor,evidence);return m;
   }
  }
  await event(db,c.id,r.id,cmd,actor,evidence);return (await db.query('select * from recall_cases where id=$1',[r.id]))[0];
 });
}
