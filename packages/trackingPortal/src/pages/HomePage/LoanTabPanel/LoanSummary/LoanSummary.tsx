import { Box, Stack, Typography } from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import { convertToKilo } from "@trackingPortal/utils/numberUtils";
import React from "react";

interface ILoanSummary {
  totalBorrowed: number;
  totalGiven: number;
}

const LoanSummary: React.FC<ILoanSummary> = ({ totalBorrowed, totalGiven }) => {
  return (
    <MainCard title="Summary">
      <Stack spacing={2}>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">Total Given:</Typography>
          <Typography variant="h6">{convertToKilo(totalGiven)}</Typography>
        </Box>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">Total Borrowed:</Typography>
          <Typography variant="h6">{convertToKilo(totalBorrowed)}</Typography>
        </Box>
      </Stack>
    </MainCard>
  );
};

export default LoanSummary;
