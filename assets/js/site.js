// Iván Z · animaciones y comportamiento de la web (portada y artículos)
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const root = document.documentElement;
const isHome = document.body.classList.contains("home");

/* ---------- Lenis (scroll suave). Si el CDN falla, scroll nativo ---------- */
let lenis = null;
if (!reduce) {
  try {
    const { default: Lenis } = await Promise.race([
      import("./vendor/lenis.mjs"),
      new Promise((_, no) => setTimeout(() => no(new Error("timeout")), 2500)),
    ]);
    lenis = new Lenis({ smoothWheel: true, lerp: .1 });
  } catch (e) { lenis = null; }
}
const getY = () => lenis ? lenis.scroll : scrollY;
const lockScroll = on => { if (lenis) { on ? lenis.stop() : lenis.start(); } else { root.style.overflow = on ? "hidden" : ""; } };
const goTo = (t, immediate = false) => {
  if (lenis) lenis.scrollTo(t, { offset: 0, duration: 1.4, immediate });
  else t.scrollIntoView({ behavior: (reduce || immediate) ? "auto" : "smooth" });
};

/* ---------- Titulares partidos en líneas según el ancho real ---------- */
function split(el) {
  const text = el.dataset.text ?? el.textContent.trim().replace(/\s+/g, " ");
  el.dataset.text = text;
  el.setAttribute("aria-label", text);
  el.textContent = "";
  const spans = text.split(" ").map(w => {
    const s = document.createElement("span"); s.textContent = w; s.style.display = "inline-block";
    el.append(s, " "); return s;
  });
  const lines = []; let top = null;
  spans.forEach(s => { if (s.offsetTop !== top) { lines.push([]); top = s.offsetTop; } lines.at(-1).push(s.textContent); });
  el.textContent = "";
  lines.forEach((ws, i) => {
    const l = document.createElement("span"); l.className = "line"; l.setAttribute("aria-hidden", "true");
    const inner = document.createElement("span"); inner.textContent = ws.join(" "); inner.style.transitionDelay = (i * 90) + "ms";
    l.appendChild(inner); el.appendChild(l);
  });
}
const splitAll = () => $$("[data-split]").forEach(split);
let lastW = innerWidth, rt;
addEventListener("resize", () => { if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(rt); rt = setTimeout(splitAll, 180); });
$$("#roles .line>span, [data-split-raw] .line>span").forEach((s, i) => { s.style.transitionDelay = ((i % 3) * 90) + "ms"; });

/* ---------- Revelados al hacer scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { rootMargin: "0px 0px -12% 0px" });
const armReveals = () => $$("main .reveal-lines:not(#roles), main .fade-up:not(#hero-desc):not(#hero-ctas)").forEach(el => io.observe(el));

/* ---------- Distorsión líquida (SVG feTurbulence + muelle) ---------- */
const defs = $("#fx-defs"); let fid = 0;
function liquid(target, hoverEl, peak = 38) {
  if (reduce || !finePointer || !target || !hoverEl) return;
  const id = "liq" + (fid++);
  defs.insertAdjacentHTML("beforeend",
    `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="${fid * 7}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"/>
    </filter>`);
  const f = defs.lastElementChild, turb = f.querySelector("feTurbulence"), disp = f.querySelector("feDisplacementMap");
  target.style.filter = `url(#${id})`;
  let cur = 0, goal = 0, v = 0, t = 0, running = false;
  const step = () => {
    v = (v + (goal - cur) * .06) * .78; cur += v; t += .004;
    disp.setAttribute("scale", cur.toFixed(2));
    turb.setAttribute("baseFrequency", `${(.012 + Math.sin(t) * .003).toFixed(4)} ${(.02 + Math.cos(t) * .004).toFixed(4)}`);
    if (Math.abs(goal - cur) > .05 || Math.abs(v) > .05 || goal !== 0) requestAnimationFrame(step); else running = false;
  };
  const go = val => { goal = val; if (!running) { running = true; requestAnimationFrame(step); } };
  hoverEl.addEventListener("pointerenter", () => { go(peak); setTimeout(() => { if (goal) go(peak * .35); }, 450); });
  hoverEl.addEventListener("pointerleave", () => go(0));
}

/* ---------- Portada: nombre letra a letra, marquee, retrato ---------- */
const nameEl = $("#hero-name");
const nl = nameEl && $(".nl", nameEl);
if (nl) {
  nl.textContent = "";
  [...nl.dataset.text].forEach((c, i) => {
    const s = document.createElement("span");
    if (c === " ") s.className = "sp";
    else { s.className = "ch"; s.textContent = c; s.style.transitionDelay = (i * 55) + "ms"; }
    nl.appendChild(s);
  });
}
function fitName() {
  if (!nl) return;
  const hero = $("#top");
  nameEl.style.fontSize = "100px";
  const w = nl.getBoundingClientRect().width;
  nameEl.style.fontSize = "";
  const fit = 100 * (innerWidth * .94) / w;
  const cap = innerHeight * (innerWidth < 768 ? .3 : .4);
  hero.style.setProperty("--fs-name", Math.min(fit, cap) + "px");
}
addEventListener("resize", fitName);

const track = $("#marquee");
if (track) {
  const words = ["Seguridad ofensiva", "Interceptación HTTPS", "Herramientas propias", "Pentesting", "Windows", "Linux", "Python", "Electron"];
  track.innerHTML = [...words, ...words].map(w => `<span class="marquee-item">${w}</span>`).join("");
}
$$(".card").forEach(c => liquid($(".ph", c), c));
liquid($("#descargar .ph"), $("#descargar .liquid"));
liquid($("#portrait"), $("#portrait"), 22);

await document.fonts.ready;
splitAll();
fitName();

/* ---------- Bucle principal ---------- */
const header = $("#site-header"), pwrap = $("#portrait-wrap"), bar = $("#read-progress");
let mx = 0, lastT = performance.now(), lastY = getY(), navY = 0, menuOpen = false;
function frame(now) {
  lenis && lenis.raf(now);
  const dt = Math.min(now - lastT, 64); lastT = now;
  const y = getY();
  const vel = lenis ? lenis.velocity : (y - lastY); lastY = y;

  if (!reduce && track) {
    const speed = 55 + Math.min(Math.abs(vel) * 14, 420);
    const half = track.scrollWidth / 2;
    mx -= speed * dt / 1000; if (mx <= -half) mx += half;
    track.style.transform = `translate3d(${mx}px,0,0)`;
  }
  if (!reduce && pwrap && y < innerHeight * 1.2) {
    pwrap.style.transform = `translate3d(0,${y * -.12}px,0)`;
    nameEl.style.transform = `translate3d(0,${y * .18}px,0)`;
  }
  if (bar) {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  }

  header.classList.toggle("solid", y > 40);
  if (!menuOpen) {
    if (y > navY + 4 && y > 240) header.classList.add("hidden");
    else if (y < navY - 4) header.classList.remove("hidden");
  }
  navY = y;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------- Entrada ---------- */
function heroIn() {
  if (nameEl) {
    nameEl.classList.add("in");
    setTimeout(() => $("#portrait")?.classList.add("in"), 120);
    setTimeout(() => $("#roles")?.classList.add("in"), 260);
    setTimeout(() => $("#hero-desc")?.classList.add("in"), 700);
    setTimeout(() => $("#hero-ctas")?.classList.add("in"), 820);
  }
  armReveals();
}

// Si se llega con un ancla (#apuntes) se va directo ahí
// Abierta desde ZGuard (?ref=zguard): directa a su sección, sin preloader.
const fromZGuard = new URLSearchParams(location.search).get("ref") === "zguard";
const hashTarget = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
  : (fromZGuard ? document.getElementById("zguard") : null);
let seen = false;
try { seen = sessionStorage.getItem("ivanz-intro") === "1"; } catch (e) {}

// Abierta desde ZIntercept (primera pestaña del navegador de pruebas):
// aviso de primeros pasos y sin preloader, para que cargue al momento.
const fromApp = new URLSearchParams(location.search).get("ref") === "zintercept";
const welcome = $("#welcome");
if (fromApp && welcome) {
  seen = true;
  document.body.classList.add("from-app");
  welcome.hidden = false;
  $(".welcome-close", welcome).addEventListener("click", () => { welcome.hidden = true; document.body.classList.remove("from-app"); });
}
const pl = $("#preloader");

if (pl && !reduce && !seen && !hashTarget) {
  try { sessionStorage.setItem("ivanz-intro", "1"); } catch (e) {}
  lockScroll(true); scrollTo(0, 0);
  const num = $("#pl-num"), t0 = performance.now(), DUR = 1600;
  const tick = now => {
    const p = Math.min((now - t0) / DUR, 1);
    num.textContent = Math.round((1 - Math.pow(1 - p, 3)) * 100);
    if (p < 1) return requestAnimationFrame(tick);
    pl.classList.add("fade");
    setTimeout(() => {
      pl.classList.add("wipe");
      setTimeout(heroIn, 220);
      pl.addEventListener("transitionend", () => { pl.classList.add("done"); lockScroll(false); }, { once: true });
    }, 380);
  };
  requestAnimationFrame(tick);
} else {
  pl?.remove();
  heroIn();
  if (hashTarget) requestAnimationFrame(() => goTo(hashTarget, true));
}

/* ---------- Menú móvil y anclas ---------- */
const burger = $("#burger"), menu = $("#mobile-menu");
function setMenu(open) {
  menuOpen = open;
  burger.classList.toggle("open", open); menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  menu.setAttribute("aria-hidden", !open);
  $$("a", menu).forEach((a, i) => a.style.transitionDelay = open ? (100 + i * 70) + "ms" : "0ms");
  if (open) header.classList.remove("hidden");
  lockScroll(open);
}
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("[data-scroll]").forEach(a => a.addEventListener("click", e => {
  const url = new URL(a.href, location.href);
  if (url.pathname !== location.pathname || !url.hash) { if (menuOpen) setMenu(false); return; }
  const t = document.getElementById(decodeURIComponent(url.hash.slice(1))); if (!t) return;
  e.preventDefault(); if (menuOpen) setMenu(false);
  history.replaceState(null, "", url.hash);
  goTo(t);
}));

/* ---------- Artículos: visor de imágenes ---------- */
const lb = $("#lightbox");
if (lb) {
  const lbImg = $("img", lb);
  let opener = null;
  const close = () => {
    lb.classList.remove("open");
    setTimeout(() => { lb.hidden = true; lbImg.src = ""; }, 200);
    lockScroll(false); opener?.focus();
  };
  $$(".prose img, .article-cover img").forEach(img => {
    img.tabIndex = 0; img.setAttribute("role", "button");
    img.setAttribute("aria-label", "Ampliar imagen: " + (img.alt || ""));
    const open = () => {
      opener = img; lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
      lb.hidden = false; requestAnimationFrame(() => lb.classList.add("open"));
      lockScroll(true); $(".lightbox-close", lb).focus();
    };
    img.addEventListener("click", open);
    img.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  lb.addEventListener("click", e => { if (e.target !== lbImg) close(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && !lb.hidden) close(); });
}

addEventListener("keydown", e => { if (e.key === "Escape" && menuOpen) setMenu(false); });
