const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function run() {
  const a = await readFile(path.join(__dirname, 'input.txt'));
  console.log(a.toString());
}

run();
