const screens = {
  intro: document.getElementById("screen-intro"),
  game: document.getElementById("screen-game"),
  sorry: document.getElementById("screen-sorry"),
  prize: document.getElementById("screen-prize"),
};

const btnStart = document.getElementById("btn-start");
const btnRestart = document.getElementById("btn-restart");
const btnNext = document.getElementById("btn-next");
const btnReplay = document.getElementById("btn-replay");

const grid = document.getElementById("grid");
const matchesEl = document.getElementById("matches");
const totalPairsEl = document.getElementById("totalPairs");

const CONFIG = {
  pairs: [
    { id: "01", img: "images/01.jpg" },
        { id: "02", img: "images/10.jpg" },
    { id: "03", img: "images/03.jpg" },
    { id: "04", img: "images/04.jpg" },
    { id: "05", img: "images/05.jpg" },
    { id: "06", img: "images/06.jpg" },
    // Voeg meer toe voor 8 paren:
    { id: "07", img: "images/07.jpg" },
    { id: "08", img: "images/08.jpg" },
  ],
};

let state = {
  first: null,
  second: null,
  lock: false,
  matches: 0,
  totalPairs: CONFIG.pairs.length,
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildDeck() {
  const double = CONFIG.pairs.flatMap(p => ([
    { pairId: p.id, img: p.img },
    { pairId: p.id, img: p.img },
  ]));
  return shuffle(double);
}

function createCard(card) {
  const tile = document.createElement("button");
  tile.className = "cardTile";
  tile.type = "button";
  tile.dataset.pairId = card.pairId;

  const inner = document.createElement("div");
  inner.className = "inner";

  const back = document.createElement("div");
  back.className = "face back";
  back.textContent = "💘";

  const front = document.createElement("div");
  front.className = "face front";

  const img = document.createElement("img");
  img.src = card.img;
  front.appendChild(img);

  inner.appendChild(back);
  inner.appendChild(front);
  tile.appendChild(inner);

  tile.addEventListener("click", () => onFlip(tile));

  return tile;
}

function resetState() {
  state.first = null;
  state.second = null;
  state.lock = false;
  state.matches = 0;
  state.totalPairs = CONFIG.pairs.length;
  matchesEl.textContent = "0";
  totalPairsEl.textContent = String(state.totalPairs);
}

function renderGame() {
  grid.innerHTML = "";
  resetState();
  const deck = buildDeck();
  deck.forEach(c => grid.appendChild(createCard(c)));
}

function onFlip(tile) {
  if (state.lock) return;
  if (tile.classList.contains("flipped")) return;

  tile.classList.add("flipped");

  if (!state.first) {
    state.first = tile;
    return;
  }

  state.second = tile;
  state.lock = true;

  const isMatch = state.first.dataset.pairId === state.second.dataset.pairId;

  if (isMatch) {
    state.matches++;
    matchesEl.textContent = state.matches;

    state.first = null;
    state.second = null;
    state.lock = false;

    if (state.matches === state.totalPairs) {
      setTimeout(() => showScreen("sorry"), 600);
    }
  } else {
    setTimeout(() => {
      state.first.classList.remove("flipped");
      state.second.classList.remove("flipped");
      state.first = null;
      state.second = null;
      state.lock = false;
    }, 800);
  }
}

btnStart.addEventListener("click", () => {
  showScreen("game");
  renderGame();
});

btnRestart.addEventListener("click", renderGame);
btnNext.addEventListener("click", () => showScreen("prize"));
btnReplay.addEventListener("click", () => {
  showScreen("game");
  renderGame();
});

showScreen("intro");
