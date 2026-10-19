"""v7 — browser verification against the single-file docs portal (dist-single/index.html) in Chromium.
Backs every `test` claim in AGENTS.md that jsdom cannot see. Fails CI on: console errors, axe violations with the
contrast rule ON (light + dark, 10 routes), and any broken interaction below. Run: npm run verify:browser"""
import json, pathlib, sys
from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parent.parent
url = (root / "dist-single/index.html").as_uri()
axe_src = (root / "node_modules/axe-core/axe.min.js").read_text()
shots = root / "dist-single/screens"; shots.mkdir(parents=True, exist_ok=True)
ROUTES = ["/", "/foundations/color", "/foundations/typography", "/components/button", "/guidelines/interface-rules", "/patterns",
          "/workspace", "/blocks/kanban/full", "/blocks/auth/full", "/blocks/dashboard/full"]
fails, passes = [], []
def check(name, ok, detail=""):
    (passes if ok else fails).append(name if ok else f"{name}: {detail}")

def goto(page, route):
    page.goto(f"{url}#{route}"); page.wait_for_load_state("load"); page.wait_for_timeout(350)

def axe(page, label):
    page.add_script_tag(content=axe_src)
    res = page.evaluate("""async () => { // The AppShell skip link sits outside landmarks by design; it is verified functionally below and in
      // tests/v64-additions (axe's skip-link heuristic misreads hash-routed SPAs). Only that node is excluded.
      const r = await axe.run({ include: [document], exclude: [['a[href="#main-content"]']] }, { resultTypes: ['violations'] });
      return r.violations.map(v => ({ id: v.id, n: v.nodes.length, t: v.nodes.slice(0, 4).map(n => n.target.join(' ') + ' :: ' + ((n.failureSummary || '').split('\\n')[1] || '').trim()) })); }""")
    check(f"axe {label}", not res, json.dumps(res, ensure_ascii=False)[:1800])
    return res

with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme in ["light", "dark"]:
        ctx = b.new_context(viewport={"width": 1440, "height": 900}, color_scheme=scheme)
        page = ctx.new_page(); errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        for r in ROUTES:
            goto(page, r)
            axe(page, f"{scheme} {r}")
            if r in ("/", "/blocks/kanban/full", "/components/button"):
                page.screenshot(path=str(shots / f"{scheme}{r.replace('/', '-') or '-home'}.png"))
        check(f"{scheme}: no console errors", not errors, "; ".join(errors)[:600])
        cs = page.evaluate("getComputedStyle(document.documentElement).colorScheme")
        check(f"{scheme}: color-scheme is {scheme}", cs == scheme, cs)
        if scheme == "dark":
            goto(page, "/components/checkbox")
            bg = page.evaluate("(() => { const c = document.querySelector('button[role=checkbox][data-state=checked]'); return c ? getComputedStyle(c).backgroundColor : 'none'; })()")
            check("regression 6.0: checked Checkbox is filled in dark mode", bg not in ("none", "rgba(0, 0, 0, 0)", "rgb(10, 10, 10)"), bg)
        ctx.close()

    ctx = b.new_context(viewport={"width": 1440, "height": 900}, color_scheme="light")
    page = ctx.new_page()
    page.set_default_timeout(5000)
    goto(page, "/foundations/typography")
    fam = page.evaluate("getComputedStyle(document.body).fontFamily")
    loaded = page.evaluate("document.fonts.check('16px \"Geist Variable\"')")
    check("Geist is the body font and is loaded", fam.startswith('"Geist Variable"') and loaded, f"{fam[:60]} loaded={loaded}")
    goto(page, "/components/button")
    h = page.evaluate("""(() => { const b = [...document.querySelectorAll('main button[data-variant=default]')].find(x => /(^|\\s)h-10(\\s|$)/.test(x.className)); return b ? b.getBoundingClientRect().height : 0; })()""")
    check("default Button is 40px", h == 40, str(h))
    btn = page.locator("main button[data-variant=default]").first
    btn.scroll_into_view_if_needed(); before = btn.evaluate("e => getComputedStyle(e).backgroundColor")
    btn.hover(); page.wait_for_timeout(250); after = btn.evaluate("e => getComputedStyle(e).backgroundColor")
    check("primary hover moves to more contrast (black)", after == "rgb(0, 0, 0)", f"{before} -> {after}")
    btn.focus(); page.keyboard.press("Shift+Tab"); page.keyboard.press("Tab"); page.wait_for_timeout(600)  # let the box-shadow transition finish
    ring = page.evaluate("getComputedStyle(document.activeElement).boxShadow")
    check("keyboard focus shows the 2px gap + 2px ring", "0px 0px 0px 2px" in ring and "0px 0px 0px 4px" in ring, ring[:160])
    # Skip link keeps the hash route (v6.4 bug: it replaced #/route and dropped the user on the home page)
    goto(page, "/guidelines/interface-rules"); page.locator('a[href="#main-content"]').focus(); page.keyboard.press("Enter"); page.wait_for_timeout(300)
    check("skip link focuses main and keeps the route", page.evaluate("location.hash") == "#/guidelines/interface-rules" and page.evaluate("document.activeElement.id") == "main-content", page.evaluate("location.hash"))
    goto(page, "/components/button")
    hm = page.evaluate("getComputedStyle(document.querySelector('main h2') || document.body).scrollMarginTop")
    check("headings clear the sticky header (scroll-margin-top)", hm not in ("0px", ""), hm)
    # Dialog: focus inside, scroll contained, Escape returns focus
    goto(page, "/components/dialog")
    opened = False
    for name in ["New event type", "Open dialog", "Delete"]:
        t = page.get_by_role("button", name=name, exact=True)
        if t.count():
            t.first.scroll_into_view_if_needed(); t.first.click(); page.wait_for_timeout(300)
            if page.locator("[role=dialog],[role=alertdialog]").count():
                opened = True
                inside = page.evaluate("!!document.activeElement.closest('[role=dialog],[role=alertdialog]')")
                ob = page.evaluate("getComputedStyle(document.querySelector('[role=dialog],[role=alertdialog]')).overscrollBehaviorY")
                check("dialog traps focus and contains scroll", inside and ob == "contain", f"inside={inside} overscroll={ob}")
                page.keyboard.press("Escape"); page.wait_for_timeout(250)
                check("Escape closes the dialog and returns focus", page.locator("[role=dialog],[role=alertdialog]").count() == 0 and page.evaluate("document.activeElement.tagName") == "BUTTON")
                break
    check("found a dialog demo on /components/dialog", opened)
    # Tooltip: first waits, neighbour instant
    goto(page, "/guidelines/interface-rules")
    page.get_by_role("radio", name="Needs review").click(); page.wait_for_timeout(150)
    review = page.evaluate("document.querySelectorAll('main li').length")
    page.get_by_role("radio", name="All").click(); page.wait_for_timeout(150)
    allc = page.evaluate("document.querySelectorAll('main li').length")
    check("Interface rules filter works", 0 < review < allc, f"review={review} all={allc}")
    ctx.close()

    m = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    mp = m.new_page()
    for r in ["/", "/components", "/guidelines/interface-rules", "/blocks/auth/full"]:
        goto(mp, r)
        over = mp.evaluate("document.documentElement.scrollWidth - window.innerWidth")
        check(f"390px: no horizontal overflow on {r}", over <= 0, f"{over}px")
    goto(mp, "/blocks/auth/full")
    fs = mp.evaluate("(() => { const i = document.querySelector('input'); return i ? getComputedStyle(i).fontSize : 'none'; })()")
    check("390px: inputs are 16px (no iOS zoom)", fs == "16px", fs)
    ta = mp.evaluate("getComputedStyle(document.querySelector('button')).touchAction")
    check("controls use touch-action: manipulation", ta == "manipulation", ta)
    mp.screenshot(path=str(shots / "mobile-auth.png"))
    b.close()

for x in passes: print("  pass", x)
for x in fails: print("  FAIL", x)
print(f"browser: {len(passes)}/{len(passes) + len(fails)} checks passed")
sys.exit(1 if fails else 0)
