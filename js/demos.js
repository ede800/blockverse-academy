/* ==========================================================
   BLOCKVERSE ACADEMY — démos interactives
   Chaque démo ne s'active que si son conteneur est présent.
   ========================================================== */

const $ = (sel, root = document) => root.querySelector(sel);
const fmt = (n, d = 2) => Number(n).toLocaleString("fr-FR", { maximumFractionDigits: d, minimumFractionDigits: 0 });
const randHex = bytes => [...crypto.getRandomValues(new Uint8Array(bytes))].map(b => b.toString(16).padStart(2, "0")).join("");

/* ---------- 1. Hachage SHA-256 + effet avalanche ---------- */
(function hashDemo() {
  const root = $("#demo-hash");
  if (!root) return;
  const a = $("#hash-a", root), b = $("#hash-b", root);
  const oa = $("#hash-out-a", root), ob = $("#hash-out-b", root), stat = $("#hash-stat", root);
  const bitsOf = hex => [...hex].map(c => parseInt(c, 16).toString(2).padStart(4, "0")).join("");
  function update() {
    const ha = sha256(a.value), hb = sha256(b.value);
    oa.textContent = ha;
    ob.innerHTML = [...hb].map((c, i) => c === ha[i] ? c : `<span class="diff">${c}</span>`).join("");
    const ba = bitsOf(ha), bb = bitsOf(hb);
    let d = 0;
    for (let i = 0; i < 256; i++) if (ba[i] !== bb[i]) d++;
    stat.innerHTML = a.value === b.value
      ? "Entrées identiques → empreintes identiques. Change <b>un seul caractère</b> dans le second champ."
      : `<b>${d}</b> bits sur 256 ont changé (<b>${Math.round(d / 2.56)} %</b>) — c'est l'<b>effet avalanche</b>.`;
  }
  a.addEventListener("input", update);
  b.addEventListener("input", update);
  update();
})();

/* ---------- 2. Blockchain minable ---------- */
(function chainDemo() {
  const root = $("#demo-chain");
  if (!root) return;
  const DIFF = "000";
  const chainEl = $(".chain", root);
  const initial = [
    "Genèse : Alice reçoit 50",
    "Alice → Bob : 10",
    "Bob → Carol : 4",
    "Carol → Dave : 1"
  ];
  const blocks = initial.map((data, i) => ({ n: i + 1, nonce: 0, data, prev: "", hash: "" }));
  const payload = b => `${b.n}|${b.nonce}|${b.data}|${b.prev}`;

  function mine(b) {
    let nonce = 0, h;
    do { h = sha256(`${b.n}|${nonce}|${b.data}|${b.prev}`); nonce++; } while (!h.startsWith(DIFF));
    b.nonce = nonce - 1;
    b.hash = h;
  }
  // chaîne initiale valide
  blocks.forEach((b, i) => {
    b.prev = i === 0 ? "0".repeat(64) : blocks[i - 1].hash;
    mine(b);
  });

  function recompute() {
    blocks.forEach((b, i) => {
      b.prev = i === 0 ? "0".repeat(64) : blocks[i - 1].hash;
      b.hash = sha256(payload(b));
    });
    render();
  }

  function render() {
    blocks.forEach((b, i) => {
      const card = chainEl.querySelector(`[data-i="${i}"]`);
      const valid = b.hash.startsWith(DIFF) && blocks.slice(0, i).every(x => x.hash.startsWith(DIFF));
      card.classList.toggle("invalid", !valid);
      $(".status", card).textContent = valid ? "● VALIDE" : "✖ INVALIDE";
      $(".nonce", card).value = b.nonce;
      $(".prev", card).textContent = b.prev;
      $(".cur", card).textContent = b.hash;
    });
  }

  blocks.forEach((b, i) => {
    if (i > 0) chainEl.append(Object.assign(document.createElement("div"), { className: "link" }));
    const card = document.createElement("div");
    card.className = "block";
    card.dataset.i = i;
    card.innerHTML = `
      <div class="bh"><span>BLOC #${b.n}</span><span class="status"></span></div>
      <div class="f"><label>Données</label><input class="input data" value="${b.data}"></div>
      <div class="f"><label>Nonce</label><input class="input nonce" type="number" min="0"></div>
      <div class="f"><label>Hash précédent</label><div class="hv prev"></div></div>
      <div class="f"><label>Hash du bloc</label><div class="hv cur"></div></div>
      <button class="btn small mine">⛏ Miner</button>`;
    $(".data", card).addEventListener("input", e => { b.data = e.target.value; recompute(); });
    $(".nonce", card).addEventListener("input", e => { b.nonce = Number(e.target.value) || 0; recompute(); });
    $(".mine", card).addEventListener("click", e => {
      const btn = e.currentTarget;
      btn.textContent = "⛏ Minage…";
      btn.disabled = true;
      setTimeout(() => {
        const t0 = performance.now();
        mine(b);
        recompute();
        btn.textContent = `✔ ${b.nonce + 1} essais · ${Math.round(performance.now() - t0)} ms`;
        btn.disabled = false;
        setTimeout(() => (btn.textContent = "⛏ Miner"), 2500);
      }, 30);
    });
    chainEl.append(card);
  });
  render();
})();

/* ---------- 3. Proof of Stake : tirage pondéré ---------- */
(function posDemo() {
  const root = $("#demo-pos");
  if (!root) return;
  const vals = [
    { name: "Validateur A", stake: 32 },
    { name: "Validateur B", stake: 64 },
    { name: "Validateur C", stake: 160 },
    { name: "Validateur D", stake: 320 }
  ];
  const sliders = $("#pos-sliders", root), bars = $("#pos-bars", root), info = $("#pos-info", root);
  vals.forEach((v, i) => {
    const row = document.createElement("div");
    row.innerHTML = `<label>${v.name} — mise : <b data-s="${i}">${v.stake}</b> ETH</label>
      <input type="range" min="32" max="1000" step="32" value="${v.stake}" data-i="${i}">`;
    sliders.append(row);
  });
  sliders.addEventListener("input", e => {
    const i = e.target.dataset.i;
    if (i === undefined) return;
    vals[i].stake = Number(e.target.value);
    $(`[data-s="${i}"]`, sliders).textContent = vals[i].stake;
  });
  bars.innerHTML = vals.map((v, i) => `
    <div class="bar-row"><span>${v.name}</span><div class="bar-track"><div class="bar-fill ${i % 2 ? "m" : ""}" data-b="${i}"></div></div><span data-p="${i}">—</span></div>`).join("");
  $("#pos-run", root).addEventListener("click", () => {
    const total = vals.reduce((s, v) => s + v.stake, 0);
    const wins = vals.map(() => 0);
    const N = 1000;
    for (let k = 0; k < N; k++) {
      let r = Math.random() * total;
      for (let i = 0; i < vals.length; i++) { r -= vals[i].stake; if (r <= 0) { wins[i]++; break; } }
    }
    const max = Math.max(...wins);
    wins.forEach((w, i) => {
      $(`[data-b="${i}"]`, bars).style.width = `${(w / max) * 100}%`;
      $(`[data-p="${i}"]`, bars).textContent = `${w} blocs`;
    });
    info.innerHTML = `Sur <b>${N}</b> blocs simulés, chaque validateur est choisi à peu près <b>proportionnellement à sa mise</b> (${vals.map(v => `${Math.round(v.stake / total * 100)} %`).join(" / ")}).`;
  });
})();

/* ---------- 4. Clés & adresses (simulation pédagogique) ---------- */
(function keysDemo() {
  const root = $("#demo-keys");
  if (!root) return;
  const WORDS = ("orbite neon pixel cristal comete signal atome vortex nebuleuse quartz photon lune soleil " +
    "planete fusee galaxie onde radar laser robot satellite metal argent cuivre titane zenith aurore " +
    "eclipse prisme spectre vapeur glacier volcan foret riviere ocean desert falaise tempete eclair " +
    "nuage brume horizon boussole carte tresor ancre phare voile navire pilote moteur turbine circuit " +
    "cable reseau serveur noyau module").split(" ");
  const out = { seed: $("#k-seed", root), priv: $("#k-priv", root), pub: $("#k-pub", root), addr: $("#k-addr", root) };
  function gen() {
    const rnd = crypto.getRandomValues(new Uint32Array(12));
    const seed = [...rnd].map(x => WORDS[x % WORDS.length]).join(" ");
    const priv = sha256("seed:" + seed);
    const pub = "04" + sha256("pub1:" + priv) + sha256("pub2:" + priv);
    const addr = "0x" + sha256(pub).slice(-40);
    out.seed.textContent = seed;
    out.priv.textContent = priv;
    out.pub.textContent = pub;
    out.addr.textContent = addr;
  }
  $("#k-gen", root).addEventListener("click", gen);
  gen();
})();

/* ---------- 5. Halving Bitcoin ---------- */
(function halvingDemo() {
  const root = $("#demo-halving");
  if (!root) return;
  const rows = [];
  let reward = 50, supply = 0;
  for (let era = 0; era < 10; era++) {
    supply += reward * 210000;
    rows.push({ year: 2009 + era * 4, reward, supply });
    reward /= 2;
  }
  const bars = $("#halving-bars", root);
  bars.innerHTML = rows.map(r => `
    <div class="bar-row"><span>${r.year}${r.year > 2024 ? "*" : ""}</span>
      <div class="bar-track"><div class="bar-fill ${r.year > 2024 ? "m" : "l"}" style="width:${r.reward / 50 * 100}%"></div></div>
      <span>${fmt(r.reward, 4)} ₿</span></div>`).join("");
  const sup = $("#halving-supply", root);
  sup.innerHTML = rows.map(r => `<tr><td>${r.year}${r.year > 2024 ? "*" : ""}</td><td>${fmt(r.reward, 5)} ₿</td><td>${fmt(r.supply, 0)} ₿</td><td>${fmt(r.supply / 21e6 * 100, 1)} %</td></tr>`).join("");
})();

/* ---------- 6. Calculateur de gas ---------- */
(function gasDemo() {
  const root = $("#demo-gas");
  if (!root) return;
  const ids = ["gas-op", "gas-base", "gas-tip", "gas-price"];
  const [op, base, tip, price] = ids.map(i => $("#" + i, root));
  const out = $("#gas-out", root);
  function calc() {
    const units = Number(op.value);
    const gwei = Number(base.value) + Number(tip.value);
    const eth = units * gwei * 1e-9;
    const burned = units * Number(base.value) * 1e-9;
    out.innerHTML = `${fmt(units, 0)} gas × ${fmt(gwei, 2)} gwei = <b>${fmt(eth, 6)} ETH</b> ≈ <b>${fmt(eth * Number(price.value), 2)} $</b><br>
      dont <b>${fmt(burned, 6)} ETH brûlés</b> (base fee, EIP-1559) et ${fmt(eth - burned, 6)} ETH de pourboire pour le validateur.`;
  }
  ids.forEach(i => $("#" + i, root).addEventListener("input", calc));
  calc();
})();

/* ---------- 7. Smart contract « Cagnotte » ---------- */
(function contractDemo() {
  const root = $("#demo-contract");
  if (!root) return;
  const GOAL = 10;
  const state = {
    owner: "Alice", total: 0, closed: false,
    deposits: { Alice: 0, Bob: 0, Carol: 0 },
    wallets: { Alice: 5, Bob: 8, Carol: 6 },
    block: 19_000_000
  };
  const log = $("#c-log", root), who = $("#c-who", root), amt = $("#c-amount", root);
  const view = $("#c-state", root);
  function line(cls, txt) {
    const d = document.createElement("div");
    d.className = cls;
    d.textContent = txt;
    log.prepend(d);
  }
  function render() {
    view.innerHTML = `
      <div class="stat">owner : <b>${state.owner}</b></div>
      <div class="stat">objectif : <b>${GOAL} ETH</b></div>
      <div class="stat">total collecté : <b>${fmt(state.total, 3)} ETH</b></div>
      <div class="stat">état : <b>${state.closed ? "clôturée" : "ouverte"}</b></div>
      <div class="bar-track" style="margin:10px 0"><div class="bar-fill l" style="width:${Math.min(100, state.total / GOAL * 100)}%"></div></div>
      <div class="stat">Soldes wallets : ${Object.entries(state.wallets).map(([k, v]) => `${k} <b>${fmt(v, 3)}</b>`).join(" · ")}</div>`;
  }
  function tx(fn, gas, body) {
    state.block++;
    const sender = who.value;
    const fee = gas * 20e-9; // 20 gwei
    try {
      if (state.wallets[sender] < fee) throw new Error("solde insuffisant pour payer le gas");
      body(sender);
      state.wallets[sender] -= fee;
      line("ok", `#${state.block} ✔ ${sender}.${fn} — ${fmt(gas, 0)} gas (${fmt(fee, 5)} ETH)`);
    } catch (e) {
      state.wallets[sender] -= fee * 0.5;
      line("err", `#${state.block} ✖ ${sender}.${fn} → revert("${e.message}") — gas consommé quand même`);
    }
    render();
  }
  $("#c-deposit", root).addEventListener("click", () => tx(`deposer(${amt.value})`, 46_000, s => {
    const v = Number(amt.value);
    if (state.closed) throw new Error("Cagnotte cloturee");
    if (!(v > 0)) throw new Error("Montant nul");
    if (state.wallets[s] < v) throw new Error("solde insuffisant");
    state.wallets[s] -= v; state.deposits[s] += v; state.total += v;
    line("ev", `   ↳ event Depot(${s}, ${v} ETH)`);
  }));
  $("#c-withdraw", root).addEventListener("click", () => tx("retirer()", 32_000, s => {
    if (s !== state.owner) throw new Error("Pas le proprietaire");
    if (state.total < GOAL) throw new Error("Objectif non atteint");
    if (state.closed) throw new Error("Deja retire");
    state.wallets[s] += state.total;
    line("ev", `   ↳ event Retrait(${s}, ${fmt(state.total, 3)} ETH)`);
    state.closed = true;
  }));
  $("#c-refund", root).addEventListener("click", () => tx("rembourser()", 29_000, s => {
    if (state.closed) throw new Error("Cagnotte cloturee");
    const v = state.deposits[s];
    if (!v) throw new Error("Rien a rembourser");
    state.deposits[s] = 0; state.total -= v; state.wallets[s] += v;
    line("ev", `   ↳ event Remboursement(${s}, ${v} ETH)`);
  }));
  line("", "> Contrat Cagnotte déployé à 0x" + randHex(20));
  render();
})();

/* ---------- 8. AMM x·y=k ---------- */
function ammOut(x, y, dx, fee = 0.003) {
  const dxf = dx * (1 - fee);
  return (y * dxf) / (x + dxf);
}
(function ammDemo() {
  const root = $("#demo-amm");
  if (!root) return;
  const pool = { eth: 100, usdc: 300000 };
  const amount = $("#amm-amount", root), dir = $("#amm-dir", root), preview = $("#amm-preview", root);
  const lA = $("#amm-la", root), lB = $("#amm-lb", root), tA = $("#amm-ta", root), tB = $("#amm-tb", root), info = $("#amm-info", root);
  const start = { ...pool };
  function quote() {
    const v = Number(amount.value) || 0;
    const sellEth = dir.value === "eth";
    const [x, y] = sellEth ? [pool.eth, pool.usdc] : [pool.usdc, pool.eth];
    const out = ammOut(x, y, v);
    const spot = y / x;
    const exec = v > 0 ? out / v : spot;
    const impact = v > 0 ? (1 - exec / spot) * 100 : 0;
    return { v, out, sellEth, impact, spot };
  }
  function render() {
    const q = quote();
    preview.innerHTML = q.v > 0
      ? `Tu reçois <b>${fmt(q.out, q.sellEth ? 2 : 5)} ${q.sellEth ? "USDC" : "ETH"}</b> · impact de prix <b style="color:${q.impact > 5 ? "var(--danger)" : "var(--ok)"}">${fmt(q.impact, 2)} %</b> (frais 0,3 % inclus)`
      : "Entre un montant à échanger.";
    const maxA = start.eth * 2, maxB = start.usdc * 2;
    lA.style.height = `${Math.min(100, pool.eth / maxA * 100)}%`;
    lB.style.height = `${Math.min(100, pool.usdc / maxB * 100)}%`;
    tA.textContent = `${fmt(pool.eth, 3)} ETH`;
    tB.textContent = `${fmt(pool.usdc, 0)} USDC`;
    info.innerHTML = `Prix spot : <b>1 ETH = ${fmt(pool.usdc / pool.eth, 2)} USDC</b> · k = x·y = <b>${fmt(pool.eth * pool.usdc, 0)}</b>`;
  }
  amount.addEventListener("input", render);
  dir.addEventListener("change", render);
  $("#amm-swap", root).addEventListener("click", () => {
    const q = quote();
    if (!(q.v > 0)) return;
    if (q.sellEth) { pool.eth += q.v; pool.usdc -= q.out; } else { pool.usdc += q.v; pool.eth -= q.out; }
    render();
  });
  $("#amm-reset", root).addEventListener("click", () => { Object.assign(pool, start); render(); });
  render();
})();

/* ---------- 9. Layers : pile cliquable ---------- */
(function layersDemo() {
  const root = $("#demo-layers");
  if (!root) return;
  const detail = $(".layer-detail", root);
  const tpl = id => document.getElementById(id)?.innerHTML || "";
  const btns = [...root.querySelectorAll(".layer")];
  function show(b) {
    btns.forEach(x => x.classList.toggle("active", x === b));
    detail.innerHTML = tpl(`layer-${b.dataset.l}`);
  }
  btns.forEach(b => b.addEventListener("click", () => show(b)));
  show(btns.find(b => b.dataset.l === "1") || btns[0]);
})();

/* ---------- 10. Rollup : coût par transaction ---------- */
(function rollupDemo() {
  const root = $("#demo-rollup");
  if (!root) return;
  const n = $("#ru-n", root), l1 = $("#ru-l1", root), out = $("#ru-out", root), nv = $("#ru-nv", root), bars = $("#ru-bars", root);
  function calc() {
    const N = Number(n.value), L1 = Number(l1.value);
    nv.textContent = N;
    const batchFixed = L1 * 6;          // publier un lot coûte ~ 6 tx L1 de données + preuve/engagement
    const perTxData = L1 * 0.012;       // données compressées par tx
    const exec = 0.002;                 // exécution sur le L2
    const perTx = batchFixed / N + perTxData + exec;
    const vals = [["Directement sur L1", L1, ""], ["Via rollup (L2)", perTx, "m"]];
    const max = Math.max(...vals.map(v => v[1]));
    bars.innerHTML = vals.map(([k, v, c]) => `
      <div class="bar-row"><span>${k}</span><div class="bar-track"><div class="bar-fill ${c}" style="width:${v / max * 100}%"></div></div><span>${fmt(v, 3)} $</span></div>`).join("");
    out.innerHTML = `En regroupant <b>${N}</b> transactions dans un lot, chacune coûte environ <b>${fmt(perTx, 3)} $</b> au lieu de <b>${fmt(L1, 2)} $</b> — soit <b>${fmt(L1 / perTx, 0)}× moins cher</b>. <span style="opacity:.7">(modèle simplifié)</span>`;
  }
  n.addEventListener("input", calc);
  l1.addEventListener("input", calc);
  calc();
})();

/* ---------- 11. Bridge lock & mint ---------- */
(function bridgeDemo() {
  const root = $("#demo-bridge");
  if (!root) return;
  const s = { userA: 10, vault: 0, userB: 0, hacked: false };
  const view = $("#br-view", root), info = $("#br-info", root);
  function render() {
    const backing = s.userB === 0 ? 100 : Math.min(100, (s.vault / s.userB) * 100);
    view.innerHTML = `
      <div class="demo-row">
        <div class="panel" style="padding:14px">
          <div class="kicker" style="font-size:.66rem">Chaîne A · Ethereum</div>
          <div class="stat">Wallet utilisateur : <b>${fmt(s.userA, 2)} ETH</b></div>
          <div class="stat">Coffre du bridge 🔒 : <b style="color:${s.hacked ? "var(--danger)" : "var(--ok)"}">${fmt(s.vault, 2)} ETH</b></div>
        </div>
        <div class="panel" style="padding:14px">
          <div class="kicker" style="font-size:.66rem">Chaîne B · autre réseau</div>
          <div class="stat">Wallet utilisateur : <b>${fmt(s.userB, 2)} wETH</b></div>
          <div class="stat">Couverture : <b style="color:${backing < 100 ? "var(--danger)" : "var(--ok)"}">${fmt(backing, 0)} %</b></div>
        </div>
      </div>`;
  }
  $("#br-lock", root).addEventListener("click", () => {
    if (s.userA < 1) return;
    s.userA -= 1; s.vault += 1; s.userB += 1;
    info.innerHTML = "1 ETH verrouillé dans le coffre sur A → 1 wETH <b>minté</b> sur B. Le wETH n'est qu'une <b>reconnaissance de dette</b> du coffre.";
    render();
  });
  $("#br-burn", root).addEventListener("click", () => {
    if (s.userB < 1) return;
    s.userB -= 1;
    const back = Math.min(1, s.vault);
    s.vault -= back; s.userA += back;
    info.innerHTML = back === 1 ? "1 wETH <b>brûlé</b> sur B → 1 ETH déverrouillé sur A." : "wETH brûlé… mais le coffre est vide : <b>impossible de récupérer l'ETH</b>.";
    render();
  });
  $("#br-hack", root).addEventListener("click", () => {
    s.vault = 0; s.hacked = true;
    info.innerHTML = "💀 Un attaquant a vidé le coffre (clés compromises ou bug du contrat). Les wETH sur B existent toujours… mais <b>plus rien ne les garantit</b>.";
    render();
  });
  render();
})();

/* ---------- 12. MEV : attaque sandwich ---------- */
(function sandwichDemo() {
  const root = $("#demo-sandwich");
  if (!root) return;
  const victim = $("#sw-victim", root), bot = $("#sw-bot", root), out = $("#sw-out", root);
  function calc() {
    const V = Number(victim.value), B = Number(bot.value);
    let x = 1_000_000, y = 500; // pool USDC / ETH
    const fair = ammOut(x, y, V);
    // 1) le bot achète avant la victime
    const botEth = ammOut(x, y, B); x += B; y -= botEth;
    // 2) la victime achète à un prix dégradé
    const vicEth = ammOut(x, y, V); x += V; y -= vicEth;
    // 3) le bot revend juste après
    const botUsdc = ammOut(y, x, botEth); y += botEth; x -= botUsdc;
    const profit = botUsdc - B;
    out.innerHTML = `
      <ol>
        <li><b>Front-run</b> : le bot voit ta transaction dans la mempool et achète ${fmt(botEth, 3)} ETH avec ${fmt(B, 0)} USDC.</li>
        <li><b>Ta transaction</b> : tu reçois <b>${fmt(vicEth, 4)} ETH</b> au lieu de ${fmt(fair, 4)} ETH (−${fmt((1 - vicEth / fair) * 100, 2)} %).</li>
        <li><b>Back-run</b> : le bot revend et récupère ${fmt(botUsdc, 0)} USDC → profit <b style="color:${profit > 0 ? "var(--danger)" : "var(--muted)"}">${fmt(profit, 2)} USDC</b> (avant frais de gas).</li>
      </ol>`;
  }
  victim.addEventListener("input", calc);
  bot.addEventListener("input", calc);
  calc();
})();

/* ---------- 13. NFT : mint, métadonnées, stockage ---------- */
(function nftDemo() {
  const root = $("#demo-nft");
  if (!root) return;
  const SHAPES = ["Cercle", "Triangle", "Losange", "Hexagone"];
  const PALETTES = [["Cyan", 185], ["Magenta", 310], ["Violet", 265], ["Lime", 85], ["Ambre", 35]];
  const tokens = [];   // { id, owner, hash, storage, broken }
  let serverDown = false;
  const who = $("#nft-who", root), storage = $("#nft-storage", root), gallery = $("#nft-gallery", root);
  const meta = $("#nft-meta", root), table = $("#nft-owners", root), log = $("#nft-log", root);
  let selected = null;

  function traits(hash) {
    const b = i => parseInt(hash.slice(i * 2, i * 2 + 2), 16);
    return {
      forme: SHAPES[b(0) % SHAPES.length],
      couleur: PALETTES[b(1) % PALETTES.length],
      halo: b(2) < 26 ? "Oui (rare, ~10 %)" : "Non",
      bytes: b
    };
  }
  function svgFor(hash) {
    const t = traits(hash), b = t.bytes, h = t.couleur[1];
    const pts = { Cercle: null, Triangle: 3, Losange: 4, Hexagone: 6 }[t.forme];
    const poly = (n, r, rot) => [...Array(n)].map((_, i) => {
      const a = rot + i * 2 * Math.PI / n;
      return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
    }).join(" ");
    let inner = "";
    for (let k = 0; k < 4; k++) {
      const r = 34 - k * 7, rot = b(3 + k) / 255 * Math.PI;
      const col = `hsl(${(h + k * 24) % 360} 100% ${60 - k * 6}%)`;
      inner += pts
        ? `<polygon points="${poly(pts, r, rot)}" fill="none" stroke="${col}" stroke-width="2"/>`
        : `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${col}" stroke-width="2" stroke-dasharray="${2 + b(7 + k) % 9} 3"/>`;
    }
    const halo = t.halo.startsWith("Oui") ? `<circle cx="50" cy="50" r="46" fill="none" stroke="#fff" stroke-width=".8" opacity=".9"/>` : "";
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#060815"/>${halo}${inner}<circle cx="50" cy="50" r="3" fill="hsl(${h} 100% 70%)"/></svg>`;
  }
  const uriOf = tk => tk.storage === "onchain" ? "data:application/json;base64,…"
    : tk.storage === "ipfs" ? `ipfs://bafy${tk.hash.slice(0, 20)}…/${tk.id}.json`
    : `https://api.neonglyphs.example/meta/${tk.id}.json`;
  const available = tk => !(tk.storage === "server" && serverDown);

  function line(cls, txt) {
    const d = document.createElement("div"); d.className = cls; d.textContent = txt; log.prepend(d);
  }
  function render() {
    gallery.innerHTML = tokens.length ? tokens.map(tk => `
      <button class="nft-card ${selected === tk.id ? "on" : ""}" data-id="${tk.id}">
        ${available(tk) ? svgFor(tk.hash) : `<div class="nft-broken">404<br><small>image introuvable</small></div>`}
        <span>#${tk.id} · ${tk.owner}</span>
      </button>`).join("") : `<p class="demo-note">Aucun NFT pour l'instant : clique sur « mint() ».</p>`;
    table.innerHTML = tokens.map(tk => `<tr><td>${tk.id}</td><td>${tk.owner}</td><td style="word-break:break-all">${uriOf(tk)}</td></tr>`).join("")
      || `<tr><td colspan="3" style="color:var(--muted)">mapping vide</td></tr>`;
    const tk = tokens.find(t => t.id === selected);
    if (!tk) { meta.textContent = "Sélectionne un NFT pour voir ses métadonnées."; return; }
    if (!available(tk)) {
      meta.textContent = `GET ${uriOf(tk)}\n→ 404 Not Found\n\nLe token #${tk.id} existe toujours sur la blockchain et appartient toujours à ${tk.owner}…\nmais plus personne ne peut voir à quoi il ressemble.`;
      return;
    }
    const t = traits(tk.hash);
    meta.textContent = JSON.stringify({
      name: `NeonGlyph #${tk.id}`,
      description: "Glyphe génératif dérivé du hash du token.",
      image: tk.storage === "onchain" ? "data:image/svg+xml;base64,…" : tk.storage === "ipfs" ? `ipfs://bafy${tk.hash.slice(20, 40)}…/${tk.id}.svg` : `https://cdn.neonglyphs.example/${tk.id}.svg`,
      attributes: [
        { trait_type: "Forme", value: t.forme },
        { trait_type: "Couleur", value: t.couleur[0] },
        { trait_type: "Halo", value: t.halo }
      ]
    }, null, 2);
  }
  $("#nft-mint", root).addEventListener("click", () => {
    const id = tokens.length + 1;
    const hash = sha256(`NeonGlyphs|${id}|${who.value}|${randHex(8)}`);
    tokens.push({ id, owner: who.value, hash, storage: storage.value });
    selected = id;
    line("ok", `✔ ${who.value}.mint() → tokenId ${id}`);
    line("ev", `   ↳ event Transfer(0x000…000 → ${who.value}, tokenId ${id})`);
    render();
  });
  $("#nft-transfer", root).addEventListener("click", () => {
    const tk = tokens.find(t => t.id === selected);
    const to = $("#nft-to", root).value;
    if (!tk) return line("err", "✖ aucun NFT sélectionné");
    if (tk.owner !== who.value) return line("err", `✖ ${who.value}.transferFrom(#${tk.id}) → revert("pas le proprietaire ni approuve")`);
    if (to === tk.owner) return line("err", "✖ destinataire identique");
    line("ok", `✔ ${tk.owner}.transferFrom(${tk.owner} → ${to}, #${tk.id})`);
    line("ev", `   ↳ event Transfer(${tk.owner} → ${to}, tokenId ${tk.id})`);
    tk.owner = to;
    render();
  });
  $("#nft-server", root).addEventListener("click", e => {
    serverDown = !serverDown;
    e.currentTarget.textContent = serverDown ? "↻ Relancer le serveur" : "💀 Le serveur du projet ferme";
    line(serverDown ? "err" : "ok", serverDown ? "⚠ api.neonglyphs.example ne répond plus" : "✔ serveur de nouveau en ligne");
    render();
  });
  gallery.addEventListener("click", e => {
    const c = e.target.closest(".nft-card"); if (!c) return;
    selected = Number(c.dataset.id); render();
  });
  line("", "> Contrat ERC-721 NeonGlyphs déployé à 0x" + randHex(20));
  render();
})();
