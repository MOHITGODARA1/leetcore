import http from "k6/http";
import { check, sleep } from "k6";

// 🔹 Test configuration
export const options = {
    stages: [
        { duration: "30s", target: 50 },   // ramp-up
        { duration: "1m", target: 100 },   // steady load
        { duration: "30s", target: 200 },  // stress
        { duration: "30s", target: 0 },    // ramp-down
    ],
    thresholds: {
        http_req_duration: ["p(95)<200"], // 95% requests < 200ms
        http_req_failed: ["rate<0.01"],   // <1% errors
    },
};

export default function () {
    const url = "http://leetcore-1.onrender.com/api/v1/auth/profile";

    const res = http.get(url);

    //  Validations
    check(res, {
        "status is 200": (r) => r.status === 200,
        "response time < 200ms": (r) => r.timings.duration < 200,
    });

    sleep(1); // simulate user think time
}