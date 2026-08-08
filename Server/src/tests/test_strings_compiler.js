import { judgeCode } from "../controllers/compiler.controller.js";

const pythonSolutions = {
    "strings-1": `def is_anagram(s: str, t: str) -> bool:
    return sorted(s) == sorted(t)`,
    
    "strings-2": `def longest_palindrome(s: str) -> str:
    if not s:
        return ""
    start, end = 0, 0
    for i in range(len(s)):
        # Odd
        l, r = i, i
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if r - l + 1 > end - start + 1:
                start, end = l, r
            l -= 1
            r += 1
        # Even
        l, r = i, i + 1
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if r - l + 1 > end - start + 1:
                start, end = l, r
            l -= 1
            r += 1
    return s[start:end+1]`,
    
    "strings-3": `def longest_common_prefix(strs: list) -> str:
    if not strs:
        return ""
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix`,
    
    "strings-4": `def first_uniq_char(s: str) -> int:
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1
    for idx, char in enumerate(s):
        if freq[char] == 1:
            return idx
    return -1`,
    
    "strings-5": `def reverse_words(s: str) -> str:
    return " ".join(s.split()[::-1])`,
    "two-pointers-1": `def is_palindrome(s: str) -> bool:
    clean = "".join(c.lower() for c in s if c.isalnum())
    return clean == clean[::-1]`,
    "two-pointers-2": `def two_sum(numbers: list, target: int) -> list:
    l, r = 0, len(numbers) - 1
    while l < r:
        s = numbers[l] + numbers[r]
        if s == target:
            return [l + 1, r + 1]
        elif s < target:
            l += 1
        else:
            r -= 1
    return []`,
    "two-pointers-3": `def remove_duplicates(nums: list) -> int:
    if not nums:
        return 0
    write = 1
    for r in range(1, len(nums)):
        if nums[r] != nums[r-1]:
            nums[write] = nums[r]
            write += 1
    return write`,
    "two-pointers-4": `def max_area(height: list) -> int:
    l, r = 0, len(height) - 1
    ans = 0
    while l < r:
        ans = max(ans, min(height[l], height[r]) * (r - l))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return ans`,
    "two-pointers-5": `def trap(height: list) -> int:
    if not height:
        return 0
    l, r = 0, len(height) - 1
    left_max, right_max = height[l], height[r]
    ans = 0
    while l < r:
        if left_max < right_max:
            l += 1
            left_max = max(left_max, height[l])
            ans += left_max - height[l]
        else:
            r -= 1
            right_max = max(right_max, height[r])
            ans += right_max - height[r]
    return ans`,
    "sliding-window-1": `def length_of_longest_substring(s: str) -> int:
    char_map = {}
    left = 0
    ans = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        ans = max(ans, right - left + 1)
    return ans`,
    "sliding-window-2": `def character_replacement(s: str, k: int) -> int:
    count = {}
    max_freq = 0
    left = 0
    ans = 0
    for right in range(len(s)):
        count[s[right]] = count.get(s[right], 0) + 1
        max_freq = max(max_freq, count[s[right]])
        while (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
        ans = max(ans, right - left + 1)
    return ans`,
    "sliding-window-3": `def min_subarray_len(target: int, nums: list) -> int:
    left = 0
    curr_sum = 0
    ans = float('inf')
    for right in range(len(nums)):
        curr_sum += nums[right]
        while curr_sum >= target:
            ans = min(ans, right - left + 1)
            curr_sum -= nums[left]
            left += 1
    return ans if ans != float('inf') else 0`,
    "sliding-window-4": `def check_inclusion(s1: str, s2: str) -> bool:
    if len(s1) > len(s2):
        return False
    cnt1 = [0] * 26
    cnt2 = [0] * 26
    for i in range(len(s1)):
        cnt1[ord(s1[i]) - ord('a')] += 1
        cnt2[ord(s2[i]) - ord('a')] += 1
    if cnt1 == cnt2:
        return True
    for i in range(len(s1), len(s2)):
        cnt2[ord(s2[i]) - ord('a')] += 1
        cnt2[ord(s2[i - len(s1)]) - ord('a')] -= 1
        if cnt1 == cnt2:
            return True
    return False`,
    "sliding-window-5": `def longest_ones(nums: list, k: int) -> int:
    left = 0
    ans = 0
    zeros = 0
    for right in range(len(nums)):
        if nums[right] == 0:
            zeros += 1
        while zeros > k:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        ans = max(ans, right - left + 1)
    return ans`,
    "kadans-1": `def max_subarray(nums: list) -> int:
    max_sum = nums[0]
    curr_sum = 0
    for x in nums:
        curr_sum = max(x, curr_sum + x)
        max_sum = max(max_sum, curr_sum)
    return max_sum`,
    "kadans-2": `def max_product(nums: list) -> int:
    ans = max(nums)
    curr_min, curr_max = 1, 1
    for x in nums:
        if x == 0:
            curr_min, curr_max = 1, 1
            continue
        tmp = curr_max * x
        curr_max = max(x * curr_max, x * curr_min, x)
        curr_min = min(tmp, x * curr_min, x)
        ans = max(ans, curr_max)
    return ans`,
    "kadans-3": `def max_subarray_sum_circular(nums: list) -> int:
    total_sum = sum(nums)
    max_sum = nums[0]
    curr_max = 0
    min_sum = nums[0]
    curr_min = 0
    for x in nums:
        curr_max = max(x, curr_max + x)
        max_sum = max(max_sum, curr_max)
        curr_min = min(x, curr_min + x)
        min_sum = min(min_sum, curr_min)
    if max_sum < 0:
        return max_sum
    return max(max_sum, total_sum - min_sum)`,
    "kadans-4": `def max_profit(prices: list) -> int:
    if not prices:
        return 0
    min_price = prices[0]
    max_prof = 0
    for price in prices:
        min_price = min(min_price, price)
        max_prof = max(max_prof, price - min_price)
    return max_prof`,
    "kadans-5": `def maximum_sum(arr: list) -> int:
    n = len(arr)
    if n == 1:
        return arr[0]
    one_del = [0] * n
    no_del = [0] * n
    one_del[0] = arr[0]
    no_del[0] = arr[0]
    ans = arr[0]
    for i in range(1, n):
        no_del[i] = max(no_del[i-1] + arr[i], arr[i])
        one_del[i] = max(no_del[i-1], one_del[i-1] + arr[i])
        ans = max(ans, no_del[i], one_del[i])
    return ans`,
    "prefix-sum-1": `def subarray_sum(nums: list, k: int) -> int:
    prefix = {0: 1}
    curr_sum = 0
    ans = 0
    for x in nums:
        curr_sum += x
        ans += prefix.get(curr_sum - k, 0)
        prefix[curr_sum] = prefix.get(curr_sum, 0) + 1
    return ans`,
    "prefix-sum-2": `def range_sum(nums: list, queries: list) -> list:
    prefix = [0] * (len(nums) + 1)
    for i in range(len(nums)):
        prefix[i+1] = prefix[i] + nums[i]
    res = []
    for left, right in queries:
        res.append(prefix[right+1] - prefix[left])
    return res`,
    "prefix-sum-3": `def pivot_index(nums: list) -> int:
    total = sum(nums)
    left_sum = 0
    for idx, x in enumerate(nums):
        if left_sum == total - left_sum - x:
            return idx
        left_sum += x
    return -1`,
    "prefix-sum-4": `def product_except_self(nums: list) -> list:
    n = len(nums)
    ans = [1] * n
    for i in range(1, n):
        ans[i] = ans[i-1] * nums[i-1]
    right = 1
    for i in range(n-1, -1, -1):
        ans[i] *= right
        right *= nums[i]
    return ans`,
    "prefix-sum-5": `def check_subarray_sum(nums: list, k: int) -> bool:
    remainder_map = {0: -1}
    total = 0
    for idx, x in enumerate(nums):
        total += x
        r = total % k
        if r in remainder_map:
            if idx - remainder_map[r] >= 2:
                return True
        else:
            remainder_map[r] = idx
    return False`,
    "hashing-1": `def group_anagrams(strs: list) -> list:
    groups = {}
    for s in strs:
        key = "".join(sorted(s))
        groups.setdefault(key, []).append(s)
    return list(groups.values())`,
    "hashing-2": `def contains_duplicate(nums: list) -> bool:
    return len(nums) != len(set(nums))`,
    "hashing-3": `def intersection(nums1: list, nums2: list) -> list:
    return list(set(nums1) & set(nums2))`,
    "hashing-4": `def longest_consecutive(nums: list) -> int:
    s = set(nums)
    ans = 0
    for x in s:
        if (x - 1) not in s:
            y = x + 1
            while y in s:
                y += 1
            ans = max(ans, y - x)
    return ans`,
    "hashing-5": `def subarrays_div_by_k(nums: list, k: int) -> int:
    prefix = {0: 1}
    curr_sum = 0
    ans = 0
    for x in nums:
        curr_sum += x
        r = curr_sum % k
        if r < 0:
            r += k
        ans += prefix.get(r, 0)
        prefix[r] = prefix.get(r, 0) + 1
    return ans`
};

const cppSolutions = {
    "strings-1": `bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;
    int count[26] = {0};
    for (char c : s) count[c - 'a']++;
    for (char c : t) {
        if (--count[c - 'a'] < 0) return false;
    }
    return true;
}`,
    "strings-2": `string longestPalindrome(string s) {
    if (s.empty()) return "";
    int start = 0, maxLen = 0;
    for (int i = 0; i < s.length(); i++) {
        int l = i, r = i;
        while (l >= 0 && r < s.length() && s[l] == s[r]) {
            if (r - l + 1 > maxLen) {
                start = l;
                maxLen = r - l + 1;
            }
            l--; r++;
        }
        l = i; r = i + 1;
        while (l >= 0 && r < s.length() && s[l] == s[r]) {
            if (r - l + 1 > maxLen) {
                start = l;
                maxLen = r - l + 1;
            }
            l--; r++;
        }
    }
    return s.substr(start, maxLen);
}`,
    "strings-3": `string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";
    string prefix = strs[0];
    for (int i = 1; i < strs.size(); i++) {
        while (strs[i].find(prefix) != 0) {
            prefix = prefix.substr(0, prefix.length() - 1);
            if (prefix.empty()) return "";
        }
    }
    return prefix;
}`,
    "strings-4": `int firstUniqChar(string s) {
    int count[256] = {0};
    for (char c : s) count[(unsigned char)c]++;
    for (int i = 0; i < s.length(); i++) {
        if (count[(unsigned char)s[i]] == 1) return i;
    }
    return -1;
}`,
    "strings-5": `string reverseWords(string s) {
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
}`,
    "two-pointers-1": `bool isPalindrome(string s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        if (!isalnum(s[l])) {
            l++;
        } else if (!isalnum(s[r])) {
            r--;
        } else {
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
    }
    return true;
}`,
    "two-pointers-2": `vector<int> twoSum(vector<int>& numbers, int target) {
    int l = 0, r = numbers.size() - 1;
    while (l < r) {
        int sum = numbers[l] + numbers[r];
        if (sum == target) return {l + 1, r + 1};
        else if (sum < target) l++;
        else r--;
    }
    return {};
}`,
    "two-pointers-3": `int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int write = 1;
    for (int r = 1; r < nums.size(); r++) {
        if (nums[r] != nums[r-1]) {
            nums[write++] = nums[r];
        }
    }
    return write;
}`,
    "two-pointers-4": `int maxArea(vector<int>& height) {
    int l = 0, r = height.size() - 1;
    int ans = 0;
    while (l < r) {
        ans = max(ans, min(height[l], height[r]) * (r - l));
        if (height[l] < height[r]) l++;
        else r--;
    }
    return ans;
}`,
    "two-pointers-5": `int trap(vector<int>& height) {
    if (height.empty()) return 0;
    int l = 0, r = height.size() - 1;
    int leftMax = height[l], rightMax = height[r];
    int ans = 0;
    while (l < r) {
        if (leftMax < rightMax) {
            l++;
            leftMax = max(leftMax, height[l]);
            ans += leftMax - height[l];
        } else {
            r--;
            rightMax = max(rightMax, height[r]);
            ans += rightMax - height[r];
        }
    }
    return ans;
}`,
    "sliding-window-1": `int lengthOfLongestSubstring(string s) {
    vector<int> m(256, -1);
    int left = 0, ans = 0;
    for (int right = 0; right < s.length(); right++) {
        if (m[s[right]] >= left) {
            left = m[s[right]] + 1;
        }
        m[s[right]] = right;
        ans = max(ans, right - left + 1);
    }
    return ans;
}`,
    "sliding-window-2": `int characterReplacement(string s, int k) {
    vector<int> count(26, 0);
    int maxFreq = 0, left = 0, ans = 0;
    for (int right = 0; right < s.length(); right++) {
        maxFreq = max(maxFreq, ++count[s[right] - 'A']);
        while ((right - left + 1) - maxFreq > k) {
            count[s[left] - 'A']--;
            left++;
        }
        ans = max(ans, right - left + 1);
    }
    return ans;
}`,
    "sliding-window-3": `int minSubArrayLen(int target, vector<int>& nums) {
    int left = 0, curr_sum = 0, ans = 1e9;
    for (int right = 0; right < nums.size(); right++) {
        curr_sum += nums[right];
        while (curr_sum >= target) {
            ans = min(ans, right - left + 1);
            curr_sum -= nums[left++];
        }
    }
    return ans == 1e9 ? 0 : ans;
}`,
    "sliding-window-4": `bool checkInclusion(string s1, string s2) {
    if (s1.length() > s2.length()) return false;
    vector<int> cnt1(26, 0), cnt2(26, 0);
    for (size_t i = 0; i < s1.length(); i++) {
        cnt1[s1[i] - 'a']++;
        cnt2[s2[i] - 'a']++;
    }
    if (cnt1 == cnt2) return true;
    for (size_t i = s1.length(); i < s2.length(); i++) {
        cnt2[s2[i] - 'a']++;
        cnt2[s2[i - s1.length()] - 'a']--;
        if (cnt1 == cnt2) return true;
    }
    return false;
}`,
    "sliding-window-5": `int longestOnes(vector<int>& nums, int k) {
    int left = 0, ans = 0, zeros = 0;
    for (int right = 0; right < nums.size(); right++) {
        if (nums[right] == 0) zeros++;
        while (zeros > k) {
            if (nums[left++] == 0) zeros--;
        }
        ans = max(ans, right - left + 1);
    }
    return ans;
}`,
    "kadans-1": `int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0], currSum = 0;
    for (int x : nums) {
        currSum = max(x, currSum + x);
        maxSum = max(maxSum, currSum);
    }
    return maxSum;
}`,
    "kadans-2": `int maxProduct(vector<int>& nums) {
    int ans = nums[0];
    int currMin = 1, currMax = 1;
    for (int x : nums) {
        if (x == 0) {
            currMin = 1;
            currMax = 1;
            ans = max(ans, 0);
            continue;
        }
        int tmp = currMax * x;
        currMax = max({x * currMax, x * currMin, x});
        currMin = min({tmp, x * currMin, x});
        ans = max(ans, currMax);
    }
    return ans;
}`,
    "kadans-3": `int maxSubarraySumCircular(vector<int>& nums) {
    int totalSum = 0;
    int maxSum = nums[0], currMax = 0;
    int minSum = nums[0], currMin = 0;
    for (int x : nums) {
        totalSum += x;
        currMax = max(x, currMax + x);
        maxSum = max(maxSum, currMax);
        currMin = min(x, currMin + x);
        minSum = min(minSum, currMin);
    }
    if (maxSum < 0) return maxSum;
    return max(maxSum, totalSum - minSum);
}`,
    "kadans-4": `int maxProfit(vector<int>& prices) {
    if (prices.empty()) return 0;
    int minPrice = prices[0];
    int maxProf = 0;
    for (int price : prices) {
        minPrice = min(minPrice, price);
        maxProf = max(maxProf, price - minPrice);
    }
    return maxProf;
}`,
    "kadans-5": `int maximumSum(vector<int>& arr) {
    int n = arr.size();
    if (n == 1) return arr[0];
    vector<int> one_del(n, 0), no_del(n, 0);
    one_del[0] = arr[0];
    no_del[0] = arr[0];
    int ans = arr[0];
    for (int i = 1; i < n; i++) {
        no_del[i] = max(no_del[i-1] + arr[i], arr[i]);
        one_del[i] = max(no_del[i-1], one_del[i-1] + arr[i]);
        ans = max({ans, no_del[i], one_del[i]});
    }
    return ans;
}`,
    "prefix-sum-1": `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> prefix;
    prefix[0] = 1;
    int currSum = 0, ans = 0;
    for (int x : nums) {
        currSum += x;
        if (prefix.count(currSum - k)) ans += prefix[currSum - k];
        prefix[currSum]++;
    }
    return ans;
}`,
    "prefix-sum-2": `vector<int> rangeSumQuery(vector<int>& nums, vector<vector<int>>& queries) {
    vector<int> prefix(nums.size() + 1, 0);
    for (size_t i = 0; i < nums.size(); i++) {
        prefix[i+1] = prefix[i] + nums[i];
    }
    vector<int> res;
    for (auto& q : queries) {
        res.push_back(prefix[q[1]+1] - prefix[q[0]]);
    }
    return res;
}`,
    "prefix-sum-3": `int pivotIndex(vector<int>& nums) {
    int total = 0;
    for (int x : nums) total += x;
    int leftSum = 0;
    for (size_t i = 0; i < nums.size(); i++) {
        if (leftSum == total - leftSum - nums[i]) return i;
        leftSum += nums[i];
    }
    return -1;
}`,
    "prefix-sum-4": `vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> ans(n, 1);
    for (int i = 1; i < n; i++) {
        ans[i] = ans[i-1] * nums[i-1];
    }
    int right = 1;
    for (int i = n - 1; i >= 0; i--) {
        ans[i] *= right;
        right *= nums[i];
    }
    return ans;
}`,
    "prefix-sum-5": `bool checkSubarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> rem;
    rem[0] = -1;
    int total = 0;
    for (int i = 0; i < nums.size(); i++) {
        total += nums[i];
        int r = total % k;
        if (rem.count(r)) {
            if (i - rem[r] >= 2) return true;
        } else {
            rem[r] = i;
        }
    }
    return false;
}`,
    "hashing-1": `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    for (const string& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        groups[key].push_back(s);
    }
    vector<vector<string>> res;
    for (auto& pair : groups) {
        res.push_back(pair.second);
    }
    return res;
}`,
    "hashing-2": `bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> s(nums.begin(), nums.end());
    return s.size() != nums.size();
}`,
    "hashing-3": `vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
    unordered_set<int> s1(nums1.begin(), nums1.end());
    unordered_set<int> res;
    for (int x : nums2) {
        if (s1.count(x)) res.insert(x);
    }
    return vector<int>(res.begin(), res.end());
}`,
    "hashing-4": `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> s(nums.begin(), nums.end());
    int ans = 0;
    for (int x : s) {
        if (!s.count(x - 1)) {
            int y = x + 1;
            while (s.count(y)) y++;
            ans = max(ans, y - x);
        }
    }
    return ans;
}`,
    "hashing-5": `int subarraysDivByK(vector<int>& nums, int k) {
    unordered_map<int, int> prefix;
    prefix[0] = 1;
    int currSum = 0, ans = 0;
    for (int x : nums) {
        currSum += x;
        int r = currSum % k;
        if (r < 0) r += k;
        if (prefix.count(r)) ans += prefix[r];
        prefix[r]++;
    }
    return ans;
}`
};

const javaSolutions = {
    "strings-1": `    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) count[s.charAt(i) - 'a']++;
        for (int i = 0; i < t.length(); i++) {
            if (--count[t.charAt(i) - 'a'] < 0) return false;
        }
        return true;
    }`,
    "strings-2": `    public static String longestPalindrome(String s) {
        if (s == null || s.length() == 0) return "";
        int start = 0, maxLen = 0;
        for (int i = 0; i < s.length(); i++) {
            int l = i, r = i;
            while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
                if (r - l + 1 > maxLen) {
                    start = l;
                    maxLen = r - l + 1;
                }
                l--; r++;
            }
            l = i; r = i + 1;
            while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
                if (r - l + 1 > maxLen) {
                    start = l;
                    maxLen = r - l + 1;
                }
                l--; r++;
            }
        }
        return s.substring(start, start + maxLen);
    }`,
    "strings-3": `    public static String longestCommonPrefix(List<String> strs) {
        if (strs == null || strs.size() == 0) return "";
        String prefix = strs.get(0);
        for (int i = 1; i < strs.size(); i++) {
            while (strs.get(i).indexOf(prefix) != 0) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }`,
    "strings-4": `    public static int firstUniqChar(String s) {
        int[] count = new int[256];
        for (int i = 0; i < s.length(); i++) count[s.charAt(i)]++;
        for (int i = 0; i < s.length(); i++) {
            if (count[s.charAt(i)] == 1) return i;
        }
        return -1;
    }`,
    "strings-5": `    public static String reverseWords(String s) {
        String[] words = s.trim().split("\\\\s+");
        List<String> list = Arrays.asList(words);
        Collections.reverse(list);
        return String.join(" ", list);
    }`,
    "two-pointers-1": `    public static boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            char cl = s.charAt(l);
            char cr = s.charAt(r);
            if (!Character.isLetterOrDigit(cl)) {
                l++;
            } else if (!Character.isLetterOrDigit(cr)) {
                r--;
            } else {
                if (Character.toLowerCase(cl) != Character.toLowerCase(cr)) return false;
                l++; r--;
            }
        }
        return true;
    }`,
    "two-pointers-2": `    public static int[] twoSum(int[] numbers, int target) {
        int l = 0, r = numbers.length - 1;
        while (l < r) {
            int sum = numbers[l] + numbers[r];
            if (sum == target) return new int[]{l + 1, r + 1};
            else if (sum < target) l++;
            else r--;
        }
        return new int[0];
    }`,
    "two-pointers-3": `    public static int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        int write = 1;
        for (int r = 1; r < nums.length; r++) {
            if (nums[r] != nums[r-1]) {
                nums[write++] = nums[r];
            }
        }
        return write;
    }`,
    "two-pointers-4": `    public static int maxArea(int[] height) {
        int l = 0, r = height.length - 1;
        int ans = 0;
        while (l < r) {
            ans = Math.max(ans, Math.min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return ans;
    }`,
    "two-pointers-5": `    public static int trap(int[] height) {
        if (height.length == 0) return 0;
        int l = 0, r = height.length - 1;
        int leftMax = height[l], rightMax = height[r];
        int ans = 0;
        while (l < r) {
            if (leftMax < rightMax) {
                l++;
                leftMax = Math.max(leftMax, height[l]);
                ans += leftMax - height[l];
            } else {
                r--;
                rightMax = Math.max(rightMax, height[r]);
                ans += rightMax - height[r];
            }
        }
        return ans;
    }`,
    "sliding-window-1": `    public static int lengthOfLongestSubstring(String s) {
        int[] m = new int[256];
        Arrays.fill(m, -1);
        int left = 0, ans = 0;
        for (int right = 0; right < s.length(); right++) {
            if (m[s.charAt(right)] >= left) {
                left = m[s.charAt(right)] + 1;
            }
            m[s.charAt(right)] = right;
            ans = Math.max(ans, right - left + 1);
        }
        return ans;
    }`,
    "sliding-window-2": `    public static int characterReplacement(String s, int k) {
        int[] count = new int[26];
        int maxFreq = 0, left = 0, ans = 0;
        for (int right = 0; right < s.length(); right++) {
            maxFreq = Math.max(maxFreq, ++count[s.charAt(right) - 'A']);
            while ((right - left + 1) - maxFreq > k) {
                count[s.charAt(left) - 'A']--;
                left++;
            }
            ans = Math.max(ans, right - left + 1);
        }
        return ans;
    }`,
    "sliding-window-3": `    public static int minSubArrayLen(int target, int[] nums) {
        int left = 0, curr_sum = 0, ans = Integer.MAX_VALUE;
        for (int right = 0; right < nums.length; right++) {
            curr_sum += nums[right];
            while (curr_sum >= target) {
                ans = Math.min(ans, right - left + 1);
                curr_sum -= nums[left++];
            }
        }
        return ans == Integer.MAX_VALUE ? 0 : ans;
    }`,
    "sliding-window-4": `    public static boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;
        int[] cnt1 = new int[26];
        int[] cnt2 = new int[26];
        for (int i = 0; i < s1.length(); i++) {
            cnt1[s1.charAt(i) - 'a']++;
            cnt2[s2.charAt(i) - 'a']++;
        }
        if (Arrays.equals(cnt1, cnt2)) return true;
        for (int i = s1.length(); i < s2.length(); i++) {
            cnt2[s2.charAt(i) - 'a']++;
            cnt2[s2.charAt(i - s1.length()) - 'a']--;
            if (Arrays.equals(cnt1, cnt2)) return true;
        }
        return false;
    }`,
    "sliding-window-5": `    public static int longestOnes(int[] nums, int k) {
        int left = 0, ans = 0, zeros = 0;
        for (int right = 0; right < nums.length; right++) {
            if (nums[right] == 0) zeros++;
            while (zeros > k) {
                if (nums[left++] == 0) zeros--;
            }
            ans = Math.max(ans, right - left + 1);
        }
        return ans;
    }`,
    "kadans-1": `    public static int maxSubArray(int[] nums) {
        int maxSum = nums[0], currSum = 0;
        for (int x : nums) {
            currSum = Math.max(x, currSum + x);
            maxSum = Math.max(maxSum, currSum);
        }
        return maxSum;
    }`,
    "kadans-2": `    public static int maxProduct(int[] nums) {
        int ans = nums[0];
        int currMin = 1, currMax = 1;
        for (int x : nums) {
            if (x == 0) {
                currMin = 1;
                currMax = 1;
                ans = Math.max(ans, 0);
                continue;
            }
            int tmp = currMax * x;
            currMax = Math.max(x * currMax, Math.max(x * currMin, x));
            currMin = Math.min(tmp, Math.min(x * currMin, x));
            ans = Math.max(ans, currMax);
        }
        return ans;
    }`,
    "kadans-3": `    public static int maxSubarraySumCircular(int[] nums) {
        int totalSum = 0;
        int maxSum = nums[0], currMax = 0;
        int minSum = nums[0], currMin = 0;
        for (int x : nums) {
            totalSum += x;
            currMax = Math.max(x, currMax + x);
            maxSum = Math.max(maxSum, currMax);
            currMin = Math.min(x, currMin + x);
            minSum = Math.min(minSum, currMin);
        }
        if (maxSum < 0) return maxSum;
        return Math.max(maxSum, totalSum - minSum);
    }`,
    "kadans-4": `    public static int maxProfit(int[] prices) {
        if (prices.length == 0) return 0;
        int minPrice = prices[0];
        int maxProf = 0;
        for (int price : prices) {
            minPrice = Math.min(minPrice, price);
            maxProf = Math.max(maxProf, price - minPrice);
        }
        return maxProf;
    }`,
    "kadans-5": `    public static int maximumSum(int[] arr) {
        int n = arr.length;
        if (n == 1) return arr[0];
        int[] one_del = new int[n];
        int[] no_del = new int[n];
        one_del[0] = arr[0];
        no_del[0] = arr[0];
        int ans = arr[0];
        for (int i = 1; i < n; i++) {
            no_del[i] = Math.max(no_del[i-1] + arr[i], arr[i]);
            one_del[i] = Math.max(no_del[i-1], one_del[i-1] + arr[i]);
            ans = Math.max(ans, Math.max(no_del[i], one_del[i]));
        }
        return ans;
    }`,
    "prefix-sum-1": `    public static int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> prefix = new HashMap<>();
        prefix.put(0, 1);
        int currSum = 0, ans = 0;
        for (int x : nums) {
            currSum += x;
            if (prefix.containsKey(currSum - k)) ans += prefix.get(currSum - k);
            prefix.put(currSum, prefix.getOrDefault(currSum, 0) + 1);
        }
        return ans;
    }`,
    "prefix-sum-2": `    public static int[] rangeSum(int[] nums, int[][] queries) {
        int[] prefix = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i+1] = prefix[i] + nums[i];
        }
        int[] res = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            res[i] = prefix[queries[i][1]+1] - prefix[queries[i][0]];
        }
        return res;
    }`,
    "prefix-sum-3": `    public static int pivotIndex(int[] nums) {
        int total = 0;
        for (int x : nums) total += x;
        int leftSum = 0;
        for (int i = 0; i < nums.length; i++) {
            if (leftSum == total - leftSum - nums[i]) return i;
            leftSum += nums[i];
        }
        return -1;
    }`,
    "prefix-sum-4": `    public static int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        ans[0] = 1;
        for (int i = 1; i < n; i++) {
            ans[i] = ans[i-1] * nums[i-1];
        }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] *= right;
            right *= nums[i];
        }
        return ans;
    }`,
    "prefix-sum-5": `    public static boolean checkSubarraySum(int[] nums, int k) {
        Map<Integer, Integer> rem = new HashMap<>();
        rem.put(0, -1);
        int total = 0;
        for (int i = 0; i < nums.length; i++) {
            total += nums[i];
            int r = total % k;
            if (rem.containsKey(r)) {
                if (i - rem.get(r) >= 2) return true;
            } else {
                rem.put(r, i);
            }
        }
        return false;
    }`,
    "hashing-1": `    public static List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            groups.putIfAbsent(key, new ArrayList<>());
            groups.get(key).add(s);
        }
        return new ArrayList<>(groups.values());
    }`,
    "hashing-2": `    public static boolean containsDuplicate(int[] nums) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) {
            if (!s.add(x)) return true;
        }
        return false;
    }`,
    "hashing-3": `    public static int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> s1 = new HashSet<>();
        for (int x : nums1) s1.add(x);
        Set<Integer> res = new HashSet<>();
        for (int x : nums2) {
            if (s1.contains(x)) res.add(x);
        }
        int[] ans = new int[res.size()];
        int idx = 0;
        for (int x : res) ans[idx++] = x;
        return ans;
    }`,
    "hashing-4": `    public static int longestConsecutive(int[] nums) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) s.add(x);
        int ans = 0;
        for (int x : s) {
            if (!s.contains(x - 1)) {
                int y = x + 1;
                while (s.contains(y)) y++;
                ans = Math.max(ans, y - x);
            }
        }
        return ans;
    }`,
    "hashing-5": `    public static int subarraysDivByK(int[] nums, int k) {
        Map<Integer, Integer> prefix = new HashMap<>();
        prefix.put(0, 1);
        int currSum = 0, ans = 0;
        for (int x : nums) {
            currSum += x;
            int r = currSum % k;
            if (r < 0) r += k;
            if (prefix.containsKey(r)) ans += prefix.get(r);
            prefix.put(r, prefix.getOrDefault(r, 0) + 1);
        }
        return ans;
    }`
};

async function testQuestion(language, questionId, code) {
    console.log(`Testing ${questionId} in ${language}...`);
    const req = {
        body: {
            language,
            sourceCode: code,
            questionId,
            mode: "submit"
        }
    };
    let jsonResponse = null;
    const res = {
        status(statusCode) {
            return {
                json(data) {
                    jsonResponse = data;
                }
            };
        }
    };
    
    await judgeCode(req, res);
    if (jsonResponse && jsonResponse.allPassed) {
        console.log(`  ✅ ${questionId} (${language}) PASSED!`);
    } else {
        console.error(`  ❌ ${questionId} (${language}) FAILED!`, jsonResponse);
    }
}

async function run() {
    console.log("=== RUNNING PYTHON TESTS ===");
    for (const [qId, code] of Object.entries(pythonSolutions)) {
        await testQuestion("python", qId, code);
    }
    
    console.log("\n=== RUNNING C++ TESTS ===");
    for (const [qId, code] of Object.entries(cppSolutions)) {
        await testQuestion("cpp", qId, code);
    }
    
    console.log("\n=== RUNNING JAVA TESTS ===");
    for (const [qId, code] of Object.entries(javaSolutions)) {
        await testQuestion("java", qId, code);
    }
}

run().catch(console.error);
