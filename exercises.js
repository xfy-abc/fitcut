/**
 * 动作库
 * part=主要部位, equip=器械, tip=一句要点的动作提示。
 * 减脂期力量训练的原则：动作以复合动作为主，重量不追求极限，组间休息 60~90 秒，尽量保住肌肉。
 */
export const EXERCISES = {
  // ---------- 胸 ----------
  bench_press:        { name: '杠铃卧推',       en: 'Barbell Bench Press',    part: '胸',   equip: '杠铃', tip: '肩胛后缩下沉，杠铃落到胸骨中下部，别弹胸。' },
  db_bench_press:     { name: '哑铃卧推',       en: 'Dumbbell Bench Press',   part: '胸',   equip: '哑铃', tip: '下放到肘略低于肩，行程比杠铃更长。' },
  incline_db_press:   { name: '上斜哑铃卧推',   en: 'Incline DB Press',       part: '胸',   equip: '哑铃', tip: '凳子 30° 左右，角度太高会变成推肩。' },
  push_up:            { name: '俯卧撑',         en: 'Push-up',                part: '胸',   equip: '自重', tip: '身体成一条直线，胸口贴近地面再推起。' },
  cable_fly:          { name: '绳索夹胸',       en: 'Cable Crossover',        part: '胸',   equip: '绳索', tip: '肘微屈固定，用大臂往中线夹，感受胸的收缩。' },
  machine_press:      { name: '坐姿推胸',       en: 'Machine Chest Press',    part: '胸',   equip: '器械', tip: '把手与胸中部同高，新手很安全的选择。' },
  pec_deck:           { name: '蝴蝶机夹胸',     en: 'Pec Deck',               part: '胸',   equip: '器械', tip: '回程慢放 2 秒，孤立刺激胸部。' },
  dips:               { name: '双杠臂屈伸',     en: 'Dips',                   part: '胸',   equip: '自重', tip: '身体前倾偏胸，直立偏三头，肩不舒服就跳过。' },

  // ---------- 背 ----------
  pull_up:            { name: '引体向上',       en: 'Pull-up',                part: '背',   equip: '自重', tip: '先沉肩再拉，想着用肘往下拉而不是用手。' },
  lat_pulldown:       { name: '高位下拉',       en: 'Lat Pulldown',           part: '背',   equip: '器械', tip: '拉到锁骨附近，别往后甩身体借力。' },
  barbell_row:        { name: '杠铃划船',       en: 'Barbell Row',            part: '背',   equip: '杠铃', tip: '背部平直，拉向下腹部，别耸肩。' },
  db_row:             { name: '单臂哑铃划船',   en: 'One-arm DB Row',         part: '背',   equip: '哑铃', tip: '一手撑凳，肘贴身体往后拉。' },
  seated_row:         { name: '坐姿绳索划船',   en: 'Seated Cable Row',       part: '背',   equip: '绳索', tip: '胸口挺起，肩膀别往前送。' },
  face_pull:          { name: '面拉',           en: 'Face Pull',              part: '背',   equip: '绳索', tip: '拉向面部，肘高于手，练后束和肩健康。' },
  straight_arm_pull:  { name: '直臂下压',       en: 'Straight-arm Pulldown',  part: '背',   equip: '绳索', tip: '手臂伸直，感受背阔肌发力。' },
  deadlift:           { name: '硬拉',           en: 'Deadlift',               part: '背',   equip: '杠铃', tip: '全程背部中立，用腿和臀起，别弓腰。' },

  // ---------- 腿 / 臀 ----------
  squat:              { name: '杠铃深蹲',       en: 'Back Squat',             part: '腿',   equip: '杠铃', tip: '下蹲到大腿平行地面，膝盖方向跟脚尖一致。' },
  goblet_squat:       { name: '高脚杯深蹲',     en: 'Goblet Squat',           part: '腿',   equip: '哑铃', tip: '抱一个哑铃在胸前，上半身自然直立。' },
  leg_press:          { name: '腿举',           en: 'Leg Press',              part: '腿',   equip: '器械', tip: '膝盖别锁死，下放到 90° 就够。' },
  romanian_dl:        { name: '罗马尼亚硬拉',   en: 'Romanian Deadlift',      part: '臀',   equip: '杠铃', tip: '屁股往后推，感受大腿后侧拉伸。' },
  bulgarian_split:    { name: '保加利亚分腿蹲', en: 'Bulgarian Split Squat',  part: '臀',   equip: '哑铃', tip: '后脚搭凳，前腿发力站起，臀腿都练到。' },
  lunge:              { name: '弓步蹲',         en: 'Walking Lunge',          part: '臀',   equip: '哑铃', tip: '步幅大一点，前膝不超过脚尖太多。' },
  leg_extension:      { name: '腿屈伸',         en: 'Leg Extension',          part: '腿',   equip: '器械', tip: '顶端停 1 秒，孤立刺激股四头肌。' },
  leg_curl:           { name: '腿弯举',         en: 'Leg Curl',               part: '腿',   equip: '器械', tip: '大腿贴紧凳面，只动小腿。' },
  hip_thrust:         { name: '臀桥 / 髋推',    en: 'Hip Thrust',             part: '臀',   equip: '杠铃', tip: '顶端夹紧臀部停 1 秒，别用腰借力。' },
  calf_raise:         { name: '站姿提踵',       en: 'Calf Raise',             part: '腿',   equip: '器械', tip: '脚跟放到最低再顶到最高，全行程。' },
  step_up:            { name: '箱上台阶',       en: 'Step-up',                part: '臀',   equip: '哑铃', tip: '整只脚踩上箱子，靠台阶那条腿发力。' },
  glute_bridge:       { name: '自重臀桥',       en: 'Glute Bridge',           part: '臀',   equip: '自重', tip: '居家也能做，可以垫高双脚增加难度。' },

  // ---------- 肩 ----------
  overhead_press:     { name: '站姿杠铃推举',   en: 'Overhead Press',         part: '肩',   equip: '杠铃', tip: '核心收紧，别用腿蹬起来。' },
  db_shoulder_press:  { name: '坐姿哑铃推举',   en: 'Seated DB Press',        part: '肩',   equip: '哑铃', tip: '下放到耳朵高度即可。' },
  lateral_raise:      { name: '哑铃侧平举',     en: 'Lateral Raise',          part: '肩',   equip: '哑铃', tip: '小重量多次数，抬到与肩同高，别耸肩。' },
  rear_delt_fly:      { name: '俯身飞鸟',       en: 'Rear Delt Fly',          part: '肩',   equip: '哑铃', tip: '俯身，肘微屈，往两侧打开。' },
  front_raise:        { name: '前平举',         en: 'Front Raise',            part: '肩',   equip: '哑铃', tip: '抬到肩高就停，避免用惯性甩。' },
  arnold_press:       { name: '阿诺德推举',     en: 'Arnold Press',           part: '肩',   equip: '哑铃', tip: '推起时手臂外旋，前中束都参与。' },

  // ---------- 手臂 ----------
  barbell_curl:       { name: '杠铃弯举',       en: 'Barbell Curl',           part: '手臂', equip: '杠铃', tip: '肘固定在体侧，只动手前臂。' },
  db_curl:            { name: '哑铃交替弯举',   en: 'Alternating DB Curl',    part: '手臂', equip: '哑铃', tip: '顶峰收缩时掌心可略外旋。' },
  hammer_curl:        { name: '锤式弯举',       en: 'Hammer Curl',            part: '手臂', equip: '哑铃', tip: '掌心相对，兼顾肱肌和手臂厚度。' },
  tricep_pushdown:    { name: '绳索下压',       en: 'Tricep Pushdown',        part: '手臂', equip: '绳索', tip: '大臂夹紧不外张，到底部伸直。' },
  skull_crusher:      { name: '仰卧臂屈伸',     en: 'Skull Crusher',          part: '手臂', equip: '杠铃', tip: '下放到额头附近，肘别乱动。' },
  overhead_tricep:    { name: '颈后臂屈伸',     en: 'Overhead Tricep Ext.',   part: '手臂', equip: '哑铃', tip: '大臂贴近耳朵，拉伸三头肌长头。' },
  close_grip_press:   { name: '窄距卧推',       en: 'Close-grip Bench Press', part: '手臂', equip: '杠铃', tip: '握距与肩同宽，肘夹住身体。' },
  preacher_curl:      { name: '牧师凳弯举',     en: 'Preacher Curl',          part: '手臂', equip: '器械', tip: '大臂完全贴住斜板，不借力。' },

  // ---------- 核心 ----------
  plank:              { name: '平板支撑',       en: 'Plank',                  part: '核心', equip: '自重', tip: '夹紧臀部和腹部，别塌腰也别撅屁股。' },
  side_plank:         { name: '侧平板支撑',     en: 'Side Plank',             part: '核心', equip: '自重', tip: '身体成一条直线，练侧腹。' },
  hanging_leg_raise:  { name: '悬垂举腿',       en: 'Hanging Leg Raise',      part: '核心', equip: '自重', tip: '用腹部把腿抬起来，别靠摆荡。' },
  crunch:             { name: '卷腹',           en: 'Crunch',                 part: '核心', equip: '自重', tip: '只抬起肩胛骨，下巴别往胸口压。' },
  russian_twist:      { name: '俄罗斯转体',     en: 'Russian Twist',          part: '核心', equip: '自重', tip: '转体时视线跟着手走，控制节奏。' },
  ab_wheel:           { name: '健腹轮',         en: 'Ab Wheel Rollout',       part: '核心', equip: '器械', tip: '从跪姿开始，腰不要塌。' },
  cable_crunch:       { name: '绳索卷腹',       en: 'Cable Crunch',           part: '核心', equip: '绳索', tip: '用腹肌把上身卷起来，髋部不动。' },
  mountain_climber:   { name: '登山跑',         en: 'Mountain Climber',       part: '核心', equip: '自重', tip: '手撑稳，膝盖快速交替，顺便练心肺。' },

  // ---------- 有氧 ----------
  incline_walk:       { name: '坡度快走',       en: 'Incline Walk',           part: '有氧', equip: '跑步机', tip: '坡度 8~12、速度 5~6 km/h，心率 120~140，最不伤关节的减脂有氧。' },
  treadmill_run:      { name: '跑步机慢跑',     en: 'Treadmill Run',          part: '有氧', equip: '跑步机', tip: '能边跑边说话的强度就够，不用追配速。' },
  elliptical:         { name: '椭圆机',         en: 'Elliptical',             part: '有氧', equip: '器械', tip: '阻力别调到太重，保持 20 分钟以上。' },
  rowing:             { name: '划船机',         en: 'Rowing Machine',         part: '有氧', equip: '器械', tip: '腿→背→手，回程反过来。全身参与。' },
  jump_rope:          { name: '跳绳',           en: 'Jump Rope',              part: '有氧', equip: '自重', tip: '分组跳，30 秒跳 30 秒歇，比连续跳轻松。' },
  cycling:            { name: '动感单车',       en: 'Stationary Bike',        part: '有氧', equip: '器械', tip: '坐垫调到大腿几乎伸直，膝盖不内扣。' },
  stair_climber:      { name: '爬楼机',         en: 'Stair Climber',          part: '有氧', equip: '器械', tip: '别趴在扶手上，靠腿发力。' },
  hiit:               { name: 'HIIT 间歇训练',  en: 'HIIT',                   part: '有氧', equip: '自重', tip: '20 秒全力 40 秒慢，循环 10 轮。时间紧就用它。' }
};

/** 动作部位的中文顺序，用于动作库分组浏览。 */
export const PART_ORDER = ['胸', '背', '腿', '臀', '肩', '手臂', '核心', '有氧'];

export function exercise(key) {
  const ex = EXERCISES[key];
  if (!ex) throw new Error(`未知动作: ${key}`);
  return ex;
}
