const menuCover = document.querySelector('.sp-cover');
const menu = document.querySelectorAll('.sp-menu > li');
const backToMenu = document.querySelector('.sp-back-to-menu');
const originalImage = document.querySelector('#sp-original-image');
const showOriginalBtn = document.querySelector('#sp-show-original-btn');
const screen = document.querySelector('.sp-screen');
const counter = document.querySelector('.sp-counter');

let level;
let size;
let orderedArray = [];
let hiddenTileIndex;
let tilesArray = [];
let tiles;
let count = 0;
const images = ['space', 'veges'];
let selectedImage;
const levelMap = {
  easy: { grid: 'auto auto', size: 2 },
  medium: { grid: 'auto auto auto', size: 3 },
  difficult: { grid: 'auto auto auto auto', size: 4 },
};

//クリックされたレベルに応じてスライドパズルを初期化し、ゲームを始めるための処理
menu.forEach((item) => {
  item.addEventListener('click', () => {
    menuCover.classList.add('hide');
    level = item.dataset.level;
    size = levelMap[level].size;
    orderedArray = [];
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        let tileXY = '' + x + y;
        orderedArray.push(tileXY);
      }
    }
    hiddenTileIndex = Math.floor(Math.random() * size ** 2);
    screen.style.gridTemplateColumns = levelMap[level].grid;
    start();
  });
});

backToMenu.addEventListener('click', () => {
  menuCover.classList.remove('hide');
  screen.classList.remove('zoom');
});

//この複数ある画像の中からランダムに 1 枚選び、パズルの元画像として HTML の <img> 要素に設定している処理です。
function setOriginalImage() {
  selectedImage = images[Math.floor(Math.random() * images.length)];
  originalImage.setAttribute(
    'src',
    `./images/slide_puzzle/${selectedImage}/${selectedImage}.png`
  );
}

originalImage.onload = () => {
  const naturalWidth = originalImage.naturalWidth;
  const naturalHeight = originalImage.naturalHeight;
  const ratio = Math.floor((naturalHeight / naturalWidth) * 1000) / 1000;
  screen.style.width = '480px';
  screen.style.height = `${Math.floor(480 * ratio)}px`;
  console.log(naturalWidth);
};

showOriginalBtn.addEventListener('mouseover', () => {
  originalImage.classList.add('show');
});

showOriginalBtn.addEventListener('mouseleave', () => {
  originalImage.classList.remove('show');
});

//配列 arr に基づいて、パズルのタイルを一つひとつ HTML に描画する関数です。
function renderTiles(arr) {
  screen.innerHTML = '';
  arr.forEach((tile, index) => {
    //createELEMENTはjavaScriptのDOM APIの関数で新しい HTML 要素を作成するために使う
    const div = document.createElement('div');
    div.classList.add('sp-tile');
    if (index === hiddenTileIndex) {
      div.classList.add('hidden');
    }
    div.style.backgroundImage = `url(./images/slide_puzzle/${selectedImage}/${level}/tile${tile}.png)`;
    screen.appendChild(div);
  });
}

function start() {
  //ランダムに画像を1つ選び、それを完成見本（オリジナル画像）として表示します。
  setOriginalImage();
  count = 0;
  counter.textContent = count;
  //タイルの番号をシャッフルして ランダムな並び順にする関数
  tilesArray = generateShuffledArray(orderedArray);
  //シャッフルされた tilesArray を元に、画面上にタイルを表示
  renderTiles(tilesArray);
  //パズル全体の状態（タイルの並び）をもとに、画面上の配置を最新の状態に反映するための関数
  updateScreen();
}

//配列の要素をランダムに並べ替える（シャッフルする）処理
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

//パズル全体の状態（タイルの並び）をもとに、画面上の配置を最新の状態に反映する」ための関数
function updateScreen() {
  tiles = document.querySelectorAll('.sp-tile');
  const hiddenTileRow = Math.floor(hiddenTileIndex / size);
  const hiddenTileCol = hiddenTileIndex % size;

  //スライドパズルのタイルを1枚動かす処理を行っている
  function generateNewArray(arr, index, hiddenTileIndex) {
    const tempValue = arr[index];
    arr[index] = arr[hiddenTileIndex];
    arr[hiddenTileIndex] = tempValue;
    return arr;
  }

  //1枚タイルを動かしたときのメイン処理
  function updateTiles(index) {
    tilesArray = generateNewArray(tilesArray, index, hiddenTileIndex);
    hiddenTileIndex = index;
    renderTiles(tilesArray);
    count++;
    counter.textContent = count;
    setTimeout(() => {
      if (JSON.stringify(tilesArray) === JSON.stringify(orderedArray)) {
        complete();
      }
    }, 500);
  }

  tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => {
      const row = Math.floor(index / size);
      const col = index % size;
      if (level === 'easy') {
        updateTiles(index);
      } else {
        if (
          (row === hiddenTileRow && Math.abs(col - hiddenTileCol) === 1) ||
          (col === hiddenTileCol && Math.abs(row - hiddenTileRow) === 1)
        ) {
          updateTiles(index);
        }
      }
      updateScreen();
    });
  });
}

//この関数はゲームクリア時の見た目を整える演出用関数です
function complete() {
  tiles[hiddenTileIndex].classList.remove('hidden');
  screen.classList.add('zoom');
  tiles.forEach((tile) => {
    tile.classList.add('complete');
  });
}
