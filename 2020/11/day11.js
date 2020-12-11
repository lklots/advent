const _ = require('lodash');
const readInput = require('../../lib/file');

function neighbors2(board, x, y) {
  const look = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  return look.map(([a, b]) => {
    let xp = x;
    let yp = y;
    do {
      xp += a;
      yp += b;
    } while (xp >= 0 && xp < board[0].length && yp >= 0 && yp < board.length && board[yp][xp] === '.');
    if (!(xp >= 0 && xp < board[0].length && yp >= 0 && yp < board.length)) {
      return null;
    }
    return board[yp][xp];
  }).filter(m => m);
}

function neighbors(board, x, y) {
  const look = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  return _(look)
    .map(([a, b]) => [x + a, y + b])
    .filter(([a, b]) => a >= 0 && a < board[0].length && b >= 0 && b < board.length)
    .map(([a, b]) => board[b][a])
    .value();
}

function step(board) {
  const newBoard = JSON.parse(JSON.stringify(board));
  for (let i = 0; i < board.length; i += 1) {
    for (let j = 0; j < board[i].length; j += 1) {
      const counts = _.countBy(neighbors(board, j, i));
      if (board[i][j] === 'L' && _.get(counts, '#', 0) === 0) {
        newBoard[i][j] = '#';
      } else if (board[i][j] === '#' && _.get(counts, '#', 0) >= 4) {
        newBoard[i][j] = 'L';
      }
    }
  }

  return newBoard;
}

function step2(board) {
  const newBoard = JSON.parse(JSON.stringify(board));
  for (let i = 0; i < board.length; i += 1) {
    for (let j = 0; j < board[i].length; j += 1) {
      const counts = _.countBy(neighbors2(board, j, i));
      if (board[i][j] === 'L' && _.get(counts, '#', 0) === 0) {
        newBoard[i][j] = '#';
      } else if (board[i][j] === '#' && _.get(counts, '#', 0) >= 5) {
        newBoard[i][j] = 'L';
      }
    }
  }

  return newBoard;
}

function loopTillRepeat(board, stepFn) {
  let oldBoard;
  do {
    oldBoard = board;
    board = stepFn(board);
  } while (JSON.stringify(board) !== JSON.stringify(oldBoard));
  return board;
}

async function run() {
  const lines = await readInput('2020/11');
  const board = lines.split('\n').map(x => x.split(''));
  console.log(`part1: ${_.countBy(JSON.stringify(loopTillRepeat(board, step)))['#']}`);
  console.log(`part2: ${_.countBy(JSON.stringify(loopTillRepeat(board, step2)))['#']}`);
}
run();
