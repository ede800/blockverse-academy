/* ==========================================================
   BLOCKVERSE ACADEMY — layout, progression, quiz, fond animé
   ========================================================== */

const LEVELS = {
  1: { name: "Fondamentaux", tag: "Niveau 01", desc: "Comprendre pourquoi la crypto existe et comment une blockchain tient debout." },
  2: { name: "Intermédiaire", tag: "Niveau 02", desc: "Bitcoin, Ethereum, smart contracts et tokens : l'écosystème en pratique." },
  3: { name: "Avancé", tag: "Niveau 03", desc: "DeFi, layers, interopérabilité, MEV et sécurité : les coulisses du Web3." }
};

const MODULES = [
  { id: "01", slug: "01-pourquoi-la-crypto", level: 1, mins: 10, icon: "◈",
    title: "Pourquoi la crypto ?",
    summary: "La monnaie, la confiance, le problème de la double dépense et l'idée révolutionnaire de Satoshi Nakamoto." },
  { id: "02", slug: "02-hachage", level: 1, mins: 12, icon: "#",
    title: "Hachage & cryptographie",
    summary: "Les empreintes numériques (SHA-256) et la cryptographie à clé publique : les briques de base." },
  { id: "03", slug: "03-blockchain", level: 1, mins: 15, icon: "▦",
    title: "La blockchain, bloc par bloc",
    summary: "Blocs, chaînage par hash, minage et immuabilité — avec une blockchain à manipuler soi-même." },
  { id: "04", slug: "04-consensus", level: 1, mins: 14, icon: "⚖",
    title: "Le consensus : PoW & PoS",
    summary: "Comment des milliers d'inconnus se mettent d'accord sans chef : Proof of Work, Proof of Stake et leurs variantes." },
  { id: "05", slug: "05-wallets", level: 1, mins: 12, icon: "🔑",
    title: "Wallets, clés & adresses",
    summary: "Clé privée, clé publique, adresse, seed phrase, hot vs cold wallet : posséder vraiment ses cryptos." },
  { id: "06", slug: "06-bitcoin", level: 2, mins: 15, icon: "₿",
    title: "Bitcoin en profondeur",
    summary: "UTXO, mempool, frais, halving, 21 millions, Lightning Network : la machine Bitcoin démontée." },
  { id: "07", slug: "07-ethereum", level: 2, mins: 14, icon: "Ξ",
    title: "Ethereum & l'EVM",
    summary: "L'ordinateur mondial : comptes, gas, EVM, The Merge et la feuille de route d'Ethereum." },
  { id: "08", slug: "08-smart-contracts", level: 2, mins: 18, icon: "⌬",
    title: "Les smart contracts",
    summary: "Du code qui s'exécute tout seul sur la blockchain : Solidity, déploiement, appels et un contrat à tester." },
  { id: "09", slug: "09-tokens", level: 2, mins: 14, icon: "◎",
    title: "Tokens, stablecoins & NFT",
    summary: "ERC-20, ERC-721, stablecoins, tokens de gouvernance : tout ce qu'on peut tokeniser." },
  { id: "10", slug: "10-nft", level: 2, mins: 16, icon: "◆",
    title: "Les NFT : comment ça marche",
    summary: "tokenId, métadonnées, IPFS, mint, marketplaces, royalties : ce qui se cache vraiment derrière un NFT, avec un mint à tester." },
  { id: "11", slug: "11-defi", level: 3, mins: 18, icon: "⇄",
    title: "La finance décentralisée (DeFi)",
    summary: "AMM, pools de liquidité, prêts, liquidations et yield : la finance sans banque, démo x·y=k incluse." },
  { id: "12", slug: "12-layers", level: 3, mins: 20, icon: "≡",
    title: "Les layers : L0, L1, L2, L3",
    summary: "Le trilemme de la blockchain, les rollups optimistes et ZK, et pourquoi on empile des couches." },
  { id: "13", slug: "13-interoperabilite", level: 3, mins: 14, icon: "⟷",
    title: "Bridges, oracles & interopérabilité",
    summary: "Faire parler les blockchains entre elles et avec le monde réel — et pourquoi c'est risqué." },
  { id: "14", slug: "14-securite", level: 3, mins: 16, icon: "⛨",
    title: "Sécurité, MEV & arnaques",
    summary: "Hacks célèbres, MEV, phishing, rug pulls : se protéger et comprendre les attaques." }
];

const STORE_KEY = "blockverse-progress-v1";
const Progress = {
  get() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; } },
  set(id, v) {
    const p = this.get();
    if (v) p[id] = Date.now(); else delete p[id];
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch {}
    updateProgressPill();
  },
  has(id) { return !!this.get()[id]; },
  count() { return MODULES.filter(m => this.has(m.id)).length; }
};

const BASE = document.body.dataset.base || "";
const moduleUrl = m => `${BASE}modules/${m.slug}.html`;

const LOGO_SVG = `<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
  <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00f0ff"/><stop offset="1" stop-color="#ff2bd6"/></linearGradient></defs>
  <path d="M16 2 28 9v14l-12 7L4 23V9z" fill="none" stroke="url(#lg)" stroke-width="2"/>
  <path d="M16 9l6 3.5v7L16 23l-6-3.5v-7z" fill="url(#lg)" opacity=".85"/>
</svg>`;

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function buildHeader() {
  const page = document.body.dataset.page || "";
  const header = el(`
    <header class="site-header">
      <div class="inner">
        <a class="logo" href="${BASE}index.html">${LOGO_SVG}<span>BLOCK<b>VERSE</b></span></a>
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false">☰</button>
        <nav class="nav">
          <a href="${BASE}index.html" class="${page === "home" ? "active" : ""}">Accueil</a>
          <a href="${BASE}index.html#parcours" class="${document.body.dataset.module ? "active" : ""}">Parcours</a>
          <a href="${BASE}lexique.html" class="${page === "lexique" ? "active" : ""}">Lexique</a>
          <span class="progress-pill" id="progress-pill"></span>
        </nav>
      </div>
    </header>`);
  document.body.prepend(header);
  const toggle = header.querySelector(".nav-toggle");
  const nav = header.querySelector(".nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  document.body.prepend(el(`<div class="scanlines" aria-hidden="true"></div>`));
  document.body.prepend(el(`<canvas id="bg-canvas" aria-hidden="true"></canvas>`));
  document.body.prepend(el(`<div class="bg-grid" aria-hidden="true"></div>`));
  updateProgressPill();
}

function updateProgressPill() {
  const pill = document.getElementById("progress-pill");
  if (pill) pill.textContent = `▲ ${Progress.count()}/${MODULES.length} modules`;
  document.querySelectorAll("[data-progress-bar]").forEach(b => {
    b.style.width = `${(Progress.count() / MODULES.length) * 100}%`;
  });
  document.querySelectorAll("[data-progress-text]").forEach(t => {
    t.textContent = `${Progress.count()} / ${MODULES.length}`;
  });
  document.querySelectorAll(".module-card[data-id]").forEach(c => {
    c.classList.toggle("done", Progress.has(c.dataset.id));
  });
}

function buildFooter() {
  document.body.append(el(`
    <footer class="site-footer">
      <div class="container inner">
        <div class="disclaimer">
          <strong>BLOCKVERSE ACADEMY</strong> — projet éducatif open source pour s'initier à la crypto et à la blockchain.<br>
          Rien sur ce site ne constitue un conseil en investissement. Les cryptoactifs sont volatils et risqués :
          ne jamais investir plus que ce que l'on peut se permettre de perdre.
        </div>
        <div>
          <a href="${BASE}index.html#parcours">Parcours</a> ·
          <a href="${BASE}lexique.html">Lexique</a>
        </div>
      </div>
    </footer>`));
}

/* ---------- Page d'accueil : grille des modules ---------- */
function buildParcours() {
  const root = document.getElementById("levels");
  if (!root) return;
  for (const lvl of [1, 2, 3]) {
    const L = LEVELS[lvl];
    const mods = MODULES.filter(m => m.level === lvl);
    const block = el(`
      <div class="level lvl-${lvl} reveal">
        <div class="level-head">
          <span class="level-tag">${L.tag}</span>
          <h3>${L.name}</h3>
          <span class="lead" style="font-size:.95rem">${L.desc}</span>
        </div>
        <div class="module-grid"></div>
      </div>`);
    const grid = block.querySelector(".module-grid");
    for (const m of mods) {
      const card = el(`
        <a class="module-card" data-id="${m.id}" href="${moduleUrl(m)}">
          <span class="num">MODULE ${m.id} ${m.icon}</span>
          <h4>${m.title}</h4>
          <p>${m.summary}</p>
          <span class="meta"><span>⏱ ${m.mins} min</span><span class="done-badge">✔ TERMINÉ</span></span>
        </a>`);
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
      grid.append(card);
    }
    root.append(block);
  }
  updateProgressPill();
}

/* ---------- Pages module ---------- */
function buildModulePage() {
  const id = document.body.dataset.module;
  if (!id) return;
  const idx = MODULES.findIndex(m => m.id === id);
  const m = MODULES[idx];
  const L = LEVELS[m.level];
  document.body.classList.add(`lvl-${m.level}`);
  document.title = `${m.title} — Blockverse Academy`;

  const layout = document.querySelector(".article-layout");
  const hero = el(`
    <section class="module-hero container">
      <div class="breadcrumb"><a href="${BASE}index.html#parcours">PARCOURS</a> / ${L.tag.toUpperCase()} · ${L.name.toUpperCase()} / MODULE ${m.id}</div>
      <h1><span class="gradient-text">${m.title}</span></h1>
      <p class="lead">${m.summary}</p>
      <div class="meta-row">
        <span class="chip lvl">${L.tag} — ${L.name}</span>
        <span class="chip">⏱ ${m.mins} min de lecture</span>
        <span class="chip">Module ${idx + 1} / ${MODULES.length}</span>
      </div>
    </section>`);
  layout.before(hero);

  // Table des matières
  const article = layout.querySelector(".article");
  const toc = el(`<aside class="toc"><h5>Sommaire</h5></aside>`);
  const heads = [...article.querySelectorAll("h2")];
  heads.forEach((h, i) => {
    if (!h.id) h.id = `s${i + 1}`;
    const a = el(`<a href="#${h.id}">${h.textContent}</a>`);
    toc.append(a);
  });
  layout.prepend(toc);
  const tocLinks = [...toc.querySelectorAll("a")];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        tocLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`));
      }
    });
  }, { rootMargin: "-20% 0px -70% 0px" });
  heads.forEach(h => spy.observe(h));

  // Bouton terminé + navigation
  const prev = MODULES[idx - 1], next = MODULES[idx + 1];
  const done = Progress.has(id);
  const foot = el(`
    <div>
      <div class="done-btn-wrap">
        <button class="btn lime" id="done-btn">${done ? "✔ Module terminé" : "Marquer comme terminé"}</button>
      </div>
      <nav class="module-footer">
        <a class="mf-link prev ${prev ? "" : "empty"}" href="${prev ? moduleUrl(prev) : "#"}">
          <small>← Précédent</small>${prev ? prev.title : ""}</a>
        <a class="btn small" href="${BASE}index.html#parcours">Parcours</a>
        <a class="mf-link next ${next ? "" : "empty"}" href="${next ? moduleUrl(next) : "#"}">
          <small>Suivant →</small>${next ? next.title : ""}</a>
      </nav>
    </div>`);
  article.append(foot);
  const btn = foot.querySelector("#done-btn");
  btn.addEventListener("click", () => {
    const now = !Progress.has(id);
    Progress.set(id, now);
    btn.textContent = now ? "✔ Module terminé" : "Marquer comme terminé";
  });
}

/* ---------- Quiz ---------- */
function initQuizzes() {
  document.querySelectorAll("[data-quiz]").forEach(quiz => {
    const qs = [...quiz.querySelectorAll(".q")];
    const score = el(`<div class="quiz-score"></div>`);
    quiz.append(score);
    let good = 0, answered = 0;
    qs.forEach(q => {
      const right = Number(q.dataset.answer);
      const opts = [...q.querySelectorAll("button.opt")];
      opts.forEach((b, i) => {
        b.addEventListener("click", () => {
          if (q.classList.contains("answered")) return;
          q.classList.add("answered");
          opts.forEach(o => (o.disabled = true));
          opts[right].classList.add("right");
          if (i === right) good++; else b.classList.add("wrong");
          answered++;
          if (answered === qs.length) {
            score.textContent = `> Score : ${good}/${qs.length} ${good === qs.length ? "— parfait, module maîtrisé ⚡" : good >= qs.length / 2 ? "— pas mal, relis les points ratés" : "— relis le module et réessaie"}`;
            if (good === qs.length && document.body.dataset.module) {
              Progress.set(document.body.dataset.module, true);
              const btn = document.getElementById("done-btn");
              if (btn) btn.textContent = "✔ Module terminé";
            }
          }
        });
      });
    });
  });
}

/* ---------- Apparition au scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("visible")); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(e => io.observe(e));
}

/* ---------- Fond : réseau de nœuds ---------- */
function initBackground() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, nodes = [], dpr = Math.min(window.devicePixelRatio || 1, 2);
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    const count = Math.min(90, Math.floor((innerWidth * innerHeight) / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .35 * dpr, vy: (Math.random() - .5) * .35 * dpr,
      r: (Math.random() * 1.6 + .6) * dpr,
      c: Math.random() < .7 ? "0,240,255" : "255,43,214"
    }));
  }
  addEventListener("resize", resize);
  addEventListener("pointermove", e => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
  resize();

  const LINK = 140 * dpr;
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(0,240,255,${(1 - d / LINK) * .18})`;
          ctx.lineWidth = dpr * .8;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (dm < LINK * 1.4) {
        ctx.strokeStyle = `rgba(255,43,214,${(1 - dm / (LINK * 1.4)) * .35})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = `rgba(${a.c},.85)`;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  frame();
}

/* ---------- Hero : hash qui défile ---------- */
function initHeroHash() {
  const faces = document.querySelectorAll(".cube .face[data-hash]");
  if (!faces.length || typeof sha256 !== "function") return;
  let n = 0;
  const tick = () => {
    faces.forEach((f, i) => { f.textContent = sha256(`block-${n}-${i}`).slice(0, 32); });
    n++;
  };
  tick();
  setInterval(tick, 1600);
}

buildHeader();
buildParcours();
buildModulePage();
buildFooter();
initQuizzes();
initReveal();
initBackground();
initHeroHash();
