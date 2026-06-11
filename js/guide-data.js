/* ════════════════════════════════════════════════════════════════════
   guide-data.js — 攻 略 数 据 区（GUIDE_DATA）
   版本更新只需要改这一个文件，页面所有攻略内容均由此渲染。

   字段速查：
   meta            赛季号、数据日期、变更日志、数据来源
   general         总览页：运营通识（天数节奏 / 商人 / 经济 / 打野）
   tiers           职业梯队（数组，从高到低）
   heroes[].builds 每职业的 S15 主流流派；可加 featured:true 高亮推荐；
                   cards[].en 必须与 data/*.json 中的英文名完全一致，
                   渲染层会自动带出卡面图与真实效果文本；
                   查不到的卡（如 Karnok DLC）自动降级为文字芯片。
                   cards[].role 取值：core=核心 engine=引擎 filler=过渡
                                tech=反制/工具 skill=技能
                   builds[].sources 为该流派的出处链接（可选）。
   heroes[].phases 前/中/后期；每期含 goals(路线目标) picks(抓牌顺序)
                   shops(进店顺序) tips(注意点)；picks 条目用 en 引用真卡，
                   或用 label 写自由文本（如「核心高品复制件」）。
   heroes[].bounds 该职业整体的上限 / 下限
   ════════════════════════════════════════════════════════════════════ */
window.GUIDE_DATA = {
  meta: {
    season: "S15",
    dataDate: "2026-06-11",
    siteVersion: "2.1.0",
    confidence: "攻略文本基于 S15（Patch 15.x，2026-06）公开资料与 10 胜实战构筑；流派来源遵循时效规则：只采用 S14/S15（Patch 14.x–15.x）来源，更早赛季的记录仅在机制经当前卡面数据验证后作为补充并标注赛季。卡面数据快照拉取于 2026-06-10（howbazaar API），该源尚未完全同步 S15 全部改动（如 Rifle / Railgun / Spice Rack / Athanor / Library），冲突处一律以游戏内为准",
    dataNote: "卡面快照统计：物品 926 / 技能 386。已知缺口：Karnok DLC 物品与技能未被数据源收录（仅 Jerky 一件）；Private Jet 等极新物品由 data/supplement.json 按社区来源补录并标注。",
    sources: [
      { name: "Mobalytics · S15 Meta Builds", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" },
      { name: "Mobalytics · Kripparrian 构筑页", url: "https://mobalytics.gg/the-bazaar/kripparrian" },
      { name: "bazaar-builds.net · 每日 10 胜构筑库", url: "https://bazaar-builds.net/" },
      { name: "HowBazaar · 全卡数据库（本站卡面数据源）", url: "https://www.howbazaar.gg" },
      { name: "BazaarDB · 全卡数据库/生成式补丁说明", url: "https://bazaardb.gg" },
      { name: "B 站国服社区攻略检索", url: "https://search.bilibili.com/all?keyword=大巴扎攻略" }
    ],
    changelog: [
      { date: "2026-06-11", text: "v2.1.0 内容勘误（玩家反馈）：① 海盗高手弹药改为互踩体系——Repeater（连发步枪）×Throwing Knives（飞刀）100% 暴击互踩 + Blunderbuss（雷铳）×Incendiary Rounds 自点火（Mobalytics Knife Repeater / Kripp Infinite Blunderbuss 构筑证实）；② 新增海盗 Slumbering Primordial（克苏鲁）流派，移除来历不明的『暴击毒武器线』；③ 机宝新增国服『全能核弱点流』（The Core + Weakpoint Detector + Cool LEDs 三段泵）；④ 按 15.0 补丁修正：Athanor 不再产催化剂、Library 移除武器冷却惩罚、Holsters 回归开场触发；⑤ 确立来源时效规则：流派只采用 S14/S15 来源。" },
      { date: "2026-06-10", text: "v2.0.0 重构：① 接入 items/skills 全量数据，卡片带图与真实效果文本，新增「卡牌图鉴」页；② 瓦妮莎补全高手弹药快攻（Gunslinger，Kripp 06-07 构筑+多份 10 胜记录）；③ 修正旗舰机制（按物品种类叠 Multicast，非武器加伤）、Chicken Cannon（护盾转化而非一炮流）、Athanor 品阶、Rifle 改动定性等错误；④ Karnok 按 DLC 真实 meta 重写（Runic Claymore / 弹药自减速 / Dual Reaver+Waystones）；⑤ 全站流派标注来源。" },
      { date: "2026-06-10", text: "v1.0.0 建站：S15 赛季初 7 职业全量攻略上线" }
    ]
  },

  general: {
    intro: "大巴扎一局的本质是「用有限的时间和金币，把随机货架拼成一台能打 10 胜的机器」。每一天你在地图上选择遭遇（商人 / 奇遇 / 野怪），日终与其他玩家的镜像盘面结算 PVP；累计 10 胜毕业，血量归零出局。所以所有职业的运营都绕不开三个问题：这一天进哪些店、店里抓什么、这一阶段我要打成什么样。",
    blocks: [
      { title: "天数节奏（通用三段论）", items: [
        "前期 Day 1–4｜青铜·拼节奏：货架以青铜物品为主，目标不是定流派，而是『今天的盘面能打赢今天的对手』。能赢就赢，赢不了优先保血。",
        "中期 Day 5–9｜黄金·定主轴：白银/黄金商人陆续出现，核心件开始可见。这一段必须做出流派抉择——继续杂凑必输后期。",
        "后期 Day 10+｜钻石·拉上限：钻石及以上货架解锁，工作是把核心升品、上附魔、补反制件（冻结 / 减速 / 摧毁对策），向 10 胜冲刺。"
      ]},
      { title: "商人与进店通识", items: [
        "商人按品阶分级：青铜商人 Day 1 即可出现、刷新便宜但商品最杂；白银 / 黄金 / 钻石商人随天数解锁，越高级越贵、商品越精。",
        "进店优先级的底层逻辑：本系专卖店（武器 / 水族 / 科技 / 药剂 / 食物 / 兽群）> 综合商人 > 技能商人 > 附魔类奇遇。找特定核心去专卖店，捡漏去综合店。",
        "刷新（Reroll）是把双刃剑：前期刷新约等于半件装备，没有明确目标不要乱刷；中期为定轴可以连刷，后期为关键附魔 / 升品值得重金刷。",
        "技能商人和精英怪是技能两大来源：版本强力技能（弹药系 / 暴击系 / 灼烧系）优先级常常高于一件普通装备。"
      ]},
      { title: "经济与等级", items: [
        "金币每天有基础收入，部分物品 / 奇遇提供额外收入或增值（Value）。场外刷钱在历次调整中被大砍后未回调，纯经济流收益偏低——经济件点到为止，盘面强度优先。",
        "经验升级给属性与技能选择。升级节奏跟着野怪和奇遇走：野怪 = 金币 + 经验 + 战利品三合一，是性价比最高的遭遇；The Docks 等送经验的奇遇能换来等级差。",
        "卖货时机：过渡件在『有更好的替代品上场的那一刻』卖掉；带任务 / 增值的物品看清触发条件再卖。"
      ]},
      { title: "打野（PVE）通识", items: [
        "野怪强度有梯度：开打前看清怪物盘面（武器伤害型 / 灼烧毒型 / 护盾拖延型），用自己当前盘面克制的类型去换战利品。",
        "精英怪掉落关键技能与高品物品，是中期质变的主要来源——但翻车 = 白送血量，没把握宁可打小怪。",
        "每个赛季野怪池都会调整，开赛季先看一眼当期野怪表再规划路线，不要凭上赛季的记忆莽精英。"
      ]}
    ]
  },

  tiers: [
    { tier: "T0", heroes: ["mak", "karnok"], note: "上限统治：马克三轴（焚诀/罂粟毒/关刀毒爆）天花板依旧；卡诺克 DLC 巨剑与急速暴击在 Day 13 前节奏统治力极强" },
    { tier: "T1", heroes: ["vanessa", "dooley"], note: "海盗 S15 双快车道：弹药快攻上限自成一档 + 旗舰白银定轴；机宝公式化运营下限全游戏最高" },
    { tier: "T1.5", heroes: ["pygmalien", "stelle"], note: "猪猪温泉锁场依旧恶心但怕秒杀；黑妹拼图流派多但缺件强度断崖" },
    { tier: "T2", heroes: ["jules"], note: "厨师灶台/冷柜摆位 RNG 偏重，S15 香料架重做后灼烧线回暖，稳定性仍垫底" }
  ],

  heroes: [
  /* ───────────────────────── 1. VANESSA 瓦妮莎（海盗） ───────────────────────── */
  {
    id: "vanessa", en: "Vanessa", cn: "瓦妮莎", nick: "海盗", hue: "#4FB7A8",
    tagline: "弹药互踩 · 旗舰杂货 · 水族伙伴 · 克苏鲁",
    tier: "T1", difficulty: 2,
    s15: "本季海盗的高手答案是<b>弹药互踩体系</b>：Repeater（连发步枪）『每使用一个其他弹药物品就自动开火』× Throwing Knives（飞刀）『其他物品暴击时自动出手』——步枪堆到 <b>100% 暴击</b>后两者左右互踩无限往返；后期再上 Blunderbuss（雷铳）『你每次灼烧时自动开火』配 Incendiary Rounds 自己点自己的火。<b>Holsters 在 15.0 回归开场触发形态</b>，起手提速一截。<b>Flagship（旗舰）</b>S15 加强、白银 Day 2 可定轴（机制：每多一种「工具/地产/伙伴/弹药/遗物」+1 Multicast，吃货架多样性而非堆武器）。注意：Rifle 改 2 秒冷却但成长减半，老的 Day 1 Rifle+Ramrod 开局已被砍弱。",
    builds: [
      {
        name: "Gunslinger 弹药互踩（高手弹药）", tier: "T0.5", onset: "Day 3–6 搭循环，暴击到位即起飞", featured: true,
        desc: "三层互踩的爆发体系：① <b>连发步枪 × 飞刀</b>——把 Repeater 堆到 100% 暴击后，步枪暴击触发飞刀、飞刀出手又算「使用弹药物品」反过来触发步枪，左右互踩无限往返；② 后期 <b>雷铳 × 燃烧弹药</b>自点火——雷铳开火带动相邻燃烧弹药灼烧，灼烧又触发雷铳『灼烧时自动开火』，自己点自己；③ 手枪剑给每一次弹药触发追加一刀。配 Gunner / Loaded Fury / Parting Shot 弹药技能包，循环闭合后几秒内雪崩。",
        cards: [
          { en: "Repeater", cn: "连发步枪：每用一个其他弹药物品就跟进开火，互踩循环的心脏", role: "core" },
          { en: "Throwing Knives", cn: "飞刀：其他物品暴击时自动出手，与步枪互为扳机", role: "core" },
          { en: "Pistol Sword", cn: "手枪剑：每次弹药触发追加一刀，循环的伤害放大器", role: "core" },
          { en: "Crow's Nest", cn: "鸦巢：全武器大额暴击率，把步枪推上 100% 暴击的关键地基", role: "engine" },
          { en: "Holsters", cn: "枪套：开场加速小件（金色起飞刀 1.5 秒进循环），15.0 回归开场形态", role: "engine" },
          { en: "Blunderbuss", cn: "雷铳：你每次灼烧时自动开火（钻石起），后期接管循环的上限件", role: "core" },
          { en: "Incendiary Rounds", cn: "燃烧弹药：相邻物品使用时灼烧，雷铳自循环的点火器", role: "engine" },
          { en: "Scimitar of the Deep", cn: "深海弯刀：暴击转 20% 伤害的中毒，循环成型后的对肉队出口", role: "engine" },
          { en: "Gunner", cn: "技能·炮手：全物品+弹药上限，循环的续航底座", role: "skill" },
          { en: "Loaded Fury", cn: "技能·装填之怒：武器按场上弹药总数加伤，本体即斩杀线", role: "skill" },
          { en: "Parting Shot", cn: "技能·临别一击：弹药物品使用后叠暴击率，凑 100% 的最后一块", role: "skill" },
          { en: "Sharpshooter", cn: "技能·神射手：弹药物品+暴击率，青铜即可拿的地基", role: "skill" }
        ],
        ceiling: "循环闭合即雪崩：步枪×飞刀逐帧往返输出、雷铳点火后停不下来——上限自成一档（Kripp 原话 in a class of its own）。",
        floor: "100% 暴击是硬门槛，差一截循环就断断续续；凑不齐时退回手枪剑+枪套的普通弹药快攻，强度仍在线但只是快攻不是无限。",
        sources: [
          { name: "Kripp · Gunslinger Aggro Vanessa（S15，06-07 更新）", url: "https://mobalytics.gg/the-bazaar/builds/gunslinger-aggro-vanessa" },
          { name: "Mobalytics · Knife Repeater Vanessa（步枪×飞刀互踩）", url: "https://mobalytics.gg/the-bazaar/builds/knife-repeater-vanessa" },
          { name: "Kripp · Infinite Blunderbuss Vanessa（雷铳自点火）", url: "https://mobalytics.gg/the-bazaar/builds/infinite-blunderbuss-vanessa" }
        ]
      },
      {
        name: "Flagship 旗舰杂货", tier: "T1", onset: "Day 2–4 起手，Day 6 前成型",
        desc: "S15 加强后的旗舰是节奏最快的定轴件：白银品阶 Day 2 就能买到。机制是每多一种「其他工具/地产/伙伴/弹药/遗物」物品 +1 Multicast——所以旗舰队的正确画风是『一艘旗舰 + 一货架杂货』，每个类型补一件，off-hero 的强力工具/地产照单全收，而不是无脑堆武器。",
        cards: [
          { en: "Flagship", cn: "旗舰：每多一种其他类型物品 +1 Multicast，杂货舰队的旗", role: "core" },
          { en: "Ramrod", cn: "推弹杆：给相邻弹药件装弹并叠暴击，补『弹药』类型位", role: "engine" },
          { en: "Powder Keg", cn: "火药桶：武器类高额输出，旗舰队的第二输出位", role: "engine" },
          { en: "Crow's Nest", cn: "鸦巢：地产位+全武器大额暴击率，单武器时还送吸血", role: "engine" },
          { en: "Ambergris", cn: "龙涎香：遗物位+回复，买水族还会增值", role: "filler" },
          { en: "Tripwire", cn: "绊雷：工具位+减速反制，类型凑数和功能两不误", role: "tech" }
        ],
        ceiling: "类型拉满后旗舰一轮 5–6 连发，配暴击附魔可以正面轰碎大多数中速队。",
        floor: "旗舰被冻结点名时输出腰斩；类型凑不齐时只是门普通炮。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Vanessa：Flagship）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      },
      {
        name: "Tortuga 水族伙伴", tier: "T1", onset: "Day 4–7 拼图，Day 9 前成型",
        desc: "围绕 Tortuga 的伙伴体系：使用其他伙伴为它充能，它再加速全队形成雪球。可以从水族线或武器线自然转入，是三条线里容错最高的。",
        cards: [
          { en: "Tortuga", cn: "托尔图加（海龟舰）：450/900 单发重炮，用其他伙伴充能、出手加速全队", role: "core" },
          { en: "Piranha", cn: "食人鱼：自带 20% 暴击且暴击双倍，便宜的伙伴触发器", role: "engine" },
          { en: "Sharkray", cn: "鲨鳐：被加速就永久成长，与 Tortuga 的加速完美闭环", role: "engine" },
          { en: "Zoarcid", cn: "绵鳚：出手加速相邻物品，灼烧时还会自充能", role: "engine" },
          { en: "Narwhal", cn: "独角鲸：3 秒一发的高频小水族，链条填充", role: "filler" },
          { en: "Vampire Squid", cn: "吸血鬼乌贼：吸血+伤害随暴击率成长，雪球期保命", role: "filler" }
        ],
        ceiling: "成型后加速与数值同时起飞，镜像消耗局几乎无解。",
        floor: "Tortuga 一直不来时只是杂鱼缸，Day 8 前拼不齐要果断转旗舰或弹药。",
        sources: [
          { name: "Kripp · Tortuga Vanessa（05-02 更新）", url: "https://mobalytics.gg/the-bazaar/vanessa-builds" }
        ]
      },
      {
        name: "Slumbering Primordial 克苏鲁", tier: "T1.5", onset: "Day 6+ 摸到巨兽定轴，前期小水族铺场",
        desc: "国服俗称克苏鲁：沉睡的太古巨兽自带 4 连发，你每次施毒 / 冻结 / 灼烧都给它充能 1–2 秒并永久 +20/25 伤害。最佳喂食机是 Elemental Depth Charge——一发同时毒 4 + 烧 4 + 冻结，且每个其他水族给它 +1 连发；小水族异常件铺满后巨兽几乎不停转，可以自我循环到一轮带走对面。",
        cards: [
          { en: "Slumbering Primordial", cn: "沉睡的太古巨兽（克苏鲁）：毒/冻/烧都给它充能+永久成长，4 连发终结者", role: "core" },
          { en: "Elemental Depth Charge", cn: "元素深水炸弹：毒+烧+冻三联触发，水族越多连发越多", role: "core" },
          { en: "Weather Glass", cn: "晴雨表：毒烧双触发，按你异常件数量叠连发", role: "engine" },
          { en: "Clamera", cn: "蛤蜊相机：开战自动使用的减速起手件", role: "engine" },
          { en: "Yeti Crab", cn: "雪人蟹：冻结+给相邻毒件喂毒", role: "filler" },
          { en: "Zoarcid", cn: "绵鳚：灼烧时自充能、加速相邻的水族润滑剂", role: "filler" }
        ],
        ceiling: "异常触发频率堆起来后巨兽近乎无限连转，一轮 4 连发带走一个站场队。",
        floor: "黄金大件 Day 6 后才可见，没摸到巨兽时只是软水族盘；实战记录多为 12.x–13.x（15.0 补丁未改动该卡，S15 热度待验证）。",
        sources: [
          { name: "Kripp · Slumbering Primordial Vanessa（02-15 更新）", url: "https://mobalytics.gg/the-bazaar/builds/slumbering-primordial-vanessa-kripp" },
          { name: "bazaar-builds · Slumbering Primordial 10-5（chongdae，01-16）", url: "https://bazaar-builds.net/slumbering-primordial-vanessa-10-5-build-chongdae/" }
        ]
      }
    ],
    phases: [
      { key: "e", name: "前期", days: "Day 1–4",
        goals: ["用快速武器抢节奏：目标 Day 4 前 2–3 胜，血量不低于 70%", "Day 2 起每天看白银货架：见 Flagship 或弹药核心可直接定轴", "技能商人见 Sharpshooter / Gunner 等弹药技能提前锁，它们决定中期走哪条线"],
        picks: [
          { en: "Sharkclaws", cn: "出手给全场武器永久加伤，经典开局引擎", role: "engine" },
          { en: "Switchblade", cn: "弹簧刀：4 秒小刀，喂肥相邻武器", role: "filler" },
          { en: "Revolver", cn: "3 秒 6 发，前期是武器后期是弹药链种子", role: "engine" },
          { en: "Flagship", cn: "白银见到 = 本局主轴候选，最高优先", role: "core" },
          { en: "Piranha", cn: "便宜水族占位，Tortuga 路线的种子", role: "filler" }
        ],
        shops: [
          { s: "武器商人", why: "海盗前期强度全在武器质量，第一优先" },
          { s: "综合商人（青铜）", why: "捡漏低费节奏件与水族种子" },
          { s: "野怪 / The Docks 奇遇", why: "金币+经验+战利品；The Docks 的经验能换等级差" },
          { s: "技能商人", why: "弹药/暴击系版本技能可提前锁" }
        ],
        tips: ["S15 Rifle 改成 2 秒冷却但成长减半——老攻略里的 Day 1 Rifle+Ramrod 开局已不是最优，快速武器更稳", "输 1–2 场不致命，连续掉大血才需要立刻补强度"] },
      { key: "m", name: "中期", days: "Day 5–9",
        goals: ["四选一定型：弹药互踩 / 旗舰杂货 / Tortuga 水族 / 克苏鲁", "互踩线检查表：Repeater + Throwing Knives 成对到手、暴击源（鸦巢/技能）开始堆，就可以全押", "Day 9 前 5–6 胜，核心件上第一个附魔（互踩线优先 Deadly 暴击向）"],
        picks: [
          { en: "Repeater", cn: "连发步枪：互踩线胜负手，白银起重点搜寻", role: "core" },
          { en: "Throwing Knives", cn: "飞刀：与步枪成对收，单独一把也是优质暴击跟射", role: "core" },
          { en: "Crow's Nest", cn: "鸦巢：互踩线的暴击地基，越早立起来越好", role: "engine" },
          { en: "Pistol Sword", cn: "手枪剑：弹药触发的伤害放大器", role: "core" },
          { en: "Slumbering Primordial", cn: "克苏鲁：黄金大件，见到且有水族底子即可定轴", role: "core" },
          { en: "Tortuga", cn: "水族线核心，见到即可定轴", role: "core" }
        ],
        shops: [
          { s: "技能商人（弹药/暴击）", why: "弹药线一半的强度在技能上，值得连刷" },
          { s: "本系专卖店（武器/水族）", why: "定向找核心拼图" },
          { s: "附魔奇遇", why: "核心武器第一个附魔=半个流派强度" },
          { s: "精英怪", why: "搏 Loaded Fury / Parting Shot 等关键技能" }
        ],
        tips: ["Day 8 仍没拼出弹药/水族核心 → 旗舰杂货是永远的保底答案，沉没成本最害人"] },
      { key: "l", name: "后期", days: "Day 10+",
        goals: ["核心升品到钻石、补第二/第三附魔", "暴击率拉到 100%：鸦巢 + Sharpshooter / Parting Shot——这是步枪×飞刀无限互踩的阈值", "补反制：Tripwire 减速、抗冻结附魔（Radiant），防止步枪/旗舰被点名"],
        picks: [
          { label: "核心高品复制件", cn: "同名核心高品阶替换，优先级最高", role: "core" },
          { en: "Blunderbuss", cn: "雷铳：钻石货架的循环上限件，配燃烧弹药自点火", role: "core" },
          { en: "Crow's Nest", cn: "鸦巢：100% 暴击阈值的最后一块", role: "engine" },
          { en: "Tripwire", cn: "对快攻/循环队的标准答案", role: "tech" }
        ],
        shops: [
          { s: "钻石商人", why: "高品核心与传说件唯一来源" },
          { s: "附魔奇遇", why: "后期一个对位附魔常常等于一场胜利" },
          { s: "高阶精英", why: "技能成型的最后一块拼图" }
        ],
        tips: ["弹药队后期最怕冻结点名手枪剑——给核心留 Radiant（减冻结/减速）或备好第二出口"] }
    ],
    bounds: {
      up: "上限：弹药互踩闭环后的爆发自成一档，旗舰/水族/克苏鲁三条备线也都能稳进 10 胜——S15 海盗的上限是 T0 级的。",
      down: "下限：新手最友好的职业之一，杂凑武器也有 6–8 胜底子；真正的败因通常是中期不肯定轴，四头下注全是半成品。"
    }
  },

  /* ───────────────────────── 2. PYGMALIEN 猪猪 ───────────────────────── */
  {
    id: "pygmalien", en: "Pygmalien", cn: "皮格马利安", nick: "猪猪", hue: "#E58FB1",
    tagline: "前期打架 · 温泉锁场 · 价值引擎",
    tier: "T1.5", difficulty: 3,
    s15: "<b>Private Hot Springs（私人温泉）</b>仍是本季猪猪的明星件：周期灼烧+再生，且首次跌破半血时把<b>双方</b>其余物品全部冻结 3 秒，再靠『冻结时自充能』滚起来，打不出斩杀的队伍会被它活活耗死；<b>Square 打架猪（Crook 体系）</b>继续统治前期；<b>Private Jet（私人飞机）</b>是 Patch 15.0 的新起飞件——按 Value 给相邻物品全方位加成（本站数据快照未收录，已按社区数据补录）。外围利好：Premium Piggles 回到 4 秒冷却、Abacus 回白银，价值流的地基更便宜了。",
    builds: [
      {
        name: "Square 打架猪（Crook 体系）", tier: "T1", onset: "Day 1 起手，全程在线",
        desc: "Crook 按你的中型物品数量给中型武器加伤，前期数值碾压，滚起胜场雪球后接 Lion Cane / Regal Blade / Cash Cannon 等重锤收尾。Mobalytics S15 点名的经典 beatdown 路线，吃 off-hero 好武器。",
        cards: [
          { en: "Crook", cn: "牧羊杖：中型武器按中型物品数加伤，打架猪的发动机", role: "core" },
          { en: "Lion Cane", cn: "狮头杖：按最大生命 10–20% 出伤，升级还送 100/200 血", role: "engine" },
          { en: "Regal Blade", cn: "君王之刃：高频 50 伤直拳，中期接力棒", role: "engine" },
          { en: "Cash Cannon", cn: "钞票炮：每次进账按双倍金额永久成长", role: "engine" },
          { en: "Belt", cn: "腰带：+50–100% 最大生命，猪猪的防御万金油", role: "tech" },
          { en: "Atlatl", cn: "投矛器：伤害越高冷却越短，越喂越快的后期件", role: "filler" }
        ],
        ceiling: "前期连胜攒下的经济与血量优势一路滚到 10 胜。",
        floor: "中期重锤接不上时输出脱节，被后期成长怪反超。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Pygmalien：Square）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      },
      {
        name: "Private Hot Springs 温泉锁场", tier: "T1", onset: "Day 5–8 见温泉定轴",
        desc: "温泉周期灼烧+给自己叠再生；首次跌破半血时冻结双方其余所有物品 3 秒，而你每次冻结又会给温泉充能——半血反打的节奏一旦滚起来，打不出一波秒杀的阵容对它几乎无解。",
        cards: [
          { en: "Private Hot Springs", cn: "私人温泉：灼烧+再生+半血全场冻结+冻结自充能，四合一锁场核心", role: "core" },
          { en: "Icicle", cn: "冰锥：开场冻结 3–6 秒，触发温泉充能与冻结技能", role: "engine" },
          { en: "Booby Trap", cn: "诡雷：周期冻结，用地产充能——和温泉天生一对", role: "engine" },
          { en: "Gramophone", cn: "留声机：左侧物品冷却 -20/35%，给温泉提速", role: "engine" },
          { en: "Invigorating Cold", cn: "技能·提神寒气：每场首次冻结时加速自己物品", role: "skill" },
          { en: "Frozen Shot", cn: "技能·冰冻射击：敌方有冻结物品时你的武器提速", role: "skill" }
        ],
        ceiling: "冻结链拉满后对面全程站桩，再生耗死一切非秒杀队。",
        floor: "怕一炮流（太空激光/毒爆）：锁不住的瞬间爆发直接掀桌。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Pygmalien：Private Hot Springs）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      },
      {
        name: "Private Jet 价值引擎", tier: "T1.5", onset: "Day 6–9 拼图",
        desc: "Patch 15.0 起飞的新流派：私人飞机让自己和相邻物品起飞，相邻物品获得等同其 Value 的攻/盾/疗加成，使用飞行物品还会反过来给相邻物品加 Value——配 Yo-Yo、Uwashiwali Bird 等高频小件越转越快，Billboard 的巨额 Value 是终点站。",
        cards: [
          { en: "Private Jet", cn: "私人飞机：Value→攻防转化引擎（数据快照未收录，社区数据补录）", role: "core" },
          { en: "Yo-Yo", cn: "悠悠球：相邻物品出手就充能，飞机最佳乘客", role: "engine" },
          { en: "Uwashiwali Bird", cn: "乌瓦希瓦利鸟：每个地产+1 Multicast 的治疗鸟", role: "engine" },
          { en: "Billboard", cn: "广告牌：Value 越高转得越快的巨盾，价值流终点", role: "engine" },
          { en: "Premium Piggles", cn: "高级皮皮：相邻+Value，S15 回 4 秒冷却", role: "filler" },
          { en: "Abacus", cn: "算盘：相邻按它的 Value 增值，回白银后更早成型", role: "filler" }
        ],
        ceiling: "Value 滚雪球后相邻件攻防数值全面失控，节奏怪杀手。",
        floor: "标准拼图流派：缺飞机或缺高 Value 邻居都只是散件，强度断崖。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Pygmalien：Private Jet）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" },
          { name: "bazaar-builds · Private Jet Pygmalien 10-2（Telescopio）", url: "https://bazaar-builds.net/private-jet-pygmalien-10-2-build-telescopio/" }
        ]
      }
    ],
    phases: [
      { key: "e", name: "前期", days: "Day 1–4",
        goals: ["Crook 起手抢连胜：Day 4 目标 3 胜，这是猪猪全游戏最强的窗口期", "Belt 早拿堆血，把生命值变成容错", "经济件点到为止（1–2 件），盘面强度永远优先"],
        picks: [
          { en: "Crook", cn: "见到必拿，前期版本答案", role: "core" },
          { en: "Belt", cn: "最大生命=猪猪的护城河", role: "tech" },
          { en: "Dog", cn: "狗：百伤一口的青铜武器替补", role: "filler" },
          { en: "Premium Piggles", cn: "便宜增值小件，给中期价值线留口子", role: "filler" }
        ],
        shops: [
          { s: "武器商人", why: "Crook 与替补武器来源" },
          { s: "综合商人（青铜）", why: "Belt / 杂项防御件" },
          { s: "野怪", why: "猪猪前期盘面硬，多吃野滚经济" },
          { s: "经济类奇遇", why: "顺路才进，别绕路" }
        ],
        tips: ["场外增值刷钱被砍后未回调：谁还按老攻略蹲着刷钱谁吃亏", "前期每一场赢下来的血量都是后期温泉/重锤的本钱"] },
      { key: "m", name: "中期", days: "Day 5–9",
        goals: ["关键抉择：见 Private Hot Springs 立刻转锁场；见 Private Jet+乘客可走价值线；否则沿打架线找重锤", "Gramophone / Yo-Yo 上引擎，把成型时间往前赶", "Day 9 前 5–6 胜或保住 60%+ 血量"],
        picks: [
          { en: "Private Hot Springs", cn: "黄金货架最高优先，本局走向分水岭", role: "core" },
          { en: "Private Jet", cn: "S15 新核心，见到且有乘客就可定轴", role: "core" },
          { en: "Lion Cane", cn: "打架线的中期接力棒", role: "engine" },
          { en: "Gramophone", cn: "几条线都吃的通用加速", role: "engine" },
          { en: "Icicle", cn: "温泉线的控制配件", role: "engine" }
        ],
        shops: [
          { s: "综合/地产类专卖店", why: "温泉、留声机等非武器核心的主要来源" },
          { s: "武器商人", why: "打架线补重锤" },
          { s: "附魔奇遇", why: "温泉上 Icy、重锤上 Heavy 都是质变" },
          { s: "精英怪", why: "搏 Frozen Shot / Invigorating Cold 等控制技能" }
        ],
        tips: ["温泉和重锤两头都想要 = 两头都不硬，Day 7 前必须二选一"] },
      { key: "l", name: "后期", days: "Day 10+",
        goals: ["锁场线：冻结覆盖率拉满 + 再生叠厚，专心耗死对手", "打架线：Cash Cannon / Lion Cane 升品，追求两轮内击倒", "识别天敌：遇一炮流要补打断/护盾，遇消耗队比谁更肉"],
        picks: [
          { label: "核心高品复制件", cn: "温泉/重锤/飞机的高品复制件最优先", role: "core" },
          { en: "Booby Trap", cn: "高品诡雷：对快攻的标准反制", role: "tech" },
          { label: "再生/护盾件", cn: "镜像消耗局的胜负手", role: "tech" }
        ],
        shops: [
          { s: "钻石商人", why: "高品温泉与传说重锤" },
          { s: "附魔奇遇", why: "后期附魔=最后的强度阀门" },
          { s: "高阶精英", why: "补齐控制/再生技能" }
        ],
        tips: ["猪猪后期打的是『对面打不死我』——每天问自己这句话还成不成立"] }
    ],
    bounds: {
      up: "上限：温泉锁场成型后近乎不讲理，非秒杀队全被耗死；打架线则靠前期雪球碾到终点；价值线新轴上限还在开发中。",
      down: "下限：『刷钱躺赢』早已不复存在；前期连败掉血的猪猪没有翻盘引擎，是七职业里最怕开局崩盘的之一。"
    }
  },

  /* ───────────────────────── 3. DOOLEY 机宝 ───────────────────────── */
  {
    id: "dooley", en: "Dooley", cn: "杜利", nick: "机宝", hue: "#5CC8E8",
    tagline: "核心体系 · 全能核弱点 · 公式化运营",
    tier: "T1", difficulty: 1,
    s15: "机宝核心线全部健在：<b>Dooltron（杜利特隆）</b>1000/2000 裸伤+全异常充能仍是顶级；<b>Launcher Core（发射核心）</b>带飞一切快速循环；<b>Weaponized Core（武装核心）</b>稳健自成长，S15 的最佳宿主是 <b>Pulse Rifle</b>（贴着伙伴时 Multicast 翻倍）；国服招牌的<b>全能核弱点流（The Core + Weakpoint Detector）</b>机制在本版本依旧成立，见下方流派卡。本季新红利：<b>等级 11 多送一次保底核心升级</b>；<b>Railgun</b> 解除任务锁并改为 +2 Multicast（本站卡面快照仍显示旧版任务，以游戏内为准）；Flamethrower 灼烧翻倍。公式化吃野 + 升级奖励选核心，依旧是下限最高、最推荐萌新的职业。",
    builds: [
      {
        name: "Dooltron 伙伴机甲", tier: "T0.5", onset: "Day 4–7 视核心/伙伴到位",
        desc: "围绕 Dooltron 的伙伴体系：加速/减速/中毒/冻结/灼烧任一异常都给它充能，伙伴出手还送护盾。引擎多样——Monitor Lizard 自加速喷毒，或 Bill Dozer / Bellelista / Clawrence 组成伙伴打击群，是 S15 机宝出场率最高的一线。",
        cards: [
          { en: "Dooltron", cn: "杜利特隆：千伤巨炮，全异常充能+伙伴护盾", role: "core" },
          { en: "Monitor Lizard", cn: "巨蜥：自加速+被加速喷毒的永动引擎伙伴", role: "engine" },
          { en: "Bill Dozer", cn: "推土比尔：伙伴出手就成长，还给全队伙伴减冷却", role: "engine" },
          { en: "Clawrence", cn: "克劳伦斯：便宜的伙伴成长输出位", role: "engine" },
          { en: "Z-Shield", cn: "Z 盾：护盾+冻结+相邻减冷却三合一", role: "tech" },
          { en: "Bunker", cn: "地堡：全程减伤+护盾 Multicast，消耗局压舱石", role: "tech" }
        ],
        ceiling: "数值与频率双高，正面对拼几乎不输任何中速队。",
        floor: "核心被冻结/摧毁针对时哑火——后期记得带解控或备用输出。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Dooley：Dooltron）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      },
      {
        name: "Launcher Core 发射核心（飞核）", tier: "T1", onset: "Day 3–6 搭循环",
        desc: "发射核心让两件物品起飞并持续给飞行物品充能，伙伴/飞行物品出手又给它回充——国服俗称『飞核/0 帧起手』。终结点常见 Ice 9000 / Nitrogen Hammer，理论上任何东西都能被它带飞，创造力即上限。",
        cards: [
          { en: "Launcher Core", cn: "发射核心：让物品起飞+给飞行物品充能的引擎心脏", role: "core" },
          { en: "Ice 9000", cn: "冰霜 9000：冻结时自身叠毒，冻结终结器", role: "engine" },
          { en: "Nitrogen Hammer", cn: "液氮锤：每次冻结+100/200 伤的重锤终结点", role: "engine" },
          { en: "Fiber Optics", cn: "光纤：最左物品出手就给最右充能，循环神器", role: "engine" },
          { en: "Capacitor", cn: "电容：周期给相邻充能的润滑小件", role: "filler" },
          { en: "Metronome", cn: "节拍器：一侧出手加速另一侧", role: "filler" }
        ],
        ceiling: "循环搭通后 0 帧起手，对面还没动就被冻住/砸死。",
        floor: "循环缺一环就转不动，但小件来源极广，实际很难彻底断件。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Dooley：Launcher Core）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      },
      {
        name: "Weaponized Core 武装核心", tier: "T1.5", onset: "Day 3 起手即可用",
        desc: "经典自成长核心：它和右侧武器一起永久成长，左侧任何物品出手都给它充能。S15 最佳宿主是 Pulse Rifle——贴着唯一伙伴时 Multicast 翻倍；找到早期 Railgun（S15 解锁任务锁+2 Multicast）也值得并入。零拼图压力的轮椅线。",
        cards: [
          { en: "Weaponized Core", cn: "武装核心：自己和右侧武器一起成长，从头用到尾", role: "core" },
          { en: "Pulse Rifle", cn: "脉冲步枪：贴唯一伙伴 Multicast 翻倍，S15 钦点宿主", role: "engine" },
          { en: "Railgun", cn: "轨道炮：S15 解任务锁+2 Multicast（快照为旧版描述）", role: "engine" },
          { en: "GPU", cn: "显卡：专职给核心加速的小件", role: "engine" },
          { en: "Antimatter Chamber", cn: "反物质舱：自毁换摧毁对面 3 件，后期干扰杀招", role: "tech" },
          { en: "Remote Control", cn: "遥控器：一键使用全部中型核心", role: "filler" }
        ],
        ceiling: "稳定 8–10 胜的轮椅线，干扰件到位后能掀翻更强的盘面。",
        floor: "纯比数值会输给成型的 T0 队——它的下限就是别人的中位数。",
        sources: [
          { name: "Kripp · Weaponized Core Dooley", url: "https://mobalytics.gg/the-bazaar/builds/weaponized-core-dooley-kripp" }
        ]
      },
      {
        name: "The Core 全能核弱点流", tier: "T1", onset: "Day 4–7 拼三段泵，国服招牌打法",
        desc: "国服社区的招牌体系（济海全能核连续 10 胜记录）：The Core（全能核）出手给右侧全部物品充能、左侧任意物品使用又给它回充——不挑队友的百搭心脏。Cool LEDs 在你使用核心时充能并放出减速，Weakpoint Detector（弱点探测器）吃减速充能、每跳给全武器永久加伤——『开火→减速→弱点成长』三段泵，把任意重炮喂成斩杀线。",
        cards: [
          { en: "The Core", cn: "全能核：充右侧全部+被左侧回充，百搭引擎心脏", role: "core" },
          { en: "Weakpoint Detector", cn: "弱点探测器：减速时充能，每跳给全武器永久加伤的成长泵", role: "core" },
          { en: "Cool LEDs", cn: "炫彩灯条：用核心就充能，把每次开火转成减速", role: "engine" },
          { en: "Hammlet", cn: "小锤锤：减速时充能的高频小炮，吃满弱点成长", role: "engine" },
          { en: "Chemsnail", cn: "化学蜗牛：减速时充能的毒出口（毒变体）", role: "engine" },
          { en: "Pulse Rifle", cn: "脉冲步枪：挂在成长链末端的主炮位", role: "engine" }
        ],
        ceiling: "三段泵转起来后全武器每一秒都在变强，后期单发数值滚到夸张。",
        floor: "核心/灯条/弱点三件缺一不可，缺件时只是普通核心队；该体系为国服长青打法，15.0 补丁未改动相关卡（机制已对照当前卡面验证）。",
        sources: [
          { name: "bilibili · 济海《机宝全能核 7 连 10 胜记录》", url: "https://www.bilibili.com/video/BV1MLEnzBEXx/" },
          { name: "The Bazaar Wiki · The Core（最百搭的 Core）", url: "https://thebazaar.wiki.gg/wiki/The_Core" }
        ]
      }
    ],
    phases: [
      { key: "e", name: "前期", days: "Day 1–4",
        goals: ["升级奖励里选定核心方向（武装核稳 / 发射核上限 / 全能核百搭）", "围绕核心堆相邻触发小件，机宝前期盘面天生成型", "公式化吃野：机宝是全职业前期打野最稳的，经验金币双吃"],
        picks: [
          { en: "Weaponized Core", cn: "稳健线核心方向（升级奖励或货架）", role: "core" },
          { en: "Launcher Core", cn: "上限线核心方向", role: "core" },
          { en: "Fiber Optics", cn: "见到就拿，哪条线都吃", role: "engine" },
          { en: "Capacitor", cn: "便宜的充能润滑剂", role: "filler" },
          { en: "Beta Ray", cn: "β射线：冻结+核心联动的前期反制", role: "filler" }
        ],
        shops: [
          { s: "科技专卖店", why: "机宝小件大本营，第一优先" },
          { s: "综合商人（青铜）", why: "捡相邻触发杂件" },
          { s: "野怪（按表吃）", why: "机宝公式化打野收益全场最高" },
          { s: "技能商人", why: "充能/护盾系技能提前锁" }
        ],
        tips: ["机宝公式三板斧：核心+光纤+充能件，照抄即可达标", "机宝前期别贪转型，先把基础公式跑通"] },
      { key: "m", name: "中期", days: "Day 5–9",
        goals: ["确认终结点：飞核找 Ice 9000/液氮锤，伙伴线找 Dooltron+引擎伙伴", "附魔节点：核心上 Turbo（加速）或 Shielded（护盾）系", "Day 9 前 5–6 胜，循环必须基本闭合"],
        picks: [
          { en: "Dooltron", cn: "见到可直接升级流派上限", role: "core" },
          { en: "The Core", cn: "全能核：配上弱点探测器即可定轴国服打法", role: "core" },
          { en: "Weakpoint Detector", cn: "弱点探测器：与全能核/减速件成套收", role: "core" },
          { en: "Ice 9000", cn: "飞核终结点（与液氮锤二选一）", role: "engine" },
          { en: "Pulse Rifle", cn: "武装核/全能核两线通用的输出宿主", role: "engine" },
          { en: "Z-Shield", cn: "防御缺口用护盾补", role: "tech" }
        ],
        shops: [
          { s: "科技/伙伴专卖店", why: "定向补终结点与引擎" },
          { s: "附魔奇遇", why: "核心第一附魔=强度跳变" },
          { s: "精英怪", why: "机宝中期盘面硬，多搏高级战利品" }
        ],
        tips: ["循环类盘面摆位即强度：触发链从左到右捋一遍再开战", "等级 11 有保底核心升级（S15 新增），卡级别忘了吃"] },
      { key: "l", name: "后期", days: "Day 10+",
        goals: ["核心与终结点升品，循环速度做到极致", "上 Antimatter Chamber 等干扰件，专拆对手核心", "防针对：备好解冻/抗摧毁手段，别让单点故障葬送一局"],
        picks: [
          { label: "核心高品复制件", cn: "永远的第一优先", role: "core" },
          { en: "Antimatter Chamber", cn: "对位 T0 队的胜负手", role: "tech" },
          { en: "Bunker", cn: "减伤+盾连发，消耗局保底", role: "tech" }
        ],
        shops: [
          { s: "钻石商人", why: "高品核心唯一稳定来源" },
          { s: "附魔奇遇", why: "第二/第三附魔收尾" },
          { s: "高阶精英", why: "最后的技能拼图" }
        ],
        tips: ["机宝后期最大的敌人是『被点名』：冻结/摧毁全往核心上招呼，冗余输出别卖光"] }
    ],
    bounds: {
      up: "上限：飞核 0 帧循环与 Dooltron 裸数值都有冲顶实力，干扰件还能赢在盘面之外。",
      down: "下限：全游戏最高——公式化运营 + 打野模板让萌新也能稳定 6–8 胜，公认的新手第一职业。"
    }
  },

  /* ───────────────────────── 4. MAK 马克 ───────────────────────── */
  {
    id: "mak", en: "Mak", cn: "马克", nick: "药剂师", hue: "#8FD68F",
    tagline: "药水引擎 · 灼烧焚诀 · 毒爆一刀",
    tier: "T0", difficulty: 5,
    s15: "马克的三条主轴被 Mobalytics S15 全部点名：<b>Eternal Torch（永恒火炬）焚诀</b>、<b>Poppy Field（罂粟田）毒武器</b>、<b>Plague Glaive（瘟疫关刀）毒爆</b>。15.0 的三个数据点：<b>Library（图书馆）</b>现在只为非武器减冷却（武器冷却惩罚已移除，但武器流依旧无收益，老的图书馆武器流别抄）；<b>Athanor 不再产出催化剂</b>（本站卡面快照仍是旧描述）；<b>Book of Secrets</b> 回白银、每天白送一个随机英雄技能，依旧是版本福利。上限仍是天花板，但更吃手了。",
    builds: [
      {
        name: "Eternal Torch 焚诀", tier: "T0.5", onset: "Day 5–8 找到火炬定轴",
        desc: "永恒火炬为轴的灼烧体系，国服『马克焚诀』本体。药水/试剂高频触发推灼烧层数；Athanor（黄金品阶）给相邻装弹、用药剂就追加灼烧，是体系一致性的来源（15.0 起不再产催化剂）。",
        cards: [
          { en: "Eternal Torch", cn: "永恒火炬：5 秒一跳的灼烧核心，焚诀的火种", role: "core" },
          { en: "Athanor", cn: "炼金炉：给相邻装弹+用药剂追加灼烧（黄金品阶；15.0 起不再产催化剂）", role: "engine" },
          { en: "Boiling Flask", cn: "沸腾烧瓶：给相邻药水装弹+Multicast", role: "engine" },
          { en: "Sleeping Potion", cn: "安眠药水：单发减速最慢敌件 3–6 秒，争取烧的时间", role: "tech" },
          { en: "Atmospheric Sampler", cn: "大气采样器：附魔/飞行物品互相充能的联动支援", role: "filler" },
          { en: "Tracer Fire", cn: "技能·曳光弹：灼烧叠暴击，焚诀的输出倍增器", role: "skill" }
        ],
        ceiling: "灼烧层数滚起来后融化一切，控制药水还能反锁快攻。",
        floor: "火炬迟迟不来时只是个慢热药剂师，会被节奏队抢死。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Mak：Eternal Torch）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      },
      {
        name: "Poppy Field 罂粟毒武器", tier: "T1", onset: "Day 4–7 武器+毒双修",
        desc: "罂粟田把武器流改造成毒系发动机：你每次使用武器追加 6 点中毒，而你的武器又按敌方身上毒量的 50–100% 加伤——『边打边下毒、毒越浓刀越疼』的正反馈。可中途转向 Goop Flail / Plague Glaive 的毒爆终点。",
        cards: [
          { en: "Poppy Field", cn: "罂粟田：用武器施毒+武器按敌方毒量加伤，毒武器引擎", role: "core" },
          { en: "Basilisk Fang", cn: "蛇蜥之牙：敌方中毒时 100% 暴击的吸血小刀", role: "engine" },
          { en: "Goop Flail", cn: "粘液连枷：三连发、按自身伤害施毒的转型终点", role: "engine" },
          { en: "Magic Carpet", cn: "魔毯：暴击就提速+起飞，毒暴击线的节奏件", role: "engine" },
          { en: "Smelling Salts", cn: "嗅盐：减速+联动加速的便宜小件", role: "filler" },
          { en: "Runic Potion", cn: "符文药水：给武器上吸血+加速吸血武器", role: "filler" }
        ],
        ceiling: "毒与武器互相喂养，中后期每刀都是斩杀刀。",
        floor: "毒件和武器两头都要喂，货架不配合时成型明显偏慢。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Mak：Poppy Field）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      },
      {
        name: "Plague Glaive 毒爆一刀", tier: "T1", onset: "Day 6–9 憋大招",
        desc: "瘟疫关刀为轴的毒爆斩杀：全体毒件+10/15 毒，敌方每 20 点毒它就+1 Multicast——毒量喂满后吸血巨刃多段超度，专治一切慢速队。Icicle + Invigorating Cold 是经典启动器。",
        cards: [
          { en: "Plague Glaive", cn: "瘟疫关刀：毒越多刀越多的吸血毒爆核心", role: "core" },
          { en: "Basilisk Fang", cn: "蛇蜥之牙：毒量小件引擎兼吸血续航", role: "engine" },
          { en: "Runic Great Axe", cn: "符文巨斧：吸血武器全员暴击的备选重武器", role: "engine" },
          { en: "Icicle", cn: "冰锥：开场冻结启动器", role: "tech" },
          { en: "Invigorating Cold", cn: "技能·提神寒气：首次冻结加速自己，毒爆的起跑器", role: "skill" }
        ],
        ceiling: "一刀数值无上限，后期任何站场队都是一刀的事。",
        floor: "憋大招期间最脆：被快攻连抓节奏会直接出局，进场时机全凭经验。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Mak：Plague Glaive）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      }
    ],
    phases: [
      { key: "e", name: "前期", days: "Day 1–4",
        goals: ["认清现实：马克是全职业前期最弱，目标是『少输血』不是赢", "嗅盐/能量药水等便宜小件维持底线盘面", "自毒类技能看清再拿，前期乱自毒会暴毙"],
        picks: [
          { en: "Smelling Salts", cn: "便宜高频小件，过渡期顶梁柱", role: "filler" },
          { en: "Energy Potion", cn: "能量药水：单发全队加速的节奏件", role: "filler" },
          { en: "Basilisk Fang", cn: "便宜毒件，给毒线留种子", role: "engine" },
          { label: "再生类小件", cn: "马克前期的血量就是后期的本钱", role: "tech" }
        ],
        shops: [
          { s: "药剂专卖店", why: "本系小件大本营" },
          { s: "综合商人（青铜）", why: "捡再生/控制杂件" },
          { s: "野怪（只挑软柿子）", why: "马克前期盘面软，打野宁稳勿贪" },
          { s: "技能商人", why: "再生/毒/灼烧系版本技能" }
        ],
        tips: ["前 4 天每一滴血都值钱：宁可少打一场野，不要莽精英", "别急着定流派，马克的核心件基本都在白银之后"] },
      { key: "m", name: "中期", days: "Day 5–9",
        goals: ["三线定轴：火炬焚诀 / 罂粟毒武器 / 关刀毒爆，看货架给什么", "Magic Carpet / Book of Secrets 这类『间接核心』优先级极高——马克=找到核心才算开局", "Day 9 前哪怕只有 4–5 胜，只要核心到手就不亏"],
        picks: [
          { en: "Eternal Torch", cn: "焚诀核心，见到即定轴", role: "core" },
          { en: "Poppy Field", cn: "毒武器核心，第二定轴位", role: "core" },
          { en: "Plague Glaive", cn: "毒爆核心，第三定轴位", role: "core" },
          { en: "Athanor", cn: "黄金货架重点搜寻，焚诀一致性来源", role: "engine" },
          { en: "Book of Secrets", cn: "每天白送随机技能的滚雪球福利", role: "tech" }
        ],
        shops: [
          { s: "药剂/符文专卖店", why: "三大核心的主要来源，值得连刷" },
          { s: "附魔奇遇", why: "核心到手立刻上对位附魔" },
          { s: "精英怪", why: "中期盘面起来后再开始搏高收益" },
          { s: "综合商人（黄金）", why: "捡 off-hero 强力武器补毒爆线" }
        ],
        tips: ["S15 重要勘误：Library 现在只给非武器减冷却、对武器既无惩罚也无收益（15.0 移除了武器冷却惩罚）——老攻略的图书馆武器流仍然别抄"] },
      { key: "l", name: "后期", days: "Day 10+",
        goals: ["毒爆线：把斩杀数值堆过『当前最肉对手的血量』，然后才考虑速度", "焚诀线：灼烧覆盖率+控制链，专心拖死对面", "复盘对手池：马克后期理论打谁都赢，输只输在配置错位"],
        picks: [
          { label: "核心高品复制件", cn: "关刀的刀、焚诀的火炬，升品=直接加伤", role: "core" },
          { en: "Sleeping Potion", cn: "高品安眠药水：控制链延长器", role: "tech" },
          { label: "抗冻/解控件", cn: "防止憋招期间被锁死", role: "tech" }
        ],
        shops: [
          { s: "钻石商人", why: "高品核心与传说药剂" },
          { s: "附魔奇遇", why: "Deadly/Toxic 等对位附魔收尾" },
          { s: "高阶精英", why: "成型马克可以无伤白嫖大部分精英" }
        ],
        tips: ["马克的 10 胜常常是后 5 天连胜打满——前中期忍住，别为短期胜场卖掉体系件"] }
    ],
    bounds: {
      up: "上限：版本天花板。毒爆一刀后期数值无上限，焚诀+控制链同样无解，天梯前列常驻。",
      down: "下限：同样夸张——前期全职业最弱、核心全靠中期找，找不到就是 2–4 胜散场。手越生下限越低，是典型的高手职业。"
    }
  },

  /* ───────────────────────── 5. STELLE 斯黛拉 ───────────────────────── */
  {
    id: "stelle", en: "Stelle", cn: "斯黛拉", nick: "黑妹", hue: "#F0A05A",
    tagline: "自毁焚烧 · 飞行节奏 · 护盾转化",
    tier: "T1.5", difficulty: 4,
    s15: "Mobalytics S15 点名的三套：<b>LavaRoller（熔岩滚轮）</b>自毁换灼烧、毁邻翻倍，仍是主流；<b>Private Runabout（私人快艇）</b>双连发重炮、每个飞行物品给它 -1 秒冷却，是飞行体系的新发动机；<b>Chicken Cannon（鸡肉炮）</b>重做定位是『伤害→护盾转化』支援——相邻护盾件获得等同它伤害的护盾，配 Security Drone 在前中期非常硬，但要做好后期转线准备。经典 <b>Space Laser（太空激光）</b>充能一炮仍是后期上限担当。黑妹是标准拼图职业：件到位起飞，缺件强度断崖。",
    builds: [
      {
        name: "LavaRoller 自毁焚烧", tier: "T1", onset: "Day 4–7 见滚轮定轴",
        desc: "滚轮自毁相邻物品换巨量灼烧、每毁一件灼烧翻倍。Ornithopter 等低 CD 件配 Headset（物品起飞就加速）让体系极易起步；Repair Drone / Parts Picker 负责把自毁变成可持续循环。",
        cards: [
          { en: "LavaRoller", cn: "熔岩滚轮：毁邻换灼烧、毁一件翻一倍，越滚越烫", role: "core" },
          { en: "Ornithopter", cn: "扑翼机：2–5 秒让相邻起飞+飞行武器加伤", role: "engine" },
          { en: "Headset", cn: "耳机：物品起飞就加速 1–4 秒，黑妹万金油", role: "engine" },
          { en: "Parts Picker", cn: "拾荒爪：毁最左件给全队减冷却，自毁闭环件", role: "engine" },
          { en: "Repair Drone", cn: "维修无人机：3 秒修 1–2 件，把自毁变永动", role: "engine" },
          { en: "Fire Bomb", cn: "燃烧弹：自毁灼烧小件，前期过渡", role: "filler" }
        ],
        ceiling: "灼烧无视护盾，滚雪球后连最肉的盾队也被烧穿。",
        floor: "自毁链断档（缺维修/回收）时等于自残，摆位失误会瞬间清空自己。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Stelle：LavaRoller）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      },
      {
        name: "Private Runabout 飞行节奏", tier: "T1", onset: "Day 5–8 拼图",
        desc: "私人快艇（Multicast 2、百伤起步、每个飞行物品 -1 秒冷却）为轴的飞行体系：Propeller / Paper Airplane 铺飞行数量，Hang Glider 的起停联动追加爆发。比一炮流稳、比滚轮灵活的中速线。",
        cards: [
          { en: "Private Runabout", cn: "私人快艇：双连发重炮，飞行件越多转越快", role: "core" },
          { en: "Hang Glider", cn: "悬挂滑翔机：全队起飞+飞行武器加伤+落地伤害", role: "core" },
          { en: "Propeller", cn: "螺旋桨：让物品起飞+全飞行件减冷却", role: "engine" },
          { en: "Paper Airplane", cn: "纸飞机：2–5 秒起停一次，便宜的飞行计数器", role: "filler" },
          { en: "Airplane Glue", cn: "飞机胶水：落地换攻防永久成长，起停体系粘合剂", role: "engine" },
          { en: "Gyro Gunsight", cn: "陀螺瞄具：武器起飞就永久加伤", role: "filler" }
        ],
        ceiling: "节奏与成长兼得，中速对局几乎无短板。",
        floor: "上限不如一炮和滚轮，纯靠质量取胜，逆风翻盘手段少。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Stelle：Private Runabout）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      },
      {
        name: "Chicken Cannon 护盾转化", tier: "T1.5", onset: "Day 3–6 成型快，后期需转线",
        desc: "S15 重做后的定位：鸡肉炮每次开炮，相邻护盾件获得等同它伤害的护盾——把你的输出成长直接复制成防御成长。配 Security Drone（飞行时被动充能）+ Windbreaker（起飞叠盾）前中期异常硬；社区共识是它撑不满后期，Day 9 后要并入飞行线或滚轮线。",
        cards: [
          { en: "Chicken Cannon", cn: "鸡肉炮：开炮给相邻护盾件复制等额护盾，攻转防引擎", role: "core" },
          { en: "Security Drone", cn: "安保无人机：飞行时敌方每动一下就给它充能的产盾机器", role: "engine" },
          { en: "Windbreaker", cn: "防风衣：物品起飞就叠盾、飞行时双倍", role: "engine" },
          { en: "Pogo Stick", cn: "弹簧单高跷：起飞+100 盾、落地充能相邻", role: "engine" },
          { en: "Goggles", cn: "护目镜：护盾+加速叠暴击的便宜小件", role: "filler" }
        ],
        ceiling: "前中期攻防一体几乎不掉血，为后期转线攒满本钱。",
        floor: "后期数值跟不上 T0 队——拖到 Day 10 还没转线就是慢性死亡。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Stelle：Chicken Cannon）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      },
      {
        name: "Space Laser 充能一炮（经典线）", tier: "T1.5", onset: "Day 6–9 憋炮",
        desc: "充能体系的终极浪漫：9999 伤害的太空激光，每用一个飞行物品充能 1 秒。Observatory / Altimeter / Sirens 等引擎疯狂充能，一炮终结战斗。S15 不在 Mobalytics 钦点之列，但凑齐引擎时上限依旧是版本级的。",
        cards: [
          { en: "Space Laser", cn: "太空激光：9999 一炮，用飞行物品充能", role: "core" },
          { en: "Observatory", cn: "天文台：相邻充能+飞行联动，最大充能引擎", role: "engine" },
          { en: "Altimeter", cn: "高度计：相邻充能、贴飞行件冷却骤减", role: "engine" },
          { en: "Sirens", cn: "警笛：减速+加速双修，邻接载具/地产 Multicast", role: "engine" },
          { en: "Hydraulic Squeezer", cn: "液压压缩机：飞行件充能+工具联动", role: "engine" },
          { en: "Flare Gun", cn: "信号枪：灼烧+让载具起飞，炮线的点火器", role: "filler" }
        ],
        ceiling: "一炮带走任何盘面——理论上的『版本最优解终结者』。",
        floor: "炮没充满人先没了：被快攻或冻结点名时毫无还手之力。",
        sources: [
          { name: "bazaar-builds · Stelle 一炮流实战记录", url: "https://bazaar-builds.net/" }
        ]
      }
    ],
    phases: [
      { key: "e", name: "前期", days: "Day 1–4",
        goals: ["扑翼机+杂件打基础节奏，黑妹前期中规中矩别强求连胜", "Headset 见到必拿——它兼容黑妹所有流派", "护盾小件别乱卖：鸡肉炮线 Day 3 就能成型抢分"],
        picks: [
          { en: "Ornithopter", cn: "体系润滑剂，最高优先小件", role: "engine" },
          { en: "Headset", cn: "全流派通用急速，见到必拿", role: "engine" },
          { en: "Chicken Cannon", cn: "青铜即可定前中期轴，成型最快", role: "core" },
          { en: "Goggles", cn: "便宜攻防小件", role: "filler" },
          { en: "Flare Gun", cn: "信号枪：前期输出过渡", role: "filler" }
        ],
        shops: [
          { s: "科技/载具专卖店", why: "黑妹小件大本营" },
          { s: "综合商人（青铜）", why: "捡充能/飞行杂件" },
          { s: "野怪（中等强度）", why: "黑妹前期盘面尚可，按强度表吃" },
          { s: "技能商人", why: "充能/灼烧系技能提前看" }
        ],
        tips: ["黑妹是拼图职业：前期每一件『暂时没用的小件』都可能是中期某条线的关键拼图，卖货前多想一步"] },
      { key: "m", name: "中期", days: "Day 5–9",
        goals: ["四线定轴：滚轮焚烧 / 快艇飞行 / 鸡肉炮护盾（注意后期要转线）/ 太空激光", "滚轮线必须凑齐『自毁+回收』闭环再全力投入", "一炮线同时补生存件：憋炮期间不能裸奔"],
        picks: [
          { en: "LavaRoller", cn: "见滚轮基本可以定轴", role: "core" },
          { en: "Private Runabout", cn: "飞行线核心，白银可见", role: "core" },
          { en: "Space Laser", cn: "炮线核心，黄金段重点搜寻", role: "core" },
          { en: "Repair Drone", cn: "滚轮闭环件之一", role: "engine" },
          { en: "Observatory", cn: "炮线最大充能引擎", role: "engine" }
        ],
        shops: [
          { s: "载具/科技专卖店", why: "核心与引擎主要来源，值得连刷" },
          { s: "附魔奇遇", why: "滚轮上 Fiery、炮上 Deadly 都是质变" },
          { s: "精英怪", why: "搏充能系技能与高品引擎" }
        ],
        tips: ["Day 8 还没摸到任何核心 → 转飞行节奏线保底，别硬憋炮", "鸡肉炮队 Day 9 是转线窗口：把攒下的血量优势换成滚轮/快艇的成长时间"] },
      { key: "l", name: "后期", days: "Day 10+",
        goals: ["一炮线：把充能速度压到对手斩杀线之前，必要时补冻结拖时间", "滚轮线：灼烧量级拉满，专打护盾/再生肉队", "补反制：对面有干扰/摧毁时给核心上保护或备份"],
        picks: [
          { label: "核心高品复制件", cn: "炮与滚轮升品收益巨大", role: "core" },
          { en: "Icicle", cn: "给一炮争取的每一秒都是命", role: "tech" },
          { en: "Hydraulic Squeezer", cn: "充能效率的最后一档", role: "engine" }
        ],
        shops: [
          { s: "钻石商人", why: "高品炮/滚轮唯一稳定来源" },
          { s: "附魔奇遇", why: "对位附魔决定镜像局胜负" },
          { s: "高阶精英", why: "最后的技能缺口" }
        ],
        tips: ["黑妹后期对局本质是数学题：开打前心算『我的斩杀时间 vs 对面的斩杀时间』，差一秒就要补件"] }
    ],
    bounds: {
      up: "上限：一炮流可以带走版本任何盘面，滚轮焚烧无视护盾——上限稳居第一梯队。",
      down: "下限：七职业里最吃拼图的之一，核心断供时强度断崖；对摆位与时机的要求也高，熟练度不够慎选。"
    }
  },

  /* ───────────────────────── 6. JULES 朱尔斯 ───────────────────────── */
  {
    id: "jules", en: "Jules", cn: "朱尔斯", nick: "厨师", hue: "#E87A7A",
    tagline: "食物连发 · 再生转伤 · 灼烧冻结",
    tier: "T2", difficulty: 3,
    s15: "厨师的灶台（Stove）与冷柜（Cooler）位置每局随机，摆位即强度，这也是他稳定性垫底的原因。Mobalytics S15 点名三线：<b>Farmer's Market（农贸市场）</b>再生流依旧最稳；<b>Spice Rack（香料架）</b>在 S15 被重做为灼烧增幅支援、社区称『厨师版般若面具』（注意：本站卡面快照仍是旧版暴击描述，以游戏内为准）；<b>Freezer（冷冻柜）</b>冻结线——相邻食物触发冻结，Chilled 状态下每次冻结还造成大量伤害。配套利好：Grill 灼烧成长加强，食物灼烧流整体回暖。",
    builds: [
      {
        name: "Farmer's Market 农贸再生", tier: "T1", onset: "Day 4–7，市场越早越肉",
        desc: "快速食物刷出海量再生，Bread Knife（按双倍再生出伤）把再生转成实打实的伤害；农贸市场还能靠卖食物堆最大生命，越打越胖、越胖越疼。",
        cards: [
          { en: "Farmer's Market", cn: "农贸市场：再生增幅+卖食物换最大生命，食物体系心脏", role: "core" },
          { en: "Bread Knife", cn: "面包刀：伤害=双倍再生，本流派的胜负手", role: "core" },
          { en: "Zarlic", cn: "扎蒜：加速食物+食物暴击就充能", role: "engine" },
          { en: "Pasta", cn: "意面：再生+按再生堆最大生命，被加速还会自充能", role: "engine" },
          { en: "Trail Mix", cn: "什锦果干：一口 5 再生的便宜底料", role: "filler" },
          { en: "Oven", cn: "烤箱：全食物加热+Heated 件 Multicast，钻石终结件", role: "engine" }
        ],
        ceiling: "再生厚到打不动、面包刀输出还在涨——耗死一切非秒杀队。",
        floor: "缺面包刀=只肉不疼，会被高成长队拖死。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Jules：Farmer's Market）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      },
      {
        name: "Spice Rack 焚厨", tier: "T1.5", onset: "Day 5–8 见香料架定轴",
        desc: "S15 重做后的香料架是灼烧增幅器（厨师版般若面具）：快速食物连发推层数，Grill（用食物就灼烧、Heated 食物还让它成长）等终结件把火越烧越旺，失控速度极快。泡面（Instant Noodles）是本线的版本答案小件。",
        cards: [
          { en: "Spice Rack", cn: "香料架：S15 重做的灼烧增幅核心（快照为旧版描述，以游戏内为准）", role: "core" },
          { en: "Grill", cn: "烧烤架：用食物就灼烧，S15 成长加强", role: "engine" },
          { en: "Instant Noodles", cn: "泡面：Heated 灼烧/Chilled 再生双形态，『嗦面』本体", role: "engine" },
          { en: "Strawberries", cn: "草莓：盾+再生+Chilled 冻结的高频小食物", role: "engine" },
          { en: "Serving Platter", cn: "餐盘：食物暴击就给其他食物充能", role: "filler" },
          { en: "Tracer Fire", cn: "技能·曳光弹：灼烧叠暴击，焚厨的倍增器", role: "skill" }
        ],
        ceiling: "灼烧无视护盾，节奏起来后烧穿一切肉队。",
        floor: "灶台位置烂时连发链卡顿，强度直接打七折。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Jules：Spice Rack）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      },
      {
        name: "Freezer 冻结控制", tier: "T1.5", onset: "Day 6–9 拼控制链",
        desc: "S15 冻结新轴：冷冻柜让相邻食物每次使用都冻结敌件 0.5 秒，自身 Chilled 时每次冻结还砸 100/200 伤害。配 Giant Lollipop（Heated 时多重减速）与 Dishwasher（加热+加速你的工具武器、Heated 武器双倍伤害）形成控制+输出双修。",
        cards: [
          { en: "Freezer", cn: "冷冻柜：食物触发冻结，Chilled 时冻结即伤害", role: "core" },
          { en: "Giant Lollipop", cn: "巨型棒棒糖：百伤+Heated 多重减速", role: "core" },
          { en: "Dishwasher", cn: "洗碗机：加热+加速工具武器，Heated 武器双倍伤害", role: "engine" },
          { en: "Cutting Board", cn: "砧板：食物充能+武器联动成长", role: "engine" },
          { en: "Pizza Cutter", cn: "披萨刀：给右侧食物充能，Heated 双倍", role: "filler" },
          { en: "Slow and Steady", cn: "技能·稳扎稳打：减速就给武器永久加伤", role: "skill" }
        ],
        ceiling: "控制链拉满后对面全程慢动作，棒棒糖一锤一个。",
        floor: "控制不满时不上不下，输出与生存两头不靠。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Jules：Freezer）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" }
        ]
      }
    ],
    phases: [
      { key: "e", name: "前期", days: "Day 1–4",
        goals: ["开局先看灶台/冷柜位置——它决定你这局买什么、怎么摆", "快速食物小件铺场打节奏，再生件优先保血", "厨师前期不弱：连发链顺的话能偷不少胜场"],
        picks: [
          { en: "Zarlic", cn: "便宜的食物加速器", role: "engine" },
          { en: "Strawberries", cn: "攻防一体的高频小食物", role: "engine" },
          { en: "Instant Noodles", cn: "泡面：版本答案级小件，见到就拿", role: "engine" },
          { en: "Trail Mix", cn: "血量即容错", role: "tech" },
          { en: "Pizza Cutter", cn: "披萨刀：前期输出过渡", role: "filler" }
        ],
        shops: [
          { s: "食材专卖店", why: "厨师小件大本营，第一优先" },
          { s: "综合商人（青铜）", why: "捡杂项支援" },
          { s: "野怪", why: "再生底子让厨师打野容错高" },
          { s: "技能商人", why: "食物/再生/灼烧系技能" }
        ],
        tips: ["买之前先想『这件放哪』：放不进灶台/冷柜联动位的食物，价值要打折计算"] },
      { key: "m", name: "中期", days: "Day 5–9",
        goals: ["三选一定型：农贸再生 / 香料架焚厨 / 冷冻柜控制", "再生线死磕 Bread Knife——没有它再生只是拖时间", "重新规划摆位：核心进灶台联动位，连发链按触发顺序排"],
        picks: [
          { en: "Farmer's Market", cn: "再生线核心", role: "core" },
          { en: "Spice Rack", cn: "焚厨核心", role: "core" },
          { en: "Freezer", cn: "控制线核心", role: "core" },
          { en: "Bread Knife", cn: "再生线胜负手，优先级等同核心", role: "core" },
          { en: "Grill", cn: "焚厨终结件，定轴后补", role: "engine" }
        ],
        shops: [
          { s: "食材专卖店", why: "核心与连发件来源，值得连刷" },
          { s: "附魔奇遇", why: "面包刀/烧烤架上对位附魔" },
          { s: "精英怪", why: "中期盘面成型后再搏" }
        ],
        tips: ["厨师转型成本低（食物互相兼容），中期可以比别的职业晚 1 天定轴，但 Day 8 是底线"] },
      { key: "l", name: "后期", days: "Day 10+",
        goals: ["核心升品 + 摆位精修：后期每一格位置都要服务触发链", "再生线对镜像消耗局补输出，焚厨对肉队拉灼烧量级", "认清天敌：一炮流与高额秒杀是厨师的命门，补冻结/减速干扰"],
        picks: [
          { label: "核心高品复制件", cn: "市场/香料架/冷冻柜升品", role: "core" },
          { en: "Giant Lollipop", cn: "高品棒棒糖：控制+输出双修的后期答案", role: "engine" },
          { en: "Oven", cn: "烤箱：Heated 体系的钻石级终结件", role: "engine" }
        ],
        shops: [
          { s: "钻石商人", why: "高品核心来源" },
          { s: "附魔奇遇", why: "最后的强度阀门" },
          { s: "高阶精英", why: "补技能缺口" }
        ],
        tips: ["每天开打前把触发链从头到尾过一遍——厨师后期输掉的局，一半输在摆位没跟上转型"] }
    ],
    bounds: {
      up: "上限：农贸再生+面包刀成型后越打越肉、输出还高，是镜像消耗局的最终赢家；焚厨爆发同样能冲 10 胜。",
      down: "下限：灶台/冷柜 RNG 让同一套牌强度上下浮动 30%，是七职业里稳定性最差的；好在再生底子兜底，烂局也常有 5–6 胜。"
    }
  },

  /* ───────────────────────── 7. KARNOK 卡诺克 ───────────────────────── */
  {
    id: "karnok", en: "Karnok", cn: "卡诺克", nick: "猎人", hue: "#A0B86A",
    tagline: "激怒爆发 · 自减速装填 · 急速暴击",
    tier: "T0", difficulty: 4,
    s15: "付费 DLC 英雄（Steam 单独购买，自带 120+ 物品与技能）。机制核心是<b>怒气（Rage）</b>：战斗中累积、满 100 进入<b>激怒（Enrage）</b>爆发窗口；另一招牌是<b>自减速（Self-Slow）</b>与装填（Reload）的左右互搏。Mobalytics S15 点名三线：<b>Runic Claymore（符文巨剑）/ Dual Reaver（双裂收割者）/ Waystones（路标石）</b>；社区（bazaar-builds）把 <b>Jacket Exodia（双钻石皮夹克）</b>与巨剑同列 S 级。⚠ 注意：本站卡面数据源未收录 Karnok DLC 物品，本页多数卡片为文字版（Waystones / Dual Reaver 已按社区数据补录效果）。共识：<b>卡诺克是节奏英雄，目标 Day 13 前拿满 10 胜</b>，越拖后期可选项越少。",
    builds: [
      {
        name: "Runic Claymore 符文巨剑", tier: "T0.5", onset: "Day 4–7 见巨剑定轴",
        desc: "bazaar-builds 评 S 级的第一主轴：围绕符文巨剑解决『出手速度』和『暴击率』两道题，Flying Squirrel / Hunter's Journal 做支援，Forest Cloak 提供最大生命成长。激怒窗口内的爆发是全游戏最暴力的一档。",
        cards: [
          { en: "Runic Claymore", cn: "符文巨剑：激怒体系的最强出口（DLC，数据库未收录）", role: "core" },
          { en: "Flying Squirrel", cn: "飞鼠：快速伙伴支援（DLC 未收录）", role: "engine" },
          { en: "Hunter's Journal", cn: "猎人日志：卡诺克稀缺的经济+成长件（DLC 未收录）", role: "engine" },
          { en: "Forest Cloak", cn: "森林斗篷：最大生命成长引擎（DLC 未收录）", role: "engine" },
          { en: "Karst", cn: "卡斯特：怒气+护盾+缩短激怒间隔的体系支援（DLC 未收录）", role: "tech" }
        ],
        ceiling: "巨剑稳定暴击后伤害+续航双在线，激怒窗口一轮带走站场队。",
        floor: "速度和暴击两道题没解时只是把好剑而非体系。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Karnok：Runic Claymore）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" },
          { name: "bazaar-builds · Karnok 完全指南（S 级评定）", url: "https://bazaar-builds.net/karnok-guide/" }
        ]
      },
      {
        name: "Shotgun 弹药自减速", tier: "T1", onset: "Day 5–8 拼组合",
        desc: "主动减速自己换取 Chains（锁链）的高效成长，再用 Tent（最强装填件之一）喂 Shotgun / Bear Trap 持续开火——自减速与装填互相成就。变体：Utility Belt 暴击向；Boa Constrictor / Tri-Net / Bladed Armor 的纯自减速绞杀也成立。",
        cards: [
          { en: "Chains", cn: "锁链：自减速体系的成长核心（DLC 未收录）", role: "core" },
          { en: "Shotgun", cn: "霰弹枪：装填支援到位后的高速弹药输出（DLC 未收录）", role: "engine" },
          { en: "Bear Trap", cn: "捕熊夹：敌方行动就反击+减速的弹药小件（DLC 未收录）", role: "engine" },
          { en: "Tent", cn: "帐篷：全游戏最强装填件之一，霰弹枪的弹仓（DLC 未收录）", role: "engine" },
          { en: "Ghillie Suit", cn: "吉利服：体系支援（DLC 未收录）", role: "tech" },
          { en: "Fairy Circle", cn: "蘑菇圈：体系支援件（DLC 未收录）", role: "filler" }
        ],
        ceiling: "锁链成长效率极高，中后期数值滚到对手绝望。",
        floor: "自减速节奏没算好=单纯变慢，会被快攻按着打。",
        sources: [
          { name: "bazaar-builds · Karnok 完全指南（A 级：Ammo / Self-Slow）", url: "https://bazaar-builds.net/karnok-guide/" }
        ]
      },
      {
        name: "Dual Reaver & Waystones 急速暴击", tier: "T1", onset: "Day 5–8，S15 新主流",
        desc: "S15 的两条新钦点线天生一对：Waystones 每 5/4/3/2 秒加速一件物品；Dual Reaver 每次被加速叠暴击率、伤害又随暴击率增长——加速即成长的双连发收割者。变体终点还有 Giant Sling（激怒弹药爆发，伤害五倍区）。",
        cards: [
          { en: "Waystones", cn: "路标石：周期加速另一件物品（社区数据补录）", role: "core" },
          { en: "Dual Reaver", cn: "双裂收割者：被加速叠暴击、暴击转伤害（社区数据补录）", role: "core" },
          { en: "Giant Sling", cn: "巨型投石索：激怒弹药爆发变体核心（DLC 未收录）", role: "engine" },
          { en: "Adrenaline Shot", cn: "肾上腺素：爆发窗口支援（DLC 未收录）", role: "tech" },
          { en: "Great Eagle", cn: "巨鹰：激怒爆发线的后期大件（DLC 未收录）", role: "engine" }
        ],
        ceiling: "加速—暴击—加伤三环自锁，节奏拉满后秒表级斩杀。",
        floor: "新线攻略池浅、对节拍要求高，断件时输出真空。",
        sources: [
          { name: "Mobalytics · S15 Meta Builds（Karnok：Dual Reaver / Waystones）", url: "https://mobalytics.gg/the-bazaar/guides/meta-builds" },
          { name: "bazaardb · Dual Reaver / Waystones 卡面数据", url: "https://bazaardb.gg/card/ml64c29w89xh9k14lp1xg9cp3b/Dual-Reaver" }
        ]
      }
    ],
    phases: [
      { key: "e", name: "前期", days: "Day 1–4",
        goals: ["搞懂怒气：战斗中累积、满 100 进激怒窗口，爆发全在窗口里", "五件套见到先囤：Chains / Hunting Knife / Hunter's Journal / Adrenaline Shot / Flying Squirrel（社区共识的万金油支援组）", "目标 Day 4 前 2–3 胜，节奏属于中上"],
        picks: [
          { en: "Chains", cn: "自减速线的种子，早拿早成长", role: "engine" },
          { en: "Hunting Knife", cn: "猎刀：兼职经济的便宜节奏件", role: "filler" },
          { en: "Hunter's Journal", cn: "卡诺克稀缺的经济来源，必收", role: "engine" },
          { en: "Flying Squirrel", cn: "便宜伙伴，体系通用", role: "engine" },
          { en: "Jerky", cn: "肉干：打野赢一场+1 弹药上限的回复件", role: "filler" }
        ],
        shops: [
          { s: "兽群/狩猎商人", why: "猎人本系大本营（DLC 专属商人池）" },
          { s: "武器商人", why: "巨剑与过渡武器来源" },
          { s: "野怪", why: "猎人前期盘面不差，正常吃野；Jerky 还会成长" },
          { s: "技能商人", why: "武器/暴击/急速系技能提前锁" }
        ],
        tips: ["DLC 卡未收录进本站数据库，本页卡片多为文字版——出装细节以游戏内描述为准", "新英雄攻略池浅：多看自己的战斗回放，理解怒气/自减速的真实触发顺序，比抄表更涨分"] },
      { key: "m", name: "中期", days: "Day 5–9",
        goals: ["三选一：巨剑（最稳）/ 弹药自减速（最深）/ 急速暴击 Dual Reaver+Waystones（S15 新红利）", "记住身份：卡诺克是节奏英雄，中期就要主动抢胜场，不能佛系攒后期", "Day 9 前 5 胜+主轴成型"],
        picks: [
          { en: "Runic Claymore", cn: "黄金货架最高优先", role: "core" },
          { en: "Dual Reaver", cn: "S15 新核心，与 Waystones 成对收", role: "core" },
          { en: "Waystones", cn: "急速引擎，便宜且全线通用", role: "core" },
          { en: "Shotgun", cn: "弹药线主输出，与 Tent 成对收", role: "engine" },
          { en: "Karst", cn: "怒气+护盾支援，多线通用", role: "tech" }
        ],
        shops: [
          { s: "兽群/武器专卖店", why: "核心定向搜寻，值得连刷" },
          { s: "附魔奇遇", why: "巨剑上 Deadly（暴击）是质变" },
          { s: "精英怪", why: "猎人中期盘面硬，多搏技能" }
        ],
        tips: ["自减速是双刃剑：没有 Chains/装填收益时别乱拿自减速件"] },
      { key: "l", name: "后期", days: "Day 10+",
        goals: ["巨剑线：暴击率拉满，激怒窗口内一轮终结", "整活上限：Jacket Exodia——双钻石 Leather Jacket 成立时近乎无敌（注意避开阻碍怒气获取的主动件）", "硬截止意识：Day 13 前拿满 10 胜，每一天都是冲刺日"],
        picks: [
          { label: "核心高品复制件", cn: "巨剑/收割者升品", role: "core" },
          { en: "Leather Jacket", cn: "皮夹克：双钻石=Exodia 整活终点（DLC 未收录）", role: "tech" },
          { en: "Great Eagle", cn: "激怒爆发线的后期大件", role: "engine" }
        ],
        shops: [
          { s: "钻石商人", why: "高品核心与传说兽群" },
          { s: "附魔奇遇", why: "对位附魔收尾" },
          { s: "高阶精英", why: "最后的技能拼图" }
        ],
        tips: ["卡诺克越拖越弱是数学事实：后期货架对 DLC 体系的补给远不如本体英雄，Day 13 就是终点线"] }
    ],
    bounds: {
      up: "上限：巨剑激怒爆发与 Jacket Exodia 的无敌整活都是版本之巅，S15 与马克并列 T0。",
      down: "下限：机制（怒气/自减速）理解门槛高，节奏算错就是自废武功；中文资料与数据库覆盖都少，下限非常吃个人熟练度。"
    }
  }
  ]
};
