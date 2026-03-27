import {
  Box,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import { convertToKilo } from "@trackingPortal/utils/numberUtils";
import { ExpenseAnalyticsModel } from "@shared/models";
import React from "react";

interface ExpenseAnalyticsProps {
  analytics: ExpenseAnalyticsModel | null;
  loading: boolean;
}

const normalizePercentage = (value: number): number =>
  Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

const ExpenseAnalytics: React.FC<ExpenseAnalyticsProps> = ({
  analytics,
  loading,
}) => {
  const hasBreakdown =
    !!analytics?.categoryBreakdown && analytics.categoryBreakdown.length > 0;

  return (
    <MainCard title="Analytics">
      {loading ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight={140}
          gap={1}
        >
          <CircularProgress size={24} />
          <Typography variant="caption" color="text.secondary">
            Loading insights…
          </Typography>
        </Box>
      ) : analytics ? (
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Expense
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {convertToKilo(analytics.totalExpense)}
            </Typography>
          </Box>

          {analytics.topCategory && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Top Category
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {analytics.topCategory.categoryName ?? "Uncategorized"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {convertToKilo(analytics.topCategory.totalAmount)}
              </Typography>
            </Box>
          )}

          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Category Breakdown
            </Typography>
            {hasBreakdown ? (
              analytics.categoryBreakdown.map((category, index) => {
                const key =
                  category.categoryId ??
                  category.categoryName ??
                  `category-${index}`;
                const percentage = normalizePercentage(category.percentage);
                return (
                  <Box key={key}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={0.5}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {category.categoryName ?? "Uncategorized"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{ height: 6, borderRadius: 999 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {convertToKilo(category.totalAmount)}
                    </Typography>
                  </Box>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary">
                No category data for this month yet.
              </Typography>
            )}
          </Stack>
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Analytics not available for the selected month.
        </Typography>
      )}
    </MainCard>
  );
};

export default ExpenseAnalytics;
