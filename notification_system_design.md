Stage 1
Problem

The goal is to fetch campus notifications from the protected notification API and identify the top 10 priority unread notifications.

Priority Rules

Notifications are ranked using two rules:

1.Notification type priority:
Placement has highest priority.
Result has second priority.
Event has third priority.

2.Recency:
If two notifications have the same type, the newer timestamp is ranked first.

Approach

The Stage 1 script fetches notifications using the Bearer token, copies the notification array, sorts it by type weight and timestamp, then takes the first 10 records.

The original response is not mutated directly because the sorting function works on a copied array.

Complexity

Time Complexity: O(n log n), because the list is sorted.

Space Complexity: O(n), because the function creates a copied array before sorting.

Logging

The project uses a reusable Log function in `logging_middleware/logger.js`. It sends structured logs with stack, level, package, and message values.
