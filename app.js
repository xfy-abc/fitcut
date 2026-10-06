/**
 * 应用入口：路由 + 事件分发 + 渲染。
 * 结构很简单：状态一变就重渲染当前标签页，点击事件统一在 #app 上委托处理。
 */
import {
  getState, subscribe, ensureDay, toggleEaten, rotate, regenerateDay, setWeight,
  toggleSet, finishWorkout, todayKey, updateProfile, updateSettings, setTrainingDays,
  exportJSON, importJSON, resetAll, targets, PLANS
} from './store.js';
import {
  ui, timer, renderToday, renderMeals, renderTrain, renderLog, renderMe, renderOnboarding
} from './views.js';

const app = document.getElementById('app');
const toastEl = document.getElementById('toast');

const TABS = [
  { id: 'today', label: '今日', icon: 'today' },
  { id: 'meals', label: '餐单', icon: 'meals' },
  { id: 'train', label: '训练', icon: 'train' },
  { id: 'log', label: '记录', icon: 'log' },
  { id: 'me', label: '我的', icon: 'me' }
];

/** 底部导航用线性图标，比彩色 emoji 更干净，也能跟随主题变色。 */
const ICON_PATHS = {
  today: '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"/>',
  meals: '<path d="M3.6 11.4h16.8a8.4 8.4 0 0 1-16.8 0z"/><path d="M8.4 8.4c0-1.6 1.3-2.1 1.3-3.7M12.4 8.4c0-2.1 1.5-2.5 1.5-4.2M16.2 8.4c0-1.6 1.3-2.1 1.3-3.7"/>',
  train: '<path d="M6.6 7.6v8.8M3.8 9.8v4.4M17.4 7.6v8.8M20.2 9.8v4.4M6.6 12h10.8"/>',
  log: '<path d="M4.2 19.2V4.6"/><path d="M4.2 19.2h15.6"/><path d="M7.6 15.2l3.5-3.7 2.7 2.4 4.3-5.4"/>',
  me: '<circle cx="12" cy="8.6" r="3.6"/><path d="M5.6 19.4c.9-3.3 3.4-5 6.4-5s5.5 1.7 6.4 5"/>'
};
const icon = (name) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ''}</svg>`;

const scrollMemo = {};
let toastTimer = null;

export function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}
window.__toast = toast;

// ---------------- 渲染 ----------------

function currentViewHTML() {
  const st = getState();
  if (!st.profile.setupDone) return renderOnboarding();
  switch (ui.tab) {
    case 'meals': return renderMeals();
    case 'train': return renderTrain();
    case 'log': return renderLog();
    case 'me': return renderMe();
    default: return renderToday();
  }
}

function shell(bodyHTML) {
  const st = getState();
  if (!st.profile.setupDone) return bodyHTML;

  const tab = TABS.find((t) => t.id === ui.tab) || TABS[0];
  const notToday = ui.date !== todayKey();

  return `
    <header class="topbar">
      <div class="topbar-inner">
        <div class="topbar-title">
          <b>${tab.label}</b>
          ${notToday ? `<button class="link-btn" data-action="go-today">回到今天</button>` : ''}
        </div>
      </div>
    </header>
    <main class="main">${bodyHTML}</main>
    <nav class="tabbar">
      ${TABS.map((t) => `
        <button class="tab ${t.id === ui.tab ? 'on' : ''}" data-action="go" data-tab="${t.id}">
          ${icon(t.icon)}<span class="tab-label">${t.label}</span>
        </button>`).join('')}
    </nav>`;
}

export function render() {
  const st = getState();
  if (st.profile.setupDone) {
    scrollMemo[ui.tab] = window.scrollY || 0;
  }
  app.innerHTML = shell(currentViewHTML());
  if (st.profile.setupDone) {
    window.scrollTo(0, scrollMemo[ui.tab] || 0);
    if (ui.tab === 'train') timer.paint();
  }
}

// ---------------- 表单读取 ----------------

const num = (id, fallback) => {
  const el = document.getElementById(id);
  if (!el) return fallback;
  const v = Number(el.value);
  return Number.isFinite(v) && v > 0 ? v : fallback;
};
const str = (id, fallback) => {
  const el = document.getElementById(id);
  return el ? el.value : fallback;
};

function readProfileForm({ requireSetup = false } = {}) {
  const base = { ...getState().profile };
  return {
    ...base,
    sex: str('pf-sex', base.sex),
    age: num('pf-age', base.age),
    heightCm: num('pf-height', base.heightCm),
    weightKg: num('pf-weight', base.weightKg),
    activity: num('pf-activity', base.activity),
    rate: num('pf-rate', base.rate),
    proteinPerKg: num('pf-protein', base.proteinPerKg),
    planId: str('pf-plan', base.planId),
    setupDone: requireSetup ? true : base.setupDone
  };
}

// ---------------- 动作分发 ----------------

const actions = {
  go(el) {
    ui.tab = el.dataset.tab;
    if (ui.tab === 'train') ui.trainDayId = null;
    render();
  },
  'go-today'() {
    ui.date = todayKey();
    ui.trainDayId = null;
    render();
  },
  'date-shift'(el) {
    const days = Number(el.dataset.days) || 0;
    const [y, m, d] = ui.date.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + days);
    ui.date = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    ui.trainDayId = null;
    render();
  },
  'open-date'(el) {
    ui.date = el.dataset.key;
    ui.tab = 'today';
    ui.trainDayId = null;
    render();
  },
  'meal-eaten'(el) { toggleEaten(ui.date, el.dataset.meal); },
  'meal-rotate'(el) { rotate(ui.date, el.dataset.meal); toast('换好了，热量已重新配平'); },
  'day-regen'() { regenerateDay(ui.date); toast('已按新目标重排今天的餐单'); },
  'weight-save'() {
    const el = document.getElementById('weight-input');
    const v = Number(el?.value);
    if (!v) return toast('请输入体重');
    setWeight(ui.date, v);
    toast('体重已记录');
  },
  'set-toggle'(el) { toggleSet(ui.date, el.dataset.ex, Number(el.dataset.idx), Number(el.dataset.total)); },
  'workout-finish'(el) { finishWorkout(ui.date, el.dataset.done === '1'); },
  'train-day'(el) { ui.trainDayId = el.dataset.dayId; render(); },
  'timer-preset'(el) { timer.reset(Number(el.dataset.sec)); },
  'timer-toggle'() { timer.id ? timer.stop() : timer.start(); timer.paint(); },
  'timer-reset'() { timer.reset(); },
  'toggle-weekday'(el) {
    const st = getState();
    const planId = st.profile.planId;
    const cur = new Set(st.settings.weekdays[planId] || []);
    const wd = Number(el.dataset.wd);
    cur.has(wd) ? cur.delete(wd) : cur.add(wd);
    setTrainingDays(planId, [...cur]);
  },
  'profile-save'() {
    updateProfile(readProfileForm());
    toast('档案已保存，目标热量已重算');
  },
  'plan-save'() {
    const planId = str('pf-plan', getState().profile.planId);
    updateProfile({ planId });
    if (!getState().settings.weekdays[planId]) {
      setTrainingDays(planId, (PLANS[planId]?.days || []).map((_, i) => i + 1));
    }
    toast('训练安排已保存');
  },
  'setup-save'() {
    updateProfile(readProfileForm({ requireSetup: true }));
    const planId = getState().profile.planId;
    if (!getState().settings.weekdays[planId]) {
      setTrainingDays(planId, (PLANS[planId]?.days || []).map((_, i) => i + 1));
    }
    ensureDay(todayKey());
    ui.tab = 'today';
    ui.date = todayKey();
    render();
    toast('已经按你的数据排好今天了');
  },
  'data-export'() {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `减脂备份-${todayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('备份已导出到「文件」里');
  },
  'data-import'() {
    const input = document.getElementById('import-file');
    if (!input) return;
    input.value = '';
    input.click();
  },
  'data-reset'() {
    if (!confirm('确定清空所有数据吗？包括体重记录、餐单和训练打卡。建议先导出备份。')) return;
    resetAll();
    ui.tab = 'today';
    ui.date = todayKey();
    render();
    toast('已清空');
  }
};

app.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || !app.contains(el)) return;
  const fn = actions[el.dataset.action];
  if (!fn) return;
  e.preventDefault();
  fn(el);
});

// 导入备份的文件选择
app.addEventListener('change', async (e) => {
  const input = e.target.closest('#import-file');
  if (!input || !input.files?.length) return;
  try {
    const text = await input.files[0].text();
    importJSON(text);
    ui.tab = 'today';
    render();
    toast('备份已导入');
  } catch (err) {
    toast('导入失败：文件格式不对');
  }
});

subscribe(render);

// ---------------- 启动 ----------------

const st = getState();
if (st.profile.setupDone) ensureDay(todayKey());
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => console.warn('离线缓存注册失败', err));
  });
}
