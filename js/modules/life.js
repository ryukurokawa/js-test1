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

sizeSelect.addEventListener('change', () => {
  size = sizeSelect.value;
});

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
    grid = createRandomGrid(btn.dataset.value);
    drawAliveCells(grid);
    setTimeout(() => {
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

  function createZeroGrid() {
    let zeroGrid = generateEmptyGrid();
    for (let i = 0; i < numOfCols; i++) {
      for (let j = 0; j < numOfRows; j++) {
        zeroGrid[i][j] = 0;
      }
    }
    return zeroGrid;
  }

  grid = createZeroGrid();
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
          Patterns.createGlider(grid, x, y);
          break;
        case 'small-speaceship':
          Patterns.createSmallSpaceship(grid, x, y);
          break;
      }
    } else {
      grid[x][y] = 0;
    }
    drawAliveCells(grid);
  }
});

backToMenu.addEventListener('click', () => {
  menu.classList.remove('hide');
  canvasContainer.classList.remove('active');
  pattern.classList.remove('active');
  runningState = false;
  cancelAnimationFrame(animationId);
  frameCount = 0;
  numOfGeneration = 1;
  generation.textContent = numOfGeneration;
});

controller.addEventListener('click', () => {
  if (runningState) {
    controller.textContent = 'Resume';
    controller.style.backgroundColor = RESUME_COLOR;
    cancelAnimationFrame(animationId);
  } else {
    controller.textContent = 'Pause';
    controller.style.backgroundColor = PAUSE_COLOR;
    animate();
  }
  runningState = !runningState;
});

function generateEmptyGrid() {
  numOfCols = canvas.width / size;
  numOfRows = canvas.height / size;
  let emptyGrid = new Array(numOfCols);
  for (let i = 0; i < emptyGrid.length; i++) {
    emptyGrid[i] = new Array(numOfRows);
  }
  return emptyGrid;
}

generateEmptyGrid();

function createRandomGrid(num) {
  grid = generateEmptyGrid();
  for (let i = 0; i < numOfCols; i++) {
    for (let j = 0; j < numOfRows; j++) {
      grid[i][j] = Math.floor(Math.random() * num);
    }
  }
  console.log(grid);
  return grid;
}

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

function createNextGrid() {
  let nextGrid = generateEmptyGrid();
  for (let i = 0; i < numOfCols; i++) {
    for (let j = 0; j < numOfRows; j++) {
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
    grid = createNextGrid();
    drawAliveCells(grid);
    console.log('animation is running');
    numOfGeneration++;
    generation.textContent = numOfGeneration;
  }
  animationId = requestAnimationFrame(animate);

  if (!life.classList.contains('active')) {
    runningState = false;
    cancelAnimationFrame(animationId);
    controller.textContent = 'Resume';
    controller.style.backgroundColor = RESUME_COLOR;
  }
}
