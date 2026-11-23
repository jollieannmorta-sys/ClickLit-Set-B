/* Teacher Jollie's Reading Adventure (Set 2) – app logic. Content lives in data.js */
(function () {
  "use strict";

  const app = document.getElementById("app");
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const hasTTS = "speechSynthesis" in window;

  /* ---------- tiny helpers ---------- */
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) {
      if (k === "class") e.className = attrs[k];
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    kids.flat().forEach(c => e.append(c instanceof Node ? c : document.createTextNode(c)));
    return e;
  }
  function btn(label, fn, cls) {
    return h("button", { class: "btn " + (cls || ""), onclick: fn, type: "button" }, label);
  }
  const norm = s => s.toLowerCase().replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean);
  function shuffle(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
    return b;
  }
  function shuffled(a) {   // never the same order as the answer (when possible)
    let b = shuffle(a), t = 0;
    while (a.length > 1 && b.every((x, i) => x === a[i]) && t++ < 10) b = shuffle(a);
    return b;
  }

  /* ---------- progress (saved in this browser only) ---------- */
  const KEY = "ra_progress", NAME = "ra_name", SND = "ra_sound";
  const store = {
    get() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } },
    set(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} },
    name() { try { return localStorage.getItem(NAME) || ""; } catch (e) { return ""; } },
    setName(n) { try { localStorage.setItem(NAME, n); } catch (e) {} }
  };
  const ACTS = WORLDS.flatMap(w => w.activities);
  function saveStars(id, stars) {
    const p = store.get();
    if (!p[id] || p[id] < stars) p[id] = stars;
    store.set(p);
  }
  function totals() {
    const p = store.get(); let t = 0;
    ACTS.forEach(a => { t += p[a.id] || 0; });
    return { t, max: ACTS.length * 3 };
  }
  function currentRank() {
    const { t, max } = totals(); const f = t / max;
    let r = RANKS[0];
    RANKS.forEach(x => { if (f >= x.at) r = x; });
    return r;
  }
  function updateWho() {
    const { t, max } = totals();
    const n = store.name();
    document.getElementById("who").textContent = (n ? n + " · " : "") + "⭐ " + t + "/" + max;
  }

  /* ---------- text to speech: the voice pupils hear ---------- */
  let voice = null;
  function pickVoice() {
    if (!hasTTS) return;
    const v = speechSynthesis.getVoices();
    voice = v.find(x => /en[-_]US/i.test(x.lang)) || v.find(x => /^en/i.test(x.lang)) || null;
  }
  if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text, rate, quiet) {
    if (!hasTTS) { if (!quiet) alert("This browser cannot read aloud. Please try Chrome or Edge."); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : "en-US";
    u.rate = rate || 0.9;
    speechSynthesis.speak(u);
  }

  /* ---------- speech recognition: checks what the pupil said ---------- */
  function micCheck(setStatus, onDone) {
    if (hasTTS) speechSynthesis.cancel();
    let finished = false;
    const finish = (alts, err) => { if (!finished) { finished = true; onDone(alts, err); } };
    const r = new SR();
    r.lang = "en-US"; r.maxAlternatives = 5; r.interimResults = false; r.continuous = false;
    r.onresult = e => finish([...e.results[0]].map(a => a.transcript));
    r.onerror = e => finish(null, e.error);
    r.onend = () => finish(null, "no-speech");
    try { r.start(); setStatus("🎤 Listening… read now!"); } catch (e) { finish(null, "start"); }
  }
  function errMsg(err) {
    if (err === "not-allowed" || err === "service-not-allowed") return "Please allow the microphone, then try again.";
    if (err === "network") return "The mic check needs the internet. Please try again.";
    return "I did not hear you. Tap the mic and try again.";
  }
  function align(t, s) {   // which target words were found, in order
    const n = t.length, m = s.length;
    const d = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
    for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++)
      d[i][j] = t[i - 1] === s[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]);
    const marks = Array(n).fill(false);
    let i = n, j = m;
    while (i > 0 && j > 0) {
      if (t[i - 1] === s[j - 1]) { marks[i - 1] = true; i--; j--; }
      else if (d[i - 1][j] >= d[i][j - 1]) i--; else j--;
    }
    return marks;
  }

  /* ---------- fun: stars, sounds, confetti, mascot ---------- */
  const rainbowColors = ["#e8505b", "#f08a00", "#c68a00", "#17a398", "#2f7de1", "#7b3fe4"];
  function rainbow(text) {
    return [...text].map((ch, i) => h("span", { style: "color:" + rainbowColors[i % rainbowColors.length] + ";animation-delay:" + (i * 0.12) + "s" }, ch === " " ? " " : ch));
  }
  function starsEl(n, small) {
    const w = h("span", { class: "starrow" + (small ? " small" : "") });
    for (let i = 0; i < 3; i++) w.append(h("span", { class: "star " + (i < n ? "on" : "off"), style: "animation-delay:" + (i * 0.2) + "s" }, "★"));
    return w;
  }
  let soundOn = true;
  try { soundOn = localStorage.getItem(SND) !== "off"; } catch (e) {}
  let audioCtx = null;
  function tone(freqs, dur) {
    if (!soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const t = audioCtx.currentTime;
      freqs.forEach((f, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = "triangle"; o.frequency.value = f;
        g.gain.setValueAtTime(0.15, t + i * dur);
        g.gain.exponentialRampToValueAtTime(0.001, t + (i + 1) * dur);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(t + i * dur); o.stop(t + (i + 1) * dur);
      });
    } catch (e) {}
  }
  function confetti(n) {
    const E = ["🎉", "⭐", "🌈", "🎈", "✨", "💖", "🐚"];
    const wrap = h("div", { class: "conf", "aria-hidden": "true" });
    for (let i = 0; i < n; i++) {
      wrap.append(h("span", { style: "left:" + (Math.random() * 100) + "%;animation-delay:" + (Math.random() * 0.8) + "s;animation-duration:" + (2 + Math.random() * 1.5) + "s;font-size:" + (16 + Math.random() * 20) + "px" }, E[i % E.length]));
    }
    document.body.append(wrap);
    setTimeout(() => wrap.remove(), 4500);
  }
  const win = () => { tone([660, 880, 1100], 0.1); confetti(10); };
  const lose = () => tone([260, 200], 0.16);
  const CHEERS = ["Great job!", "Super reading!", "Awesome!", "You did it!", "Fantastic!", "Hooray!", "Wonderful!"];
  const cheer = () => "🌟 " + CHEERS[Math.floor(Math.random() * CHEERS.length)];
  function pictureStrip(sentence) {
    const seen = [];
    norm(sentence).forEach(w => { if (PICS[w] && !seen.includes(PICS[w])) seen.push(PICS[w]); });
    return seen.length ? h("div", { class: "pics" }, seen.slice(0, 5).join(" ")) : "";
  }
  function theme(world) { app.style.setProperty("--lc", world ? world.color : "#1e88e5"); }
  const soundBtn = document.getElementById("soundBtn");
  function showSound() { soundBtn.textContent = soundOn ? "🔊" : "🔇"; }
  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn; showSound();
    try { localStorage.setItem(SND, soundOn ? "on" : "off"); } catch (e) {}
    if (soundOn) tone([660, 880], 0.1);
  });
  showSound();

  /* ---------- screens ---------- */
  const ICONS = { words: "🗣️", sentences: "📖", picmatch: "🖼️", build: "🧩", spell: "⌨️", scramble: "🔀", cloze: "✏️", match: "🔗", quiz: "❓", passage: "📄" };
  const KIND = { words: "Read the words aloud", sentences: "Read aloud", picmatch: "Picture match", build: "Build it", spell: "Listen and spell", scramble: "Put in order", cloze: "Fill the blank", match: "Match them", quiz: "Quiz time", passage: "Read and answer" };
  const INSTR = {
    words: "Tap Listen to hear the word. Then tap Say it and read the word.",
    sentences: "Tap Listen to hear it. Then tap Read it and read the sentence out loud.",
    picmatch: "Look at the picture. Tap the word that names it.",
    build: "Listen, then tap the tiles in the right order to build the word. Tap a filled box to take it back.",
    spell: "Tap Hear it, then type the word you hear.",
    scramble: "Tap the pieces in the right order. Tap a filled box to take it back.",
    cloze: "Pick the word that fits the blank.",
    match: "Tap a word on the left, then tap its match on the right.",
    quiz: "Choose the best answer.",
    passage: "Choose the best answer. You can open the passage again."
  };

  function home() {
    app.innerHTML = "";
    theme(null);
    updateWho();
    const p = store.get();
    const r = currentRank(), { t, max } = totals();
    app.append(
      h("div", { class: "school-card" },
        h("img", { src: SITE.logo, alt: SITE.school + " logo" }),
        h("div", {}, h("div", { class: "sn" }, SITE.school), h("div", { class: "sp" }, "📍 " + SITE.place))),
      h("div", { class: "ribbon" }, "👩‍🏫 " + SITE.corner),
      h("h1", { class: "hero" }, rainbow("Reading Adventure"), " 🧭"),
      h("div", { class: "owl" },
        h("span", { class: "owl-face" }, "🦜"),
        h("div", { class: "bubble" }, "Squawk! I'm Kiko, " + SITE.owner + "'s helper. Follow the map, finish each island and collect your badges!"))
    );
    const nameIn = h("input", { type: "text", placeholder: "Type your name", value: store.name(), "aria-label": "Your name" });
    nameIn.addEventListener("input", () => { store.setName(nameIn.value.trim()); updateWho(); });
    app.append(h("div", { class: "row" }, h("label", {}, "Name: "), nameIn));

    if (!SR) app.append(h("div", { class: "note" },
      "🎤 The mic check works on Chrome or Edge. On this browser you can still listen and use the self-check buttons."));

    app.append(h("div", { class: "rank" },
      h("div", { class: "rk" }, r.emoji),
      h("div", { class: "grow" },
        h("div", { class: "rn" }, "Rank: " + r.name),
        h("div", { class: "muted" }, t + " of " + max + " stars"),
        h("div", { class: "mini", style: "--tc:#ffb703" }, h("span", { style: "width:" + Math.round(t / max * 100) + "%" })))));

    const trail = h("div", { class: "trail" });
    WORLDS.forEach((w, i) => {
      const got = w.activities.reduce((s, a) => s + (p[a.id] || 0), 0);
      const mx = w.activities.length * 3;
      const done = w.activities.every(a => (p[a.id] || 0) >= 1);
      trail.append(h("div", { class: "stop" },
        h("div", { class: "num", style: "--tc:" + w.color }, done ? "🏅" : String(i + 1)),
        h("button", { class: "tile", style: "--tc:" + w.color, onclick: () => worldScreen(w) },
          h("div", { class: "row0" },
            h("span", { class: "wem" }, w.emoji),
            h("div", {}, h("div", { class: "t" }, w.title), h("div", { class: "muted" }, w.desc))),
          h("div", { class: "mini" }, h("span", { style: "width:" + Math.round(got / mx * 100) + "%" })),
          h("div", { class: "stars" }, "⭐ " + got + "/" + mx + (done ? "  ·  Badge earned!" : "")))));
    });
    app.append(trail,
      h("div", { class: "row" },
        btn("🏆 My certificate", certScreen, "alt"),
        btn("🖨️ My score sheet", sheetScreen, "alt"),
        btn("🖨️ Class record sheet", classSheet, "alt"),
        btn("Reset my stars", () => {
          if (confirm("Erase all stars on this device?")) { store.set({}); home(); }
        }, "alt")));
  }

  function worldScreen(world) {
    app.innerHTML = "";
    theme(world);
    const p = store.get();
    app.append(
      h("button", { class: "back", onclick: home }, "⬅ Back to the map"),
      h("h1", {}, world.emoji + " " + world.title),
      h("div", { class: "owl" },
        h("span", { class: "owl-face" }, "🦜"),
        h("div", { class: "bubble" }, world.desc + " Choose an activity!"))
    );
    world.activities.forEach(a => {
      app.append(h("button", { class: "act", onclick: () => startActivity(world, a) },
        h("span", { class: "ic" }, ICONS[a.type] || "⭐"),
        h("span", { class: "tt" }, a.title, h("small", {}, KIND[a.type] || "")),
        starsEl(p[a.id] || 0, true)));
    });
  }

  function startActivity(world, act) {
    theme(world);
    if (act.type === "passage") return passageIntro(world, act);
    runActivity(world, act);
  }

  function passageBlock(text, open) {
    const d = h("details", { class: "pass" },
      h("summary", {}, "📄 Passage"),
      h("p", { class: "passage" }, text),
      h("div", { class: "row" }, btn("🔊 Listen to the passage", () => speak(text, 0.9), "listen")));
    if (open) d.open = true;
    return d;
  }

  function passageIntro(world, act) {
    app.innerHTML = "";
    app.append(
      h("button", { class: "back", onclick: () => worldScreen(world) }, "⬅ " + world.title),
      h("h2", {}, act.title),
      ART[act.id] ? h("div", { class: "art" }, ART[act.id]) : "",
      h("p", { class: "muted" }, "Read the passage (or listen to it). Then answer the questions."),
      h("div", { class: "card" }, passageBlock(act.passage, true),
        h("div", { class: "row center" }, btn("Start questions ➡", () => runActivity(world, act))))
    );
  }

  function runActivity(world, act) {
    const items = act.items;
    let i = 0, correct = 0;
    const kind = act.type === "passage" || act.type === "picmatch" ? "quiz" : act.type;

    function step() {
      if (i >= items.length) return finish();
      app.innerHTML = "";
      const bar = h("div", { class: "progress" }, h("span", { style: "width:" + Math.round(i / items.length * 100) + "%" }));
      const card = h("div", { class: "card" });
      const nextRow = h("div", { class: "row center" });
      let answered = false;

      const done = ok => {
        if (answered) return;
        answered = true;
        if (ok) correct++;
        nextRow.innerHTML = "";
        nextRow.append(btn(i === items.length - 1 ? "Finish ✅" : "Next ➡", () => { i++; step(); }, "good"));
      };
      nextRow.append(btn("Skip", () => { answered = true; i++; step(); }, "alt"));

      app.append(
        h("button", { class: "back", onclick: () => worldScreen(world) }, "⬅ " + world.title),
        h("h2", {}, act.title + "  (" + (i + 1) + "/" + items.length + ")"),
        h("p", { class: "instr" }, INSTR[act.type] || ""),
        bar, ART[act.id] ? h("div", { class: "art" }, ART[act.id]) : "", card, nextRow);
      RENDER[kind](items[i], card, done, act);
    }

    function finish() {
      const ratio = correct / items.length;
      const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.4 ? 1 : 0;
      saveStars(act.id, stars);
      updateWho();
      const idx = world.activities.indexOf(act);
      const nextAct = world.activities[idx + 1];
      const msg = stars === 3 ? "Excellent! You are a reading star! 🎉" : stars === 2 ? "Very good! Keep going! 👏" :
        stars === 1 ? "Nice try! Practice once more. 💪" : "Let's listen again and try one more time. 🌱";
      const worldDone = world.activities.every(a => (store.get()[a.id] || 0) >= 1);
      app.innerHTML = "";
      app.append(h("div", { class: "card" },
        h("h2", { class: "center" }, act.title),
        h("div", { class: "result-stars" }, starsEl(stars)),
        h("p", { class: "center" }, correct + " out of " + items.length + " correct"),
        h("div", { class: "owl" }, h("span", { class: "owl-face" }, "🦜"),
          h("div", { class: "bubble" }, msg, h("span", { class: "sign" }, "– " + SITE.owner))),
        worldDone ? h("p", { class: "center" }, "🏅 You earned the " + world.title + " badge!") : "",
        h("div", { class: "row center" },
          btn("🔁 Try again", () => runActivity(world, act), "alt"),
          nextAct ? btn("Next activity ➡", () => startActivity(world, nextAct)) : "",
          btn("Back to " + world.title, () => worldScreen(world), "alt"))));
      if (stars) confetti(stars === 3 ? 70 : 25);
    }
    step();
  }

  /* ---------- activity renderers ---------- */
  const RENDER = {
    /* read a word aloud (mic check) */
    words(item, card, done) {
      const hasSyl = item.syl && item.syl.includes("-");
      if (PICS[item.w]) card.append(h("div", { class: "pic" }, PICS[item.w]));
      card.append(h("div", { class: "big" }, item.w));
      if (hasSyl) card.append(h("div", { class: "syl" }, item.syl.split("-").join(" · ")));
      const fb = h("div", { class: "fb" });
      const row = h("div", { class: "row center" });
      row.append(btn("🔊 Listen", () => speak(item.w, 0.85), "listen"));
      if (hasSyl) row.append(btn("🐢 Slow", () => speak(item.syl.split("-").join(", "), 0.6), "slow"));

      if (SR) {
        let tries = 0;
        const mic = btn("🎤 Say it", () => {
          mic.disabled = true; mic.classList.add("pulse"); fb.className = "fb";
          micCheck(t => fb.textContent = t, (alts, err) => {
            mic.disabled = false; mic.classList.remove("pulse");
            if (!alts) { fb.className = "fb bad"; fb.textContent = errMsg(err); return; }
            const target = norm(item.w).join("");
            const ok = alts.some(a => norm(a).join("") === target || norm(a).includes(target));
            if (ok) { fb.className = "fb good"; fb.textContent = cheer(); win(); done(true); }
            else {
              tries++;
              fb.className = "fb bad";
              lose(); fb.textContent = "I heard “" + alts[0] + "”. Tap Listen, then try again.";
              if (tries >= 2) done(false);
            }
          });
        }, "mic");
        row.append(mic);
      } else {
        row.append(
          btn("✅ I said it right", () => { fb.className = "fb good"; fb.textContent = "Good job!"; done(true); }, "good"),
          btn("🔁 Not yet", () => { fb.className = "fb bad"; fb.textContent = "Listen again and say it out loud."; }, "alt"));
      }
      card.append(row, fb);
    },

    /* read a sentence aloud (mic check) */
    sentences(item, card, done) {
      const words = item.split(/\s+/);
      const targets = words.map(w => norm(w).join(""));
      const spans = words.map(w => h("span", { class: "w" }, w));
      const box = h("div", { class: "sent" });
      spans.forEach(s => { box.append(s, " "); });
      const fb = h("div", { class: "fb" });
      const row = h("div", { class: "row center" });
      row.append(
        btn("🔊 Listen", () => speak(item, 0.85), "listen"),
        btn("🐢 Slow", () => speak(item, 0.6), "slow"));

      if (SR) {
        let tries = 0;
        const mic = btn("🎤 Read it", () => {
          mic.disabled = true; mic.classList.add("pulse"); fb.className = "fb";
          micCheck(t => fb.textContent = t, (alts, err) => {
            mic.disabled = false; mic.classList.remove("pulse");
            if (!alts) { fb.className = "fb bad"; fb.textContent = errMsg(err); return; }
            let best = null, bestCount = -1;
            alts.forEach(a => {
              const marks = align(targets, norm(a));
              const c = marks.filter(Boolean).length;
              if (c > bestCount) { bestCount = c; best = marks; }
            });
            spans.forEach((s, k) => { s.className = "w " + (best[k] ? "ok" : "miss"); });
            const ok = bestCount / words.length >= 0.8;
            tries++;
            if (ok) { fb.className = "fb good"; fb.textContent = cheer() + " " + bestCount + " of " + words.length + " words."; win(); done(true); }
            else {
              fb.className = "fb bad";
              lose(); fb.textContent = "Red words need practice. Listen, then try again. (" + bestCount + " of " + words.length + ")";
              if (tries >= 2) done(false);
            }
          });
        }, "mic");
        row.append(mic);
      } else {
        row.append(
          btn("✅ I read it right", () => { fb.className = "fb good"; fb.textContent = "Good job!"; done(true); }, "good"),
          btn("🔁 Not yet", () => { fb.className = "fb bad"; fb.textContent = "Listen again and read it out loud."; }, "alt"));
      }
      card.append(pictureStrip(item), box, row, fb);
    },

    /* multiple choice (also used for passages and picture match) */
    quiz(item, card, done, act) {
      if (act.passage) card.append(passageBlock(act.passage, false));
      if (item.pic) card.append(h("div", { class: "pic" }, item.pic));
      else card.append(h("h2", {}, item.q));
      const row = h("div", { class: "row" });
      if (item.say) row.append(btn("🔊 Listen", () => speak(item.say, 0.8), "listen"));
      if (!item.pic && (!item.say || item.q.length > 40)) row.append(btn("🔊 Read question", () => speak(item.q, 0.9), "listen"));
      const fb = h("div", { class: "fb" });
      const opts = h("div", { class: "opts" + (item.pic ? " pics-opts" : "") });
      const buttons = item.options.map((o, k) => {
        const b = h("button", { class: "opt", type: "button" }, o);
        b.addEventListener("click", () => {
          buttons.forEach(x => x.disabled = true);
          if (item.pic) speak(item.options[item.a], 0.85, true);
          if (k === item.a) {
            b.classList.add("right"); fb.className = "fb good"; fb.textContent = cheer(); win(); done(true);
          } else {
            b.classList.add("wrong"); lose(); buttons[item.a].classList.add("right");
            fb.className = "fb bad"; fb.textContent = "The answer is: " + item.options[item.a]; done(false);
          }
        });
        opts.append(b);
        return b;
      });
      card.append(row, opts, fb);
    },

    /* fill in the blank */
    cloze(item, card, done) {
      const ans = item.options[item.a];
      const parts = item.s.split("___");
      const blank = h("span", { class: "blank" }, "    ");
      const full = parts[0] + ans + (parts[1] || "");
      card.append(h("div", { class: "cloze" }, parts[0], blank, parts[1] || ""));
      const row = h("div", { class: "row center" }, btn("🔊 Read the sentence", () => speak(parts[0] + " blank " + (parts[1] || ""), 0.9), "listen"));
      const fb = h("div", { class: "fb" });
      const opts = h("div", { class: "opts" });
      let tries = 0;
      const buttons = shuffle(item.options).map(o => {
        const b = h("button", { class: "opt", type: "button" }, o);
        b.addEventListener("click", () => {
          if (o === ans) {
            buttons.forEach(x => x.disabled = true);
            b.classList.add("right"); blank.textContent = ans; blank.classList.add("ok");
            fb.className = "fb good"; fb.textContent = cheer(); win(); speak(full, 0.9, true); done(tries === 0 || tries === 1);
          } else {
            tries++; b.disabled = true; b.classList.add("wrong"); lose();
            if (tries >= 2) {
              buttons.forEach(x => x.disabled = true);
              buttons.find(x => x.textContent === ans).classList.add("right");
              blank.textContent = ans; fb.className = "fb bad"; fb.textContent = "The answer is: " + ans; done(false);
            } else { fb.className = "fb bad"; fb.textContent = "Not that one. Try again!"; }
          }
        });
        opts.append(b);
        return b;
      });
      card.append(row, opts, fb);
    },

    /* hear a word and type it */
    spell(item, card, done) {
      let tries = 0, finished = false;
      const fb = h("div", { class: "fb" });
      const input = h("input", { type: "text", class: "spell", autocomplete: "off", autocapitalize: "none", spellcheck: "false", maxlength: "24", "aria-label": "Type the word you hear" });
      const check = () => {
        if (finished) return;
        const v = input.value.trim().toLowerCase();
        if (!v) return;
        if (v === item.w) {
          finished = true; input.disabled = true;
          fb.className = "fb good"; fb.textContent = cheer() + (PICS[item.w] ? " " + PICS[item.w] : ""); win(); done(true);
        } else {
          tries++; lose();
          if (tries >= 2) {
            finished = true; input.disabled = true; input.value = item.w;
            fb.className = "fb bad"; fb.textContent = "The word is “" + item.w + "”."; done(false);
          } else {
            fb.className = "fb bad";
            fb.textContent = "Almost! It starts with “" + item.w[0] + "” and has " + item.w.length + " letters. Listen again!";
          }
        }
      };
      input.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
      card.append(
        h("div", { class: "pic small" }, "🎧"),
        h("div", { class: "row center" },
          btn("🔊 Hear it", () => speak(item.w, 0.8), "listen"),
          btn("🐢 Slow", () => speak(item.w.split("").join(" "), 0.5), "slow")),
        input,
        h("div", { class: "row center" }, btn("Check ✔", check, "good")),
        fb);
      setTimeout(() => { try { input.focus(); } catch (e) {} }, 50);
    },

    /* tap tiles to build a word (letters, digraphs or syllables) */
    build(item, card, done) {
      const parts = item.parts || (item.syl && item.syl.includes("-") ? item.syl.split("-") : item.w.split(""));
      const tiles = shuffled(parts.map((t, i) => ({ t, i })));
      let chosen = [], tries = 0, locked = false;
      if (PICS[item.w]) card.append(h("div", { class: "pic small" }, PICS[item.w]));
      const slots = h("div", { class: "slots" }), pool = h("div", { class: "pool" });
      const fb = h("div", { class: "fb" });

      function draw() {
        slots.innerHTML = ""; pool.innerHTML = "";
        parts.forEach((_, k) => {
          const c = chosen[k];
          const s = h("button", { class: "slot" + (c ? " filled" : ""), type: "button", "aria-label": c ? "Remove " + c.t : "Empty" }, c ? c.t : "");
          if (c) s.addEventListener("click", () => { if (locked) return; chosen.splice(k, 1); draw(); });
          slots.append(s);
        });
        tiles.forEach(tl => {
          const used = chosen.includes(tl);
          const b = h("button", { class: "tilebtn", type: "button" }, tl.t);
          b.disabled = used;
          if (!used) b.addEventListener("click", () => {
            if (locked) return;
            chosen.push(tl); draw();
            if (chosen.length === parts.length) check();
          });
          pool.append(b);
        });
      }
      function check() {
        const got = chosen.map(c => c.t).join("");
        if (got === item.w) {
          locked = true; slots.classList.add("ok");
          fb.className = "fb good"; fb.textContent = cheer(); win(); speak(item.w, 0.85, true); done(true);
        } else {
          tries++; lose(); locked = true; slots.classList.add("bad");
          fb.className = "fb bad"; fb.textContent = tries >= 2 ? "The word is “" + item.w + "”." : "Not quite. Listen and try again!";
          setTimeout(() => {
            slots.classList.remove("bad");
            if (tries >= 2) { chosen = parts.map(t => ({ t })); draw(); pool.innerHTML = ""; done(false); }
            else { chosen = []; locked = false; draw(); }
          }, 800);
        }
      }
      card.append(
        h("div", { class: "row center" },
          btn("🔊 Listen", () => speak(item.w, 0.8), "listen"),
          item.syl && item.syl.includes("-") ? btn("🐢 Slow", () => speak(item.syl.split("-").join(", "), 0.6), "slow") : ""),
        slots, pool, fb);
      draw();
    },

    /* put words (or story lines) in order */
    scramble(item, card, done) {
      const tokens = item.tokens || item.s.match(/\S+/g);
      const isLong = tokens.some(t => t.length > 16);
      const tiles = shuffled(tokens.map((t, i) => ({ t, i })));
      let chosen = [], tries = 0, locked = false;
      const slots = h("div", { class: "slots" + (isLong ? " long" : "") }), pool = h("div", { class: "pool" + (isLong ? " long" : "") });
      const fb = h("div", { class: "fb" });

      function draw() {
        slots.innerHTML = ""; pool.innerHTML = "";
        tokens.forEach((_, k) => {
          const c = chosen[k];
          const s = h("button", { class: "slot" + (c ? " filled" : ""), type: "button", "aria-label": c ? "Remove " + c.t : "Empty" }, c ? c.t : (isLong ? (k + 1) + "." : ""));
          if (c) s.addEventListener("click", () => { if (locked) return; chosen.splice(k, 1); draw(); });
          slots.append(s);
        });
        tiles.forEach(tl => {
          const used = chosen.includes(tl);
          const b = h("button", { class: "tilebtn", type: "button" }, tl.t);
          b.disabled = used;
          if (!used) b.addEventListener("click", () => {
            if (locked) return;
            chosen.push(tl); draw();
            if (chosen.length === tokens.length) check();
          });
          pool.append(b);
        });
      }
      function check() {
        const got = chosen.map(c => c.t).join(" ");
        const want = tokens.join(" ");
        if (got === want) {
          locked = true; slots.classList.add("ok");
          fb.className = "fb good"; fb.textContent = cheer(); win();
          if (item.s) speak(item.s, 0.9, true);
          done(true);
        } else {
          tries++; lose(); locked = true; slots.classList.add("bad");
          fb.className = "fb bad";
          fb.textContent = tries >= 2 ? "Here is the right order." : "Not yet. Check the order and try again!";
          setTimeout(() => {
            slots.classList.remove("bad");
            if (tries >= 2) {
              chosen = tokens.map(t => ({ t }));
              draw(); pool.innerHTML = ""; done(false);
            } else { chosen = []; locked = false; draw(); }
          }, 800);
        }
      }
      if (item.s) card.append(h("div", { class: "row center" },
        btn("🔊 Listen", () => speak(item.s, 0.85), "listen"),
        btn("🐢 Slow", () => speak(item.s, 0.6), "slow")));
      card.append(slots, pool, fb);
      draw();
    },

    /* match pairs */
    match(item, card, done) {
      const L = item.pairs.map((p, i) => ({ t: p[0], i }));
      const R = shuffled(item.pairs.map((p, i) => ({ t: p[1], i })));
      let sel = null, selBtn = null, solved = 0, miss = 0;
      const fb = h("div", { class: "fb" });
      const grid = h("div", { class: "match" });
      const lbs = [];
      const rbs = [];
      const n = item.pairs.length;
      for (let r = 0; r < n; r++) {
        const lb = h("button", { class: "mbtn L", type: "button" }, L[r].t);
        const rb = h("button", { class: "mbtn R", type: "button" }, R[r].t);
        lbs.push(lb); rbs.push(rb);
        lb.addEventListener("click", () => {
          lbs.forEach(x => x.classList.remove("sel"));
          sel = L[r]; selBtn = lb; lb.classList.add("sel");
          speak(L[r].t, 0.9, true);
        });
        rb.addEventListener("click", () => {
          if (!sel) { fb.className = "fb"; fb.textContent = "Tap a word on the left first."; return; }
          if (sel.i === R[r].i) {
            selBtn.classList.remove("sel"); selBtn.classList.add("right"); selBtn.disabled = true;
            rb.classList.add("right"); rb.disabled = true;
            sel = null; selBtn = null; solved++;
            tone([700, 900], 0.08);
            fb.className = "fb good"; fb.textContent = "✔ A match!";
            if (solved === n) { fb.textContent = cheer(); win(); done(miss <= 1); }
          } else {
            miss++; lose(); rb.classList.add("wrong");
            setTimeout(() => rb.classList.remove("wrong"), 450);
            fb.className = "fb bad"; fb.textContent = "Not a match. Try another!";
          }
        });
      }
      for (let r = 0; r < n; r++) grid.append(lbs[r], rbs[r]);
      card.append(grid, fb);
    }
  };

  /* ---------- certificate ---------- */
  function certScreen() {
    app.innerHTML = "";
    theme(null);
    const { t, max } = totals();
    const r = currentRank();
    const name = store.name();
    app.append(
      h("button", { class: "back noprint", onclick: home }, "⬅ Back"),
      h("div", { class: "cert" },
        h("img", { class: "cert-logo", src: SITE.logo, alt: "" }),
        h("div", { class: "cert-school" }, SITE.school),
        h("div", { class: "cert-place" }, SITE.place),
        h("div", { class: "cert-title" }, "Certificate of Reading Achievement"),
        h("div", { class: "cert-line" }, "is proudly awarded to"),
        h("div", { class: "cert-name" }, name || "              "),
        h("div", { class: "cert-line" }, "for reading practice in " + SITE.title + " and earning the rank of"),
        h("div", { class: "cert-rank" }, r.emoji + " " + r.name),
        h("div", { class: "cert-line" }, t + " out of " + max + " stars"),
        h("div", { class: "cert-sign" },
          h("div", { class: "sig" }, SITE.owner + ", Teacher"),
          h("div", { class: "sig" }, "Date: " + new Date().toLocaleDateString()))),
      h("div", { class: "row noprint" }, btn("🖨️ Print certificate", () => window.print()),
        h("span", { class: "muted" }, name ? "" : "Tip: go back and type your name first.")));
  }

  /* ---------- printable sheets ---------- */
  function sheetHeader(title) {
    return [
      h("button", { class: "back noprint", onclick: home }, "⬅ Back"),
      h("div", { class: "sheet-head" },
        h("img", { src: SITE.logo, alt: "" }),
        h("div", {}, h("div", { class: "sheet-school" }, SITE.school), h("div", { class: "muted" }, SITE.place))),
      h("h1", {}, title)
    ];
  }

  function sheetScreen() {
    app.innerHTML = "";
    theme(null);
    const p = store.get();
    const body = h("tbody");
    let t = 0, max = 0;
    WORLDS.forEach((w, i) => w.activities.forEach(a => {
      const s = p[a.id] || 0;
      t += s; max += 3;
      body.append(h("tr", {},
        h("td", {}, "World " + (i + 1) + ": " + w.title),
        h("td", {}, a.title),
        h("td", { class: "c" }, s ? "★".repeat(s) + "☆".repeat(3 - s) : "—"),
        h("td", {}, "☐ Excellent  ☐ Good  ☐ Needs practice")));
    }));
    app.append(
      ...sheetHeader(SITE.title + " – Score Sheet"),
      h("p", {}, "Teacher: " + SITE.owner),
      h("p", {}, "Name: " + (store.name() || "______________________") + "      Date: " + new Date().toLocaleDateString()),
      h("table", { class: "sheet" },
        h("thead", {}, h("tr", {},
          h("th", {}, "World"), h("th", {}, "Activity"), h("th", { class: "c" }, "Stars"), h("th", {}, "Teacher's pronunciation rating"))),
        body),
      h("p", {}, "Total stars: " + t + " / " + max + "   ·   Rank: " + currentRank().emoji + " " + currentRank().name),
      h("div", { class: "row noprint" }, btn("🖨️ Print", () => window.print())));
  }

  function classSheet() {
    app.innerHTML = "";
    theme(null);
    const secIn = h("input", { type: "text", class: "line", placeholder: "Section / class", "aria-label": "Section" });
    const countIn = h("input", { type: "number", min: "1", max: "80", value: "41", style: "width:90px", "aria-label": "Number of pupils" });
    const holder = h("div");
    function draw() {
      const n = Math.max(1, Math.min(80, parseInt(countIn.value, 10) || 41));
      const head = h("tr", {},
        h("th", { class: "c" }, "#"), h("th", {}, "Pupil name"),
        WORLDS.map((w, i) => h("th", { class: "c" }, "W" + (i + 1))),
        h("th", { class: "c" }, "Pron."), h("th", {}, "Remarks"));
      const body = h("tbody");
      for (let k = 1; k <= n; k++) {
        body.append(h("tr", {},
          h("td", { class: "c" }, String(k)), h("td", { class: "name" }),
          WORLDS.map(() => h("td", {})), h("td", {}), h("td", { class: "rem" })));
      }
      holder.innerHTML = "";
      holder.append(h("table", { class: "sheet tall" }, h("thead", {}, head), body));
    }
    countIn.addEventListener("input", draw);
    app.append(
      ...sheetHeader(SITE.title + " – Class Reading Record"),
      h("p", {}, "Teacher: " + SITE.owner),
      h("div", { class: "row noprint" }, h("label", {}, "Number of pupils: "), countIn),
      h("p", {}, "Section: ", secIn, "      Date: " + new Date().toLocaleDateString()),
      holder,
      h("p", { class: "muted" }, "W1–W8 = Worlds (write stars or score). Pron. = teacher's pronunciation rating: E Excellent, G Good, N Needs practice."),
      h("div", { class: "row noprint" }, btn("🖨️ Print", () => window.print())));
    draw();
  }

  /* ---------- start ---------- */
  document.title = SITE.title;
  const hs = document.getElementById("homeSchool"), ht = document.getElementById("homeTitle"), fs = document.getElementById("footSchool"), cr = document.getElementById("credit");
  if (ht) ht.textContent = SITE.title;
  if (hs) hs.textContent = SITE.school;
  if (fs) fs.textContent = SITE.school + " · " + SITE.place;
  if (cr) cr.textContent = "👩‍🏫 Made with ❤️ by " + SITE.owner;
  document.getElementById("homeBtn").addEventListener("click", home);
  home();
})();
