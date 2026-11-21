// Preklady stránky. Kľúče bez prekladu sa berú zo slovenčiny.
// Hodnota je text s parametrami {name}, alebo funkcia (pre skloňovanie a poradie slov).
(() => {
  // 1 / 2–4 / 5+ (slovenčina aj čeština)
  const pl = (n, a, b, c) => (n === 1 ? a : n >= 2 && n <= 4 ? b : c);
  const en = (n, a, b) => (n === 1 ? a : b);

  window.I18N = {
    sk: {
      title: 'Úverová kalkulačka',
      lead:
        'Pre hypotéky, spotrebné úvery, pôžičky na auto aj iné úvery splácané rovnakými mesačnými splátkami. ' +
        'Zadaj výšku úveru, sadzbu a dobu splácania; v rozbaľovacích častiach doplníš poplatky, poistenie, ' +
        'fixáciu a mimoriadne splátky.',
      langAria: 'Jazyk',
      on: 'zapnuté',

      amt: 'Výška úveru',
      curAria: 'Mena',
      amtR: 'Výška úveru posuvník',
      rate: 'Úroková sadzba (p. a.)',
      rateR: 'Úroková sadzba posuvník',
      yrs: 'Doba splácania',
      unitAria: 'Jednotka doby splácania',
      unitY: 'rokov',
      unitM: 'mesiacov',
      yrsR: 'Doba splácania posuvník',
      inf: 'Priemerná inflácia (p. a.)',
      infR: 'Inflácia posuvník',
      country: 'Pravidlá pre limity a dane',
      countrySK: 'Slovensko (NBS, slovenské dane)',
      countryCZ: 'Česko (ČNB, české dane)',

      dFee: 'Poplatky a poistenie',
      fee: 'Jednorazový poplatok',
      mfee: 'Mesačný poplatok (vedenie účtu)',
      ins: 'Poistenie úveru',
      insTAria: 'Typ poistenia',
      insFix: '{sym} mesačne',
      insPct: '% zo splátky',
      hintIns:
        'Poistenie sa platí s každou splátkou. Pri voľbe „% zo splátky“ sa počíta z aktuálnej splátky istiny a úroku.',

      dFix: 'Fixácia a zmena sadzby',
      fixY: 'Dĺžka fixácie',
      rate2: 'Sadzba po fixácii',
      hintFix:
        '0 rokov = sadzba platí počas celej doby. Po skončení fixácie sa splátka prepočíta na zvyšný zostatok a zvyšnú dobu.',

      dX: 'Mimoriadne splátky',
      xM: 'Pravidelne navyše každý mesiac',
      xOne: 'Jednorazová splátka',
      xYear: 'Jednorazovú zaplatím na konci',
      xYearU: '. roka',
      xMode: 'Čo s ušetrenou istinou',
      xModeK: 'Skrátiť dobu splácania (splátka ostáva)',
      xModeN: 'Znížiť splátku (doba ostáva)',
      hintX:
        'Ak banka za mimoriadnu splátku účtuje poplatok, zadaj ho ako jednorazový poplatok a kalkulačka s ním bude počítať.',

      dAff: 'Dostupnosť úveru (LTV, DSTI, DTI)',
      price: 'Hodnota nehnuteľnosti',
      income: 'Čistý mesačný príjem domácnosti',
      otherPay: 'Splátky iných úverov mesačne',
      otherDebt: 'Zostatok iných úverov',
      age: 'Vek (staršieho) žiadateľa',
      adults: 'Dospelí v domácnosti',
      adultsAria: 'Počet dospelých',
      adult1: '1 dospelý',
      adult2: '2 dospelí',
      kids: 'Deti',
      kidsU: 'detí',
      props: 'Nehnuteľnosti na bývanie, ktoré už vlastníš',
      props0: 'Žiadnu – kupujem prvé bývanie',
      props1: 'Jednu',
      props2: 'Dve a viac',

      dTax: 'Daňová úľava na úrokoch',
      taxCheck: 'Uplatním daňovú úľavu na zaplatené úroky',
      czLim: 'Ročný limit odpočtu',
      czLim150: '150 000 Kč – zmluva od 1. 1. 2021',
      czLim300: '300 000 Kč – zmluva do 31. 12. 2020',
      czRate: 'Sadzba dane z príjmu',
      czRate23: '23 % (vyššie príjmy)',

      payK: 'Mesačná splátka',
      aprName: 'RPMN',
      aprDesc: 'ročná percentuálna miera nákladov – úrok, poplatky aj poistenie, bez mimoriadnych splátok',
      affK: 'Dostupnosť podľa limitov',
      splitAria: 'Pomer istiny, úrokov a poplatkov',
      prin: 'Istina',
      interest: 'Úroky',
      oI: 'Úroky spolu',
      oT: 'Celkom zaplatíš',
      realK: 'Očistené o infláciu (v dnešných peniazoch)',
      rL: 'Posledná splátka',
      rI: 'Reálny úrok',
      rT: 'Reálne zaplatíš',
      note:
        'Anuitné splácanie s mesačným úročením. Inflácia sa uvažuje ako konštantná. Skutočná ponuka banky sa môže ' +
        'líšiť. Limity a daňové pravidlá sú zjednodušené a orientačné, o úvere rozhoduje banka.',

      chartH: 'Ako sa splátky delia v čase',
      lgPrin: 'Istina (vrátane mimoriadnych)',
      lgInt: 'Úrok',
      lgReal: 'Ročne zaplatené v dnešných peniazoch',
      chartAria: 'Ročné rozdelenie splátok',
      tableH: 'Splátkový kalendár po rokoch',

      // ----- Dynamické texty -----
      years: (n) => `${n} ${pl(n, 'rok', 'roky', 'rokov')}`,
      months: (n) => `${n} ${pl(n, 'mesiac', 'mesiace', 'mesiacov')}`,
      and: ' a ',
      pays: (n) => `${n} ${pl(n, 'splátka', 'splátky', 'splátok')}`,
      perYear: '{r} % ročne',
      paySubFee: ' · z toho poplatky a poistenie {v}',
      paySubX: ' · + {v} mimoriadne',
      fixSub: 'Po fixácii (od {y}. roka) pri {r} %: {v} mesačne',

      save: 'Mimoriadne splátky ti ušetria <b>{v}</b> na úrokoch',
      saveShort: ' a úver splatíš o <b>{d}</b> skôr (za {t}).',
      saveLow: '; ku koncu splácania budeš platiť <b>{a}</b> namiesto {b} mesačne.',

      affSrcSK: '(NBS)',
      affSrcCZ: '(ČNB)',
      pillNa: 'bez limitu',
      pillBad: 'nad limitom {l}',
      pillOk: 'v limite {l}',
      affMax: 'Najvyšší úver podľa limitov: <b>{v}</b> (obmedzuje {by})',
      affOver: ' – zadaný úver je o <b>{v}</b> vyšší.',

      ltvNm: 'LTV – úver k hodnote nehnuteľnosti',
      ltv3SK: 'tretia a ďalšia nehnuteľnosť',
      ltv3CZ: 'investičná nehnuteľnosť (tretia a ďalšia)',
      ltvYoungSK: 'do 35 rokov, prvé bývanie',
      ltvYoungCZ: 'žiadateľ do 36 rokov',
      std: 'štandardný limit',
      dstiNm: 'DSTI – splátky k príjmu',
      dstiSK: 'príjem mínus životné minimum {zm}; splátka pri sadzbe {r} % (rezerva NBS)',
      dstiCZ: 'limit ČNB je deaktivovaný, banka posudzuje podľa vlastných pravidiel',
      dtiNm: 'DTI – celkový dlh k ročnému príjmu',
      dtiAge: 'znížený – vek {a} rokov a splatnosť po 65. roku',
      dtiInv: 'odporúčanie ČNB pre investičné nehnuteľnosti',
      dtiOwn: 'pri vlastnom bývaní je limit ČNB deaktivovaný',

      hintAffSK:
        'LTV podľa pravidiel NBS od 1. 1. 2027 (70 % pre tretiu a ďalšiu nehnuteľnosť od 1. 7. 2027). ' +
        'Do konca roka 2026 platí 80 %, 90 % len ako výnimka banky. DSTI: najviac 60 % z príjmu po odpočítaní ' +
        'životného minima. DTI: najviac 8-násobok ročného príjmu, od 41 rokov pri splatnosti po 65. roku menej.',
      hintAffCZ:
        'LTV: 80 %, pre žiadateľov do 36 rokov 90 %. Investičná nehnuteľnosť (tretia a ďalšia, alebo nie na ' +
        'vlastné bývanie, alebo keď sa do príjmu počíta nájomné): odporúčané LTV 70 % a DTI 7. DSTI a DTI sú ' +
        'inak deaktivované.',
      hintTaxSK:
        'Daňový bonus pri zmluvách od 1. 1. 2024: 50 % zo zaplatených úrokov, najviac 1 200 € ročne, počas ' +
        'prvých 5 rokov. Podmienky: vek 18 – 35 rokov pri podaní žiadosti (berie sa vek z časti Dostupnosť) a ' +
        'priemerný mesačný príjem v predchádzajúcom roku najviac 1,6-násobok priemernej mzdy (pre zmluvy v ' +
        'roku 2026: 2 592 €). Nevzťahuje sa na spotrebné úvery, americké hypotéky ani refinancovanie.',
      hintTaxCZ:
        'Odpočet zaplatených úrokov od základu dane, limit platí pre celú domácnosť. Úspora = odpočet × sadzba ' +
        'dane. Neplatí pre americké hypotéky; poplatky a poistné sa neodpočítavajú.',

      taxNo: 'Na daňový bonus nemáš nárok: je len pre žiadateľov do 35 rokov (vek zadaný v časti Dostupnosť).',
      taxBonus: 'Daňový bonus',
      taxDed: 'Odpočet úrokov',
      taxFirst5: ', počas prvých 5 rokov',
      taxMsg:
        '{what} ti vráti spolu <b>{v}</b> (v 1. roku {y1}{first5}). ' +
        'Úroky po úľave: <b>{i}</b>, celkom zaplatíš po úľave <b>{t}</b>.',

      heads: ['Rok', 'Zaplatené spolu', 'Istina', 'Úrok', 'Poplatky a poistenie', 'Zostatok', 'V dnešných peniazoch'],
      thTaxSK: 'Daňový bonus',
      thTaxCZ: 'Úspora na dani',
      yearCell: (y) => `${y}.`,
      fixEnd: 'Koniec fixácie',
      fixEndChart: 'koniec fixácie',
      total: 'Spolu',
      plusFee: '+ jednorazový poplatok',
      grand: 'Celkom',
      barP: '{y}. rok – istina {v}',
      barI: '{y}. rok – úrok {v}',
      barF: '{y}. rok – poplatky a poistenie {v}',
    },

    cs: {
      title: 'Úvěrová kalkulačka',
      lead:
        'Pro hypotéky, spotřebitelské úvěry, půjčky na auto i jiné úvěry splácené stejnými měsíčními splátkami. ' +
        'Zadej výši úvěru, sazbu a dobu splácení; v rozbalovacích částech doplníš poplatky, pojištění, ' +
        'fixaci a mimořádné splátky.',
      langAria: 'Jazyk',
      on: 'zapnuto',

      amt: 'Výše úvěru',
      curAria: 'Měna',
      amtR: 'Výše úvěru posuvník',
      rate: 'Úroková sazba (p. a.)',
      rateR: 'Úroková sazba posuvník',
      yrs: 'Doba splácení',
      unitAria: 'Jednotka doby splácení',
      unitY: 'let',
      unitM: 'měsíců',
      yrsR: 'Doba splácení posuvník',
      inf: 'Průměrná inflace (p. a.)',
      infR: 'Inflace posuvník',
      country: 'Pravidla pro limity a daně',
      countrySK: 'Slovensko (NBS, slovenské daně)',
      countryCZ: 'Česko (ČNB, české daně)',

      dFee: 'Poplatky a pojištění',
      fee: 'Jednorázový poplatek',
      mfee: 'Měsíční poplatek (vedení účtu)',
      ins: 'Pojištění úvěru',
      insTAria: 'Typ pojištění',
      insFix: '{sym} měsíčně',
      insPct: '% ze splátky',
      hintIns:
        'Pojištění se platí s každou splátkou. Při volbě „% ze splátky“ se počítá z aktuální splátky jistiny a úroku.',

      dFix: 'Fixace a změna sazby',
      fixY: 'Délka fixace',
      rate2: 'Sazba po fixaci',
      hintFix:
        '0 let = sazba platí po celou dobu. Po skončení fixace se splátka přepočítá na zbývající zůstatek a zbývající dobu.',

      dX: 'Mimořádné splátky',
      xM: 'Pravidelně navíc každý měsíc',
      xOne: 'Jednorázová splátka',
      xYear: 'Jednorázovou zaplatím na konci',
      xYearU: '. roku',
      xMode: 'Co s ušetřenou jistinou',
      xModeK: 'Zkrátit dobu splácení (splátka zůstává)',
      xModeN: 'Snížit splátku (doba zůstává)',
      hintX:
        'Pokud banka za mimořádnou splátku účtuje poplatek, zadej ho jako jednorázový poplatek a kalkulačka s ním bude počítat.',

      dAff: 'Dostupnost úvěru (LTV, DSTI, DTI)',
      price: 'Hodnota nemovitosti',
      income: 'Čistý měsíční příjem domácnosti',
      otherPay: 'Splátky jiných úvěrů měsíčně',
      otherDebt: 'Zůstatek jiných úvěrů',
      age: 'Věk (staršího) žadatele',
      adults: 'Dospělí v domácnosti',
      adultsAria: 'Počet dospělých',
      adult1: '1 dospělý',
      adult2: '2 dospělí',
      kids: 'Děti',
      kidsU: 'dětí',
      props: 'Nemovitosti k bydlení, které už vlastníš',
      props0: 'Žádnou – kupuji první bydlení',
      props1: 'Jednu',
      props2: 'Dvě a více',

      dTax: 'Daňová úleva na úrocích',
      taxCheck: 'Uplatním daňovou úlevu na zaplacené úroky',
      czLim: 'Roční limit odpočtu',
      czLim150: '150 000 Kč – smlouva od 1. 1. 2021',
      czLim300: '300 000 Kč – smlouva do 31. 12. 2020',
      czRate: 'Sazba daně z příjmu',
      czRate23: '23 % (vyšší příjmy)',

      payK: 'Měsíční splátka',
      aprName: 'RPSN',
      aprDesc: 'roční procentní sazba nákladů – úrok, poplatky i pojištění, bez mimořádných splátek',
      affK: 'Dostupnost podle limitů',
      splitAria: 'Poměr jistiny, úroků a poplatků',
      prin: 'Jistina',
      interest: 'Úroky',
      oI: 'Úroky celkem',
      oT: 'Celkem zaplatíš',
      realK: 'Očištěno o inflaci (v dnešních penězích)',
      rL: 'Poslední splátka',
      rI: 'Reálný úrok',
      rT: 'Reálně zaplatíš',
      note:
        'Anuitní splácení s měsíčním úročením. Inflace se uvažuje jako konstantní. Skutečná nabídka banky se může ' +
        'lišit. Limity a daňová pravidla jsou zjednodušená a orientační, o úvěru rozhoduje banka.',

      chartH: 'Jak se splátky dělí v čase',
      lgPrin: 'Jistina (včetně mimořádných)',
      lgInt: 'Úrok',
      lgReal: 'Ročně zaplaceno v dnešních penězích',
      chartAria: 'Roční rozdělení splátek',
      tableH: 'Splátkový kalendář po letech',

      years: (n) => `${n} ${pl(n, 'rok', 'roky', 'let')}`,
      months: (n) => `${n} ${pl(n, 'měsíc', 'měsíce', 'měsíců')}`,
      and: ' a ',
      pays: (n) => `${n} ${pl(n, 'splátka', 'splátky', 'splátek')}`,
      perYear: '{r} % ročně',
      paySubFee: ' · z toho poplatky a pojištění {v}',
      paySubX: ' · + {v} mimořádně',
      fixSub: 'Po fixaci (od {y}. roku) při {r} %: {v} měsíčně',

      save: 'Mimořádné splátky ti ušetří <b>{v}</b> na úrocích',
      saveShort: ' a úvěr splatíš o <b>{d}</b> dříve (za {t}).',
      saveLow: '; ke konci splácení budeš platit <b>{a}</b> místo {b} měsíčně.',

      affSrcSK: '(NBS)',
      affSrcCZ: '(ČNB)',
      pillNa: 'bez limitu',
      pillBad: 'nad limitem {l}',
      pillOk: 'v limitu {l}',
      affMax: 'Nejvyšší úvěr podle limitů: <b>{v}</b> (omezuje {by})',
      affOver: ' – zadaný úvěr je o <b>{v}</b> vyšší.',

      ltvNm: 'LTV – úvěr k hodnotě nemovitosti',
      ltv3SK: 'třetí a další nemovitost',
      ltv3CZ: 'investiční nemovitost (třetí a další)',
      ltvYoungSK: 'do 35 let, první bydlení',
      ltvYoungCZ: 'žadatel do 36 let',
      std: 'standardní limit',
      dstiNm: 'DSTI – splátky k příjmu',
      dstiSK: 'příjem minus životní minimum {zm}; splátka při sazbě {r} % (rezerva NBS)',
      dstiCZ: 'limit ČNB je deaktivovaný, banka posuzuje podle vlastních pravidel',
      dtiNm: 'DTI – celkový dluh k ročnímu příjmu',
      dtiAge: 'snížený – věk {a} let a splatnost po 65. roce',
      dtiInv: 'doporučení ČNB pro investiční nemovitosti',
      dtiOwn: 'u vlastního bydlení je limit ČNB deaktivovaný',

      hintAffSK:
        'LTV podle pravidel NBS od 1. 1. 2027 (70 % pro třetí a další nemovitost od 1. 7. 2027). ' +
        'Do konce roku 2026 platí 80 %, 90 % jen jako výjimka banky. DSTI: nejvýše 60 % z příjmu po odečtení ' +
        'životního minima. DTI: nejvýše 8násobek ročního příjmu, od 41 let při splatnosti po 65. roce méně.',
      hintAffCZ:
        'LTV: 80 %, pro žadatele do 36 let 90 %. Investiční nemovitost (třetí a další, nebo ne k vlastnímu ' +
        'bydlení, nebo když se do příjmu počítá nájemné): doporučené LTV 70 % a DTI 7. DSTI a DTI jsou ' +
        'jinak deaktivované.',
      hintTaxSK:
        'Daňový bonus u smluv od 1. 1. 2024: 50 % ze zaplacených úroků, nejvýše 1 200 € ročně, během ' +
        'prvních 5 let. Podmínky: věk 18 – 35 let při podání žádosti (bere se věk z části Dostupnost) a ' +
        'průměrný měsíční příjem v předchozím roce nejvýše 1,6násobek průměrné mzdy (pro smlouvy v ' +
        'roce 2026: 2 592 €). Nevztahuje se na spotřebitelské úvěry, americké hypotéky ani refinancování.',
      hintTaxCZ:
        'Odpočet zaplacených úroků od základu daně, limit platí pro celou domácnost. Úspora = odpočet × sazba ' +
        'daně. Neplatí pro americké hypotéky; poplatky a pojistné se neodečítají.',

      taxNo: 'Na daňový bonus nemáš nárok: je jen pro žadatele do 35 let (věk zadaný v části Dostupnost).',
      taxBonus: 'Daňový bonus',
      taxDed: 'Odpočet úroků',
      taxFirst5: ', během prvních 5 let',
      taxMsg:
        '{what} ti vrátí celkem <b>{v}</b> (v 1. roce {y1}{first5}). ' +
        'Úroky po úlevě: <b>{i}</b>, celkem zaplatíš po úlevě <b>{t}</b>.',

      heads: ['Rok', 'Zaplaceno celkem', 'Jistina', 'Úrok', 'Poplatky a pojištění', 'Zůstatek', 'V dnešních penězích'],
      thTaxSK: 'Daňový bonus',
      thTaxCZ: 'Úspora na dani',
      yearCell: (y) => `${y}.`,
      fixEnd: 'Konec fixace',
      fixEndChart: 'konec fixace',
      total: 'Celkem',
      plusFee: '+ jednorázový poplatek',
      grand: 'Celkem s poplatkem',
      barP: '{y}. rok – jistina {v}',
      barI: '{y}. rok – úrok {v}',
      barF: '{y}. rok – poplatky a pojištění {v}',
    },

    en: {
      title: 'Loan calculator',
      lead:
        'For mortgages, consumer loans, car loans and any other loan repaid in equal monthly instalments. ' +
        'Enter the loan amount, rate and term; the expandable sections add fees, insurance, a fixed-rate ' +
        'period and extra payments.',
      langAria: 'Language',
      on: 'on',

      amt: 'Loan amount',
      curAria: 'Currency',
      amtR: 'Loan amount slider',
      rate: 'Interest rate (p.a.)',
      rateR: 'Interest rate slider',
      yrs: 'Loan term',
      unitAria: 'Loan term unit',
      unitY: 'years',
      unitM: 'months',
      yrsR: 'Loan term slider',
      inf: 'Average inflation (p.a.)',
      infR: 'Inflation slider',
      country: 'Rules for limits and taxes',
      countrySK: 'Slovakia (NBS, Slovak taxes)',
      countryCZ: 'Czechia (CNB, Czech taxes)',

      dFee: 'Fees and insurance',
      fee: 'One-time fee',
      mfee: 'Monthly fee (account maintenance)',
      ins: 'Loan insurance',
      insTAria: 'Insurance type',
      insFix: '{sym} per month',
      insPct: '% of payment',
      hintIns:
        'Insurance is paid with every instalment. With “% of payment” it is calculated from the current principal and interest payment.',

      dFix: 'Fixed-rate period and rate change',
      fixY: 'Fixed-rate period',
      rate2: 'Rate after fixed period',
      hintFix:
        '0 years = the rate applies for the whole term. When the fixed period ends, the payment is recalculated from the remaining balance and term.',

      dX: 'Extra payments',
      xM: 'Extra every month',
      xOne: 'One-time payment',
      xYear: 'Make the one-time payment at the end of year',
      xYearU: '',
      xMode: 'What to do with the saved principal',
      xModeK: 'Shorten the term (payment stays)',
      xModeN: 'Lower the payment (term stays)',
      hintX:
        'If the bank charges a fee for an extra payment, enter it as the one-time fee and the calculator will include it.',

      dAff: 'Loan affordability (LTV, DSTI, DTI)',
      price: 'Property value',
      income: 'Net monthly household income',
      otherPay: 'Other loan payments per month',
      otherDebt: 'Balance of other loans',
      age: 'Age of the (older) applicant',
      adults: 'Adults in household',
      adultsAria: 'Number of adults',
      adult1: '1 adult',
      adult2: '2 adults',
      kids: 'Children',
      kidsU: 'children',
      props: 'Residential properties you already own',
      props0: 'None – buying my first home',
      props1: 'One',
      props2: 'Two or more',

      dTax: 'Tax relief on interest',
      taxCheck: 'Claim tax relief on interest paid',
      czLim: 'Annual deduction limit',
      czLim150: '150 000 Kč – contract from 1 Jan 2021',
      czLim300: '300 000 Kč – contract until 31 Dec 2020',
      czRate: 'Income tax rate',
      czRate23: '23 % (higher incomes)',

      payK: 'Monthly payment',
      aprName: 'APR',
      aprDesc: 'annual percentage rate of charge – interest, fees and insurance, excluding extra payments',
      affK: 'Affordability by limits',
      splitAria: 'Share of principal, interest and fees',
      prin: 'Principal',
      interest: 'Interest',
      oI: 'Total interest',
      oT: 'Total you pay',
      realK: 'Adjusted for inflation (in today’s money)',
      rL: 'Last payment',
      rI: 'Real interest',
      rT: 'Real total paid',
      note:
        'Annuity repayment with monthly compounding. Inflation is assumed constant. The bank’s actual offer may ' +
        'differ. Limits and tax rules are simplified and indicative; the bank decides on the loan.',

      chartH: 'How payments split over time',
      lgPrin: 'Principal (incl. extra payments)',
      lgInt: 'Interest',
      lgReal: 'Paid per year in today’s money',
      chartAria: 'Yearly breakdown of payments',
      tableH: 'Yearly repayment schedule',

      years: (n) => `${n} ${en(n, 'year', 'years')}`,
      months: (n) => `${n} ${en(n, 'month', 'months')}`,
      and: ' and ',
      pays: (n) => `${n} ${en(n, 'payment', 'payments')}`,
      perYear: '{r} % p.a.',
      paySubFee: ' · incl. fees and insurance {v}',
      paySubX: ' · + {v} extra',
      fixSub: 'After the fixed period (from year {y}) at {r} %: {v} per month',

      save: 'Extra payments save you <b>{v}</b> in interest',
      saveShort: ' and you repay the loan <b>{d}</b> sooner (in {t}).',
      saveLow: '; towards the end you will pay <b>{a}</b> instead of {b} per month.',

      affSrcSK: '(NBS)',
      affSrcCZ: '(CNB)',
      pillNa: 'no limit',
      pillBad: 'over limit {l}',
      pillOk: 'within limit {l}',
      affMax: 'Maximum loan under the limits: <b>{v}</b> (limited by {by})',
      affOver: ' – the entered loan is <b>{v}</b> higher.',

      ltvNm: 'LTV – loan to property value',
      ltv3SK: 'third or further property',
      ltv3CZ: 'investment property (third or further)',
      ltvYoungSK: 'up to 35 years old, first home',
      ltvYoungCZ: 'applicant under 36',
      std: 'standard limit',
      dstiNm: 'DSTI – debt service to income',
      dstiSK: 'income minus subsistence minimum {zm}; payment at {r} % rate (NBS buffer)',
      dstiCZ: 'the CNB limit is deactivated; the bank assesses by its own rules',
      dtiNm: 'DTI – total debt to annual income',
      dtiAge: 'reduced – age {a} and maturity after age 65',
      dtiInv: 'CNB recommendation for investment properties',
      dtiOwn: 'for owner-occupied housing the CNB limit is deactivated',

      hintAffSK:
        'LTV per NBS rules from 1 Jan 2027 (70 % for the third and further property from 1 Jul 2027). ' +
        'Until the end of 2026 the limit is 80 %, 90 % only as a bank exception. DSTI: at most 60 % of income ' +
        'after deducting the subsistence minimum. DTI: at most 8 times annual income, less from age 41 if the ' +
        'loan matures after age 65.',
      hintAffCZ:
        'LTV: 80 %, 90 % for applicants under 36. Investment property (third or further, not for own housing, ' +
        'or when rental income is counted): recommended LTV 70 % and DTI 7. DSTI and DTI are otherwise ' +
        'deactivated.',
      hintTaxSK:
        'Tax bonus for contracts from 1 Jan 2024: 50 % of interest paid, up to 1 200 € per year, for the ' +
        'first 5 years. Conditions: age 18–35 when applying (age is taken from the Affordability section) and ' +
        'average monthly income in the previous year at most 1.6 times the average wage (for contracts in ' +
        '2026: 2 592 €). Does not apply to consumer loans, American mortgages or refinancing.',
      hintTaxCZ:
        'Interest paid is deducted from the tax base; the limit applies to the whole household. Saving = ' +
        'deduction × tax rate. Does not apply to American mortgages; fees and insurance premiums are not deductible.',

      taxNo: 'You are not eligible for the tax bonus: it is only for applicants up to 35 (age entered under Affordability).',
      taxBonus: 'The tax bonus',
      taxDed: 'The interest deduction',
      taxFirst5: ', over the first 5 years',
      taxMsg:
        '{what} returns <b>{v}</b> in total ({y1} in year 1{first5}). ' +
        'Interest after relief: <b>{i}</b>, total paid after relief <b>{t}</b>.',

      heads: ['Year', 'Total paid', 'Principal', 'Interest', 'Fees and insurance', 'Balance', 'In today’s money'],
      thTaxSK: 'Tax bonus',
      thTaxCZ: 'Tax saving',
      yearCell: (y) => `${y}`,
      fixEnd: 'End of fixed period',
      fixEndChart: 'end of fixed period',
      total: 'Total',
      plusFee: '+ one-time fee',
      grand: 'Grand total',
      barP: 'Year {y} – principal {v}',
      barI: 'Year {y} – interest {v}',
      barF: 'Year {y} – fees and insurance {v}',
    },
  };
})();
