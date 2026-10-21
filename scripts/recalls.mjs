import {getDb} from './lib/db.mjs';
import {run,COMMANDS} from './lib/recalls.mjs';
function output(v){
 if(!Array.isArray(v)){console.log(JSON.stringify(v,null,2));return;}
 if(!v.length){console.log('(none)');return;}
 if(v[0].question){for(const item of v){console.log('\n'+item.question);output(item.rows);}return;}
 const cell=x=>x==null?'':typeof x==='object'?JSON.stringify(x):String(x);
 const keys=Object.keys(v[0]),widths=keys.map(k=>Math.min(70,Math.max(k.length,...v.map(r=>cell(r[k]).length))));
 console.log(keys.map((k,i)=>k.replaceAll('_',' ').padEnd(widths[i])).join('  '));console.log(widths.map(n=>'-'.repeat(n)).join('  '));
 for(const r of v)console.log(keys.map((k,i)=>cell(r[k]).replace(/\n/g,' ').slice(0,widths[i]).padEnd(widths[i])).join('  '));
}
const args=[],o={};let db;
try{
 for(const x of process.argv.slice(2)){if(x.startsWith('--')){const i=x.indexOf('='),k=x.slice(2,i<0?undefined:i);if(Object.hasOwn(o,k))throw Error(`Duplicate flag --${k}`);o[k]=i<0?true:x.slice(i+1);}else args.push(x);}
 if(!args.length||o.help)console.log('Vehicle recall operations. Drafts only.\nCommands: '+COMMANDS.join(', ')+'\nUse --name=value. Full syntax in docs/cli.md.');
 else{db=await getDb();const result=await run(db,args.shift(),args,o);if(o.json)console.log(JSON.stringify(result,null,2));else output(result);}
}catch(e){if(o.json)console.log(JSON.stringify({error:e.message}));else console.error(e.message);process.exitCode=1;}finally{if(db)await db.close();}
