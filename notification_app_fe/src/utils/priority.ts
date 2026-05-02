import type { CampusNotification } from "../types";

const typePriority: Record<CampusNotification["Type"], number> = {
  Placement: 3,
  Result: 2,
  Event: 1
};

export function getPriorityNotifications(
  notifications: CampusNotification[],
  limit: number
) {
  return [...notifications]
    .sort((a, b) => {
      const priorityDifference = typePriority[b.Type] - typePriority[a.Type];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    })
    .slice(0, limit);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value.replace(" ", "T")));
}
