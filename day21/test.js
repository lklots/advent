let a = 1;
main: a += 1;
if (a < 10) {
  continue main
}
console.log(a);