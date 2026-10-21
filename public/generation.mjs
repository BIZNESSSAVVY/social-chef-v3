import {templateCandidates} from './template-library.mjs';
import {generateOriginalPost} from './original-templates.mjs';
const HISTORY_KEY='social-chef-caption-rotation-v1';
const normalized=text=>text.normalize('NFKC').replace(/\s+/g,' ').trim().toLowerCase();
export function createTemplateEngine({storage,random=Math.random}={}) {
 let memory=[],storageFailed=false;
 function read(){if(storageFailed)return memory;try{const value=JSON.parse(storage?.getItem(HISTORY_KEY)||'null');if(Array.isArray(value))return value.filter(x=>x&&typeof x.id==='string'&&typeof x.text==='string').slice(-30);}catch{storageFailed=true;}return memory;}
 function remember(content,id){memory=[...read(),{id,text:normalized(content)}].slice(-30);try{if(!storageFailed)storage?.setItem(HISTORY_KEY,JSON.stringify(memory));}catch{storageFailed=true;} }
 function seen(content){return read().some(x=>x.text===normalized(content));}
 function generate(data){
  let candidates=templateCandidates(data);
  const foodCategories=['Daily Special','Lunch Special','Dinner Special','New Menu Item',"Chef's Recommendation",'Customer Favorite','Seasonal Dish','Dessert','Taco Tuesday','Weekend Brunch','Breakfast','Happy Hour','Weekend Special','Date Night','Family Meal','Game Day','Takeout','Online Ordering','Catering','Holiday','Celebration','Food Truck Stop'];
  if(data.originalStyle&&foodCategories.includes(data.category)&&['friendly','playful','bold','classic','trendy'].includes(data.tone)){
   candidates=[...candidates,...[0,1,2].map(i=>({id:`original:${data.tone}:${i}`,render:()=>{let text=generateOriginalPost(data.category,data.description,data.tone,i);if(data.length==='short')text=text.split('\n\n').slice(0,2).join('\n\n');if(data.emojis===false)text=text.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'').replace(/ +\n/g,'\n').trim();if(data.hashtags===false)text=text.replace(/(?:^|\s)#[\p{L}\p{N}_]+/gu,'').trim();return [text,data.restaurant?.trim(),data.cta?.trim(),data.link?.trim()].filter(Boolean).join('\n\n');}}))];
  }
  const history=read();const used=new Set(history.map(x=>x.id));const texts=new Set(history.map(x=>x.text));
  const available=candidates.filter(c=>!used.has(c.id)&&!texts.has(normalized(c.render())));
  if(!available.length)throw Error('No fresh template is available. Try another post style.');
  const selected=available[Math.min(available.length-1,Math.max(0,Math.floor(random()*available.length)))];
  const content=selected.render();remember(content,selected.id);return {content,source:'Template library',templateId:selected.id};
 }
 return {generate,seen,remember};
}
function browserStorage(){try{return globalThis.localStorage;}catch{return undefined;}}
const defaultEngine=createTemplateEngine({storage:browserStorage()});
export function generateFallbackPost(category,description,tone,options={}){return defaultEngine.generate({category,description,tone,...options}).content;}
export function createCaptionGenerator({fetchImpl=globalThis.fetch,timeoutMs=5000,now=Date.now,storage=browserStorage(),random=Math.random}={}) {
 let successes=[],retryAfter=0;
 const engine=createTemplateEngine({storage,random});
 return async function generateCaption(data,url) {
  const time=now();successes=successes.filter(t=>time-t<60000);
  const fallback=()=>{const result=engine.generate(data);return {content:result.content,source:result.source};};
  if(data.mode==='instant'||successes.length>=3||time<retryAfter)return fallback();
  const controller=new AbortController();let timer;
  try {
   const request=(async()=>{
    const res=await fetchImpl(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:controller.signal});
    if(!res.ok)throw Error('AI request failed.');
    const result=await res.json();const content=result.post||result.content;
    if(typeof content!=='string'||!content.trim())throw Error('Empty AI post.');
    return content.trim();
   })();
   const deadline=new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('AI wait exceeded.'));},timeoutMs);});
   const content=await Promise.race([request,deadline]);successes.push(now());
   if(engine.seen(content))return fallback();
   engine.remember(content,'ai:'+now());return {content,source:'AI draft'};
  }catch{
   retryAfter=now()+60000;return fallback();
  }finally{clearTimeout(timer);}
 };
}
