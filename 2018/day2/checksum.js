/*

For example, if you see the following box IDs:

abcdef contains no letters that appear exactly two or three times.
bababc contains two a and three b, so it counts for both.
abbcde contains two b, but no letter appears exactly three times.
abcccd contains three c, but no letter appears exactly two times.
aabcdd contains two a and two d, but it only counts once.
abcdee contains two e.
ababab contains three a and three b, but it only counts once.

Of these box IDs, four of them contain a letter which appears exactly twice,
and three of them contain a letter which appears exactly three times.
Multiplying these together produces a checksum of 4 * 3 = 12.

*/

function counts(id) {
  const counting = {};
  for (let i = 0; i < id.length; i += 1) {
    counting[id[i]] = (counting[id[i]] || 0) + 1;
  }
  let twos = 0;
  let threes = 0;

  Object.values(counting).forEach((count) => {
    if (count === 2) {
      twos = 1;
    } else if (count === 3) {
      threes = 1;
    }
  });

  return [twos, threes];
}

function checksum(ids) {
  let twosTotal = 0;
  let threesTotal = 0;
  ids.forEach((id) => {
    const [twos, threes] = counts(id);
    twosTotal += twos;
    threesTotal += threes;
  });
  return twosTotal * threesTotal;
}

module.exports = {
  counts,
  checksum,
};
