/* project filters (cards are pre-rendered by build.js) */
(function () {
  const grid = document.getElementById('grid'), count = document.getElementById('count'), btns = [...document.querySelectorAll('#filters button')];
  if (!grid || !btns.length) return;
  const cards = [...grid.querySelectorAll('.card')];
  function apply(t) {
    btns.forEach(b => { const on = b.dataset.t === t; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    let n = 0; cards.forEach(c => { const ok = t === 'all' || c.dataset.tags.split(' ').includes(t); c.hidden = !ok; if (ok) n++; });
    count.textContent = n + ' / ' + cards.length;
    const u = new URL(location); if (t === 'all') u.searchParams.delete('tag'); else u.searchParams.set('tag', t); history.replaceState(null, '', u);
  }
  btns.forEach(b => b.addEventListener('click', () => apply(b.dataset.t)));
  const init = new URLSearchParams(location.search).get('tag');
  apply(init && btns.some(b => b.dataset.t === init) ? init : 'all');
})();
