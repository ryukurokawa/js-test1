export function createGlider(grid, x, y) {
  grid[x][y] = 1;
  grid[x][y + 1] = 1;
  grid[x][y + 2] = 1;
  grid[x + 1][y + 2] = 1;
  grid[x + 2][y + 1] = 1;
}

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
