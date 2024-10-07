import { Box, Stack, Typography } from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import dayjs from "dayjs";
import React from "react";

const LoanSummary = () => {
  return (
    <MainCard title="Summary">
      <Stack spacing={2}>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">Total Lent:</Typography>
          <Typography variant="h6">12321</Typography>
        </Box>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">Total Borrowed:</Typography>
          <Typography variant="h6">12321</Typography>
        </Box>
      </Stack>
    </MainCard>
  );
};

export default LoanSummary;
