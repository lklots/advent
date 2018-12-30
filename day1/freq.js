const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function run() {
  const file = await readFile(path.join(__dirname, 'input.txt'));
  const freqs = file.toString().split('\n');

  let total = 0;
  freqs.forEach((freq) => {
    // +N will be interepted as N. 
    // -N will be interepted as -N.
    const value = parseInt(freq, 10);
    total += value;
  });
  console.log(total);
}

run();
