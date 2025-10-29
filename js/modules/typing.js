const startPage =document.querySelector('#ty-start-page')  //document.querySelectorは一致した一つの要素を取得する関数
const typingGame = document.querySelector('#ty-game')
const titleTime = document.querySelector('#ty-title-time')
const timer = document.querySelector('#ty-timer')
const timeSelectEl = document.querySelector('.ty-time-select');

let timelimit=30;
let remaingTime;

timeSelectEl.addEventListener('change', () => {
  timelimit = timeSelectEl.value;
});

window.addEventListener('keypress',e=>{
  if(e.key === 'Enter'){
   
    start();
  }
  return;
})

function start(){
  startPage.classList.remove('show')
  typingGame.classList.add('show')
  titleTime.textContent =timelimit;
  remainigTime = timelimit;
  timer.textContent = remainingTime;
}