/**
 * 食材营养库（每 100g 参考值）
 * kcal=热量千卡, p=蛋白质g, c=碳水g, f=脂肪g
 * raw: '生' 表示营养值按生重计，'熟' 表示按成品熟重计。
 *
 * 数据取自中国食物成分表与美国 USDA 的常见公开参考值，做了面向家常做法的取整。
 * 不同品牌、部位、做法会有 10%~20% 浮动，用于日常减脂规划足够，不作为医学依据。
 */
export const INGREDIENTS = {
  // ---------- 主食 / 碳水 ----------
  rice_cooked:      { name: '米饭（熟）',      kcal: 116, p: 2.6, c: 25.9, f: 0.3,  cat: 'staple', raw: '熟' },
  brown_rice:       { name: '糙米饭（熟）',    kcal: 112, p: 2.6, c: 23.5, f: 0.9,  cat: 'staple', raw: '熟' },
  quinoa_cooked:    { name: '藜麦（熟）',      kcal: 120, p: 4.4, c: 21.3, f: 1.9,  cat: 'staple', raw: '熟' },
  oat:              { name: '燕麦片（干）',    kcal: 389, p: 16.9, c: 66.3, f: 6.9, cat: 'staple', raw: '生' },
  whole_bread:      { name: '全麦面包',        kcal: 247, p: 13.0, c: 41.0, f: 3.4, cat: 'staple', raw: '熟' },
  steamed_bun:      { name: '馒头',            kcal: 223, p: 7.0, c: 47.0, f: 1.1,  cat: 'staple', raw: '熟' },
  sweet_potato:     { name: '红薯（蒸）',      kcal: 86,  p: 1.6, c: 20.1, f: 0.1,  cat: 'staple', raw: '熟' },
  purple_potato:    { name: '紫薯（蒸）',      kcal: 106, p: 1.8, c: 24.0, f: 0.2,  cat: 'staple', raw: '熟' },
  potato:           { name: '土豆（蒸）',      kcal: 77,  p: 2.0, c: 17.0, f: 0.1,  cat: 'staple', raw: '熟' },
  corn:             { name: '玉米（煮）',      kcal: 112, p: 4.0, c: 22.8, f: 1.2,  cat: 'staple', raw: '熟' },
  buckwheat_noodle: { name: '荞麦面（熟）',    kcal: 137, p: 5.0, c: 27.0, f: 0.7,  cat: 'staple', raw: '熟' },
  pasta_cooked:     { name: '意面（熟）',      kcal: 158, p: 5.8, c: 31.0, f: 0.9,  cat: 'staple', raw: '熟' },
  rice_noodle:      { name: '米粉（熟）',      kcal: 109, p: 1.8, c: 24.6, f: 0.2,  cat: 'staple', raw: '熟' },
  millet_porridge:  { name: '小米粥',          kcal: 46,  p: 1.4, c: 9.7,  f: 0.3,  cat: 'staple', raw: '熟' },
  konjac_noodle:    { name: '魔芋丝',          kcal: 10,  p: 0.2, c: 2.4,  f: 0.1,  cat: 'staple', raw: '熟' },

  // ---------- 蛋白质 ----------
  chicken_breast:   { name: '鸡胸肉（去皮）',  kcal: 133, p: 31.0, c: 0, f: 1.9, cat: 'protein', raw: '生' },
  chicken_thigh:    { name: '鸡腿肉（去皮）',  kcal: 145, p: 20.0, c: 0, f: 7.0, cat: 'protein', raw: '生' },
  beef_lean:        { name: '牛里脊（瘦）',    kcal: 143, p: 22.0, c: 0, f: 5.4, cat: 'protein', raw: '生' },
  beef_shank:       { name: '牛腱',            kcal: 106, p: 20.0, c: 0, f: 2.5, cat: 'protein', raw: '生' },
  pork_lean:        { name: '猪里脊（瘦）',    kcal: 155, p: 20.0, c: 0, f: 7.9, cat: 'protein', raw: '生' },
  salmon:           { name: '三文鱼',          kcal: 208, p: 20.0, c: 0, f: 13.0, cat: 'protein', raw: '生' },
  cod:              { name: '鳕鱼',            kcal: 88,  p: 20.4, c: 0, f: 0.5, cat: 'protein', raw: '生' },
  tilapia:          { name: '龙利鱼/巴沙鱼',   kcal: 90,  p: 17.0, c: 0, f: 2.3, cat: 'protein', raw: '生' },
  shrimp:           { name: '虾仁',            kcal: 93,  p: 18.6, c: 0.8, f: 0.8, cat: 'protein', raw: '生' },
  squid:            { name: '鱿鱼',            kcal: 75,  p: 17.0, c: 2.0, f: 0.8, cat: 'protein', raw: '生' },
  scallop:          { name: '扇贝',            kcal: 60,  p: 11.1, c: 2.6, f: 0.6, cat: 'protein', raw: '生' },
  tuna_water:       { name: '金枪鱼罐头（水浸）', kcal: 116, p: 25.5, c: 0, f: 1.0, cat: 'protein', raw: '熟' },
  egg:              { name: '鸡蛋',            kcal: 143, p: 13.0, c: 1.1, f: 9.5, cat: 'protein', raw: '生' },
  egg_white:        { name: '蛋清',            kcal: 48,  p: 11.6, c: 0.7, f: 0.2, cat: 'protein', raw: '生' },
  duck_breast:      { name: '鸭胸（去皮）',    kcal: 140, p: 24.0, c: 0, f: 4.5, cat: 'protein', raw: '生' },
  whey:             { name: '乳清蛋白粉',      kcal: 380, p: 80.0, c: 8.0, f: 3.0, cat: 'protein', raw: '生' },

  // ---------- 豆制品 / 奶 ----------
  tofu_firm:        { name: '北豆腐',          kcal: 116, p: 12.2, c: 3.0, f: 6.8, cat: 'dairy', raw: '生' },
  tofu_silken:      { name: '内酯豆腐',        kcal: 50,  p: 5.0, c: 2.6, f: 2.7, cat: 'dairy', raw: '生' },
  dried_tofu:       { name: '豆腐干',          kcal: 140, p: 16.2, c: 6.3, f: 6.0, cat: 'dairy', raw: '熟' },
  milk_skim:        { name: '脱脂牛奶',        kcal: 34,  p: 3.4, c: 5.0, f: 0.1, cat: 'dairy', raw: '熟' },
  milk_whole:       { name: '全脂牛奶',        kcal: 61,  p: 3.2, c: 4.9, f: 3.3, cat: 'dairy', raw: '熟' },
  yogurt_plain:     { name: '无糖酸奶',        kcal: 60,  p: 3.5, c: 4.7, f: 3.3, cat: 'dairy', raw: '熟' },
  greek_yogurt:     { name: '希腊酸奶（无糖）', kcal: 97, p: 9.0, c: 3.6, f: 5.0, cat: 'dairy', raw: '熟' },
  soy_milk:         { name: '无糖豆浆',        kcal: 31,  p: 3.0, c: 1.2, f: 1.6, cat: 'dairy', raw: '熟' },

  // ---------- 蔬菜 ----------
  broccoli:         { name: '西兰花',          kcal: 34, p: 2.8, c: 6.6, f: 0.4, cat: 'veg', raw: '生' },
  spinach:          { name: '菠菜',            kcal: 23, p: 2.9, c: 3.6, f: 0.4, cat: 'veg', raw: '生' },
  lettuce:          { name: '生菜',            kcal: 15, p: 1.4, c: 2.0, f: 0.2, cat: 'veg', raw: '生' },
  cucumber:         { name: '黄瓜',            kcal: 15, p: 0.8, c: 2.9, f: 0.2, cat: 'veg', raw: '生' },
  tomato:           { name: '番茄',            kcal: 18, p: 0.9, c: 3.9, f: 0.2, cat: 'veg', raw: '生' },
  asparagus:        { name: '芦笋',            kcal: 20, p: 2.2, c: 3.9, f: 0.1, cat: 'veg', raw: '生' },
  mushroom:         { name: '口蘑',            kcal: 22, p: 3.0, c: 3.3, f: 0.3, cat: 'veg', raw: '生' },
  bell_pepper:      { name: '彩椒',            kcal: 26, p: 1.0, c: 6.0, f: 0.2, cat: 'veg', raw: '生' },
  carrot:           { name: '胡萝卜',          kcal: 41, p: 0.9, c: 9.6, f: 0.2, cat: 'veg', raw: '生' },
  cabbage:          { name: '卷心菜',          kcal: 24, p: 1.5, c: 4.6, f: 0.2, cat: 'veg', raw: '生' },
  bok_choy:         { name: '小白菜',          kcal: 15, p: 1.5, c: 2.4, f: 0.3, cat: 'veg', raw: '生' },
  eggplant:         { name: '茄子',            kcal: 23, p: 1.1, c: 5.0, f: 0.2, cat: 'veg', raw: '生' },
  zucchini:         { name: '西葫芦',          kcal: 17, p: 1.2, c: 3.1, f: 0.2, cat: 'veg', raw: '生' },
  cauliflower:      { name: '花菜',            kcal: 24, p: 1.9, c: 4.9, f: 0.2, cat: 'veg', raw: '生' },
  green_bean:       { name: '四季豆',          kcal: 31, p: 2.0, c: 5.7, f: 0.4, cat: 'veg', raw: '生' },
  pumpkin:          { name: '南瓜',            kcal: 23, p: 0.7, c: 5.3, f: 0.1, cat: 'veg', raw: '生' },
  okra:             { name: '秋葵',            kcal: 33, p: 1.9, c: 7.5, f: 0.2, cat: 'veg', raw: '生' },
  kelp:             { name: '海带（鲜）',      kcal: 13, p: 1.2, c: 2.1, f: 0.1, cat: 'veg', raw: '生' },
  wood_ear:         { name: '木耳（泡发）',    kcal: 27, p: 1.5, c: 6.0, f: 0.2, cat: 'veg', raw: '熟' },

  // ---------- 水果 ----------
  apple:            { name: '苹果',            kcal: 52, p: 0.3, c: 13.8, f: 0.2, cat: 'fruit', raw: '生' },
  banana:           { name: '香蕉',            kcal: 93, p: 1.4, c: 22.0, f: 0.2, cat: 'fruit', raw: '生' },
  blueberry:        { name: '蓝莓',            kcal: 57, p: 0.7, c: 14.5, f: 0.3, cat: 'fruit', raw: '生' },
  strawberry:       { name: '草莓',            kcal: 32, p: 1.0, c: 7.7, f: 0.3, cat: 'fruit', raw: '生' },
  orange:           { name: '橙子',            kcal: 47, p: 0.9, c: 11.8, f: 0.1, cat: 'fruit', raw: '生' },
  kiwi:             { name: '猕猴桃',          kcal: 61, p: 1.1, c: 14.7, f: 0.5, cat: 'fruit', raw: '生' },
  dragon_fruit:     { name: '火龙果',          kcal: 55, p: 1.1, c: 13.3, f: 0.2, cat: 'fruit', raw: '生' },
  watermelon:       { name: '西瓜',            kcal: 30, p: 0.6, c: 7.6, f: 0.1, cat: 'fruit', raw: '生' },
  avocado:          { name: '牛油果',          kcal: 160, p: 2.0, c: 8.5, f: 14.7, cat: 'fruit', raw: '生' },

  // ---------- 油脂 / 坚果 ----------
  olive_oil:        { name: '橄榄油',          kcal: 884, p: 0, c: 0, f: 100.0, cat: 'fat', raw: '生' },
  peanut_butter:    { name: '花生酱',          kcal: 600, p: 25.0, c: 20.0, f: 50.0, cat: 'fat', raw: '生' },
  almond:           { name: '巴旦木',          kcal: 578, p: 21.0, c: 22.0, f: 50.0, cat: 'fat', raw: '生' },
  walnut:           { name: '核桃',            kcal: 654, p: 15.0, c: 14.0, f: 59.0, cat: 'fat', raw: '生' },
  cashew:           { name: '腰果',            kcal: 553, p: 18.0, c: 30.0, f: 44.0, cat: 'fat', raw: '生' },
  sesame_paste:     { name: '芝麻酱',          kcal: 630, p: 19.0, c: 16.0, f: 56.0, cat: 'fat', raw: '生' },
  chia:             { name: '奇亚籽',          kcal: 486, p: 17.0, c: 42.0, f: 31.0, cat: 'fat', raw: '生' },

  // ---------- 调味 / 其他 ----------
  soy_sauce:        { name: '生抽',            kcal: 63,  p: 5.6, c: 10.1, f: 0.1, cat: 'other', raw: '熟' },
  vinegar:          { name: '米醋',            kcal: 31,  p: 0.5, c: 6.2,  f: 0.0, cat: 'other', raw: '熟' },
  honey:            { name: '蜂蜜',            kcal: 304, p: 0.3, c: 82.0, f: 0.0, cat: 'other', raw: '熟' },
  lemon:            { name: '柠檬',            kcal: 37,  p: 1.1, c: 6.2,  f: 1.2, cat: 'other', raw: '生' },
  garlic:           { name: '大蒜',            kcal: 128, p: 4.5, c: 27.0, f: 0.2, cat: 'other', raw: '生' },
  scallion:         { name: '小葱',            kcal: 27,  p: 1.8, c: 5.6,  f: 0.2, cat: 'other', raw: '生' },
  black_coffee:     { name: '黑咖啡（无糖）',  kcal: 2,   p: 0.3, c: 0.0,  f: 0.0, cat: 'other', raw: '熟' }
};

/** 食材分类的中文标签，用于餐单里分组展示。 */
export const CATEGORY_LABEL = {
  staple: '主食',
  protein: '蛋白',
  dairy: '奶豆',
  veg: '蔬菜',
  fruit: '水果',
  fat: '油脂坚果',
  other: '调味'
};

export function ingredient(key) {
  const it = INGREDIENTS[key];
  if (!it) throw new Error(`未知食材: ${key}`);
  return it;
}
