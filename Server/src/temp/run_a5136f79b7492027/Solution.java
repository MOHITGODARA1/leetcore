import java.util.*;

public class Solution {
    public static int maxSubArray(int[] nums) {
        int maxSum = nums[0], currSum = 0;
        for (int x : nums) {
            currSum = Math.max(x, currSum + x);
            maxSum = Math.max(maxSum, currSum);
        }
        return maxSum;
    }

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
}