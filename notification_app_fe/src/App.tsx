import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Filters } from "./components/Filters";
import { NotificationList } from "./components/NotificationList";
import { PaginationControls } from "./components/PaginationControls";
import { PriorityInbox } from "./components/PriorityInbox";
import { fetchNotifications } from "./services/notificationsApi";
import type { CampusNotification, NotificationType } from "./types";
import { getPriorityNotifications } from "./utils/priority";

function getStoredViewedIds() {
  return new Set<string>(JSON.parse(localStorage.getItem("viewed_notification_ids") || "[]"));
}

function App() {
  const [notifications, setNotifications] = useState<CampusNotification[]>([]);
  const [viewedIds, setViewedIds] = useState<Set<string>>(getStoredViewedIds);
  const [notificationType, setNotificationType] = useState<NotificationType>("All");
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [token, setToken] = useState(
    localStorage.getItem("access_token") || import.meta.env.VITE_ACCESS_TOKEN || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !viewedIds.has(notification.ID)),
    [notifications, viewedIds]
  );

  const priorityNotifications = useMemo(
    () => getPriorityNotifications(unreadNotifications, 10),
    [unreadNotifications]
  );

  async function loadNotifications() {
    if (!token.trim()) {
      setError("Paste your Bearer token first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      localStorage.setItem("access_token", token.trim());

      const data = await fetchNotifications({
        token: token.trim(),
        page,
        limit,
        notificationType
      });

      setNotifications(data.notifications ?? []);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to fetch notifications."
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleViewed(id: string) {
    setViewedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      localStorage.setItem("viewed_notification_ids", JSON.stringify([...next]));
      return next;
    });
  }

  useEffect(() => {
    if (token) {
      void loadNotifications();
    }
  }, [page, limit, notificationType]);

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
      <AppBar color="inherit" elevation={0} position="sticky">
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6">
            Campus Notifications
          </Typography>
          <Button
            disabled={loading}
            onClick={loadNotifications}
            startIcon={<RefreshIcon />}
            variant="contained"
          >
            Refresh
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">Notification Center</Typography>
            <Typography color="text.secondary">
              Review updates, filter by type, and keep the most important unread items visible.
            </Typography>
          </Box>

          <Filters
            limit={limit}
            notificationType={notificationType}
            onLimitChange={(value) => {
              setLimit(Number.isNaN(value) || value < 1 ? 1 : value);
              setPage(1);
            }}
            onNotificationTypeChange={(value) => {
              setNotificationType(value);
              setPage(1);
            }}
            onTokenChange={setToken}
            token={token}
          />

          {error && <Alert severity="error">{error}</Alert>}

          {loading ? (
            <Stack alignItems="center" sx={{ py: 8 }}>
              <CircularProgress />
            </Stack>
          ) : (
            <Stack spacing={3}>
              <PriorityInbox
                notifications={priorityNotifications}
                onToggleViewed={toggleViewed}
                viewedIds={viewedIds}
              />

              <NotificationList
                emptyText="No notifications found for this page."
                notifications={notifications}
                onToggleViewed={toggleViewed}
                title="All Notifications"
                viewedIds={viewedIds}
              />

              <PaginationControls
                canGoNext={notifications.length >= limit}
                onNext={() => setPage((current) => current + 1)}
                onPrevious={() => setPage((current) => Math.max(1, current - 1))}
                page={page}
              />
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
