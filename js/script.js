const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('nav.links');
toggle.addEventListener('click', ()=>{
  const open = links.style.display === 'flex';
  links.style.cssText = open ? '' : 'display:flex; position:fixed; top:66px; left:0; right:0; background:#100e0b; flex-direction:column; padding:24px 32px; gap:20px; text-align:left; z-index:60; border-bottom:1px solid rgba(244,239,226,0.14);';
});

document.querySelectorAll('.toggle-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const scope = btn.closest('section');
    scope.querySelectorAll('.toggle-btn').forEach(b=>{
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const target = btn.dataset.target;
    scope.querySelectorAll('.toggle-panel').forEach(panel=>{
      panel.hidden = panel.id !== target;
    });
  });
});

const storyToggleOpen = document.getElementById('story-toggle-open');
const storyToggleBtn = document.getElementById('story-toggle-btn');
const storyMore = document.getElementById('story-more');
const storyToggleCloseBtn = document.getElementById('story-toggle-close-btn');
if (storyToggleBtn && storyMore && storyToggleCloseBtn) {
  storyToggleBtn.addEventListener('click', ()=>{
    storyToggleOpen.hidden = true;
    storyMore.hidden = false;
    storyToggleBtn.setAttribute('aria-expanded', 'true');
  });
  storyToggleCloseBtn.addEventListener('click', ()=>{
    storyMore.hidden = true;
    storyToggleOpen.hidden = false;
    storyToggleBtn.setAttribute('aria-expanded', 'false');
    storyToggleOpen.scrollIntoView({behavior:'smooth', block:'center'});
  });
}

const mapLoadBtn = document.getElementById('map-load-btn');
if (mapLoadBtn) {
  mapLoadBtn.addEventListener('click', ()=>{
    const mapEmbed = document.getElementById('map-embed');
    const iframe = document.createElement('iframe');
    iframe.src = mapEmbed.dataset.mapSrc;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.title = mapEmbed.dataset.mapTitle;
    mapEmbed.replaceChildren(iframe);
  });
}
