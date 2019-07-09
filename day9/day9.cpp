#include <iostream>
#include <deque>
#include <map>
#include <string>
using namespace std;

deque<int>::iterator advance(deque<int>& q, deque<int>::iterator& iter, int steps) {
  if (steps >= 0) {
    size_t remaining(distance(iter, q.end()));
    cout << "remaining: " << remaining << endl;
    if (steps > remaining) {
      auto newIter = q.begin();
      newIter += (steps - remaining) % q.size();
      return newIter;
    } else {
      iter += steps;
      return iter;
    }
  } else {
    return advance(q, iter, q.size() + steps);
  }
}

int simulate(const int players, const int maxMarble) {
  map<int, int> scores;
  for (int i = 0; i < players; i++) {
    scores[i] = 0;
  }

  deque<int> circle;
  circle.push_back(0);
  circle.push_back(1);
  circle.push_back(2);
  circle.push_back(3);
  circle.push_back(4);

  deque<int>::iterator iter = circle.begin();
  for (int marble = 1; marble <= maxMarble; marble++) {
    const int player = ((marble - 1) % players) + 1;
    if (marble % 23 != 0) {
      iter = advance(circle, iter, 2);
      circle.insert(iter, marble);
    }
    for (auto i : circle) {
      cout << i << ",";
    }
    cout << endl;
  }

  return 0;
}

int main(int argc, char** argv) {
  if (argc < 3) {
    cerr << "takes 3 params" << endl;
    return 1;
  }

  int players = stoi(string(argv[1]));
  int marbles = stoi(string(argv[2]));
  simulate(players, marbles);
}

