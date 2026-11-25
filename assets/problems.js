/* THEFOUNDER / Défis V2 : carrousel tactile, navigation clavier, boutons, compteur. */
(() => {
  const root = document.querySelector('.tfv-problems');
  if (!root) return;
  const track = root.querySelector('#tfv-problems-track');
  const cards = [...track.querySelectorAll('.tfv-card')];
  const prev = root.querySelector('.tfv-carousel-prev');
  const next = root.querySelector('.tfv-carousel-next');
  const counter = root.querySelector('.tfv-counter');
  const progress = root.querySelector('.tfv-progress i');
  const mq = matchMedia('(max-width: 700px)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  const pos = i => cards[i].offsetLeft - cards[0].offsetLeft;
  const update = i => {
    index = Math.max(0, Math.min(cards.length - 1, i));
    prev.disabled = index === 0;
    next.disabled = index === cards.length - 1;
    counter.innerHTML = String(index+1).padStart(2,'0') + ' <span>/ ' + String(cards.length).padStart(2,'0') + '</span>';
    progress.style.width = (100*(index+1)/cards.length) + '%';
  };
  const go = i => {
    update(i);
    track.scrollTo({left:pos(index),behavior:reduce.matches?'auto':'smooth'});
  };
  const sync = () => {
    if (!mq.matches) return;
    const scroll = track.scrollLeft;
    let nearest = 0, distance = Infinity;
    cards.forEach((card,i) => { const d = Math.abs(pos(i)-scroll); if (d < distance) {distance=d;nearest=i;} });
    update(nearest);
  };
  prev.addEventListener('click', () => go(index-1));
  next.addEventListener('click', () => go(index+1));
  track.addEventListener('scroll', sync, {passive:true});
  track.addEventListener('keydown', e => {
    if (!mq.matches || !['ArrowLeft','ArrowRight'].includes(e.key)) return;
    e.preventDefault(); go(index + (e.key==='ArrowRight'?1:-1));
  });
  mq.addEventListener('change', () => { if (mq.matches) go(0); else update(0); });
  update(0);
})();
