/**
 * 营养计算：基础代谢 → 每日消耗 → 减脂目标 → 三大宏量 → 生成当天餐单。
 *
 * 公式说明（都取自主流公开做法）：
 * - 基础代谢 BMR 用 Mifflin-St Jeor 公式，目前临床和运动营养里最常用的一版。
 * - 每日总消耗 TDEE = BMR × 活动系数。
 * - 减脂缺口按 1 kg 脂肪约 7700 kcal 折算，并做安全下限与上限约束。
 */
import { DISHES, MEAL_ORDER, MEAL_SPLIT } from './data/dishes.js';
import { ingredient } from './data/ingredients.js';

export const ACTIVITY_LEVELS = [
  { value: 1.2,   label: '久坐', desc: '几乎不运动，久坐办公' },
  { value: 1.375, label: '轻度', desc: '每周训练 1~3 次' },
  { value: 1.55,  label: '中度', desc: '每周训练 3~5 次' },
  { value: 1.725, label: '高强度', desc: '每周训练 6~7 次或体力工作' }
];

/** 每周减重速度（kg）选项。 */
export const RATE_OPTIONS = [
  { value: 0.25, label: '稳一点', desc: '每周约 -0.25 kg，几乎不掉肌肉' },
  { value: 0.5,  label: '标准',   desc: '每周约 -0.5 kg，最推荐' },
  { value: 0.75, label: '激进',   desc: '每周约 -0.75 kg，需要严格执行' }
];

export const DEFAULT_PROFILE = {
  sex: 'male',
  age: 30,
  heightCm: 175,
  weightKg: 75,
  activity: 1.375,
  rate: 0.5,
  proteinPerKg: 1.8,
  planId: 'fullbody3',
  setupDone: false
};

const KCAL_PER_KG_FAT = 7700;

/** 按份量系数缩放食材克数：小份量精确到 1g，大份量取整到 5g，方便称重也避免出现 137.4g 这种数。 */
export function servingItems(dish, factor = 1) {
  const f = Number(factor) > 0 ? Number(factor) : 1;
  return dish.items.map(([key, grams]) => {
    const g = grams * f;
    const rounded = g < 20 ? Math.round(g) : Math.round(g / 5) * 5;
    return [key, Math.max(1, rounded)];
  });
}

/** 单个餐次方案的营养值，可按份量系数缩放。 */
export function dishNutrition(dish, factor = 1) {
  let kcal = 0, p = 0, c = 0, f = 0;
  for (const [key, grams] of servingItems(dish, factor)) {
    const ing = ingredient(key);
    const k = grams / 100;
    kcal += ing.kcal * k;
    p += ing.p * k;
    c += ing.c * k;
    f += ing.f * k;
  }
  return { kcal: Math.round(kcal), p: Math.round(p * 10) / 10, c: Math.round(c * 10) / 10, f: Math.round(f * 10) / 10 };
}

/**
 * 份量系数：让这一餐的实际热量贴近该餐目标。
 * 限制在 0.6~2.0 倍之间——再小就是没吃够，再大一份做起来不现实，这时候应该换菜而不是继续加量。
 */
export function scaleFor(kcal, target) {
  if (!kcal) return 1;
  return Math.min(2, Math.max(0.6, target / kcal));
}

const roundFactor = (f) => Math.round(Math.min(2, Math.max(0.6, f)) * 20) / 20;

/** 由身体档案推算每日目标。 */
export function calcTargets(profile) {
  const p = { ...DEFAULT_PROFILE, ...profile };
  const weight = Number(p.weightKg) || DEFAULT_PROFILE.weightKg;
  const height = Number(p.heightCm) || DEFAULT_PROFILE.heightCm;
  const age = Number(p.age) || DEFAULT_PROFILE.age;

  // 1. 基础代谢
  const bmrRaw = 10 * weight + 6.25 * height - 5 * age + (p.sex === 'female' ? -161 : 5);

  // 2. 每日总消耗
  const tdee = bmrRaw * (Number(p.activity) || 1.375);

  // 3. 减脂缺口：按每周目标体重变化折算，同时设上限，避免越减越极端
  const wanted = (Number(p.rate) || 0.5) * KCAL_PER_KG_FAT / 7;
  const maxDeficit = 0.25 * tdee;
  const deficit = Math.min(wanted, maxDeficit);

  // 4. 安全下限：不低于自身基础代谢，也不低于 女性 1200 / 男性 1500。
  //    长期吃到基础代谢以下，掉的会越来越多是肌肉，得不偿失。
  const floor = Math.max(p.sex === 'female' ? 1200 : 1500, bmrRaw);
  let targetKcal = tdee - deficit;
  const warnings = [];
  let floorApplied = false;
  if (targetKcal < floor) {
    targetKcal = floor;
    floorApplied = true;
    warnings.push('按你选的速度，热量会低于安全下限，已自动上调。想更快就增加运动量，而不是再少吃。');
  }
  if (deficit < wanted - 1 && !floorApplied) {
    warnings.push('缺口已限制在每日消耗的 25% 以内，这是能长期坚持、又不掉肌肉的合理上限。');
  }

  // 下限或上限生效后，实际缺口会小于你选的速度，这里以实际值回报，避免界面自相矛盾
  const actualDeficit = Math.max(0, tdee - targetKcal);

  // 5. 三大宏量
  let protein = weight * (Number(p.proteinPerKg) || 1.8);
  let fat = Math.max(weight * 0.8, (0.25 * targetKcal) / 9);
  fat = Math.min(fat, (0.35 * targetKcal) / 9);
  let carb = (targetKcal - protein * 4 - fat * 9) / 4;
  if (carb < 0) {
    // 热量太低时先压脂肪，保证蛋白和碳水的摄入空间
    fat = Math.max(weight * 0.6, (targetKcal - protein * 4) / 9);
    carb = Math.max(0, (targetKcal - protein * 4 - fat * 9) / 4);
  }

  const r = (n) => Math.round(n);
  return {
    bmr: r(bmrRaw),
    tdee: r(tdee),
    deficit: r(actualDeficit),
    targetKcal: r(targetKcal),
    protein: r(protein),
    fat: r(fat),
    carb: r(carb),
    floorApplied,
    warnings,
    // 参考：按当前缺口预计的每周变化
    weeklyKg: Math.round((-actualDeficit * 7 / KCAL_PER_KG_FAT) * 100) / 100
  };
}

/** 各餐的目标热量。 */
export function mealTargets(targetKcal) {
  const out = {};
  for (const meal of MEAL_ORDER) out[meal] = targetKcal * MEAL_SPLIT[meal];
  return out;
}

function candidates(meal) {
  return DISHES
    .filter((d) => d.meals.includes(meal))
    .map((d) => ({ dish: d, kcal: dishNutrition(d).kcal }))
    .sort((a, b) => a.kcal - b.kcal);
}

function hashSeed(str) {
  let h = 2166136261 >>> 0;
  for (const ch of str) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickById(id) {
  const d = DISHES.find((x) => x.id === id);
  if (!d) throw new Error(`未知餐单: ${id}`);
  return d;
}

export function dayMacros(picks) {
  return dayMacrosWithScale(picks, null);
}

/** 带上份量系数的全天营养合计。 */
export function dayMacrosWithScale(picks, scale) {
  let kcal = 0, p = 0, c = 0, f = 0;
  for (const meal of MEAL_ORDER) {
    const id = picks[meal];
    if (!id) continue;
    const n = dishNutrition(pickById(id), scale?.[meal] ?? 1);
    kcal += n.kcal; p += n.p; c += n.c; f += n.f;
  }
  return {
    kcal: Math.round(kcal),
    p: Math.round(p * 10) / 10,
    c: Math.round(c * 10) / 10,
    f: Math.round(f * 10) / 10
  };
}

/**
 * 代价函数：全天总量偏离目标 + 各餐偏离该餐目标。
 * 双项加权是为了避免"午餐超标 400、晚餐欠 400，全天看起来刚好"这种不合理的搭配。
 */
function fitScale(picks, meal, mt) {
  const id = picks[meal];
  if (!id) return 1;
  return roundFactor(scaleFor(dishNutrition(pickById(id)).kcal, mt[meal]));
}

function cost(picks, mt, targetKcal) {
  let mealErr = 0;
  for (const meal of MEAL_ORDER) {
    const id = picks[meal];
    if (!id) continue;
    const f = fitScale(picks, meal, mt);
    mealErr += Math.abs(dishNutrition(pickById(id), f).kcal - mt[meal]);
  }
  const scale = Object.fromEntries(MEAL_ORDER.map((m) => [m, fitScale(picks, m, mt)]));
  const total = dayMacrosWithScale(picks, scale).kcal;
  return Math.abs(total - targetKcal) + 0.5 * mealErr;
}

/** 局部搜索：逐个餐次换候选，只接受能让整体搭配变好的改动。 */
function optimize(picks, mt, targetKcal, locked = []) {
  let best = { ...picks };
  let bestCost = cost(best, mt, targetKcal);
  for (let pass = 0; pass < 3; pass++) {
    let improved = false;
    for (const meal of MEAL_ORDER) {
      if (locked.includes(meal)) continue;
      for (const cand of candidates(meal)) {
        if (cand.dish.id === best[meal]) continue;
        const trial = { ...best, [meal]: cand.dish.id };
        const c = cost(trial, mt, targetKcal);
        if (c < bestCost - 0.5) {
          best = trial;
          bestCost = c;
          improved = true;
        }
      }
    }
    if (!improved) break;
  }
  return best;
}

/**
 * 生成某一天的餐单。
 * @param {object} targets calcTargets 的结果
 * @param {string} dateKey 'YYYY-MM-DD'，同时作为随机种子，同一天结果稳定
 * @param {string[]} recentIds 最近几天吃过的餐单 id，优先避开
 */
export function generateDay(targets, dateKey, recentIds = []) {
  const rnd = mulberry32(hashSeed(dateKey));
  const mt = mealTargets(targets.targetKcal);
  const picks = {};
  const scale = {};

  for (const meal of MEAL_ORDER) {
    const target = mt[meal];
    const all = candidates(meal)
      .map((x) => ({ ...x, err: Math.abs(x.kcal - target) / target, factor: roundFactor(scaleFor(x.kcal, target)) }))
      .sort((a, b) => a.err - b.err);

    let pool = all.filter((x) => x.err <= 0.15 && !recentIds.includes(x.dish.id));
    if (pool.length < 3) pool = all.filter((x) => x.err <= 0.25 && !recentIds.includes(x.dish.id));
    if (pool.length < 3) pool = all.filter((x) => x.err <= 0.15);
    if (pool.length < 2) pool = all.filter((x) => !recentIds.includes(x.dish.id));
    if (!pool.length) pool = all;

    const top = pool.slice(0, Math.min(4, pool.length));
    picks[meal] = top[Math.floor(rnd() * top.length)].dish.id;
    scale[meal] = roundFactor(scaleFor(dishNutrition(pickById(picks[meal])).kcal, target));
  }

  // 份量缩放后通常已经很贴近目标，只有在明显偏差时才换菜（例如份量已经顶到上限）
  let finalPicks = picks;
  let finalScale = scale;
  const err = Math.abs(dayMacrosWithScale(picks, scale).kcal - targets.targetKcal) / targets.targetKcal;
  if (err > 0.06) {
    finalPicks = optimize(picks, mt, targets.targetKcal);
    finalScale = Object.fromEntries(MEAL_ORDER.map((m) => [m, fitScale(finalPicks, m, mt)]));
  }
  return { picks: finalPicks, scale: finalScale };
}

/** 单独换掉某一餐，其余餐次自动微调以尽量贴近全天目标。 */
export function rotateMeal(targets, picks, scale, meal, direction = 1) {
  const mt = mealTargets(targets.targetKcal);
  const target = mt[meal];
  const all = candidates(meal)
    .map((x) => ({ ...x, err: Math.abs(x.kcal - target) / target }))
    .sort((a, b) => a.err - b.err);

  let pool = all.filter((x) => x.err <= 0.25);
  if (pool.length < 3) pool = all.slice(0, 5);

  const idx = pool.findIndex((x) => x.dish.id === picks[meal]);
  const next = pool[((idx === -1 ? 0 : idx + direction) % pool.length + pool.length) % pool.length];

  const swapped = { ...picks, [meal]: next.dish.id };
  const swappedScale = { ...(scale || {}), [meal]: roundFactor(scaleFor(dishNutrition(next.dish).kcal, target)) };
  const optimized = optimize(swapped, mt, targets.targetKcal, [meal]);
  return {
    picks: optimized,
    scale: Object.fromEntries(MEAL_ORDER.map((m) => [m,
      m === meal ? swappedScale[m] : fitScale(optimized, m, mt)]))
  };
}

/** 全天四餐是否都选好了。 */
export function isComplete(picks) {
  return MEAL_ORDER.every((m) => Boolean(picks[m]));
}

export { MEAL_ORDER, MEAL_SPLIT, DISHES, pickById };
