import { Box, Stack, Typography } from "@mui/material";
import { EInvestStatus } from "@shared/enums";
import { InvestModel } from "@shared/models";
import MainCard from "@trackingPortal/components/MainCard";
import { convertToKilo } from "@trackingPortal/utils/numberUtils";
import React from "react";

interface IInvestSummary {
  investList: InvestModel[];
  status: EInvestStatus;
}

const InvestSummary: React.FC<IInvestSummary> = ({ investList, status }) => {
  const isActive = status === EInvestStatus.Active;

  const totalItems = investList.length;
  const totalAmountInvested = investList.reduce(
    (acc, crr) => acc + crr.amount,
    0
  );

  const totalActiveItem = isActive ? totalItems : 0;
  const totalActiveAmount = isActive ? totalAmountInvested : 0;

  const totalCompletedItem = !isActive ? totalItems : 0;
  const totalCompletedAmount = !isActive ? totalAmountInvested : 0;

  const totalProfit = !isActive
    ? investList.reduce(
        (acc, crr) => acc + ((crr.earned - crr.amount) / crr.amount) * 100,
        0
      )
    : 0;

  return (
    <MainCard title="Summary">
      <Stack spacing={2}>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">
            {isActive
              ? "Total Active Investment:"
              : "Total Completed Investment:"}
          </Typography>
          <Typography variant="h6">
            {isActive ? totalActiveItem : totalCompletedItem}
          </Typography>
        </Box>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">
            {isActive ? "Total Amount Invested:" : "Total Amount Completed:"}
          </Typography>
          <Typography variant="h6">
            {convertToKilo(isActive ? totalActiveAmount : totalCompletedAmount)}
          </Typography>
        </Box>
        {!isActive && (
          <Box display="flex" gap={1} alignItems="center">
            <Typography variant="h5">Total Profit (%):</Typography>
            <Typography
              variant="h6"
              color={totalProfit < 0 ? "error" : "unset"}
            >
              {totalProfit.toFixed(2)}%
            </Typography>
          </Box>
        )}
      </Stack>
    </MainCard>
  );
};

export default InvestSummary;
