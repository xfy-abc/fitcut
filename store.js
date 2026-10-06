/**
 * 状态与本地存储。
 * 所有数据都存在手机本机（localStorage），不上传任何服务器；卸载或清除网站数据会丢失，
 * 所以「我的 → 数据备份」提供了导出/导入 JSON 的兜底。
 */
import { calcTargets, generateDay, rotateMeal, DEFAULT_PROFILE, dayMacros, dayMacrosWithScale } from './nutrition.js';
import { DISHES, MEAL_ORDER } from './dishes.js';
import { PLANS, DEFAULT_WEEKDAYS } from './templates.js';

const KEY = 'fitcut.state.v1';
const VERSION = 1;

const listeners = new Set();

function emptyState() {
  return {
    version: VERSION,
    profile: { ...DEFAULT_PROFILE },
    days: {},
    settings: {
      weekdays: { ...DEFAULT_WEEKDAYS },
      restTimerSec: 75,
      autoWeight: true
    }
  };
}

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return emptyState();
    const base = emptyState();
    return {
      ...base,
      ...parsed,
      profile: { ...base.profile, ...(parsed.profile || {}) },
      settings: { ...base.settings, ...(parsed.settings || {}), weekdays: { ...base.settings.weekdays, ...((parsed.settings || {}).weekdays || {}) } },
      days: parsed.days || {}
    };
  } catch (err) {
    console.warn('读取本地数据失败，已使用默认值', err);
    return emptyState();
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('保存失败（可能是 Safari 隐私模式）', err);
  }
}

function emit() {
  for (const fn of listeners) fn(state);
}

function commit() {
  persist();
  emit();
}

// ---------------- 日期工具 ----------------

export function dateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayKey() {
  return dateKey(new Date());
}

/** 本地时区安全的解析，避免 new Date('2026-01-01') 被当成 UTC 造成差一天。 */
export function parseKey(key) {
  const [y, m, d] = String(key).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function shiftKey(key, days) {
  const d = parseKey(key);
  d.setDate(d.getDate() + days);
  return dateKey(d);
}

export function weekdayOf(key) {
  return parseKey(key).getDay(); // 0=周日
}

const WEEK_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function prettyDate(key) {
  const d = parseKey(key);
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日 ${WEEK_CN[d.getDay()]}`;
}

export function relativeDayLabel(key) {
  const t = todayKey();
  if (key === t) return '今天';
  if (key === shiftKey(t, -1)) return '昨天';
  if (key === shiftKey(t, 1)) return '明天';
  return prettyDate(key);
}

// ---------------- 训练安排 ----------------

/** 根据所选计划与每周训练日，算出某天该练哪一个训练日；休息日返回 null。 */
export function workoutForDate(key, st = state) {
  const planId = st.profile.planId;
  const plan = PLANS[planId] || PLANS.fullbody3;
  const days = (st.settings.weekdays[planId] || []).slice().sort((a, b) => a - b);
  const wd = weekdayOf(key);
  const pos = days.indexOf(wd);
  if (pos === -1) return null;
  const def = plan.days[pos % plan.days.length];
  return { planId, planName: plan.name, dayId: def.id, dayName: def.name, items: def.items };
}

export function nextWorkoutKey(fromKey = todayKey()) {
  for (let i = 0; i <= 7; i++) {
    const k = shiftKey(fromKey, i);
    if (workoutForDate(k)) return k;
  }
  return null;
}

// ---------------- 单日记录 ----------------

export function getDay(key) {
  return state.days[key] || null;
}

function blankDay(key) {
  const t = calcTargets(state.profile);
  const gen = generateDay(t, key, recentDishIds(key));
  return {
    date: key,
    weightKg: null,
    picks: gen.picks,
    scale: gen.scale,
    eaten: {},
    workout: {},
    note: ''
  };
}

export function ensureDay(key) {
  if (!state.days[key]) {
    state.days[key] = blankDay(key);
    commit();
  }
  return state.days[key];
}

/** 最近 3 天已经排过的餐单，用于今天尽量换口味。 */
export function recentDishIds(key, lookback = 3) {
  const out = [];
  for (let i = 1; i <= lookback; i++) {
    const d = state.days[shiftKey(key, -i)];
    if (d && d.picks) out.push(...Object.values(d.picks));
  }
  return out.filter(Boolean);
}

export function targets() {
  return calcTargets(state.profile);
}

export function regenerateDay(key) {
  const day = ensureDay(key);
  const t = targets();
  const gen = generateDay(t, key, recentDishIds(key));
  day.picks = gen.picks;
  day.scale = gen.scale;
  day.eaten = {};
  commit();
}

export function rotate(key, meal) {
  const day = ensureDay(key);
  const t = targets();
  const res = rotateMeal(t, day.picks, day.scale, meal);
  day.picks = res.picks;
  day.scale = res.scale;
  day.eaten[meal] = false;
  commit();
}

export function toggleEaten(key, meal) {
  const day = ensureDay(key);
  day.eaten[meal] = !day.eaten[meal];
  commit();
}

export function setWeight(key, kg) {
  const day = ensureDay(key);
  const v = Number(kg);
  if (!v || v <= 0) {
    day.weightKg = null;
  } else {
    day.weightKg = Math.round(v * 10) / 10;
    // 只有记录的是最新体重时才更新档案，避免补录旧数据把当前体重改回去
    const latest = latestWeightKey();
    if (!latest || key >= latest) state.profile.weightKg = day.weightKg;
  }
  commit();
}

export function latestWeightKey() {
  const keys = Object.keys(state.days).filter((k) => state.days[k].weightKg).sort();
  return keys.length ? keys[keys.length - 1] : null;
}

export function weightSeries(limit = 60) {
  return Object.keys(state.days)
    .filter((k) => state.days[k].weightKg)
    .sort()
    .slice(-limit)
    .map((k) => ({ key: k, kg: state.days[k].weightKg }));
}

export function toggleSet(key, exKey, index, total) {
  const day = ensureDay(key);
  day.workout = day.workout || {};
  const arr = day.workout[exKey] || new Array(total).fill(false);
  while (arr.length < total) arr.push(false);
  arr[index] = !arr[index];
  day.workout[exKey] = arr;
  commit();
}

export function finishWorkout(key, done) {
  const day = ensureDay(key);
  day.workout = day.workout || {};
  day.workout.done = done;
  commit();
}

export function setNote(key, note) {
  const day = ensureDay(key);
  day.note = String(note || '').slice(0, 500);
  commit();
}

// ---------------- 档案与设置 ----------------

export function updateProfile(patch) {
  state.profile = { ...state.profile, ...patch };
  // 身体数据变了，之后几天的餐单要按新目标重排；历史记录保持原样
  const t = targets();
  const today = todayKey();
  for (let i = 0; i < 7; i++) {
    const k = shiftKey(today, i);
    const d = state.days[k];
    if (d) {
      const gen = generateDay(t, k, recentDishIds(k));
      d.picks = gen.picks;
      d.scale = gen.scale;
    }
  }
  commit();
}

export function updateSettings(patch) {
  state.settings = { ...state.settings, ...patch };
  commit();
}

export function setTrainingDays(planId, weekdays) {
  state.settings.weekdays = { ...state.settings.weekdays, [planId]: weekdays.slice().sort((a, b) => a - b) };
  commit();
}

// ---------------- 备份 ----------------

export function exportJSON() {
  return JSON.stringify(state, null, 2);
}

export function importJSON(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || !parsed.profile) {
    throw new Error('文件格式不对，应该是本应用导出的备份 JSON');
  }
  state = { ...emptyState(), ...parsed };
  state.settings = { ...emptyState().settings, ...(parsed.settings || {}) };
  state.profile = { ...DEFAULT_PROFILE, ...(parsed.profile || {}) };
  commit();
}

export function resetAll() {
  state = emptyState();
  commit();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState() {
  return state;
}

export { PLANS, MEAL_ORDER, DISHES, dayMacros, dayMacrosWithScale };
