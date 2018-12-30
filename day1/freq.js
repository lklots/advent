/*

For example, if the device displays frequency changes of +1, -2, +3, +1, then starting from a frequency of zero, the following changes would occur:

Current frequency  0, change of +1; resulting frequency  1.
Current frequency  1, change of -2; resulting frequency -1.
Current frequency -1, change of +3; resulting frequency  2.
Current frequency  2, change of +1; resulting frequency  3.
In this example, the resulting frequency is 3.

Here are other example situations:

+1, +1, +1 results in  3
+1, +1, -2 results in  0
-1, -2, -3 results in -6
Starting with a frequency of zero, what is the resulting frequency after all of the changes in frequency have been applied?

*/

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
