#!/usr/bin/env python3
"""重新拉取 howbazaar API，生成 data/all_items.json 与 data/all_skills.json。

用法：
    python3 scripts/fetch_data.py

仅依赖标准库。输出格式与仓库中现有快照保持一致：
{ "meta": {...}, "data": [...] }，每条记录追加 images 字段。

注意：howbazaar 的数据可能滞后于游戏最新热修（例如 S15 部分改动），
脚本只负责同步上游，不做内容修正；data/supplement.json 中人工补录的
卡（Karnok DLC、极新物品）不受本脚本影响。
"""
import json
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ITEMS_API = "https://www.howbazaar.gg/api/items"
SKILLS_API = "https://www.howbazaar.gg/api/skills"
UPSTREAM = "https://cdn.playthebazaar.com/bazaardesigndataprod/cards.json"
ITEM_IMG = "https://www.howbazaar.gg/images/items/{id}.avif"
ITEM_IMG_MOBA = "https://cdn.mobalytics.gg/assets/bazaar/images/cards_guid/{id}.avif"
SKILL_IMG = "https://www.howbazaar.gg/images/skills/{id}.avif"

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "data"


def fetch(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (bazaar-tips data refresh)"})
    with urllib.request.urlopen(req, timeout=60) as res:
        return json.loads(res.read().decode("utf-8"))


def with_images(records, kind: str):
    out = []
    for r in records:
        r = dict(r)
        if kind == "item":
            r["images"] = {
                "howbazaar": ITEM_IMG.format(id=r["id"]),
                "mobalytics": ITEM_IMG_MOBA.format(id=r["id"]),
            }
        else:
            r["images"] = {"howbazaar": SKILL_IMG.format(id=r["id"])}
        out.append(r)
    return out


def per_hero_counts(items, skills):
    counts = {}
    for rec_list, key in ((items, "items"), (skills, "skills")):
        for r in rec_list:
            for h in r.get("heroes", []):
                counts.setdefault(h, {"items": 0, "skills": 0})
                counts[h][key] += 1
    return counts


def build_meta(items, skills, api_version, scope: str):
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z"),
        "mode": "live-api",
        "source": {
            "items_api": ITEMS_API,
            "skills_api": SKILLS_API,
            "upstream": UPSTREAM,
            "api_data_version": api_version,
        },
        "image_url_patterns": {
            "item": f"{ITEM_IMG.replace('{id}', '{id}')} | {ITEM_IMG_MOBA.replace('{id}', '{id}')}",
            "skill": SKILL_IMG,
        },
        "totals": {"items": len(items), "skills": len(skills)},
        "per_hero": per_hero_counts(items, skills),
        "schema_note": "记录字段与 howbazaar /api/items|/api/skills 完全一致（id,name,heroes,size,startingTier,tags,hiddenTags,customTags,tiers,unifiedTooltips,enchantments,quests,combatEncounters,artKey），仅追加 images 字段。",
        "scope": scope,
    }


def main():
    print(f"fetching {ITEMS_API} ...", file=sys.stderr)
    items_raw = fetch(ITEMS_API)
    print(f"fetching {SKILLS_API} ...", file=sys.stderr)
    skills_raw = fetch(SKILLS_API)

    api_version = None
    if isinstance(items_raw, dict):
        api_version = items_raw.get("version")
        items = items_raw.get("data", [])
    else:
        items = items_raw
    skills = skills_raw.get("data", []) if isinstance(skills_raw, dict) else skills_raw

    items = with_images(items, "item")
    skills = with_images(skills, "skill")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for fname, data, scope in (
        ("all_items.json", items, "all_items"),
        ("all_skills.json", skills, "all_skills"),
    ):
        payload = {"meta": build_meta(items, skills, api_version, scope), "data": data}
        path = OUT_DIR / fname
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"wrote {path}  ({len(data)} records)", file=sys.stderr)

    print("done. 提示：上游可能滞后于游戏内最新热修，攻略文本中的版本差异说明见 README。", file=sys.stderr)


if __name__ == "__main__":
    main()
