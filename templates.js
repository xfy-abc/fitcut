/**
 * 训练计划模板
 * 每个计划包含若干训练日，用户按星期几循环执行。
 * 减脂期的安排逻辑：以复合动作打底保住肌肉，每次力量训练控制在 45~60 分钟，
 * 力量后接 15~25 分钟有氧，而不是把时间全花在有氧上。
 */
export const PLANS = {
  fullbody3: {
    name: '全身三练',
    subtitle: '每周 3 次，每次 45~60 分钟，最适合减脂新手',
    days: [
      {
        id: 'fb_a', name: '全身 A · 推为主',
        items: [
          ['squat', '4 组', '8~10 次'],
          ['bench_press', '4 组', '8~10 次'],
          ['barbell_row', '4 组', '10 次'],
          ['lateral_raise', '3 组', '12~15 次'],
          ['plank', '3 组', '45 秒'],
          ['incline_walk', '1 组', '15 分钟']
        ]
      },
      {
        id: 'fb_b', name: '全身 B · 拉为主',
        items: [
          ['romanian_dl', '4 组', '8~10 次'],
          ['incline_db_press', '3 组', '10~12 次'],
          ['lat_pulldown', '4 组', '10~12 次'],
          ['db_curl', '3 组', '12 次'],
          ['tricep_pushdown', '3 组', '12 次'],
          ['crunch', '3 组', '15 次']
        ]
      },
      {
        id: 'fb_c', name: '全身 C · 腿臀为主',
        items: [
          ['leg_press', '4 组', '10~12 次'],
          ['machine_press', '3 组', '10~12 次'],
          ['db_row', '4 组', '10 次 / 侧'],
          ['hip_thrust', '3 组', '12 次'],
          ['lateral_raise', '3 组', '15 次'],
          ['jump_rope', '1 组', '10 分钟']
        ]
      }
    ]
  },

  upperlower4: {
    name: '上下肢四练',
    subtitle: '每周 4 次，每个部位练得更充分，适合有训练基础的人',
    days: [
      {
        id: 'ul_ua', name: '上肢 A',
        items: [
          ['bench_press', '4 组', '6~8 次'],
          ['barbell_row', '4 组', '8~10 次'],
          ['db_shoulder_press', '3 组', '8~10 次'],
          ['lat_pulldown', '3 组', '10~12 次'],
          ['barbell_curl', '3 组', '12 次'],
          ['tricep_pushdown', '3 组', '12 次']
        ]
      },
      {
        id: 'ul_la', name: '下肢 A',
        items: [
          ['squat', '4 组', '6~8 次'],
          ['romanian_dl', '3 组', '8~10 次'],
          ['leg_press', '3 组', '10~12 次'],
          ['calf_raise', '4 组', '15 次'],
          ['plank', '3 组', '45 秒'],
          ['incline_walk', '1 组', '20 分钟']
        ]
      },
      {
        id: 'ul_ub', name: '上肢 B',
        items: [
          ['incline_db_press', '3 组', '8~10 次'],
          ['pull_up', '4 组', '力竭前 1~2 次'],
          ['seated_row', '3 组', '10~12 次'],
          ['lateral_raise', '4 组', '12~15 次'],
          ['face_pull', '3 组', '15 次'],
          ['hammer_curl', '3 组', '12 次']
        ]
      },
      {
        id: 'ul_lb', name: '下肢 B',
        items: [
          ['bulgarian_split', '3 组', '10 次 / 腿'],
          ['hip_thrust', '3 组', '10~12 次'],
          ['leg_curl', '3 组', '12 次'],
          ['calf_raise', '4 组', '15 次'],
          ['hanging_leg_raise', '3 组', '12 次'],
          ['incline_walk', '1 组', '20 分钟']
        ]
      }
    ]
  },

  home3: {
    name: '居家自重三练',
    subtitle: '不去健身房也能做，只需要一张瑜伽垫',
    days: [
      {
        id: 'hm_a', name: '居家 A · 上肢',
        items: [
          ['push_up', '4 组', '力竭前 2 次'],
          ['dips', '3 组', '力竭前 2 次'],
          ['glute_bridge', '3 组', '15 次'],
          ['plank', '3 组', '45 秒'],
          ['mountain_climber', '3 组', '40 秒'],
          ['hiit', '1 组', '10 分钟']
        ]
      },
      {
        id: 'hm_b', name: '居家 B · 下肢',
        items: [
          ['goblet_squat', '4 组', '15 次'],
          ['lunge', '3 组', '12 次 / 腿'],
          ['glute_bridge', '3 组', '20 次'],
          ['calf_raise', '4 组', '20 次'],
          ['side_plank', '3 组', '30 秒 / 侧'],
          ['jump_rope', '1 组', '12 分钟']
        ]
      },
      {
        id: 'hm_c', name: '居家 C · 核心体能',
        items: [
          ['crunch', '3 组', '20 次'],
          ['russian_twist', '3 组', '20 次'],
          ['hanging_leg_raise', '3 组', '12 次'],
          ['plank', '3 组', '60 秒'],
          ['mountain_climber', '3 组', '40 秒'],
          ['hiit', '1 组', '12 分钟']
        ]
      }
    ]
  }
};

/** 默认的每周训练日安排（周一为一周第一天，0=周日）。 */
export const DEFAULT_WEEKDAYS = {
  fullbody3: [1, 3, 5],
  upperlower4: [1, 2, 4, 5],
  home3: [1, 3, 5]
};
