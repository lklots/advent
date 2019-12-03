function* foo() {
  console.log('hello');
  yield 'a';
  console.log('world');
  yield 'b';
}

console.log(foo().next().value);
console.log(foo().next().value);
