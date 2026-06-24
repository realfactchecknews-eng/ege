/* ============================================================
   РУССКИЙ ЕГЭ · app.js — SPA с hash-routing
   ============================================================ */

const app = document.getElementById('app');
const PROG = JSON.parse(localStorage.getItem('ru_ege_prog') || '{}');
const HW_DONE = JSON.parse(localStorage.getItem('ru_ege_hw') || '{}');
const save = () => localStorage.setItem('ru_ege_prog', JSON.stringify(PROG));
const saveHw = () => localStorage.setItem('ru_ege_hw', JSON.stringify(HW_DONE));

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
  ['#/paronims', 'Паронимы'], ['#/homework', 'Домашнее'], ['#/essay', 'Сочинение'], ['#/resources', 'Материалы']
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

  const theory = t.theory.map(item =>
    `<li>${item.replace(/«(.+?)»/g, '«<em>$1</em>»')}</li>`
  ).join('');

  const practices = t.practice.map((p, pi) => buildExCard(p, idx, pi)).join('');

  return `<div class="task-view">
    <div class="task-header">
      <button class="back" onclick="navigate('#/tasks')">← Все задания</button>
      <div class="tnum">Задание ${t.num}</div>
      <h2>${t.title}</h2>
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
          Правильных: <span id="sw-score" style="color:var(--violet-bright);font-weight:700">0</span> / <span id="sw-total2">0</span>
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
      <p style="color:var(--muted);margin-bottom:24px">Результат: <strong style="color:var(--violet-bright)">${stressState.score} / ${stressState.idxs.length}</strong></p>
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

  /* paro quiz */
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
      ${q.opts.map((o, i) => `<button class="opt" onclick="checkParo(this,${i},${q.answer},'${q.ex.replace(/'/g,"\\'")}',${PARO_QUIZ.length})">${o}</button>`).join('')}
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
      <p>Отмечай выполненное — прогресс сохраняется в браузере. Общий прогресс: <strong style="color:var(--violet-bright)">${totalDone}/${totalItems} (${totalPct}%)</strong></p>
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
    </div>
  </div>`;
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
    '#/':         viewHome,
    '#/tasks':    viewTasks,
    '#/stress':   viewStress,
    '#/paronims': viewParonims,
    '#/homework': viewHomework,
    '#/essay':    viewEssay,
    '#/resources':viewResources,
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
