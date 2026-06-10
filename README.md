# 大巴扎攻略站 · The Bazaar Tips

[The Bazaar](https://playthebazaar.com)（大巴扎）的中文攻略站：S15 全 7 职业的流派构筑、分阶段抓牌 / 进店路线、强度上下限，**所有卡牌直接关联全量数据库**——悬浮看真实效果文本，点击看各品阶数值、附魔、任务与卡面图；另附可搜索的全卡图鉴（926 物品 + 386 技能）。

纯静态站，无构建步骤、无运行时依赖。

## 本地运行

浏览器不允许从 `file://` 直接 fetch JSON，所以需要任意一个静态服务器：

```bash
cd the-bazaar-tips
python3 -m http.server 8000
# 打开 http://localhost:8000
```

或 `npx serve`、VS Code Live Server 等任意等价物。部署到 GitHub Pages / 任意静态托管即开即用。

## 目录结构

```
├── index.html            页面壳（结构与挂载点）
├── css/site.css          全部样式
├── js/
│   ├── guide-data.js     ★ 攻略内容（GUIDE_DATA）——改攻略只动这个文件
│   ├── card-db.js        数据层：加载/索引/检索 data/*.json
│   └── app.js            渲染层：攻略页、卡牌图鉴、悬浮卡面、详情弹窗
├── data/
│   ├── all_items.json    全量物品（howbazaar API 快照，含图片 URL）
│   ├── all_skills.json   全量技能（同上）
│   └── supplement.json   人工补录：快照缺失但已核实的卡（带来源与警示标注）
└── scripts/
    └── fetch_data.py     重新拉取 howbazaar API、再生成 data/*.json
```

## 如何更新

### 改攻略内容（流派 / 路线 / 梯队 / 文案）

只改 `js/guide-data.js`。文件头部有完整字段说明；要点：

- `heroes[].builds[].cards[].en` 写卡牌**英文原名**（与 `data/*.json` 中一致），页面自动带出卡面图与真实效果；写不在数据库里的名字会自动降级成文字芯片并标注「未收录」。
- 自由文本条目（如「核心高品复制件」）用 `label` 字段代替 `en`。
- 每个流派可加 `sources: [{name, url}]` 标注出处，`featured: true` 高亮推荐。
- 也可以把新赛季补丁说明丢给 AI，让它只输出更新后的 `GUIDE_DATA`，整体替换即可。

### 刷新卡面数据

```bash
python3 scripts/fetch_data.py   # 仅标准库，重写 data/all_items.json 与 all_skills.json
```

### 补录缺失卡

`data/supplement.json` 用于收录上游快照没有的卡（条目格式与 `all_items.json` 对齐，可省略 `images`）。**只收录效果文本有可靠来源的卡**，并填写 `communityNote` 与 `sourceUrl`——页面会显著标注「社区数据，以游戏内为准」。

## 数据来源与已知局限（重要）

| 事项 | 说明 |
| --- | --- |
| 卡面数据源 | [howbazaar.gg](https://www.howbazaar.gg) API（`/api/items`、`/api/skills`），上游为官方 CDN cards.json |
| 快照滞后 | howbazaar 未完全同步 S15（Patch 15.x）改动：已确认 Rifle（现 2s 冷却/成长减半）、Railgun（已解任务锁、+2 Multicast）、Spice Rack（重做为灼烧增幅）等与快照不符。**冲突处一律以游戏内为准**，攻略文本里已按 S15 实况书写并标注 |
| Karnok DLC | howbazaar 数据源未收录 Karnok 物品/技能（仅 Jerky 一件）。攻略页 Karnok 卡片多为文字芯片；Waystones、Dual Reaver 已按 [bazaardb.gg](https://bazaardb.gg) 数据补录于 supplement.json |
| 卡面图片 | 热链自 howbazaar.gg（主源，已验证可访问）；mobalytics CDN 作为浏览器端备用源 |
| 攻略出处 | [Mobalytics S15 Meta Builds](https://mobalytics.gg/the-bazaar/guides/meta-builds)、[Kripparrian 构筑](https://mobalytics.gg/the-bazaar/kripparrian)、[bazaar-builds.net 10 胜构筑库](https://bazaar-builds.net/) 等，正文与各流派卡均带链接 |

## 版权声明

玩家自制内容，与 Tempo / The Bazaar 官方无关。卡面图片与卡牌数据版权归 Tempo 所有，本站仅作攻略检索用途；如有侵权请提 issue 移除。
