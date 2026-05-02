export type NotificationType = "All" | "Placement" | "Result" | "Event";

export type CampusNotification = {
  ID: string;
  Type: Exclude<NotificationType, "All">;
  Message: string;
  Timestamp: string;
};

export type NotificationsResponse = {
  notifications: CampusNotification[];
};
