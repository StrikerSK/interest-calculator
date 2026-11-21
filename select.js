// Vlastný rozbaľovací zoznam namiesto natívneho okna <select>.
// Natívny select ostáva v DOM (skrytý) ako zdroj hodnoty: výber nastaví select.value
// a vyvolá na ňom udalosť "change", takže zvyšok kódu pracuje so selectom ako doteraz.
// Po programovej zmene hodnoty alebo textov treba zavolať CustomSelect.sync().
(() => {
  const all = [];
  let uid = 0;

  const closeAll = (except) => {
    for (const c of all) if (c !== except) c.close();
  };

  function enhance(sel) {
    const id = sel.id || 'cs' + ++uid;
    const wrap = document.createElement('div');
    wrap.className = 'cs-wrap';
    if (sel.classList.contains('full')) wrap.classList.add('full');
    if (sel.id === 'lang') wrap.classList.add('lang');
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    sel.tabIndex = -1;
    sel.setAttribute('aria-hidden', 'true');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cs-btn';
    btn.id = id + '-btn';
    btn.setAttribute('role', 'combobox');
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');

    const list = document.createElement('ul');
    list.className = 'cs-list';
    list.id = id + '-list';
    list.setAttribute('role', 'listbox');
    list.tabIndex = -1;
    let isOpen = false;
    btn.setAttribute('aria-controls', list.id);
    wrap.append(btn, list);

    const lab = sel.id && document.querySelector(`label[for="${sel.id}"]`);
    if (lab) {
      if (!lab.id) lab.id = id + '-lab';
      btn.setAttribute('aria-labelledby', lab.id);
      list.setAttribute('aria-labelledby', lab.id);
      lab.addEventListener('click', (e) => {
        e.preventDefault();
        btn.focus();
      });
    }

    let active = -1;
    const optId = (i) => `${id}-o${i}`;

    function build() {
      list.textContent = '';
      [...sel.options].forEach((o, i) => {
        const li = document.createElement('li');
        li.id = optId(i);
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(i === sel.selectedIndex));
        li.textContent = o.text;
        list.appendChild(li);
      });
    }

    function setActive(i, scroll = true) {
      const n = sel.options.length;
      if (!n) return;
      active = Math.max(0, Math.min(n - 1, i));
      for (const li of list.children) li.classList.toggle('active', li.id === optId(active));
      btn.setAttribute('aria-activedescendant', optId(active));
      // Posúva len zoznam, nie celú stránku (scrollIntoView by posunul aj stránku)
      const li = list.children[active];
      if (scroll && li) {
        if (li.offsetTop < list.scrollTop) list.scrollTop = li.offsetTop;
        else if (li.offsetTop + li.offsetHeight > list.scrollTop + list.clientHeight)
          list.scrollTop = li.offsetTop + li.offsetHeight - list.clientHeight;
      }
    }

    function open() {
      if (isOpen) return;
      closeAll(api);
      build();
      isOpen = true;
      btn.setAttribute('aria-expanded', 'true');
      // Ak sa zoznam nezmestí pod pole, otvorí sa nahor (smer treba určiť ešte pred animáciou)
      const wr = wrap.getBoundingClientRect();
      const h = list.offsetHeight + 12;
      wrap.classList.toggle('up', wr.bottom + h > innerHeight && wr.top > h);
      void list.offsetHeight; // prehliadač zaregistruje zatvorený stav, aby sa prechod spustil
      wrap.classList.add('open');
      setActive(sel.selectedIndex);
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      btn.setAttribute('aria-expanded', 'false');
      btn.removeAttribute('aria-activedescendant');
      // trieda "up" ostáva, aby sa zoznam zroloval tým istým smerom, akým sa otvoril
      wrap.classList.remove('open');
    }

    function choose(i) {
      if (i >= 0 && i !== sel.selectedIndex) {
        sel.selectedIndex = i;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
      sync();
      close();
      btn.focus();
    }

    function sync() {
      // Všetky texty sú v tlačidle na sebe v jednej bunke mriežky; viditeľný je len vybraný.
      // Tlačidlo tak má vždy šírku najdlhšej možnosti a pri výbere sa nemení (ako natívny select).
      btn.textContent = '';
      [...sel.options].forEach((o, i) => {
        const sp = document.createElement('span');
        sp.textContent = o.text;
        if (i !== sel.selectedIndex) sp.setAttribute('aria-hidden', 'true');
        btn.appendChild(sp);
      });
      // Ďalšie neviditeľné texty, ktoré môže možnosť mať (napr. v iných jazykoch), aby sa šírka nemenila ani pri ich zmene
      if (window.CustomSelect.sizer) {
        [...sel.options].forEach((o, i) => {
          for (const txt of window.CustomSelect.sizer(sel, o, i) || []) {
            const sp = document.createElement('span');
            sp.textContent = txt;
            sp.setAttribute('aria-hidden', 'true');
            btn.appendChild(sp);
          }
        });
      }
      if (!lab) {
        const al = sel.getAttribute('aria-label');
        if (al) {
          btn.setAttribute('aria-label', al);
          list.setAttribute('aria-label', al);
        }
      }
      if (isOpen) {
        build();
        setActive(active, false);
      }
    }

    btn.addEventListener('click', () => (isOpen ? close() : open()));
    btn.addEventListener('blur', close);

    // Klik do zoznamu nesmie zobrať fokus tlačidlu (inak by blur zoznam zavrel)
    list.addEventListener('mousedown', (e) => e.preventDefault());
    list.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (li) choose([...list.children].indexOf(li));
    });
    list.addEventListener('mousemove', (e) => {
      const li = e.target.closest('li');
      if (li) setActive([...list.children].indexOf(li), false);
    });

    btn.addEventListener('keydown', (e) => {
      const k = e.key;
      if (!isOpen) {
        if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') {
          e.preventDefault();
          open();
        }
        return;
      }
      if (k === 'ArrowDown') setActive(active + 1);
      else if (k === 'ArrowUp') setActive(active - 1);
      else if (k === 'Home' || k === 'PageUp') setActive(0);
      else if (k === 'End' || k === 'PageDown') setActive(sel.options.length - 1);
      else if (k === 'Enter' || k === ' ') choose(active);
      else if (k === 'Escape') close();
      else if (k === 'Tab') {
        close();
        return;
      } else if (k.length === 1 && /\S/.test(k)) {
        // Skok na ďalšiu možnosť začínajúcu daným písmenom
        const opts = [...sel.options];
        const n = opts.length;
        for (let j = 1; j <= n; j++) {
          const i = (active + j) % n;
          if (opts[i].text.trim().toLowerCase().startsWith(k.toLowerCase())) {
            setActive(i);
            break;
          }
        }
      } else return;
      e.preventDefault();
    });

    const api = { close, sync };
    all.push(api);
    sync();
  }

  window.CustomSelect = {
    // (select, option, index) => pole ďalších textov, podľa ktorých sa má počítať šírka
    sizer: null,
    init(root = document) {
      for (const s of root.querySelectorAll('select')) enhance(s);
    },
    sync() {
      for (const c of all) c.sync();
    },
  };
})();
