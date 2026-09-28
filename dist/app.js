const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = motionPreference.matches;
const $ = selector => document.querySelector(selector);
$('#year').textContent = new Date().getFullYear();

// A brief entrance never blocks navigation or depends on network requests.
const loadStarted = performance.now();
function updateLoader(now) {
  const progress = Math.min(1, (now - loadStarted) / 1650);
  $('.loader-count').textContent = Math.floor(100 * (1 - Math.pow(1 - progress, 2)));
  if (progress < 1 && !reducedMotion) requestAnimationFrame(updateLoader);
}
if (!reducedMotion) requestAnimationFrame(updateLoader);

const menu = $('#navigation');
const menuButton = $('.menu-toggle');
function closeMenu() {
  if (menu.open) menu.close();
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  if (menu.open) closeMenu();
  else { menu.showModal(); menuButton.setAttribute('aria-expanded', 'true'); }
});
menu.addEventListener('cancel', () => menuButton.setAttribute('aria-expanded', 'false'));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
// A modal remains keyboard-contained and includes its own visible close control.
const closeButton = document.createElement('button');
closeButton.className = 'menu-toggle';
closeButton.style.cssText = 'position:absolute;right:3.2%;top:30px';
closeButton.setAttribute('aria-label', 'Close menu');
closeButton.innerHTML = 'Close <span class="plus" style="transform:rotate(45deg)">+</span>';
closeButton.addEventListener('click', closeMenu);
menu.append(closeButton);

const hero = $('.hero');
const letters = [...$('.hero-name').children];
let pointer = { x:.55, y:.4, active:false };
hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); pointer = {x:e.clientX/r.width,y:(e.clientY-r.top)/r.height,active:true}; });
hero.addEventListener('pointerleave', () => { pointer.active=false; });

const canvas = $('#atmosphere');
const context = canvas.getContext('2d');
let w=0,h=0,ratio=1;
function resizeCanvas() {
  ratio=Math.min(devicePixelRatio || 1,1.5);
  w=hero.clientWidth; h=hero.clientHeight;
  canvas.width=w*ratio; canvas.height=h*ratio;
  context?.setTransform(ratio,0,0,ratio,0,0);
  renderAtmosphere(0);
}
// Soft, layered nonrepresentational light, matching the reference's red atmosphere.
function renderAtmosphere(time) {
  if (!context) return;
  context.clearRect(0,0,w,h);
  const base=context.createRadialGradient(w*.5,h*.85,0,w*.5,h*.7,w*.8);
  base.addColorStop(0,'#17121f');base.addColorStop(.45,'#0b0911');base.addColorStop(1,'#050507');
  context.fillStyle=base; context.fillRect(0,0,w,h);
  context.globalCompositeOperation='screen';
  const t=time*.00022;
  for(let i=0;i<18;i++){
    const a=i*2.399;
    const x=w*(.56+.13*Math.sin(a+t*.7)+.09*Math.cos(a*.7-t));
    const y=h*(.34+.16*Math.cos(a+t*.9)+.07*Math.sin(a*1.4+t));
    const radius=Math.max(65,w*(.052+.025*Math.sin(a+t*.5)));
    const glow=context.createRadialGradient(x,y,0,x,y,radius);
    glow.addColorStop(0,i%4===0?'rgba(245,69,25,.13)':'rgba(198,18,45,.14)');
    glow.addColorStop(.48,'rgba(150,13,34,.075)');glow.addColorStop(1,'rgba(80,0,20,0)');
    context.fillStyle=glow;context.fillRect(x-radius,y-radius,radius*2,radius*2);
  }
  context.globalCompositeOperation='source-over';
}

const philosophy=$('.philosophy');
const picture=$('.philosophy-picture');
const philosophyTitle=$('#philosophy-title');
const philosophyCopy=$('.philosophy-copy');
const expandHint=$('.expand-hint');
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
function updateScroll() {
  if(reducedMotion) {
    [picture,philosophyTitle,philosophyCopy,expandHint].forEach(e=>e.removeAttribute('style'));
    return;
  }
  const r=philosophy.getBoundingClientRect();
  const progress=clamp(-r.top/Math.max(1,r.height-innerHeight));
  const startWidth=innerWidth<600?65:42;
  picture.style.width=`${startWidth+(100-startWidth)*clamp(progress*1.8)}%`;
  picture.style.height=`${54+46*clamp(progress*1.8)}%`;
  philosophyTitle.style.opacity=1-clamp((progress-.17)*4);
  philosophyTitle.style.transform=`scale(${1+progress*.2})`;
  const reveal=clamp((progress-.38)*3);
  philosophyCopy.style.opacity=reveal;
  philosophyCopy.style.transform=`translateY(${(1-reveal)*25}px)`;
  expandHint.style.opacity=1-clamp(progress*5);
}
let scrollQueued=false;
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(()=>{updateScroll();scrollQueued=false;});}},{passive:true});
addEventListener('resize',()=>{resizeCanvas();updateScroll();},{passive:true});
resizeCanvas();updateScroll();
let lastFrame=0;
function animate(now) {
  if(!document.hidden && !reducedMotion && hero.getBoundingClientRect().bottom>0 && now-lastFrame>32){
    lastFrame=now;renderAtmosphere(now);
    letters.forEach((letter,i)=>{
      const center=pointer.active?pointer.x*7:3.5+Math.sin(now*.00045)*2.5;
      const influence=Math.exp(-Math.pow((i-center)/1.3,2));
      const weight=100+influence*820;
      letter.style.fontVariationSettings=`'wght' ${weight.toFixed(0)}, 'wdth' ${(45+influence*75).toFixed(0)}, 'opsz' 144`;
      letter.style.transform=`scaleX(${(.64+influence*.35).toFixed(3)})`;
    });
  }
  if(!reducedMotion) requestAnimationFrame(animate);
}
if(!reducedMotion) requestAnimationFrame(animate);
motionPreference.addEventListener('change',e=>{reducedMotion=e.matches;updateScroll();if(!reducedMotion)requestAnimationFrame(animate);else{letters.forEach(l=>l.removeAttribute('style'));renderAtmosphere(0);}});

$('.contact-form').addEventListener('submit',e=>{
  e.preventDefault();
  const form=e.currentTarget;
  if(!form.reportValidity())return;
  const values=new FormData(form);
  const name=String(values.get('name')).trim();
  const email=String(values.get('email')).trim();
  const message=String(values.get('message')).trim();
  if(!name || !message){$('.form-status').textContent='Please add your name and a message.';return;}
  const subject=encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body=encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
  window.location.href=`mailto:iamgirijesh@gmail.com?subject=${subject}&body=${body}`;
  $('.form-status').textContent='Your email draft is ready. Send it from your email app, or write directly to iamgirijesh@gmail.com.';
});
