(() => {
  const $ = (id) => document.getElementById(id);

  // ---------- State ----------

  const D = {
    amt: 150000,
    rate: 3.9,
    yrs: 30,
    unit: 'y',
    cur: 'EUR',
    inf: 2.5,
    fee: 0,
    mfee: 0,
    ins: 0,
    insT: 'fix',
    fixY: 0,
    rate2: 4.5,
    xM: 0,
    xOne: 0,
    xYear: 5,
    xMode: 'kratsia',
    country: 'SK',
    price: 0,
    income: 0,
    otherPay: 0,
    otherDebt: 0,
    age: 30,
    adults: '1',
    kids: 0,
    props: '0',
    tax: false,
    czLim: '150000',
    czRate: '15',
    lang: (() => {
      const l = (navigator.language || '').slice(0, 2).toLowerCase();
      return l === 'cs' || l === 'sk' ? l : 'en';
    })(),
  };

  const S = { ...D };

  try {
    const saved = JSON.parse(localStorage.getItem('hypo-calc') || 'null');
    if (saved) {
      for (const k in D) {
        if (k in saved && saved[k] != null) S[k] = saved[k];
      }
    }
  } catch (e) {}

  // ?lang=sk|cs|en v adrese má prednosť pred uloženým jazykom
  const qLang = new URLSearchParams(location.search).get('lang');
  if (qLang && I18N[qLang]) S.lang = qLang;
  if (!I18N[S.lang]) S.lang = D.lang;

  // Preklad: text s {parametrami} alebo funkcia zo slovníka
  const t = (k, v) => {
    const x = I18N[S.lang][k] ?? I18N.sk[k] ?? k;
    if (typeof x === 'function') return x(v);
    return v && typeof x === 'string' ? x.replace(/\{(\w+)\}/g, (_, n) => v[n]) : x;
  };

  function applyLang() {
    document.documentElement.lang = S.lang;
    for (const e of document.querySelectorAll('[data-i18n]')) e.textContent = t(e.dataset.i18n);
    for (const e of document.querySelectorAll('[data-i18n-aria]')) e.setAttribute('aria-label', t(e.dataset.i18nAria));
    document.title = t('title');
    $('lang').value = S.lang;
  }

  const CUR = {
    EUR: { sym: '€', loc: 'sk-SK', min: 500, max: 1000000, step: 500 },
    CZK: { sym: 'Kč', loc: 'cs-CZ', min: 10000, max: 25000000, step: 10000 },
  };

  let A = null;

  // ---------- Formatting helpers ----------

  const parse = (v) => {
    const n = parseFloat(String(v).replace(/[\s  ]/g, '').replace(',', '.'));
    return isFinite(n) ? n : 0;
  };

  const fmt = (n, d = 0) =>
    new Intl.NumberFormat(CUR[S.cur].loc, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }).format(n);

  const nf = (v, d) => (d ? fmt(v, d).replace(/,?0+$/, '') || '0' : fmt(v, 0));

  //   = nezlomiteľná medzera (číslo a jednotka ostanú na jednom riadku)
  const money = (n, d = 0) => fmt(n, d) + ' ' + CUR[S.cur].sym;

  const termTxt = (m) => {
    const y = Math.floor(m / 12);
    const r = m % 12;
    const ys = t('years', y);
    const ms = t('months', r);
    if (!y) return ms;
    if (!r) return ys;
    return ys + t('and') + ms;
  };

  const short = (n) => {
    if (n >= 1e6) return fmt(n / 1e6, 1) + ' M';
    if (n >= 1e3) return fmt(n / 1e3, 0) + ' k';
    return fmt(n, 0);
  };

  // Anuitná splátka
  const ann = (P, r, n) => {
    if (n <= 0) return P;
    if (r === 0) return P / n;
    return (P * r) / (1 - Math.pow(1 + r, -n));
  };

  // Zaokrúhlenie na centy (banka počíta splátky aj úroky v centoch)
  const c2 = (v) => Math.round(v * 100) / 100;

  // ---------- Limity a dane podľa krajiny ----------

  // Sumy pravidiel sú v mene krajiny; pri inej mene sa prepočítajú pevným kurzom 25 Kč / €.
  const toCur = (v, from) => (from === S.cur ? v : from === 'EUR' ? v * 25 : v / 25);

  // Životné minimum SR od 1. 7. 2026 do 30. 6. 2027
  const ZM = { first: 295.22, other: 205.96, kid: 134.8 };

  function afford(B) {
    const sk = S.country === 'SK';
    const n = B.n;
    const age = S.age;
    const props = +S.props;
    const rows = [];
    let maxP = Infinity;
    let limBy = '';
    const cap = (v, by) => {
      if (v < maxP) {
        maxP = v;
        limBy = by;
      }
    };

    // LTV
    if (S.price > 0) {
      let lim;
      let why;
      if (props >= 2) {
        lim = 70;
        why = t(sk ? 'ltv3SK' : 'ltv3CZ');
      } else if (sk && age > 0 && age <= 35 && props === 0) {
        lim = 90;
        why = t('ltvYoungSK');
      } else if (!sk && age > 0 && age < 36) {
        lim = 90;
        why = t('ltvYoungCZ');
      } else {
        lim = 80;
        why = t('std');
      }
      rows.push({ nm: t('ltvNm'), why, v: (S.amt / S.price) * 100, lim, u: '%' });
      cap((S.price * lim) / 100, 'LTV');
    }

    if (S.income > 0) {
      // DSTI
      if (sk) {
        const zm = toCur(ZM.first + (+S.adults - 1) * ZM.other + S.kids * ZM.kid, 'EUR');
        const base = S.income - zm;
        // úroková rezerva NBS: +2 p. b., najviac do sadzby 6 %
        const rs = S.rate >= 6 ? S.rate : Math.min(S.rate + 2, 6);
        const payS = ann(S.amt, rs / 1200, n);
        rows.push({
          nm: t('dstiNm'),
          why: t('dstiSK', { zm: money(zm), r: nf(rs, 2) }),
          v: base > 0 ? ((payS + S.otherPay) / base) * 100 : Infinity,
          lim: 60,
          u: '%',
        });
        const maxPay = 0.6 * base - S.otherPay;
        const r = rs / 1200;
        cap(maxPay > 0 ? (r === 0 ? maxPay * n : (maxPay * (1 - Math.pow(1 + r, -n))) / r) : 0, 'DSTI');
      } else {
        rows.push({
          nm: t('dstiNm'),
          why: t('dstiCZ'),
          v: ((B.fl[0].pay + S.otherPay) / S.income) * 100,
          lim: null,
          u: '%',
        });
      }

      // DTI
      let lim = null;
      let why;
      if (sk) {
        lim = 8;
        why = t('std');
        if (age >= 41 && age + n / 12 > 65) {
          lim = Math.max(3, 8 - 0.25 * (Math.floor(age) - 40));
          why = t('dtiAge', { a: age });
        }
      } else if (props >= 2) {
        lim = 7;
        why = t('dtiInv');
      } else {
        why = t('dtiOwn');
      }
      rows.push({ nm: t('dtiNm'), why, v: (S.amt + S.otherDebt) / (S.income * 12), lim, u: '×' });
      if (lim != null) cap(lim * S.income * 12 - S.otherDebt, 'DTI');
    }

    return { rows, maxP: isFinite(maxP) ? Math.max(0, maxP) : null, limBy };
  }

  // Daňová úľava po rokoch úveru (rok úveru sa berie ako zdaňovacie obdobie)
  function taxRelief(rows) {
    if (!S.tax) return null;
    if (S.country === 'SK') {
      if (S.age > 35) return rows.map(() => 0);
      const cap = toCur(1200, 'EUR');
      return rows.map((r, i) => (i < 5 ? Math.min(r.in * 0.5, cap) : 0));
    }
    const lim = toCur(+S.czLim, 'CZK');
    const rate = +S.czRate / 100;
    return rows.map((r) => Math.min(r.in, lim) * rate);
  }


  // ---------- Calculation ----------

  // Simulácia mesiac po mesiaci. extras=false → zmluvný priebeh (pre RPMN a porovnanie).
  function sim(extras) {
    const P = Math.max(0, S.amt);
    const n = Math.max(1, Math.round(S.yrs * 12));
    const r1 = S.rate / 1200;
    const r2 = S.rate2 / 1200;
    const fixM = S.fixY > 0 && Math.round(S.fixY * 12) < n ? Math.round(S.fixY * 12) : 0;
    const xm = extras ? S.xM : 0;
    const oneM = extras && S.xOne > 0 ? Math.max(1, Math.round(S.xYear * 12)) : 0;

    let bal = P;
    let r = r1;
    let M = c2(ann(P, r1, n));
    let m = 0;
    let I = 0;
    let FE = 0;

    const fl = [];
    const rows = [];
    let y = { pr: 0, in: 0, fe: 0 };

    while (bal > 0.005 && m < n) {
      m++;

      if (fixM && m === fixM + 1) {
        // zachová aktuálny koniec splácania (pri skrátení doby mimoriadnymi splátkami)
        let left = r > 0 ? -Math.log(1 - (bal * r) / M) / Math.log(1 + r) : bal / M;
        if (!isFinite(left) || left < 1) left = n - m + 1;
        r = r2;
        M = c2(ann(bal, r2, Math.min(n - m + 1, Math.ceil(left - 1e-6))));
      }

      const it = c2(bal * r);
      let pr = Math.min(bal, M - it);
      if (m === n) pr = bal;
      bal = c2(bal - pr);

      let ex = 0;
      if (bal > 0.005) {
        ex = Math.min(bal, xm + (m === oneM ? S.xOne : 0));
        bal = c2(bal - ex);
      }

      const pay = pr + it;
      const fe = c2(S.mfee + (S.insT === 'pct' ? (pay * S.ins) / 100 : S.ins));

      fl.push({ pay, ex, fe });
      I += it;
      FE += fe;

      y.pr += pr + ex;
      y.in += it;
      y.fe += fe;

      if (ex > 0 && S.xMode === 'nizsia' && bal > 0.005) M = c2(ann(bal, r, n - m));

      if (m % 12 === 0 || bal <= 0.005 || m === n) {
        rows.push({ y: Math.ceil(m / 12), ...y, bal: Math.max(0, bal) });
        y = { pr: 0, in: 0, fe: 0 };
      }
    }

    return { P, n, m, fl, rows, I, FE, fixM, T: P + I + FE + S.fee };
  }

  // RPMN podľa smernice EÚ 2008/48: vyplatená suma = Σ platba_k/(1+X)^(k/12)
  function apr(net, fl) {
    if (net <= 0 || !fl.length) return null;

    const f = (x) => {
      const v = Math.pow(1 + x, -1 / 12);
      let d = 1;
      let s = 0;
      for (const c of fl) {
        d *= v;
        s += (c.pay + c.ex + c.fe) * d;
      }
      return s - net;
    };

    let lo = -0.99;
    let hi = 20;
    if (f(lo) < 0 || f(hi) > 0) return null;

    for (let i = 0; i < 80; i++) {
      const mid = (lo + hi) / 2;
      if (f(mid) > 0) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  // ---------- Rendering ----------

  function render() {
    const c = CUR[S.cur];
    for (const e of document.querySelectorAll('.cs')) e.textContent = c.sym;
    $('insT').options[0].text = t('insFix', { sym: c.sym });

    const B = sim(false);
    A = sim(true);
    const hasX = S.xM > 0 || S.xOne > 0;
    const first = A.fl[0];

    $('bFee').classList.toggle('show', S.fee > 0 || S.mfee > 0 || S.ins > 0);
    $('bFix').classList.toggle('show', !!A.fixM);
    $('bX').classList.toggle('show', hasX);
    $('bAff').classList.toggle('show', S.price > 0 || S.income > 0);
    $('bTax').classList.toggle('show', !!S.tax);

    // Mesačná splátka
    $('pay').textContent = money(first.pay + first.fe, 2);
    $('paySub').textContent =
      `${t('pays', B.n)} · ${t('perYear', { r: nf(S.rate, 2) })} · ${termTxt(B.n)}` +
      (first.fe > 0 ? t('paySubFee', { v: money(first.fe, 2) }) : '') +
      (S.xM > 0 ? t('paySubX', { v: money(S.xM) }) : '');

    const fx = A.fixM && A.fl[A.fixM];
    $('fixSub').hidden = !fx;
    if (fx) {
      $('fixSub').textContent = t('fixSub', { y: A.fixM / 12 + 1, r: nf(S.rate2, 2), v: money(fx.pay + fx.fe, 2) });
    }

    // RPMN
    const a = apr(A.P - S.fee, B.fl);
    $('apr').textContent = a == null ? '–' : nf(a * 100, 2) + ' %';

    // Úspora z mimoriadnych splátok
    const sv = $('save');
    sv.classList.toggle('show', hasX);
    if (hasX) {
      const dI = B.I - A.I;
      const dM = B.m - A.m;
      const li = Math.max(0, A.m - 2);
      const la = A.fl[li];
      const lb = B.fl[li];

      let tail;
      if (S.xMode === 'kratsia') {
        tail = dM > 0 ? t('saveShort', { d: termTxt(dM), t: termTxt(A.m) }) : '.';
      } else {
        tail = t('saveLow', { a: money(la.pay + la.fe, 2), b: money(lb.pay + lb.fe, 2) });
      }
      sv.innerHTML = t('save', { v: money(dI) }) + tail;
    }

    // Dostupnosť
    const sk = S.country === 'SK';
    $('affHint').textContent = t(sk ? 'hintAffSK' : 'hintAffCZ');
    const AF = afford(B);
    $('aff').hidden = !AF.rows.length;
    if (AF.rows.length) {
      $('affSrc').textContent = t(sk ? 'affSrcSK' : 'affSrcCZ');
      const val = (r) => (r.v === Infinity ? '∞' : r.u === '%' ? nf(r.v, 1) + ' %' : nf(r.v, 2) + '×');
      const lv = (r) => (r.u === '%' ? nf(r.lim, 0) + ' %' : nf(r.lim, 2) + '×');
      $('affRows').innerHTML = AF.rows
        .map((r) => {
          const has = r.lim != null;
          const over = has && r.v > r.lim + 1e-9;
          const pill = !has
            ? `<span class="pill na">${t('pillNa')}</span>`
            : over
              ? `<span class="pill bad">${t('pillBad', { l: lv(r) })}</span>`
              : `<span class="pill ok">${t('pillOk', { l: lv(r) })}</span>`;
          const bar = has
            ? `<div class="bar${over ? ' over' : ''}"><i style="width:${Math.min(100, (r.v / r.lim) * 100)}%"></i></div>`
            : '';
          return `<div class="lim"><div class="nm">${r.nm}<small>${r.why}</small></div><div class="v">${val(r)}</div>${pill}${bar}</div>`;
        })
        .join('');
      if (AF.maxP != null) {
        const diff = S.amt - AF.maxP;
        $('affMax').innerHTML =
          t('affMax', { v: money(AF.maxP), by: AF.limBy }) + (diff > 0.5 ? t('affOver', { v: money(diff) }) : '.');
      } else {
        $('affMax').textContent = '';
      }
    }

    // Daňová úľava
    $('taxHint').textContent = t(sk ? 'hintTaxSK' : 'hintTaxCZ');
    $('taxCZ').hidden = sk;
    const TR = taxRelief(A.rows);
    const tb = $('taxBox');
    tb.hidden = !TR;
    let TRsum = 0;
    if (TR) {
      TRsum = TR.reduce((a, b) => a + b, 0);
      if (sk && S.age > 35) {
        tb.innerHTML = t('taxNo');
      } else {
        tb.innerHTML = t('taxMsg', {
          what: t(sk ? 'taxBonus' : 'taxDed'),
          v: money(TRsum),
          y1: money(TR[0]),
          first5: sk ? t('taxFirst5') : '',
          i: money(A.I - TRsum),
          t: money(A.T - TRsum),
        });
      }
    }

    // Pomer istina / úroky / poplatky
    const fees = A.FE + S.fee;
    const tot = A.P + A.I + fees || 1;
    const pp = (A.P / tot) * 100;
    const pi = (A.I / tot) * 100;
    const pf = (fees / tot) * 100;

    $('sP').style.width = pp + '%';
    $('sI').style.width = pi + '%';
    $('sF').style.width = pf + '%';
    $('pP').textContent = nf(pp, 0) + ' %';
    $('pI').textContent = nf(pi, 0) + ' %';
    $('pF').textContent = nf(pf, 0) + ' %';
    $('lF').hidden = fees <= 0;

    $('oP').textContent = money(A.P);
    $('oI').textContent = money(A.I);
    $('oT').textContent = money(A.T);

    // inflácia
    const q = Math.pow(1 + S.inf / 100, 1 / 12);
    let d = 1;
    let rl = 0;
    let rf = 0;
    let last = 0;
    let ry = 0;
    const re = [];

    A.fl.forEach((f, i) => {
      d /= q;
      const v = (f.pay + f.ex + f.fe) * d;
      rl += (f.pay + f.ex) * d;
      rf += f.fe * d;
      ry += v;
      last = (f.pay + f.fe) * d;
      if ((i + 1) % 12 === 0 || i === A.fl.length - 1) {
        re.push(ry);
        ry = 0;
      }
    });
    A.rows.forEach((r, i) => {
      r.re = re[i];
    });

    $('rL').textContent = money(last, 2);
    $('rI').textContent = money(rl - A.P);
    $('rT').textContent = money(rl + rf + S.fee);

    // Splátkový kalendár
    const fixYr = A.fixM / 12;
    const heads = [...t('heads')];
    if (TR) heads.push(t(sk ? 'thTaxSK' : 'thTaxCZ'));
    $('th').innerHTML = '<tr>' + heads.map((t) => `<th>${t}</th>`).join('') + '</tr>';

    // Tabuľka počíta na centy: každá zložka sa zaokrúhli raz a súčty sa robia
    // zo zaokrúhlených hodnôt, aby riadky aj stĺpce sedeli presne.
    const RR = A.rows.map((r, i) => {
      const pr = c2(r.pr);
      const inn = c2(r.in);
      const fe = c2(r.fe);
      return { y: r.y, pr, in: inn, fe, tot: c2(pr + inn + fe), bal: c2(r.bal), re: c2(r.re), tr: TR ? c2(TR[i]) : 0 };
    });
    const sum = (k) => c2(RR.reduce((a, r) => a + r[k], 0));
    const m2 = (v) => money(v, 2);

    $('tb').innerHTML = RR.map((r) => {
      const attrs = r.y === fixYr ? ` class="fx" title="${t('fixEnd')}"` : '';
      return (
        `<tr${attrs}>` +
        `<td>${t('yearCell', r.y)}</td>` +
        `<td>${m2(r.tot)}</td>` +
        `<td>${m2(r.pr)}</td>` +
        `<td class="i">${m2(r.in)}</td>` +
        `<td>${m2(r.fe)}</td>` +
        `<td>${m2(r.bal)}</td>` +
        `<td>${m2(r.re)}</td>` +
        (TR ? `<td class="t">${m2(r.tr)}</td>` : '') +
        `</tr>`
      );
    }).join('');

    const totAll = sum('tot');
    const reAll = sum('re');
    let foot =
      `<tr>` +
      `<td>${t('total')}</td>` +
      `<td>${m2(totAll)}</td>` +
      `<td>${m2(sum('pr'))}</td>` +
      `<td class="i">${m2(sum('in'))}</td>` +
      `<td>${m2(sum('fe'))}</td>` +
      `<td></td>` +
      `<td>${m2(reAll)}</td>` +
      (TR ? `<td class="t">${m2(sum('tr'))}</td>` : '') +
      `</tr>`;
    if (S.fee > 0) {
      foot +=
        `<tr><td>${t('plusFee')}</td><td>${m2(S.fee)}</td><td colspan="${TR ? 6 : 5}"></td></tr>` +
        `<tr><td>${t('grand')}</td><td>${m2(c2(totAll + S.fee))}</td><td colspan="4"></td><td>${m2(c2(reAll + S.fee))}</td>${TR ? '<td></td>' : ''}</tr>`;
    }
    $('tf').innerHTML = foot;

    draw();

    try {
      localStorage.setItem('hypo-calc', JSON.stringify(S));
    } catch (e) {}
  }

  // ---------- Chart ----------

  const svg = $('chart');

  function draw() {
    const W = svg.clientWidth;
    const H = svg.clientHeight;
    if (!W || !A || !A.rows.length) return;

    const rows = A.rows;
    const narrow = W < 520;
    const L = narrow ? 8 : 56;
    const R = 8;
    const T = 12;
    const Bm = 28;
    const iw = W - L - R;
    const ih = H - T - Bm;
    const mx = Math.max(...rows.map((r) => r.pr + r.in + r.fe)) * 1.15 || 1;
    const bw = iw / rows.length;
    const g = Math.min(6, bw * 0.25);

    let s = '';

    // Mriežka a os Y
    if (!narrow) {
      for (let k = 0; k <= 4; k++) {
        const v = (mx * k) / 4;
        const yy = T + ih - (ih * k) / 4;
        s +=
          `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" stroke="var(--line)"/>` +
          `<text x="${L - 8}" y="${yy + 4}" text-anchor="end" font-size="12" fill="var(--muted)">${short(v)}</text>`;
      }
    }

    // Stĺpce po rokoch
    const every = Math.ceil(rows.length / (narrow ? 6 : 12));
    rows.forEach((r, i) => {
      const x = L + i * bw + g / 2;
      const w = Math.max(1, bw - g);
      const base = T + ih;
      const hp = (ih * r.pr) / mx;
      const hi = (ih * r.in) / mx;
      const hf = (ih * r.fe) / mx;

      s +=
        `<rect x="${x}" y="${base - hp}" width="${w}" height="${hp}" fill="var(--prin)">` +
        `<title>${t('barP', { y: r.y, v: money(r.pr) })}</title></rect>`;
      s +=
        `<rect x="${x}" y="${base - hp - hi}" width="${w}" height="${hi}" fill="var(--acc)">` +
        `<title>${t('barI', { y: r.y, v: money(r.in) })}</title></rect>`;
      if (hf > 0) {
        s +=
          `<rect x="${x}" y="${base - hp - hi - hf}" width="${w}" height="${hf}" fill="var(--fee)">` +
          `<title>${t('barF', { y: r.y, v: money(r.fe) })}</title></rect>`;
      }
      if (i % every === 0 || i === rows.length - 1) {
        s += `<text x="${x + w / 2}" y="${H - 8}" text-anchor="middle" font-size="12" fill="var(--muted)">${r.y}</text>`;
      }
    });

    // Čiara: ročne zaplatené v dnešných peniazoch
    const points = rows.map((r, i) => `${L + i * bw + bw / 2},${T + ih - (ih * r.re) / mx}`).join(' ');
    s += `<polyline points="${points}" fill="none" stroke="var(--real)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;

    // Koniec fixácie
    if (A.fixM) {
      const fx = L + (A.fixM / 12) * bw;
      s +=
        `<line x1="${fx}" x2="${fx}" y1="${T}" y2="${T + ih}" stroke="var(--acc)" stroke-width="2" stroke-dasharray="5 4"/>` +
        `<text x="${fx + 6}" y="${T + 12}" font-size="12" font-weight="600" fill="var(--acc)">${t('fixEndChart')}</text>`;
    }

    svg.innerHTML = s;
  }

  const ro = new ResizeObserver(draw);
  ro.observe(svg);

  // ---------- Inputs ----------

  // Číselné polia bez posuvníka → počet desatinných miest
  const NUM = {
    fee: 0, mfee: 2, ins: 2, fixY: 0, rate2: 2, xM: 0, xOne: 0, xYear: 0,
    price: 0, income: 0, otherPay: 0, otherDebt: 0, age: 0, kids: 0,
  };
  const SEL = ['unit', 'insT', 'xMode', 'country', 'adults', 'props', 'czLim', 'czRate'];

  function syncInputs() {
    const c = CUR[S.cur];
    const mo = S.unit === 'm';
    const tm = Math.round(S.yrs * 12);

    Object.assign($('amtR'), { min: c.min, max: c.max, step: c.step });
    $('amtMin').textContent = fmt(c.min);
    $('amtMax').textContent = fmt(c.max);
    $('amt').value = fmt(S.amt);
    $('amtR').value = S.amt;
    $('cur').value = S.cur;

    $('rate').value = nf(S.rate, 2);
    $('rateR').value = S.rate;

    Object.assign($('yrsR'), mo ? { min: 1, max: 480, step: 1 } : { min: 1, max: 40, step: 1 });
    $('tMin').textContent = mo ? t('months', 1) : t('years', 1);
    $('tMax').textContent = mo ? t('months', 480) : t('years', 40);
    $('yrs').value = mo ? tm : nf(S.yrs, 2);
    $('yrsR').value = mo ? tm : S.yrs;
    $('unit').value = S.unit;

    $('inf').value = nf(S.inf, 1);
    $('infR').value = S.inf;

    for (const k in NUM) $(k).value = nf(S[k], NUM[k]);
    for (const k of SEL) $(k).value = S[k];
    $('tax').checked = !!S.tax;
  }

  // Textové pole + posuvník
  const bindR = (id, key, lo, hi) => {
    $(id).addEventListener('input', (e) => {
      S[key] = Math.min(hi, Math.max(lo, parse(e.target.value)));
      $(id + 'R').value = S[key];
      render();
    });
    $(id).addEventListener('blur', syncInputs);
    $(id + 'R').addEventListener('input', (e) => {
      S[key] = parse(e.target.value);
      syncInputs();
      render();
    });
  };

  bindR('amt', 'amt', 0, 1e10);
  bindR('rate', 'rate', 0, 100);
  bindR('inf', 'inf', 0, 30);

  // Doba splácania (roky alebo mesiace)
  const setTerm = (v) => {
    const m = S.unit === 'm' ? v : v * 12;
    S.yrs = Math.min(600, Math.max(1, Math.round(m))) / 12;
  };

  $('yrs').addEventListener('input', (e) => {
    setTerm(parse(e.target.value));
    $('yrsR').value = S.unit === 'm' ? Math.round(S.yrs * 12) : S.yrs;
    render();
  });
  $('yrs').addEventListener('blur', syncInputs);
  $('yrsR').addEventListener('input', (e) => {
    setTerm(parse(e.target.value));
    syncInputs();
    render();
  });

  for (const k in NUM) {
    $(k).addEventListener('input', (e) => {
      S[k] = Math.max(0, parse(e.target.value));
      render();
    });
    $(k).addEventListener('blur', syncInputs);
  }

  for (const k of SEL) {
    $(k).addEventListener('change', (e) => {
      S[k] = e.target.value;
      syncInputs();
      render();
    });
  }

  $('tax').addEventListener('change', (e) => {
    S.tax = e.target.checked;
    render();
  });

  // Zmena meny prepočíta sumy kurzom 25 Kč / €
  $('cur').addEventListener('change', (e) => {
    const k = e.target.value === 'CZK' ? 25 : 1 / 25;
    S.cur = e.target.value;
    const c = CUR[S.cur];

    S.amt = Math.round((S.amt * k) / c.step) * c.step;
    for (const f of ['fee', 'xM', 'xOne']) S[f] = Math.round(S[f] * k);
    S.mfee = Math.round(S.mfee * k * 100) / 100;
    if (S.insT === 'fix') S.ins = Math.round(S.ins * k * 100) / 100;
    for (const f of ['price', 'income', 'otherPay', 'otherDebt']) S[f] = Math.round(S[f] * k);
    S.country = S.cur === 'CZK' ? 'CZ' : 'SK';

    syncInputs();
    render();
  });

  $('lang').addEventListener('change', (e) => {
    S.lang = e.target.value;
    applyLang();
    syncInputs();
    render();
  });

  $('f').addEventListener('submit', (e) => e.preventDefault());

  // ---------- Init ----------

  applyLang();
  syncInputs();
  render();
})();
