/* ════════════════════════════════════════════════════════════════════
   card-db.js — 卡牌数据层
   加载 data/all_items.json + data/all_skills.json + data/supplement.json，
   建立名称索引，向渲染层（app.js）提供查找 / 搜索 / 图片地址。
   攻略文本（js/guide-data.js）通过卡牌英文名引用这里的数据。
   ════════════════════════════════════════════════════════════════════ */
window.CardDB = (function () {
  const state = {
    loaded: false,
    meta: null,            // all_items.json 的 meta（快照时间、来源、计数）
    items: [],
    skills: [],
    supplement: [],
    itemsByName: new Map(),
    skillsByName: new Map(),
    suppByName: new Map(),
  };

  async function fetchJson(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
    return res.json();
  }

  async function load() {
    const [items, skills, supp] = await Promise.all([
      fetchJson("data/all_items.json"),
      fetchJson("data/all_skills.json"),
      // 补充数据缺失不阻塞整站
      fetchJson("data/supplement.json").catch(() => ({ data: [] })),
    ]);
    state.meta = items.meta || null;
    state.items = (items.data || []).map(c => ({ ...c, kind: "item" }));
    state.skills = (skills.data || []).map(c => ({ ...c, kind: "skill" }));
    state.supplement = (supp.data || []).map(c => ({ ...c, kind: c.kind || "item", communityData: true }));
    for (const c of state.items) state.itemsByName.set(c.name.toLowerCase(), c);
    for (const c of state.skills) state.skillsByName.set(c.name.toLowerCase(), c);
    for (const c of state.supplement) state.suppByName.set(c.name.toLowerCase(), c);
    state.loaded = true;
    return state;
  }

  /* 按名称查卡。kindHint 为 'skill' 时优先查技能表，否则优先物品表；
     最后回落到社区补充数据（howbazaar 快照缺失的卡）。 */
  function find(name, kindHint) {
    if (!name) return null;
    const k = name.toLowerCase();
    const order = kindHint === "skill"
      ? [state.skillsByName, state.itemsByName, state.suppByName]
      : [state.itemsByName, state.skillsByName, state.suppByName];
    for (const m of order) { const hit = m.get(k); if (hit) return hit; }
    return null;
  }

  /* 卡面图地址（按可用性排序）。howbazaar 为主源；
     mobalytics CDN 偶尔有防盗链，仅作浏览器端备用。 */
  function imageUrls(card) {
    if (!card) return [];
    const urls = [];
    if (card.images && card.images.howbazaar) urls.push(card.images.howbazaar);
    else if (card.id) urls.push(`https://www.howbazaar.gg/images/${card.kind === "skill" ? "skills" : "items"}/${card.id}.avif`);
    if (card.images && card.images.mobalytics) urls.push(card.images.mobalytics);
    return urls;
  }

  /* 图鉴搜索。q 匹配名称与效果文本；filters: {kind, hero, tier, size} */
  function search(q, filters) {
    const f = filters || {};
    let pool;
    if (f.kind === "item") pool = state.items.concat(state.supplement.filter(c => c.kind === "item"));
    else if (f.kind === "skill") pool = state.skills.concat(state.supplement.filter(c => c.kind === "skill"));
    else pool = state.items.concat(state.skills, state.supplement);

    const needle = (q || "").trim().toLowerCase();
    return pool.filter(c => {
      if (f.hero && !(c.heroes || []).includes(f.hero)) return false;
      if (f.tier && c.startingTier !== f.tier) return false;
      if (f.size && c.size !== f.size) return false;
      if (needle) {
        const hay = (c.name + " " + (c.unifiedTooltips || []).join(" ") + " " + (c.tags || []).join(" ")).toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }

  function heroes() {
    const s = new Set();
    for (const c of state.items.concat(state.skills, state.supplement)) (c.heroes || []).forEach(h => s.add(h));
    return [...s].sort();
  }

  return { load, find, imageUrls, search, heroes, state };
})();
