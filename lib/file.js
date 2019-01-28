const util = require('util');
const path = require('path');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

async function readInput(dir, file) {
  const rfile = file || 'input.txt';
  const contents = await readFile(path.join(dir, rfile));
  return contents.toString();
}

module.exports = readInput;
