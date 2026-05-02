const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
type LogPackage = "api" | "component" | "hook" | "page" | "state" | "utils";

export async function Log(
  level: LogLevel,
  packageName: LogPackage,
  message: string
) {
  const token = localStorage.getItem("access_token") || import.meta.env.VITE_ACCESS_TOKEN;

  if (!token) {
    console.warn("Frontend log skipped because access token is missing.");
    return;
  }

  try {
    await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        stack: "frontend",
        level,
        package: packageName,
        message
      })
    });
  } catch (error) {
    console.warn("Frontend log failed", error);
  }
}
