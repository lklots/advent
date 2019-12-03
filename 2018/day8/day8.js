#!/usr/local/bin/node

const getInput = require('../lib/file');

function last(arr) {
  return arr[arr.length - 1];
}

function toInt(arr) {
  return arr.map(x => parseInt(x, 10));
}

async function run() {
  let input = (await getInput(__dirname)).split(' ');
  input = toInt(input);
  let total = 0;
  const stack = [
    [input.shift(), input.shift()],
  ];
  while (stack.length > 0) {
    if (last(stack)[0] === 0) {
      const [_, numHeaders] = stack.pop();
      for (let i = 0; i < numHeaders; i += 1) {
        total += input.shift();
      }
      if (stack.length > 0) {
        last(stack)[0] -= 1;
      }
    } else {
      stack.push([input.shift(), input.shift()]);
    }
  }

  console.log(`part 1: ${total}`);
}

class Node {
  constructor(expectedChildren, expectedMeta) {
    this.parent = null;
    this.children = [];
    this.meta = [];
    this.expectedChildren = expectedChildren;
    this.expectedMeta = expectedMeta;
  }

  addChild(child) {
    this.children.push(child);
    child.parent = this;
    return this;
  }

  getChildren() {
    return this.children;
  }

  addMeta(meta) {
    this.meta.push(meta);
    return this;
  }

  getMeta() {
    return this.meta;
  }

  getRemainingChildren() {
    return this.expectedChildren - this.children.length;
  }

  getExpectedMeta() {
    return this.expectedMeta;
  }

  getTotal() {
    if (this.children.length === 0) {
      return this.meta.reduce((t, v) => t + v, 0);
    }
    let total = 0;
    for (let i = 0; i < this.meta.length; i += 1) {
      const index = this.meta[i];
      if (index > 0 && index <= this.children.length) {
        total += this.children[index - 1].getTotal();
      }
    }
    return total;
  }
}

async function run2() {
  let input = (await getInput(__dirname, 'input.txt')).split(' ');
  input = toInt(input);
  const root = new Node(input.shift(), input.shift());
  const stack = [root];
  while (stack.length > 0) {
    if (last(stack).getRemainingChildren() === 0) {
      const leaf = stack.pop();
      for (let i = 0; i < leaf.getExpectedMeta(); i += 1) {
        leaf.addMeta(input.shift());
      }
    } else {
      const child = new Node(input.shift(), input.shift());
      last(stack).addChild(child);
      stack.push(child);
    }
  }

  console.log(`part 2: ${root.getTotal()}`);
}
run();
run2();
