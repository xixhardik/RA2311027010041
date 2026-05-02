import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Button, Stack, Typography } from "@mui/material";

type PaginationControlsProps = {
  page: number;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function PaginationControls({
  page,
  canGoNext,
  onPrevious,
  onNext
}: PaginationControlsProps) {
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
      <Button
        disabled={page === 1}
        onClick={onPrevious}
        startIcon={<NavigateBeforeIcon />}
        variant="outlined"
      >
        Previous
      </Button>

      <Typography color="text.secondary">Page {page}</Typography>

      <Button
        disabled={!canGoNext}
        endIcon={<NavigateNextIcon />}
        onClick={onNext}
        variant="outlined"
      >
        Next
      </Button>
    </Stack>
  );
}
