const deck = document.querySelector('.mc-deck');
const congrats = document.querySelector('.mc-congrats');
const timer = document.querySelector('.mc-time');
const matchedCounter = document.querySelector('.mc-matched');
const failedCounter = document.querySelector('.mc-failed');
const resetBtn = document.querySelector('.mc-reset-btn');
const finishTimeEl = document.querySelector('.mc-congrats > h2 > span');
const retry = document.querySelector('.mc-retry-btn');

let cards = [];
let openedCards = [];
let matchedCount = 0;
let time = 0;
let failedCount = 0;
let playingNow = false;
let intervalId;
let finishTime;
const faces = [
  'bug',
  'upload',
  'configuration',
  'connection',
  'database',
  'www',
  'mobile',
  'keyboard',
];
const facesPath = {
  bug: './images/memory_card/bug.svg',
  upload: './images/memory_card/upload.svg',
  configuration: './images/memory_card/configuration.svg',
  connection: './images/memory_card/connection.svg',
  database: './images/memory_card/database.svg',
  www: './images/memory_card/www.svg',
  mobile: './images/memory_card/mobile.svg',
  keyboard: './images/memory_card/keyboard.svg',
};

// <div class="mc-card">
//     <div class="mc-front"><img alt=""></div>
//     <div class="mc-back"><img alt=""></div>
// </div>

function createDeck() {
  function createCard() {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('mc-card');

    const frontDiv = document.createElement('div');
    frontDiv.classList.add('mc-front');
    const frontImg = document.createElement('img');
    frontDiv.appendChild(frontImg);

    const backDiv = document.createElement('div');
    backDiv.classList.add('mc-back');
    const backImg = document.createElement('img');
    backImg.setAttribute('src', './images/memory_card/hand.svg');
    backDiv.appendChild(backImg);

    cardDiv.appendChild(frontDiv);
    cardDiv.appendChild(backDiv);

    return cardDiv;
  }

  function generateShuffledArray(arr) {
    let shuffledArray = arr.slice();
    for (let i = shuffledArray.length - 1; i > -1; i--) {
      let randomIndex = Math.floor(Math.random() * shuffledArray.length);
      let tempValue = shuffledArray[i];
      shuffledArray[i] = shuffledArray[randomIndex];
      shuffledArray[randomIndex] = tempValue;
    }
    return shuffledArray;
  }

  const orderedFaces = [...faces, ...faces];
  const shuffledFaces = generateShuffledArray(orderedFaces);

  shuffledFaces.forEach((face) => {
    const cardDiv = createCard();
    const frontImage = cardDiv.querySelector('.mc-front > img');
    frontImage.setAttribute('src', facesPath[face]);
    deck.appendChild(cardDiv);
    cardDiv.addEventListener('click', flip);
  });
}

function flip() {
  if (!playingNow) {
    playingNow = true;
    intervalId = setInterval(() => {
      time++;
      timer.textContent = time;
    }, 1000);
  }
  if (openedCards.length === 0) {
    this.classList.add('rotate');
    openedCards.push(this);
  } else if (openedCards.length === 1) {
    if (this === openedCards[0]) {
      return;
    }
    this.classList.add('rotate');
    openedCards.push(this);
    matchedOrNot(openedCards[0], openedCards[1]);
  }
}

function matchedOrNot(card1, card2) {
  const cardsToCheck = [card1, card2];
  const cardOneFace = card1.querySelector('.mc-front > img').src;
  const cardTwoFace = card2.querySelector('.mc-front > img').src;
  if (cardOneFace === cardTwoFace) {
    matchedCount++;
    matchedCounter.textContent = matchedCount;
    cardsToCheck.forEach((card) => {
      card.classList.add('matched');
      card.removeEventListener('click', flip);
    });
    if (matchedCount === 8) {
      clearInterval(intervalId);
      finishTime = time;
      finishTimeEl.textContent = finishTime;
      setTimeout(() => {
        congrats.classList.add('show');
      }, 2500);
    }
    openedCards = [];
  } else {
    failedCount++;
    failedCounter.textContent = failedCount;
    setTimeout(() => {
      cardsToCheck.forEach((card) => {
        card.classList.remove('rotate');
        openedCards = [];
      });
    }, 800);
  }
}

resetBtn.addEventListener('click', () => {
  start();
});

function start() {
  matchedCount = 0;
  matchedCounter.textContent = matchedCount;
  failedCount = 0;
  failedCounter.textContent = failedCount;
  time = 0;
  timer.textContent = time;
  openedCards = [];
  deck.innerHTML = '';
  playingNow = false;
  clearInterval(intervalId);
  createDeck();
}

retry.addEventListener('click', () => {
  congrats.classList.remove('show');
  start();
});

start();
