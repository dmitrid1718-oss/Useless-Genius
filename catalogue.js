(() => {
  const search = document.querySelector('#search');
  const cards = [...document.querySelectorAll('.catalog-card')];
  const tabs = [...document.querySelectorAll('[data-filter]')];
  let selected = 'all';
  const normalize = value => value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ё/g, 'е');
  function apply() {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const card of cards) {
      const text = normalize(card.dataset.search + ' ' + card.textContent);
      const visible = (selected === 'all' || card.dataset.category.split(' ').includes(selected)) && terms.every(term => text.includes(term));
      card.hidden = !visible;
      if (visible) count++;
    }
    document.querySelector('#results').textContent = `${count} of ${cards.length} cards · 40 stories + 3 opening records`;
    document.querySelector('#empty').hidden = count !== 0;
    describe();
    for (const tab of tabs) tab.setAttribute('aria-pressed', String(tab.dataset.filter === selected));
  }
  const descriptions = {
    all: 'All catalogue records', time: 'Time travel, timekeeping & strange physics', energy: 'Energy & power',
    spycraft: 'Espionage, ciphers & surveillance', computing: 'Computers, cybernetics & robots',
    space: 'Spaceflight & planetary machines', flight: 'Aircraft & unusual flight', radio: 'Radio, radar, sound & communication',
    mechanics: 'Mechanisms, engines & transport', materials: 'Materials & manufacturing',
    medicine: 'Medical devices, physiology & mind research', everyday: 'Household inventions & workshop ingenuity'
  };
  function describe() {
    document.querySelector('#drawer-description').textContent = descriptions[selected];
  }
  for (const drawer of document.querySelectorAll('[data-drawer]')) drawer.addEventListener('click', () => {
    selected = drawer.dataset.drawer; search.value = ''; apply();
    document.querySelector('#catalogue').scrollIntoView({behavior: 'auto'}); search.focus({preventScroll:true});
  });
  search.addEventListener('input', apply);
  for (const tab of tabs) tab.addEventListener('click', () => { selected = tab.dataset.filter; apply(); });
  for (const tag of document.querySelectorAll('[data-tag]')) tag.addEventListener('click', () => { selected = 'all'; search.value = tag.dataset.tag; apply(); search.focus(); });
  document.querySelector('#clear').addEventListener('click', () => { selected = 'all'; search.value = ''; apply(); search.focus(); });
  function openLinkedStory() {
    const id = location.hash.slice(1);
    if (!/^story-\d{2}$/.test(id)) return;
    const card = document.getElementById(id);
    if (!card) return;
    selected = 'all'; search.value = ''; apply();
    const story = card.querySelector('details');
    if (story) story.open = true;
    card.scrollIntoView({block:'start'});
  }
  window.addEventListener('hashchange', openLinkedStory);
  apply();
  openLinkedStory();
})();
