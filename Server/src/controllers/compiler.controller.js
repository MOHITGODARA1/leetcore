import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const questionsPath = path.resolve(__dirname, "../data/questions.json");
const questionsData = JSON.parse(fs.readFileSync(questionsPath, "utf8"));

const tempDir = path.resolve(__dirname, "../temp");
fs.mkdirSync(tempDir, { recursive: true });

const normalizeOutput = (value = "") => value.replace(/\r\n/g, "\n").trim();

const estimateMemoryKb = (language, sourceCode, results) => {
    const baseByLanguage = {
        cpp: 4200,
        "c++": 4200,
        java: 36800,
        python: 11800,
        py: 11800,
        python3: 11800,
    };
    const normalizedLanguage = language.toLowerCase();
    const baseMemory = baseByLanguage[normalizedLanguage] || 9000;
    const codeWeight = Math.min(9000, Math.ceil(sourceCode.length / 8));
    const caseWeight = results.reduce((total, result) => total + Math.max(1, result.duration || 1), 0);
    return baseMemory + codeWeight + Math.min(6500, caseWeight * 4);
};

const runProcess = ({ command, args = [], input = "", cwd, timeoutMs = 4000 }) =>
    new Promise((resolve) => {
        const startedAt = process.hrtime.bigint();
        const child = spawn(command, args, {
            cwd,
            stdio: ["pipe", "pipe", "pipe"],
        });

        let stdout = "";
        let stderr = "";
        let timedOut = false;

        const timer = setTimeout(() => {
            timedOut = true;
            child.kill("SIGKILL");
        }, timeoutMs);

        child.stdout.on("data", (chunk) => {
            stdout += chunk.toString();
        });

        child.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        child.on("error", (error) => {
            clearTimeout(timer);
            const durationMs = Number((process.hrtime.bigint() - startedAt) / 1000000n);
            resolve({
                stdout,
                stderr: stderr || error.message,
                exitCode: 1,
                timedOut,
                durationMs,
            });
        });

        child.on("close", (exitCode) => {
            clearTimeout(timer);
            const durationMs = Number((process.hrtime.bigint() - startedAt) / 1000000n);
            resolve({
                stdout,
                stderr,
                exitCode,
                timedOut,
                durationMs,
            });
        });

        child.stdin.write(input || "");
        child.stdin.end();
    });

const functionStarters = {
    "arrays-1": {
        cpp: "vector<int> reverseArray(vector<int> arr) {\n    // Write your logic here\n    return arr;\n}",
        java: "    public static List<Integer> reverseArray(List<Integer> arr) {\n        // Write your logic here\n        return arr;\n    }",
        python: "def reverse_array(arr):\n    # Write your logic here\n    return arr"
    },
    "arrays-2": {
        cpp: "int findMaximum(vector<int> arr) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int findMaximum(List<Integer> arr) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def find_maximum(arr):\n    # Write your logic here\n    return 0"
    },
    "arrays-3": {
        cpp: "int findDuplicate(vector<int> arr) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int findDuplicate(List<Integer> arr) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def find_duplicate(arr):\n    # Write your logic here\n    return 0"
    },
    "arrays-4": {
        cpp: "vector<int> rotateArray(vector<int> arr, int k) {\n    // Write your logic here\n    return arr;\n}",
        java: "    public static List<Integer> rotateArray(List<Integer> arr, int k) {\n        // Write your logic here\n        return arr;\n    }",
        python: "def rotate_array(arr, k):\n    # Write your logic here\n    return arr"
    },
    "arrays-5": {
        cpp: "vector<pair<int, int>> mergeIntervals(vector<pair<int, int>> intervals) {\n    // Write your logic here\n    return intervals;\n}",
        java: "    public static int[][] mergeIntervals(int[][] intervals) {\n        // Write your logic here\n        return intervals;\n    }",
        python: "def merge_intervals(intervals):\n    # Write your logic here\n    return intervals"
    },
    "strings-1": {
        cpp: "bool isAnagram(string s, string t) {\n    // Write your logic here\n    return false;\n}",
        java: "    public static boolean isAnagram(String s, String t) {\n        // Write your logic here\n        return false;\n    }",
        python: "def is_anagram(s: str, t: str) -> bool:\n    # Write your logic here\n    return False"
    },
    "strings-2": {
        cpp: "string longestPalindrome(string s) {\n    // Write your logic here\n    return \"\";\n}",
        java: "    public static String longestPalindrome(String s) {\n        // Write your logic here\n        return \"\";\n    }",
        python: "def longest_palindrome(s: str) -> str:\n    # Write your logic here\n    return \"\""
    },
    "strings-3": {
        cpp: "string longestCommonPrefix(vector<string>& strs) {\n    // Write your logic here\n    return \"\";\n}",
        java: "    public static String longestCommonPrefix(List<String> strs) {\n        // Write your logic here\n        return \"\";\n    }",
        python: "def longest_common_prefix(strs: list) -> str:\n    # Write your logic here\n    return \"\""
    },
    "strings-4": {
        cpp: "int firstUniqChar(string s) {\n    // Write your logic here\n    return -1;\n}",
        java: "    public static int firstUniqChar(String s) {\n        // Write your logic here\n        return -1;\n    }",
        python: "def first_uniq_char(s: str) -> int:\n    # Write your logic here\n    return -1"
    },
    "strings-5": {
        cpp: "string reverseWords(string s) {\n    // Write your logic here\n    return \"\";\n}",
        java: "    public static String reverseWords(String s) {\n        // Write your logic here\n        return \"\";\n    }",
        python: "def reverse_words(s: str) -> str:\n    # Write your logic here\n    return \"\""
    },
    "two-pointers-1": {
        cpp: "bool isPalindrome(string s) {\n    // Write your logic here\n    return false;\n}",
        java: "    public static boolean isPalindrome(String s) {\n        // Write your logic here\n        return false;\n    }",
        python: "def is_palindrome(s: str) -> bool:\n    # Write your logic here\n    return False"
    },
    "two-pointers-2": {
        cpp: "vector<int> twoSum(vector<int>& numbers, int target) {\n    // Write your logic here\n    return {};\n}",
        java: "    public static int[] twoSum(int[] numbers, int target) {\n        // Write your logic here\n        return new int[0];\n    }",
        python: "def two_sum(numbers: list, target: int) -> list:\n    # Write your logic here\n    return []"
    },
    "two-pointers-3": {
        cpp: "int removeDuplicates(vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int removeDuplicates(int[] nums) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def remove_duplicates(nums: list) -> int:\n    # Write your logic here\n    return 0"
    },
    "two-pointers-4": {
        cpp: "int maxArea(vector<int>& height) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int maxArea(int[] height) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def max_area(height: list) -> int:\n    # Write your logic here\n    return 0"
    },
    "two-pointers-5": {
        cpp: "int trap(vector<int>& height) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int trap(int[] height) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def trap(height: list) -> int:\n    # Write your logic here\n    return 0"
    },
    "sliding-window-1": {
        cpp: "int lengthOfLongestSubstring(string s) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int lengthOfLongestSubstring(String s) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def length_of_longest_substring(s: str) -> int:\n    # Write your logic here\n    return 0"
    },
    "sliding-window-2": {
        cpp: "int characterReplacement(string s, int k) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int characterReplacement(String s, int k) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def character_replacement(s: str, k: int) -> int:\n    # Write your logic here\n    return 0"
    },
    "sliding-window-3": {
        cpp: "int minSubArrayLen(int target, vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int minSubArrayLen(int target, int[] nums) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def min_subarray_len(target: int, nums: list) -> int:\n    # Write your logic here\n    return 0"
    },
    "sliding-window-4": {
        cpp: "bool checkInclusion(string s1, string s2) {\n    // Write your logic here\n    return false;\n}",
        java: "    public static boolean checkInclusion(String s1, String s2) {\n        // Write your logic here\n        return false;\n    }",
        python: "def check_inclusion(s1: str, s2: str) -> bool:\n    # Write your logic here\n    return False"
    },
    "sliding-window-5": {
        cpp: "int longestOnes(vector<int>& nums, int k) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int longestOnes(int[] nums, int k) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def longest_ones(nums: list, k: int) -> int:\n    # Write your logic here\n    return 0"
    },
    "kadans-1": {
        cpp: "int maxSubArray(vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int maxSubArray(int[] nums) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def max_subarray(nums: list) -> int:\n    # Write your logic here\n    return 0"
    },
    "kadans-2": {
        cpp: "int maxProduct(vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int maxProduct(int[] nums) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def max_product(nums: list) -> int:\n    # Write your logic here\n    return 0"
    },
    "kadans-3": {
        cpp: "int maxSubarraySumCircular(vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int maxSubarraySumCircular(int[] nums) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def max_subarray_sum_circular(nums: list) -> int:\n    # Write your logic here\n    return 0"
    },
    "kadans-4": {
        cpp: "int maxProfit(vector<int>& prices) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int maxProfit(int[] prices) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def max_profit(prices: list) -> int:\n    # Write your logic here\n    return 0"
    },
    "kadans-5": {
        cpp: "int maximumSum(vector<int>& arr) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int maximumSum(int[] arr) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def maximum_sum(arr: list) -> int:\n    # Write your logic here\n    return 0"
    },
    "prefix-sum-1": {
        cpp: "int subarraySum(vector<int>& nums, int k) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int subarraySum(int[] nums, int k) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def subarray_sum(nums: list, k: int) -> int:\n    # Write your logic here\n    return 0"
    },
    "prefix-sum-2": {
        cpp: "vector<int> rangeSumQuery(vector<int>& nums, vector<vector<int>>& queries) {\n    // Write your logic here\n    return {};\n}",
        java: "    public static int[] rangeSum(int[] nums, int[][] queries) {\n        // Write your logic here\n        return new int[0];\n    }",
        python: "def range_sum(nums: list, queries: list) -> list:\n    # Write your logic here\n    return []"
    },
    "prefix-sum-3": {
        cpp: "int pivotIndex(vector<int>& nums) {\n    // Write your logic here\n    return -1;\n}",
        java: "    public static int pivotIndex(int[] nums) {\n        // Write your logic here\n        return -1;\n    }",
        python: "def pivot_index(nums: list) -> int:\n    # Write your logic here\n    return -1"
    },
    "prefix-sum-4": {
        cpp: "vector<int> productExceptSelf(vector<int>& nums) {\n    // Write your logic here\n    return {};\n}",
        java: "    public static int[] productExceptSelf(int[] nums) {\n        // Write your logic here\n        return new int[0];\n    }",
        python: "def product_except_self(nums: list) -> list:\n    # Write your logic here\n    return []"
    },
    "prefix-sum-5": {
        cpp: "bool checkSubarraySum(vector<int>& nums, int k) {\n    // Write your logic here\n    return false;\n}",
        java: "    public static boolean checkSubarraySum(int[] nums, int k) {\n        // Write your logic here\n        return false;\n    }",
        python: "def check_subarray_sum(nums: list, k: int) -> bool:\n    # Write your logic here\n    return False"
    },
    "hashing-1": {
        cpp: "vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    // Write your logic here\n    return {};\n}",
        java: "    public static List<List<String>> groupAnagrams(String[] strs) {\n        // Write your logic here\n        return new ArrayList<>();\n    }",
        python: "def group_anagrams(strs: list) -> list:\n    # Write your logic here\n    return []"
    },
    "hashing-2": {
        cpp: "bool containsDuplicate(vector<int>& nums) {\n    // Write your logic here\n    return false;\n}",
        java: "    public static boolean containsDuplicate(int[] nums) {\n        // Write your logic here\n        return false;\n    }",
        python: "def contains_duplicate(nums: list) -> bool:\n    # Write your logic here\n    return False"
    },
    "hashing-3": {
        cpp: "vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {\n    // Write your logic here\n    return {};\n}",
        java: "    public static int[] intersection(int[] nums1, int[] nums2) {\n        // Write your logic here\n        return new int[0];\n    }",
        python: "def intersection(nums1: list, nums2: list) -> list:\n    # Write your logic here\n    return []"
    },
    "hashing-4": {
        cpp: "int longestConsecutive(vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int longestConsecutive(int[] nums) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def longest_consecutive(nums: list) -> int:\n    # Write your logic here\n    return 0"
    },
    "hashing-5": {
        cpp: "int subarraysDivByK(vector<int>& nums, int k) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int subarraysDivByK(int[] nums, int k) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def subarrays_div_by_k(nums: list, k: int) -> int:\n    # Write your logic here\n    return 0"
    },
    "binary-search-1": {
        cpp: "int search(vector<int>& nums, int target) {\n    // Write your logic here\n    return -1;\n}",
        java: "    public static int search(int[] nums, int target) {\n        // Write your logic here\n        return -1;\n    }",
        python: "def search(nums: list, target: int) -> int:\n    # Write your logic here\n    return -1"
    },
    "binary-search-2": {
        cpp: "int search(vector<int>& nums, int target) {\n    // Write your logic here\n    return -1;\n}",
        java: "    public static int search(int[] nums, int target) {\n        // Write your logic here\n        return -1;\n    }",
        python: "def search(nums: list, target: int) -> int:\n    # Write your logic here\n    return -1"
    },
    "binary-search-3": {
        cpp: "int findMin(vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int findMin(int[] nums) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def find_min(nums: list) -> int:\n    # Write your logic here\n    return 0"
    },
    "binary-search-4": {
        cpp: "bool searchMatrix(vector<vector<int>>& matrix, int target) {\n    // Write your logic here\n    return false;\n}",
        java: "    public static boolean searchMatrix(int[][] matrix, int target) {\n        // Write your logic here\n        return false;\n    }",
        python: "def search_matrix(matrix: list, target: int) -> bool:\n    # Write your logic here\n    return False"
    },
    "binary-search-5": {
        cpp: "int findPeakElement(vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int findPeakElement(int[] nums) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def find_peak_element(nums: list) -> int:\n    # Write your logic here\n    return 0"
    },
    "linked-list-1": {
        cpp: "ListNode* reverseList(ListNode* head) {\n    // Write your logic here\n    return nullptr;\n}",
        java: "    public static ListNode reverseList(ListNode head) {\n        // Write your logic here\n        return null;\n    }",
        python: "def reverse_list(head: ListNode) -> ListNode:\n    # Write your logic here\n    return None"
    },
    "linked-list-2": {
        cpp: "bool hasCycle(ListNode *head) {\n    // Write your logic here\n    return false;\n}",
        java: "    public static boolean hasCycle(ListNode head) {\n        // Write your logic here\n        return false;\n    }",
        python: "def has_cycle(head: ListNode) -> bool:\n    # Write your logic here\n    return False"
    },
    "linked-list-3": {
        cpp: "ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Write your logic here\n    return nullptr;\n}",
        java: "    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your logic here\n        return null;\n    }",
        python: "def merge_two_lists(list1: ListNode, list2: ListNode) -> ListNode:\n    # Write your logic here\n    return None"
    },
    "linked-list-4": {
        cpp: "ListNode* removeNthFromEnd(ListNode* head, int n) {\n    // Write your logic here\n    return nullptr;\n}",
        java: "    public static ListNode removeNthFromEnd(ListNode head, int n) {\n        // Write your logic here\n        return null;\n    }",
        python: "def remove_nth_from_end(head: ListNode, n: int) -> ListNode:\n    # Write your logic here\n    return None"
    },
    "linked-list-5": {
        cpp: "ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n    // Write your logic here\n    return nullptr;\n}",
        java: "    public static ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        // Write your logic here\n        return null;\n    }",
        python: "def add_two_numbers(l1: ListNode, l2: ListNode) -> ListNode:\n    # Write your logic here\n    return None"
    },
    "stack-and-queue-1": {
        cpp: "bool isValid(string s) {\n    // Write your logic here\n    return false;\n}",
        java: "    public static boolean isValid(String s) {\n        // Write your logic here\n        return false;\n    }",
        python: "def is_valid(s: str) -> bool:\n    # Write your logic here\n    return False"
    },
    "stack-and-queue-2": {
        cpp: "// Complete the MinStack class\nclass MinStack {\npublic:\n    MinStack() {}\n    void push(int val) {}\n    void pop() {}\n    int top() { return 0; }\n    int getMin() { return 0; }\n};",
        java: "    // Complete the MinStack class\n    static class MinStack {\n        public MinStack() {}\n        public void push(int val) {}\n        public void pop() {}\n        public int top() { return 0; }\n        public int getMin() { return 0; }\n    }",
        python: "class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val: int) -> None:\n        pass\n    def pop(self) -> None:\n        pass\n    def top(self) -> int:\n        return 0\n    def get_min(self) -> int:\n        return 0"
    },
    "stack-and-queue-3": {
        cpp: "int evalRPN(vector<string>& tokens) {\n    // Write your logic here\n    return 0;\n}",
        java: "    public static int evalRPN(String[] tokens) {\n        // Write your logic here\n        return 0;\n    }",
        python: "def eval_rpn(tokens: list) -> int:\n    # Write your logic here\n    return 0"
    },
    "stack-and-queue-4": {
        cpp: "vector<int> dailyTemperatures(vector<int>& temperatures) {\n    // Write your logic here\n    return {};\n}",
        java: "    public static int[] dailyTemperatures(int[] temperatures) {\n        // Write your logic here\n        return new int[0];\n    }",
        python: "def daily_temperatures(temperatures: list) -> list:\n    # Write your logic here\n    return []"
    },
    "stack-and-queue-5": {
        cpp: "vector<string> generateParenthesis(int n) {\n    // Write your logic here\n    return {};\n}",
        java: "    public static List<String> generateParenthesis(int n) {\n        // Write your logic here\n        return new ArrayList<>();\n    }",
        python: "def generate_parenthesis(n: int) -> list:\n    # Write your logic here\n    return []"
    },
    "recursion-and-backtracking-1": {
        cpp: "vector<vector<int>> subsets(vector<int>& nums) {\n    // Write your logic here\n    return {};\n}",
        java: "    public static List<List<Integer>> subsets(int[] nums) {\n        // Write your logic here\n        return new ArrayList<>();\n    }",
        python: "def subsets(nums: list) -> list:\n    # Write your logic here\n    return []"
    },
    "recursion-and-backtracking-2": {
        cpp: "vector<vector<int>> permute(vector<int>& nums) {\n    // Write your logic here\n    return {};\n}",
        java: "    public static List<List<Integer>> permute(int[] nums) {\n        // Write your logic here\n        return new ArrayList<>();\n    }",
        python: "def permute(nums: list) -> list:\n    # Write your logic here\n    return []"
    },
    "recursion-and-backtracking-3": {
        cpp: "vector<vector<string>> solveNQueens(int n) {\n    // Write your logic here\n    return {};\n}",
        java: "    public static List<List<String>> solveNQueens(int n) {\n        // Write your logic here\n        return new ArrayList<>();\n    }",
        python: "def solve_n_queens(n: int) -> list:\n    # Write your logic here\n    return []"
    },
    "recursion-and-backtracking-4": {
        cpp: "vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n    // Write your logic here\n    return {};\n}",
        java: "    public static List<List<Integer>> combinationSum(int[] candidates, int target) {\n        // Write your logic here\n        return new ArrayList<>();\n    }",
        python: "def combination_sum(candidates: list, target: int) -> list:\n    # Write your logic here\n    return []"
    },
    "recursion-and-backtracking-5": {
        cpp: "bool exist(vector<vector<char>>& board, string word) {\n    // Write your logic here\n    return false;\n}",
        java: "    public static boolean exist(char[][] board, String word) {\n        // Write your logic here\n        return false;\n    }",
        python: "def exist(board: list, word: str) -> bool:\n    # Write your logic here\n    return False"
    }
};

const commonCppIncludes = `#if __has_include(<bits/stdc++.h>)
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
#include <string>
#include <tuple>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>
#endif`;

const cppHarnesses = {
    "arrays-1": (code) => `${commonCppIncludes}
using namespace std;

${code}

int main() {
    vector<int> arr;
    int x;
    while (cin >> x) arr.push_back(x);
    vector<int> result = reverseArray(arr);
    for (size_t i = 0; i < result.size(); ++i) {
        if (i) cout << " ";
        cout << result[i];
    }
    return 0;
}`,
    "arrays-2": (code) => `${commonCppIncludes}
using namespace std;

${code}

int main() {
    vector<int> arr;
    int x;
    while (cin >> x) arr.push_back(x);
    cout << findMaximum(arr);
    return 0;
}`,
    "arrays-3": (code) => `${commonCppIncludes}
using namespace std;

${code}

int main() {
    vector<int> arr;
    int x;
    while (cin >> x) arr.push_back(x);
    cout << findDuplicate(arr);
    return 0;
}`,
    "arrays-4": (code) => `${commonCppIncludes}
using namespace std;

${code}

int main() {
    int k;
    cin >> k;
    vector<int> arr;
    int x;
    while (cin >> x) arr.push_back(x);
    vector<int> result = rotateArray(arr, k);
    for (size_t i = 0; i < result.size(); ++i) {
        if (i) cout << " ";
        cout << result[i];
    }
    return 0;
}`,
    "arrays-5": (code) => `${commonCppIncludes}
using namespace std;

${code}

int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> intervals(n);
    for (int i = 0; i < n; ++i) cin >> intervals[i].first >> intervals[i].second;
    vector<pair<int, int>> result = mergeIntervals(intervals);
    for (size_t i = 0; i < result.size(); ++i) {
        if (i) cout << "\\n";
        cout << result[i].first << " " << result[i].second;
    }
    return 0;
}`
};

const javaHarnesses = {
    "arrays-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> arr = new ArrayList<>();
        while (sc.hasNextInt()) arr.add(sc.nextInt());
        List<Integer> result = reverseArray(arr);
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(result.get(i));
        }
    }
}`,
    "arrays-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> arr = new ArrayList<>();
        while (sc.hasNextInt()) arr.add(sc.nextInt());
        System.out.print(findMaximum(arr));
    }
}`,
    "arrays-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> arr = new ArrayList<>();
        while (sc.hasNextInt()) arr.add(sc.nextInt());
        System.out.print(findDuplicate(arr));
    }
}`,
    "arrays-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int k = sc.nextInt();
        List<Integer> arr = new ArrayList<>();
        while (sc.hasNextInt()) arr.add(sc.nextInt());
        List<Integer> result = rotateArray(arr, k);
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(result.get(i));
        }
    }
}`,
    "arrays-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] intervals = new int[n][2];
        for (int i = 0; i < n; i++) {
            intervals[i][0] = sc.nextInt();
            intervals[i][1] = sc.nextInt();
        }
        int[][] result = mergeIntervals(intervals);
        for (int i = 0; i < result.length; i++) {
            if (i > 0) System.out.println();
            System.out.print(result[i][0] + " " + result[i][1]);
        }
    }
}`,
    "strings-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s = sc.next();
            String t = sc.next();
            System.out.print(isAnagram(s, t) ? "true" : "false");
        }
    }
}`,
    "strings-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s = sc.next();
            System.out.print(longestPalindrome(s));
        }
    }
}`,
    "strings-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            List<String> strs = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                strs.add(sc.next());
            }
            System.out.print(longestCommonPrefix(strs));
        }
    }
}`,
    "strings-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s = sc.next();
            System.out.print(firstUniqChar(s));
        }
    }
}`,
    "strings-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String s = sc.nextLine();
            System.out.print(reverseWords(s));
        }
    }
}`,
    "two-pointers-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String s = sc.nextLine();
            System.out.print(isPalindrome(s) ? "true" : "false");
        }
    }
}`,
    "two-pointers-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int target = sc.nextInt();
            List<Integer> list = new ArrayList<>();
            while (sc.hasNextInt()) {
                list.add(sc.nextInt());
            }
            int[] numbers = new int[list.size()];
            for (int i = 0; i < list.size(); i++) {
                numbers[i] = list.get(i);
            }
            int[] res = twoSum(numbers, target);
            if (res.length >= 2) {
                System.out.print(res[0] + " " + res[1]);
            }
        }
    }
}`,
    "two-pointers-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = new int[list.size()];
        for (int i = 0; i < list.size(); i++) {
            nums[i] = list.get(i);
        }
        int k = removeDuplicates(nums);
        System.out.println(k);
        for (int i = 0; i < k; i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(nums[i]);
        }
    }
}`,
    "two-pointers-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] height = new int[list.size()];
        for (int i = 0; i < list.size(); i++) {
            height[i] = list.get(i);
        }
        System.out.print(maxArea(height));
    }
}`,
    "two-pointers-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] height = new int[list.size()];
        for (int i = 0; i < list.size(); i++) {
            height[i] = list.get(i);
        }
        System.out.print(trap(height));
    }
}`,
    "sliding-window-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String s = sc.nextLine();
            System.out.print(lengthOfLongestSubstring(s));
        }
    }
}`,
    "sliding-window-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int k = sc.nextInt();
            if (sc.hasNext()) {
                String s = sc.next();
                System.out.print(characterReplacement(s, k));
            }
        }
    }
}`,
    "sliding-window-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int target = sc.nextInt();
            List<Integer> list = new ArrayList<>();
            while (sc.hasNextInt()) {
                list.add(sc.nextInt());
            }
            int[] nums = new int[list.size()];
            for (int i = 0; i < list.size(); ++i) {
                nums[i] = list.get(i);
            }
            System.out.print(minSubArrayLen(target, nums));
        }
    }
}`,
    "sliding-window-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s1 = sc.next();
            if (sc.hasNext()) {
                String s2 = sc.next();
                System.out.print(checkInclusion(s1, s2) ? "true" : "false");
            }
        }
    }
}`,
    "sliding-window-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int k = sc.nextInt();
            List<Integer> list = new ArrayList<>();
            while (sc.hasNextInt()) {
                list.add(sc.nextInt());
            }
            int[] nums = new int[list.size()];
            for (int i = 0; i < list.size(); ++i) {
                nums[i] = list.get(i);
            }
            System.out.print(longestOnes(nums, k));
        }
    }
}`,
    "kadans-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = new int[list.size()];
        for (int i = 0; i < list.size(); ++i) {
            nums[i] = list.get(i);
        }
        System.out.print(maxSubArray(nums));
    }
}`,
    "kadans-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = new int[list.size()];
        for (int i = 0; i < list.size(); ++i) {
            nums[i] = list.get(i);
        }
        System.out.print(maxProduct(nums));
    }
}`,
    "kadans-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = new int[list.size()];
        for (int i = 0; i < list.size(); ++i) {
            nums[i] = list.get(i);
        }
        System.out.print(maxSubarraySumCircular(nums));
    }
}`,
    "kadans-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] prices = new int[list.size()];
        for (int i = 0; i < list.size(); ++i) {
            prices[i] = list.get(i);
        }
        System.out.print(maxProfit(prices));
    }
}`,
    "kadans-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] arr = new int[list.size()];
        for (int i = 0; i < list.size(); ++i) {
            arr[i] = list.get(i);
        }
        System.out.print(maximumSum(arr));
    }
}`,
    "prefix-sum-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int k = sc.nextInt();
            List<Integer> list = new ArrayList<>();
            while (sc.hasNextInt()) {
                list.add(sc.nextInt());
            }
            int[] nums = new int[list.size()];
            for (int i = 0; i < list.size(); ++i) {
                nums[i] = list.get(i);
            }
            System.out.print(subarraySum(nums, k));
        }
    }
}`,
    "prefix-sum-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String line = sc.nextLine();
            Scanner lineSc = new Scanner(line);
            List<Integer> list = new ArrayList<>();
            while (lineSc.hasNextInt()) {
                list.add(lineSc.nextInt());
            }
            int[] nums = new int[list.size()];
            for (int i = 0; i < list.size(); ++i) {
                nums[i] = list.get(i);
            }
            if (sc.hasNextInt()) {
                int q = sc.nextInt();
                int[][] queries = new int[q][2];
                for (int i = 0; i < q; ++i) {
                    queries[i][0] = sc.nextInt();
                    queries[i][1] = sc.nextInt();
                }
                int[] res = rangeSum(nums, queries);
                for (int i = 0; i < res.length; ++i) {
                    if (i > 0) System.out.print(" ");
                    System.out.print(res[i]);
                }
            }
        }
    }
}`,
    "prefix-sum-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = new int[list.size()];
        for (int i = 0; i < list.size(); ++i) {
            nums[i] = list.get(i);
        }
        System.out.print(pivotIndex(nums));
    }
}`,
    "prefix-sum-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = new int[list.size()];
        for (int i = 0; i < list.size(); ++i) {
            nums[i] = list.get(i);
        }
        int[] res = productExceptSelf(nums);
        for (int i = 0; i < res.length; ++i) {
            if (i > 0) System.out.print(" ");
            System.out.print(res[i]);
        }
    }
}`,
    "prefix-sum-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int k = sc.nextInt();
            List<Integer> list = new ArrayList<>();
            while (sc.hasNextInt()) {
                list.add(sc.nextInt());
            }
            int[] nums = new int[list.size()];
            for (int i = 0; i < list.size(); ++i) {
                nums[i] = list.get(i);
            }
            System.out.print(checkSubarraySum(nums, k) ? "true" : "false");
        }
    }
}`,
    "hashing-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> list = new ArrayList<>();
        while (sc.hasNext()) {
            list.add(sc.next());
        }
        String[] strs = list.toArray(new String[0]);
        List<List<String>> res = groupAnagrams(strs);
        List<String> formatted = new ArrayList<>();
        for (List<String> group : res) {
            Collections.sort(group);
            formatted.add(String.join(" ", group));
        }
        Collections.sort(formatted);
        for (int i = 0; i < formatted.size(); ++i) {
            if (i > 0) System.out.print("\n");
            System.out.print(formatted.get(i));
        }
    }
}`,
    "hashing-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = new int[list.size()];
        for (int i = 0; i < list.size(); ++i) {
            nums[i] = list.get(i);
        }
        System.out.print(containsDuplicate(nums) ? "true" : "false");
    }
}`,
    "hashing-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums1 = new int[0];
        int[] nums2 = new int[0];
        if (sc.hasNextLine()) {
            String line1 = sc.nextLine();
            Scanner sc1 = new Scanner(line1);
            List<Integer> list = new ArrayList<>();
            while (sc1.hasNextInt()) list.add(sc1.nextInt());
            nums1 = new int[list.size()];
            for (int i = 0; i < list.size(); ++i) nums1[i] = list.get(i);
        }
        if (sc.hasNextLine()) {
            String line2 = sc.nextLine();
            Scanner sc2 = new Scanner(line2);
            List<Integer> list = new ArrayList<>();
            while (sc2.hasNextInt()) list.add(sc2.nextInt());
            nums2 = new int[list.size()];
            for (int i = 0; i < list.size(); ++i) nums2[i] = list.get(i);
        }
        int[] res = intersection(nums1, nums2);
        Arrays.sort(res);
        for (int i = 0; i < res.length; ++i) {
            if (i > 0) System.out.print(" ");
            System.out.print(res[i]);
        }
    }
}`,
    "hashing-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = new int[list.size()];
        for (int i = 0; i < list.size(); ++i) {
            nums[i] = list.get(i);
        }
        System.out.print(longestConsecutive(nums));
    }
}`,
    "hashing-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int k = sc.nextInt();
            List<Integer> list = new ArrayList<>();
            while (sc.hasNextInt()) {
                list.add(sc.nextInt());
            }
            int[] nums = new int[list.size()];
            for (int i = 0; i < list.size(); ++i) {
                nums[i] = list.get(i);
            }
            System.out.print(subarraysDivByK(nums, k));
        }
    }
}`,
    "binary-search-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int target = sc.nextInt();
            List<Integer> list = new ArrayList<>();
            while (sc.hasNextInt()) {
                list.add(sc.nextInt());
            }
            int[] nums = new int[list.size()];
            for (int i = 0; i < list.size(); i++) {
                nums[i] = list.get(i);
            }
            System.out.print(search(nums, target));
        }
    }
}`,
    "binary-search-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int target = sc.nextInt();
            List<Integer> list = new ArrayList<>();
            while (sc.hasNextInt()) {
                list.add(sc.nextInt());
            }
            int[] nums = new int[list.size()];
            for (int i = 0; i < list.size(); i++) {
                nums[i] = list.get(i);
            }
            System.out.print(search(nums, target));
        }
    }
}`,
    "binary-search-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = new int[list.size()];
        for (int i = 0; i < list.size(); i++) {
            nums[i] = list.get(i);
        }
        System.out.print(findMin(nums));
    }
}`,
    "binary-search-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int target = sc.nextInt();
            if (sc.hasNextInt()) {
                int m = sc.nextInt();
                int n = sc.nextInt();
                int[][] matrix = new int[m][n];
                for (int i = 0; i < m; i++) {
                    for (int j = 0; j < n; j++) {
                        matrix[i][j] = sc.nextInt();
                    }
                }
                System.out.print(searchMatrix(matrix, target) ? "true" : "false");
            }
        }
    }
}`,
    "binary-search-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = new int[list.size()];
        for (int i = 0; i < list.size(); i++) {
            nums[i] = list.get(i);
        }
        System.out.print(findPeakElement(nums));
    }
}`,
    "linked-list-1": (code) => `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        while (sc.hasNextInt()) {
            curr.next = new ListNode(sc.nextInt());
            curr = curr.next;
        }
        ListNode head = reverseList(dummy.next);
        curr = head;
        boolean first = true;
        while (curr != null) {
            if (!first) System.out.print(" ");
            first = false;
            System.out.print(curr.val);
            curr = curr.next;
        }
    }
}`,
    "linked-list-2": (code) => `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int pos = sc.nextInt();
            ListNode dummy = new ListNode(0);
            ListNode curr = dummy;
            List<ListNode> nodes = new ArrayList<>();
            while (sc.hasNextInt()) {
                curr.next = new ListNode(sc.nextInt());
                curr = curr.next;
                nodes.add(curr);
            }
            if (pos != -1 && pos < nodes.size()) {
                curr.next = nodes.get(pos);
            }
            System.out.print(hasCycle(dummy.next) ? "true" : "false");
        }
    }
}`,
    "linked-list-3": (code) => `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ListNode dummy1 = new ListNode(0);
        ListNode curr1 = dummy1;
        if (sc.hasNextLine()) {
            String line1 = sc.nextLine();
            if (line1.trim().isEmpty() && sc.hasNextLine()) {
                line1 = sc.nextLine();
            }
            Scanner sc1 = new Scanner(line1);
            while (sc1.hasNextInt()) {
                curr1.next = new ListNode(sc1.nextInt());
                curr1 = curr1.next;
            }
        }
        ListNode dummy2 = new ListNode(0);
        ListNode curr2 = dummy2;
        if (sc.hasNextLine()) {
            String line2 = sc.nextLine();
            Scanner sc2 = new Scanner(line2);
            while (sc2.hasNextInt()) {
                curr2.next = new ListNode(sc2.nextInt());
                curr2 = curr2.next;
            }
        }
        ListNode head = mergeTwoLists(dummy1.next, dummy2.next);
        ListNode curr = head;
        boolean first = true;
        while (curr != null) {
            if (!first) System.out.print(" ");
            first = false;
            System.out.print(curr.val);
            curr = curr.next;
        }
    }
}`,
    "linked-list-4": (code) => `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            ListNode dummy = new ListNode(0);
            ListNode curr = dummy;
            while (sc.hasNextInt()) {
                curr.next = new ListNode(sc.nextInt());
                curr = curr.next;
            }
            ListNode head = removeNthFromEnd(dummy.next, n);
            curr = head;
            boolean first = true;
            while (curr != null) {
                if (!first) System.out.print(" ");
                first = false;
                System.out.print(curr.val);
                curr = curr.next;
            }
        }
    }
}`,
    "linked-list-5": (code) => `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ListNode dummy1 = new ListNode(0);
        ListNode curr1 = dummy1;
        if (sc.hasNextLine()) {
            String line1 = sc.nextLine();
            if (line1.trim().isEmpty() && sc.hasNextLine()) {
                line1 = sc.nextLine();
            }
            Scanner sc1 = new Scanner(line1);
            while (sc1.hasNextInt()) {
                curr1.next = new ListNode(sc1.nextInt());
                curr1 = curr1.next;
            }
        }
        ListNode dummy2 = new ListNode(0);
        ListNode curr2 = dummy2;
        if (sc.hasNextLine()) {
            String line2 = sc.nextLine();
            Scanner sc2 = new Scanner(line2);
            while (sc2.hasNextInt()) {
                curr2.next = new ListNode(sc2.nextInt());
                curr2 = curr2.next;
            }
        }
        ListNode head = addTwoNumbers(dummy1.next, dummy2.next);
        ListNode curr = head;
        boolean first = true;
        while (curr != null) {
            if (!first) System.out.print(" ");
            first = false;
            System.out.print(curr.val);
            curr = curr.next;
        }
    }
}`,
    "stack-and-queue-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            System.out.print(isValid(sc.next()) ? "true" : "false");
        }
    }
}`,
    "stack-and-queue-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        MinStack minStack = new MinStack();
        boolean first = true;
        while (sc.hasNext()) {
            String op = sc.next();
            if (op.startsWith("push:")) {
                int val = Integer.parseInt(op.substring(5));
                minStack.push(val);
            } else if (op.equals("pop")) {
                minStack.pop();
            } else if (op.equals("top")) {
                if (!first) System.out.print(" ");
                first = false;
                System.out.print(minStack.top());
            } else if (op.equals("getMin")) {
                if (!first) System.out.print(" ");
                first = false;
                System.out.print(minStack.getMin());
            }
        }
    }
}`,
    "stack-and-queue-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> list = new ArrayList<>();
        while (sc.hasNext()) {
            list.add(sc.next());
        }
        String[] tokens = list.toArray(new String[0]);
        System.out.print(evalRPN(tokens));
    }
}`,
    "stack-and-queue-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] temps = new int[list.size()];
        for (int i = 0; i < list.size(); i++) {
            temps[i] = list.get(i);
        }
        int[] res = dailyTemperatures(temps);
        for (int i = 0; i < res.length; i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(res[i]);
        }
    }
}`,
    "stack-and-queue-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            List<String> res = generateParenthesis(n);
            Collections.sort(res);
            for (int i = 0; i < res.size(); i++) {
                if (i > 0) System.out.print(" ");
                System.out.print(res.get(i));
            }
        }
    }
}`,
    "recursion-and-backtracking-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = new int[list.size()];
        for (int i = 0; i < list.size(); i++) {
            nums[i] = list.get(i);
        }
        List<List<Integer>> res = subsets(nums);
        List<String> formatted = new ArrayList<>();
        for (List<Integer> sub : res) {
            Collections.sort(sub);
            List<String> subStrs = new ArrayList<>();
            for (int x : sub) subStrs.add(String.valueOf(x));
            formatted.add(String.join(" ", subStrs));
        }
        Collections.sort(formatted);
        for (int i = 0; i < formatted.size(); i++) {
            if (i > 0) System.out.print("\\n");
            System.out.print(formatted.get(i));
        }
    }
}`,
    "recursion-and-backtracking-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = new int[list.size()];
        for (int i = 0; i < list.size(); i++) {
            nums[i] = list.get(i);
        }
        List<List<Integer>> res = permute(nums);
        List<String> formatted = new ArrayList<>();
        for (List<Integer> perm : res) {
            List<String> permStrs = new ArrayList<>();
            for (int x : perm) permStrs.add(String.valueOf(x));
            formatted.add(String.join(" ", permStrs));
        }
        Collections.sort(formatted);
        for (int i = 0; i < formatted.size(); i++) {
            if (i > 0) System.out.print("\\n");
            System.out.print(formatted.get(i));
        }
    }
}`,
    "recursion-and-backtracking-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            List<List<String>> res = solveNQueens(n);
            List<String> formatted = new ArrayList<>();
            for (List<String> board : res) {
                formatted.add(String.join("\\n", board));
            }
            Collections.sort(formatted);
            for (int i = 0; i < formatted.size(); i++) {
                if (i > 0) System.out.print("\\n---\\n");
                System.out.print(formatted.get(i));
            }
        }
    }
}`,
    "recursion-and-backtracking-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int target = sc.nextInt();
            List<Integer> list = new ArrayList<>();
            while (sc.hasNextInt()) {
                list.add(sc.nextInt());
            }
            int[] candidates = new int[list.size()];
            for (int i = 0; i < list.size(); i++) {
                candidates[i] = list.get(i);
            }
            List<List<Integer>> res = combinationSum(candidates, target);
            List<String> formatted = new ArrayList<>();
            for (List<Integer> comb : res) {
                Collections.sort(comb);
                List<String> combStrs = new ArrayList<>();
                for (int x : comb) combStrs.add(String.valueOf(x));
                formatted.add(String.join(" ", combStrs));
            }
            Collections.sort(formatted);
            for (int i = 0; i < formatted.size(); i++) {
                if (i > 0) System.out.print("\\n");
                System.out.print(formatted.get(i));
            }
        }
    }
}`,
    "recursion-and-backtracking-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String word = sc.next();
            if (sc.hasNextInt()) {
                int m = sc.nextInt();
                int n = sc.nextInt();
                char[][] board = new char[m][n];
                for (int i = 0; i < m; i++) {
                    for (int j = 0; j < n; j++) {
                        board[i][j] = sc.next().charAt(0);
                    }
                }
                System.out.print(exist(board, word) ? "true" : "false");
            }
        }
    }
}`,
    "trees-heaps-and-tries-1": (code) => `import java.util.*;

public class Solution {
${javaTreeNodeAndParser}

${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String line = sc.nextLine();
            TreeNode root = parseTree(line);
            System.out.print(new Solution().maxDepth(root));
        }
    }
}`,
    "trees-heaps-and-tries-2": (code) => `import java.util.*;

public class Solution {
${javaTreeNodeAndParser}

${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String line = sc.nextLine();
            TreeNode root = parseTree(line);
            TreeNode inverted = new Solution().invertTree(root);
            printTree(inverted);
        }
    }
}`,
    "trees-heaps-and-tries-3": (code) => `import java.util.*;

public class Solution {
${javaTreeNodeAndParser}

${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String line = sc.nextLine();
            TreeNode root = parseTree(line);
            List<List<Integer>> res = new Solution().levelOrder(root);
            for (int i = 0; i < res.size(); i++) {
                if (i > 0) System.out.println();
                List<Integer> level = res.get(i);
                for (int j = 0; j < level.size(); j++) {
                    if (j > 0) System.out.print(" ");
                    System.out.print(level.get(j));
                }
            }
        }
    }
}`,
    "trees-heaps-and-tries-4": (code) => `import java.util.*;

public class Solution {
${javaTreeNodeAndParser}

${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String line = sc.nextLine();
            TreeNode root = parseTree(line);
            System.out.print(new Solution().isValidBST(root) ? "true" : "false");
        }
    }
}`,
    "trees-heaps-and-tries-5": (code) => `import java.util.*;

public class Solution {
${javaTreeNodeAndParser}

${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            int targetSum = Integer.parseInt(sc.nextLine().trim());
            String line = sc.hasNextLine() ? sc.nextLine() : "null";
            TreeNode root = parseTree(line);
            System.out.print(new Solution().hasPathSum(root, targetSum) ? "true" : "false");
        }
    }
}`,
    "graph-bfs-dfs-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int m = sc.nextInt();
            int n = sc.nextInt();
            char[][] grid = new char[m][n];
            for (int i = 0; i < m; ++i) {
                for (int j = 0; j < n; ++j) {
                    grid[i][j] = sc.next().charAt(0);
                }
            }
            System.out.print(new Solution().numIslands(grid));
        }
    }
}`,
    "graph-bfs-dfs-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int m = sc.nextInt();
            int n = sc.nextInt();
            int[][] grid = new int[m][n];
            for (int i = 0; i < m; ++i) {
                for (int j = 0; j < n; ++j) {
                    grid[i][j] = sc.nextInt();
                }
            }
            System.out.print(new Solution().maxAreaOfIsland(grid));
        }
    }
}`,
    "graph-bfs-dfs-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int numCourses = sc.nextInt();
            int p = sc.nextInt();
            int[][] prerequisites = new int[p][2];
            for (int i = 0; i < p; ++i) {
                prerequisites[i][0] = sc.nextInt();
                prerequisites[i][1] = sc.nextInt();
            }
            System.out.print(new Solution().canFinish(numCourses, prerequisites) ? "true" : "false");
        }
    }
}`,
    "graph-bfs-dfs-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int m = sc.nextInt();
            int n = sc.nextInt();
            int[][] grid = new int[m][n];
            for (int i = 0; i < m; ++i) {
                for (int j = 0; j < n; ++j) {
                    grid[i][j] = sc.nextInt();
                }
            }
            System.out.print(new Solution().orangesRotting(grid));
        }
    }
}`,
    "graph-bfs-dfs-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int m = sc.nextInt();
            int n = sc.nextInt();
            int[][] image = new int[m][n];
            for (int i = 0; i < m; ++i) {
                for (int j = 0; j < n; ++j) {
                    image[i][j] = sc.nextInt();
                }
            }
            int sr = sc.nextInt();
            int sc_coord = sc.nextInt();
            int color = sc.nextInt();
            int[][] result = new Solution().floodFill(image, sr, sc_coord, color);
            for (int i = 0; i < m; ++i) {
                if (i > 0) System.out.println();
                for (int j = 0; j < n; ++j) {
                    if (j > 0) System.out.print(" ");
                    System.out.print(result[i][j]);
                }
            }
        }
    }
}`,
    "tries-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            String[] ops = new String[n];
            for (int i = 0; i < n; ++i) ops[i] = sc.next();
            String[] argArray = new String[n];
            for (int i = 0; i < n; ++i) {
                String arg = sc.next();
                if (arg.equals("[]")) argArray[i] = "";
                else argArray[i] = arg;
            }
            Trie obj = null;
            for (int i = 0; i < n; ++i) {
                if (i > 0) System.out.print(" ");
                if (ops[i].equals("Trie") || ops[i].equals("Trie()")) {
                    obj = new Trie();
                    System.out.print("null");
                } else if (ops[i].equals("insert")) {
                    obj.insert(argArray[i]);
                    System.out.print("null");
                } else if (ops[i].equals("search")) {
                    System.out.print(obj.search(argArray[i]) ? "true" : "false");
                } else if (ops[i].equals("startsWith")) {
                    System.out.print(obj.startsWith(argArray[i]) ? "true" : "false");
                }
            }
        }
    }
}`,
    "tries-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int m = sc.nextInt();
            int n = sc.nextInt();
            char[][] board = new char[m][n];
            for (int i = 0; i < m; ++i) {
                for (int j = 0; j < n; ++j) {
                    board[i][j] = sc.next().charAt(0);
                }
            }
            List<String> wordsList = new ArrayList<>();
            while (sc.hasNext()) {
                wordsList.add(sc.next());
            }
            String[] words = wordsList.toArray(new String[0]);
            List<String> result = new Solution().findWords(board, words);
            Collections.sort(result);
            for (int i = 0; i < result.size(); ++i) {
                if (i > 0) System.out.print(" ");
                System.out.print(result.get(i));
            }
        }
    }
}`,
    "tries-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String dictLine = sc.nextLine();
            String sentence = sc.hasNextLine() ? sc.nextLine() : "";
            List<String> dictionary = Arrays.asList(dictLine.trim().split("\\s+"));
            System.out.print(new Solution().replaceWords(dictionary, sentence));
        }
    }
}`,
    "tries-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            String[] ops = new String[n];
            for (int i = 0; i < n; ++i) ops[i] = sc.next();
            String[] argArray = new String[n];
            for (int i = 0; i < n; ++i) {
                String arg = sc.next();
                if (arg.equals("[]")) argArray[i] = "";
                else argArray[i] = arg;
            }
            WordDictionary obj = null;
            for (int i = 0; i < n; ++i) {
                if (i > 0) System.out.print(" ");
                if (ops[i].equals("WordDictionary")) {
                    obj = new WordDictionary();
                    System.out.print("null");
                } else if (ops[i].equals("addWord")) {
                    obj.addWord(argArray[i]);
                    System.out.print("null");
                } else if (ops[i].equals("search")) {
                    System.out.print(obj.search(argArray[i]) ? "true" : "false");
                }
            }
        }
    }
}`,
    "tries-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String s = sc.nextLine().trim();
            String dictLine = sc.hasNextLine() ? sc.nextLine() : "";
            String[] dictionary = dictLine.trim().split("\\s+");
            System.out.print(new Solution().minExtraChar(s, dictionary));
        }
    }
}`,
    "dynamic-programming-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            System.out.print(new Solution().climbStairs(sc.nextInt()));
        }
    }
}`,
    "dynamic-programming-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int amount = sc.nextInt();
            List<Integer> list = new ArrayList<>();
            while (sc.hasNextInt()) {
                list.add(sc.nextInt());
            }
            int[] coins = list.stream().mapToInt(i->i).toArray();
            System.out.print(new Solution().coinChange(coins, amount));
        }
    }
}`,
    "dynamic-programming-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String text1 = sc.nextLine();
            String text2 = sc.hasNextLine() ? sc.nextLine() : "";
            System.out.print(new Solution().longestCommonSubsequence(text1, text2));
        }
    }
}`,
    "dynamic-programming-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = list.stream().mapToInt(i->i).toArray();
        System.out.print(new Solution().rob(nums));
    }
}`,
    "dynamic-programming-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String word1 = sc.hasNextLine() ? sc.nextLine() : "";
        String word2 = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.print(new Solution().minDistance(word1, word2));
    }
}`,
    "heaps-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int k = sc.nextInt();
            List<Integer> list = new ArrayList<>();
            while (sc.hasNextInt()) {
                list.add(sc.nextInt());
            }
            int[] nums = list.stream().mapToInt(i->i).toArray();
            System.out.print(new Solution().findKthLargest(nums, k));
        }
    }
}`,
    "heaps-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            String[] ops = new String[n];
            for (int i = 0; i < n; ++i) ops[i] = sc.next();
            String[] argArray = new String[n];
            for (int i = 0; i < n; ++i) {
                String arg = sc.next();
                if (arg.equals("[]")) argArray[i] = "";
                else argArray[i] = arg;
            }
            MedianFinder obj = null;
            for (int i = 0; i < n; ++i) {
                if (i > 0) System.out.print(" ");
                if (ops[i].equals("MedianFinder")) {
                    obj = new MedianFinder();
                    System.out.print("null");
                } else if (ops[i].equals("addNum")) {
                    obj.addNum(Integer.parseInt(argArray[i]));
                    System.out.print("null");
                } else if (ops[i].equals("findMedian")) {
                    System.out.printf(Locale.US, "%.1f", obj.findMedian());
                }
            }
        }
    }
}`,
    "heaps-3": (code) => `import java.util.*;

public class Solution {
${javaListNodeAndParser}

${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int k = sc.nextInt();
            sc.nextLine(); // consume newline
            ListNode[] lists = new ListNode[k];
            for (int i = 0; i < k; ++i) {
                String line = sc.hasNextLine() ? sc.nextLine() : "";
                lists[i] = parseList(line);
            }
            ListNode merged = new Solution().mergeKLists(lists);
            printList(merged);
        }
    }
}`,
    "heaps-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int k = sc.nextInt();
            List<Integer> list = new ArrayList<>();
            while (sc.hasNextInt()) {
                list.add(sc.nextInt());
            }
            int[] nums = list.stream().mapToInt(i->i).toArray();
            int[] result = new Solution().topKFrequent(nums, k);
            Arrays.sort(result);
            for (int i = 0; i < result.length; ++i) {
                if (i > 0) System.out.print(" ");
                System.out.print(result[i]);
            }
        }
    }
}`,
    "heaps-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int k = sc.nextInt();
            int n = sc.nextInt();
            int[][] points = new int[n][2];
            for (int i = 0; i < n; ++i) {
                points[i][0] = sc.nextInt();
                points[i][1] = sc.nextInt();
            }
            int[][] result = new Solution().kClosest(points, k);
            Arrays.sort(result, (a, b) -> {
                if (a[0] != b[0]) return Integer.compare(a[0], b[0]);
                return Integer.compare(a[1], b[1]);
            });
            for (int i = 0; i < result.length; ++i) {
                if (i > 0) System.out.println();
                System.out.print(result[i][0] + " " + result[i][1]);
            }
        }
    }
}`,
    "greedy-1": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) {
            list.add(sc.nextInt());
        }
        int[] nums = list.stream().mapToInt(i->i).toArray();
        System.out.print(new Solution().canJump(nums) ? "true" : "false");
    }
}`,
    "greedy-2": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String gasLine = sc.nextLine();
            String costLine = sc.hasNextLine() ? sc.nextLine() : "";
            String[] gParts = gasLine.trim().split("\\s+");
            String[] cParts = costLine.trim().split("\\s+");
            int[] gas = new int[gParts.length];
            int[] cost = new int[cParts.length];
            for (int i = 0; i < gas.length; i++) gas[i] = Integer.parseInt(gParts[i]);
            for (int i = 0; i < cost.length; i++) cost[i] = Integer.parseInt(cParts[i]);
            System.out.print(new Solution().canCompleteCircuit(gas, cost));
        }
    }
}`,
    "greedy-3": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String gLine = sc.nextLine();
            String sLine = sc.hasNextLine() ? sc.nextLine() : "";
            String[] gParts = gLine.trim().isEmpty() ? new String[0] : gLine.trim().split("\\s+");
            String[] sParts = sLine.trim().isEmpty() ? new String[0] : sLine.trim().split("\\s+");
            int[] g = new int[gParts.length];
            int[] s = new int[sParts.length];
            for (int i = 0; i < g.length; i++) g[i] = Integer.parseInt(gParts[i]);
            for (int i = 0; i < s.length; i++) s[i] = Integer.parseInt(sParts[i]);
            System.out.print(new Solution().findContentChildren(g, s));
        }
    }
}`,
    "greedy-4": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s = sc.next();
            List<Integer> result = new Solution().partitionLabels(s);
            for (int i = 0; i < result.size(); i++) {
                if (i > 0) System.out.print(" ");
                System.out.print(result.get(i));
            }
        }
    }
}`,
    "greedy-5": (code) => `import java.util.*;

public class Solution {
${code}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[][] intervals = new int[n][2];
            for (int i = 0; i < n; ++i) {
                intervals[i][0] = sc.nextInt();
                intervals[i][1] = sc.nextInt();
            }
            System.out.print(new Solution().eraseOverlapIntervals(intervals));
        }
    }
}`
};

const pythonHarnesses = {
    "arrays-1": (code) => `${code}

import sys
arr = [int(x) for x in sys.stdin.read().split()]
print(" ".join(map(str, reverse_array(arr))))`,
    "arrays-2": (code) => `${code}

import sys
arr = [int(x) for x in sys.stdin.read().split()]
print(find_maximum(arr))`,
    "arrays-3": (code) => `${code}

import sys
arr = [int(x) for x in sys.stdin.read().split()]
print(find_duplicate(arr))`,
    "arrays-4": (code) => `${code}

import sys
data = [int(x) for x in sys.stdin.read().split()]
k, arr = data[0], data[1:]
print(" ".join(map(str, rotate_array(arr, k))))`,
    "arrays-5": (code) => `${code}

import sys
data = [int(x) for x in sys.stdin.read().split()]
n = data[0]
intervals = [[data[i], data[i + 1]] for i in range(1, 2 * n + 1, 2)]
for i, interval in enumerate(merge_intervals(intervals)):
    if i:
        print()
    print(f"{interval[0]} {interval[1]}", end="")`,
    "strings-1": (code) => `${code}

import sys
words = sys.stdin.read().split()
if len(words) >= 2:
    print("true" if is_anagram(words[0], words[1]) else "false", end="")`,
    "strings-2": (code) => `${code}

import sys
s = sys.stdin.read().strip()
print(longest_palindrome(s), end="")`,
    "strings-3": (code) => `${code}

import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    strs = data[1:1+n]
    print(longest_common_prefix(strs), end="")`,
    "strings-4": (code) => `${code}

import sys
s = sys.stdin.read().strip()
print(first_uniq_char(s), end="")`,
    "strings-5": (code) => `${code}

import sys
s = sys.stdin.read()
print(reverse_words(s.strip('\r\n')), end="")`,
    "two-pointers-1": (code) => `${code}

import sys
s = sys.stdin.read()
print("true" if is_palindrome(s.strip('\\r\\n')) else "false", end="")`,
    "two-pointers-2": (code) => `${code}

import sys
data = [int(x) for x in sys.stdin.read().split()]
if data:
    target, numbers = data[0], data[1:]
    res = two_sum(numbers, target)
    if len(res) >= 2:
        print(f"{res[0]} {res[1]}", end="")`,
    "two-pointers-3": (code) => `${code}

import sys
nums = [int(x) for x in sys.stdin.read().split()]
k = remove_duplicates(nums)
print(k)
print(" ".join(map(str, nums[:k])), end="")`,
    "two-pointers-4": (code) => `${code}

import sys
height = [int(x) for x in sys.stdin.read().split()]
print(max_area(height), end="")`,
    "two-pointers-5": (code) => `${code}

import sys
height = [int(x) for x in sys.stdin.read().split()]
print(trap(height), end="")`,
    "sliding-window-1": (code) => `${code}

import sys
s = sys.stdin.read()
print(length_of_longest_substring(s.strip('\\r\\n')), end="")`,
    "sliding-window-2": (code) => `${code}

import sys
data = sys.stdin.read().split()
if len(data) >= 2:
    k = int(data[0])
    s = data[1]
    print(character_replacement(s, k), end="")`,
    "sliding-window-3": (code) => `${code}

import sys
data = [int(x) for x in sys.stdin.read().split()]
if len(data) >= 2:
    target = data[0]
    nums = data[1:]
    print(min_subarray_len(target, nums), end="")`,
    "sliding-window-4": (code) => `${code}

import sys
data = sys.stdin.read().split()
if len(data) >= 2:
    s1, s2 = data[0], data[1]
    print("true" if check_inclusion(s1, s2) else "false", end="")`,
    "sliding-window-5": (code) => `${code}

import sys
data = [int(x) for x in sys.stdin.read().split()]
if len(data) >= 2:
    k = data[0]
    nums = data[1:]
    print(longest_ones(nums, k), end="")`,
    "kadans-1": (code) => `${code}

import sys
nums = [int(x) for x in sys.stdin.read().split()]
print(max_subarray(nums), end="")`,
    "kadans-2": (code) => `${code}

import sys
nums = [int(x) for x in sys.stdin.read().split()]
print(max_product(nums), end="")`,
    "kadans-3": (code) => `${code}

import sys
nums = [int(x) for x in sys.stdin.read().split()]
print(max_subarray_sum_circular(nums), end="")`,
    "kadans-4": (code) => `${code}

import sys
prices = [int(x) for x in sys.stdin.read().split()]
print(max_profit(prices), end="")`,
    "kadans-5": (code) => `${code}

import sys
arr = [int(x) for x in sys.stdin.read().split()]
print(maximum_sum(arr), end="")`,
    "prefix-sum-1": (code) => `${code}

import sys
data = [int(x) for x in sys.stdin.read().split()]
if len(data) >= 2:
    k = data[0]
    nums = data[1:]
    print(subarray_sum(nums, k), end="")`,
    "prefix-sum-2": (code) => `${code}

import sys
lines = sys.stdin.read().splitlines()
if lines:
    nums = [int(x) for x in lines[0].split()]
    q = int(lines[1])
    queries = []
    for i in range(2, 2 + q):
        queries.append([int(x) for x in lines[i].split()])
    res = range_sum(nums, queries)
    print(" ".join(map(str, res)), end="")`,
    "prefix-sum-3": (code) => `${code}

import sys
nums = [int(x) for x in sys.stdin.read().split()]
print(pivot_index(nums), end="")`,
    "prefix-sum-4": (code) => `${code}

import sys
nums = [int(x) for x in sys.stdin.read().split()]
print(" ".join(map(str, product_except_self(nums))), end="")`,
    "prefix-sum-5": (code) => `${code}

import sys
data = [int(x) for x in sys.stdin.read().split()]
if len(data) >= 2:
    k = data[0]
    nums = data[1:]
    print("true" if check_subarray_sum(nums, k) else "false", end="")`,
    "hashing-1": (code) => `${code}

import sys
strs = sys.stdin.read().split()
res = group_anagrams(strs)
formatted = []
for group in res:
    formatted.append(" ".join(sorted(group)))
formatted.sort()
print("\\n".join(formatted), end="")`,
    "hashing-2": (code) => `${code}

import sys
nums = [int(x) for x in sys.stdin.read().split()]
print("true" if contains_duplicate(nums) else "false", end="")`,
    "hashing-3": (code) => `${code}

import sys
lines = sys.stdin.read().splitlines()
nums1 = [int(x) for x in lines[0].split()] if len(lines) > 0 else []
nums2 = [int(x) for x in lines[1].split()] if len(lines) > 1 else []
res = sorted(intersection(nums1, nums2))
print(" ".join(map(str, res)), end="")`,
    "hashing-4": (code) => `${code}

import sys
nums = [int(x) for x in sys.stdin.read().split()]
print(longest_consecutive(nums), end="")`,
    "hashing-5": (code) => `${code}

import sys
data = [int(x) for x in sys.stdin.read().split()]
if len(data) >= 2:
    k = data[0]
    nums = data[1:]
    print(subarrays_div_by_k(nums, k), end="")`,
        "binary-search-1": (code) => `${code}

import sys
data = [int(x) for x in sys.stdin.read().split()]
if len(data) >= 2:
    target, nums = data[0], data[1:]
    print(search(nums, target), end="")`,
    "binary-search-2": (code) => `${code}

import sys
data = [int(x) for x in sys.stdin.read().split()]
if len(data) >= 2:
    target, nums = data[0], data[1:]
    print(search(nums, target), end="")`,
    "binary-search-3": (code) => `${code}

import sys
nums = [int(x) for x in sys.stdin.read().split()]
print(find_min(nums), end="")`,
    "binary-search-4": (code) => `${code}

import sys
data = sys.stdin.read().split()
if len(data) >= 4:
    target = int(data[0])
    m, n = int(data[1]), int(data[2])
    matrix = []
    idx = 3
    for i in range(m):
        matrix.append([int(x) for x in data[idx:idx+n]])
        idx += n
    print("true" if search_matrix(matrix, target) else "false", end="")`,
    "binary-search-5": (code) => `${code}

import sys
nums = [int(x) for x in sys.stdin.read().split()]
print(find_peak_element(nums), end="")`,
    "linked-list-1": (code) => `${code}

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

import sys
vals = [int(x) for x in sys.stdin.read().split()]
dummy = ListNode(0)
curr = dummy
for x in vals:
    curr.next = ListNode(x)
    curr = curr.next
head = reverse_list(dummy.next)
curr = head
res = []
while curr:
    res.append(str(curr.val))
    curr = curr.next
print(" ".join(res), end="")`,
    "linked-list-2": (code) => `${code}

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

import sys
data = [int(x) for x in sys.stdin.read().split()]
if len(data) >= 1:
    pos = data[0]
    vals = data[1:]
    dummy = ListNode(0)
    curr = dummy
    nodes = []
    for x in vals:
        curr.next = ListNode(x)
        curr = curr.next
        nodes.append(curr)
    if pos != -1 and pos < len(nodes):
        curr.next = nodes[pos]
    print("true" if has_cycle(dummy.next) else "false", end="")`,
    "linked-list-3": (code) => `${code}

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

import sys
lines = sys.stdin.read().splitlines()
vals1 = [int(x) for x in lines[0].split()] if len(lines) > 0 else []
vals2 = [int(x) for x in lines[1].split()] if len(lines) > 1 else []
dummy1 = ListNode(0)
curr1 = dummy1
for x in vals1:
    curr1.next = ListNode(x)
    curr1 = curr1.next
dummy2 = ListNode(0)
curr2 = dummy2
for x in vals2:
    curr2.next = ListNode(x)
    curr2 = curr2.next
head = merge_two_lists(dummy1.next, dummy2.next)
curr = head
res = []
while curr:
    res.append(str(curr.val))
    curr = curr.next
print(" ".join(res), end="")`,
    "linked-list-4": (code) => `${code}

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

import sys
data = [int(x) for x in sys.stdin.read().split()]
if len(data) >= 1:
    n = data[0]
    vals = data[1:]
    dummy = ListNode(0)
    curr = dummy
    for x in vals:
        curr.next = ListNode(x)
        curr = curr.next
    head = remove_nth_from_end(dummy.next, n)
    curr = head
    res = []
    while curr:
        res.append(str(curr.val))
        curr = curr.next
    print(" ".join(res), end="")`,
    "linked-list-5": (code) => `${code}

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

import sys
lines = sys.stdin.read().splitlines()
vals1 = [int(x) for x in lines[0].split()] if len(lines) > 0 else []
vals2 = [int(x) for x in lines[1].split()] if len(lines) > 1 else []
dummy1 = ListNode(0)
curr1 = dummy1
for x in vals1:
    curr1.next = ListNode(x)
    curr1 = curr1.next
dummy2 = ListNode(0)
curr2 = dummy2
for x in vals2:
    curr2.next = ListNode(x)
    curr2 = curr2.next
head = add_two_numbers(dummy1.next, dummy2.next)
curr = head
res = []
while curr:
    res.append(str(curr.val))
    curr = curr.next
print(" ".join(res), end="")`,
    "stack-and-queue-1": (code) => `${code}

import sys
s = sys.stdin.read().strip()
print("true" if is_valid(s) else "false", end="")`,
    "stack-and-queue-2": (code) => `${code}

import sys
ops = sys.stdin.read().split()
min_stack = MinStack()
res = []
for op in ops:
    if op.startswith("push:"):
        val = int(op.split(":")[1])
        min_stack.push(val)
    elif op == "pop":
        min_stack.pop()
    elif op == "top":
        res.append(str(min_stack.top()))
    elif op == "getMin":
        res.append(str(min_stack.get_min()))
print(" ".join(res), end="")`,
    "stack-and-queue-3": (code) => `${code}

import sys
tokens = sys.stdin.read().split()
print(eval_rpn(tokens), end="")`,
    "stack-and-queue-4": (code) => `${code}

import sys
temps = [int(x) for x in sys.stdin.read().split()]
print(" ".join(map(str, daily_temperatures(temps))), end="")`,
    "stack-and-queue-5": (code) => `${code}

import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    res = sorted(generate_parenthesis(n))
    print(" ".join(res), end="")`,
    "recursion-and-backtracking-1": (code) => `${code}

import sys
nums = [int(x) for x in sys.stdin.read().split()]
res = subsets(nums)
formatted = []
for sub in res:
    formatted.append(" ".join(map(str, sorted(sub))))
formatted.sort()
print("\\n".join(formatted), end="")`,
    "recursion-and-backtracking-2": (code) => `${code}

import sys
nums = [int(x) for x in sys.stdin.read().split()]
res = permute(nums)
formatted = []
for perm in res:
    formatted.append(" ".join(map(str, perm)))
formatted.sort()
print("\\n".join(formatted), end="")`,
    "recursion-and-backtracking-3": (code) => `${code}

import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    res = solve_n_queens(n)
    formatted = []
    for board in res:
        formatted.append("\\n".join(board))
    formatted.sort()
    print("\\n---\\n".join(formatted), end="")`,
    "recursion-and-backtracking-4": (code) => `${code}

import sys
data = [int(x) for x in sys.stdin.read().split()]
if len(data) >= 2:
    target, candidates = data[0], data[1:]
    res = combination_sum(candidates, target)
    formatted = []
    for comb in res:
        formatted.append(" ".join(map(str, sorted(comb))))
    formatted.sort()
    print("\\n".join(formatted), end="")`,
    "recursion-and-backtracking-5": (code) => `${code}

import sys
data = sys.stdin.read().split()
if len(data) >= 3:
    word = data[0]
    m, n = int(data[1]), int(data[2])
    board = []
    idx = 3
    for i in range(m):
        board.append(data[idx:idx+n])
        idx += n
    print("true" if exist(board, word) else "false", end="")`
};

const buildExecutableCode = (sourceCode, questionId, language) => {
    const normalizedLanguage = language.toLowerCase();
    if ((normalizedLanguage === "cpp" || normalizedLanguage === "c++") && cppHarnesses[questionId]) {
        return cppHarnesses[questionId](sourceCode);
    }
    if (normalizedLanguage === "java" && javaHarnesses[questionId]) {
        return javaHarnesses[questionId](sourceCode);
    }
    if ((normalizedLanguage === "python" || normalizedLanguage === "py" || normalizedLanguage === "python3") && pythonHarnesses[questionId]) {
        return pythonHarnesses[questionId](sourceCode);
    }
    return sourceCode;
};

const getLanguageConfig = (language, runDir) => {
    const normalizedLanguage = language.toLowerCase();

    if (normalizedLanguage === "cpp" || normalizedLanguage === "c++") {
        return {
            filename: "solution.cpp",
            compile: { command: "g++", args: ["-std=c++17", "-O2", "solution.cpp", "-o", "solution.out"] },
            run: { command: path.join(runDir, "solution.out"), args: [] },
        };
    }

    if (normalizedLanguage === "java") {
        return {
            filename: "Solution.java",
            compile: { command: "javac", args: ["Solution.java"] },
            run: { command: "java", args: ["-cp", runDir, "Solution"] },
        };
    }

    if (normalizedLanguage === "python" || normalizedLanguage === "py" || normalizedLanguage === "python3") {
        return {
            filename: "solution.py",
            compile: null,
            run: { command: "python3", args: ["solution.py"] },
        };
    }

    return null;
};

const findQuestion = (questionId) => {
    for (const questions of Object.values(questionsData)) {
        const question = questions.find((item) => item.id === questionId);
        if (question) return question;
    }
    return null;
};

const executeSource = async ({ language, sourceCode, input = "", questionId }) => {
    const execId = crypto.randomBytes(8).toString("hex");
    const runDir = path.join(tempDir, `run_${execId}`);
    fs.mkdirSync(runDir, { recursive: true });

    try {
        const languageConfig = getLanguageConfig(language, runDir);
        if (!languageConfig) {
            return {
                success: false,
                status: "unsupported_language",
                output: "",
                error: `Unsupported language: ${language}`,
                durationMs: 0,
            };
        }

        const executableCode = buildExecutableCode(sourceCode, questionId, language);
        fs.writeFileSync(path.join(runDir, languageConfig.filename), executableCode, "utf8");

        if (languageConfig.compile) {
            const compileResult = await runProcess({
                ...languageConfig.compile,
                cwd: runDir,
                timeoutMs: 8000,
            });

            if (compileResult.exitCode !== 0 || compileResult.timedOut) {
                return {
                    success: true,
                    status: compileResult.timedOut ? "timeout" : "compile_error",
                    output: compileResult.stdout,
                    error: compileResult.timedOut ? "Compilation timed out." : compileResult.stderr,
                    durationMs: compileResult.durationMs,
                };
            }
        }

        const runResult = await runProcess({
            ...languageConfig.run,
            input,
            cwd: runDir,
            timeoutMs: 4000,
        });

        return {
            success: true,
            status: runResult.timedOut ? "timeout" : runResult.exitCode === 0 ? "success" : "runtime_error",
            output: runResult.stdout,
            error: runResult.timedOut ? "Execution timed out." : runResult.stderr,
            durationMs: runResult.durationMs,
        };
    } finally {
        fs.rm(runDir, { recursive: true, force: true }, () => {});
    }
};

export const executeCode = async (req, res) => {
    const { language, sourceCode, input, questionId } = req.body;

    if (!language || typeof sourceCode !== "string") {
        return res.status(400).json({ success: false, error: "Language and sourceCode are required" });
    }

    const result = await executeSource({ language, sourceCode, input, questionId });
    return res.status(200).json(result);
};

export const judgeCode = async (req, res) => {
    const { language, sourceCode, questionId, mode = "run" } = req.body;

    if (!language || typeof sourceCode !== "string" || !questionId) {
        return res.status(400).json({
            success: false,
            error: "language, sourceCode, and questionId are required",
        });
    }

    if (sourceCode.length > 20000) {
        return res.status(413).json({ success: false, error: "Source code is too large" });
    }

    const question = findQuestion(questionId);
    if (!question) {
        return res.status(404).json({ success: false, error: "Question not found" });
    }

    const visibleTestCases = question.visibleTestCases || [];
    const hiddenTestCases = mode === "submit" ? question.hiddenTestCases || [] : [];
    const testCases = [...visibleTestCases, ...hiddenTestCases];

    if (!testCases.length) {
        return res.status(400).json({ success: false, error: "No test cases configured for this question" });
    }

    const results = [];
    let allPassed = true;

    for (let index = 0; index < testCases.length; index += 1) {
        const testCase = testCases[index];
        const result = await executeSource({
            language,
            sourceCode,
            input: testCase.input,
            questionId,
        });

        const expected = normalizeOutput(testCase.expectedOutput);
        const actual = normalizeOutput(result.output);
        const passed = result.status === "success" && actual === expected;

        if (!passed) allPassed = false;

        results.push({
            index: index + 1,
            hidden: index >= visibleTestCases.length,
            input: index >= visibleTestCases.length ? "" : testCase.input,
            expected: index >= visibleTestCases.length ? "" : expected,
            actual: index >= visibleTestCases.length ? "" : actual,
            passed,
            error: result.error,
            status: result.status,
            duration: result.durationMs,
        });

        if (!passed) break;
    }

    const passedTestCases = results.filter((result) => result.passed).length;
    const executionTimeMs = results.reduce((total, result) => total + (result.duration || 0), 0);
    const failedResult = results.find((result) => !result.passed);
    const verdictByStatus = {
        compile_error: "Compile Error",
        runtime_error: "Runtime Error",
        timeout: "Time Limit Exceeded",
        unsupported_language: "Unsupported Language",
    };
    const verdict = allPassed ? "Accepted" : verdictByStatus[failedResult?.status] || "Wrong Answer";

    return res.status(200).json({
        success: true,
        mode,
        allPassed,
        status: verdict,
        executionTimeMs,
        memoryUsageKb: estimateMemoryKb(language, sourceCode, results),
        passedTestCases,
        totalTestCases: testCases.length,
        results,
    });
};

export const getStarterCode = (req, res) => {
    const { questionId, language = "cpp" } = req.query;
    const question = findQuestion(questionId);

    if (!question) {
        return res.status(404).json({ success: false, error: "Question not found" });
    }

    return res.status(200).json({
        success: true,
        starterCode: functionStarters[questionId]?.[language] || question.starterCode?.[language] || "",
    });
};
