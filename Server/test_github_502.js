import axios from "axios";
import https from "node:https";

async function test() {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  try {
    console.log("Sending GET request to https://api.github.com/user with dummy token...");
    const res = await axios.get("https://api.github.com/user", {
      headers: {
        "Authorization": "Bearer dummy_token_123456",
        "User-Agent": "LeetCore-App"
      },
      httpsAgent: agent
    });
    console.log("Success:", res.status, res.data);
  } catch (err) {
    console.error("Error status:", err.response?.status);
    console.error("Error headers:", err.response?.headers);
    console.error("Error data (first 500 chars):", String(err.response?.data).slice(0, 500));
    console.error("Error message:", err.message);
  }
}

test();
