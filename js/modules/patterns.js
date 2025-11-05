//createGliderという関数はグライダー（glider）と呼ばれるパターンを、指定された位置に作るための関数,
export function createGlider(grid, x, y) {
  grid[x][y] = 1;
  grid[x][y + 1] = 1;
  grid[x][y + 2] = 1;
  grid[x + 1][y + 2] = 1;
  grid[x + 2][y + 1] = 1;
}

//この関数を使うことにより、どの位置からでもスモールスペースシップを生成でき、移動する構造体のシミュレーションが可能です。
//スモールスペースシップは、、ライフゲームないで生命のような動きをするものです
export function createSmallSpaceship(grid, x, y) {
  grid[x][y] = 1;
  grid[x - 1][y + 1] = 1;
  grid[x - 1][y + 2] = 1;
  grid[x - 1][y + 3] = 1;
  grid[x][y + 3] = 1;
  grid[x + 1][y + 3] = 1;
  grid[x + 2][y + 3] = 1;
  grid[x + 3][y + 2] = 1;
  grid[x + 3][y] = 1;
}
