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
    print(f"{interval[0]} {interval[1]}", end="")`
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
