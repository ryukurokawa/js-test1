import * as Patterns from './patterns.js';
const menu = document.querySelector('#gl-menu');
const sizeSelect = document.querySelector('.gl-size-select');
const speedSelect = document.querySelector('.gl-speed-select');
const randomBtns = document.querySelectorAll('.gl-random-btn');
const selfSelectBtn = document.querySelector('.gl-self-select-btn');
const canvasContainer = document.querySelector('.gl-canvas-container');
const pattern = document.querySelector('.gl-pattern');
const controller = document.querySelector('.gl-controller');
const backToMenu = document.querySelector('.gl-back-to-menu');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const generation = document.querySelector('.gl-generation');
const life = document.querySelector('#life');
const patternSelect = document.querySelector('.gl-pattern-select');

let size = sizeSelect.value;
let speed = speedSelect.value;
let runningState = false;
let grid;
let numOfCols;
let numOfRows;
let frameCount = 0;
let animationId;
let numOfGeneration = 1;
const RESUME_COLOR = '#0aa';
const PAUSE_COLOR = '#f55';
const ALIVE_COLOR = '#0f7';
const DEAD_COLOR = '#000';

//addEventListenerは特定のイベントが発生したときに実行する関数を登録する
sizeSelect.addEventListener('change', () => {
  size = sizeSelect.value;
});

//addEventListenerは特定のイベントが発生したときに実行する関数を登録する
speedSelect.addEventListener('change', () => {
  speed = sizeSelect.value;
});

randomBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    menu.classList.add('hide');
    canvasContainer.classList.add('active');
    runningState = true;
    controller.textContent = 'Pause';
    controller.style.backgroundColor = PAUSE_COLOR;
    //createRandomGridはランダム生成ボタンがクリックされたときにゲームの初期状態をセットしてアニメーションを始める処理
    grid = createRandomGrid(btn.dataset.value);
    //drawAliveCellsはJavaScriptの2次元配列に保存された「生死情報」を画面上に反映させるための関数です。
    drawAliveCells(grid);
    setTimeout(() => {
      //animateはゲームやシミュレーションの初期状態を表示してから、1.2秒後にアニメーション（動作）を開始する処理です。
      animate();
    }, 1200);
  });
});

selfSelectBtn.addEventListener('click', () => {
  menu.classList.add('hide');
  canvasContainer.classList.add('active');
  pattern.classList.add('active');
  controller.textContent = 'Generale';
  controller.style.backgroundColor = RESUME_COLOR;

  //createZeroGridはすべてのセルが「0」の2次元グリッド（配列）を作成する関数。
  function createZeroGrid() {
    //generateEmptyGridは、指定されたサイズの２じげんグリッドを空で生成する関数
    let zeroGrid = generateEmptyGrid();
    for (let i = 0; i < numOfCols; i++) {
      for (let j = 0; j < numOfRows; j++) {
        zeroGrid[i][j] = 0;
      }
    }
    return zeroGrid;
  }

  //createZeroGridはすべてのセルが「0」の2次元グリッド（配列）を作成する関数。
  grid = createZeroGrid();
  //すべてのセルの値が 0 の二次元配列（  全てのセルが「死んでいる」状態のグリッド）を作成する関数。
  drawAliveCells(grid);
});

canvas.addEventListener('mousedown', (e) => {
  if (pattern.classList.contains('active')) {
    const x = Math.floor(e.offsetX / size);
    const y = Math.floor(e.offsetY / size);
    if (grid[x][y] === 0) {
      switch (patternSelect.value) {
        case 'cell':
          grid[x][y] = 1;
          break;
        case 'glider':
          //引数として grid, x, y のように、2次元配列（グリッド）と配置開始座標を受け取ることが多い。
          //グライダーのセル配置（例：生きているセル＝1）をその座標を起点にグリッドの特定位置にセットして、グリッド上にグライダーを描く処理です。
          Patterns.createGlider(grid, x, y);
          break;
        case 'small-speaceship':
          //ライフゲーム において、「スモール・スペースシップ（Small Spaceship）」
          //と呼ばれる動くパターン（宇宙船）を、指定された座標 (x, y) を起点に グリッドに描画する関数です。
          Patterns.createSmallSpaceship(grid, x, y);
          break;
      }
    } else {
      grid[x][y] = 0;
    }
    //すべてのセルの値が 0 の二次元配列（  全てのセルが「死んでいる」状態のグリッド）を作成する関数。
    drawAliveCells(grid);
  }
});

backToMenu.addEventListener('click', () => {
  menu.classList.remove('hide');
  canvasContainer.classList.remove('active');
  pattern.classList.remove('active');
  runningState = false;
  //cancelAnimationFrameという関数はrequestAnimationFrame() によってスケジュールされたアニメーションの実行をキャンセルするための関数です。
  cancelAnimationFrame(animationId);
  frameCount = 0;
  numOfGeneration = 1;
  generation.textContent = numOfGeneration;
});

controller.addEventListener('click', () => {
  if (runningState) {
    controller.textContent = 'Resume';
    controller.style.backgroundColor = RESUME_COLOR;
    //cancelAnimationFrameという関数はrequestAnimationFrame() によってスケジュールされたアニメーションの実行をキャンセルするための関数です。
    cancelAnimationFrame(animationId);
  } else {
    controller.textContent = 'Pause';
    controller.style.backgroundColor = PAUSE_COLOR;
    animate();
  }
  runningState = !runningState;
});

//generateEmptyGridは、指定されたサイズの２じげんグリッドを空で生成する関数
function generateEmptyGrid() {
  numOfCols = canvas.width / size;
  numOfRows = canvas.height / size;
  let emptyGrid = new Array(numOfCols);
  for (let i = 0; i < emptyGrid.length; i++) {
    emptyGrid[i] = new Array(numOfRows);
  }
  return emptyGrid;
}
//generateEmptyGridは、指定されたサイズの２じげんグリッドを空で生成する関数
generateEmptyGrid();

 //createRandomGridはランダム生成ボタンがクリックされたときにゲームの初期状態をセットしてアニメーションを始める処理
function createRandomGrid(num) {
//generateEmptyGridは、指定されたサイズの２じげんグリッドを空で生成する関数
  grid = generateEmptyGrid();
  for (let i = 0; i < numOfCols; i++) {
    for (let j = 0; j < numOfRows; j++) {
      grid[i][j] = Math.floor(Math.random() * num);
    }
  }
  console.log(grid);
  return grid;
}

//すべてのセルの値が 0 の二次元配列（  全てのセルが「死んでいる」状態のグリッド）を作成する関数。
function drawAliveCells(grid) {
  for (let i = 0; i < numOfCols; i++) {
    for (let j = 0; j < numOfRows; j++) {
      let x = i * size;
      let y = j * size;
      if (grid[i][j] === 1) {
        ctx.fillStyle = ALIVE_COLOR;
        ctx.fillRect(x, y, size, size);
      } else {
        ctx.fillStyle = DEAD_COLOR;
        ctx.fillRect(x, y, size, size);
      }
    }
  }
}

//指定されたセル (x, y) の周囲8マスに生きているセルがいくつあるかをカウントするための関数
function countAliveNeighbors(grid, x, y) {
  let neighbors = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + numOfCols) % numOfCols;
      let row = (y + j + numOfRows) % numOfRows;
      neighbors += grid[col][row];
    }

  }
  neighbors -= grid[x][y];
  return neighbors;
}

//createNextGridは次の世代（グリッドの状態）を計算して、次のグリッドを返す処理です。現在のグリッドを元にルールに従って新たなグリッド状態を生成する
function createNextGrid() {
  //generateEmptyGridは、指定されたサイズの２次元グリッドを空で生成する関数
  let nextGrid = generateEmptyGrid();
  for (let i = 0; i < numOfCols; i++) {
    for (let j = 0; j < numOfRows; j++) {
      //countAliveNeighborsは指定されたセル (x, y) の周囲に生きているセルが何個あるかをカウントする関数
      let neighbors = countAliveNeighbors(grid, i, j);
      if (grid[i][j] === 0) {
        if (neighbors === 3) {
          nextGrid[i][j] = 1;
        } else {
          nextGrid[i][j] = 0;
        }
      }
      if (grid[i][j] === 1) {
        if (neighbors === 2 || neighbors === 3) {
          nextGrid[i][j] = 1;
        } else {
          nextGrid[i][j] = 0;
        }
      }
    }
  }
  return nextGrid;
}

function animate() {
  frameCount++;
  if (frameCount % speed === 0) {
    //createNextGridは次の世代（グリッドの状態）を計算して、次のグリッドを返す処理です。現在のグリッドを元にルールに従って新たなグリッド状態を生成する
    grid = createNextGrid();
    //すべてのセルの値が 0 の二次元配列（  全てのセルが「死んでいる」状態のグリッド）を作成する関数。
    drawAliveCells(grid);
    console.log('animation is running');
    numOfGeneration++;
    generation.textContent = numOfGeneration;
  }
  //requestAnimationFrameはブラウザにアニメーションの更新を依頼する関数
  animationId = requestAnimationFrame(animate);

  if (!life.classList.contains('active')) {
    runningState = false;
    //cancelAnimationFrameという関数はrequestAnimationFrame() によってスケジュールされたアニメーションの実行をキャンセルするための関数
    cancelAnimationFrame(animationId);
    controller.textContent = 'Resume';
    controller.style.backgroundColor = RESUME_COLOR;
  }
}
