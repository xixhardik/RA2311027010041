import { Box, Paper, Stack, Typography } from "@mui/material";
import type { CampusNotification } from "../types";
import { NotificationCard } from "./NotificationCard";

type PriorityInboxProps = {
  notifications: CampusNotification[];
  viewedIds: Set<string>;
  onToggleViewed: (id: string) => void;
};

export function PriorityInbox({
  notifications,
  viewedIds,
  onToggleViewed
}: PriorityInboxProps) {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="h5">Priority Inbox</Typography>
          <Typography color="text.secondary" variant="body2">
            Top unread notifications ranked by type and recency.
          </Typography>
        </Box>

        {notifications.map((notification) => (
          <NotificationCard
            key={notification.ID}
            notification={notification}
            viewed={viewedIds.has(notification.ID)}
            onToggleViewed={onToggleViewed}
          />
        ))}
      </Stack>
    </Paper>
  );
}
