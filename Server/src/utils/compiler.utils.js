import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import vm from "vm";
import { exec, spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function toCandidateFunctionName(title = "") {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join("");
}

function parseCaseValue(val = "") {
    const trimmed = String(val).trim();
    if (!trimmed) return "";

    try {
        if (
            (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
            (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
            (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
            (trimmed.startsWith("'") && trimmed.endsWith("'"))
        ) {
            const sanitized = trimmed
                .replace(/'/g, "\"")
                .replace(/([a-zA-Z0-9_]+)\s*:/g, "\"$1\":");
            return JSON.parse(sanitized);
        }

        if (trimmed === "true") return true;
        if (trimmed === "false") return false;
        if (trimmed === "null") return null;

        const num = Number(trimmed);
        if (!isNaN(num)) return num;

        return trimmed;
    } catch (e) {
        return trimmed;
    }
}

function splitTopLevelValues(input = "") {
    const values = [];
    let current = "";
    let depth = 0;
    let quote = "";

    for (const char of String(input)) {
        if (quote) {
            current += char;
            if (char === quote) quote = "";
            continue;
        }

        if (char === "\"" || char === "'") {
            quote = char;
            current += char;
            continue;
        }

        if (char === "[" || char === "{" || char === "(") depth += 1;
        if (char === "]" || char === "}" || char === ")") depth -= 1;

        if (char === "," && depth === 0) {
            values.push(current.trim());
            current = "";
            continue;
        }

        current += char;
    }

    if (current.trim()) values.push(current.trim());
    return values;
}

function parseTestInput(input = "") {
    return splitTopLevelValues(input).map((part) => {
        const assignmentIndex = part.indexOf("=");
        const rawValue = assignmentIndex >= 0 ? part.slice(assignmentIndex + 1) : part;
        return parseCaseValue(rawValue);
    });
}

function normalizeOutput(value) {
    if (Array.isArray(value)) {
        return `[${value.map(normalizeOutput).join(",")}]`;
    }

    if (value && typeof value === "object") {
        return JSON.stringify(value, Object.keys(value).sort());
    }

    return String(value).trim().toLowerCase();
}

function valuesMatch(actual, expected, questionTitle = "") {
    if (normalizeOutput(actual) === normalizeOutput(expected)) return true;

    const allowsAnyIndexOrder = questionTitle.toLowerCase() === "two sum";
    if (
        allowsAnyIndexOrder &&
        Array.isArray(actual) &&
        Array.isArray(expected) &&
        actual.length === expected.length
    ) {
        const actualSorted = [...actual].sort((a, b) => Number(a) - Number(b));
        const expectedSorted = [...expected].sort((a, b) => Number(a) - Number(b));
        return normalizeOutput(actualSorted) === normalizeOutput(expectedSorted);
    }
    return false;
}

function compileCpp(sourcePath, binaryPath) {
    return new Promise((resolve) => {
        exec(`g++ -O3 -std=c++17 "${sourcePath}" -o "${binaryPath}"`, (error, stdout, stderr) => {
            if (error) {
                resolve({ success: false, error: stderr || error.message });
            } else {
                resolve({ success: true });
            }
        });
    });
}

function runCppBinary(binaryPath, inputVal, timeoutMs = 2000) {
    return new Promise((resolve) => {
        const child = spawn(binaryPath, [], { timeout: timeoutMs });
        let stdout = "";
        let stderr = "";
        let killed = false;

        const timer = setTimeout(() => {
            child.kill();
            killed = true;
            resolve({ success: false, error: "Time Limit Exceeded (Timeout)", stdout, stderr });
        }, timeoutMs);

        child.stdin.write(inputVal + "\n");
        child.stdin.end();

        child.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        child.on("close", (code) => {
            clearTimeout(timer);
            if (killed) return;
            if (code !== 0) {
                resolve({ success: false, error: `Runtime Error (exit status ${code})`, stdout, stderr });
            } else {
                resolve({ success: true, stdout, stderr });
            }
        });

        child.on("error", (err) => {
            clearTimeout(timer);
            resolve({ success: false, error: `Failed to execute: ${err.message}`, stdout, stderr });
        });
    });
}

function formatInputForStdin(inputStr) {
    try {
        const parsedArgs = parseTestInput(inputStr);
        let formatted = "";
        for (const arg of parsedArgs) {
            if (Array.isArray(arg)) {
                if (arg.length > 0 && Array.isArray(arg[0])) {
                    // 2D Array
                    formatted += `${arg.length} ${arg[0].length}\n`;
                    for (const row of arg) {
                        formatted += `${row.join(" ")}\n`;
                    }
                } else {
                    // 1D Array
                    formatted += `${arg.length}\n`;
                    formatted += `${arg.join(" ")}\n`;
                }
            } else if (typeof arg === "object" && arg !== null) {
                formatted += `${JSON.stringify(arg)}\n`;
            } else {
                formatted += `${arg}\n`;
            }
        }
        return formatted;
    } catch (e) {
        return inputStr;
    }
}

function outputsMatch(actualStdout, expectedStr, questionTitle = "") {
    const cleanActual = actualStdout.replace(/\r/g, "").trim();
    const cleanExpected = expectedStr.replace(/\r/g, "").trim();

    if (cleanActual === cleanExpected) return true;
    if (cleanActual.toLowerCase() === cleanExpected.toLowerCase()) return true;

    const tokenize = (str) => {
        return str
            .replace(/[\[\]\(\)\{\},]/g, " ")
            .split(/\s+/)
            .map(s => s.trim().toLowerCase())
            .filter(Boolean);
    };

    const actualTokens = tokenize(cleanActual);
    const expectedTokens = tokenize(cleanExpected);

    if (actualTokens.join(" ") === expectedTokens.join(" ")) return true;

    const allowsAnyIndexOrder = questionTitle.toLowerCase() === "two sum";
    if (allowsAnyIndexOrder && actualTokens.length === expectedTokens.length) {
        const actualSorted = [...actualTokens].sort();
        const expectedSorted = [...expectedTokens].sort();
        if (actualSorted.join(" ") === expectedSorted.join(" ")) return true;
    }

    return false;
}

export async function runCppSolution(question, solution, customInput = null) {
    const tempDir = path.resolve(__dirname, "..", "temp");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    if (customInput !== null) {
        const uniqueId = `temp_custom_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
        const sourcePath = path.join(tempDir, `${uniqueId}.cpp`);
        const binaryPath = path.join(tempDir, uniqueId);

        try {
            fs.writeFileSync(sourcePath, solution, "utf-8");
            const compileRes = await compileCpp(sourcePath, binaryPath);
            if (!compileRes.success) {
                return {
                    passed: false,
                    message: "Compilation Error",
                    compileError: compileRes.error,
                    results: []
                };
            }
            const runRes = await runCppBinary(binaryPath, customInput);
            return {
                passed: runRes.success,
                message: runRes.success ? "Custom input run succeeded." : `Run Failed: ${runRes.error}`,
                stdout: runRes.stdout,
                stderr: runRes.stderr || runRes.error || ""
            };
        } catch (err) {
            return {
                passed: false,
                message: `Execution Error: ${err.message}`,
                stdout: "",
                stderr: err.message
            };
        } finally {
            try {
                if (fs.existsSync(sourcePath)) fs.unlinkSync(sourcePath);
                if (fs.existsSync(binaryPath)) fs.unlinkSync(binaryPath);
            } catch (e) {
                console.error("Cleanup error:", e);
            }
        }
    }

    const testCases = Array.isArray(question.testCases) ? question.testCases.slice(0, 5) : [];
    if (!testCases.length) {
        return {
            passed: false,
            message: "No test cases are available for this question yet.",
            results: []
        };
    }

    const uniqueId = `temp_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    const sourcePath = path.join(tempDir, `${uniqueId}.cpp`);
    const binaryPath = path.join(tempDir, uniqueId);

    try {
        fs.writeFileSync(sourcePath, solution, "utf-8");
        const compileRes = await compileCpp(sourcePath, binaryPath);
        if (!compileRes.success) {
            return {
                passed: false,
                message: "Compilation Error",
                compileError: compileRes.error,
                results: []
            };
        }

        const results = [];
        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            const formattedStdin = formatInputForStdin(tc.input);
            const runRes = await runCppBinary(binaryPath, formattedStdin);

            if (runRes.success) {
                const passed = outputsMatch(runRes.stdout, tc.output, question.title);
                results.push({
                    index: i + 1,
                    input: tc.input,
                    expected: tc.output,
                    actual: runRes.stdout.trim(),
                    passed
                });
            } else {
                results.push({
                    index: i + 1,
                    input: tc.input,
                    expected: tc.output,
                    actual: runRes.error || runRes.stderr || "Runtime Error",
                    passed: false
                });
            }
        }

        const passed = results.every(r => r.passed);
        return {
            passed,
            message: passed
                ? `Passed ${results.length}/${results.length} test cases.`
                : `Passed ${results.filter(r => r.passed).length}/${results.length} test cases.`,
            results
        };
    } catch (err) {
        return {
            passed: false,
            message: `Execution Error: ${err.message}`,
            results: []
        };
    } finally {
        try {
            if (fs.existsSync(sourcePath)) fs.unlinkSync(sourcePath);
            if (fs.existsSync(binaryPath)) fs.unlinkSync(binaryPath);
        } catch (e) {
            console.error("Cleanup error:", e);
        }
    }
}

export function runVisibleTestCases(question, solution) {
    const testCases = Array.isArray(question.testCases) ? question.testCases.slice(0, 5) : [];

    if (!testCases.length) {
        return {
            passed: false,
            message: "No test cases are available for this question yet.",
            results: []
        };
    }

    const logs = [];
    const sandbox = {
        console: {
            log: (...items) => logs.push(items.map((item) => normalizeOutput(item)).join(" "))
        }
    };

    vm.createContext(sandbox);

    try {
        const script = new vm.Script(solution, { timeout: 1000 });
        script.runInContext(sandbox, { timeout: 1000 });
    } catch (error) {
        return {
            passed: false,
            message: `Code error: ${error.message}`,
            results: []
        };
    }

    const preferredNames = [
        "solve",
        toCandidateFunctionName(question.title),
        "solution",
        "answer"
    ].filter(Boolean);
    const runnerName = preferredNames.find((name) => typeof sandbox[name] === "function");
    const runner = runnerName ? sandbox[runnerName] : null;

    if (!runner) {
        return {
            passed: false,
            message: `Add a function named solve(${question.testCases?.[0]?.input || "..."}) or ${preferredNames[1] || "solution"}(...).`,
            results: []
        };
    }

    const results = testCases.map((testCase, index) => {
        const args = parseTestInput(testCase.input);
        const expected = parseCaseValue(testCase.output);

        try {
            sandbox.__leetcoreArgs = args;
            const actual = new vm.Script(`${runnerName}(...__leetcoreArgs)`)
                .runInContext(sandbox, { timeout: 1000 });
            const passed = valuesMatch(actual, expected, question.title);

            return {
                index: index + 1,
                input: testCase.input,
                expected: testCase.output,
                actual: normalizeOutput(actual),
                passed
            };
        } catch (error) {
            return {
                index: index + 1,
                input: testCase.input,
                expected: testCase.output,
                actual: error.message,
                passed: false
            };
        }
    });

    const passed = results.every((result) => result.passed);

    return {
        passed,
        message: passed
            ? `Passed ${results.length}/${results.length} test cases.`
            : `Passed ${results.filter((result) => result.passed).length}/${results.length} test cases.`,
        results,
        runnerName
    };
}
