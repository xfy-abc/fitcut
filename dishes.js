/**
 * 餐次方案库
 * 每个方案 = 一组食材 + 克数，营养值由 nutrition.js 按 ingredients 实算，不手写数字。
 * meals: 适用的餐次，可选 breakfast / lunch / dinner / snack。
 * 克数为可食用部分的家常分量；主食类若是"熟"重，则按盛出后的重量填写。
 * 日常做菜优先蒸、煮、烤、少油快炒，油量已按 5~10g 计入，别额外再加一大勺。
 */
export const DISHES = [
  // ================= 早餐 =================
  {
    id: 'bf_oat_bowl', name: '燕麦牛奶碗', meals: ['breakfast'],
    items: [['oat', 50], ['milk_skim', 250], ['blueberry', 60], ['almond', 10]],
    steps: '燕麦用热牛奶冲泡 3 分钟，撒蓝莓和巴旦木。赶时间就用隔夜燕麦，前一晚拌好冷藏。'
  },
  {
    id: 'bf_sandwich', name: '全麦三明治套餐', meals: ['breakfast'],
    items: [['whole_bread', 70], ['egg', 100], ['tomato', 50], ['lettuce', 30], ['soy_milk', 250]],
    steps: '鸡蛋煎或水煮后夹入全麦面包，配番茄生菜和无糖豆浆。面包选配料表第一位是全麦粉的。'
  },
  {
    id: 'bf_egg_sweetpotato', name: '鸡蛋红薯套餐', meals: ['breakfast'],
    items: [['egg', 100], ['sweet_potato', 200], ['greek_yogurt', 100]],
    steps: '红薯前一晚蒸好冷藏，早上微波 2 分钟；鸡蛋水煮 8 分钟。最省事的减脂早餐。'
  },
  {
    id: 'bf_congee', name: '小米粥轻早餐', meals: ['breakfast'],
    items: [['millet_porridge', 300], ['egg_white', 100], ['whole_bread', 60], ['apple', 150]],
    steps: '胃口小的日子用这组：粥提供饱腹感，蛋白靠蛋清补，热量低但不至于上午饿到乱吃。'
  },
  {
    id: 'bf_greek_bowl', name: '希腊酸奶燕麦杯', meals: ['breakfast', 'snack'],
    items: [['greek_yogurt', 200], ['blueberry', 80], ['oat', 40], ['chia', 10]],
    steps: '全部倒进杯子拌匀，静置 5 分钟让奇亚籽吸水。可以带去公司当早餐。'
  },
  {
    id: 'bf_bun_soymilk', name: '中式快手早餐', meals: ['breakfast'],
    items: [['steamed_bun', 80], ['egg', 100], ['soy_milk', 250], ['cucumber', 100]],
    steps: '馒头配水煮蛋和无糖豆浆，加一根拍黄瓜解腻。外面买的话记得豆浆别加糖。'
  },
  {
    id: 'bf_corn_egg', name: '玉米鸡蛋餐', meals: ['breakfast'],
    items: [['corn', 200], ['egg', 100], ['milk_skim', 250]],
    steps: '玉米煮好切段，配两个水煮蛋和一杯脱脂奶。玉米比同重量的米饭更抗饿。'
  },
  {
    id: 'bf_salmon_toast', name: '三文鱼牛油果吐司', meals: ['breakfast'],
    items: [['whole_bread', 70], ['salmon', 60], ['avocado', 30], ['tomato', 50]],
    steps: '三文鱼煎至表面微焦，牛油果压成泥抹在烤过的全麦面包上。脂肪偏高但都是好脂肪，适合当天训练量大的早上。'
  },

  // ================= 午餐 =================
  {
    id: 'ln_chicken_broccoli', name: '香煎鸡胸 + 西兰花 + 糙米饭', meals: ['lunch'],
    items: [['chicken_breast', 150], ['broccoli', 200], ['brown_rice', 200], ['olive_oil', 8]],
    steps: '鸡胸提前用黑胡椒、蒜末、少许生抽腌 20 分钟，中火每面 4 分钟；西兰花焯水 90 秒后淋一点橄榄油。'
  },
  {
    id: 'ln_steam_fish', name: '清蒸龙利鱼 + 杂粮饭', meals: ['lunch'],
    items: [['tilapia', 180], ['brown_rice', 180], ['green_bean', 150], ['olive_oil', 8]],
    steps: '鱼柳铺姜丝蒸 8 分钟，出锅淋生抽和热油；四季豆焯熟后蒜炒。鱼比鸡胸更嫩，吃腻鸡胸时换这个。'
  },
  {
    id: 'ln_beef_asparagus', name: '牛肉炒芦笋 + 米饭', meals: ['lunch'],
    items: [['beef_lean', 150], ['asparagus', 150], ['rice_cooked', 200], ['olive_oil', 10]],
    steps: '牛里脊逆纹切片，用少许生抽和淀粉抓匀腌 10 分钟，大火快炒 90 秒盛出，再炒芦笋后合锅。'
  },
  {
    id: 'ln_shrimp_tofu', name: '虾仁豆腐煲 + 米饭', meals: ['lunch'],
    items: [['shrimp', 150], ['tofu_firm', 150], ['rice_cooked', 180], ['bok_choy', 150], ['olive_oil', 8]],
    steps: '虾仁先炒变色盛出，豆腐煎至两面金黄后加虾仁和青菜焖 3 分钟。蛋白高、脂肪低的一餐。'
  },
  {
    id: 'ln_chicken_thigh', name: '鸡腿肉杂粮饭配花菜', meals: ['lunch'],
    items: [['chicken_thigh', 150], ['brown_rice', 180], ['cauliflower', 200], ['olive_oil', 8]],
    steps: '鸡腿肉去皮再煎，脂肪能少一大半；花菜切小朵干锅煸至微焦更香。比鸡胸更有满足感。'
  },
  {
    id: 'ln_buckwheat_beef', name: '荞麦面配牛肉青菜', meals: ['lunch'],
    items: [['buckwheat_noodle', 200], ['beef_lean', 100], ['bok_choy', 150], ['olive_oil', 8]],
    steps: '荞麦面煮好过冷水，牛肉炒熟后加青菜和面翻匀调味。面和肉一盘搞定，适合中午没时间。'
  },
  {
    id: 'ln_salad_bowl', name: '鸡胸轻食沙拉碗', meals: ['lunch'],
    items: [['chicken_breast', 120], ['lettuce', 100], ['tomato', 100], ['cucumber', 100], ['corn', 80], ['egg', 50], ['olive_oil', 8]],
    steps: '生菜打底，铺鸡胸丁、番茄、黄瓜、玉米和水煮蛋，油醋汁（橄榄油+米醋+黑胡椒）拌开。外食沙拉酱尽量换成油醋。'
  },
  {
    id: 'ln_salmon_quinoa', name: '三文鱼藜麦碗', meals: ['lunch'],
    items: [['salmon', 120], ['quinoa_cooked', 180], ['broccoli', 150], ['avocado', 40]],
    steps: '三文鱼煎至皮脆，藜麦煮熟铺底，配焯水西兰花和牛油果。热量偏高但饱腹感和营养密度都好。'
  },
  {
    id: 'ln_pork_pepper', name: '猪里脊炒彩椒 + 米饭', meals: ['lunch'],
    items: [['pork_lean', 150], ['bell_pepper', 150], ['rice_cooked', 200], ['olive_oil', 8]],
    steps: '猪里脊切丝上浆，彩椒大火快炒保持脆度。想换口味又不想吃鸡胸的时候用这个。'
  },
  {
    id: 'ln_konjac_chicken', name: '魔芋鸡丝拌面（低卡高饱腹）', meals: ['lunch', 'dinner'],
    items: [['konjac_noodle', 300], ['chicken_breast', 150], ['cucumber', 100], ['sesame_paste', 10], ['soy_sauce', 10], ['olive_oil', 5]],
    steps: '魔芋丝焯水去腥味，鸡胸煮熟撕丝，加黄瓜丝和芝麻酱生抽拌匀。热量很低，适合前一天吃多了需要找补的日子。'
  },
  {
    id: 'ln_tuna_rice', name: '金枪鱼糙米饭碗', meals: ['lunch'],
    items: [['tuna_water', 150], ['brown_rice', 200], ['corn', 60], ['tomato', 100], ['olive_oil', 6]],
    steps: '水浸金枪鱼沥干拌入糙米饭，加玉米和番茄。罐头选水浸不选油浸，能省下近 100 kcal。'
  },

  // ================= 晚餐 =================
  {
    id: 'dn_chicken_sweetpotato', name: '香煎鸡胸 + 西兰花 + 红薯', meals: ['dinner'],
    items: [['chicken_breast', 150], ['broccoli', 200], ['sweet_potato', 150], ['olive_oil', 8]],
    steps: '晚餐把主食换成红薯，升糖更慢、饱腹更久。鸡胸腌好后煎，配焯水西兰花。'
  },
  {
    id: 'dn_cod_spinach', name: '清蒸鳕鱼 + 菠菜 + 糙米饭', meals: ['dinner'],
    items: [['cod', 180], ['spinach', 200], ['brown_rice', 150], ['olive_oil', 8]],
    steps: '鳕鱼几乎不含脂肪，蛋白密度高；菠菜焯水后蒜炒。晚上吃得清淡但不会饿醒。'
  },
  {
    id: 'dn_shrimp_egg', name: '虾仁滑蛋配番茄', meals: ['dinner'],
    items: [['shrimp', 120], ['egg', 100], ['tomato', 150], ['rice_cooked', 100], ['olive_oil', 8]],
    steps: '番茄先炒出汁，倒入蛋液和虾仁快速划散。主食只留小半碗，整体好消化。'
  },
  {
    id: 'dn_tofu_mushroom', name: '豆腐菌菇煲', meals: ['dinner'],
    items: [['tofu_firm', 200], ['mushroom', 150], ['chicken_breast', 100], ['olive_oil', 8]],
    steps: '口蘑煎香后加豆腐和鸡胸块，少水焖 5 分钟。素食日可以把鸡胸去掉换成两个蛋。'
  },
  {
    id: 'dn_beef_soup', name: '牛肉蔬菜汤配红薯', meals: ['dinner'],
    items: [['beef_shank', 120], ['cabbage', 200], ['carrot', 100], ['sweet_potato', 150]],
    steps: '牛腱冷水下锅焯去浮沫，加卷心菜和胡萝卜炖 40 分钟，几乎不用放油。冬天很舒服的一餐。'
  },
  {
    id: 'dn_shrimp_woodear', name: '水煮虾 + 凉拌木耳黄瓜', meals: ['dinner'],
    items: [['shrimp', 150], ['wood_ear', 150], ['cucumber', 150], ['corn', 150], ['olive_oil', 8], ['vinegar', 10]],
    steps: '虾水煮后冰镇更弹；木耳泡发焯水，和黄瓜丝用米醋、生抽、少量橄榄油拌开。'
  },
  {
    id: 'dn_chicken_salad', name: '鸡胸轻食沙拉（晚餐版）', meals: ['dinner'],
    items: [['chicken_breast', 120], ['lettuce', 100], ['tomato', 100], ['cucumber', 100], ['avocado', 40], ['olive_oil', 5]],
    steps: '当天中午吃得比较多的晚上用这组。牛油果控制在 1/4 个以内，不然热量上得很快。'
  },
  {
    id: 'dn_duck_pumpkin', name: '香煎鸭胸配烤南瓜', meals: ['dinner'],
    items: [['duck_breast', 150], ['pumpkin', 200], ['spinach', 150], ['olive_oil', 8]],
    steps: '鸭胸皮朝下小火煎出油、倒掉多余的油再翻面；南瓜切块 200℃ 烤 25 分钟。'
  },
  {
    id: 'dn_fish_tomato', name: '番茄鱼片豆腐汤', meals: ['dinner'],
    items: [['tilapia', 180], ['tomato', 150], ['tofu_silken', 200], ['rice_cooked', 100], ['olive_oil', 6]],
    steps: '番茄炒软加水煮开，下鱼片和嫩豆腐煮 3 分钟。汤鲜且热量低，配小半碗饭。'
  },
  {
    id: 'dn_squid_veg', name: '鱿鱼蔬菜小炒', meals: ['dinner'],
    items: [['squid', 200], ['bell_pepper', 150], ['zucchini', 150], ['rice_cooked', 100], ['olive_oil', 8]],
    steps: '鱿鱼切花刀焯 30 秒，和彩椒西葫芦大火快炒。口感好、蛋白不低，换个口味。'
  },

  // ================= 加餐 =================
  {
    id: 'sn_yogurt_berry', name: '希腊酸奶配蓝莓', meals: ['snack'],
    items: [['greek_yogurt', 150], ['blueberry', 80]],
    steps: '训练后或下午饿了吃，蛋白够、不会像饼干那样越吃越饿。'
  },
  {
    id: 'sn_boiled_egg', name: '水煮蛋两个', meals: ['snack'],
    items: [['egg', 100]],
    steps: '一次煮六个放冰箱，饿了直接拿。最省事的减脂加餐。'
  },
  {
    id: 'sn_apple_almond', name: '苹果配巴旦木', meals: ['snack'],
    items: [['apple', 200], ['almond', 12]],
    steps: '坚果按颗数抓，大约 10 粒就够，别整袋倒出来。'
  },
  {
    id: 'sn_whey_milk', name: '乳清蛋白配脱脂奶', meals: ['snack'],
    items: [['whey', 30], ['milk_skim', 200]],
    steps: '力量训练后 30 分钟内喝，一天蛋白没吃够时用它补齐最方便。'
  },
  {
    id: 'sn_banana_pb', name: '香蕉花生酱', meals: ['snack'],
    items: [['banana', 120], ['peanut_butter', 10]],
    steps: '训练前 1 小时吃，快速供能。花生酱就一小勺，别蘸太多。'
  },
  {
    id: 'sn_soymilk_bread', name: '无糖豆浆 + 全麦面包', meals: ['snack'],
    items: [['soy_milk', 250], ['whole_bread', 35]],
    steps: '下午四五点垫一口，避免晚饭前饿过头导致吃太多。'
  },
  {
    id: 'sn_strawberry_yogurt', name: '草莓希腊酸奶', meals: ['snack'],
    items: [['strawberry', 150], ['greek_yogurt', 100]],
    steps: '想吃甜的时候用这个替代蛋糕，甜度够但热量只有零头。'
  },
  {
    id: 'sn_eggwhite_tomato', name: '蛋清配小番茄', meals: ['snack'],
    items: [['egg_white', 100], ['tomato', 150]],
    steps: '热量极低的一档加餐，适合当天热量已经用超时打底。'
  },
  {
    id: 'sn_coffee_nuts', name: '黑咖啡配坚果', meals: ['snack'],
    items: [['black_coffee', 200], ['almond', 15]],
    steps: '下午提神，黑咖啡不加糖不加奶。咖啡因敏感的人 15 点后就别喝了。'
  }
];

export const MEAL_LABEL = {
  breakfast: '早餐',
  lunch: '午餐',
  snack: '加餐',
  dinner: '晚餐'
};

/** 四餐的热量分配比例，合计 1。 */
export const MEAL_SPLIT = {
  breakfast: 0.25,
  lunch: 0.35,
  snack: 0.10,
  dinner: 0.30
};

export const MEAL_ORDER = ['breakfast', 'lunch', 'snack', 'dinner'];
