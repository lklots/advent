
// assume strings are same length
function isSimilar(string1, string2) {
  let differingIndex = null;
  for (let i = 0; i < string1.length; i += 1) {
    if (string1[i] !== string2[i]) {
      if (differingIndex !== null) {
        return null;
      }
      differingIndex = i;
    }
  }

  return string1.slice(0, differingIndex) + string1.slice(differingIndex + 1, string1.length);
}

function common(strings) {
  for (let i = 0; i < strings.length; i += 1) {
    for (let j = i + 1; j < strings.length; j += 1) {
      const ret = isSimilar(strings[i], strings[j]);
      if (ret) {
        return ret;
      }
    }
  }

  return null;
}

module.exports = {
  common,
  isSimilar,
};
