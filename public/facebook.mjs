// The original Facebook SDK mechanics, separated so requests can be regression-tested.
export function fbCall(FB,path,method='GET',params={}) {
 return new Promise((resolve,reject)=>FB.api(path,method,params,result=>{
  if(!result||result.error)reject(new Error(result?.error?.message||'Facebook did not return a response.'));
  else resolve(result);
 }));
}
export async function fetchPages(FB) {
 const pages=[];let after;
 do {
  const result=await fbCall(FB,'/me/accounts','GET',{fields:'id,name,access_token,tasks',limit:100,...(after?{after}:{})});
  pages.push(...(result.data||[]).filter(p=>p.id&&p.name&&p.access_token));
  const next=result.paging?.next ? result.paging?.cursors?.after : undefined;
  if(!next||next===after)break;after=next;
 }while(true);
 return pages;
}
export async function publishToPage(FB,{pageId,accessToken,content,imageUrl}) {
 if(!/^\d+$/.test(pageId||'')||!accessToken||!content?.trim())throw Error('Choose a Page and add your post text.');
 if(imageUrl&&!/^https:\/\//i.test(imageUrl))throw Error('Wait for the photo upload to finish before publishing.');
 const path=`/${pageId}/${imageUrl?'photos':'feed'}`;
 const params=imageUrl?{url:imageUrl,caption:content,access_token:accessToken,published:true}:{message:content,access_token:accessToken};
 const result=await fbCall(FB,path,'POST',params);
 const id=result.post_id||result.id;
 if(!id)throw Error('Facebook did not confirm the post. Check your Page before trying again.');
 return {id,url:`https://www.facebook.com/${encodeURIComponent(id)}`};
}
