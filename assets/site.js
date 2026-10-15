
const planner=document.querySelector('#planner');
document.querySelectorAll('[data-plan]').forEach(b=>b.addEventListener('click',()=>{planner.showModal();document.body.classList.add('locked')}));
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('[data-close]').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});d.addEventListener('close',()=>document.body.classList.remove('locked'))});
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.textContent=open?'Close −':'Menu +'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu +'}));
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('.gallery-item').forEach(p=>p.hidden=b.dataset.filter!=='all'&&p.dataset.category!==b.dataset.filter);document.querySelector('.gallery').classList.toggle('filtered',b.dataset.filter!=='all');const counter=document.querySelector('#gallery-count');if(counter){const count=[...document.querySelectorAll('.gallery-item')].filter(item=>!item.hidden).length;counter.textContent=count+' photographs'}}));
const lightbox=document.querySelector('#lightbox');document.querySelectorAll('.gallery-item').forEach(b=>b.addEventListener('click',()=>{const source=b.querySelector('img'),large=document.querySelector('#large-photo');large.src=source.src;large.alt=source.alt;lightbox.showModal();document.body.classList.add('locked')}));
let brief='';document.querySelector('#plan-form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const date=new Date(f.get('date')+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});brief=`My gathering — Sonia’s Catering\n\nOccasion: ${f.get('occasion')}\nGuests: ${f.get('guests')}\nDate: ${date}\nFood: ${f.get('food')}\nLocation: ${f.get('location')}\n\nPlease let me know about availability and suitable menu options.`;document.querySelector('#brief').textContent=brief;document.querySelector('#copy-brief').hidden=false;const whatsapp=document.querySelector('#whatsapp-brief');whatsapp.href='https://wa.me/260955278266?text='+encodeURIComponent(brief);whatsapp.hidden=false});document.querySelector('#copy-brief').addEventListener('click',async e=>{try{await navigator.clipboard.writeText(brief);e.target.textContent='Copied to clipboard';setTimeout(()=>e.target.textContent='Copy event brief',2500)}catch{e.target.textContent='Select the brief above to copy it'}});
const dateInput=document.querySelector('[name=date]'),today=new Date();dateInput.min=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
const tweaksButton=document.querySelector('.tweaks-open');tweaksButton.addEventListener('click',()=>{const panel=document.querySelector('#tweaks');panel.hidden=!panel.hidden;tweaksButton.setAttribute('aria-expanded',String(!panel.hidden));tweaksButton.textContent=panel.hidden?'Design tweaks +':'Close tweaks −'});document.querySelector('#atmosphere').addEventListener('change',e=>{const themes={classic:['#f7f4ec','#233d31','#a88749'],warm:['#f7f0e7','#593c2d','#a36f48'],crisp:['#fcfcf7','#294532','#8c783f']};const t=themes[e.target.value];['--paper','--ink','--gold'].forEach((k,i)=>document.documentElement.style.setProperty(k,t[i]))});// Gentle motion is managed by assets/motion.js.

const menuTabs=[...document.querySelectorAll('[data-menu]')];
function selectMenu(tab,focus=false){menuTabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.querySelector('#menu-'+t.dataset.menu).hidden=!active});if(focus)tab.focus()}
menuTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectMenu(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%menuTabs.length;if(e.key==='ArrowLeft')next=(i+menuTabs.length-1)%menuTabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=menuTabs.length-1;if(next!==undefined){e.preventDefault();selectMenu(menuTabs[next],true)}})});

// Feedback is handed off to WhatsApp; no review is silently submitted or published.
const reviewDialog=document.querySelector('#review-dialog');
document.querySelectorAll('[data-review]').forEach(button=>button.addEventListener('click',()=>{reviewDialog.showModal();document.body.classList.add('locked')}));
const reviewForm=document.querySelector('#review-form');
reviewForm.addEventListener('submit',event=>{
 event.preventDefault();
 const values=new FormData(reviewForm);
 const name=String(values.get('reviewer')||'').trim();
 const message=String(values.get('message')||'').trim();
 if(message.length<10){const field=document.querySelector('#review-message');field.setCustomValidity('Please write at least 10 characters about your experience.');field.reportValidity();return;}
 const rating=String(values.get('rating'));
 const review=`Feedback for Sonia’s Catering\n\n${name?'From: '+name+'\n':''}Rating: ${rating}/5\n\n${message}`;
 const link=document.querySelector('#send-review');
 link.href='https://wa.me/260955278266?text='+encodeURIComponent(review);
 link.hidden=false;
 document.querySelector('#review-status').textContent='Your review is ready. Continue on WhatsApp to review and send it to the team.';
});
reviewForm.addEventListener('input',()=>{
 document.querySelector('#review-message').setCustomValidity('');
 document.querySelector('#send-review').hidden=true;
 document.querySelector('#review-status').textContent='';
});
reviewForm.addEventListener('change',()=>{
 document.querySelector('#send-review').hidden=true;
 document.querySelector('#review-status').textContent='';
});
