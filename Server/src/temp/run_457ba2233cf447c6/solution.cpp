#if __has_include(<bits/stdc++.h>)
#include <bits/stdc++.h>
#else
#include <algorithm>
#include <array>
#include <cmath>
#include <deque>
#include <functional>
#include <iostream>
#include <limits>
#include <list>
#include <map>
#include <numeric>
#include <queue>
#include <set>
#include <stack>
#include <sstream>
#include <string>
#include <tuple>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>
#endif
using namespace std;

string reverseWords(string s) {
    stringstream ss(s);
    string word;
    vector<string> words;
    while (ss >> word) {
        words.push_back(word);
    }
    reverse(words.begin(), words.end());
    string result = "";
    for (int i = 0; i < words.size(); i++) {
        if (i > 0) result += " ";
        result += words[i];
    }
    return result;
}

int main() {
    string s;
    if (getline(cin, s)) {
        cout << reverseWords(s);
    }
    return 0;
}