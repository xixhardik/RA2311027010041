import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from "@mui/material";
import type { NotificationType } from "../types";

type FiltersProps = {
  notificationType: NotificationType;
  limit: number;
  token: string;
  onNotificationTypeChange: (value: NotificationType) => void;
  onLimitChange: (value: number) => void;
  onTokenChange: (value: string) => void;
};

const notificationTypes: NotificationType[] = ["All", "Placement", "Result", "Event"];

export function Filters({
  notificationType,
  limit,
  token,
  onNotificationTypeChange,
  onLimitChange,
  onTokenChange
}: FiltersProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{ alignItems: { xs: "stretch", md: "center" } }}
    >
      <TextField
        fullWidth
        label="Bearer token"
        onChange={(event) => onTokenChange(event.target.value)}
        placeholder="Paste access token"
        type="password"
        value={token}
      />

      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel id="type-filter-label">Type</InputLabel>
        <Select
          label="Type"
          labelId="type-filter-label"
          onChange={(event) =>
            onNotificationTypeChange(event.target.value as NotificationType)
          }
          value={notificationType}
        >
          {notificationTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Limit"
        onChange={(event) => onLimitChange(Number(event.target.value))}
        slotProps={{ htmlInput: { min: 1, max: 50 } }}
        sx={{ width: { xs: "100%", md: 120 } }}
        type="number"
        value={limit}
      />
    </Stack>
  );
}
