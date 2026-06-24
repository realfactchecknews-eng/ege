/* ============================================================
   ENGLISH ЕГЭ · app.js — SPA with hash routing
   ============================================================ */

const app = document.getElementById('app');
const PROG = JSON.parse(localStorage.getItem('en_ege_prog') || '{}');
const HW_DONE = JSON.parse(localStorage.getItem('en_ege_hw') || '{}');
const save = () => localStorage.setItem('en_ege_prog', JSON.stringify(PROG));
const saveHw = () => localStorage.setItem('en_ege_hw', JSON.stringify(HW_DONE));

/* ---- utils ---- */
function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2400);
}
function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
function norm(s) { return s.trim().toLowerCase().replace(/\s+/g, ' '); }
window.navigate = h => { location.hash = h; };

/* ---- particles ---- */
(function particles() {
  const c = document.getElementById('bg-c'), x = c.getContext('2d');
  let w, h, pts = [];
  function size() {
    w = c.width = innerWidth; h = c.height = innerHeight;
    const n = Math.min(70, Math.floor(w * h / 18000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      r: Math.random() * 1.5 + .5
    }));
  }
  size(); addEventListener('resize', size);
  function loop() {
    x.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7);
      x.fillStyle = 'rgba(147,197,253,.5)'; x.fill();
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 110) {
        x.strokeStyle = `rgba(59,130,246,${.12 * (1 - d / 110)})`;
        x.lineWidth = .6; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke();
      }
    }
    requestAnimationFrame(loop);
  } loop();
})();

/* ---- nav ---- */
const NAV_ITEMS = [
  ['#/', 'Home'], ['#/listening', 'Listening'], ['#/reading', 'Reading'],
  ['#/grammar', 'Grammar'], ['#/wordform', 'Word Form.'], ['#/vocab', 'Vocabulary'],
  ['#/writing', 'Writing'], ['#/speaking', 'Speaking'], ['#/irregular', 'Verbs'],
  ['#/timer', 'Timer'], ['#/homework', 'Homework']
];
function buildNav() {
  const h = document.getElementById('nav-links');
  if (!h) return;
  const cur = location.hash || '#/';
  h.innerHTML = NAV_ITEMS.map(([href, t]) =>
    `<a href="${href}" class="${cur === href ? 'active' : ''}">${t}</a>`
  ).join('');
}

/* =================== VIEWS =================== */

/* ---- HOME ---- */
const SECTIONS = [
  { key: 'listening', data: DATA_LISTENING, href: '#/listening' },
  { key: 'reading',   data: DATA_READING,   href: '#/reading' },
  { key: 'grammar',   data: DATA_GRAMMAR,   href: '#/grammar' },
  { key: 'wordform',  data: DATA_WORDFORM,  href: '#/wordform' },
  { key: 'vocab',     data: DATA_VOCAB,     href: '#/vocab' },
  { key: 'writing',   data: { tag:'Tasks 37–38', icon:'✍️', title:'Writing', desc:'Personal letter (email) and opinion essay templates with checklists and phrase banks.' }, href: '#/writing' },
  { key: 'speaking',  data: { tag:'Tasks 1–4 (oral)', icon:'🎙️', title:'Speaking', desc:'4 oral tasks: read aloud, questions from an ad, photo description, photo comparison.' }, href: '#/speaking' },
  { key: 'irregular', data: { tag:'Trainer', icon:'⚡', title:'Irregular Verbs', desc:'Flash trainer: Infinitive → Past Simple → Past Participle. 60 essential verbs.' }, href: '#/irregular' },
];

function viewHome() {
  const cards = SECTIONS.map(({ key, data, href }, i) => {
    const p = PROG[key] || {};
    const pct = p.best != null ? p.best : 0;
    return `<a class="sec-card reveal" href="${href}" style="transition-delay:${(i % 4) * 50}ms"
              onmousemove="glowCard(event,this)">
      <span class="sc-tag">${data.tag}</span>
      <div class="sc-icon">${data.icon}</div>
      <h3>${data.title || data.desc?.split(' ').slice(0, 3).join(' ') + '…'}</h3>
      <p>${(data.desc || '').slice(0, 90)}${data.desc && data.desc.length > 90 ? '…' : ''}</p>
      <div class="sc-bar"><i style="width:${pct}%"></i></div>
    </a>`;
  }).join('');

  return `<div class="hero">
    <div class="badge"><span class="dot"></span> B1+ → B2 · EGE 2026 · HSE</div>
    <h1>Ace your <span class="grad">English</span> exam</h1>
    <p class="sub">All sections in one place: grammar, vocabulary, reading, listening, writing, and speaking — in the exact FIPI format.</p>
    <div class="hero-cta">
      <a href="#/grammar" class="btn btn-primary">Grammar practice →</a>
      <a href="#/writing" class="btn btn-ghost">Writing templates</a>
    </div>
    <div class="hero-stats">
      <div class="stat"><div class="num" data-to="38">0</div><div class="lbl">exam tasks covered</div></div>
      <div class="stat"><div class="num" data-to="${DATA_GRAMMAR.items.length + DATA_WORDFORM.items.length + DATA_VOCAB.items.length}">0</div><div class="lbl">practice examples</div></div>
      <div class="stat"><div class="num" data-to="${IRREGULAR.length}">0</div><div class="lbl">irregular verbs</div></div>
    </div>
  </div>
  <section class="sec">
    <div class="wrap">
      <div class="sec-head reveal">
        <div class="kicker">Choose your section</div>
        <h2>All exam sections covered</h2>
        <p>Click any section to study the theory and practise with real exam-format examples.</p>
      </div>
      <div class="section-cards">${cards}</div>
    </div>
  </section>`;
}

window.glowCard = (e, c) => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', `${e.clientX - r.left}px`);
  c.style.setProperty('--my', `${e.clientY - r.top}px`);
};

/* ---- FILL SECTION ---- */
function viewFill(key, data) {
  const done = (PROG[key] || {}).count || 0;
  const total = data.items.length;
  const theory = data.theory.map(t => `<li>${t}</li>`).join('');
  const items = data.items.map((item, i) => {
    const parts = item.stem.split('___');
    const pre = parts[0] || '';
    const post = parts[1] || '';
    return `<div class="ex-card reveal" id="ex_${key}_${i}">
      <div class="ex-num">Example ${i + 1}</div>
      <div class="ex-word">${item.answer[0].toUpperCase()}</div>
      <div class="fill-wrap">
        <span class="fill-pre">${pre}</span>
        <input class="fill-inp" id="inp_${key}_${i}" placeholder="your answer" autocomplete="off" autocorrect="off" spellcheck="false"
          onkeydown="if(event.key==='Enter')checkFill('${key}',${i})">
        <span class="fill-post">${post}</span>
        <button class="check-btn" onclick="checkFill('${key}',${i})">Check</button>
      </div>
      <div class="explain" id="exp_${key}_${i}">${item.rule}</div>
    </div>`;
  }).join('');

  return `<div class="view-wrap">
    <div class="view-header">
      <button class="back" onclick="navigate('#/')">← Back</button>
      <span class="kicker">${data.tag}</span>
      <h2>${data.tag.includes('Grammar') || data.tag.includes('12') ? 'Grammar: verb forms' :
           data.tag.includes('Word') || data.tag.includes('19') ? 'Word Formation' : 'Vocabulary'}</h2>
      <p>${data.desc}</p>
    </div>
    <div class="view-body">
      <div class="theory-block reveal">
        <h3>📖 Key rules</h3>
        <ul>${theory}</ul>
      </div>
      <div class="pb-head reveal">
        <h3>Practice</h3>
        <span class="pb-counter" id="pb_${key}">${done} / ${total} done</span>
      </div>
      ${items}
    </div>
  </div>`;
}

window.checkFill = (key, i) => {
  const data = key === 'grammar' ? DATA_GRAMMAR : key === 'wordform' ? DATA_WORDFORM : DATA_VOCAB;
  const item = data.items[i];
  const inp = document.getElementById(`inp_${key}_${i}`);
  const card = document.getElementById(`ex_${key}_${i}`);
  if (card.classList.contains('correct') || card.classList.contains('wrong')) return;
  const val = norm(inp.value);
  const correct = item.answer.some(a => norm(a) === val);
  inp.classList.add(correct ? 'ok' : 'no');
  card.classList.add(correct ? 'correct' : 'wrong');
  const exp = document.getElementById(`exp_${key}_${i}`);
  exp.innerHTML = correct
    ? `<strong>✓ Correct!</strong> ${item.rule}`
    : `<strong>✗ Answer: ${item.answer[0]}</strong>. ${item.rule}`;
  exp.classList.add('show');
  inp.disabled = true;
  if (correct) {
    if (!PROG[key]) PROG[key] = { count: 0, best: 0 };
    PROG[key].count = (PROG[key].count || 0) + 1;
    save();
    const pb = document.getElementById(`pb_${key}`);
    if (pb) pb.textContent = `${PROG[key].count} / ${data.items.length} done`;
    toast('Correct! ✓');
  } else {
    toast(`Answer: ${item.answer[0]}`);
  }
};

/* ---- CHOICE SECTION (vocab) ---- */
function viewChoice(key, data) {
  const done = (PROG[key] || {}).count || 0;
  const total = data.items.length;
  const theory = data.theory.map(t => `<li>${t}</li>`).join('');
  const items = data.items.map((item, i) => {
    const opts = item.options.map((o, oi) =>
      `<button class="opt" onclick="checkChoice2('${key}',${i},${oi},${item.answer},'${item.rule.replace(/'/g,"\\'")}',${data.items.length})">${o}</button>`
    ).join('');
    return `<div class="ex-card reveal" id="cx_${key}_${i}">
      <div class="ex-num">Example ${i + 1}</div>
      <div class="ex-stem">${item.stem}</div>
      <div class="opts">${opts}</div>
      <div class="explain" id="cexp_${key}_${i}">${item.rule}</div>
    </div>`;
  }).join('');

  return `<div class="view-wrap">
    <div class="view-header">
      <button class="back" onclick="navigate('#/')">← Back</button>
      <span class="kicker">${data.tag}</span>
      <h2>Vocabulary & Collocations</h2>
      <p>${data.desc}</p>
    </div>
    <div class="view-body">
      <div class="theory-block reveal">
        <h3>📖 Key collocations & phrasal verbs</h3>
        <ul>${theory}</ul>
      </div>
      <div class="pb-head reveal">
        <h3>Practice</h3>
        <span class="pb-counter" id="pb_${key}">${done} / ${total} done</span>
      </div>
      ${items}
    </div>
  </div>`;
}

window.checkChoice2 = (key, i, oi, answer, rule, total) => {
  const card = document.getElementById(`cx_${key}_${i}`);
  if (card.classList.contains('correct') || card.classList.contains('wrong')) return;
  const opts = card.querySelectorAll('.opt');
  opts.forEach(b => b.disabled = true);
  opts[answer].classList.add('show-correct');
  opts[oi].classList.add(oi === answer ? 'sel-correct' : 'sel-wrong');
  card.classList.add(oi === answer ? 'correct' : 'wrong');
  const exp = document.getElementById(`cexp_${key}_${i}`);
  exp.classList.add('show');
  if (oi === answer) {
    if (!PROG[key]) PROG[key] = { count: 0 };
    PROG[key].count = (PROG[key].count || 0) + 1;
    save();
    const pb = document.getElementById(`pb_${key}`);
    if (pb) pb.textContent = `${PROG[key].count} / ${total} done`;
    toast('Correct! ✓');
  } else { toast('Incorrect.'); }
};

/* ---- LISTENING ---- */
function viewListening() {
  const theory = DATA_LISTENING.theory.map(t => `<li>${t}</li>`).join('');
  const stratItems = DATA_LISTENING.practice.map((p, i) => {
    const opts = p.opts.map((o, oi) =>
      `<button class="opt" onclick="checkGenChoice('listening',${i},${oi},${p.answer},'${p.explain.replace(/'/g,"\\'")}',${DATA_LISTENING.practice.length})">${o}</button>`
    ).join('');
    return `<div class="ex-card reveal" id="lc_${i}">
      <div class="ex-num">Strategy ${i + 1}</div>
      <div class="ex-stem">${p.q}</div>
      <div class="opts">${opts}</div>
      <div class="explain" id="lexp_${i}">${p.explain}</div>
    </div>`;
  }).join('');

  const textBlocks = DATA_LISTENING_TEXTS.map((txt, ti) => {
    const qItems = txt.questions.map((q, qi) => {
      const opts = q.opts.map((o, oi) =>
        `<button class="opt" onclick="checkListText(${ti},${qi},${oi},${q.answer},'${q.explain.replace(/'/g,"\\'")}',${txt.questions.length})">${o}</button>`
      ).join('');
      return `<div class="ex-card reveal" id="lt_${ti}_${qi}">
        <div class="ex-num">Q${qi + 1}</div>
        <div class="ex-stem">${q.q}</div>
        <div class="opts">${opts}</div>
        <div class="explain" id="ltexp_${ti}_${qi}">${q.explain}</div>
      </div>`;
    }).join('');
    return `<div class="theory-block reveal" style="margin-top:28px">
      <h3>📝 Text ${ti + 1}: ${txt.title} <span style="font-size:.8rem;font-weight:400;color:var(--muted)">${txt.tag}</span></h3>
      <div class="listen-transcript">${txt.transcript}</div>
    </div>
    <div class="pb-head reveal" style="margin-top:16px"><h3>Questions</h3></div>
    ${qItems}`;
  }).join('');

  return `<div class="view-wrap">
    <div class="view-header">
      <button class="back" onclick="navigate('#/')">← Back</button>
      <span class="kicker">${DATA_LISTENING.tag}</span>
      <h2>Listening</h2>
      <p>${DATA_LISTENING.desc}</p>
    </div>
    <div class="view-body">
      <div class="theory-block reveal"><h3>🎧 Strategies</h3><ul>${theory}</ul></div>
      <div class="pb-head reveal" style="margin-top:24px"><h3>Strategy practice</h3></div>
      ${stratItems}
      <div class="sec-divider reveal"><span>Extended Texts — 3 full passages</span></div>
      ${textBlocks}
    </div>
  </div>`;
}

window.checkListText = (ti, qi, oi, answer, explain, total) => {
  const card = document.getElementById(`lt_${ti}_${qi}`);
  if (!card || card.classList.contains('correct') || card.classList.contains('wrong')) return;
  const opts = card.querySelectorAll('.opt');
  opts.forEach(b => b.disabled = true);
  opts[answer].classList.add('show-correct');
  opts[oi].classList.add(oi === answer ? 'sel-correct' : 'sel-wrong');
  card.classList.add(oi === answer ? 'correct' : 'wrong');
  document.getElementById(`ltexp_${ti}_${qi}`).classList.add('show');
  toast(oi === answer ? 'Correct! ✓' : 'Incorrect.');
};

window.checkGenChoice = (section, i, oi, answer, explain, total) => {
  const card = document.getElementById(`lc_${i}`);
  if (!card || card.classList.contains('correct') || card.classList.contains('wrong')) return;
  const opts = card.querySelectorAll('.opt');
  opts.forEach(b => b.disabled = true);
  opts[answer].classList.add('show-correct');
  opts[oi].classList.add(oi === answer ? 'sel-correct' : 'sel-wrong');
  card.classList.add(oi === answer ? 'correct' : 'wrong');
  document.getElementById(`lexp_${i}`).classList.add('show');
  toast(oi === answer ? 'Correct! ✓' : 'Incorrect.');
};

/* ---- READING ---- */
function viewReading() {
  const theory = DATA_READING.theory.map(t => `<li>${t}</li>`).join('');
  const gapItems = DATA_READING.gaps.map((g, i) => {
    const opts = g.options.map((o, oi) =>
      `<button class="opt" onclick="checkReadGap(${i},${oi},${g.answer},'${g.explain.replace(/'/g,"\\'")}',${DATA_READING.gaps.length})">${o}</button>`
    ).join('');
    return `<div class="ex-card reveal" id="rg_${i}">
      <div class="ex-num">Gap (${g.id})</div>
      <div class="ex-stem">Choose the correct sentence for gap <strong style="color:var(--blue-bright)">(${g.id})</strong></div>
      <div class="opts">${opts}</div>
      <div class="explain" id="rgexp_${i}">${g.explain}</div>
    </div>`;
  }).join('');
  const practiceItems = DATA_READING.practice.map((p, i) => {
    const opts = p.opts.map((o, oi) =>
      `<button class="opt" onclick="checkReadPrac(${i},${oi},${p.answer},'${p.explain.replace(/'/g,"\\'")}',${DATA_READING.practice.length})">${o}</button>`
    ).join('');
    return `<div class="ex-card reveal" id="rp_${i}">
      <div class="ex-num">Strategy tip ${i + 1}</div>
      <div class="ex-stem">${p.q}</div>
      <div class="opts">${opts}</div>
      <div class="explain" id="rpexp_${i}">${p.explain}</div>
    </div>`;
  }).join('');
  return `<div class="view-wrap">
    <div class="view-header">
      <button class="back" onclick="navigate('#/')">← Back</button>
      <span class="kicker">${DATA_READING.tag}</span>
      <h2>Reading Comprehension</h2>
      <p>${DATA_READING.desc}</p>
    </div>
    <div class="view-body">
      <div class="theory-block reveal"><h3>📖 Strategies</h3><ul>${theory}</ul></div>
      <div class="theory-block reveal">
        <h3>Sample text with gaps</h3>
        <div class="reading-text">${DATA_READING.text.replace(/\(([A-Z])\)___/g, '<span class="gap-label">($1)___</span>')}</div>
      </div>
      <div class="pb-head reveal"><h3>Fill in the gaps</h3></div>
      ${gapItems}
      <div class="pb-head reveal" style="margin-top:32px"><h3>Strategy questions</h3></div>
      ${practiceItems}
    </div>
  </div>`;
}
window.checkReadGap = (i, oi, answer, explain) => {
  const card = document.getElementById(`rg_${i}`);
  if (!card || card.classList.contains('correct') || card.classList.contains('wrong')) return;
  const opts = card.querySelectorAll('.opt');
  opts.forEach(b => b.disabled = true);
  opts[answer].classList.add('show-correct');
  opts[oi].classList.add(oi === answer ? 'sel-correct' : 'sel-wrong');
  card.classList.add(oi === answer ? 'correct' : 'wrong');
  document.getElementById(`rgexp_${i}`).classList.add('show');
  toast(oi === answer ? 'Correct! ✓' : 'Incorrect.');
};
window.checkReadPrac = (i, oi, answer, explain) => {
  const card = document.getElementById(`rp_${i}`);
  if (!card || card.classList.contains('correct') || card.classList.contains('wrong')) return;
  const opts = card.querySelectorAll('.opt');
  opts.forEach(b => b.disabled = true);
  opts[answer].classList.add('show-correct');
  opts[oi].classList.add(oi === answer ? 'sel-correct' : 'sel-wrong');
  card.classList.add(oi === answer ? 'correct' : 'wrong');
  document.getElementById(`rpexp_${i}`).classList.add('show');
  toast(oi === answer ? 'Correct! ✓' : 'Incorrect.');
};

/* ---- WRITING ---- */
function viewWriting() {
  const { email, essay } = DATA_WRITING;
  const emailCl = email.checklist.map(c => `<li>${c}</li>`).join('');
  const essayCl = essay.checklist.map(c => `<li>${c}</li>`).join('');
  const emailPh = email.phrases.map(p => `<span class="phrase">${p}</span>`).join('');
  const essayPh = essay.phrases.map(p => `<span class="phrase">${p}</span>`).join('');
  return `<div class="view-wrap">
    <div class="view-header">
      <button class="back" onclick="navigate('#/')">← Back</button>
      <span class="kicker">Tasks 37–38</span>
      <h2>Writing</h2>
      <p>Two writing tasks: a personal letter/email (Task 37) and an opinion essay (Task 38).</p>
    </div>
    <div class="view-body">
      <div class="theory-block reveal">
        <h3>✍️ ${email.title} (${email.tag})</h3>
        <p>${email.intro}</p>
        <h4 style="margin:16px 0 8px;font-size:.95rem">Checklist:</h4>
        <ul class="checklist">${emailCl}</ul>
        <h4 style="margin:16px 0 8px;font-size:.95rem">Useful phrases:</h4>
        <div class="phrases">${emailPh}</div>
        <h4 style="margin:16px 0 8px;font-size:.95rem">Template:</h4>
        <pre class="template-box">${email.template}</pre>
      </div>
      <div class="theory-block reveal">
        <h3>✍️ ${essay.title} (${essay.tag})</h3>
        <p>${essay.intro}</p>
        <h4 style="margin:16px 0 8px;font-size:.95rem">Checklist:</h4>
        <ul class="checklist">${essayCl}</ul>
        <h4 style="margin:16px 0 8px;font-size:.95rem">Useful phrases:</h4>
        <div class="phrases">${essayPh}</div>
        <h4 style="margin:16px 0 8px;font-size:.95rem">Template:</h4>
        <pre class="template-box">${essay.template}</pre>
      </div>
    </div>
  </div>`;
}

/* ---- SPEAKING ---- */
let speakMode = 'theory';
let speakAdIdx = 0;
let speakPhotoIdx = 0;

function viewSpeaking() {
  return `<div class="view-wrap">
    <div class="view-header">
      <button class="back" onclick="navigate('#/')">← Back</button>
      <span class="kicker">${DATA_SPEAKING.tag}</span>
      <h2>Speaking</h2>
      <p>4 oral tasks. Switch between theory and interactive practice.</p>
    </div>
    <div class="view-body">
      <div class="speak-mode-tabs">
        <button class="speak-mode-btn ${speakMode==='theory'?'active':''}" onclick="setSpeakMode('theory')">📖 Theory & Phrases</button>
        <button class="speak-mode-btn ${speakMode==='task2'?'active':''}" onclick="setSpeakMode('task2')">❓ Task 2: Ad Questions</button>
        <button class="speak-mode-btn ${speakMode==='task3'?'active':''}" onclick="setSpeakMode('task3')">🖼️ Task 3: Photo</button>
        <button class="speak-mode-btn ${speakMode==='task4'?'active':''}" onclick="setSpeakMode('task4')">🔀 Task 4: Compare</button>
      </div>
      <div id="speak-content">${renderSpeakContent()}</div>
    </div>
  </div>`;
}

function renderSpeakContent() {
  if (speakMode === 'theory') return renderSpeakTheory();
  if (speakMode === 'task2') return renderSpeakTask2();
  if (speakMode === 'task3') return renderSpeakTask3();
  if (speakMode === 'task4') return renderSpeakTask4();
  return '';
}

function renderSpeakTheory() {
  return DATA_SPEAKING.tasks.map(t => {
    const tips = t.tips.map(tip => `<li>${tip}</li>`).join('');
    const phrases = t.phrases ? `<div class="phrases" style="margin-top:12px">${t.phrases.map(p => `<span class="phrase">${p}</span>`).join('')}</div>` : '';
    return `<div class="theory-block reveal">
      <h3>🎙️ ${t.num}: ${t.title}</h3>
      <div class="speak-badges" style="margin-bottom:12px">${t.desc}</div>
      <ul>${tips}</ul>${phrases}
    </div>`;
  }).join('');
}

function renderSpeakTask2() {
  const ad = DATA_SPEAKING_ADS[speakAdIdx];
  const details = ad.details.map(d => `<div class="speak-ad-detail">${d}</div>`).join('');
  const pointsList = ad.points.map((p, i) => `<div class="speak-point-row">
    <span class="speak-point-num">${i+1}.</span>
    <span class="speak-point-ask">Ask about: <em>${p}</em></span>
    <button class="speak-reveal-small" onclick="this.nextElementSibling.style.display='block';this.style.display='none'">See model ↓</button>
    <div class="speak-model-q" style="display:none">💬 ${ad.models[i]}</div>
  </div>`).join('');

  return `<div class="speak-ad-card">
    <div class="speak-ad-header">${ad.title}</div>
    ${details}
  </div>
  <div class="theory-block reveal">
    <h3>Your 5 questions — given points</h3>
    <div class="speak-badges" style="margin-bottom:16px">
      <span class="speak-badge">⏱ 1.5 min preparation</span>
      <span class="speak-badge">🎙 1.5 min speaking</span>
    </div>
    <p style="color:var(--muted);font-size:.875rem;margin-bottom:16px">For each point below, form a Wh‑question (What / Where / How much / How many / When / Who). Then tap to see a model answer.</p>
    <div class="speak-points">${pointsList}</div>
  </div>
  <div class="speak-nav-btns">
    <button class="btn btn-ghost" onclick="speakAdIdx=(speakAdIdx-1+${DATA_SPEAKING_ADS.length})%${DATA_SPEAKING_ADS.length};document.getElementById('speak-content').innerHTML=renderSpeakContent()">← Previous ad</button>
    <span style="color:var(--muted);align-self:center;font-size:.875rem">Ad ${speakAdIdx+1} / ${DATA_SPEAKING_ADS.length}</span>
    <button class="btn btn-primary" onclick="speakAdIdx=(speakAdIdx+1)%${DATA_SPEAKING_ADS.length};document.getElementById('speak-content').innerHTML=renderSpeakContent()">Next ad →</button>
  </div>`;
}

function renderSpeakTask3() {
  const photos = DATA_SPEAKING_PHOTOS.filter(p => p.task === 3);
  const photo = photos[speakPhotoIdx % photos.length];
  const steps = photo.steps.map((s, si) => `<div class="speak-step" id="spstep_${si}">
    <div class="speak-step-header" onclick="toggleStep(${si})">
      <span class="speak-step-num">${s.step}</span>
      <span style="color:var(--muted);font-size:.8rem">${s.hint}</span>
      <span class="speak-step-toggle">+</span>
    </div>
    <div class="speak-step-reveal" id="sprev_${si}">💬 ${s.model}</div>
  </div>`).join('');

  return `<div class="theory-block reveal">
    <h3>📸 ${photo.label} — describe this scene</h3>
    <div class="speak-badges" style="margin-bottom:12px">
      <span class="speak-badge">⏱ 2 min preparation</span>
      <span class="speak-badge">🎙 2 min speaking</span>
    </div>
    <div class="speak-photo-scene">${photo.scene}</div>
    <p style="color:var(--muted);font-size:.875rem;margin-bottom:12px">Follow the 5-step structure. Click each step to reveal a model answer.</p>
    <div class="speak-steps">${steps}</div>
  </div>
  <div class="speak-nav-btns">
    <button class="btn btn-ghost" onclick="speakPhotoIdx=(speakPhotoIdx-1+${photos.length})%${photos.length};document.getElementById('speak-content').innerHTML=renderSpeakContent()">← Previous photo</button>
    <span style="color:var(--muted);align-self:center;font-size:.875rem">Photo ${speakPhotoIdx%photos.length+1} / ${photos.length}</span>
    <button class="btn btn-primary" onclick="speakPhotoIdx=(speakPhotoIdx+1)%${photos.length};document.getElementById('speak-content').innerHTML=renderSpeakContent()">Next photo →</button>
  </div>`;
}

function renderSpeakTask4() {
  const cp = DATA_SPEAKING_PHOTOS.find(p => p.task === 4);
  const aspects = cp.aspects.map(a => `<tr>
    <td class="cmp-aspect">${a.aspect}</td>
    <td class="cmp-cell">${a.p1}</td>
    <td class="cmp-cell">${a.p2}</td>
  </tr>`).join('');

  return `<div class="theory-block reveal">
    <h3>🔀 Compare two photos</h3>
    <div class="speak-badges" style="margin-bottom:12px">
      <span class="speak-badge">⏱ 2 min preparation</span>
      <span class="speak-badge">🎙 2 min speaking</span>
    </div>
    <div class="cmp-grid">
      <div class="cmp-photo-card"><div class="cmp-photo-label">Photo 1</div><div class="speak-photo-scene">${cp.photo1}</div></div>
      <div class="cmp-photo-card"><div class="cmp-photo-label">Photo 2</div><div class="speak-photo-scene">${cp.photo2}</div></div>
    </div>
    <h4 style="margin:20px 0 12px;font-size:.95rem;font-weight:700">Comparison table</h4>
    <table class="cmp-table">
      <thead><tr><th>Aspect</th><th>Photo 1</th><th>Photo 2</th></tr></thead>
      <tbody>${aspects}</tbody>
    </table>
    <button class="btn btn-ghost" style="margin-top:20px" onclick="document.getElementById('cmp-model').style.display='block';this.style.display='none'">Reveal model answer ↓</button>
    <div id="cmp-model" style="display:none" class="speak-photo-scene" style="margin-top:12px">💬 ${cp.model}</div>
  </div>`;
}

window.setSpeakMode = (mode) => {
  speakMode = mode;
  document.querySelectorAll('.speak-mode-btn').forEach(b => b.classList.remove('active'));
  const idx = ['theory','task2','task3','task4'].indexOf(mode);
  document.querySelectorAll('.speak-mode-btn')[idx]?.classList.add('active');
  document.getElementById('speak-content').innerHTML = renderSpeakContent();
};
window.renderSpeakContent = renderSpeakContent;
window.toggleStep = (si) => {
  const rev = document.getElementById(`sprev_${si}`);
  const tog = document.querySelector(`#spstep_${si} .speak-step-toggle`);
  const isOpen = rev.style.display === 'block';
  rev.style.display = isOpen ? 'none' : 'block';
  if (tog) tog.textContent = isOpen ? '+' : '−';
};

/* ---- IRREGULAR VERBS ---- */
let irrState = {};
function viewIrregular() {
  return `<div class="view-wrap">
    <div class="view-header">
      <button class="back" onclick="navigate('#/')">← Back</button>
      <span class="kicker">Trainer</span>
      <h2>Irregular Verbs</h2>
      <p>${IRREGULAR.length} essential verbs. Tap to reveal forms, then move on.</p>
    </div>
    <div class="view-body">
      <div class="irr-card reveal" id="irr-card">
        <div class="irr-label" id="irr-count">Verb 1 / ${IRREGULAR.length}</div>
        <div class="irr-inf" id="irr-inf">—</div>
        <div class="irr-cells" id="irr-cells" style="display:none">
          <div class="irr-cell"><div class="tl">Past Simple</div><div class="val" id="irr-ps">—</div></div>
          <div class="irr-cell"><div class="tl">Past Participle</div><div class="val" id="irr-pp">—</div></div>
        </div>
        <button class="btn btn-ghost btn-sm" id="irr-show" onclick="irrReveal()" style="margin-top:16px">Reveal →</button>
        <button class="btn btn-primary btn-sm" id="irr-next" onclick="irrNext()" style="display:none;margin-top:12px">Next →</button>
      </div>
      <div class="progress-bar" style="max-width:500px;margin:20px auto;height:4px;border-radius:99px;background:rgba(59,130,246,.15);overflow:hidden">
        <i id="irr-bar" style="display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--blue),var(--violet));transition:width .4s"></i>
      </div>
    </div>
  </div>`;
}

function irrInit() {
  const shuffled = [...IRREGULAR].sort(() => Math.random() - .5);
  irrState = { list: shuffled, cur: 0 };
  irrRender();
}
function irrRender() {
  const { list, cur } = irrState;
  const v = list[cur];
  document.getElementById('irr-count').textContent = `Verb ${cur + 1} / ${list.length}`;
  document.getElementById('irr-inf').textContent = v[0];
  document.getElementById('irr-ps').textContent = v[1];
  document.getElementById('irr-pp').textContent = v[2];
  document.getElementById('irr-cells').style.display = 'none';
  document.getElementById('irr-show').style.display = '';
  document.getElementById('irr-next').style.display = 'none';
  document.getElementById('irr-bar').style.width = `${(cur / list.length) * 100}%`;
}
window.irrReveal = () => {
  document.getElementById('irr-cells').style.display = '';
  document.getElementById('irr-show').style.display = 'none';
  document.getElementById('irr-next').style.display = '';
};
window.irrNext = () => {
  irrState.cur++;
  if (irrState.cur >= irrState.list.length) {
    document.getElementById('irr-card').innerHTML = `<div style="text-align:center;padding:20px">
      <div style="font-size:3rem;margin-bottom:14px">🎉</div>
      <h3 style="font-size:1.4rem;font-weight:800;margin-bottom:8px">All done!</h3>
      <p style="color:var(--muted);margin-bottom:20px">You went through all ${irrState.list.length} irregular verbs.</p>
      <button class="btn btn-primary" onclick="irrInit()">Shuffle & Repeat →</button>
    </div>`;
    return;
  }
  irrRender();
};

/* ---- HOMEWORK ---- */
function viewHomework() {
  const topics = EN_HOMEWORK.map(hw => {
    const total = hw.items.length;
    const done = hw.items.filter((_, i) => HW_DONE[`${hw.id}_${i}`]).length;
    const pct = Math.round(done / total * 100);
    const items = hw.items.map((item, i) => {
      const checked = HW_DONE[`${hw.id}_${i}`] ? 'checked' : '';
      return `<li class="hw-item ${checked ? 'done' : ''}">
        <input type="checkbox" id="hw_${hw.id}_${i}" ${checked} onchange="toggleHw('${hw.id}',${i},this)">
        <label for="hw_${hw.id}_${i}">${item}</label>
      </li>`;
    }).join('');
    return `<div class="hw-topic reveal">
      <h3>${hw.title} <span class="hw-prog-label">${done}/${total}</span></h3>
      <div class="hw-bar"><i style="width:${pct}%"></i></div>
      <ul class="hw-items">${items}</ul>
    </div>`;
  }).join('');
  const totalItems = EN_HOMEWORK.reduce((s, h) => s + h.items.length, 0);
  const totalDone = EN_HOMEWORK.reduce((s, h) => s + h.items.filter((_, i) => HW_DONE[`${h.id}_${i}`]).length, 0);
  return `<div class="view-wrap">
    <div class="view-header">
      <button class="back" onclick="navigate('#/')">← Back</button>
      <span class="kicker">Study Plan</span>
      <h2>Homework by Section</h2>
      <p>Track your progress — saved in the browser. Total: <strong style="color:var(--blue-bright)">${totalDone}/${totalItems}</strong> done.</p>
    </div>
    <div class="view-body">
      <div class="hw-topics">${topics}</div>
      <div style="text-align:center;margin-top:28px">
        <button class="btn btn-ghost" onclick="resetHw()">Reset all progress</button>
      </div>
    </div>
  </div>`;
}

window.toggleHw = (hwId, i, checkbox) => {
  HW_DONE[`${hwId}_${i}`] = checkbox.checked;
  saveHw();
  checkbox.closest('.hw-item').classList.toggle('done', checkbox.checked);
  const topic = checkbox.closest('.hw-topic');
  const all = topic.querySelectorAll('input[type=checkbox]');
  const done = [...all].filter(c => c.checked).length;
  topic.querySelector('.hw-prog-label').textContent = `${done}/${all.length}`;
  topic.querySelector('.hw-bar i').style.width = `${Math.round(done / all.length * 100)}%`;
};
window.resetHw = () => {
  if (!confirm('Reset all homework progress?')) return;
  Object.keys(HW_DONE).forEach(k => delete HW_DONE[k]);
  saveHw(); navigate('#/homework');
};

/* ---- EXAM TIMER (English) ---- */
const EN_TIMER_TOTAL = 180 * 60; // 3 hours in seconds
let enTimer = { running: false, elapsed: 0, ival: null };

function viewTimer() {
  return `<div class="view-wrap">
    <div class="view-header">
      <button class="back" onclick="navigate('#/')">← Back</button>
      <span class="kicker">Exam Simulation</span>
      <h2>EGE English Timer</h2>
      <p>Full exam — 3 hours (180 minutes)</p>
    </div>
    <div class="view-body">
      <div class="timer-card reveal">
        <div class="timer-ring-wrap">
          <svg class="timer-ring" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(59,130,246,.12)" stroke-width="14"/>
            <circle id="en-timer-arc" cx="100" cy="100" r="86" fill="none" stroke="url(#tg-en)" stroke-width="14"
              stroke-dasharray="540" stroke-dashoffset="0" stroke-linecap="round"
              transform="rotate(-90 100 100)" style="transition:stroke-dashoffset .8s"/>
            <defs>
              <linearGradient id="tg-en" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#3b82f6"/>
                <stop offset="100%" stop-color="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="timer-display">
            <div class="timer-hms" id="en-timer-hms">3:00:00</div>
            <div class="timer-lbl" id="en-timer-lbl">Ready to start</div>
          </div>
        </div>
        <div id="en-timer-elapsed" class="timer-elapsed">0 min elapsed out of 180</div>
        <div class="timer-controls">
          <button class="btn btn-primary" id="en-timer-btn" onclick="enTimerToggle()">▶ Start</button>
          <button class="btn btn-ghost" onclick="enTimerReset()">↺ Reset</button>
        </div>
      </div>

      <div class="theory-block reveal" style="margin-top:24px">
        <h3>Recommended plan</h3>
        <div class="timer-plan">
          <div class="tp-row"><span class="tp-time">0:00 – 0:30</span><span class="tp-task">Listening (Tasks 1–9)</span><span class="tp-dur">30 min</span></div>
          <div class="tp-row"><span class="tp-time">0:30 – 0:50</span><span class="tp-task">Reading (Tasks 10–11)</span><span class="tp-dur">20 min</span></div>
          <div class="tp-row"><span class="tp-time">0:50 – 1:20</span><span class="tp-task">Grammar, Word Formation, Vocabulary (12–31)</span><span class="tp-dur">30 min</span></div>
          <div class="tp-row tp-key"><span class="tp-time">1:20 – 2:40</span><span class="tp-task">✍️ Writing — email + opinion essay (37–38)</span><span class="tp-dur">80 min</span></div>
          <div class="tp-row"><span class="tp-time">2:40 – 3:00</span><span class="tp-task">Review & check all answers</span><span class="tp-dur">20 min</span></div>
        </div>
      </div>

      <div class="theory-block reveal">
        <h3>Time management tips</h3>
        <ul>
          <li><strong>Listening is first — focus completely.</strong> You can't replay audio. Underline key words before listening.</li>
          <li><strong>Grammar & Word Formation are fast:</strong> 1–2 minutes per task is enough with good knowledge.</li>
          <li><strong>Writing takes the most time and gives the most marks.</strong> Allocate 40 min to the email and 40 min to the essay.</li>
          <li><strong>Reserve 20 min for review:</strong> check spelling, grammar, and that you answered all 3 questions in the email.</li>
          <li><strong>Don't spend more than 3 min on one Reading gap.</strong> Move on and come back.</li>
        </ul>
      </div>
    </div>
  </div>`;
}

window.enTimerToggle = () => {
  if (enTimer.running) {
    clearInterval(enTimer.ival);
    enTimer.running = false;
    const btn = document.getElementById('en-timer-btn');
    if (btn) btn.textContent = '▶ Continue';
  } else {
    enTimer.running = true;
    const btn = document.getElementById('en-timer-btn');
    if (btn) btn.textContent = '⏸ Pause';
    enTimer.ival = setInterval(() => {
      enTimer.elapsed++;
      const rem = Math.max(0, EN_TIMER_TOTAL - enTimer.elapsed);
      const h = Math.floor(rem / 3600);
      const m = Math.floor((rem % 3600) / 60);
      const s = rem % 60;
      const hmsEl = document.getElementById('en-timer-hms');
      const lblEl = document.getElementById('en-timer-lbl');
      const arcEl = document.getElementById('en-timer-arc');
      const elEl  = document.getElementById('en-timer-elapsed');
      if (!hmsEl) { clearInterval(enTimer.ival); enTimer.running = false; return; }
      hmsEl.textContent = `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      arcEl.style.strokeDashoffset = 540 * (1 - enTimer.elapsed / EN_TIMER_TOTAL);
      const em = Math.floor(enTimer.elapsed / 60);
      elEl.textContent = `${em} min elapsed out of 180`;
      if (em < 30)  lblEl.textContent = '🎧 Listening';
      else if (em < 50)  lblEl.textContent = '📖 Reading';
      else if (em < 80)  lblEl.textContent = '🧩 Grammar / Vocab';
      else if (em < 160) lblEl.textContent = '✍️ Writing';
      else           lblEl.textContent = '✅ Review';
      if (rem === 0) {
        clearInterval(enTimer.ival); enTimer.running = false;
        lblEl.textContent = '⏰ Time is up!';
        toast('Exam time is over!');
      }
    }, 1000);
  }
};

window.enTimerReset = () => {
  clearInterval(enTimer.ival);
  enTimer = { running: false, elapsed: 0, ival: null };
  const hmsEl = document.getElementById('en-timer-hms');
  const lblEl = document.getElementById('en-timer-lbl');
  const arcEl = document.getElementById('en-timer-arc');
  const elEl  = document.getElementById('en-timer-elapsed');
  const btn   = document.getElementById('en-timer-btn');
  if (hmsEl) hmsEl.textContent = '3:00:00';
  if (lblEl) lblEl.textContent = 'Ready to start';
  if (arcEl) arcEl.style.strokeDashoffset = '0';
  if (elEl)  elEl.textContent = '0 min elapsed out of 180';
  if (btn)   btn.textContent = '▶ Start';
};

/* =================== ROUTER =================== */
function render() {
  const hash = location.hash || '#/';
  buildNav();

  const views = {
    '#/':          viewHome,
    '#/listening': viewListening,
    '#/reading':   viewReading,
    '#/grammar':   () => viewFill('grammar', DATA_GRAMMAR),
    '#/wordform':  () => viewFill('wordform', DATA_WORDFORM),
    '#/vocab':     () => viewChoice('vocab', DATA_VOCAB),
    '#/writing':   viewWriting,
    '#/speaking':  viewSpeaking,
    '#/irregular': viewIrregular,
    '#/timer':     viewTimer,
    '#/homework':  viewHomework,
  };

  const fn = views[hash] || viewHome;
  app.innerHTML = fn();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  reveal();

  if (hash === '#/irregular') irrInit();

  document.querySelectorAll('[data-to]').forEach(el => {
    const to = +el.dataset.to, suf = el.dataset.suffix || '';
    let s = 0; const dur = 1200, step = 16;
    const t = setInterval(() => {
      s = Math.min(s + dur / step, dur);
      el.textContent = Math.round(to * (s / dur)) + (s >= dur ? suf : '');
      if (s >= dur) clearInterval(t);
    }, step);
  });
}

/* =================== INIT =================== */
window.addEventListener('hashchange', render);
window.addEventListener('scroll', () =>
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 40)
);
document.getElementById('burger').addEventListener('click', () =>
  document.getElementById('nav-links').classList.toggle('open')
);
document.getElementById('year').textContent = new Date().getFullYear();
render();
