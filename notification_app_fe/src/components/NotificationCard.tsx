import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CelebrationIcon from "@mui/icons-material/Celebration";
import DoneIcon from "@mui/icons-material/Done";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import type { CampusNotification } from "../types";
import { formatDateTime } from "../utils/priority";

type NotificationCardProps = {
  notification: CampusNotification;
  viewed: boolean;
  onToggleViewed: (id: string) => void;
};

const typeColor = {
  Placement: "success",
  Result: "primary",
  Event: "warning"
} as const;

function TypeIcon({ type }: { type: CampusNotification["Type"] }) {
  if (type === "Placement") {
    return <BusinessCenterIcon />;
  }

  if (type === "Result") {
    return <FactCheckIcon />;
  }

  return <CelebrationIcon />;
}

export function NotificationCard({
  notification,
  viewed,
  onToggleViewed
}: NotificationCardProps) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, opacity: viewed ? 0.72 : 1 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={{
              alignItems: "center",
              bgcolor: viewed ? "grey.100" : "primary.50",
              borderRadius: 1.5,
              color: viewed ? "text.secondary" : "primary.main",
              display: "flex",
              height: 44,
              justifyContent: "center",
              minWidth: 44
            }}
          >
            <TypeIcon type={notification.Type} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
              <Chip
                color={typeColor[notification.Type]}
                label={notification.Type}
                size="small"
                variant={viewed ? "outlined" : "filled"}
              />
              <Chip label={viewed ? "Viewed" : "New"} size="small" variant="outlined" />
            </Stack>

            <Typography variant="h6" sx={{ fontSize: "1rem", mt: 1 }}>
              {notification.Message}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {formatDateTime(notification.Timestamp)}
            </Typography>
          </Box>

          <Tooltip title={viewed ? "Mark as new" : "Mark as viewed"}>
            <IconButton
              aria-label={viewed ? "Mark as new" : "Mark as viewed"}
              onClick={() => onToggleViewed(notification.ID)}
            >
              {viewed ? <MarkEmailUnreadIcon /> : <DoneIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
