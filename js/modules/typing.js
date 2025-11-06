const startPage = document.querySelector('#ty-start-page'); //document.querySelectorは一致した一つの要素を取得する関数
const typingGame = document.querySelector('#ty-game');
const titleTime = document.querySelector('#ty-title-time');
const timer = document.querySelector('#ty-timer');
const timeSelectEl = document.querySelector('.ty-time-select');
const typing = document.querySelector('#typing');
const backToStart = document.querySelector('#ty-back-to-start');
const resultContainer = document.querySelector('#ty-result-container');
const textarea = document.querySelector('#ty-textarea');
const quote = document.querySelector('#ty-quote');
const author = document.querySelector('#ty-author-name');
const LPM = document.querySelector('#ty-LPM');
const quoteReview = document.querySelector('#ty-quote-review');

let timelimit = 30;
let remainingTime;
let isActive = false;
let isPlaying = false;
let intervalId = null;
let quotes;
let typedCount = 0;
let LPMCount;

timeSelectEl.addEventListener('change', () => {
  timelimit = parseInt(timeSelectEl.value, 10); // 数字に変換
});


//typing 画面がアクティブで、ゲームが始まっていない状態のとき、Enterを押すとゲームが開始される
window.addEventListener('keypress', (e) => {
  isActive = typing.classList.contains('active');
  if (e.key === 'Enter' && isActive && !isPlaying) {
    start();
    isActive = false;
    isPlaying = true;
  }
});

async function start() {
  startPage.classList.remove('show');
  typingGame.classList.add('show');
  titleTime.textContent = timelimit;
  remainingTime = timelimit;
  timer.textContent = remainingTime;
  await fetchAndRenderQuotes();
  textarea.disabled = false;
  textarea.focus();
  typedCount = 0;

  intervalId = setInterval(() => {
    remainingTime -= 1;
    timer.textContent = remainingTime;
    if (remainingTime <= 0) {
      showResult();
    }
  }, 1000);
}

backToStart.addEventListener('click', () => {
  typingGame.classList.remove('show');
  startPage.classList.add('show');
  resultContainer.classList.remove('show');
  isPlaying = false;
});

//タイピングゲームなどの結果画面を表示するための処理
function showResult() {
  textarea.disabled = true;
  //setInterval() で動かしている処理（タイマー）を止める
  clearInterval(intervalId);
  LPMCount =
    remainingTime === 0
      ? Math.floor((typedCount * 60) / timelimit)
      : Math.floor((typedCount * 60) / (timelimit - remainingTime));
  quoteReview.innerHTML = `${quotes.quote} <br>--- ${quotes.author}`;
  let count = 0;
  setTimeout(() => {
    resultContainer.classList.add('show');
    const countup = setInterval(() => {
      LPM.textContent = count;
      count += 1;
      if (count >= LPMCount) {
        clearInterval(countup);
      }
    }, 20);
  }, 1000);
}

//ランダムな言葉（quote）をAPIから取得して、画面に1文字ずつ表示する処理
async function fetchAndRenderQuotes() {
  quote.innerHTML = '';
  textarea.value = '';
  const proxyUrl = 'https://api.allorigins.win/get?url=';
  const targetUrl = 'https://zenquotes.io/api/random';

  const response = await fetch(proxyUrl + targetUrl);
  const data = await response.json();

  const parsedData = JSON.parse(data.contents);
  const quoteText = parsedData[0].q;
  const authorName = parsedData[0].a;

  quotes = { quote: quoteText, author: authorName };

  const quoteContainer = document.querySelector('#ty-quote');
  quoteContainer.innerHTML = '';

  quotes.quote.split('').forEach((letter) => {
    const span = document.createElement('span');
    span.textContent = letter;
    quoteContainer.appendChild(span);
  });

  author.textContent = quotes.author;
}

textarea.addEventListener('input', () => {
  let inputArray = textarea.value.split('');
  let spans = quote.querySelectorAll('span');
  spans.forEach((span) => {
    span.className = '';
  });
  typedCount = 0;
  inputArray.forEach((letter, index) => {
    if (letter === spans[index].textContent) {
      spans[index].classList.add('correct');
      if (spans[index].textContent !== ' ') {
        typedCount += 1;
      }
    } else {
      spans[index].classList.add('wrong');
      if (spans[index].textContent === ' ') {
        spans[index].classList.add('bar');
      }
    }
  });
  if (
    spans.length === inputArray.length &&
    [...spans].every((span) => span.classList.contains('correct'))
  ) {
    showResult();
  }
});
