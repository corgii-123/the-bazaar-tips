/* ════════════════════════════════════════════════════════════════════
   app.js — 渲染层
   读取 window.GUIDE_DATA（攻略内容）与 window.CardDB（卡牌数据），
   渲染：总览 / 各英雄攻略页 / 卡牌图鉴 / 悬浮卡面 / 卡牌详情弹窗。
   攻略卡片芯片通过英文名自动关联数据库：有数据 → 缩略图+悬浮真实
   效果文本+点击详情；无数据（如 Karnok DLC）→ 文字芯片优雅降级。
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const DATA = window.GUIDE_DATA;
  const DB = window.CardDB;

  const ROLE_NAMES = { core: "核心", engine: "引擎", filler: "过渡", tech: "反制", skill: "技能" };
  const ROLE_COLORS = { core: "var(--legend)", engine: "var(--gold)", filler: "var(--bronze)", tech: "var(--diamond)", skill: "var(--ok)" };
  const TIER_CN = { Bronze: "青铜", Silver: "白银", Gold: "黄金", Diamond: "钻石", Legendary: "传说" };
  const SIZE_CN = { Small: "小型", Medium: "中型", Large: "大型" };
  const HERO_CN = { Vanessa: "瓦妮莎", Pygmalien: "皮格马利安", Dooley: "杜利", Mak: "马克", Stelle: "斯黛拉", Jules: "朱尔斯", Karnok: "卡诺克", Common: "通用" };

  const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const rich = s => esc(s).replace(/&lt;b&gt;/g, "<b>").replace(/&lt;\/b&gt;/g, "</b>");

  let currentPage = "overview";

  /* ── 卡片查找与图片 ── */
  function lookup(entry) {
    if (!entry || !entry.en) return null;
    return DB.find(entry.en, entry.role === "skill" ? "skill" : "item");
  }
  function imgTag(card, cls) {
    const urls = DB.imageUrls(card);
    if (!urls.length) return null;
    const fallback = urls.length > 1
      ? `this.onerror=function(){this.replaceWith(phEl(this.dataset.n))};this.src='${esc(urls[1])}'`
      : `this.replaceWith(phEl(this.dataset.n))`;
    return `<img class="${cls}" loading="lazy" alt="${esc(card.name)}" data-n="${esc(card.name)}" src="${esc(urls[0])}" onerror="${fallback}">`;
  }
  // 图片彻底失败时的占位块（onerror 内联调用，挂到 window）
  window.phEl = function (name) {
    const d = document.createElement("div");
    d.className = "thumb ph";
    d.textContent = (name || "?").slice(0, 1).toUpperCase();
    return d;
  };

  /* ── 攻略卡片芯片 ── */
  function cardChip(c) {
    const card = lookup(c);
    const name = c.en || c.label || "";
    const role = ROLE_NAMES[c.role] || "过渡";
    if (!card) {
      // 数据库查不到：纯文字芯片（自由文本 label，或 DLC 缺数据卡）
      const dlc = c.en ? `<span class="dlc">未收录</span>` : "";
      return `<div class="card nodata r-${c.role || "filler"}">
        <div class="thumb ph">${esc((name).slice(0, 1).toUpperCase())}</div>
        <div class="cname">${esc(name)}${dlc}</div>
        <div class="role">${role}</div>
        <div class="cn">${esc(c.cn || "")}</div></div>`;
    }
    const tdot = `<span class="tdot ${esc(card.startingTier)}" title="${TIER_CN[card.startingTier] || ""}起"></span>`;
    const comm = card.communityData ? `<span class="dlc">社区数据</span>` : "";
    const img = imgTag(card, "thumb") || `<div class="thumb ph">${esc(card.name.slice(0, 1))}</div>`;
    return `<div class="card r-${c.role || "filler"}" data-card="${esc(card.name)}" data-kind="${esc(card.kind)}" tabindex="0">
      ${img}
      <div class="cname">${tdot}${esc(card.name)}${comm}</div>
      <div class="role">${role}</div>
      <div class="cn">${esc(c.cn || "")}</div></div>`;
  }

  function pips(n) { let h = ""; for (let i = 1; i <= 5; i++) h += `<span class="pip${i <= n ? " on" : ""}"></span>`; return `<span class="pips">${h}</span>`; }

  /* ── 英雄页 ── */
  function renderHero(h) {
    const builds = h.builds.map(b => {
      const strip = b.cards.map(c => {
        const card = lookup(c);
        if (!card) return "";
        const t = imgTag(card, "");
        return t ? `<span data-card="${esc(card.name)}" data-kind="${esc(card.kind)}">${t}</span>` : "";
      }).filter(Boolean).join("");
      const srcs = (b.sources || []).map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join("");
      return `
    <article class="build${b.featured ? " featured" : ""}">
      <div class="bt"><h3>${esc(b.name)}</h3><span class="btier">${esc(b.tier)}</span></div>
      <div class="onset">⏱ ${esc(b.onset)}</div>
      <p class="desc">${rich(b.desc)}</p>
      ${strip ? `<div class="strip">${strip}</div>` : ""}
      <div class="cards">${b.cards.map(cardChip).join("")}</div>
      <div class="bounds">
        <div class="b up"><b>上限</b>${esc(b.ceiling)}</div>
        <div class="b down"><b>下限</b>${esc(b.floor)}</div>
      </div>
      ${srcs ? `<div class="srcs">来源：${srcs}</div>` : ""}
    </article>`;
    }).join("");

    const phases = h.phases.map(p => `
    <article class="phase ${p.key}">
      <header><span class="pname">${esc(p.name)}</span><span class="pdays">${esc(p.days)}</span></header>
      <div class="grid">
        <div class="cell"><div class="ct">路线目标 GOALS</div>
          <ul class="plain">${p.goals.map(g => `<li>${rich(g)}</li>`).join("")}</ul></div>
        <div class="cell"><div class="ct">进店顺序 SHOP ORDER</div>
          <ol class="shops">${p.shops.map(s => `<li>${esc(s.s)}<span class="why">${esc(s.why)}</span></li>`).join("")}</ol></div>
        <div class="cell full"><div class="ct">抓牌顺序 PICK PRIORITY（从上到下）</div>
          <div class="cards">${p.picks.map(cardChip).join("")}</div></div>
        ${p.tips?.length ? `<div class="cell full"><div class="ct">注意点 NOTES</div>
          <ul class="plain">${p.tips.map(t => `<li class="sub">${rich(t)}</li>`).join("")}</ul></div>` : ""}
      </div>
    </article>`).join("");

    return `
  <div style="--hue:${h.hue}">
    <div class="hero-head">
      <div class="row">
        <span class="hero-name">${esc(h.cn)}<span class="en">${esc(h.en)}</span></span>
        <span class="hero-nick">${esc(h.nick)}</span>
      </div>
      <div class="hero-tags">${esc(h.tagline)}</div>
      <div class="stat-row">
        <div class="stat"><div class="k">梯队 TIER</div><div class="v tier">${esc(h.tier)}</div></div>
        <div class="stat"><div class="k">上手难度</div><div class="v">${pips(h.difficulty)}</div></div>
      </div>
      <div class="s15-note"><b>S15 变动</b> · ${rich(h.s15)}</div>
    </div>

    <h2>主流流派 <span class="en">META BUILDS · S15</span></h2>
    <div class="legend-roles">
      <span><i style="background:${ROLE_COLORS.core}"></i>核心 CORE</span>
      <span><i style="background:${ROLE_COLORS.engine}"></i>引擎 ENGINE</span>
      <span><i style="background:${ROLE_COLORS.filler}"></i>过渡 FILLER</span>
      <span><i style="background:${ROLE_COLORS.tech}"></i>反制/工具 TECH</span>
      <span><i style="background:${ROLE_COLORS.skill}"></i>技能 SKILL</span>
    </div>
    <div class="builds">${builds}</div>

    <h2>分阶段运营 <span class="en">ROUTE BY PHASE</span></h2>
    <div class="rail">
      <div class="seg e">前期<span class="days">DAY 1–4 · 青铜</span></div>
      <div class="seg m">中期<span class="days">DAY 5–9 · 黄金</span></div>
      <div class="seg l">后期<span class="days">DAY 10+ · 钻石</span></div>
    </div>
    ${phases}

    <h2>职业上下限总评 <span class="en">CEILING / FLOOR</span></h2>
    <div class="hero-bounds">
      <div class="panel"><div class="ct">上限 CEILING</div>${esc(h.bounds.up)}</div>
      <div class="panel low"><div class="ct">下限 FLOOR</div>${esc(h.bounds.down)}</div>
    </div>
  </div>`;
  }

  /* ── 总览页 ── */
  function renderOverview(d) {
    const heroById = Object.fromEntries(d.heroes.map(h => [h.id, h]));
    const tiers = d.tiers.map(t => `
    <div class="tierrow">
      <div class="tl" style="background:${t.tier === "T0" ? "var(--legend)" : t.tier === "T1" ? "var(--gold)" : t.tier === "T1.5" ? "var(--silver)" : "var(--bronze)"}">${esc(t.tier)}</div>
      <div class="tr">
        ${t.heroes.map(id => { const h = heroById[id]; return h ? `<button class="hero-chip" data-goto="${h.id}"><span class="dot" style="background:${h.hue}"></span>${esc(h.cn)} · ${esc(h.nick)}</button>` : ""; }).join("")}
        <span style="color:var(--dim);font-size:12.5px;align-self:center">${esc(t.note)}</span>
      </div>
    </div>`).join("");

    const blocks = d.general.blocks.map(b => `
    <div class="panel" style="margin-top:14px"><h3>${esc(b.title)}</h3>
      <ul class="plain">${b.items.map(i => `<li>${rich(i)}</li>`).join("")}</ul></div>`).join("");

    const log = d.meta.changelog.map(c => `<tr><td class="mono">${esc(c.date)}</td><td>${esc(c.text)}</td></tr>`).join("");

    const dbMeta = DB.state.meta || {};
    const totals = dbMeta.totals || {};
    return `
    <h2 style="margin-top:6px">赛季速览 <span class="en">SEASON ${esc(d.meta.season)} OVERVIEW</span></h2>
    <p class="lead">${esc(d.general.intro)}</p>
    <h2>职业梯队（赛季参考，热修后会变）<span class="en">TIER LIST</span></h2>
    <div class="tierlist">${tiers}</div>
    <h2>通用运营 <span class="en">FUNDAMENTALS</span></h2>
    ${blocks}

    <h2>数据与可信度 <span class="en">DATA &amp; CONFIDENCE</span></h2>
    <div class="panel">
      <ul class="plain">
        <li>攻略文本：${esc(d.meta.confidence)}。</li>
        <li>卡面数据：本站全部卡片效果直接渲染自 <code class="k">data/all_items.json</code>（${esc(totals.items ?? "?")} 物品）与 <code class="k">data/all_skills.json</code>（${esc(totals.skills ?? "?")} 技能），快照时间 ${esc((dbMeta.generated_at || "").slice(0, 10) || "未知")}。</li>
        <li class="sub">${esc(d.meta.dataNote)}</li>
        <li class="sub">更新攻略内容改 <code class="k">js/guide-data.js</code>；刷新卡面数据跑 <code class="k">python3 scripts/fetch_data.py</code>，详见仓库 README。</li>
      </ul>
    </div>

    <h2>更新日志 <span class="en">CHANGELOG</span></h2>
    <table><thead><tr><th style="width:130px">日期</th><th>内容</th></tr></thead><tbody>${log}</tbody></table>`;
  }

  /* ── 卡牌图鉴 ── */
  const dbState = { q: "", kind: "", hero: "", tier: "", size: "", limit: 240 };
  function renderDbPage() {
    const heroOpts = ["Vanessa", "Pygmalien", "Dooley", "Mak", "Jules", "Stelle", "Karnok", "Common"]
      .map(x => `<option value="${x}" ${dbState.hero === x ? "selected" : ""}>${HERO_CN[x] || x} ${x}</option>`).join("");
    return `
    <h2 style="margin-top:6px">卡牌图鉴 <span class="en">CARD DATABASE</span></h2>
    <p class="lead">全部物品与技能数据，支持名称 / 效果文本检索。点击卡片查看各品阶完整数值、附魔与任务。卡面文本为数据快照，最新热修以游戏内为准。</p>
    <div class="dbbar">
      <input type="search" id="dbq" placeholder="搜索英文名 / 效果关键词，如 Ammo、Burn、Pistol…" value="${esc(dbState.q)}">
      <select id="dbkind">
        <option value="">物品+技能</option>
        <option value="item" ${dbState.kind === "item" ? "selected" : ""}>仅物品</option>
        <option value="skill" ${dbState.kind === "skill" ? "selected" : ""}>仅技能</option>
      </select>
      <select id="dbhero"><option value="">全部英雄</option>${heroOpts}</select>
      <select id="dbtier">
        <option value="">全部品阶</option>
        ${["Bronze", "Silver", "Gold", "Diamond", "Legendary"].map(t => `<option value="${t}" ${dbState.tier === t ? "selected" : ""}>${TIER_CN[t]} ${t}</option>`).join("")}
      </select>
      <select id="dbsize">
        <option value="">全部体型</option>
        ${["Small", "Medium", "Large"].map(t => `<option value="${t}" ${dbState.size === t ? "selected" : ""}>${SIZE_CN[t]} ${t}</option>`).join("")}
      </select>
      <span class="count" id="dbcount"></span>
    </div>
    <div class="dbgrid" id="dbgrid"></div>
    <button class="hero-chip dbmore" id="dbmore" style="display:none">显示全部结果</button>`;
  }

  function renderDbGrid() {
    const grid = document.getElementById("dbgrid");
    if (!grid) return;
    const res = DB.search(dbState.q, dbState);
    const slice = res.slice(0, dbState.limit);
    grid.innerHTML = slice.map(c => {
      const img = imgTag(c, "");
      return `<div class="dbcard" data-card="${esc(c.name)}" data-kind="${esc(c.kind)}" tabindex="0">
        <div class="imgbox"><span class="kindtag">${c.kind === "skill" ? "技能" : "物品"}</span>${img || `<span class="ph">${esc(c.name.slice(0, 1))}</span>`}</div>
        <div class="nm"><span class="tdot ${esc(c.startingTier)}"></span>${esc(c.name)}</div>
      </div>`;
    }).join("");
    const count = document.getElementById("dbcount");
    if (count) count.textContent = `${res.length} 张${res.length > slice.length ? `（已显示前 ${slice.length}）` : ""}`;
    const more = document.getElementById("dbmore");
    if (more) more.style.display = res.length > slice.length ? "block" : "none";
  }

  function bindDbPage() {
    const q = document.getElementById("dbq");
    if (!q) return;
    q.addEventListener("input", () => { dbState.q = q.value; dbState.limit = 240; renderDbGrid(); });
    for (const [id, key] of [["dbkind", "kind"], ["dbhero", "hero"], ["dbtier", "tier"], ["dbsize", "size"]]) {
      const el = document.getElementById(id);
      el.addEventListener("change", () => { dbState[key] = el.value; dbState.limit = 240; renderDbGrid(); });
    }
    document.getElementById("dbmore").addEventListener("click", () => { dbState.limit = Infinity; renderDbGrid(); });
    renderDbGrid();
  }

  /* ── 悬浮卡面 ── */
  const tip = () => document.getElementById("cardTip");
  function showTip(card, x, y) {
    const t = tip();
    const tier = card.startingTier ? `${TIER_CN[card.startingTier] || ""}起` : "";
    const size = card.kind === "item" && card.size ? ` · ${SIZE_CN[card.size] || card.size}` : "";
    const hs = (card.heroes || []).map(h => HERO_CN[h] || h).join("/");
    const img = imgTag(card, "");
    t.innerHTML = `
      <div class="tt-head">${img || ""}<div>
        <div class="tt-name">${esc(card.name)}</div>
        <div class="tt-meta">${esc(tier)}${esc(size)}${hs ? " · " + esc(hs) : ""}${card.kind === "skill" ? " · 技能" : ""}</div>
      </div></div>
      <ul>${(card.unifiedTooltips || []).map(s => `<li>${esc(s)}</li>`).join("") || `<li class="dim">（无效果文本）</li>`}</ul>
      ${card.communityData ? `<div class="warnline">⚠ ${esc(card.communityNote || "效果摘自社区数据库，以游戏内为准")}</div>` : ""}
      <div class="tt-foot">点击查看品阶数值与附魔 →</div>`;
    t.style.display = "block";
    const rect = t.getBoundingClientRect();
    let left = x + 16, top = y + 14;
    if (left + rect.width > innerWidth - 12) left = x - rect.width - 16;
    if (top + rect.height > innerHeight - 12) top = innerHeight - rect.height - 12;
    t.style.left = Math.max(8, left) + "px";
    t.style.top = Math.max(8, top) + "px";
  }
  function hideTip() { const t = tip(); if (t) t.style.display = "none"; }

  /* ── 卡牌详情弹窗 ── */
  function openModal(card) {
    const root = document.getElementById("modalRoot");
    const tiersHtml = Object.entries(card.tiers || {})
      .filter(([, v]) => v && v.tooltips && v.tooltips.length)
      .map(([tn, v]) => `<div class="md-tier t-${esc(tn)}"><div class="tn">${esc(TIER_CN[tn] || tn)} ${esc(tn)}</div>
        <ul>${v.tooltips.map(s => `<li>${esc(s)}</li>`).join("")}</ul></div>`).join("");
    const ench = (card.enchantments || []).map(e =>
      `<div class="e"><span class="en">${esc(e.type)}</span><span class="tx">${esc((e.tooltips || []).join(" "))}</span></div>`).join("");
    const quests = (card.quests || []).flatMap(q => q.entries || []).map(q =>
      `<li>${esc((q.tooltips || []).join(" "))}</li>`).join("");
    const img = imgTag(card, "");
    const hs = (card.heroes || []).map(h => `<span class="md-chip">${esc(HERO_CN[h] || h)} ${esc(h)}</span>`).join("");
    const tags = (card.tags || []).map(t => `<span class="md-chip">${esc(t)}</span>`).join("");

    root.querySelector(".box .inner").innerHTML = `
      <div class="md-head">
        ${img || `<div class="ph">${esc(card.name.slice(0, 1))}</div>`}
        <div>
          <div class="md-name">${esc(card.name)}</div>
          <div class="md-chips">
            <span class="md-chip t-${esc(card.startingTier)}">${esc(TIER_CN[card.startingTier] || "")}起 ${esc(card.startingTier || "")}</span>
            ${card.size ? `<span class="md-chip">${esc(SIZE_CN[card.size] || card.size)}</span>` : ""}
            <span class="md-chip">${card.kind === "skill" ? "技能 SKILL" : "物品 ITEM"}</span>
            ${hs}${tags}
          </div>
        </div>
      </div>
      ${card.communityData ? `<div class="md-warn">⚠ ${esc(card.communityNote || "本卡未被数据快照收录，效果文本摘自社区数据库，以游戏内为准。")}${card.sourceUrl ? ` <a href="${esc(card.sourceUrl)}" target="_blank" rel="noopener">来源</a>` : ""}</div>` : ""}
      ${tiersHtml ? `<div class="md-sec"><div class="ct">各品阶效果 TIERS</div><div class="md-tiers">${tiersHtml}</div></div>`
        : `<div class="md-sec"><div class="ct">效果 EFFECTS</div><div class="md-tiers"><div class="md-tier"><ul>${(card.unifiedTooltips || []).map(s => `<li>${esc(s)}</li>`).join("")}</ul></div></div></div>`}
      ${quests ? `<div class="md-sec"><div class="ct">任务 QUEST</div><ul class="plain">${quests}</ul></div>` : ""}
      ${ench ? `<div class="md-sec"><div class="ct">附魔 ENCHANTMENTS</div><div class="md-ench">${ench}</div></div>` : ""}
      ${card.communityData ? "" : `<div class="md-srcline">数据快照：howbazaar API · 最新热修以游戏内为准</div>`}`;
    root.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    document.getElementById("modalRoot").classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ── 全局交互（事件委托）── */
  function bindGlobal() {
    document.addEventListener("mouseover", e => {
      const el = e.target.closest("[data-card]");
      if (!el) { hideTip(); return; }
      const card = DB.find(el.dataset.card, el.dataset.kind === "skill" ? "skill" : "item");
      if (card) showTip(card, e.clientX, e.clientY);
    });
    document.addEventListener("mousemove", e => {
      const t = tip();
      if (t && t.style.display === "block") {
        const el = e.target.closest("[data-card]");
        if (!el) hideTip();
      }
    });
    document.addEventListener("click", e => {
      const el = e.target.closest("[data-card]");
      if (el) {
        const card = DB.find(el.dataset.card, el.dataset.kind === "skill" ? "skill" : "item");
        if (card) { hideTip(); openModal(card); }
        return;
      }
      if (e.target.closest("#modalRoot .mask") || e.target.closest("#modalRoot .close")) closeModal();
      const goto = e.target.closest("[data-goto]");
      if (goto) go(goto.dataset.goto);
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeModal();
      if (e.key === "Enter") {
        const el = e.target.closest && e.target.closest("[data-card]");
        if (el) { const card = DB.find(el.dataset.card, el.dataset.kind === "skill" ? "skill" : "item"); if (card) openModal(card); }
      }
    });
  }

  /* ── 骨架与路由 ── */
  function build() {
    const tabBar = document.getElementById("tabBar");
    const content = document.getElementById("content");
    const tabs = [{ id: "overview", label: "总览", nick: DATA.meta.season, hue: "var(--brass)" }]
      .concat(DATA.heroes.map(h => ({ id: h.id, label: h.cn, nick: h.nick, hue: h.hue })))
      .concat([{ id: "db", label: "卡牌图鉴", nick: "DB", hue: "var(--diamond)" }]);

    tabBar.innerHTML = tabs.map(t =>
      `<button class="tab${t.id === currentPage ? " active" : ""}" data-page="${t.id}" style="--hue:${t.hue}">
       <span class="dot"></span>${esc(t.label)}<span class="nick">${esc(t.nick)}</span></button>`).join("");

    content.innerHTML =
      `<section class="page${currentPage === "overview" ? " active" : ""}" id="pg-overview">${renderOverview(DATA)}</section>` +
      DATA.heroes.map(h => `<section class="page${currentPage === h.id ? " active" : ""}" id="pg-${h.id}">${renderHero(h)}</section>`).join("") +
      `<section class="page${currentPage === "db" ? " active" : ""}" id="pg-db">${renderDbPage()}</section>`;

    const dbMeta = DB.state.meta || {};
    document.getElementById("metaBadges").innerHTML =
      `<span class="badge">SEASON ${esc(DATA.meta.season)}</span>
     <span class="badge soft">攻略基准 ${esc(DATA.meta.dataDate)}</span>
     <span class="badge soft">卡面快照 ${esc((dbMeta.generated_at || "").slice(0, 10) || "?")} · ${esc(dbMeta.totals?.items ?? "?")} 物品 / ${esc(dbMeta.totals?.skills ?? "?")} 技能</span>
     <span class="badge soft">v${esc(DATA.meta.siteVersion)}</span>`;

    document.getElementById("footSrc").innerHTML = "数据来源：" +
      DATA.meta.sources.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join(" · ");

    tabBar.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => go(b.dataset.page)));
    bindDbPage();
  }

  function go(id, skipHash) {
    currentPage = id;
    document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.page === id));
    document.querySelectorAll("section.page").forEach(s => s.classList.toggle("active", s.id === "pg-" + id));
    if (!skipHash) location.hash = id === "overview" ? "" : "#/" + id;
    window.scrollTo({ top: 0 });
  }

  function initFromHash() {
    const m = location.hash.match(/^#\/(.+)$/);
    if (m) {
      const id = m[1];
      if (id === "db" || DATA.heroes.some(h => h.id === id)) { go(id, true); }
    }
  }
  window.addEventListener("hashchange", initFromHash);

  /* ── 启动 ── */
  async function boot() {
    const loadEl = document.getElementById("loadState");
    try {
      await DB.load();
    } catch (err) {
      const isFile = location.protocol === "file:";
      loadEl.innerHTML = `<div class="err">
        <b>卡牌数据加载失败</b>（${esc(err.message)}）<br><br>
        ${isFile ? `浏览器不允许从 <code class="k">file://</code> 直接读取 JSON。请在项目目录启动一个本地服务器后访问：
        <code>python3 -m http.server 8000</code>
        然后打开 <a href="http://localhost:8000">http://localhost:8000</a>。也可以使用 <code>npx serve</code> 或任意静态服务器。`
        : `请检查 <code class="k">data/all_items.json</code> 等数据文件是否存在、路径是否正确。`}
      </div>`;
      return;
    }
    loadEl.remove();
    build();
    bindGlobal();
    initFromHash();
  }
  boot();
})();
