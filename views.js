/**
 * 界面层：用模板字符串 + 事件委托渲染，不引入任何框架。
 * 每个标签页返回一段 HTML，由 app.js 挂到 #app 上，点击事件统一用 data-action 分发。
 */
import {
  getState, targets, ensureDay, dayMacros, dayMacrosWithScale, toggleEaten, rotate, regenerateDay,
  prettyDate, relativeDayLabel, todayKey, weekdayOf,
  workoutForDate, nextWorkoutKey, weightSeries, MEAL_ORDER, PLANS, DISHES
} from './store.js';
import { ACTIVITY_LEVELS, RATE_OPTIONS, dishNutrition, servingItems } from './nutrition.js';
import { MEAL_LABEL, MEAL_SPLIT } from './dishes.js';
import { EXERCISES } from './exercises.js';
import { INGREDIENTS } from './ingredients.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const dishById = (id) => DISHES.find((d) => d.id === id);

const INGREDIENT_NAMES = Object.fromEntries(
  Object.entries(INGREDIENTS).map(([k, v]) => [k, v.name])
);
const ingredientName = (key) => INGREDIENT_NAMES[key] || key;

/** 当前正在浏览的日期，由 app.js 注入。 */
export const ui = { date: todayKey(), tab: 'today', trainDayId: null };

// ---------------- 小组件 ----------------

function ringChart(pct, size = 176, stroke = 14) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, pct));
  const dash = c * clamped;
  return `
    <svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--ring-track)" stroke-width="${stroke}" />
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--brand)" stroke-width="${stroke}"
        stroke-linecap="round" stroke-dasharray="${dash} ${c - dash}"
        transform="rotate(-90 ${size / 2} ${size / 2})" />
    </svg>`;
}

function macroBar(label, value, goal, unit = 'g') {
  const pct = goal > 0 ? Math.min(1, value / goal) : 0;
  const over = value > goal * 1.05;
  return `
    <div class="macro">
      <div class="macro-head"><span>${label}</span><span class="macro-val ${over ? 'over' : ''}">${Math.round(value)}<i>/${Math.round(goal)}${unit}</i></span></div>
      <div class="bar"><div class="bar-fill ${over ? 'over' : ''}" style="width:${(pct * 100).toFixed(1)}%"></div></div>
    </div>`;
}

function lineChart(points, w = 320, h = 140) {
  if (points.length < 2) {
    return `<div class="empty">至少记录两天体重后，这里会显示趋势曲线。</div>`;
  }
  const pad = { l: 30, r: 12, t: 12, b: 20 };
  const kgs = points.map((p) => p.kg);
  let min = Math.min(...kgs), max = Math.max(...kgs);
  if (max - min < 1) { const mid = (max + min) / 2; min = mid - 0.5; max = mid + 0.5; }
  const pad2 = (max - min) * 0.12;
  min -= pad2; max += pad2;

  const x = (i) => pad.l + (i / (points.length - 1)) * (w - pad.l - pad.r);
  const y = (kg) => pad.t + (1 - (kg - min) / (max - min)) * (h - pad.t - pad.b);

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.kg).toFixed(1)}`).join(' ');
  const area = `${line} L${x(points.length - 1).toFixed(1)},${h - pad.b} L${x(0).toFixed(1)},${h - pad.b} Z`;
  const last = points[points.length - 1];
  const first = points[0];
  const delta = Math.round((last.kg - first.kg) * 10) / 10;

  return `
    <svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="体重趋势">
      <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${h - pad.b}" stroke="var(--line)" />
      <line x1="${pad.l}" y1="${h - pad.b}" x2="${w - pad.r}" y2="${h - pad.b}" stroke="var(--line)" />
      <path d="${area}" fill="var(--brand-soft)" stroke="none" />
      <path d="${line}" fill="none" stroke="var(--brand)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
      <circle cx="${x(points.length - 1).toFixed(1)}" cy="${y(last.kg).toFixed(1)}" r="4" fill="var(--brand)" />
      <text x="4" y="${pad.t + 8}" class="chart-text">${max.toFixed(1)}</text>
      <text x="4" y="${h - pad.b}" class="chart-text">${min.toFixed(1)}</text>
      <text x="${pad.l}" y="${h - 6}" class="chart-text">${first.key.slice(5)}</text>
      <text x="${w - pad.r}" y="${h - 6}" text-anchor="end" class="chart-text">${last.key.slice(5)}</text>
    </svg>
    <div class="chart-note">共 ${points.length} 次记录 · 期间变化 <b class="${delta <= 0 ? 'good' : 'warn'}">${delta > 0 ? '+' : ''}${delta} kg</b></div>`;
}

function mealCalorieHint(meal, targetKcal) {
  return `目标约 ${Math.round(targetKcal * MEAL_SPLIT[meal])} kcal`;
}

// ---------------- 今日 ----------------

export function renderToday() {
  const st = getState();
  const t = targets();
  const day = ensureDay(ui.date);
  const scaleOf = (meal) => day.scale?.[meal] ?? 1;
  const totals = dayMacrosWithScale(day.picks, day.scale);
  const eatenTotals = MEAL_ORDER.reduce((acc, meal) => {
    if (!day.eaten[meal]) return acc;
    const n = dishNutrition(dishById(day.picks[meal]), scaleOf(meal));
    return { kcal: acc.kcal + n.kcal, p: acc.p + n.p, c: acc.c + n.c, f: acc.f + n.f };
  }, { kcal: 0, p: 0, c: 0, f: 0 });

  const remaining = Math.max(0, t.targetKcal - eatenTotals.kcal);
  const pct = t.targetKcal > 0 ? eatenTotals.kcal / t.targetKcal : 0;
  const w = workoutForDate(ui.date);
  const next = nextWorkoutKey(ui.date);
  const todayWeight = day.weightKg ?? (ui.date === todayKey() ? st.profile.weightKg : null);

  const workoutCard = w
    ? (() => {
        const sets = w.items.reduce((n, [k]) => n + (day.workout?.[k]?.filter(Boolean).length || 0), 0);
        const totalSets = w.items.reduce((n, [, setsStr]) => n + (parseInt(setsStr, 10) || 3), 0) || 1;
        const done = day.workout?.done;
        return `
        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">${esc(w.dayName)}</div>
              <div class="card-sub">${esc(w.planName)} · ${w.items.length} 个动作</div>
            </div>
            <span class="pill ${done ? 'pill-ok' : sets > 0 ? 'pill-warn' : ''}">${done ? '已完成' : sets > 0 ? `进行中 ${Math.round((sets / totalSets) * 100)}%` : '待开始'}</span>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary" data-action="go" data-tab="train">${sets > 0 ? '继续训练' : '开始训练'}</button>
            ${done ? '' : `<button class="btn" data-action="workout-finish" data-done="1">标记完成</button>`}
          </div>
        </div>`;
      })()
    : `
        <div class="card card-muted">
          <div class="card-head">
            <div>
              <div class="card-title">今天休息</div>
              <div class="card-sub">${next ? `下次训练：${relativeDayLabel(next)}` : '还没安排训练日，去「我的」设置'}</div>
            </div>
            <span class="pill">休息</span>
          </div>
          <div class="tip-line">减脂期休息日也别坐着不动，走 20~30 分钟就能多消耗 100 kcal 左右。</div>
        </div>`;

  return `
  <div class="stack">
    <div class="date-nav">
      <button class="icon-btn" data-action="date-shift" data-days="-1" aria-label="前一天">‹</button>
      <div class="date-nav-mid">
        <b>${relativeDayLabel(ui.date)}</b>
        <span>${prettyDate(ui.date)}</span>
      </div>
      <button class="icon-btn" data-action="date-shift" data-days="1" aria-label="后一天">›</button>
    </div>

    <div class="card hero">
      <div class="ring-wrap">
        ${ringChart(pct)}
        <div class="ring-center">
          <b>${Math.round(remaining)}</b>
          <span>还可摄入 kcal</span>
        </div>
      </div>
      <div class="hero-grid">
        <div><span>目标</span><b>${t.targetKcal}</b></div>
        <div><span>已吃</span><b>${Math.round(eatenTotals.kcal)}</b></div>
        <div><span>全天餐单</span><b>${totals.kcal}</b></div>
        <div><span>消耗估算</span><b>${t.tdee}</b></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">宏量营养</div>
      ${macroBar('蛋白质', eatenTotals.p, t.protein)}
      ${macroBar('碳水', eatenTotals.c, t.carb)}
      ${macroBar('脂肪', eatenTotals.f, t.fat)}
      <div class="tip-line">「已吃」只统计你在餐单里勾了「已吃」的餐次，边吃边勾最准。</div>
    </div>

    ${workoutCard}

    <div class="card">
      <div class="card-head">
        <div class="card-title">今日餐单</div>
        <button class="link-btn" data-action="go" data-tab="meals">查看详情 ›</button>
      </div>
      ${MEAL_ORDER.map((meal) => {
        const dish = dishById(day.picks[meal]);
        const n = dishNutrition(dish, scaleOf(meal));
        return `
        <div class="row ${day.eaten[meal] ? 'row-done' : ''}">
          <span class="row-label">${MEAL_LABEL[meal]}</span>
          <span class="row-main">${esc(dish.name)}</span>
          <span class="row-val">${n.kcal}</span>
        </div>`;
      }).join('')}
    </div>

    <div class="card">
      <div class="card-title">体重打卡</div>
      <div class="weight-row">
        <input id="weight-input" type="number" inputmode="decimal" step="0.1" placeholder="例如 74.5"
          value="${todayWeight ?? ''}" aria-label="今日体重" />
        <span class="unit">kg</span>
        <button class="btn btn-primary" data-action="weight-save">记录</button>
      </div>
      <div class="tip-line">建议固定在早上空腹、上完厕所后称，数据才可比。</div>
    </div>
  </div>`;
}

// ---------------- 餐单 ----------------

export function renderMeals() {
  const t = targets();
  const day = ensureDay(ui.date);
  const totals = dayMacrosWithScale(day.picks, day.scale);
  const diff = totals.kcal - t.targetKcal;

  return `
  <div class="stack">
    <div class="date-nav">
      <button class="icon-btn" data-action="date-shift" data-days="-1" aria-label="前一天">‹</button>
      <div class="date-nav-mid"><b>${relativeDayLabel(ui.date)}的餐单</b><span>${prettyDate(ui.date)}</span></div>
      <button class="icon-btn" data-action="date-shift" data-days="1" aria-label="后一天">›</button>
    </div>

    <div class="card summary">
      <div><span>全天合计</span><b>${totals.kcal}</b></div>
      <div><span>目标</span><b>${t.targetKcal}</b></div>
      <div><span>偏差</span><b class="${Math.abs(diff) <= 80 ? 'good' : 'warn'}">${diff > 0 ? '+' : ''}${diff}</b></div>
    </div>

    ${MEAL_ORDER.map((meal) => {
      const dish = dishById(day.picks[meal]);
      const factor = day.scale?.[meal] ?? 1;
      const n = dishNutrition(dish, factor);
      const eaten = day.eaten[meal];
      const portionNote = Math.abs(factor - 1) > 0.06
        ? `<span class="pill">份量 ×${factor.toFixed(2).replace(/0$/, '')}</span>`
        : '';
      return `
      <div class="card meal ${eaten ? 'is-eaten' : ''}">
        <div class="meal-head">
          <div>
            <b>${MEAL_LABEL[meal]}</b>
            <span class="muted">${mealCalorieHint(meal, t.targetKcal)} · 本餐 ${n.kcal} kcal ${portionNote}</span>
          </div>
          <button class="chip ${eaten ? 'chip-on' : ''}" data-action="meal-eaten" data-meal="${meal}">
            ${eaten ? '✓ 已吃' : '标记已吃'}
          </button>
        </div>
        <div class="dish-name">${esc(dish.name)}</div>
        <ul class="ing-list">
          ${servingItems(dish, factor).map(([key, g]) => `<li><span>${esc(ingredientName(key))}</span><b>${g}g</b></li>`).join('')}
        </ul>
        <div class="meal-macros">
          <span>蛋白 <b>${n.p}g</b></span><span>碳水 <b>${n.c}g</b></span><span>脂肪 <b>${n.f}g</b></span>
        </div>
        <p class="steps">${esc(dish.steps)}</p>
        <div class="btn-row">
          <button class="btn" data-action="meal-rotate" data-meal="${meal}">换一个</button>
        </div>
      </div>`;
    }).join('')}

    <button class="btn btn-ghost" data-action="day-regen">整体重新生成今天的餐单</button>
    <p class="footnote">餐单是按你的热量目标自动配平的，四餐比例约 25% / 35% / 10% / 30%。食材克数都是可食用部分，做菜优先蒸煮烤，油量已经算进去了。</p>
  </div>`;
}

// ---------------- 训练 ----------------

export function renderTrain() {
  const st = getState();
  const day = ensureDay(ui.date);
  const auto = workoutForDate(ui.date);
  const planId = st.profile.planId;
  const plan = PLANS[planId] || PLANS.fullbody3;
  const dayId = ui.trainDayId || auto?.dayId || plan.days[0].id;
  const dayDef = plan.days.find((d) => d.id === dayId) || plan.days[0];

  const setsDone = dayDef.items.reduce((n, [k]) => n + (day.workout?.[k]?.filter(Boolean).length || 0), 0);
  const setsTotal = dayDef.items.reduce((n, [, sets]) => n + (parseInt(sets, 10) || 3), 0);

  return `
  <div class="stack">
    <div class="date-nav">
      <button class="icon-btn" data-action="date-shift" data-days="-1" aria-label="前一天">‹</button>
      <div class="date-nav-mid"><b>${relativeDayLabel(ui.date)}的训练</b><span>${auto ? `计划内：${esc(auto.dayName)}` : '计划内的休息日'}</span></div>
      <button class="icon-btn" data-action="date-shift" data-days="1" aria-label="后一天">›</button>
    </div>

    <div class="chips">
      ${plan.days.map((d) => `<button class="chip ${d.id === dayId ? 'chip-on' : ''}" data-action="train-day" data-day-id="${d.id}">${esc(d.name)}</button>`).join('')}
    </div>

    <div class="card">
      <div class="card-head">
        <div>
          <div class="card-title">${esc(dayDef.name)}</div>
          <div class="card-sub">${setsDone} / ${setsTotal} 组已完成 · 计划 ${esc(plan.name)}</div>
        </div>
        <span class="pill ${day.workout?.done ? 'pill-ok' : setsDone > 0 ? 'pill-warn' : ''}">${day.workout?.done ? '已完成' : setsDone > 0 ? '进行中' : '未开始'}</span>
      </div>
      <div class="bar"><div class="bar-fill" style="width:${setsTotal ? (setsDone / setsTotal) * 100 : 0}%"></div></div>
    </div>

    ${dayDef.items.map(([key, setsStr, reps]) => {
      const ex = EXERCISES[key] || { name: key, part: '', equip: '', tip: '' };
      const total = parseInt(setsStr, 10) || 3;
      const arr = day.workout?.[key] || [];
      return `
      <div class="card ex">
        <div class="ex-head">
          <div>
            <b>${esc(ex.name)}</b>
            <span class="muted">${ex.part} · ${ex.equip} · ${esc(setsStr)} × ${esc(reps)}</span>
          </div>
        </div>
        <div class="set-row">
          ${Array.from({ length: total }, (_, i) => `
            <button class="set ${arr[i] ? 'set-on' : ''}" data-action="set-toggle"
              data-ex="${key}" data-idx="${i}" data-total="${total}">${i + 1}</button>`).join('')}
        </div>
        <p class="tip-line">${esc(ex.tip)}</p>
      </div>`;
    }).join('')}

    <div class="card timer-card">
      <div class="card-title">组间休息</div>
      <div id="timer-display" class="timer-display">${formatSec(timer.left)}</div>
      <div class="chips">
        ${[60, 75, 90, 120].map((s) => `<button class="chip ${timer.total === s ? 'chip-on' : ''}" data-action="timer-preset" data-sec="${s}">${s}s</button>`).join('')}
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" data-action="timer-toggle">${timer.id ? '暂停' : '开始'}</button>
        <button class="btn" data-action="timer-reset">重置</button>
      </div>
    </div>

    <button class="btn ${day.workout?.done ? 'btn-ghost' : 'btn-primary'}" data-action="workout-finish" data-done="${day.workout?.done ? 0 : 1}">
      ${day.workout?.done ? '取消完成标记' : '完成今天的训练'}
    </button>
    <p class="footnote">减脂期力量训练的作用是保住肌肉，让掉的主要是脂肪。重量以最后两次有点吃力但动作不变形为准，组间休息 60~90 秒。</p>
  </div>`;
}

function formatSec(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

// ---------------- 记录 ----------------

export function renderLog() {
  const series = weightSeries(60);
  const st = getState();

  const days = [];
  for (let i = 27; i >= 0; i--) {
    const k = shift(todayKey(), -i);
    days.push(k);
  }
  // 让日历按星期对齐，前面补上空格子，再配一行星期表头
  const lead = weekdayOf(days[0]);

  return `
  <div class="stack">
    <div class="card">
      <div class="card-title">体重趋势</div>
      ${lineChart(series)}
    </div>

    <div class="card">
      <div class="card-title">最近 28 天打卡</div>
      <div class="calendar">
        ${['日', '一', '二', '三', '四', '五', '六'].map((w) => `<div class="cal-hd">${w}</div>`).join('')}
        ${Array.from({ length: lead }, () => '<div class="cal-blank"></div>').join('')}
        ${days.map((k) => {
          const d = st.days[k];
          const ate = d && Object.values(d.eaten || {}).some(Boolean);
          const trained = d?.workout?.done;
          const weighed = d?.weightKg;
          const cls = [trained ? 'cal-train' : '', ate ? 'cal-ate' : '', weighed ? 'cal-weight' : ''].filter(Boolean).join(' ');
          return `<button class="cal ${cls} ${k === todayKey() ? 'cal-today' : ''}" data-action="open-date" data-key="${k}" title="${k}">
            <span>${Number(k.slice(8))}</span>
          </button>`;
        }).join('')}
      </div>
      <div class="legend">
        <span><i class="dot dot-ate"></i>有进食记录</span>
        <span><i class="dot dot-train"></i>完成训练</span>
        <span><i class="dot dot-weight"></i>称了体重</span>
      </div>
    </div>

    <div class="card">
      <div class="card-title">历史明细</div>
      ${historyRows(st)}
    </div>
  </div>`;
}

function historyRows(st) {
  const keys = Object.keys(st.days).sort().reverse().slice(0, 14);
  if (!keys.length) return `<div class="empty">还没有记录。去「今日」勾一顿吃了什么，或者称一次体重。</div>`;
  return keys.map((k) => {
    const d = st.days[k];
    const totals = dayMacrosWithScale(d.picks || {}, d.scale);
    const ate = Object.values(d.eaten || {}).filter(Boolean).length;
    return `
    <div class="row">
      <span class="row-label">${k.slice(5)}</span>
      <span class="row-main">${ate} / 4 餐已吃${d.workout?.done ? ' · 训练完成' : ''}</span>
      <span class="row-val">${d.weightKg ? `${d.weightKg}kg` : `${totals.kcal} kcal`}</span>
    </div>`;
  }).join('');
}

function shift(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

// ---------------- 我的 ----------------

export function renderMe() {
  const st = getState();
  const t = targets();
  const p = st.profile;
  const planId = p.planId;
  const plan = PLANS[planId] || PLANS.fullbody3;
  const wd = st.settings.weekdays[planId] || [];
  const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

  return `
  <div class="stack">
    <div class="card">
      <div class="card-title">身体档案</div>
      <div class="grid2">
        <label class="field"><span>性别</span>
          <select id="pf-sex">
            <option value="male" ${p.sex === 'male' ? 'selected' : ''}>男</option>
            <option value="female" ${p.sex === 'female' ? 'selected' : ''}>女</option>
          </select>
        </label>
        <label class="field"><span>年龄</span><input id="pf-age" type="number" inputmode="numeric" value="${p.age}" /></label>
        <label class="field"><span>身高 (cm)</span><input id="pf-height" type="number" inputmode="numeric" value="${p.heightCm}" /></label>
        <label class="field"><span>体重 (kg)</span><input id="pf-weight" type="number" inputmode="decimal" step="0.1" value="${p.weightKg}" /></label>
      </div>
      <label class="field"><span>日常活动量</span>
        <select id="pf-activity">
          ${ACTIVITY_LEVELS.map((a) => `<option value="${a.value}" ${Number(p.activity) === a.value ? 'selected' : ''}>${a.label} · ${a.desc}</option>`).join('')}
        </select>
      </label>
      <label class="field"><span>减重速度</span>
        <select id="pf-rate">
          ${RATE_OPTIONS.map((r) => `<option value="${r.value}" ${Number(p.rate) === r.value ? 'selected' : ''}>${r.label} · ${r.desc}</option>`).join('')}
        </select>
      </label>
      <label class="field"><span>蛋白质摄入强度</span>
        <select id="pf-protein">
          ${[1.6, 1.8, 2.0, 2.2].map((v) => `<option value="${v}" ${Number(p.proteinPerKg) === v ? 'selected' : ''}>${v} g/kg${v === 1.8 ? '（推荐）' : ''}</option>`).join('')}
        </select>
      </label>
      <button class="btn btn-primary" data-action="profile-save">保存并重算目标</button>
    </div>

    <div class="card">
      <div class="card-title">当前目标</div>
      <div class="hero-grid">
        <div><span>基础代谢</span><b>${t.bmr}</b></div>
        <div><span>每日消耗</span><b>${t.tdee}</b></div>
        <div><span>热量缺口</span><b>${t.deficit}</b></div>
        <div><span>预计每周</span><b>${t.weeklyKg} kg</b></div>
      </div>
      <p class="tip-line">目标热量 ${t.targetKcal} kcal · 蛋白 ${t.protein}g · 碳水 ${t.carb}g · 脂肪 ${t.fat}g</p>
      ${t.warnings.map((wmsg) => `<p class="warn-text">${esc(wmsg)}</p>`).join('')}
    </div>

    <div class="card">
      <div class="card-title">训练计划</div>
      <label class="field"><span>选择计划</span>
        <select id="pf-plan">
          ${Object.entries(PLANS).map(([id, v]) => `<option value="${id}" ${id === planId ? 'selected' : ''}>${v.name}（每周 ${v.days.length} 练）</option>`).join('')}
        </select>
      </label>
      <div class="field"><span>每周训练日（点选）</span>
        <div class="chips">
          ${WEEK.map((label, idx) => `<button class="chip ${wd.includes(idx) ? 'chip-on' : ''}" data-action="toggle-weekday" data-wd="${idx}">周${label}</button>`).join('')}
        </div>
      </div>
      <div class="tip-line">${esc(plan.subtitle)}。当前计划有 ${plan.days.length} 个训练日，按你选的日子依次循环。</div>
      <button class="btn" data-action="plan-save">保存训练安排</button>
    </div>

    <div class="card">
      <div class="card-title">数据备份</div>
      <p class="tip-line">所有数据只存在这台手机里，不会上传。换了手机或清理 Safari 数据前，先导出备份。</p>
      <div class="btn-row">
        <button class="btn" data-action="data-export">导出备份</button>
        <button class="btn" data-action="data-import">导入备份</button>
      </div>
      <input id="import-file" type="file" accept="application/json,.json" hidden />
      <button class="btn btn-danger" data-action="data-reset">清空所有数据</button>
    </div>

    <p class="footnote">本应用的营养值与热量公式来自公开的常见参考数据（中国食物成分表、USDA、Mifflin-St Jeor 公式），用于日常减脂规划，不能替代医生或注册营养师的建议。</p>
  </div>`;
}

// ---------------- 首次使用 ----------------

export function renderOnboarding() {
  return `
  <div class="stack onboard">
    <div class="brand-block">
      <div class="brand-mark">减</div>
      <h1>每日减脂</h1>
      <p>每天该练什么、该吃什么，一次算清楚。</p>
    </div>

    <div class="card">
      <div class="card-title">先填一下你的身体数据</div>
      <div class="grid2">
        <label class="field"><span>性别</span>
          <select id="pf-sex"><option value="male">男</option><option value="female">女</option></select>
        </label>
        <label class="field"><span>年龄</span><input id="pf-age" type="number" inputmode="numeric" value="30" /></label>
        <label class="field"><span>身高 (cm)</span><input id="pf-height" type="number" inputmode="numeric" value="175" /></label>
        <label class="field"><span>体重 (kg)</span><input id="pf-weight" type="number" inputmode="decimal" step="0.1" value="75" /></label>
      </div>
      <label class="field"><span>日常活动量</span>
        <select id="pf-activity">
          ${ACTIVITY_LEVELS.map((a, i) => `<option value="${a.value}" ${i === 1 ? 'selected' : ''}>${a.label} · ${a.desc}</option>`).join('')}
        </select>
      </label>
      <label class="field"><span>减重速度</span>
        <select id="pf-rate">
          ${RATE_OPTIONS.map((r, i) => `<option value="${r.value}" ${i === 1 ? 'selected' : ''}>${r.label} · ${r.desc}</option>`).join('')}
        </select>
      </label>
      <label class="field"><span>训练计划</span>
        <select id="pf-plan">
          ${Object.entries(PLANS).map(([id, v]) => `<option value="${id}" ${id === 'fullbody3' ? 'selected' : ''}>${v.name}（每周 ${v.days.length} 练）</option>`).join('')}
        </select>
      </label>
      <label class="field"><span>蛋白质摄入强度</span>
        <select id="pf-protein">
          ${[1.6, 1.8, 2.0, 2.2].map((v) => `<option value="${v}" ${v === 1.8 ? 'selected' : ''}>${v} g/kg${v === 1.8 ? '（推荐）' : ''}</option>`).join('')}
        </select>
      </label>
      <button class="btn btn-primary" data-action="setup-save">生成我的每日计划</button>
    </div>

    <p class="footnote">数据保存在本机，不需要账号，也不会联网上传。</p>
  </div>`;
}

// ---------------- 休息计时器 ----------------

export const timer = {
  total: 75,
  left: 75,
  id: null,
  tick() {
    this.left -= 1;
    if (this.left <= 0) {
      this.stop();
      this.left = 0;
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      if (window.__toast) window.__toast('休息结束，开始下一组');
    }
    this.paint();
  },
  start() {
    if (this.id) return;
    if (this.left <= 0) this.left = this.total;
    this.id = setInterval(() => this.tick(), 1000);
    this.paint();
  },
  stop() {
    if (this.id) clearInterval(this.id);
    this.id = null;
  },
  reset(sec) {
    this.stop();
    this.total = sec ?? this.total;
    this.left = this.total;
    this.paint();
  },
  paint() {
    const el = document.getElementById('timer-display');
    if (el) el.textContent = formatSec(Math.max(0, this.left));
    const btn = document.querySelector('[data-action="timer-toggle"]');
    if (btn) btn.textContent = this.id ? '暂停' : '开始';
    document.querySelectorAll('[data-action="timer-preset"]').forEach((b) => {
      b.classList.toggle('chip-on', Number(b.dataset.sec) === this.total);
    });
  }
};
