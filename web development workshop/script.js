const EMOJIS = ['🍎','🍋','🍇','🍓','🍑','🍍','🍉','🥝','🍌','🍒','🥑','🍆','🥕','🌶','🥔','🧀','🍪','🍰','🍩','🍫','🍿','🍔','🍕','🥐','☕','🍭'];


const board = document.getElementById('board');
const newBtn = document.getElementById('newBtn');
const sizeSelect = document.getElementById('sizeSelect');
const hintBtn = document.getElementById('hintBtn');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const totalPairsEl = document.getElementById('totalPairs');
const timeEl = document.getElementById('time');
const matchedList = document.getElementById('matchedList');


let gridSize = 4;
let totalCards = gridSize * gridSize;
let icons = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let timer = null;
let seconds = 0;


function shuffle(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function duplicate(arr){ return arr.reduce((acc, v) => (acc.push(v, v), acc), []); }


function init(){
  gridSize = parseInt(sizeSelect.value, 10);
  totalCards = gridSize * gridSize;
  const pairsRequired = totalCards / 2;


  const chosen = shuffle(EMOJIS).slice(0, pairsRequired);
  icons = shuffle(duplicate(chosen));

  board.style.gridTemplateColumns = `repeat(${gridSize}, var(--card-size))`;

  renderBoard();
  resetState();

  totalPairsEl.textContent = pairsRequired;
  matchedList.innerHTML = '';
}

function renderBoard(){
  board.innerHTML = '';
  icons.forEach((icon, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.icon = icon;
    card.dataset.index = idx;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    card.innerHTML = `
      <div class="inner" aria-hidden="false">
        <div class="face front">?</div>
        <div class="face back">${icon}</div>
      </div>
    `;

    card.addEventListener('click', () => flipCard(card));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') flipCard(card); });

    board.appendChild(card);
  });
}

function flipCard(card){
  if (lockBoard) return;
  const inner = card.querySelector('.inner');
  if (!inner || inner.classList.contains('flip')) return;

  if (moves === 0 && matchedPairs === 0 && !timer) startTimer();

  inner.classList.add('flip');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  moves++;
  movesEl.textContent = moves;

  checkMatch();
}

function checkMatch(){
  const match = firstCard.dataset.icon === secondCard.dataset.icon;

  if (match){
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    matchedPairs++;
    pairsEl.textContent = matchedPairs;

    showMatchedPair(firstCard.dataset.icon);

    resetSelection();

    if (matchedPairs === totalCards / 2){
      endGame();
    }
  } else {
    setTimeout(() => {
      firstCard.querySelector('.inner').classList.remove('flip');
      secondCard.querySelector('.inner').classList.remove('flip');
      resetSelection();
    }, 650);
  }
}

function resetSelection(){
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function resetState(){
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedPairs = 0;
  movesEl.textContent = 0;
  pairsEl.textContent = 0;
  stopTimer();
  seconds = 0;
  timeEl.textContent = 0;
}

function startTimer(){
  timer = setInterval(() => {
    seconds++;
    timeEl.textContent = seconds;
  }, 1000);
}

function stopTimer(){
  if (timer){
    clearInterval(timer);
    timer = null;
  }
}

function endGame(){
  stopTimer();
  setTimeout(() => {
    alert(`You found all pairs! Moves: ${moves} — Time: ${seconds}s`);
  }, 200);
}

function showMatchedPair(icon){
  const el = document.createElement('div');
  el.className = 'pair';
  el.textContent = icon;
  matchedList.appendChild(el);
}


hintBtn.addEventListener('click', () => {
  if (lockBoard) return;
  const inners = board.querySelectorAll('.inner');
  inners.forEach(i => i.classList.add('flip'));
  lockBoard = true;

  setTimeout(() => {
    inners.forEach(i => {
      if (!i.closest('.card').classList.contains('matched')){
        i.classList.remove('flip');
      }
    });
    lockBoard = false;
  }, 1100);
});


newBtn.addEventListener('click', init);
sizeSelect.addEventListener('change', init);


init();
