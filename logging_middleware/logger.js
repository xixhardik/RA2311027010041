const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

const allowedStacks = new Set(["backend", "frontend"]);
const allowedLevels = new Set(["debug", "info", "warn", "error", "fatal"]);
const allowedPackages = new Set([
  "api",
  "auth",
  "cache",
  "component",
  "config",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "hook",
  "middleware",
  "page",
  "repository",
  "route",
  "service",
  "state",
  "style",
  "utils"
]);

export async function Log(stack, level, packageName, message, token = process.env.ACCESS_TOKEN) {
  if (!allowedStacks.has(stack)) {
    throw new Error(`Invalid stack: ${stack}`);
  }

  if (!allowedLevels.has(level)) {
    throw new Error(`Invalid level: ${level}`);
  }

  if (!allowedPackages.has(packageName)) {
    throw new Error(`Invalid package: ${packageName}`);
  }

  if (!token) {
    console.warn("Log skipped because ACCESS_TOKEN is missing.");
    return null;
  }

  const response = await fetch(LOG_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      stack,
      level,
      package: packageName,
      message
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Log API failed with ${response.status}: ${errorText}`);
  }

  return response.json();
}
