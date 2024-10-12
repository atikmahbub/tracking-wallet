import { Box, Stack, Typography } from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import { convertToKilo } from "@trackingPortal/utils/numberUtils";
import React from "react";

interface IInvestSummary {
  totalActiveItem: number;
  totalInvested: number;
  totalProfit: number;
}

const InvestSummary: React.FC<IInvestSummary> = ({
  totalActiveItem,
  totalInvested,
  totalProfit,
}) => {
  return (
    <MainCard title="Summary">
      <Stack spacing={2}>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">Total Active Investment:</Typography>
          <Typography variant="h6">{totalActiveItem}</Typography>
        </Box>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">Total Amount Invested:</Typography>
          <Typography variant="h6">{convertToKilo(totalInvested)}</Typography>
        </Box>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">Total Profit:</Typography>
          <Typography variant="h6">{convertToKilo(totalProfit)}</Typography>
        </Box>
      </Stack>
    </MainCard>
  );
};

export default InvestSummary;
