import cors from "cors";
import express from "express";
import { Log } from "../logging_middleware/logger.js";

const app = express();
const PORT = process.env.PORT || 4000;
const NOTIFICATIONS_API_URL = "http://20.207.122.201/evaluation-service/notifications";

app.use(cors());
app.use(express.json());

async function safeLog(stack, level, packageName, message, token) {
  try {
    await Log(stack, level, packageName, message, token);
  } catch (error) {
    console.warn(`Log skipped: ${error.message}`);
  }
}

app.get("/", (request, response) => {
  response.json({
    message: "Notification API proxy is running",
    health: "http://localhost:4000/health",
    notifications: "http://localhost:4000/api/notifications"
  });
});

app.get("/health", (request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/notifications", async (request, response) => {
  const token = request.headers.authorization?.replace("Bearer ", "") || process.env.ACCESS_TOKEN;

  if (!token) {
    response.status(401).json({ error: "Missing Bearer token" });
    return;
  }

  const query = new URLSearchParams();

  if (request.query.limit) {
    query.set("limit", String(request.query.limit));
  }

  if (request.query.page) {
    query.set("page", String(request.query.page));
  }

  if (request.query.notification_type && request.query.notification_type !== "All") {
    query.set("notification_type", String(request.query.notification_type));
  }

  const url = query.toString() ? `${NOTIFICATIONS_API_URL}?${query.toString()}` : NOTIFICATIONS_API_URL;

  try {
    await safeLog("backend", "info", "route", "proxy notification request received", token);

    let apiResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!apiResponse.ok && query.toString()) {
      await safeLog(
        "backend",
        "warn",
        "route",
        `notification query request failed with ${apiResponse.status}; retrying without query`,
        token
      );

      apiResponse = await fetch(NOTIFICATIONS_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    const body = await apiResponse.text();
    response.status(apiResponse.status).type("application/json").send(body);
  } catch (error) {
    await safeLog("backend", "error", "handler", error.message, token);
    response.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
