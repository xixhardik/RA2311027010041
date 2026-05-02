import { Log } from "../logging_middleware/logger.js";

const NOTIFICATIONS_API_URL = "http://20.207.122.201/evaluation-service/notifications";

const typePriority = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function rankNotifications(notifications, limit = 10) {
  return [...notifications]
    .sort((a, b) => {
      const priorityDifference = (typePriority[b.Type] ?? 0) - (typePriority[a.Type] ?? 0);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    })
    .slice(0, limit);
}

async function safeLog(stack, level, packageName, message, token) {
  try {
    await Log(stack, level, packageName, message, token);
  } catch (error) {
    console.warn(`Log skipped: ${error.message}`);
  }
}

async function fetchNotifications(token) {
  const response = await fetch(NOTIFICATIONS_API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Notification API failed with ${response.status}: ${errorText}`);
  }

  return response.json();
}

function printTopNotifications(topNotifications) {
  console.log("Top 10 Priority Notifications");
  console.log("=============================");

  topNotifications.forEach((item, index) => {
    console.log(`${index + 1}. ${item.Type} | ${item.Message} | ${item.Timestamp} | ${item.ID}`);
  });
}

async function main() {
  const token = process.env.ACCESS_TOKEN;

  if (!token) {
    console.error("Missing ACCESS_TOKEN.");
    console.error("Run this first in PowerShell:");
    console.error('$env:ACCESS_TOKEN="paste_your_access_token_here"');
    process.exit(1);
  }

  try {
    await safeLog("backend", "info", "service", "stage 1 notification fetch started", token);
    const data = await fetchNotifications(token);
    const notifications = data.notifications ?? [];

    await safeLog("backend", "info", "utils", `ranking ${notifications.length} notifications`, token);
    const topNotifications = rankNotifications(notifications, 10);

    printTopNotifications(topNotifications);
    await safeLog("backend", "info", "service", "stage 1 priority ranking completed", token);
  } catch (error) {
    console.error(error.message);
    await safeLog("backend", "error", "handler", error.message, token);

    process.exit(1);
  }
}

main();
