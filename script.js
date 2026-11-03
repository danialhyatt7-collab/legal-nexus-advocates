/* Legal Nexus Advocates — interactions & animations */
(() => {
  "use strict";

  /* ======================================================
     EDIT ME: the firm's real contact details go here.
     Every call / WhatsApp button on the page uses these.
     ====================================================== */
  const CONTACT = {
    phone: "+92 300 0000000",      // shown on the page
    whatsapp: "923000000000",      // international format, digits only
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- contact wiring ---------- */
  const tel = "tel:" + CONTACT.phone.replace(/[^\d+]/g, "");
  $$(".js-call").forEach(a => (a.href = tel));
  $$(".js-phone-label").forEach(el => (el.textContent = CONTACT.phone));
  const waLink = (text = "") => `https://wa.me/${CONTACT.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  $$(".js-wa").forEach(a => (a.href = waLink("Assalam o Alaikum, I'd like to discuss a legal matter.")));
  $$(".js-year").forEach(el => (el.textContent = new Date().getFullYear()));

  /* ---------- preloader → hero entrance ---------- */
  const pre = $(".preloader");
  const start = () => {
    pre && pre.classList.add("is-done");
    document.body.classList.remove("is-loading");
    requestAnimationFrame(() => document.documentElement.classList.add("is-ready"));
  };
  let seen = false;
  try { seen = sessionStorage.getItem("lna-intro") === "1"; sessionStorage.setItem("lna-intro", "1"); } catch (e) {}
  if (reduced || seen || !pre) { pre && pre.remove(); start(); }
  else { document.body.classList.add("is-loading"); setTimeout(start, 1650); }

  /* ---------- header: shrink, hide on scroll down, progress ---------- */
  const header = $(".header");
  const bar = $(".progress span");
  const fab = $(".fab");
  const actionbar = $(".actionbar");
  let lastY = scrollY, ticking = false;
  const onScroll = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle("is-scrolled", y > 30);
    const menuOpen = $(".mobile-menu").classList.contains("is-open");
    header.classList.toggle("is-hidden", !menuOpen && y > lastY && y > 500);
    const past = y > innerHeight * 0.6;
    fab && fab.classList.toggle("is-visible", past);
    actionbar && actionbar.classList.toggle("is-visible", past);
    lastY = y; ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* nudge the WhatsApp tooltip once, after a while */
  if (fab) setTimeout(() => { fab.classList.add("is-nudge"); setTimeout(() => fab.classList.remove("is-nudge"), 3500); }, 12000);

  /* ---------- mobile menu ---------- */
  const burger = $(".burger"), menu = $(".mobile-menu");
  const setMenu = open => { burger.setAttribute("aria-expanded", open); menu.classList.toggle("is-open", open); };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  $$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));

  /* ---------- active nav link ---------- */
  const links = $$(".nav__link");
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) links.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach(l => { const s = $(l.getAttribute("href")); s && spy.observe(s); });

  /* ---------- reveal on scroll (with sibling stagger) ---------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      revealIO.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty("--d", Math.min(i * 0.08, 0.5) + "s");
    revealIO.observe(el);
  });

  /* ---------- count-up stats ---------- */
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, to = +el.dataset.to, dur = reduced ? 0 : 1600, t0 = performance.now();
      const tick = now => {
        const p = dur ? Math.min((now - t0) / dur, 1) : 1;
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$(".count").forEach(el => countIO.observe(el));

  /* ---------- FAQ: smooth open/close, one at a time ---------- */
  $$(".qa").forEach(d => {
    const summary = $("summary", d);
    summary.addEventListener("click", ev => {
      ev.preventDefault();
      const opening = !d.open;
      $$(".qa").forEach(o => { if (o !== d && o.open) { o.classList.remove("is-open"); setTimeout(() => (o.open = false), 450); } });
      if (opening) { d.open = true; requestAnimationFrame(() => d.classList.add("is-open")); }
      else { d.classList.remove("is-open"); setTimeout(() => (d.open = false), 450); }
    });
  });

  /* ---------- pointer effects (desktop only) ---------- */
  if (finePointer && !reduced) {
    // custom cursor
    const cur = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("mousemove", e => { if (e.clientX || e.clientY) cur.classList.add("is-on"); mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`; });
    document.addEventListener("mouseleave", () => cur.classList.remove("is-on"));
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", e => cur.classList.toggle("is-hover", !!e.target.closest("a, button, summary, .card, input, select, textarea")));

    // magnetic buttons
    $$(".magnetic").forEach(el => {
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.22, y = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });

    // tilting cards with cursor glow
    $$(".card").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--ry", (px - 0.5) * 8 + "deg");
        card.style.setProperty("--rx", (0.5 - py) * 8 + "deg");
        card.style.setProperty("--gx", px * 100 + "%");
        card.style.setProperty("--gy", py * 100 + "%");
      });
      card.addEventListener("mouseleave", () => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
    });

    // hero spotlight + quill parallax
    const hero = $(".hero"), quill = $(".quill");
    hero.addEventListener("mousemove", e => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      hero.style.setProperty("--mx", px * 100 + "%");
      hero.style.setProperty("--my", py * 100 + "%");
      quill.style.transform = `rotateY(${(px - 0.5) * 14}deg) rotateX(${(0.5 - py) * 10}deg) translate(${(px - 0.5) * 14}px, ${(py - 0.5) * 10}px)`;
    });
    hero.addEventListener("mouseleave", () => (quill.style.transform = ""));
  }

  /* ---------- hero canvas: gold dust + "nexus" connections ---------- */
  const canvas = $(".hero__canvas");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, pts = [], running = true, mouse = { x: -999, y: -999 };
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / 16000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22, vy: -Math.random() * 0.25 - 0.05,
        r: Math.random() * 1.6 + 0.4, a: Math.random() * 0.6 + 0.2, t: Math.random() * 6.28,
      }));
    };
    resize();
    addEventListener("resize", resize);
    canvas.parentElement.addEventListener("mousemove", e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    canvas.parentElement.addEventListener("mouseleave", () => (mouse.x = mouse.y = -999));
    new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) requestAnimationFrame(draw); }).observe(canvas);
    const LINK = 120;
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.t += 0.02; p.x += p.vx + Math.sin(p.t) * 0.08; p.y += p.vy;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 14000) { p.x += dx * 0.012; p.y += dy * 0.012; } // gently part around the cursor
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(201,163,91,${(1 - d / LINK) * 0.16})`;
            ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        const tw = p.a * (0.6 + 0.4 * Math.sin(p.t * 2));
        ctx.fillStyle = `rgba(236,210,154,${tw})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ---------- practice card → prefill form ---------- */
  const form = $(".form");
  const area = $("#f-area");
  $$(".js-area").forEach(btn => btn.addEventListener("click", () => {
    const val = btn.closest(".card").dataset.area;
    [...area.options].forEach(o => { if (o.textContent.trim() === val) area.value = o.value; });
    area.classList.add("has-value");
    $("#contact").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    setTimeout(() => $("#f-name").focus({ preventScroll: true }), 700);
  }));
  area.addEventListener("change", () => area.classList.toggle("has-value", !!area.value));

  /* ---------- form: validate, then open WhatsApp with the enquiry ---------- */
  const validate = field => {
    const input = $("input, select", field);
    if (!input || !input.required) return true;
    let ok = input.value.trim() !== "";
    if (ok && input.type === "tel") ok = /^[0-9+\s-]{10,16}$/.test(input.value.trim());
    field.classList.toggle("is-invalid", !ok);
    return ok;
  };
  $$(".field", form).forEach(f => {
    const input = $("input, select", f);
    input && input.addEventListener("blur", () => f.classList.contains("is-invalid") && validate(f));
    input && input.addEventListener("input", () => f.classList.contains("is-invalid") && validate(f));
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const fields = $$(".field", form);
    const ok = fields.map(validate).every(Boolean);
    if (!ok) { const bad = $(".is-invalid input, .is-invalid select", form); bad && bad.focus(); return; }
    const d = new FormData(form);
    const msg = [
      "Assalam o Alaikum, Legal Nexus Advocates.",
      `Name: ${d.get("name")}`,
      `Phone: ${d.get("phone")}`,
      `Matter: ${d.get("area")}`,
      `City: ${d.get("city")}`,
      d.get("message") ? `Details: ${d.get("message")}` : "",
    ].filter(Boolean).join("\n");
    form.classList.add("is-sent");
    setTimeout(() => window.open(waLink(msg), "_blank", "noopener"), 900);
  });
  $(".js-reset").addEventListener("click", () => { form.reset(); area.classList.remove("has-value"); form.classList.remove("is-sent"); });
})();
