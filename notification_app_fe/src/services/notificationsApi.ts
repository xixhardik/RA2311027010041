import type { NotificationType, NotificationsResponse } from "../types";
import { Log } from "./logger";

const API_URL = "http://localhost:4000/api/notifications";

type FetchNotificationsParams = {
  token: string;
  page: number;
  limit: number;
  notificationType: NotificationType;
};

export async function fetchNotifications({
  token,
  page,
  limit,
  notificationType
}: FetchNotificationsParams): Promise<NotificationsResponse> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });

  if (notificationType !== "All") {
    query.set("notification_type", notificationType);
  }

  await Log("info", "api", `fetching notifications page ${page}`);

  const response = await fetch(`${API_URL}?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}
