const util = require('util');
const path = require('path');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

async function readInput(dir) {
  const contents = await readFile(path.join(dir, 'input.txt'));
  return contents.toString();
}

module.exports = readInput;
