// =====================================================
//  육면체 탐험대 - 5학년 2학기 5단원 직육면체
// =====================================================

const QUESTIONS_PER_ROUND = 10;
const MAX_HEARTS = 3;

// ---------- 도우미 ----------
const $ = (id) => document.getElementById(id);
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// =====================================================
//  1. 개념 문제
// =====================================================
const CONCEPT_POOL = [
  { kind: "choice", q: "직육면체의 면은 모두 몇 개일까요?", a: "6개", c: ["4개", "6개", "8개", "12개"],
    ex: "직육면체는 직사각형 6개로 둘러싸인 도형이에요." },
  { kind: "choice", q: "직육면체의 모서리는 모두 몇 개일까요?", a: "12개", c: ["6개", "8개", "10개", "12개"],
    ex: "면과 면이 만나는 선분이 모서리예요. 위 4개 + 아래 4개 + 옆 4개 = 12개!" },
  { kind: "choice", q: "정육면체의 꼭짓점은 모두 몇 개일까요?", a: "8개", c: ["4개", "6개", "8개", "12개"],
    ex: "모서리와 모서리가 만나는 점이 꼭짓점이에요. 위 4개 + 아래 4개 = 8개!" },
  { kind: "choice", q: "정육면체는 어떤 도형 6개로 둘러싸여 있을까요?", a: "정사각형", c: ["정사각형", "삼각형", "원", "오각형"],
    ex: "정사각형 6개로 둘러싸인 도형을 정육면체라고 해요." },
  { kind: "choice", q: "직육면체는 어떤 도형 6개로 둘러싸여 있을까요?", a: "직사각형", c: ["직사각형", "삼각형", "원", "오각형"],
    ex: "직사각형 6개로 둘러싸인 도형을 직육면체라고 해요." },
  { kind: "choice", q: "직육면체에서 서로 평행한 면은 모두 몇 쌍일까요?", a: "3쌍", c: ["2쌍", "3쌍", "4쌍", "6쌍"],
    ex: "앞-뒤, 왼쪽-오른쪽, 위-아래. 모두 3쌍이에요." },
  { kind: "choice", q: "직육면체에서 한 면과 수직인 면은 몇 개일까요?", a: "4개", c: ["2개", "3개", "4개", "5개"],
    ex: "6개의 면 중 자기 자신과 평행한 면 1개를 빼면 4개가 수직이에요." },
  { kind: "choice", q: "직육면체의 한 꼭짓점에서 만나는 모서리는 몇 개일까요?", a: "3개", c: ["2개", "3개", "4개", "6개"],
    ex: "한 꼭짓점에서 모서리 3개, 면 3개가 만나요." },
  { kind: "choice", q: "직육면체에서 서로 평행한 두 면을 무엇이라고 할까요?", a: "밑면", c: ["밑면", "옆면", "꼭짓점", "모서리"],
    ex: "서로 평행한 두 면을 밑면이라고 하고, 밑면과 수직인 면을 옆면이라고 해요." },
  { kind: "ox", q: "정육면체는 직육면체라고 할 수 있어요.", a: "O",
    ex: "정사각형도 직사각형이니까, 정육면체는 직육면체예요." },
  { kind: "ox", q: "직육면체는 정육면체라고 할 수 있어요.", a: "X",
    ex: "직육면체의 면이 정사각형이 아닐 수도 있어서, 항상 정육면체라고 할 수는 없어요." },
  { kind: "ox", q: "정육면체는 모든 모서리의 길이가 같아요.", a: "O",
    ex: "정육면체는 모든 면이 똑같은 정사각형이라서 12개 모서리의 길이가 모두 같아요." },
  { kind: "ox", q: "직육면체의 한 꼭짓점에서 만나는 면은 3개예요.", a: "O",
    ex: "한 꼭짓점에서 면 3개가 만나요." },
  { kind: "ox", q: "직육면체에서 밑면은 1개예요.", a: "X",
    ex: "서로 평행한 두 면이 밑면이라서 밑면은 2개예요." },
  { kind: "ox", q: "직육면체에서 마주 보는 면은 서로 평행해요.", a: "O",
    ex: "마주 보는 면은 아무리 늘려도 만나지 않으니 서로 평행해요." },
];

// 겨냥도 그림 (보이는 모서리는 실선, 보이지 않는 모서리는 점선)
function sketchSVG(labels) {
  const L = labels
    ? `<text x="90" y="182" text-anchor="middle" class="lbl">${labels[0]}cm</text>
       <text x="198" y="158" text-anchor="middle" class="lbl">${labels[1]}cm</text>
       <text x="10" y="114" text-anchor="end" class="lbl">${labels[2]}cm</text>`
    : "";
  return `
  <svg viewBox="-30 0 270 190" width="270" xmlns="http://www.w3.org/2000/svg">
    <style>.lbl{font:bold 15px sans-serif;fill:#ea580c}</style>
    <polygon points="20,60 160,60 210,20 70,20" fill="#fde68a"/>
    <polygon points="160,60 210,20 210,120 160,160" fill="#fdba74"/>
    <rect x="20" y="60" width="140" height="100" fill="#fef3c7"/>
    <g stroke="#1f2937" stroke-width="2.5" fill="none" stroke-linejoin="round">
      <rect x="20" y="60" width="140" height="100"/>
      <polyline points="20,60 70,20 210,20 160,60"/>
      <polyline points="210,20 210,120 160,160"/>
    </g>
    <g stroke="#6b7280" stroke-width="2" stroke-dasharray="6 5" fill="none">
      <line x1="70" y1="20" x2="70" y2="120"/>
      <line x1="70" y1="120" x2="210" y2="120"/>
      <line x1="70" y1="120" x2="20" y2="160"/>
    </g>
    ${L}
  </svg>`;
}

const SKETCH_POOL = [
  { kind: "choice", q: "겨냥도에서 보이지 않는 모서리(점선)는 몇 개일까요?", a: "3개", c: ["1개", "2개", "3개", "4개"],
    ex: "겨냥도에서는 보이지 않는 모서리 3개를 점선으로 그려요." },
  { kind: "choice", q: "겨냥도에서 보이는 모서리(실선)는 몇 개일까요?", a: "9개", c: ["6개", "8개", "9개", "12개"],
    ex: "모서리 12개 중 점선 3개를 빼면 보이는 모서리는 9개예요." },
  { kind: "choice", q: "겨냥도에서 보이지 않는 꼭짓점은 몇 개일까요?", a: "1개", c: ["1개", "2개", "3개", "4개"],
    ex: "점선 3개가 만나는 뒤쪽 아래 꼭짓점 1개가 보이지 않아요." },
  { kind: "choice", q: "겨냥도에서 보이는 면은 몇 개일까요?", a: "3개", c: ["2개", "3개", "4개", "6개"],
    ex: "앞, 위, 오른쪽 면 3개가 보이고 나머지 3개는 보이지 않아요." },
  { kind: "ox", q: "겨냥도에서 보이지 않는 모서리는 점선으로 그려요.", a: "O",
    ex: "보이는 모서리는 실선, 보이지 않는 모서리는 점선으로 그려요." },
];

function makeFromPool(item, tag, visual = "") {
  return {
    tag, visual,
    kind: item.kind,
    text: item.q,
    choices: item.kind === "choice" ? shuffle(item.c) : ["O", "X"],
    answer: item.a,
    explain: item.ex,
  };
}

// =====================================================
//  2. 전개도 (정육면체 굴리기로 접기 검사)
// =====================================================
// 정육면체를 전개도 위에서 굴리면서 각 칸에 닿는 면을 기록해요.
// 6칸이 모두 다른 면에 닿으면 올바른 전개도예요.
// 면 번호: 0아래 1위 2북 3남 4동 5서 → (0,1)(2,3)(4,5)가 마주 보는 면
function roll(s, dir) {
  const { b, t, n, so, e, w } = s;
  if (dir === "E") return { b: e, e: t, t: w, w: b, n, so };
  if (dir === "W") return { b: w, w: t, t: e, e: b, n, so };
  if (dir === "N") return { b: n, n: t, t: so, so: b, e, w };
  return { b: so, so: t, t: n, n: b, e, w }; // S
}
const DIRS = { E: [1, 0], W: [-1, 0], N: [0, -1], S: [0, 1] };
const key = (x, y) => `${x},${y}`;

function foldFaces(cells) {
  const set = new Set(cells.map(([x, y]) => key(x, y)));
  const faces = {};
  const stack = [[cells[0][0], cells[0][1], { b: 0, t: 1, n: 2, so: 3, e: 4, w: 5 }]];
  faces[key(...cells[0])] = 0;
  while (stack.length) {
    const [x, y, s] = stack.pop();
    for (const [d, [dx, dy]] of Object.entries(DIRS)) {
      const k = key(x + dx, y + dy);
      if (set.has(k) && !(k in faces)) {
        const ns = roll(s, d);
        faces[k] = ns.b;
        stack.push([x + dx, y + dy, ns]);
      }
    }
  }
  return faces; // { "x,y": 면번호 }
}
const isValidNet = (cells) => new Set(Object.values(foldFaces(cells))).size === 6;
const opposite = (f) => f ^ 1;

function has2x2(cells) {
  const set = new Set(cells.map(([x, y]) => key(x, y)));
  return cells.some(([x, y]) =>
    set.has(key(x + 1, y)) && set.has(key(x, y + 1)) && set.has(key(x + 1, y + 1)));
}

function randomHexomino() {
  const cells = [[0, 0]];
  const set = new Set(["0,0"]);
  while (cells.length < 6) {
    const [x, y] = pick(cells);
    const [dx, dy] = pick(Object.values(DIRS));
    const k = key(x + dx, y + dy);
    if (!set.has(k)) { set.add(k); cells.push([x + dx, y + dy]); }
  }
  const minX = Math.min(...cells.map((c) => c[0]));
  const minY = Math.min(...cells.map((c) => c[1]));
  return cells.map(([x, y]) => [x - minX, y - minY]);
}

function makeNet(wantValid) {
  for (let i = 0; i < 2000; i++) {
    const h = randomHexomino();
    if (isValidNet(h) !== wantValid) continue;
    // 틀린 전개도는 너무 쉬운 네모 덩어리(2×2)를 되도록 피해요
    if (!wantValid && has2x2(h) && i < 1500) continue;
    return h;
  }
  return [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]]; // 예비용 십자 모양
}

const PAIR_COLORS = ["#fca5a5", "#93c5fd", "#86efac"];

// opts: { star, reveal, picked, answerKey }
function netSVG(cells, opts = {}) {
  const S = 52;
  const W = (Math.max(...cells.map((c) => c[0])) + 1) * S;
  const H = (Math.max(...cells.map((c) => c[1])) + 1) * S;
  const faces = foldFaces(cells);
  const counts = {};
  Object.values(faces).forEach((f) => (counts[f] = (counts[f] || 0) + 1));

  const rects = cells.map(([x, y]) => {
    const k = key(x, y);
    let fill = "#fef3c7";
    let mark = "";
    if (opts.reveal) {
      if (counts[faces[k]] > 1) { fill = "#f87171"; mark = "겹침"; }
      else fill = PAIR_COLORS[faces[k] >> 1];
    }
    if (k === opts.star) mark = "★";
    let stroke = "#1f2937", sw = 2.5;
    if (opts.picked === k) { stroke = opts.picked === opts.answerKey ? "#16a34a" : "#dc2626"; sw = 5; }
    else if (opts.reveal && k === opts.answerKey) { stroke = "#16a34a"; sw = 5; }
    return `
      <rect class="net-cell" data-key="${k}" x="${x * S + 3}" y="${y * S + 3}" width="${S}" height="${S}"
        fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
      <text x="${x * S + 3 + S / 2}" y="${y * S + 3 + S / 2 + 7}" text-anchor="middle"
        style="font:bold ${mark === "★" ? 24 : 14}px sans-serif;fill:${mark === "★" ? "#ea580c" : "#7f1d1d"};pointer-events:none">${mark}</text>`;
  }).join("");

  return `<svg viewBox="0 0 ${W + 6} ${H + 6}" width="${W + 6}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

function netOXQuestion() {
  const valid = Math.random() < 0.5;
  const cells = makeNet(valid);
  return {
    tag: "🧩 전개도",
    kind: "ox",
    text: "이 그림은 정육면체의 전개도일까요?",
    visual: netSVG(cells),
    choices: ["O", "X"],
    answer: valid ? "O" : "X",
    explain: valid
      ? "맞아요! 접으면 정육면체가 돼요. 같은 색끼리 접었을 때 마주 보는 면이에요."
      : "접으면 빨간 면끼리 겹쳐서 정육면체가 될 수 없어요.",
    reveal: () => netSVG(cells, { reveal: true }) +
      (valid ? `<p class="legend">같은 색 = 접었을 때 마주 보는 면</p>` : ""),
  };
}

function netOppositeQuestion() {
  const cells = makeNet(true);
  const faces = foldFaces(cells);
  const starCell = pick(cells);
  const star = key(...starCell);
  const answerKey = Object.keys(faces).find((k) => faces[k] === opposite(faces[star]));
  return {
    tag: "🧩 전개도",
    kind: "click",
    text: "전개도를 접었을 때 <b>★ 면과 마주 보는 면</b>을 눌러 보세요.",
    visual: netSVG(cells, { star }),
    answer: answerKey,
    explain: "같은 색끼리 접었을 때 마주 보는(평행한) 면이에요. 마주 보는 면은 바로 옆에 붙어 있지 않아요!",
    reveal: (picked) => netSVG(cells, { star, reveal: true, picked, answerKey }) +
      `<p class="legend">같은 색 = 접었을 때 마주 보는 면</p>`,
  };
}

// =====================================================
//  3. 모서리 길이 문제
// =====================================================
function edgeQuestion() {
  const type = rand(0, 3);
  if (type === 0) {
    const a = rand(2, 12);
    return {
      tag: "📏 모서리 길이", kind: "input", unit: "cm",
      text: `한 모서리의 길이가 <b>${a}cm</b>인 정육면체가 있어요.<br>모든 모서리 길이의 합은 몇 cm일까요?`,
      answer: String(a * 12),
      explain: `정육면체는 길이가 같은 모서리가 12개예요. ${a} × 12 = ${a * 12}(cm)`,
    };
  }
  if (type === 1) {
    const a = rand(2, 10);
    return {
      tag: "📏 모서리 길이", kind: "input", unit: "cm",
      text: `정육면체의 모든 모서리 길이의 합이 <b>${a * 12}cm</b>예요.<br>한 모서리의 길이는 몇 cm일까요?`,
      answer: String(a),
      explain: `모서리가 12개이니까 ${a * 12} ÷ 12 = ${a}(cm)`,
    };
  }
  if (type === 2) {
    const [w, h, d] = [rand(2, 12), rand(2, 12), rand(2, 12)];
    const sum = 4 * (w + h + d);
    return {
      tag: "📏 모서리 길이", kind: "input", unit: "cm",
      text: "이 직육면체의 모든 모서리 길이의 합은 몇 cm일까요?",
      visual: sketchSVG([w, d, h]),
      answer: String(sum),
      explain: `길이가 같은 모서리가 4개씩 3쌍 있어요. (${w} + ${d} + ${h}) × 4 = ${sum}(cm)`,
    };
  }
  // 정육면체인지 판별
  const isCube = Math.random() < 0.5;
  const a = rand(3, 9);
  const dims = isCube ? [a, a, a] : shuffle([a, a, a + rand(1, 4)]);
  return {
    tag: "📏 모서리 길이", kind: "choice",
    text: `가로 <b>${dims[0]}cm</b>, 세로 <b>${dims[1]}cm</b>, 높이 <b>${dims[2]}cm</b>인 상자는 무엇일까요?`,
    choices: ["정육면체", "정육면체가 아닌 직육면체"],
    answer: isCube ? "정육면체" : "정육면체가 아닌 직육면체",
    explain: isCube
      ? "가로, 세로, 높이가 모두 같으면 모든 면이 정사각형이니까 정육면체예요."
      : "길이가 다른 모서리가 있으면 정사각형이 아닌 면이 생겨서 정육면체가 아니에요.",
  };
}

// =====================================================
//  라운드 만들기
// =====================================================
function buildRound(mode) {
  const concept = shuffle(CONCEPT_POOL).map((it) => () => makeFromPool(it, "📐 개념"));
  const sketch = shuffle(SKETCH_POOL).map((it) => () => makeFromPool(it, "📐 겨냥도", sketchSVG()));
  const net = Array.from({ length: 10 }, (_, i) => (i % 2 ? netOXQuestion : netOppositeQuestion));
  const edge = Array.from({ length: 10 }, () => edgeQuestion);

  let gens;
  if (mode === "concept") gens = shuffle([...concept.slice(0, 7), ...sketch.slice(0, 3)]);
  else if (mode === "net") gens = shuffle(net);
  else if (mode === "edge") gens = edge;
  else gens = shuffle([...concept.slice(0, 3), ...sketch.slice(0, 1), ...net.slice(0, 4), ...edge.slice(0, 2)]);

  return gens.slice(0, QUESTIONS_PER_ROUND).map((g) => g());
}

// =====================================================
//  게임 진행
// =====================================================
let state = null;

function showScreen(id) {
  ["titleScreen", "playScreen", "resultScreen"].forEach((s) => $(s).classList.toggle("hidden", s !== id));
}

function getBest() {
  try { return parseInt(localStorage.getItem("cubeGameBest") || "0", 10); } catch { return 0; }
}
function setBest(v) {
  try { localStorage.setItem("cubeGameBest", String(v)); } catch {}
}

function showTitle() {
  const best = getBest();
  $("bestScore").textContent = best ? `🏆 최고 점수: ${best}점` : "";
  showScreen("titleScreen");
}

function startGame(mode) {
  state = { mode, questions: buildRound(mode), index: 0, score: 0, hearts: MAX_HEARTS, combo: 0, correct: 0, answered: false };
  showScreen("playScreen");
  showQuestion();
}

function updateHud() {
  $("hearts").textContent = "❤️".repeat(state.hearts) + "🤍".repeat(MAX_HEARTS - state.hearts);
  $("qCount").textContent = `${state.index + 1} / ${state.questions.length}`;
  $("score").textContent = state.score;
  $("bar").style.width = `${(state.index / state.questions.length) * 100}%`;
}

function showQuestion() {
  const q = state.questions[state.index];
  state.answered = false;
  updateHud();
  $("qTag").textContent = q.tag;
  $("qText").innerHTML = q.kind === "ox" ? `${q.text}<br><small style="color:#6b7280">맞으면 O, 틀리면 X</small>` : q.text;
  $("qVisual").innerHTML = q.visual || "";
  $("qVisual").classList.remove("locked");
  $("feedback").classList.add("hidden");

  const box = $("qAnswer");
  if (q.kind === "choice" || q.kind === "ox") {
    box.innerHTML = `<div class="${q.kind === "ox" ? "ox" : "choices"}">` +
      q.choices.map((c) => `<button class="choice" data-v="${c}">${c === "O" ? "⭕" : c === "X" ? "❌" : c}</button>`).join("") +
      `</div>`;
    box.querySelectorAll(".choice").forEach((b) => b.addEventListener("click", () => submit(b.dataset.v)));
  } else if (q.kind === "input") {
    box.innerHTML = `
      <form class="input-row" id="inputForm">
        <input type="number" id="numInput" inputmode="numeric" required autocomplete="off">
        <span class="unit">${q.unit}</span>
        <button type="submit">확인</button>
      </form>`;
    $("inputForm").addEventListener("submit", (e) => { e.preventDefault(); submit($("numInput").value.trim()); });
    setTimeout(() => $("numInput").focus(), 50);
  } else if (q.kind === "click") {
    box.innerHTML = "";
    $("qVisual").querySelectorAll(".net-cell").forEach((r) =>
      r.addEventListener("click", () => submit(r.dataset.key)));
  }
}

function submit(value) {
  if (state.answered) return;
  const q = state.questions[state.index];
  state.answered = true;
  const ok = String(value) === String(q.answer);

  // 점수와 하트
  if (ok) {
    state.combo++;
    state.correct++;
    state.score += 100 + (state.combo - 1) * 20;
  } else {
    state.combo = 0;
    state.hearts--;
  }
  const comboEl = $("combo");
  comboEl.textContent = state.combo >= 2 ? `🔥 ${state.combo} 콤보!` : "";
  comboEl.classList.remove("pop"); void comboEl.offsetWidth; comboEl.classList.add("pop");
  updateHud();

  // 보기에 정답/오답 표시
  $("qAnswer").querySelectorAll(".choice").forEach((b) => {
    b.disabled = true;
    if (b.dataset.v === String(q.answer)) b.classList.add("correct");
    else if (b.dataset.v === String(value)) b.classList.add("wrong");
  });
  $("qAnswer").querySelectorAll("input, button").forEach((el) => (el.disabled = true));

  if (q.reveal) {
    $("qVisual").innerHTML = q.reveal(value);
    $("qVisual").classList.add("locked");
  }

  if (!ok) {
    const card = document.querySelector(".qcard");
    card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
  }

  // 해설
  const isLast = state.index === state.questions.length - 1 || state.hearts === 0;
  const answerText = q.kind === "input" ? `${q.answer}${q.unit}` : q.kind === "ox" ? (q.answer === "O" ? "⭕" : "❌") : q.kind === "click" ? "" : q.answer;
  const fb = $("feedback");
  fb.className = ok ? "good" : "bad";
  fb.innerHTML = `
    <div class="fb-title">${ok ? pick(["정답! 🎉", "훌륭해요! 👏", "완벽해요! ✨"]) : "아쉬워요 😢"}</div>
    ${!ok && answerText ? `<div>정답: <b>${answerText}</b></div>` : ""}
    <div>${q.explain}</div>
    <button id="nextBtn">${isLast ? "결과 보기" : "다음 문제 ▶"}</button>`;
  $("nextBtn").addEventListener("click", next);
  $("nextBtn").focus();
}

function next() {
  if (state.hearts === 0 || state.index === state.questions.length - 1) return endGame();
  state.index++;
  showQuestion();
}

function endGame() {
  const total = state.questions.length;
  const rate = state.correct / total;
  const stars = state.hearts === 0 ? (rate >= 0.3 ? 1 : 0) : rate >= 0.9 ? 3 : rate >= 0.6 ? 2 : 1;

  $("resultEmoji").textContent = ["😅", "🙂", "😄", "🏆"][stars];
  $("resultTitle").textContent = state.hearts === 0 ? "하트를 다 썼어요!" : ["조금만 더 힘내요!", "잘했어요!", "아주 잘했어요!", "육면체 박사!"][stars];
  $("stars").textContent = "⭐".repeat(stars) + "☆".repeat(3 - stars);
  $("resultCorrect").textContent = `${state.correct} / ${total}`;
  $("resultScore").textContent = `${state.score}점`;

  const best = getBest();
  const isNew = state.score > best;
  if (isNew) setBest(state.score);
  $("newBest").classList.toggle("hidden", !isNew);

  showScreen("resultScreen");
}

// ---------- 버튼 연결 ----------
document.querySelectorAll(".mode").forEach((b) => b.addEventListener("click", () => startGame(b.dataset.mode)));
$("retryBtn").addEventListener("click", () => startGame(state.mode));
$("homeBtn").addEventListener("click", showTitle);
$("quitBtn").addEventListener("click", () => { if (confirm("게임을 그만하고 처음으로 갈까요?")) showTitle(); });

showTitle();
