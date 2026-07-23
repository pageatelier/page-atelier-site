
const body=document.body;
window.addEventListener('load',()=>window.setTimeout(()=>body.classList.add('loaded'),300));

const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.site-nav');
if(menuButton&&nav){
  menuButton.addEventListener('click',()=>{
    const isOpen=menuButton.getAttribute('aria-expanded')==='true';
    menuButton.setAttribute('aria-expanded',String(!isOpen));
    menuButton.classList.toggle('active',!isOpen);
    nav.classList.toggle('open',!isOpen);
    body.style.overflow=!isOpen?'hidden':'';
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    menuButton.setAttribute('aria-expanded','false');
    menuButton.classList.remove('active');
    nav.classList.remove('open');
    body.style.overflow='';
  }));
}
const page=body.dataset.page;
document.querySelectorAll('.site-nav a').forEach(a=>{
  if(a.dataset.page===page)a.classList.add('active');
});
const revealElements=document.querySelectorAll('.reveal,.reveal-text');
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
    });
  },{threshold:.1,rootMargin:'0px 0px -5% 0px'});
  revealElements.forEach(el=>observer.observe(el));
}else{
  revealElements.forEach(el=>el.classList.add('visible'));
}
