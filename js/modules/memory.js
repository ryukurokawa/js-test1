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

//createDeckはトランプのデッキを作成する関数
//createCardは1枚のカードを作成する処理
function createDeck() {
  function createCard() {
    //createElementという関数はHTML要素をJavaScript上で生成
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('mc-card');

    const frontDiv = document.createElement('div');
    frontDiv.classList.add('mc-front');
    const frontImg = document.createElement('img');
    frontDiv.appendChild(frontImg); // appendChildはHTML要素を他の要素の「子要素」として追加する関数

    const backDiv = document.createElement('div');
    backDiv.classList.add('mc-back');
    const backImg = document.createElement('img');
    backImg.setAttribute('src', './images/memory_card/hand.svg'); //属性（attribute）を設定・変更するための JavaScript のメソッド
    backDiv.appendChild(backImg);

    cardDiv.appendChild(frontDiv);
    cardDiv.appendChild(backDiv);

    return cardDiv;
  }
  //generateShuffledArrayという関数は順番がバラバラの配列を生成するもの
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
    const frontImage = cardDiv.querySelector('.mc-front > img');//querySelectorはHTML内の特定の要素を1つだけ選んで取得する
    frontImage.setAttribute('src', facesPath[face]);
    deck.appendChild(cardDiv); // appendChildはHTML要素を他の要素の「子要素」として追加する関数
    cardDiv.addEventListener('click', flip); //addEventListenerは特定のイベントが発生したときに実行する関数を登録する
  });
}

//flipという関数を呼び出すと1秒ごとにタイマーがカウントアップされる処理がスタートする
function flip() {
  if (!playingNow) {
    playingNow = true;
    //setInterval一定の時間ごとに指定した処理を繰り返し実行するための関数です。
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
    //metched0rNotという関数は2枚のカードが一致しているのかのチェックと後処理を行う関数
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
      card.removeEventListener('click', flip);  //イベントリスナー（監視していた処理）を削除するための関数
    });
    if (matchedCount === 8) {
      clearInterval(intervalId);
      finishTime = time;
      finishTimeEl.textContent = finishTime;
      //setTimeoutは指定した時間（ミリ秒）後に一度だけ関数を実行するためのタイマー機能です。組み込み式の関数
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

//このstart関数はゲームの状態・表示・タイマーなどをすべて初期状態に戻し、新しくゲームを開始する準備を整える関数です。
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
