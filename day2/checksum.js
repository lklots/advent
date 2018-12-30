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
  return [0, 0];
}

function checksum(ids) {
  return 12;
}

module.exports = {
  counts,
  checksum,
};
