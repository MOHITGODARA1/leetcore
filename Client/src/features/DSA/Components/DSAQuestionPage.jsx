import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  XCircle,
  Play,
  Send,
  Code2,
  Terminal,
  Cpu,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  Timer,
  BarChart3,
  Activity,
  Clock3,
} from "lucide-react";
import axios from "axios";
import questionsData from "../data/questions.json";
import topicsData from "../data/topics.json";
import { recordAcceptedSubmission } from "../../../services/activityProgress";
import { getCsrfToken } from "../../../services/csrf";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const functionStarters = {
  "arrays-1": {
    cpp: "vector<int> reverseArray(vector<int> arr) {\n    // Write your logic here\n    return arr;\n}",
    java: "public static List<Integer> reverseArray(List<Integer> arr) {\n    // Write your logic here\n    return arr;\n}",
    python: "def reverse_array(arr):\n    # Write your logic here\n    return arr"
  },
  "arrays-2": {
    cpp: "int findMaximum(vector<int> arr) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int findMaximum(List<Integer> arr) {\n    // Write your logic here\n    return 0;\n}",
    python: "def find_maximum(arr):\n    # Write your logic here\n    return 0"
  },
  "arrays-3": {
    cpp: "int findDuplicate(vector<int> arr) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int findDuplicate(List<Integer> arr) {\n    // Write your logic here\n    return 0;\n}",
    python: "def find_duplicate(arr):\n    # Write your logic here\n    return 0"
  },
  "arrays-4": {
    cpp: "vector<int> rotateArray(vector<int> arr, int k) {\n    // Write your logic here\n    return arr;\n}",
    java: "public static List<Integer> rotateArray(List<Integer> arr, int k) {\n    // Write your logic here\n    return arr;\n}",
    python: "def rotate_array(arr, k):\n    # Write your logic here\n    return arr"
  },
  "arrays-5": {
    cpp: "vector<pair<int, int>> mergeIntervals(vector<pair<int, int>> intervals) {\n    // Write your logic here\n    return intervals;\n}",
    java: "public static int[][] mergeIntervals(int[][] intervals) {\n    // Write your logic here\n    return intervals;\n}",
    python: "def merge_intervals(intervals):\n    # Write your logic here\n    return intervals"
  },
  "strings-1": {
    cpp: "bool isAnagram(string s, string t) {\n    // Write your logic here\n    return false;\n}",
    java: "public static boolean isAnagram(String s, String t) {\n    // Write your logic here\n    return false;\n}",
    python: "def is_anagram(s: str, t: str) -> bool:\n    # Write your logic here\n    return False"
  },
  "strings-2": {
    cpp: "string longestPalindrome(string s) {\n    // Write your logic here\n    return \"\";\n}",
    java: "public static String longestPalindrome(String s) {\n    // Write your logic here\n    return \"\";\n}",
    python: "def longest_palindrome(s: str) -> str:\n    # Write your logic here\n    return \"\""
  },
  "strings-3": {
    cpp: "string longestCommonPrefix(vector<string>& strs) {\n    // Write your logic here\n    return \"\";\n}",
    java: "public static String longestCommonPrefix(List<String> strs) {\n    // Write your logic here\n    return \"\";\n}",
    python: "def longest_common_prefix(strs: list) -> str:\n    # Write your logic here\n    return \"\""
  },
  "strings-4": {
    cpp: "int firstUniqChar(string s) {\n    // Write your logic here\n    return -1;\n}",
    java: "public static int firstUniqChar(String s) {\n    // Write your logic here\n    return -1;\n}",
    python: "def first_uniq_char(s: str) -> int:\n    # Write your logic here\n    return -1"
  },
  "strings-5": {
    cpp: "string reverseWords(string s) {\n    // Write your logic here\n    return \"\";\n}",
    java: "public static String reverseWords(String s) {\n    // Write your logic here\n    return \"\";\n}",
    python: "def reverse_words(s: str) -> str:\n    # Write your logic here\n    return \"\""
  },
  "two-pointers-1": {
    cpp: "bool isPalindrome(string s) {\n    // Write your logic here\n    return false;\n}",
    java: "public static boolean isPalindrome(String s) {\n    // Write your logic here\n    return false;\n}",
    python: "def is_palindrome(s: str) -> bool:\n    # Write your logic here\n    return False"
  },
  "two-pointers-2": {
    cpp: "vector<int> twoSum(vector<int>& numbers, int target) {\n    // Write your logic here\n    return {};\n}",
    java: "public static int[] twoSum(int[] numbers, int target) {\n    // Write your logic here\n    return new int[0];\n}",
    python: "def two_sum(numbers: list, target: int) -> list:\n    # Write your logic here\n    return []"
  },
  "two-pointers-3": {
    cpp: "int removeDuplicates(vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int removeDuplicates(int[] nums) {\n    // Write your logic here\n    return 0;\n}",
    python: "def remove_duplicates(nums: list) -> int:\n    # Write your logic here\n    return 0"
  },
  "two-pointers-4": {
    cpp: "int maxArea(vector<int>& height) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int maxArea(int[] height) {\n    // Write your logic here\n    return 0;\n}",
    python: "def max_area(height: list) -> int:\n    # Write your logic here\n    return 0"
  },
  "two-pointers-5": {
    cpp: "int trap(vector<int>& height) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int trap(int[] height) {\n    // Write your logic here\n    return 0;\n}",
    python: "def trap(height: list) -> int:\n    # Write your logic here\n    return 0"
  },
  "sliding-window-1": {
    cpp: "int lengthOfLongestSubstring(string s) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int lengthOfLongestSubstring(String s) {\n    // Write your logic here\n    return 0;\n}",
    python: "def length_of_longest_substring(s: str) -> int:\n    # Write your logic here\n    return 0"
  },
  "sliding-window-2": {
    cpp: "int characterReplacement(string s, int k) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int characterReplacement(String s, int k) {\n    // Write your logic here\n    return 0;\n}",
    python: "def character_replacement(s: str, k: int) -> int:\n    # Write your logic here\n    return 0"
  },
  "sliding-window-3": {
    cpp: "int minSubArrayLen(int target, vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int minSubArrayLen(int target, int[] nums) {\n    // Write your logic here\n    return 0;\n}",
    python: "def min_subarray_len(target: int, nums: list) -> int:\n    # Write your logic here\n    return 0"
  },
  "sliding-window-4": {
    cpp: "bool checkInclusion(string s1, string s2) {\n    // Write your logic here\n    return false;\n}",
    java: "public static boolean checkInclusion(String s1, String s2) {\n    // Write your logic here\n    return false;\n}",
    python: "def check_inclusion(s1: str, s2: str) -> bool:\n    # Write your logic here\n    return False"
  },
  "sliding-window-5": {
    cpp: "int longestOnes(vector<int>& nums, int k) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int longestOnes(int[] nums, int k) {\n    // Write your logic here\n    return 0;\n}",
    python: "def longest_ones(nums: list, k: int) -> int:\n    # Write your logic here\n    return 0"
  },
  "kadans-1": {
    cpp: "int maxSubArray(vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int maxSubArray(int[] nums) {\n    // Write your logic here\n    return 0;\n}",
    python: "def max_subarray(nums: list) -> int:\n    # Write your logic here\n    return 0"
  },
  "kadans-2": {
    cpp: "int maxProduct(vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int maxProduct(int[] nums) {\n    // Write your logic here\n    return 0;\n}",
    python: "def max_product(nums: list) -> int:\n    # Write your logic here\n    return 0"
  },
  "kadans-3": {
    cpp: "int maxSubarraySumCircular(vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int maxSubarraySumCircular(int[] nums) {\n    // Write your logic here\n    return 0;\n}",
    python: "def max_subarray_sum_circular(nums: list) -> int:\n    # Write your logic here\n    return 0"
  },
  "kadans-4": {
    cpp: "int maxProfit(vector<int>& prices) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int maxProfit(int[] prices) {\n    // Write your logic here\n    return 0;\n}",
    python: "def max_profit(prices: list) -> int:\n    # Write your logic here\n    return 0"
  },
  "kadans-5": {
    cpp: "int maximumSum(vector<int>& arr) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int maximumSum(int[] arr) {\n    // Write your logic here\n    return 0;\n}",
    python: "def maximum_sum(arr: list) -> int:\n    # Write your logic here\n    return 0"
  },
  "prefix-sum-1": {
    cpp: "int subarraySum(vector<int>& nums, int k) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int subarraySum(int[] nums, int k) {\n    // Write your logic here\n    return 0;\n}",
    python: "def subarray_sum(nums: list, k: int) -> int:\n    # Write your logic here\n    return 0"
  },
  "prefix-sum-2": {
    cpp: "vector<int> rangeSumQuery(vector<int>& nums, vector<vector<int>>& queries) {\n    // Write your logic here\n    return {};\n}",
    java: "public static int[] rangeSum(int[] nums, int[][] queries) {\n    // Write your logic here\n    return new int[0];\n}",
    python: "def range_sum(nums: list, queries: list) -> list:\n    # Write your logic here\n    return []"
  },
  "prefix-sum-3": {
    cpp: "int pivotIndex(vector<int>& nums) {\n    // Write your logic here\n    return -1;\n}",
    java: "public static int pivotIndex(int[] nums) {\n    // Write your logic here\n    return -1;\n}",
    python: "def pivot_index(nums: list) -> int:\n    # Write your logic here\n    return -1"
  },
  "prefix-sum-4": {
    cpp: "vector<int> productExceptSelf(vector<int>& nums) {\n    // Write your logic here\n    return {};\n}",
    java: "public static int[] productExceptSelf(int[] nums) {\n    // Write your logic here\n    return new int[0];\n}",
    python: "def product_except_self(nums: list) -> list:\n    # Write your logic here\n    return []"
  },
  "prefix-sum-5": {
    cpp: "bool checkSubarraySum(vector<int>& nums, int k) {\n    // Write your logic here\n    return false;\n}",
    java: "public static boolean checkSubarraySum(int[] nums, int k) {\n    // Write your logic here\n    return false;\n}",
    python: "def check_subarray_sum(nums: list, k: int) -> bool:\n    # Write your logic here\n    return False"
  },
  "hashing-1": {
    cpp: "vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    // Write your logic here\n    return {};\n}",
    java: "public static List<List<String>> groupAnagrams(String[] strs) {\n    // Write your logic here\n    return new ArrayList<>();\n}",
    python: "def group_anagrams(strs: list) -> list:\n    # Write your logic here\n    return []"
  },
  "hashing-2": {
    cpp: "bool containsDuplicate(vector<int>& nums) {\n    // Write your logic here\n    return false;\n}",
    java: "public static boolean containsDuplicate(int[] nums) {\n    // Write your logic here\n    return false;\n}",
    python: "def contains_duplicate(nums: list) -> bool:\n    # Write your logic here\n    return False"
  },
  "hashing-3": {
    cpp: "vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {\n    // Write your logic here\n    return {};\n}",
    java: "public static int[] intersection(int[] nums1, int[] nums2) {\n    // Write your logic here\n    return new int[0];\n}",
    python: "def intersection(nums1: list, nums2: list) -> list:\n    # Write your logic here\n    return []"
  },
  "hashing-4": {
    cpp: "int longestConsecutive(vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int longestConsecutive(int[] nums) {\n    // Write your logic here\n    return 0;\n}",
    python: "def longest_consecutive(nums: list) -> int:\n    # Write your logic here\n    return 0"
  },
  "hashing-5": {
    cpp: "int subarraysDivByK(vector<int>& nums, int k) {\n    // Write your logic here\n    return 0;\n}",
    java: "public static int subarraysDivByK(int[] nums, int k) {\n    // Write your logic here\n    return 0;\n}",
    python: "def subarrays_div_by_k(nums: list, k: int) -> int:\n    # Write your logic here\n    return 0"
  },
  "trees-heaps-and-tries-1": {
    cpp: "int maxDepth(TreeNode* root) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int maxDepth(TreeNode root) {\n    // Write your logic here\n    return 0;\n}",
    python: "def maxDepth(root):\n    # Write your logic here\n    return 0"
  },
  "trees-heaps-and-tries-2": {
    cpp: "TreeNode* invertTree(TreeNode* root) {\n    // Write your logic here\n    return root;\n}",
    java: "public TreeNode invertTree(TreeNode root) {\n    // Write your logic here\n    return root;\n}",
    python: "def invertTree(root):\n    # Write your logic here\n    return root"
  },
  "trees-heaps-and-tries-3": {
    cpp: "vector<vector<int>> levelOrder(TreeNode* root) {\n    // Write your logic here\n    return {};\n}",
    java: "public List<List<Integer>> levelOrder(TreeNode root) {\n    // Write your logic here\n    return new ArrayList<>();\n}",
    python: "def levelOrder(root):\n    # Write your logic here\n    return []"
  },
  "trees-heaps-and-tries-4": {
    cpp: "bool isValidBST(TreeNode* root) {\n    // Write your logic here\n    return false;\n}",
    java: "public boolean isValidBST(TreeNode root) {\n    // Write your logic here\n    return false;\n}",
    python: "def isValidBST(root):\n    # Write your logic here\n    return False"
  },
  "trees-heaps-and-tries-5": {
    cpp: "bool hasPathSum(TreeNode* root, int targetSum) {\n    // Write your logic here\n    return false;\n}",
    java: "public boolean hasPathSum(TreeNode root, int targetSum) {\n    // Write your logic here\n    return false;\n}",
    python: "def hasPathSum(root, targetSum):\n    # Write your logic here\n    return False"
  },
  "graph-bfs-dfs-1": {
    cpp: "int numIslands(vector<vector<char>>& grid) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int numIslands(char[][] grid) {\n    // Write your logic here\n    return 0;\n}",
    python: "def numIslands(grid):\n    # Write your logic here\n    return 0"
  },
  "graph-bfs-dfs-2": {
    cpp: "int maxAreaOfIsland(vector<vector<int>>& grid) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int maxAreaOfIsland(int[][] grid) {\n    // Write your logic here\n    return 0;\n}",
    python: "def maxAreaOfIsland(grid):\n    # Write your logic here\n    return 0"
  },
  "graph-bfs-dfs-3": {
    cpp: "bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n    // Write your logic here\n    return false;\n}",
    java: "public boolean canFinish(int numCourses, int[][] prerequisites) {\n    // Write your logic here\n    return false;\n}",
    python: "def canFinish(numCourses, prerequisites):\n    # Write your logic here\n    return False"
  },
  "graph-bfs-dfs-4": {
    cpp: "int orangesRotting(vector<vector<int>>& grid) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int orangesRotting(int[][] grid) {\n    // Write your logic here\n    return 0;\n}",
    python: "def orangesRotting(grid):\n    # Write your logic here\n    return 0"
  },
  "graph-bfs-dfs-5": {
    cpp: "vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {\n    // Write your logic here\n    return image;\n}",
    java: "public int[][] floodFill(int[][] image, int sr, int sc, int color) {\n    // Write your logic here\n    return image;\n}",
    python: "def floodFill(image, sr, sc, color):\n    # Write your logic here\n    return image"
  },
  "tries-1": {
    cpp: "class Trie {\npublic:\n    Trie() {\n        \n    }\n    \n    void insert(string word) {\n        \n    }\n    \n    bool search(string word) {\n        return false;\n    }\n    \n    bool startsWith(string prefix) {\n        return false;\n    }\n};",
    java: "class Trie {\n    public Trie() {\n        \n    }\n    \n    public void insert(String word) {\n        \n    }\n    \n    public boolean search(String word) {\n        return false;\n    }\n    \n    public boolean startsWith(String prefix) {\n        return false;\n    }\n}",
    python: "class Trie:\n    def __init__(self):\n        pass\n\n    def insert(self, word: str) -> None:\n        pass\n\n    def search(self, word: str) -> bool:\n        return False\n\n    def startsWith(self, prefix: str) -> bool:\n        return False"
  },
  "tries-2": {
    cpp: "vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {\n    // Write your logic here\n    return {};\n}",
    java: "public List<String> findWords(char[][] board, String[] words) {\n    // Write your logic here\n    return new ArrayList<>();\n}",
    python: "def findWords(board, words):\n    # Write your logic here\n    return []"
  },
  "tries-3": {
    cpp: "string replaceWords(vector<string>& dictionary, string sentence) {\n    // Write your logic here\n    return sentence;\n}",
    java: "public String replaceWords(List<String> dictionary, String sentence) {\n    // Write your logic here\n    return sentence;\n}",
    python: "def replaceWords(dictionary, sentence):\n    # Write your logic here\n    return sentence"
  },
  "tries-4": {
    cpp: "class WordDictionary {\npublic:\n    WordDictionary() {\n        \n    }\n    \n    void addWord(string word) {\n        \n    }\n    \n    bool search(string word) {\n        return false;\n    }\n};",
    java: "class WordDictionary {\n    public WordDictionary() {\n        \n    }\n    \n    public void addWord(String word) {\n        \n    }\n    \n    public boolean search(String word) {\n        return false;\n    }\n}",
    python: "class WordDictionary:\n    def __init__(self):\n        pass\n\n    def addWord(self, word: str) -> None:\n        pass\n\n    def search(self, word: str) -> bool:\n        return False"
  },
  "tries-5": {
    cpp: "int minExtraChar(string s, vector<string>& dictionary) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int minExtraChar(String s, String[] dictionary) {\n    // Write your logic here\n    return 0;\n}",
    python: "def minExtraChar(s, dictionary):\n    # Write your logic here\n    return 0"
  },
  "dynamic-programming-1": {
    cpp: "int climbStairs(int n) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int climbStairs(int n) {\n    // Write your logic here\n    return 0;\n}",
    python: "def climbStairs(n):\n    # Write your logic here\n    return 0"
  },
  "dynamic-programming-2": {
    cpp: "int coinChange(vector<int>& coins, int amount) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int coinChange(int[] coins, int amount) {\n    // Write your logic here\n    return 0;\n}",
    python: "def coinChange(coins, amount):\n    # Write your logic here\n    return 0"
  },
  "dynamic-programming-3": {
    cpp: "int longestCommonSubsequence(string text1, string text2) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int longestCommonSubsequence(String text1, String text2) {\n    // Write your logic here\n    return 0;\n}",
    python: "def longestCommonSubsequence(text1, text2):\n    # Write your logic here\n    return 0"
  },
  "dynamic-programming-4": {
    cpp: "int rob(vector<int>& nums) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int rob(int[] nums) {\n    // Write your logic here\n    return 0;\n}",
    python: "def rob(nums):\n    # Write your logic here\n    return 0"
  },
  "dynamic-programming-5": {
    cpp: "int minDistance(string word1, string word2) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int minDistance(String word1, String word2) {\n    // Write your logic here\n    return 0;\n}",
    python: "def minDistance(word1, word2):\n    # Write your logic here\n    return 0"
  },
  "heaps-1": {
    cpp: "int findKthLargest(vector<int>& nums, int k) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int findKthLargest(int[] nums, int k) {\n    // Write your logic here\n    return 0;\n}",
    python: "def findKthLargest(nums, k):\n    # Write your logic here\n    return 0"
  },
  "heaps-2": {
    cpp: "class MedianFinder {\npublic:\n    MedianFinder() {\n        \n    }\n    \n    void addNum(int num) {\n        \n    }\n    \n    double findMedian() {\n        return 0.0;\n    }\n};",
    java: "class MedianFinder {\n    public MedianFinder() {\n        \n    }\n    \n    public void addNum(int num) {\n        \n    }\n    \n    public double findMedian() {\n        return 0.0;\n    }\n}",
    python: "class MedianFinder:\n    def __init__(self):\n        pass\n\n    def addNum(self, num: int) -> None:\n        pass\n\n    def findMedian(self) -> float:\n        return 0.0"
  },
  "heaps-3": {
    cpp: "ListNode* mergeKLists(vector<ListNode*>& lists) {\n    // Write your logic here\n    return nullptr;\n}",
    java: "public ListNode mergeKLists(ListNode[] lists) {\n    // Write your logic here\n    return null;\n}",
    python: "def mergeKLists(lists):\n    # Write your logic here\n    return None"
  },
  "heaps-4": {
    cpp: "vector<int> topKFrequent(vector<int>& nums, int k) {\n    // Write your logic here\n    return {};\n}",
    java: "public int[] topKFrequent(int[] nums, int k) {\n    // Write your logic here\n    return new int[0];\n}",
    python: "def topKFrequent(nums, k):\n    # Write your logic here\n    return []"
  },
  "heaps-5": {
    cpp: "vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {\n    // Write your logic here\n    return {};\n}",
    java: "public int[][] kClosest(int[][] points, int k) {\n    // Write your logic here\n    return new int[0][0];\n}",
    python: "def kClosest(points, k):\n    # Write your logic here\n    return []"
  },
  "greedy-1": {
    cpp: "bool canJump(vector<int>& nums) {\n    // Write your logic here\n    return false;\n}",
    java: "public boolean canJump(int[] nums) {\n    // Write your logic here\n    return false;\n}",
    python: "def canJump(nums):\n    # Write your logic here\n    return False"
  },
  "greedy-2": {
    cpp: "int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int canCompleteCircuit(int[] gas, int[] cost) {\n    // Write your logic here\n    return 0;\n}",
    python: "def canCompleteCircuit(gas, cost):\n    # Write your logic here\n    return 0"
  },
  "greedy-3": {
    cpp: "int findContentChildren(vector<int>& g, vector<int>& s) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int findContentChildren(int[] g, int[] s) {\n    // Write your logic here\n    return 0;\n}",
    python: "def findContentChildren(g, s):\n    # Write your logic here\n    return 0"
  },
  "greedy-4": {
    cpp: "vector<int> partitionLabels(string s) {\n    // Write your logic here\n    return {};\n}",
    java: "public List<Integer> partitionLabels(String s) {\n    // Write your logic here\n    return new ArrayList<>();\n}",
    python: "def partitionLabels(s):\n    # Write your logic here\n    return []"
  },
  "greedy-5": {
    cpp: "int eraseOverlapIntervals(vector<vector<int>>& intervals) {\n    // Write your logic here\n    return 0;\n}",
    java: "public int eraseOverlapIntervals(int[][] intervals) {\n    // Write your logic here\n    return 0;\n}",
    python: "def eraseOverlapIntervals(intervals):\n    # Write your logic here\n    return 0"
  }
};

const getStarterCode = (question, questionId, language) => {
  return functionStarters[questionId]?.[language] || question?.starterCode?.[language] || "";
};

const safeJsonParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const formatDuration = (totalSeconds = 0) => {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const formatDateTime = (value) => {
  if (!value) return "Not accepted yet";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
};

const formatMemory = (kb = 0) => {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${Math.round(kb)} KB`;
};

const complexityByQuestion = {
  "arrays-1": { time: "O(n)", space: "O(1)", note: "The array is scanned once while constructing the reversed output." },
  "arrays-2": { time: "O(n)", space: "O(1)", note: "A single pass is enough to compare every element with the current maximum." },
  "arrays-3": { time: "O(n)", space: "O(n)", note: "Hash-based duplicate detection usually visits each value once and stores seen values." },
  "arrays-4": { time: "O(n)", space: "O(n)", note: "Rotation touches every element; extra space depends on the implementation returned by the user." },
  "arrays-5": { time: "O(n log n)", space: "O(n)", note: "Sorting dominates runtime, then intervals are merged in a linear pass." },
  "strings-1": { time: "O(n)", space: "O(1)", note: "Can be solved using a fixed-size frequency array of 26 integers." },
  "strings-2": { time: "O(n^2)", space: "O(1)", note: "Expanding around centers takes quadratic time but constant extra space." },
  "strings-3": { time: "O(n * m)", space: "O(1)", note: "Comparing characters column by column across all strings." },
  "strings-4": { time: "O(n)", space: "O(1)", note: "A frequency map of size at most 26 requires constant extra space." },
  "strings-5": { time: "O(n)", space: "O(n)", note: "Parsing tokens and reversing them requires storage proportional to string length." },
  "two-pointers-1": { time: "O(n)", space: "O(1)", note: "Comparing characters from start and end moving inwards." },
  "two-pointers-2": { time: "O(n)", space: "O(1)", note: "Using two pointers on a sorted array takes linear time." },
  "two-pointers-3": { time: "O(n)", space: "O(1)", note: "In-place duplicate removal is done with a fast and slow pointer." },
  "two-pointers-4": { time: "O(n)", space: "O(1)", note: "Moving left or right pointer inwards depending on which bar is shorter." },
  "two-pointers-5": { time: "O(n)", space: "O(1)", note: "Two pointers track max heights from left and right to compute trapped water." },
  "sliding-window-1": { time: "O(n)", space: "O(min(m, n))", note: "Using a sliding window with a set or map to store character frequencies." },
  "sliding-window-2": { time: "O(n)", space: "O(1)", note: "Slide window while updating letter frequencies in a fixed map of size 26." },
  "sliding-window-3": { time: "O(n)", space: "O(1)", note: "Maintain a sliding window of elements summing to >= target with two pointers." },
  "sliding-window-4": { time: "O(n)", space: "O(1)", note: "Check character counts in sliding window of size s1.length using a fixed map." },
  "sliding-window-5": { time: "O(n)", space: "O(1)", note: "Expanding right pointer and shrinking left pointer when count of zeros exceeds k." },
  "kadans-1": { time: "O(n)", space: "O(1)", note: "Kadane's algorithm keeps track of current maximum subarray sum at each index." },
  "kadans-2": { time: "O(n)", space: "O(1)", note: "Keep track of both minimum and maximum product prefix to handle negative values." },
  "kadans-3": { time: "O(n)", space: "O(1)", note: "Compute max normal subarray sum and max circular subarray sum using total sum minus min subarray." },
  "kadans-4": { time: "O(n)", space: "O(1)", note: "One pass tracking the minimum price seen so far and calculating the max profit." },
  "kadans-5": { time: "O(n)", space: "O(n)", note: "Dynamic programming keeping track of max sums with zero or one deletion." },
  "prefix-sum-1": { time: "O(n)", space: "O(n)", note: "Using a prefix sum map to store frequencies of prefix sums seen so far." },
  "prefix-sum-2": { time: "O(n + q)", space: "O(n)", note: "Precomputing a prefix sum array allows each range query to be solved in O(1) time." },
  "prefix-sum-3": { time: "O(n)", space: "O(1)", note: "Check index where left sum equals total sum minus left sum minus pivot element." },
  "prefix-sum-4": { time: "O(n)", space: "O(1)", note: "Compute prefix and suffix product array in-place without division." },
  "prefix-sum-5": { time: "O(n)", space: "O(min(n, k))", note: "Using a prefix sum modulo k hash map to find matching subarrays of size >= 2." },
  "hashing-1": { time: "O(n * m log m)", space: "O(n * m)", note: "Map sorted word representations to list of original words." },
  "hashing-2": { time: "O(n)", space: "O(n)", note: "Store seen elements in a hash set to detect duplicate items instantly." },
  "hashing-3": { time: "O(n + m)", space: "O(min(n, m))", note: "Find unique elements in both arrays using a hash set check." },
  "hashing-4": { time: "O(n)", space: "O(n)", note: "Insert all numbers into a hash set and search for sequence starters." },
  "hashing-5": { time: "O(n)", space: "O(k)", note: "Maintain cumulative sums modulo k in a map to count divisible subarrays." }
};

const getComplexityEstimate = (questionId, question) => {
  if (complexityByQuestion[questionId]) return complexityByQuestion[questionId];
  const difficulty = question?.difficulty || "Medium";
  if (difficulty === "Easy") {
    return { time: "O(n)", space: "O(1)", note: "Estimated from the problem category and typical accepted approach." };
  }
  if (difficulty === "Hard") {
    return { time: "O(n log n)", space: "O(n)", note: "Estimated from the problem category and typical accepted approach." };
  }
  return { time: "O(n)", space: "O(n)", note: "Estimated from the problem category and typical accepted approach." };
};

const benchmarkByDifficulty = {
  Easy: { avgRuntimeMs: 420, avgMemoryKb: 14200, avgSolveSeconds: 9 * 60, fastestMs: 28 },
  Medium: { avgRuntimeMs: 780, avgMemoryKb: 21800, avgSolveSeconds: 22 * 60, fastestMs: 42 },
  Hard: { avgRuntimeMs: 1260, avgMemoryKb: 32600, avgSolveSeconds: 45 * 60, fastestMs: 64 }
};

const getVerdictTone = (status) => {
  if (status === "Accepted") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (status?.toLowerCase().includes("time")) return "text-amber-300 bg-amber-500/10 border-amber-500/20";
  return "text-red-400 bg-red-500/10 border-red-500/20";
};

const SubmissionStat = ({ label, value, accent = "text-white" }) => (
  <div className="flex items-center justify-between gap-4 border-b border-white/10 py-2.5 last:border-b-0">
    <span className="text-white/45">{label}</span>
    <span className={`font-mono text-sm font-semibold tabular-nums ${accent}`}>{value}</span>
  </div>
);

const complexityScore = {
  "O(1)": 1,
  "O(log n)": 2,
  "O(n)": 3,
  "O(n log n)": 4,
  "O(n^2)": 5,
  "O(2^n)": 6
};

const ComplexityGraph = ({ activeComplexity }) => {
  const levels = Object.keys(complexityScore);
  const activeScore = complexityScore[activeComplexity] || 3;

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-white/45">Time complexity scale</span>
        <span className="font-mono font-semibold text-white">{activeComplexity}</span>
      </div>
      <div className="flex h-28 items-end gap-2 border-b border-white/10 pb-2">
        {levels.map((level) => {
          const score = complexityScore[level];
          const isActive = level === activeComplexity;
          return (
            <div key={level} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`w-full rounded-t-sm transition-colors ${
                  isActive ? "bg-emerald-500" : score <= activeScore ? "bg-white/35" : "bg-white/12"
                }`}
                style={{ height: `${18 + score * 12}px` }}
                title={level}
              />
              <span className={`text-[10px] font-mono ${isActive ? "text-emerald-400" : "text-white/40"}`}>
                {level}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function DSAQuestionPage() {
  const { topic, questionId } = useParams();
  const navigate = useNavigate();

  // Find the current question
  const topicQuestions = questionsData[topic?.toLowerCase()] || [];
  const question = topicQuestions.find((q) => q.id === questionId);

  // Local state
  const [language, setLanguage] = useState("cpp");
  const [editorCode, setEditorCode] = useState("");
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [solvedQuestions, setSolvedQuestions] = useState(() =>
    JSON.parse(localStorage.getItem("leetcore_solved_questions") || "[]")
  );
  const [showCongrats, setShowCongrats] = useState(false);
  
  // Results of compilation & execution
  const [execResult, setExecResult] = useState(null);
  const [submissionAnalytics, setSubmissionAnalytics] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerStopped, setTimerStopped] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(() => {
    const saved = Number(localStorage.getItem("leetcore_workspace_left_width"));
    return Number.isFinite(saved) ? clamp(saved, 30, 70) : 44;
  });
  const [isResizingWorkspace, setIsResizingWorkspace] = useState(false);
  const workspaceRef = useRef(null);

  const topicKey = topic?.toLowerCase() || "";
  const currentIndex = topicQuestions.findIndex((q) => q.id === questionId);
  const previousQuestion = currentIndex > 0 ? topicQuestions[currentIndex - 1] : null;
  const nextQuestion = currentIndex >= 0 && currentIndex < topicQuestions.length - 1
    ? topicQuestions[currentIndex + 1]
    : null;

  const goToQuestion = (targetQuestion) => {
    if (!targetQuestion || !topicKey) return;
    navigate(`/dashboard/data-structures-and-algorithms/${topicKey}/${targetQuestion.id}`);
  };

  const currentTopicData = topicsData.topics.find((t) => t.id === topicKey);
  const nextTopic = currentTopicData
    ? topicsData.topics.find((t) => t.order === currentTopicData.order + 1)
    : null;

  const handleMoveToNextTopic = () => {
    setShowCongrats(false);
    if (!nextTopic) {
      navigate("/dashboard/data-structures-and-algorithms");
      return;
    }
    const nextTopicQuestions = questionsData[nextTopic.id] || [];
    const firstQuestion = nextTopicQuestions[0];
    if (firstQuestion) {
      navigate(`/dashboard/data-structures-and-algorithms/${nextTopic.id}/${firstQuestion.id}`);
    } else {
      navigate("/dashboard/data-structures-and-algorithms");
    }
  };

  const progressHistory = safeJsonParse(localStorage.getItem("leetcore_submission_history"), {});

  const currentQuestionHistory = progressHistory[questionId] || {
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    attempts: 0,
    firstAcceptedAt: null,
    bestRuntimeMs: null,
    bestMemoryKb: null,
    solvingTimeSeconds: null,
    submissions: []
  };

  const createSubmissionAnalytics = (result, solvingSeconds) => {
    const history = safeJsonParse(localStorage.getItem("leetcore_submission_history"), {});
    const previous = history[questionId] || {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      attempts: 0,
      firstAcceptedAt: null,
      bestRuntimeMs: null,
      bestMemoryKb: null,
      solvingTimeSeconds: null,
      submissions: []
    };

    const isAccepted = result.status === "Accepted" || result.allPassed;
    const totalSubmissions = previous.totalSubmissions + 1;
    const acceptedSubmissions = previous.acceptedSubmissions + (isAccepted ? 1 : 0);
    const executionTimeMs = result.executionTimeMs ?? result.results?.reduce((sum, item) => sum + (item.duration || 0), 0) ?? 0;
    const memoryUsageKb = result.memoryUsageKb ?? 0;
    const benchmark = benchmarkByDifficulty[question.difficulty] || benchmarkByDifficulty.Medium;
    const runtimePercentile = clamp(Math.round(100 - (executionTimeMs / Math.max(benchmark.avgRuntimeMs * 1.6, 1)) * 100), 4, 99);
    const memoryPercentile = clamp(Math.round(100 - (memoryUsageKb / Math.max(benchmark.avgMemoryKb * 1.8, 1)) * 100), 3, 99);
    const percentileRanking = Math.round((runtimePercentile * 0.58) + (memoryPercentile * 0.28) + (isAccepted ? 14 : 0));
    const passedTestCases = result.passedTestCases ?? result.results?.filter((item) => item.passed).length ?? 0;
    const totalTestCases = result.totalTestCases ?? result.results?.length ?? 0;
    const firstAcceptedAt = previous.firstAcceptedAt || (isAccepted ? new Date().toISOString() : null);
    const solvingTimeSeconds = previous.solvingTimeSeconds || (isAccepted ? solvingSeconds : null);
    const xpByDifficulty = { Easy: 40, Medium: 80, Hard: 140 };
    const complexity = getComplexityEstimate(questionId, question);

    const analytics = {
      id: `${questionId}-${Date.now()}`,
      verdict: result.status || "Unknown",
      executionTimeMs,
      memoryUsageKb,
      timeComplexity: complexity.time,
      spaceComplexity: complexity.space,
      complexityNote: complexity.note,
      passedTestCases,
      totalTestCases,
      totalSubmissions,
      acceptedSubmissions,
      successRate: Math.round((acceptedSubmissions / totalSubmissions) * 100),
      solvingTimeSeconds: solvingTimeSeconds ?? solvingSeconds,
      averageSolvingTimeSeconds: benchmark.avgSolveSeconds,
      fastestSubmissionMs: Math.min(previous.bestRuntimeMs ?? benchmark.fastestMs, executionTimeMs || benchmark.fastestMs),
      memoryRanking: memoryPercentile,
      runtimeRanking: runtimePercentile,
      percentileRanking: clamp(percentileRanking, 1, 99),
      difficulty: question.difficulty,
      earnedXp: isAccepted ? xpByDifficulty[question.difficulty] || 60 : 0,
      attempts: previous.attempts + 1,
      firstAcceptedAt,
      averageRuntimeMs: benchmark.avgRuntimeMs,
      averageMemoryKb: benchmark.avgMemoryKb,
      status: result.status,
      isAccepted
    };

    const nextHistory = {
      ...history,
      [questionId]: {
        totalSubmissions,
        acceptedSubmissions,
        attempts: analytics.attempts,
        firstAcceptedAt,
        bestRuntimeMs: isAccepted
          ? Math.min(previous.bestRuntimeMs ?? executionTimeMs, executionTimeMs)
          : previous.bestRuntimeMs,
        bestMemoryKb: isAccepted
          ? Math.min(previous.bestMemoryKb ?? memoryUsageKb, memoryUsageKb)
          : previous.bestMemoryKb,
        solvingTimeSeconds,
        submissions: [analytics, ...(previous.submissions || [])].slice(0, 12)
      }
    };

    localStorage.setItem("leetcore_submission_history", JSON.stringify(nextHistory));
    return analytics;
  };

  // Enforce sequential lock rules
  useEffect(() => {
    if (!topic) return;

    const topicKey = topic.toLowerCase();
    const currentTopicData = topicsData.topics.find((t) => t.id === topicKey);
    if (!currentTopicData) return;

    const isUnlocked = () => {
      if (currentTopicData.order === 0) return true;
      const prevTopic = topicsData.topics.find((t) => t.order === currentTopicData.order - 1);
      if (!prevTopic) return false;
      const prevQuestions = questionsData[prevTopic.id] || [];
      const solved = JSON.parse(localStorage.getItem("leetcore_solved_questions") || "[]");
      return prevQuestions.length > 0 && prevQuestions.every((q) => solved.includes(q.id));
    };

    if (!isUnlocked()) {
      navigate("/dashboard/data-structures-and-algorithms");
    }
  }, [topic, navigate]);

  // Initial code load
  useEffect(() => {
    if (!question) return;

    // Try loading from localStorage first
    const cacheKey = `leetcore_function_code_${questionId}_${language}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setEditorCode(cached);
    } else {
      const defaultStarter = getStarterCode(question, questionId, language);
      setEditorCode(defaultStarter);
    }
  }, [questionId, language, question]);

  useEffect(() => {
    if (!questionId) return;

    const savedTimer = safeJsonParse(localStorage.getItem(`leetcore_question_timer_${questionId}`), null);
    const savedHistory = safeJsonParse(localStorage.getItem("leetcore_submission_history"), {});
    const savedQuestionHistory = savedHistory[questionId];
    const solvedTime = savedQuestionHistory?.solvingTimeSeconds;

    setElapsedSeconds(savedTimer?.elapsedSeconds ?? solvedTime ?? 0);
    setTimerStopped(Boolean(savedTimer?.stopped || solvedTime));
    setSubmissionAnalytics(savedQuestionHistory?.submissions?.[0] || null);
  }, [questionId]);

  useEffect(() => {
    if (!questionId) return undefined;

    const persistTimer = (nextSeconds = elapsedSeconds, stopped = timerStopped) => {
      localStorage.setItem(`leetcore_question_timer_${questionId}`, JSON.stringify({
        elapsedSeconds: nextSeconds,
        stopped
      }));
    };

    if (timerStopped) {
      persistTimer(elapsedSeconds, true);
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      if (document.hidden) return;
      setElapsedSeconds((seconds) => {
        const nextSeconds = seconds + 1;
        persistTimer(nextSeconds, false);
        return nextSeconds;
      });
    }, 1000);

    const handleVisibilityChange = () => {
      persistTimer(elapsedSeconds, timerStopped);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      persistTimer(elapsedSeconds, timerStopped);
    };
  }, [elapsedSeconds, questionId, timerStopped]);

  useEffect(() => {
    if (!isResizingWorkspace) return undefined;

    const handlePointerMove = (event) => {
      const workspaceBounds = workspaceRef.current?.getBoundingClientRect();
      if (!workspaceBounds) return;

      const pointerX = event.touches?.[0]?.clientX ?? event.clientX;
      const nextWidth = ((pointerX - workspaceBounds.left) / workspaceBounds.width) * 100;
      const clampedWidth = clamp(nextWidth, 30, 70);
      setLeftPaneWidth(clampedWidth);
      localStorage.setItem("leetcore_workspace_left_width", String(clampedWidth));
    };

    const stopResizing = () => setIsResizingWorkspace(false);

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", stopResizing);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", stopResizing);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", stopResizing);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizingWorkspace]);

  // Handle code change
  const handleEditorChange = (value) => {
    setEditorCode(value || "");
    const cacheKey = `leetcore_function_code_${questionId}_${language}`;
    localStorage.setItem(cacheKey, value || "");
  };

  // Reset starter code
  const resetCode = () => {
    if (!question) return;
    if (window.confirm("Are you sure you want to reset your code to the starter template?")) {
      const defaultStarter = getStarterCode(question, questionId, language);
      setEditorCode(defaultStarter);
      const cacheKey = `leetcore_function_code_${questionId}_${language}`;
      localStorage.setItem(cacheKey, defaultStarter);
    }
  };

  if (!question) {
    return (
      <div className="h-screen bg-[var(--lc-bg)] text-[var(--lc-text)] flex flex-col items-center justify-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--lc-line)] bg-[var(--lc-panel-soft)]">
          <AlertTriangle size={28} className="text-[var(--lc-orange)]" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Question Not Found</h1>
        <p className="mt-2 mb-6 max-w-md text-center text-[var(--lc-muted)]">
          The question ID you are trying to access does not exist or belongs to another topic.
        </p>
        <button
          onClick={() => navigate("/dashboard/data-structures-and-algorithms")}
          className="lc-pressable flex items-center gap-2 rounded-lg px-5 py-2.5 bg-[var(--lc-orange)] text-[var(--lc-text-inverse)] font-semibold hover:opacity-90"
        >
          <ArrowLeft size={16} /> Back to Roadmap
        </button>
      </div>
    );
  }

  const judgeCodeOnServer = async (mode) => {
    const response = await axios.post(`${API_URL}/api/v1/compiler/judge`, {
      language,
      sourceCode: editorCode,
      questionId,
      mode
    }, {
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": await getCsrfToken()
      },
      timeout: 30000
    });

    return response.data;
  };

  // Execute visible test cases
  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOpen(true);
    setExecResult({ running: true, mode: "run" });

    try {
      const result = await judgeCodeOnServer("run");
      setExecResult(result);
    } catch (err) {
      setExecResult({
        mode: "run",
        allPassed: false,
        results: [],
        status: "Compiler Error",
        error: err.response?.data?.error || err.message || "Unable to reach compiler server"
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code (Evaluates both visible and hidden test cases)
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setConsoleOpen(true);
    setExecResult({ running: true, mode: "submit" });

    try {
      const result = await judgeCodeOnServer("submit");
      setExecResult(result);
      const analytics = createSubmissionAnalytics(result, elapsedSeconds);
      setSubmissionAnalytics(analytics);
      setActiveLeftTab("submissions");

      if (result.allPassed) {
        setTimerStopped(true);
        localStorage.setItem(`leetcore_question_timer_${questionId}`, JSON.stringify({
          elapsedSeconds,
          stopped: true
        }));
        const activity = await recordAcceptedSubmission({
          questionId,
          topicId: topicKey,
          difficulty: question.difficulty,
          language,
          runtimeMs: result.executionTimeMs,
          memoryKb: result.memoryUsageKb,
        });
        const wasAlreadySolved = solvedQuestions.includes(questionId);
        setSolvedQuestions(activity.solvedQuestions);

        const solvedInTopic = topicQuestions.filter(q => activity.solvedQuestions.includes(q.id)).length;
        const totalInTopic = topicQuestions.length;
        if (solvedInTopic === totalInTopic && !wasAlreadySolved) {
          setShowCongrats(true);
        }
      }
    } catch (err) {
      setExecResult({
        mode: "submit",
        allPassed: false,
        results: [],
        status: "Compiler Error",
        error: err.response?.data?.error || err.message || "Unable to reach compiler server"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSubmissionDashboard = () => {
    const analytics = submissionAnalytics || currentQuestionHistory.submissions?.[0];

    if (!analytics) {
      return (
        <div className="flex min-h-96 flex-col items-center justify-center rounded-lg border border-white/10 bg-[#202022] p-8 text-center">
          <BarChart3 size={30} className="mb-3 text-white/35" />
          <h2 className="text-base font-semibold text-white">No submissions yet</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/45">
            Submit your solution to see the verdict, runtime, memory, complexity, and recent attempts here.
          </p>
        </div>
      );
    }

    const verdictTone = getVerdictTone(analytics.verdict);

    return (
      <div className="space-y-5 text-sm">
        <div className="border-b border-white/10 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium text-white/45">Submission</p>
              <div className="mt-2 flex flex-wrap items-center gap-2.5">
                <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${verdictTone}`}>
                  {analytics.verdict}
                </span>
                <span className="text-xs font-medium text-white/55">
                  {analytics.passedTestCases}/{analytics.totalTestCases} cases
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-medium text-white/45">Solving Time</p>
              <p className="mt-1 font-mono text-lg font-semibold text-white">
                {formatDuration(analytics.solvingTimeSeconds)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-1 md:grid-cols-2">
          <SubmissionStat label="Runtime" value={`${analytics.executionTimeMs}ms`} />
          <SubmissionStat label="Memory" value={formatMemory(analytics.memoryUsageKb)} />
          <SubmissionStat
            label="Passed"
            value={`${analytics.passedTestCases}/${analytics.totalTestCases}`}
            accent={analytics.isAccepted ? "text-emerald-400" : "text-red-400"}
          />
          <SubmissionStat label="Success Rate" value={`${analytics.successRate}%`} />
          <SubmissionStat label="Attempts" value={analytics.attempts} />
          <SubmissionStat label="First Accepted" value={formatDateTime(analytics.firstAcceptedAt)} />
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-white/55" />
            <h3 className="text-sm font-semibold text-white">Complexity</h3>
          </div>
          <ComplexityGraph activeComplexity={analytics.timeComplexity} />
          <div className="mt-4 grid gap-x-8 gap-y-1 md:grid-cols-2">
            <SubmissionStat label="Time Complexity" value={analytics.timeComplexity} accent="text-emerald-400" />
            <SubmissionStat label="Space Complexity" value={analytics.spaceComplexity} />
            <SubmissionStat label="Difficulty" value={analytics.difficulty} />
            <SubmissionStat label="Fastest Runtime" value={`${analytics.fastestSubmissionMs}ms`} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-white/50">
            {analytics.complexityNote}
          </p>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="mb-3 flex items-center gap-2">
            <Clock3 size={15} className="text-white/55" />
            <h3 className="text-sm font-semibold text-white">Recent Attempts</h3>
          </div>
          <div className="overflow-hidden">
            {(currentQuestionHistory.submissions || [analytics]).slice(0, 5).map((submission) => (
              <div key={submission.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-white/10 py-2.5 text-xs last:border-b-0">
                <span className={submission.verdict === "Accepted" ? "font-semibold text-emerald-400" : "font-semibold text-red-400"}>
                  {submission.verdict}
                </span>
                <span className="font-mono text-white/65">{submission.executionTimeMs}ms</span>
                <span className="font-mono text-white/45">{formatMemory(submission.memoryUsageKb)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-[var(--lc-bg)] text-[var(--lc-text)] flex flex-col overflow-hidden">
      
      {/* Workspace Header */}
      <header className="min-h-14 shrink-0 grid grid-cols-1 gap-3 border-b border-[var(--lc-line)] bg-[var(--lc-panel-soft)] px-3 py-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/data-structures-and-algorithms")}
            className="lc-pressable p-2 rounded-lg hover:bg-[var(--lc-orange-soft)] text-[var(--lc-muted)] hover:text-[var(--lc-orange)] transition-colors duration-200"
            aria-label="Back to roadmap"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="h-4 w-px bg-[var(--lc-line)]" />

          <h1 className="min-w-0 text-base font-bold text-[var(--lc-text)] tracking-tight flex items-center gap-2">
            <span className="truncate">{question.name}</span>
            {solvedQuestions.includes(questionId) && (
              <span className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                <CheckCircle size={11} />
                Solved
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                question.difficulty === "Easy"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : question.difficulty === "Medium"
                  ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            >
              {question.difficulty}
            </span>
          </h1>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="lc-pressable flex min-w-28 items-center justify-center gap-2 rounded-xl border border-[var(--lc-line)] bg-[var(--lc-input)] px-4 py-2 text-sm font-medium text-[var(--lc-text)] hover:bg-[var(--lc-panel-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play size={15} className="fill-current text-[var(--lc-muted)]" />
            Run Code
          </button>

          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="lc-pressable flex min-w-32 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={15} />
            Submit
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-start gap-3 lg:justify-end">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[var(--lc-line)] bg-[var(--lc-input)] px-2.5 py-1.5">
            <Code2 size={14} className="text-[var(--lc-muted)]" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[var(--lc-text)] focus:outline-none cursor-pointer"
            >
              <option value="cpp" className="bg-[var(--lc-panel)]">C++ (g++)</option>
              <option value="java" className="bg-[var(--lc-panel)]">Java (OpenJDK)</option>
              <option value="python" className="bg-[var(--lc-panel)]">Python (3.14)</option>
            </select>
          </div>

          <button
            onClick={resetCode}
            className="lc-pressable p-2 rounded-lg bg-[var(--lc-input)] text-[var(--lc-muted)] hover:bg-[var(--lc-orange-soft)] hover:text-[var(--lc-orange)] transition-colors duration-200"
            title="Reset Starter Code"
          >
            <RefreshCw size={14} />
          </button>

          <div className={`flex min-w-28 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${
            timerStopped
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-[var(--lc-line)] bg-[var(--lc-input)] text-[var(--lc-muted)]"
          }`}>
            <Timer size={15} />
            <span className="font-mono tabular-nums">{formatDuration(elapsedSeconds)}</span>
          </div>
        </div>
      </header>

      {/* Main Work Area */}
      <div
        ref={workspaceRef}
        className="flex-1 flex flex-col gap-2 lg:flex-row min-h-0 w-full items-stretch overflow-hidden p-2 bg-[var(--lc-bg)]"
      >
        
        {/* Left Pane (Description & Test cases) */}
        <div
          className="lc-question-left-pane w-full min-w-0 lg:min-w-[320px] overflow-hidden rounded-xl border border-[var(--lc-line)] flex flex-col bg-[var(--lc-panel)]"
          style={{ "--leetcore-left-pane-width": `${leftPaneWidth}%` }}
        >
          
          {/* Tabs header */}
          <div className="h-11 border-b border-white/10 px-4 flex items-center justify-between gap-4 bg-[#202022]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveLeftTab("description")}
                className={`text-xs font-semibold tracking-wide border-b-2 py-2.5 transition-all duration-150 ${
                  activeLeftTab === "description"
                    ? "border-white/80 text-white"
                    : "border-transparent text-white/50 hover:text-white/75"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <BookOpen size={13} /> Description
                </span>
              </button>

              <button
                onClick={() => setActiveLeftTab("testcases")}
                className={`text-xs font-semibold tracking-wide border-b-2 py-2.5 transition-all duration-150 ${
                  activeLeftTab === "testcases"
                    ? "border-white/80 text-white"
                    : "border-transparent text-white/50 hover:text-white/75"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Lightbulb size={13} /> Test Cases
                </span>
              </button>

              <button
                onClick={() => setActiveLeftTab("submissions")}
                className={`text-xs font-semibold tracking-wide border-b-2 py-2.5 transition-all duration-150 ${
                  activeLeftTab === "submissions"
                    ? "border-white/80 text-white"
                    : "border-transparent text-white/50 hover:text-white/75"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <BarChart3 size={13} /> Submissions
                </span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goToQuestion(previousQuestion)}
                disabled={!previousQuestion}
                className="lc-pressable flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/65 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Previous question"
                title="Previous question"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                onClick={() => goToQuestion(nextQuestion)}
                disabled={!nextQuestion}
                className="lc-pressable flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/65 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Next question"
                title="Next question"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {activeLeftTab === "description" ? (
              <div className="space-y-6 text-sm text-white/72 leading-relaxed">

                {/* Description */}
                <div>
                  <h2 className="text-white font-semibold text-base mb-2">Problem Statement</h2>
                  <p className="whitespace-pre-line text-white/72">{question.description}</p>
                </div>

                {/* Input Format */}
                <div>
                  <h3 className="text-white font-semibold mb-1">Input Format</h3>
                  <p className="text-white/55">{question.inputFormat}</p>
                </div>

                {/* Output Format */}
                <div>
                  <h3 className="text-white font-semibold mb-1">Output Format</h3>
                  <p className="text-white/55">{question.outputFormat}</p>
                </div>

                {/* Constraints */}
                <div>
                  <h3 className="text-white font-semibold mb-1">Constraints</h3>
                  <pre className="p-3 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-white/75 whitespace-pre-wrap">
                    {question.constraints}
                  </pre>
                </div>

                {/* Examples */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Examples</h3>
                  <div className="space-y-4">
                    {question.examples?.map((ex, i) => (
                      <div key={i} className="p-4 bg-[#202022] border border-white/10 rounded-lg space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white/45">Example {i + 1}</h4>
                        <div className="text-xs font-mono grid grid-cols-[60px_1fr] gap-x-2 gap-y-1">
                          <span className="text-white/38 font-bold">Input:</span>
                          <span className="text-white/72 whitespace-pre-wrap">{ex.input}</span>
                          <span className="text-white/38 font-bold">Output:</span>
                          <span className="text-white/78 whitespace-pre-wrap">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="mt-2 text-xs text-white/55 italic border-t border-white/5 pt-2">
                            <strong>Explanation: </strong> {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeLeftTab === "testcases" ? (
              <div className="space-y-4 text-sm">
                <h2 className="text-white font-semibold text-base">Visible Test Cases</h2>
                <p className="text-xs text-white/55">
                  These test cases are run when you select the "Run" action. Ensure your code satisfies these conditions.
                </p>
                <div className="space-y-3 mt-4">
                  {question.visibleTestCases?.map((tc, i) => (
                    <div key={i} className="border border-white/10 rounded-lg overflow-hidden bg-[#202022] p-4 space-y-2">
                      <h3 className="text-xs font-bold text-white/45">TestCase {i + 1}</h3>
                      <div className="grid grid-cols-[90px_1fr] gap-y-2 text-xs font-mono">
                        <span className="text-white/38">Input:</span>
                        <pre className="bg-black/30 p-1.5 rounded border border-white/5 text-white/72 overflow-x-auto whitespace-pre-wrap">{tc.input}</pre>
                        
                        <span className="text-white/38">Expected:</span>
                        <pre className="bg-black/30 p-1.5 rounded border border-white/5 text-white/78 overflow-x-auto whitespace-pre-wrap">{tc.expectedOutput}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              renderSubmissionDashboard()
            )}
          </div>
        </div>

        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize workspace panels"
          onMouseDown={() => setIsResizingWorkspace(true)}
          onTouchStart={() => setIsResizingWorkspace(true)}
          className={`hidden lg:flex w-2 shrink-0 cursor-col-resize items-center justify-center rounded-lg border border-transparent transition-colors ${
            isResizingWorkspace ? "bg-white/10 border-white/20" : "hover:bg-white/8 hover:border-white/10"
          }`}
        >
          <div className="h-12 w-1 rounded-full bg-white/15" />
        </div>

        {/* Right Pane (Monaco Editor & Bottom Console) */}
        <div className="flex-1 flex flex-col min-w-0 lg:min-w-[350px] rounded-lg border border-white/10 bg-[#1a1a1b] overflow-hidden">
          
          {/* Code Editor */}
          <div className="flex-1 min-h-0 relative">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language === "java" ? "java" : "python"}
              theme="vs-dark"
              value={editorCode}
              onChange={handleEditorChange}
              options={{
                fontSize: 14,
                fontFamily: "Fira Code, Menlo, Monaco, Consolas, Courier New, monospace",
                minimap: { enabled: false },
                wordWrap: "on",
                automaticLayout: true,
                padding: { top: 12, bottom: 12 }
              }}
            />
          </div>

          {/* Console / Output Window */}
          {execResult && (
            <div
              className={`max-h-[55vh] resize-y border-t border-white/10 bg-[#1f1f21] transition-all duration-200 ${
                consoleOpen ? "h-72 min-h-24" : "h-11"
              } flex flex-col overflow-hidden`}
            >
              <div
                onClick={() => setConsoleOpen(!consoleOpen)}
                className="h-11 shrink-0 border-b border-white/10 px-4 flex items-center justify-between bg-[#202022] cursor-pointer hover:bg-[#242426]"
              >
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-white/60" />
                  <span className="text-sm font-semibold text-white/80">Test Result</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {execResult.status && !execResult.running && (
                    <span className={execResult.status === "Accepted" ? "font-semibold text-emerald-400" : "font-semibold text-red-400"}>
                      {execResult.status}
                    </span>
                  )}
                  <button className="text-white/40 hover:text-white font-medium">
                    {consoleOpen ? "Collapse" : "Expand"}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 text-xs scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {execResult.running ? (
                  <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 text-center">
                    <Cpu className="text-white/60 animate-spin" size={28} />
                    <span className="text-white/55 font-medium">
                      {execResult.mode === "submit" ? "Submitting all test cases..." : "Running visible test cases..."}
                    </span>
                  </div>
                ) : (() => {
                  const results = execResult.results || [];
                  const passedCount = execResult.passedTestCases ?? results.filter((r) => r.passed).length;
                  const totalCount = execResult.totalTestCases ?? results.length;

                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-3 border-b border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          {execResult.status === "Accepted" ? (
                            <CheckCircle size={18} className="text-emerald-400" />
                          ) : (
                            <XCircle size={18} className="text-red-400" />
                          )}
                          <span className={`text-base font-semibold ${
                            execResult.status === "Accepted" ? "text-emerald-400" : "text-red-400"
                          }`}>
                            {execResult.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-white/50">
                          <span>{passedCount}/{totalCount} testcases passed</span>
                          {execResult.executionTimeMs !== undefined && <span>{execResult.executionTimeMs}ms</span>}
                          {execResult.memoryUsageKb !== undefined && <span>{formatMemory(execResult.memoryUsageKb)}</span>}
                        </div>
                      </div>

                      {results.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {results.map((r, i) => (
                            <span
                              key={`${r.index || i}-${r.passed}`}
                              className={`rounded-md px-3 py-1.5 font-medium ${
                                r.passed ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              Case {r.index || i + 1}
                            </span>
                          ))}
                        </div>
                      )}

                      {execResult.error && (
                        <pre className="rounded-md border border-red-500/20 bg-red-950/20 p-3 font-mono text-red-300 whitespace-pre-wrap">
                          {execResult.error}
                        </pre>
                      )}

                      <div className="space-y-3">
                        {results.map((r, i) => (
                          <details
                            key={`${r.index || i}-detail`}
                            open={!r.passed || i === 0}
                            className="border-b border-white/10 pb-3 last:border-b-0"
                          >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1">
                              <span className={`flex items-center gap-2 font-semibold ${
                                r.passed ? "text-emerald-400" : "text-red-400"
                              }`}>
                                {r.passed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                {r.hidden ? "Hidden Case" : "Case"} {r.index || i + 1}
                              </span>
                              {r.duration !== undefined && <span className="font-mono text-white/45">{r.duration}ms</span>}
                            </summary>

                            {r.hidden ? (
                              <p className="mt-2 text-white/45">Hidden testcase details are not shown after submit.</p>
                            ) : (
                              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                                <div>
                                  <p className="mb-1 text-white/40">Input</p>
                                  <pre className="min-h-11 overflow-x-auto rounded-md bg-[#2a2a2d] p-3 font-mono text-white/75 whitespace-pre-wrap">{r.input}</pre>
                                </div>
                                <div>
                                  <p className="mb-1 text-white/40">Expected</p>
                                  <pre className="min-h-11 overflow-x-auto rounded-md bg-[#2a2a2d] p-3 font-mono text-white/75 whitespace-pre-wrap">{r.expected}</pre>
                                </div>
                                <div>
                                  <p className="mb-1 text-white/40">Output</p>
                                  <pre className={`min-h-11 overflow-x-auto rounded-md bg-[#2a2a2d] p-3 font-mono whitespace-pre-wrap ${
                                    r.passed ? "text-white/75" : "text-red-300"
                                  }`}>{r.actual || "(No output)"}</pre>
                                </div>
                              </div>
                            )}

                            {r.error && (
                              <pre className="mt-3 rounded-md border border-amber-500/20 bg-amber-950/20 p-3 font-mono text-amber-300 whitespace-pre-wrap">
                                {r.error}
                              </pre>
                            )}
                          </details>
                        ))}
                      </div>

                      {execResult.mode === "submit" && execResult.allPassed && (() => {
                        const currentTopicData = topicsData.topics.find((t) => t.id === topic?.toLowerCase());
                        const nextTopicData = currentTopicData
                          ? topicsData.topics.find((t) => t.order === currentTopicData.order + 1)
                          : null;
                        const totalQuestions = topicQuestions.length;
                        const solvedList = JSON.parse(localStorage.getItem("leetcore_solved_questions") || "[]");
                        const solvedCountInTopic = topicQuestions.filter(q => solvedList.includes(q.id)).length;
                        const isTopicCompleted = totalQuestions > 0 && solvedCountInTopic === totalQuestions;

                        return (
                          <div className="border-t border-emerald-500/20 pt-3 text-emerald-400">
                            <p className="font-semibold">Problem solved successfully.</p>
                            <p className="mt-1 text-white/60">
                              {isTopicCompleted ? (
                                <>
                                  All {totalQuestions} questions in{" "}
                                  <strong className="text-white font-semibold">{currentTopicData?.label || topic}</strong> are complete.{" "}
                                  {nextTopicData ? <span>{nextTopicData.label} is now unlocked.</span> : <span>You have completed the roadmap.</span>}
                                </>
                              ) : (
                                <>
                                  This question is marked as completed. Topic progress:{" "}
                                  <strong className="text-white font-semibold">{solvedCountInTopic}/{totalQuestions}</strong>
                                </>
                              )}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in animate-duration-200">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
            {/* Decorative gradient glowing circles */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>

            {/* Pulsing ring around check circle */}
            <div className="relative mx-auto w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75"></div>
              <CheckCircle size={44} className="text-emerald-400 relative z-10" />
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight font-sans">Congratulations!</h2>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              You have successfully completed the <span className="text-emerald-400 font-bold capitalize">{(currentTopicData?.label || topicKey)?.replace("-", " ")}</span> topic by solving all of its challenges!
            </p>

            <div className="space-y-3">
              <button
                onClick={handleMoveToNextTopic}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                {nextTopic ? `Move to ${nextTopic.label}` : "Return to Roadmap"}
                <ChevronRight size={18} />
              </button>
              
              <button
                onClick={() => setShowCongrats(false)}
                className="w-full py-3 px-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 font-medium transition-all duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

        </div>
      </div>
    </div>
  );
}
