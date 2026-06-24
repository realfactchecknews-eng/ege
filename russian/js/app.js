/* ============================================================
   РУССКИЙ ЕГЭ · app.js — SPA с hash-routing
   ============================================================ */

const AI_ESSAY_ENDPOINT = ''; // Cloudflare Worker URL — задать позже

const app = document.getElementById('app');
const PROG = JSON.parse(localStorage.getItem('ru_ege_prog') || '{}');
const HW_DONE = JSON.parse(localStorage.getItem('ru_ege_hw') || '{}');
const save = () => localStorage.setItem('ru_ege_prog', JSON.stringify(PROG));
const saveHw = () => localStorage.setItem('ru_ege_hw', JSON.stringify(HW_DONE));

/* Merge extra practice examples into RU_TASKS */
function mergeExtra() {
  if (typeof RU_EXTRA === 'undefined') return;
  Object.entries(RU_EXTRA).forEach(([idxStr, items]) => {
    const idx = parseInt(idxStr);
    if (RU_TASKS[idx]) RU_TASKS[idx].practice.push(...items);
  });
}
mergeExtra();

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
function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

/* ---- nav ---- */
const NAV = [
  ['#/', 'Главная'], ['#/tasks', 'Задания'], ['#/stress', 'Ударения'],
  ['#/paronims', 'Паронимы'], ['#/homework', 'Домашнее'], ['#/essay', 'Сочинение'],
  ['#/ai-essay', '🤖 ИИ-Эссе'], ['#/timer', 'Таймер'], ['#/resources', 'Материалы']
];
function buildNav() {
  const h = document.getElementById('nav-links');
  if (!h) return;
  const cur = location.hash || '#/';
  h.innerHTML = NAV.map(([href, t]) =>
    `<a href="${href}" class="${cur === href ? 'active' : ''}">${t}</a>`
  ).join('');
}

/* =================== VIEWS =================== */

/* ---- HOME ---- */
function viewHome() {
  const totalTasks = RU_TASKS.length;
  const doneCount = Object.values(PROG).filter(p => p && p.done > 0).length;
  const pct = Math.round(doneCount / totalTasks * 100);

  return `<section class="hero" id="top">
    <div class="badge"><span class="dot"></span> Русский язык · ЕГЭ 2026</div>
    <h1>Сдай ЕГЭ по <span class="grad">русскому</span><br>на максимум</h1>
    <p class="sub">27 заданий с теорией и практикой, тренажёр ударений, паронимы ФИПИ, шаблон сочинения и домашние задания с прогрессом.</p>
    <div class="hero-cta">
      <a href="#/stress" class="btn btn-primary">Тренажёр ударений →</a>
      <a href="#/tasks" class="btn btn-ghost">Все 27 заданий</a>
    </div>
    <div class="hero-stats">
      <div class="stat"><div class="num" data-to="27">0</div><div class="lbl">заданий разобрано</div></div>
      <div class="stat"><div class="num" data-to="${STRESS_WORDS.length}">0</div><div class="lbl">слов на ударение</div></div>
      <div class="stat"><div class="num" data-to="${pct}" data-suffix="%">0</div><div class="lbl">твой прогресс</div></div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="sec-head reveal">
        <div class="kicker">Структура экзамена</div>
        <h2>27 заданий — каждое под контролем</h2>
        <p>Открой любое задание, чтобы прочитать теорию и потренироваться на реальных примерах.</p>
      </div>
      <div class="tasks-grid" id="tasks-grid-home"></div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="sec-head reveal">
        <div class="kicker">С чего начать</div>
        <h2>Дорожная карта к 90+ баллам</h2>
      </div>
      <div class="roadmap">
        <div class="step reveal"><div class="n">1</div><div><h3>Закрой орфоэпию и паронимы</h3><p>Задания 4–5 — лёгкие баллы. Выучи минимум через тренажёр и список паронимов.</p></div></div>
        <div class="step reveal"><div class="n">2</div><div><h3>Разбери орфографию</h3><p>Задания 9–15: корни, приставки, суффиксы, Н/НН, НЕ. Систематизируй правила и решай блоками.</p></div></div>
        <div class="step reveal"><div class="n">3</div><div><h3>Освой пунктуацию</h3><p>Задания 16–21 — самые «дорогие» в тесте. Запятые, тире, двоеточие в сложных предложениях.</p></div></div>
        <div class="step reveal"><div class="n">4</div><div><h3>Работай с текстом</h3><p>Задания 1–3 и 22–26: смысловой анализ, средства выразительности.</p></div></div>
        <div class="step reveal"><div class="n">5</div><div><h3>Пиши сочинение (27)</h3><p>Проблема → комментарий → позиция → своё мнение. Пиши 1 сочинение в неделю.</p></div></div>
        <div class="step reveal"><div class="n">6</div><div><h3>Решай варианты целиком</h3><p>За 2 месяца до экзамена — реальные варианты на время. Анализируй ошибки.</p></div></div>
      </div>
    </div>
  </section>`;
}

/* ---- TASKS LIST ---- */
function viewTasks() {
  const cards = RU_TASKS.map((t, i) => {
    const p = PROG[i] || {};
    const done = p.done || 0;
    const total = t.practice.length;
    const pct = total ? Math.round(done / total * 100) : 0;
    return `<article class="task-card reveal" style="transition-delay:${(i % 4) * 50}ms" data-idx="${i}">
      <span class="tnum">Задание ${t.num}</span>
      <h3>${t.title}</h3>
      <p>${t.desc}</p>
      <div class="tc-prog"><i style="width:${pct}%"></i></div>
    </article>`;
  }).join('');

  return `<div class="task-view">
    <div class="task-header">
      <div class="kicker">ЕГЭ по русскому языку</div>
      <h2>Все 27 заданий</h2>
      <p>Открой задание — теория, разбор и практика с автопроверкой.</p>
    </div>
    <div class="task-body">
      <div class="tasks-grid" id="tasks-grid">${cards}</div>
    </div>
  </div>`;
}

/* ---- TASK DETAIL ---- */
function viewTask(idx) {
  const t = RU_TASKS[idx];
  if (!t) return viewTasks();
  if (!PROG[idx]) PROG[idx] = { done: 0 };

  const maxScore = t.maxScore || 1;
  const exCount  = t.practice.length;

  const theory = t.theory.map(item => {
    const isWarn = item.startsWith('!');
    const text = isWarn ? item.slice(1).trim() : item;
    const cls  = isWarn ? 'theory-warn' : '';
    return `<li class="${cls}">${text.replace(/«(.+?)»/g, '«<em>$1</em>»')}</li>`;
  }).join('');

  const practices = t.practice.map((p, pi) => buildExCard(p, idx, pi)).join('');

  return `<div class="task-view">
    <div class="task-header">
      <button class="back" onclick="navigate('#/tasks')">← Все задания</button>
      <div class="tnum">Задание ${t.num}</div>
      <h2>${t.title}</h2>
      <div class="task-meta">
        <span class="meta-chip">${maxScore} балл${maxScore === 1 ? '' : maxScore < 5 ? 'а' : 'ов'}</span>
        <span class="meta-chip mc-green">ЕГЭ 2026</span>
        <span class="meta-chip mc-gold">${exCount} пример${exCount === 1 ? '' : exCount < 5 ? 'а' : 'ов'}</span>
      </div>
      <p>${t.desc}</p>
    </div>
    <div class="task-body">
      <div class="theory-block reveal">
        <h3>Теория и правила</h3>
        <ul>${theory}</ul>
      </div>
      <div class="practice-block reveal">
        <div class="pb-head">
          <h3>Практика</h3>
          <span class="pb-counter">0 / ${t.practice.length} выполнено</span>
        </div>
        ${practices}
      </div>
    </div>
  </div>`;
}

function buildExCard(p, taskIdx, pi) {
  const id = `ex_${taskIdx}_${pi}`;
  if (p.type === 'choice') {
    const opts = p.opts.map((o, oi) =>
      `<button class="opt" data-oi="${oi}" onclick="checkChoice(this,'${id}',${p.answer},'${taskIdx}',${p.opts.length})">${o}</button>`
    ).join('');
    return `<div class="ex-card reveal" id="${id}">
      <div class="ex-num">Пример ${pi + 1}</div>
      <div class="q">${p.q}</div>
      <div class="opts">${opts}</div>
      <div class="explain">${p.explain}</div>
    </div>`;
  }
  return `<div class="ex-card reveal" id="${id}">
    <div class="ex-num">Пример ${pi + 1}</div>
    <div class="q">${p.q}</div>
    <div class="explain">${p.explain}</div>
  </div>`;
}

function checkChoice(btn, id, answer, taskIdx, total) {
  const card = document.getElementById(id);
  if (card.classList.contains('correct') || card.classList.contains('wrong')) return;
  const oi = parseInt(btn.dataset.oi);
  const opts = card.querySelectorAll('.opt');
  opts.forEach(b => b.disabled = true);
  opts[answer].classList.add('show-correct');
  if (oi === answer) {
    btn.classList.add('sel-correct');
    card.classList.add('correct');
    if (!PROG[taskIdx]) PROG[taskIdx] = { done: 0 };
    PROG[taskIdx].done = (PROG[taskIdx].done || 0) + 1;
    save();
    updatePbCounter(taskIdx, total);
    toast('Верно! ✓');
  } else {
    btn.classList.add('sel-wrong');
    card.classList.add('wrong');
    toast('Неверно.');
  }
  card.querySelector('.explain').classList.add('show');
}

function updatePbCounter(taskIdx, total) {
  const el = document.querySelector('.pb-counter');
  if (el) el.textContent = `${PROG[taskIdx].done} / ${total} выполнено`;
}

window.checkChoice = checkChoice;

/* ---- STRESS TRAINER ---- */
let stressState = {};
function viewStress() {
  const totalWords = STRESS_WORDS.length;
  return `<div class="task-view">
    <div class="task-header">
      <div class="kicker">Задание 4 · Орфоэпия</div>
      <h2>Тренажёр ударений</h2>
      <p>Орфоэпический минимум ФИПИ — ${totalWords} слов. Нажми на слог с ударением.</p>
    </div>
    <div class="task-body">
      <div class="trainer reveal" id="stress-trainer">
        <div class="qcount">Слово <span id="sw-cur">1</span> / <span id="sw-total">20</span></div>
        <div class="stress-word" id="sw-word"></div>
        <div class="hint" id="sw-hint">Нажми на слог, на который падает ударение</div>
        <div id="sw-note" class="explain" style="margin:12px 0 0;text-align:left;"></div>
        <div class="controls" style="margin-top:20px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-ghost" onclick="stressShow()">Показать ответ</button>
          <button class="btn btn-primary" id="sw-next" disabled onclick="stressNext()">Следующее →</button>
        </div>
        <div class="progress-bar" style="margin-top:20px"><i id="sw-bar"></i></div>
        <div style="margin-top:14px;color:var(--muted);font-size:14px;text-align:center">
          Правильных: <span id="sw-score" style="color:var(--brown-2);font-weight:700">0</span> / <span id="sw-total2">0</span>
        </div>
      </div>

      <div class="theory-block reveal" style="margin-top:32px">
        <h3>Ключевые правила</h3>
        <ul>
          <li><strong>Глаголы II спряжения:</strong> ударение на окончании — звонИт, включИт, вручИт, облегчИт</li>
          <li><strong>Прош. вр. женского рода:</strong> ударение на А — началА, убралА, принялА</li>
          <li><strong>Существительные:</strong> договОр, каталОг, квартАл, аэропОрт (не двигается), жалюзИ</li>
          <li><strong>Прилагательные:</strong> красИвее, оптОвый, кУхонный, сливОвый</li>
        </ul>
      </div>
    </div>
  </div>`;
}

function stressInit() {
  const idxs = [];
  while (idxs.length < Math.min(20, STRESS_WORDS.length)) {
    const r = Math.floor(Math.random() * STRESS_WORDS.length);
    if (!idxs.includes(r)) idxs.push(r);
  }
  stressState = { idxs, cur: 0, score: 0, answered: 0 };
  document.getElementById('sw-total').textContent = idxs.length;
  document.getElementById('sw-total2').textContent = idxs.length;
  stressRender();
}

function stressRender() {
  const { idxs, cur } = stressState;
  const w = STRESS_WORDS[idxs[cur]];
  document.getElementById('sw-cur').textContent = cur + 1;
  document.getElementById('sw-score').textContent = stressState.score;
  document.getElementById('sw-bar').style.width = `${(cur / idxs.length) * 100}%`;
  document.getElementById('sw-next').disabled = true;
  document.getElementById('sw-hint').textContent = 'Нажми на слог, на который падает ударение';
  const note = document.getElementById('sw-note');
  note.textContent = ''; note.classList.remove('show');

  const wordEl = document.getElementById('sw-word');
  wordEl.innerHTML = w.syl.map((s, i) =>
    `<span class="syl" data-i="${i}" onclick="stressCheck(this,${w.stress})">${s}</span>`
  ).join('');
}

function stressCheck(btn, correctIdx) {
  const i = parseInt(btn.dataset.i);
  const syls = document.querySelectorAll('.syl');
  syls.forEach(s => s.onclick = null);
  syls[correctIdx].classList.add('show-acc');
  if (i === correctIdx) {
    btn.classList.add('correct');
    stressState.score++;
    toast('Верно! ✓');
  } else {
    btn.classList.add('wrong');
    toast('Неверно.');
  }
  stressState.answered++;
  document.getElementById('sw-score').textContent = stressState.score;
  document.getElementById('sw-next').disabled = false;
  const note = document.getElementById('sw-note');
  note.textContent = STRESS_WORDS[stressState.idxs[stressState.cur]].note;
  note.classList.add('show');
  document.getElementById('sw-hint').textContent = '';
}

function stressNext() {
  stressState.cur++;
  if (stressState.cur >= stressState.idxs.length) {
    const el = document.getElementById('stress-trainer');
    el.innerHTML = `<div style="text-align:center;padding:20px">
      <div style="font-size:3rem;margin-bottom:16px">🎉</div>
      <h3 style="font-size:1.4rem;font-weight:800;margin-bottom:8px">Раунд завершён!</h3>
      <p style="color:var(--muted);margin-bottom:24px">Результат: <strong style="color:var(--brown-2)">${stressState.score} / ${stressState.idxs.length}</strong></p>
      <button class="btn btn-primary" onclick="stressInit()">Новый раунд →</button>
    </div>`;
    return;
  }
  stressRender();
}

window.stressShow = () => {
  const { idxs, cur } = stressState;
  const w = STRESS_WORDS[idxs[cur]];
  document.querySelectorAll('.syl').forEach((s, i) => {
    s.onclick = null;
    if (i === w.stress) s.classList.add('show-acc');
  });
  document.getElementById('sw-next').disabled = false;
  const note = document.getElementById('sw-note');
  note.textContent = w.note; note.classList.add('show');
};
window.stressNext = stressNext;
window.stressInit = stressInit;
window.stressCheck = stressCheck;

/* ---- PARONIMS ---- */
function viewParonims() {
  const cards = PARONIMS.map(p => `
    <div class="paro-card reveal">
      <div class="words">${p.pair.map(w => `<span class="paro-word">${w}</span>`).join('')}</div>
      <p>${p.desc}</p>
    </div>`).join('');

  const quiz = buildParoQuiz();

  return `<div class="task-view">
    <div class="task-header">
      <div class="kicker">Задание 5 · Паронимы</div>
      <h2>Паронимы ФИПИ</h2>
      <p>Слова-близнецы, которые часто путают. Изучи пары и проверь себя.</p>
    </div>
    <div class="task-body">
      <h3 style="margin-bottom:16px;font-size:1.05rem;font-weight:700">Список паронимов</h3>
      <div class="paro-list">${cards}</div>
      <div class="theory-block" style="margin-top:32px">
        <h3>Мини-тренажёр по паронимам</h3>
        <div id="paro-quiz">${quiz}</div>
      </div>
    </div>
  </div>`;
}

const PARO_QUIZ = [
  { q:"«Его поведение было очень … — он не обидел никого»", opts:["дипломатическое","дипломатичное"], answer:1, ex:"ДИПЛОМАТИЧНОЕ — тактичное." },
  { q:"«Ему выдали … удостоверение для поездки за рубеж»", opts:["дипломатическое","дипломатичное"], answer:0, ex:"ДИПЛОМАТИЧЕСКОЕ — официальный документ." },
  { q:"«Мама … ребёнка в тёплую куртку»", opts:["одела","надела"], answer:0, ex:"ОДЕТЬ кого-то." },
  { q:"«Она … нарядное платье на выпускной»", opts:["одела","надела"], answer:1, ex:"НАДЕТЬ что-то на себя." },
  { q:"«Это … решение сэкономило команде много времени»", opts:["эффективное","эффектное"], answer:0, ex:"ЭФФЕКТИВНОЕ — дающее результат." },
  { q:"«Её … появление на сцене никого не оставило равнодушным»", opts:["эффективное","эффектное"], answer:1, ex:"ЭФФЕКТНОЕ — производящее впечатление." },
];

let paroIdx = 0;
function buildParoQuiz() {
  paroIdx = Math.floor(Math.random() * PARO_QUIZ.length);
  const q = PARO_QUIZ[paroIdx];
  return `<div class="q" style="margin-bottom:16px">${q.q}</div>
    <div class="opts">
      ${q.opts.map((o, i) => `<button class="opt" onclick="checkParo(this,${i},${q.answer},'${q.ex.replace(/'/g,"\\'")}',${ PARO_QUIZ.length})">${o}</button>`).join('')}
    </div>
    <div class="explain" id="paro-explain"></div>
    <button class="btn btn-ghost" id="paro-next" style="margin-top:16px;display:none" onclick="nextParoQuiz()">Следующий →</button>`;
}

window.checkParo = (btn, i, answer, ex) => {
  document.querySelectorAll('#paro-quiz .opt').forEach(b => b.disabled = true);
  document.querySelectorAll('#paro-quiz .opt')[answer].classList.add('show-correct');
  btn.classList.add(i === answer ? 'sel-correct' : 'sel-wrong');
  const exp = document.getElementById('paro-explain');
  exp.textContent = ex; exp.classList.add('show');
  document.getElementById('paro-next').style.display = '';
  toast(i === answer ? 'Верно! ✓' : 'Неверно.');
};
window.nextParoQuiz = () => {
  paroIdx = (paroIdx + 1) % PARO_QUIZ.length;
  document.getElementById('paro-quiz').innerHTML = buildParoQuiz();
};

/* ---- HOMEWORK ---- */
function viewHomework() {
  const topics = HOMEWORK.map(hw => {
    const total = hw.items.length;
    const done = hw.items.filter((_, i) => HW_DONE[`${hw.id}_${i}`]).length;
    const pct = Math.round(done / total * 100);
    const items = hw.items.map((item, i) => {
      const checked = HW_DONE[`${hw.id}_${i}`] ? 'checked' : '';
      const cls = HW_DONE[`${hw.id}_${i}`] ? 'done' : '';
      return `<li class="hw-item ${cls}">
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

  const totalItems = HOMEWORK.reduce((s, h) => s + h.items.length, 0);
  const totalDone = HOMEWORK.reduce((s, h) => s + h.items.filter((_, i) => HW_DONE[`${h.id}_${i}`]).length, 0);
  const totalPct = Math.round(totalDone / totalItems * 100);

  return `<div class="task-view">
    <div class="task-header">
      <div class="kicker">Домашние задания</div>
      <h2>Задания по темам</h2>
      <p>Отмечай выполненное — прогресс сохраняется в браузере. Общий прогресс: <strong style="color:var(--brown-2)">${totalDone}/${totalItems} (${totalPct}%)</strong></p>
    </div>
    <div class="task-body">
      <div class="hw-topics">${topics}</div>
      <div style="text-align:center;margin-top:32px">
        <button class="btn btn-ghost" onclick="resetHw()">Сбросить весь прогресс</button>
      </div>
    </div>
  </div>`;
}

window.toggleHw = (hwId, i, checkbox) => {
  const key = `${hwId}_${i}`;
  HW_DONE[key] = checkbox.checked;
  saveHw();
  const li = checkbox.closest('.hw-item');
  li.classList.toggle('done', checkbox.checked);
  const topic = checkbox.closest('.hw-topic');
  const all = topic.querySelectorAll('input[type=checkbox]');
  const done = [...all].filter(c => c.checked).length;
  topic.querySelector('.hw-prog-label').textContent = `${done}/${all.length}`;
  topic.querySelector('.hw-bar i').style.width = `${Math.round(done / all.length * 100)}%`;
};
window.resetHw = () => {
  if (!confirm('Сбросить весь прогресс домашних заданий?')) return;
  Object.keys(HW_DONE).forEach(k => delete HW_DONE[k]);
  saveHw();
  navigate('#/homework');
};

/* ---- ESSAY ---- */
function viewEssay() {
  const parts = ESSAY_TEMPLATE.parts.map(p => `
    <div class="theory-block reveal">
      <h3 style="font-size:1rem">${p.label}</h3>
      <pre style="white-space:pre-wrap;font-family:inherit;font-size:.9rem;color:var(--muted);line-height:1.7">${p.content}</pre>
    </div>`).join('');

  return `<div class="task-view">
    <div class="task-header">
      <div class="kicker">Задание 27</div>
      <h2>Шаблон сочинения</h2>
      <p>Структура, клише и план — всё, что нужно для максимального балла.</p>
    </div>
    <div class="task-body">
      <div class="theory-block reveal">
        <h3>Критерии оценивания</h3>
        <ul>
          <li><strong>К1 (1 балл)</strong> — правильная формулировка проблемы</li>
          <li><strong>К2 (6 баллов)</strong> — комментарий с 2 примерами, пояснениями и связью</li>
          <li><strong>К3 (1 балл)</strong> — позиция автора</li>
          <li><strong>К4 (1 балл)</strong> — своё мнение с обоснованием</li>
          <li><strong>К5–К12 (14 баллов)</strong> — речь, грамматика, орфография, пунктуация, фактическая точность</li>
        </ul>
      </div>
      ${parts}
      <div class="theory-block reveal">
        <h3>Чек-лист перед сдачей</h3>
        <ul>
          <li>Проблема сформулирована корректно (не тема, а проблема)</li>
          <li>В комментарии ровно 2 примера с пояснением каждого</li>
          <li>Указана смысловая связь между примерами</li>
          <li>Позиция автора прочитана из текста, а не придумана</li>
          <li>Своё мнение обосновано (пример из литературы/жизни)</li>
          <li>Объём 150–300 слов (оптимально 200–250)</li>
          <li>Нет пересказа вместо комментария</li>
        </ul>
      </div>
      <div style="text-align:center;margin-top:24px">
        <a href="#/ai-essay" class="btn btn-primary">🤖 Проверить эссе с ИИ →</a>
      </div>
    </div>
  </div>`;
}

/* ---- AI ESSAY CHECKER ---- */
function getCriterionName(key) {
  const names = {
    k1:  'К1 · Формулировка проблемы',
    k2:  'К2 · Комментарий к проблеме',
    k3:  'К3 · Позиция автора',
    k4:  'К4 · Отношение к позиции автора',
    k5:  'К5 · Смысловая цельность и связность',
    k6:  'К6 · Точность и выразительность речи',
    k7:  'К7 · Орфографические нормы',
    k8:  'К8 · Пунктуационные нормы',
    k9:  'К9 · Грамматические нормы',
    k10: 'К10 · Речевые нормы',
    k11: 'К11 · Этические нормы',
    k12: 'К12 · Фактологическая точность',
  };
  return names[key] || key.toUpperCase();
}

const CRITERIA_MAX = { k1:1, k2:6, k3:1, k4:1, k5:2, k6:2, k7:3, k8:3, k9:2, k10:2, k11:1, k12:1 };

function getScoreComment(pct) {
  if (pct >= 100) return '✓ Максимум!';
  if (pct >= 75)  return '👍 Хорошо';
  if (pct >= 50)  return '📝 Средне';
  return '⚠ Доработать';
}

function viewAiEssay() {
  const criteriaRows = Object.entries(CRITERIA_MAX).map(([k, max]) =>
    `<tr><td>${getCriterionName(k)}</td><td style="text-align:center;font-weight:700">${max}</td></tr>`
  ).join('');

  return `<div class="task-view">
    <div class="task-header">
      <button class="back" onclick="navigate('#/essay')">← Шаблон сочинения</button>
      <div class="kicker">ИИ-проверка · Задание 27</div>
      <h2>Проверка эссе по критериям ЕГЭ</h2>
      <p>Вставь своё сочинение — ИИ оценит его по всем 12 критериям и даст рекомендации.</p>
    </div>
    <div class="task-body">

      <div class="essay-form reveal">
        <label style="font-weight:700;display:block;margin-bottom:6px">Исходный текст <span style="color:var(--muted);font-weight:400">(необязательно)</span></label>
        <textarea id="essay-source" class="essay-textarea" style="min-height:120px" placeholder="Вставь сюда исходный текст, если хочешь более точную проверку К1–К4…"></textarea>

        <label style="font-weight:700;display:block;margin:20px 0 6px">Твоё сочинение <span style="color:var(--red, #c0392b);font-size:.9rem">*</span></label>
        <textarea id="essay-text" class="essay-textarea" placeholder="Вставь или напиши сочинение (минимум 150 слов)…" oninput="updateEssayCounter()"></textarea>
        <div class="char-count" id="essay-counter">0 слов · 0 символов</div>

        <button class="btn btn-primary" style="margin-top:20px;width:100%" onclick="checkEssay()">🤖 Проверить эссе →</button>
      </div>

      <div id="essay-loading" class="ai-loading" style="display:none">
        <div class="spin"></div>
        <p>ИИ анализирует эссе по критериям ЕГЭ…<br><small style="color:var(--muted)">Обычно 10–20 секунд</small></p>
      </div>

      <div id="essay-error" class="ai-error" style="display:none"></div>

      <div id="essay-results" style="display:none"></div>

      <div class="theory-block reveal" style="margin-top:32px">
        <h3>Критерии оценивания — максимум 25 баллов</h3>
        <table style="width:100%;border-collapse:collapse;font-size:.9rem">
          <thead><tr style="border-bottom:2px solid var(--caramel)"><th style="text-align:left;padding:6px 4px">Критерий</th><th style="text-align:center;padding:6px 4px">Макс.</th></tr></thead>
          <tbody>${criteriaRows}</tbody>
          <tfoot><tr style="border-top:2px solid var(--caramel);font-weight:800"><td style="padding:8px 4px">Итого</td><td style="text-align:center;padding:8px 4px">25</td></tr></tfoot>
        </table>
      </div>

    </div>
  </div>`;
}

window.updateEssayCounter = () => {
  const txt = (document.getElementById('essay-text') || {}).value || '';
  const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
  const chars = txt.length;
  const el = document.getElementById('essay-counter');
  if (el) {
    el.textContent = `${words} слов · ${chars} символов`;
    el.style.color = words < 150 ? 'var(--red, #c0392b)' : 'var(--muted)';
  }
};

window.checkEssay = async () => {
  const sourceEl = document.getElementById('essay-source');
  const textEl   = document.getElementById('essay-text');
  const loading  = document.getElementById('essay-loading');
  const errorEl  = document.getElementById('essay-error');
  const results  = document.getElementById('essay-results');

  const sourceText = (sourceEl ? sourceEl.value : '').trim();
  const essayText  = (textEl   ? textEl.value   : '').trim();

  errorEl.style.display = 'none';
  results.style.display = 'none';

  if (!essayText || essayText.split(/\s+/).length < 150) {
    errorEl.textContent = '⚠ Сочинение должно содержать не менее 150 слов.';
    errorEl.style.display = '';
    return;
  }

  if (!AI_ESSAY_ENDPOINT) {
    errorEl.innerHTML = '🔧 Сервис проверки ещё не настроен. Скоро добавим — следи за обновлениями!';
    errorEl.style.display = '';
    return;
  }

  loading.style.display = '';
  try {
    const resp = await fetch(AI_ESSAY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_text: sourceText, essay: essayText }),
    });
    if (!resp.ok) throw new Error(`Ошибка сервера: ${resp.status}`);
    const data = await resp.json();
    loading.style.display = 'none';
    renderEssayResults(data);
  } catch (e) {
    loading.style.display = 'none';
    errorEl.textContent = `❌ ${e.message}`;
    errorEl.style.display = '';
  }
};

function renderEssayResults(data) {
  const results = document.getElementById('essay-results');
  if (!results) return;

  const total    = data.total_score ?? 0;
  const maxTotal = data.max_score   ?? 25;
  const pct      = Math.round(total / maxTotal * 100);
  const comment  = getScoreComment(pct);

  const criteriaHtml = Object.entries(CRITERIA_MAX).map(([k, max]) => {
    const crit  = (data.criteria || {})[k] || {};
    const score = crit.score ?? 0;
    const cpct  = Math.round(score / max * 100);
    const barCls = cpct >= 100 ? 'c-full' : cpct >= 50 ? 'c-partial' : 'c-low';
    return `<div class="criterion reveal">
      <div class="crit-head">
        <span class="crit-name">${getCriterionName(k)}</span>
        <span class="crit-score">${score} / ${max}</span>
      </div>
      <div class="criterion-bar"><div class="criterion-bar ${barCls}" style="width:${cpct}%"></div></div>
      ${crit.comment ? `<div class="crit-comment">${crit.comment}</div>` : ''}
    </div>`;
  }).join('');

  const recs = (data.recommendations || []).map(r => `<li>${r}</li>`).join('');

  results.innerHTML = `
    <div class="score-total-card reveal">
      <div class="score-total-label">Итоговый балл</div>
      <div class="score-total-num">${total}<span>/${maxTotal}</span></div>
      <div class="score-total-pct">${pct}% — ${comment}</div>
    </div>

    <div class="criteria-grid">${criteriaHtml}</div>

    ${data.summary ? `<div class="ai-summary-block reveal"><h3>Общая оценка</h3><p>${data.summary}</p></div>` : ''}

    ${recs ? `<div class="ai-summary-block reveal">
      <h3>Рекомендации</h3>
      <ul class="recs-list">${recs}</ul>
    </div>` : ''}
  `;
  results.style.display = '';
  reveal();
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---- RESOURCES ---- */
function viewResources() {
  return `<div class="task-view">
    <div class="task-header">
      <div class="kicker">Где брать материалы</div>
      <h2>Проверенные источники</h2>
      <p>Официальные демоверсии, банк заданий и тренажёры.</p>
    </div>
    <div class="task-body">
      <div class="res-grid">
        <a class="res reveal" href="https://fipi.ru/ege/demoversii-specifikacii-kodifikatory" target="_blank" rel="noopener">
          <div class="ico">📘</div><h3>ФИПИ <span class="arrow">↗</span></h3>
          <p>Демоверсии, спецификации и кодификаторы ЕГЭ 2026. Официальный формат.</p></a>
        <a class="res reveal" href="https://os.fipi.ru/" target="_blank" rel="noopener">
          <div class="ico">🗂️</div><h3>Открытый банк ФИПИ <span class="arrow">↗</span></h3>
          <p>Тысячи реальных заданий прошлых лет с возможностью тренироваться по темам.</p></a>
        <a class="res reveal" href="https://rus-ege.sdamgia.ru/" target="_blank" rel="noopener">
          <div class="ico">✅</div><h3>Решу ЕГЭ · Русский <span class="arrow">↗</span></h3>
          <p>Тренажёр с автопроверкой, варианты и статистика по каждому заданию.</p></a>
        <a class="res reveal" href="https://www.hse.ru/ege/" target="_blank" rel="noopener">
          <div class="ico">🎓</div><h3>НИУ ВШЭ · ЕГЭ <span class="arrow">↗</span></h3>
          <p>Проходные баллы, программы и всё о поступлении в Вышку.</p></a>
        <a class="res reveal" href="../index.html" rel="noopener">
          <div class="ico">🔀</div><h3>ЕГЭ-Хаб <span class="arrow">↗</span></h3>
          <p>Вернуться на главную страницу хаба с русским и английским.</p></a>
        <a class="res reveal" href="../english/index.html" rel="noopener">
          <div class="ico">🇬🇧</div><h3>English ЕГЭ <span class="arrow">↗</span></h3>
          <p>Перейти на платформу подготовки к ЕГЭ по английскому языку.</p></a>
      </div>
    </div>
  </div>`;
}

/* ---- EXAM TIMER ---- */
const RU_TIMER_TOTAL = 210 * 60;
let ruTimer = { running: false, elapsed: 0, ival: null };

function viewTimer() {
  return `<div class="task-view">
    <div class="task-header">
      <div class="kicker">Симуляция экзамена</div>
      <h2>Таймер ЕГЭ · Русский язык</h2>
      <p>Полный вариант — 3 часа 30 минут (210 минут)</p>
    </div>
    <div class="task-body">
      <div class="timer-card reveal">
        <div class="timer-ring-wrap">
          <svg class="timer-ring" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(107,66,38,.12)" stroke-width="14"/>
            <circle id="timer-arc" cx="100" cy="100" r="86" fill="none" stroke="url(#tg-ru)" stroke-width="14"
              stroke-dasharray="540" stroke-dashoffset="0" stroke-linecap="round"
              transform="rotate(-90 100 100)" style="transition:stroke-dashoffset .8s"/>
            <defs>
              <linearGradient id="tg-ru" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#6B4226"/>
                <stop offset="100%" stop-color="#C49A6C"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="timer-display">
            <div class="timer-hms" id="timer-hms">3:30:00</div>
            <div class="timer-lbl" id="timer-lbl">Готов к старту</div>
          </div>
        </div>
        <div id="timer-elapsed" class="timer-elapsed">0 мин прошло из 210</div>
        <div class="timer-controls">
          <button class="btn btn-primary" id="timer-btn" onclick="timerToggle()">▶ Старт</button>
          <button class="btn btn-ghost" onclick="timerReset()">↺ Сброс</button>
        </div>
      </div>

      <div class="theory-block reveal" style="margin-top:24px">
        <h3>Рекомендуемый план</h3>
        <div class="timer-plan">
          <div class="tp-row"><span class="tp-time">0:00 – 0:30</span><span class="tp-task">Задания 1–3 (работа с текстом)</span><span class="tp-dur">30 мин</span></div>
          <div class="tp-row"><span class="tp-time">0:30 – 1:30</span><span class="tp-task">Задания 4–26 (тест, орфография, пунктуация)</span><span class="tp-dur">60 мин</span></div>
          <div class="tp-row tp-key"><span class="tp-time">1:30 – 3:00</span><span class="tp-task">✍️ Задание 27 — сочинение</span><span class="tp-dur">90 мин</span></div>
          <div class="tp-row"><span class="tp-time">3:00 – 3:30</span><span class="tp-task">Проверка, исправление ошибок</span><span class="tp-dur">30 мин</span></div>
        </div>
      </div>

      <div class="theory-block reveal">
        <h3>Тайм-менеджмент на ЕГЭ</h3>
        <ul>
          <li><strong>Не зависай на одном задании:</strong> поставь ответ наугад и иди дальше — вернёшься если останется время.</li>
          <li><strong>Начни с лёгкого:</strong> задания 4, 5 (ударения, паронимы) — быстрые баллы, подними уверенность.</li>
          <li><strong>Оставь 90 мин на сочинение:</strong> оно даёт 24 балла из 54 — это почти половина!</li>
          <li><strong>Последние 30 мин — только проверка:</strong> пунктуация, Н/НН, НЕ — самые частые ошибки.</li>
          <li><strong>Не торопись в начале:</strong> ошибка в задании 8 стоит столько же, сколько в задании 4.</li>
        </ul>
      </div>
    </div>
  </div>`;
}

window.timerToggle = () => {
  if (ruTimer.running) {
    clearInterval(ruTimer.ival);
    ruTimer.running = false;
    const btn = document.getElementById('timer-btn');
    if (btn) btn.textContent = '▶ Продолжить';
  } else {
    ruTimer.running = true;
    const btn = document.getElementById('timer-btn');
    if (btn) btn.textContent = '⏸ Пауза';
    ruTimer.ival = setInterval(() => {
      ruTimer.elapsed++;
      const rem = Math.max(0, RU_TIMER_TOTAL - ruTimer.elapsed);
      const h = Math.floor(rem / 3600);
      const m = Math.floor((rem % 3600) / 60);
      const s = rem % 60;
      const hmsEl = document.getElementById('timer-hms');
      const lblEl = document.getElementById('timer-lbl');
      const arcEl = document.getElementById('timer-arc');
      const elEl  = document.getElementById('timer-elapsed');
      if (!hmsEl) { clearInterval(ruTimer.ival); ruTimer.running = false; return; }
      hmsEl.textContent = `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      arcEl.style.strokeDashoffset = 540 * (1 - ruTimer.elapsed / RU_TIMER_TOTAL);
      const em = Math.floor(ruTimer.elapsed / 60);
      elEl.textContent = `${em} мин прошло из 210`;
      if (em < 30)  lblEl.textContent = 'Задания 1–3';
      else if (em < 90)  lblEl.textContent = 'Задания 4–26';
      else if (em < 180) lblEl.textContent = '✍️ Сочинение';
      else           lblEl.textContent = '✅ Проверка';
      if (rem === 0) {
        clearInterval(ruTimer.ival); ruTimer.running = false;
        lblEl.textContent = '⏰ Время вышло!';
        toast('Время экзамена закончилось!');
      }
    }, 1000);
  }
};

window.timerReset = () => {
  clearInterval(ruTimer.ival);
  ruTimer = { running: false, elapsed: 0, ival: null };
  const hmsEl = document.getElementById('timer-hms');
  const lblEl = document.getElementById('timer-lbl');
  const arcEl = document.getElementById('timer-arc');
  const elEl  = document.getElementById('timer-elapsed');
  const btn   = document.getElementById('timer-btn');
  if (hmsEl) hmsEl.textContent = '3:30:00';
  if (lblEl) lblEl.textContent = 'Готов к старту';
  if (arcEl) arcEl.style.strokeDashoffset = '0';
  if (elEl)  elEl.textContent = '0 мин прошло из 210';
  if (btn)   btn.textContent = '▶ Старт';
};

/* =================== ROUTER =================== */
function navigate(hash) {
  location.hash = hash;
}
window.navigate = navigate;

function render() {
  const hash = location.hash || '#/';
  buildNav();

  const taskMatch = hash.match(/^#\/task\/(\d+)$/);
  if (taskMatch) {
    app.innerHTML = viewTask(parseInt(taskMatch[1]));
    scrollTop();
    reveal();
    return;
  }

  const views = {
    '#/':          viewHome,
    '#/tasks':     viewTasks,
    '#/stress':    viewStress,
    '#/paronims':  viewParonims,
    '#/homework':  viewHomework,
    '#/essay':     viewEssay,
    '#/ai-essay':  viewAiEssay,
    '#/timer':     viewTimer,
    '#/resources': viewResources,
  };

  const fn = views[hash] || viewHome;
  app.innerHTML = fn();
  scrollTop();
  reveal();

  if (hash === '#/' || hash === '#/tasks') renderTaskGrid();
  if (hash === '#/stress') stressInit();

  /* counter anim */
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

function renderTaskGrid() {
  const grid = document.getElementById('tasks-grid') || document.getElementById('tasks-grid-home');
  if (!grid) return;
  RU_TASKS.forEach((t, i) => {
    const p = PROG[i] || {};
    const done = p.done || 0;
    const total = t.practice.length;
    const pct = total ? Math.round(done / total * 100) : 0;
    const card = document.createElement('article');
    card.className = 'task-card reveal';
    card.style.transitionDelay = `${(i % 4) * 50}ms`;
    card.innerHTML = `<span class="tnum">Задание ${t.num}</span><h3>${t.title}</h3><p>${t.desc}</p>
      <div class="tc-prog"><i style="width:${pct}%"></i></div>`;
    card.addEventListener('click', () => { location.hash = `#/task/${i}`; });
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
    grid.appendChild(card);
  });
  reveal();
}

/* =================== INIT =================== */
window.addEventListener('hashchange', render);
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 40);
});
document.getElementById('burger').addEventListener('click', () =>
  document.getElementById('nav-links').classList.toggle('open')
);
document.getElementById('year').textContent = new Date().getFullYear();

render();
