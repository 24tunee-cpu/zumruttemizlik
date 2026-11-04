import csv
from pathlib import Path

root = Path(__file__).resolve().parents[1]
g2 = root / "gsc csv 2"
sorgular = g2 / "Sorgular.csv"
sayfa = next(g2.glob("Sayfa*.csv"), None)


def num(x):
    try:
        return float(str(x).replace("%", "").replace(",", ".").strip() or 0)
    except Exception:
        return 0.0


if sorgular.exists():
    with sorgular.open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    keys = list(rows[0].keys())
    qk = keys[0]
    ck = next(k for k in keys if "klama" in k.lower() or "click" in k.lower())
    ik = next(k for k in keys if "sterim" in k.lower() or "impression" in k.lower())
    pk = next(k for k in keys if "poz" in k.lower() or "position" in k.lower())
    scored = []
    for row in rows:
        clicks, impr, pos = num(row[ck]), num(row[ik]), num(row[pk])
        ctr = clicks / impr if impr else 0
        scored.append((impr, clicks, ctr, pos, row[qk]))
    scored.sort(reverse=True)
    print("=== TOP QUERIES ===")
    for s in scored[:15]:
        print(f"impr={s[0]:.0f} clk={s[1]:.0f} ctr={s[2]*100:.2f}% pos={s[3]:.1f} | {s[4]}")
    gaps = [s for s in scored if s[0] >= 20 and 0 < s[3] <= 20 and s[2] < 0.04]
    gaps.sort(key=lambda x: x[0] * (0.05 - min(x[2], 0.05)), reverse=True)
    print("=== CTR GAPS ===")
    for s in gaps[:15]:
        print(f"impr={s[0]:.0f} ctr={s[2]*100:.2f}% pos={s[3]:.1f} | {s[4]}")

if sayfa and sayfa.exists():
    with sayfa.open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    keys = list(rows[0].keys())
    uk, ck, ik = keys[0], keys[1], keys[2]
    for k in keys:
        if "klama" in k.lower() or "click" in k.lower():
            ck = k
        if "sterim" in k.lower() or "impression" in k.lower():
            ik = k
    pages = [(num(r[ck]), num(r[ik]), r[uk]) for r in rows]
    pages.sort(reverse=True)
    money = sum(
        c
        for c, _, u in pages
        if any(x in (u or "") for x in ["/bolgeler/", "/hizmetler/", "/cozumler/", "/randevu", "/fiyat"])
    )
    blog = sum(c for c, _, u in pages if "/blog/" in (u or ""))
    print(f"=== PAGES money_clicks={money:.0f} blog_clicks={blog:.0f} ===")
    for c, i, u in pages[:12]:
        print(f"clk={c:.0f} impr={i:.0f} | {u}")
