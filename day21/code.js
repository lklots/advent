function run() {
  let a0 = 0;
  let b1 = 0;
  let c2 = 0;
  let d3 = 0;
  let e4 = 0;

  do {
    d3 = e4 | 65536;
    e4 = 14464005;
    loop: 
      c2 = d3 & 255;
      e4 += c2;
      e4 = ((e4 & 16777215) * 65899) & 16777215;
      if (d3 <= 256) {
        c2 = 0;
        do {
          b1 += c2;
          b1 *= 256;
          c2 += b1;
        } while (b1 <= d3);
        d3 = c2;
        continue loop;
    }
    console.log(`${a0}, ${b1}, ${c2}, ${d3}, ${e4}`);
  } while (c2 !== b1);
}
run();

/* 

loop: 
op += 1;

*/
