/* KETINE portfolio — interactions */
(function(){
  // sticky nav
  const nav=document.querySelector('.nav');
  const onScroll=()=>{ if(nav) nav.classList.toggle('scrolled', window.scrollY>40); };
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // mobile menu
  const burger=document.querySelector('.burger');
  const links=document.querySelector('.nav-links');
  if(burger&&links){
    burger.addEventListener('click',()=>links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
  }

  // scroll reveal
  const io=new IntersectionObserver((es)=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // gallery filter tabs — toggle whole album blocks (or cells as fallback)
  const tabs=document.querySelectorAll('.tab');
  if(tabs.length){
    const albums=document.querySelectorAll('[data-cat]');
    tabs.forEach(tab=>tab.addEventListener('click',()=>{
      tabs.forEach(t=>t.classList.remove('active')); tab.classList.add('active');
      const f=tab.dataset.filter;
      albums.forEach(a=>{
        const cats=(a.dataset.cat||'').split(' ');
        a.style.display=(f==='all'||cats.includes(f))?'':'none';
      });
    }));
  }

  // lightbox
  const lb=document.getElementById('lb');
  if(lb){
    const stage=lb.querySelector('.lb-stage');
    const closeBtn=lb.querySelector('.close');
    const prevBtn=lb.querySelector('.prev');
    const nextBtn=lb.querySelector('.next');
    let items=[],cur=0;

    function collect(){
      // only items actually visible (offsetParent is null when an ancestor album is hidden)
      items=[...document.querySelectorAll('[data-lb]')].filter(el=>el.offsetParent!==null);
    }
    function render(){
      const el=items[cur]; if(!el) return;
      const type=el.dataset.lb, src=el.dataset.src;
      stage.innerHTML = type==='video'
        ? `<video src="${src}" controls autoplay playsinline></video>`
        : `<img src="${src}" alt="">`;
    }
    function open(el){
      collect(); cur=items.indexOf(el); if(cur<0)cur=0;
      lb.classList.add('open'); document.body.style.overflow='hidden'; render();
    }
    function close(){ lb.classList.remove('open'); document.body.style.overflow=''; stage.innerHTML=''; }
    function step(d){ cur=(cur+d+items.length)%items.length; render(); }

    document.addEventListener('click',e=>{
      const t=e.target.closest('[data-lb]'); if(t){ e.preventDefault(); open(t); }
    });
    closeBtn.addEventListener('click',close);
    prevBtn.addEventListener('click',()=>step(-1));
    nextBtn.addEventListener('click',()=>step(1));
    lb.addEventListener('click',e=>{ if(e.target===lb) close(); });
    document.addEventListener('keydown',e=>{
      if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')close(); if(e.key==='ArrowRight')step(1); if(e.key==='ArrowLeft')step(-1);
    });
  }

  // year
  const y=document.getElementById('yr'); if(y)y.textContent=new Date().getFullYear();
})();
