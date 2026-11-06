(() => {
'use strict';
const key='little-by-little.tasks.v1', backupKey=key+'.unreadable-backup';
const form=document.querySelector('#form'), input=document.querySelector('#input'), list=document.querySelector('#tasks'), empty=document.querySelector('#empty'), stage=document.querySelector('.stage'), count=document.querySelector('#count'), status=document.querySelector('#status'), feedback=document.querySelector('#feedback'), storage=document.querySelector('#storage'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
let tasks=[], serial=0, raw=null, stageAnimation=null, scrollFrame=0;
const exits=new Set(), visibleExits=new Set(), timers=new Map();
const liveRows='.task:not(.exiting)';
try {
 raw=localStorage.getItem(key);
 if(raw!==null) {
  const data=JSON.parse(raw);
  if(!Array.isArray(data)||!data.every(t=>t&&typeof t.id==='string'&&typeof t.text==='string'&&t.text.trim()&&typeof t.done==='boolean')||new Set(data.map(t=>t.id)).size!==data.length) throw Error('Invalid data');
  tasks=data;
 }
} catch(_){
 try {if(raw!==null&&localStorage.getItem(backupKey)===null)localStorage.setItem(backupKey,raw);}catch(_){}
 storage.textContent='Saved list unavailable. You can still use this list.';
}
function save(){try{localStorage.setItem(key,JSON.stringify(tasks));storage.textContent='Saved on this device';}catch(_){storage.textContent='Storage unavailable. This list lasts until you leave.';}}
function motion(el,frames,options){if(!reduced.matches&&el.animate)return el.animate(frames,options);return null;}
function cancel(el){el.getAnimations().forEach(a=>a.cancel());}
function cleanup(li){(timers.get(li)||[]).forEach(clearTimeout);timers.delete(li);exits.delete(li);visibleExits.delete(li);li.remove();summary();}
function summary(){
 const done=tasks.filter(t=>t.done).length;count.textContent=tasks.length?done+' of '+tasks.length+' done':'A fresh start';
 const hideEmpty=tasks.length>0||visibleExits.size>0;
 empty.classList.toggle('absent',hideEmpty);empty.setAttribute('aria-hidden',String(hideEmpty));
}
function stageLayout(from, deleting=false){
 if(stageAnimation){stageAnimation.cancel();stageAnimation=null;}
 const target=tasks.length?[...list.querySelectorAll(liveRows+' > .row')].reduce((sum,r)=>sum+r.offsetHeight,0):empty.offsetHeight;
 if(from===undefined||reduced.matches){stage.style.height=tasks.length?'auto':target+'px';return;}
 stage.style.height=target+'px';
 const animation=motion(stage,[{height:from+'px'},{height:target+'px'}],{duration:deleting?180:420,delay:deleting?240:0,fill:'backwards',easing:'cubic-bezier(.22,.8,.2,1)'});
 stageAnimation=animation;
 if(animation)animation.finished.then(()=>{
  if(stageAnimation===animation){stageAnimation=null;stage.style.height=tasks.length?'auto':empty.offsetHeight+'px';}
 },()=>{});
}
function reveal(li,delay=0){
 const height=li.firstElementChild.offsetHeight;
 motion(li,[{height:'0px'},{height:height+'px'}],{duration:420,delay,easing:'cubic-bezier(.22,.8,.2,1)'});
 motion(li.firstElementChild,[{opacity:0,transform:'translateX(-18px) rotate(-1deg)',clipPath:'inset(0 100% 0 0)'},{opacity:1,transform:'none',clipPath:'inset(0 0% 0 0)'}],{duration:300,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
}
function row(task){
 const li=document.createElement('li');li.className='task'+(task.done?' done':'');li.dataset.id=task.id;
 const inner=document.createElement('div');inner.className='row';
 const wrap=document.createElement('span');wrap.className='check-wrap';
 const check=document.createElement('input');check.type='checkbox';check.checked=task.done;check.id='task-'+task.id;
 const art=document.createElement('span');art.className='check-art';art.setAttribute('aria-hidden','true');
 art.innerHTML='<svg viewBox="0 0 24 24"><path class="tick" d="m5 12 4 4 10-10"/></svg>';
 const rays=document.createElementNS('http://www.w3.org/2000/svg','svg');rays.setAttribute('viewBox','0 0 52 52');rays.setAttribute('aria-hidden','true');rays.classList.add('rays');
 rays.innerHTML='<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M26 1v5m0 40v5M1 26h5m40 0h5M8 8l4 4m28 28 4 4M8 44l4-4m28-28 4-4"/></g>';
 wrap.append(check,art,rays);
 const label=document.createElement('label');label.htmlFor=check.id;
 const words=document.createElement('span');words.className='words';words.textContent=task.text;label.append(words);
 const del=document.createElement('button');del.type='button';del.className='delete';del.setAttribute('aria-label','Delete '+task.text);
 del.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7m4-7v7"/></svg>';
 check.addEventListener('change',()=>{
  task.done=check.checked;li.classList.toggle('done',task.done);save();summary();
  cancel(art);cancel(rays);cancel(inner);
  if(task.done){
   motion(art,[{transform:'scale(1)'},{transform:'scale(.84)',offset:.2},{transform:'scale(1.16)',offset:.6},{transform:'scale(1)'}],{duration:460,easing:'ease-out'});
   motion(rays,[{opacity:0,transform:'scale(.65) rotate(-12deg)'},{opacity:.9,offset:.35},{opacity:0,transform:'scale(1.3) rotate(8deg)'}],{duration:540,easing:'ease-out'});
   motion(inner,[{backgroundColor:'#e6edcf',transform:'translateX(0)'},{backgroundColor:'#f0f3e3',transform:'translateX(3px)',offset:.45},{backgroundColor:'transparent',transform:'translateX(0)'}],{duration:620,easing:'ease-out'});
  }else{
   motion(art,[{transform:'rotate(-16deg) scale(.85)'},{transform:'rotate(5deg) scale(1.08)',offset:.65},{transform:'none'}],{duration:400,easing:'ease-out'});
   motion(inner,[{backgroundColor:'#edf0e1'},{backgroundColor:'transparent'}],{duration:420});
  }
  status.textContent=(task.done?'Completed: ':'Active again: ')+task.text;
 });
 del.addEventListener('click',()=>{
  const active=[...list.querySelectorAll(liveRows)],index=active.indexOf(li),focused=li.contains(document.activeElement),height=li.offsetHeight,from=stage.offsetHeight;
  tasks=tasks.filter(t=>t.id!==task.id);save();
  cancel(li);cancel(inner);cancel(art);cancel(rays);
  li.classList.add('exiting');li.removeAttribute('data-id');li.inert=true;li.setAttribute('aria-hidden','true');exits.add(li);visibleExits.add(li);
  // The departing row stays clipped inside its own shrinking slot.
  // State and focus change now; no completion event is needed for correctness.
  li.style.height='0px';
  if(reduced.matches)cleanup(li);
  else{
   motion(li,[{height:height+'px'},{height:'0px'}],{duration:180,delay:240,fill:'backwards',easing:'cubic-bezier(.22,.8,.2,1)'});
   inner.style.opacity='0';
   motion(inner,[{opacity:1,clipPath:'inset(0 0 0 0)'},{opacity:0,clipPath:'inset(0 100% 0 0)'}],{duration:240,easing:'ease-in'});
   timers.set(li,[
    setTimeout(()=>{visibleExits.delete(li);summary();},240),
    setTimeout(()=>cleanup(li),440)
   ]);
  }
  summary();stageLayout(from,true);
  if(focused)(active[index+1]?.querySelector('.delete')||active[index-1]?.querySelector('.delete')||input).focus();
  status.textContent='Deleted: '+task.text;
 });
 inner.append(wrap,label,del);li.append(inner);return li;
}
form.addEventListener('submit',event=>{
 event.preventDefault();const text=input.value.trim();
 if(!text){feedback.textContent='A small step needs a few words.';input.setAttribute('aria-invalid','true');input.focus();status.textContent=feedback.textContent;return;}
 const from=stage.offsetHeight,task={id:Date.now().toString(36)+'-'+(++serial).toString(36),text,done:false};tasks.push(task);
 const li=row(task);list.append(li);save();summary();stageLayout(from);reveal(li);
 input.value='';feedback.textContent='';input.removeAttribute('aria-invalid');input.focus({preventScroll:true});status.textContent='Added: '+text;
 // Follow the opening row as the document grows. A new add replaces this
 // request, so rapid submissions never queue competing scroll animations.
 cancelAnimationFrame(scrollFrame);
 const started=performance.now();
 function follow(){
  if(!li.isConnected||!li.matches(liveRows))return;
  const bottom=li.getBoundingClientRect().bottom;
  if(bottom>innerHeight-24)window.scrollBy({top:bottom-innerHeight+24,behavior:'instant'});
  if(!reduced.matches&&performance.now()-started<520)scrollFrame=requestAnimationFrame(follow);
 }
 follow();
});
input.addEventListener('input',()=>{feedback.textContent='';input.removeAttribute('aria-invalid');});
tasks.forEach(task=>list.append(row(task)));summary();stageLayout();
[...list.children].forEach((li,i)=>{motion(li.firstElementChild,[{opacity:0,transform:'translateX(-14px)'},{opacity:1,transform:'none'}],{duration:240,delay:60+Math.min(i,5)*20,fill:'backwards',easing:'cubic-bezier(.2,.8,.2,1)'});});
function stickyMetrics(){
 document.documentElement.style.setProperty('--focus-clearance',(form.offsetHeight+28)+'px');
 form.classList.toggle('stuck',form.getBoundingClientRect().top<=8.5);
}
function keepFocusVisible(){
 const focused=document.activeElement;
 if(!focused?.closest(liveRows))return;
 const top=focused.getBoundingClientRect().top,limit=form.getBoundingClientRect().bottom+12;
 if(top<limit)window.scrollBy({top:top-limit,behavior:'instant'});
}
document.addEventListener('focusin',()=>{keepFocusVisible();requestAnimationFrame(keepFocusVisible);});
window.addEventListener('scroll',stickyMetrics,{passive:true});
new ResizeObserver(stickyMetrics).observe(form);
window.addEventListener('resize',()=>{stageLayout();stickyMetrics();});
stickyMetrics();
reduced.addEventListener('change',()=>{
 if(reduced.matches){document.getAnimations().forEach(a=>a.cancel());[...exits].forEach(cleanup);stageLayout();}
});
})();
