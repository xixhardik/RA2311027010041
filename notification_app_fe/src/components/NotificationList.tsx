import { Alert, Stack, Typography } from "@mui/material";
import type { CampusNotification } from "../types";
import { NotificationCard } from "./NotificationCard";

type NotificationListProps = {
  title: string;
  emptyText: string;
  notifications: CampusNotification[];
  viewedIds: Set<string>;
  onToggleViewed: (id: string) => void;
};

export function NotificationList({
  title,
  emptyText,
  notifications,
  viewedIds,
  onToggleViewed
}: NotificationListProps) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="h5">{title}</Typography>

      {notifications.length === 0 ? (
        <Alert severity="info">{emptyText}</Alert>
      ) : (
        notifications.map((notification) => (
          <NotificationCard
            key={notification.ID}
            notification={notification}
            viewed={viewedIds.has(notification.ID)}
            onToggleViewed={onToggleViewed}
          />
        ))
      )}
    </Stack>
  );
}
