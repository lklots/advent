#!/usr/local/bin/node

class Node {
  constructor(value) {
    this.prev = null;
    this.next = null;
    this.value = value;
  }
}

class Deque {

  constructor(value) {
    this.back = new Node(value);
    this.front = this.back;
  }

  rotate(rotations) {
    if (rotations === 0) {
      return;
    }
    if (rotations > 0) {
      for (let i = 0; i < rotations; i += 1) {
        this.rotateForward();
      }
    } else {
      for (let i = 0; i > rotations; i -= 1) {
        this.rotateBackward();
      }
    }
  }

  rotateBackward() {
    if (this.back === null || (this.back === this.front)) {
      return;
    }
    const newFront = this.front.next;
    newFront.prev = null;
    this.front.next = null;
    this.front.prev = this.back;
    this.back.next = this.front;
    this.back = this.back.next;
    this.front = newFront;
  }

  rotateForward() {
    if (this.back === null || (this.back === this.front)) {
      return;
    }

    const newPrev = this.back.prev;
    newPrev.next = null;
    this.back.prev = null;
    this.back.next = this.front;
    this.front.prev = this.back;
    this.front = this.front.prev;
    this.back = newPrev;
  }

  push(value) {
    const n = new Node(value);

    if (this.back === null) {
      this.back = n;
      this.front = n;
      return;
    }

    n.prev = this.back;
    this.back.next = n;
    this.back = n;
  }

  pop() {
    if (this.back === null) {
      return undefined;
    }

    if (this.back === this.front) {
      const value = this.back.value;
      this.back = null;
      this.front = null;
      return value;
    }

    const n = this.back;
    this.back = n.prev;
    this.back.next = null;
    return n.value;
  }

  toString() {
    let p = this.front;
    let out = '';
    while (p) {
      out += p.value + " ";
      p = p.next;
    }
    return out;
  }
}

function print(player, circle, current) {
  let out = `${player} `;
  for (let i = 0; i < circle.length; i += 1) {
    if (i === current) {
      out += `(${circle[i]})`;
    } else {
      out += ` ${circle[i]} `;
    }
  }
  console.log(out);
}

function simulate(players, maxMarble) {
  const scores = {};
  for (let i = 1; i <= players; i += 1) {
    scores[i] = 0;
  }

  const circle = new Deque(0);
  for (let marble = 1; marble <= maxMarble; marble += 1) {
    const player = ((marble - 1) % players) + 1;
    if (marble % 23 === 0) {
      circle.rotate(-7);
      scores[player] += circle.pop() + marble;
    } else {
      circle.rotate(2);
      circle.push(marble);
    }
  }
  return Math.max(...Object.values(scores));
}

console.log(`part 1: ${simulate(479, 71035)}`);
console.log(`part 2: ${simulate(479, 71035 * 100)}`);
