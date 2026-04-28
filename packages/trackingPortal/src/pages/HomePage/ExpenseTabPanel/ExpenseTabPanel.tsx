import { Box, Grid2 as Grid, Stack, Typography, IconButton } from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import { useEffect, useState } from "react";
import Loader from "@trackingPortal/components/Loader";
import Summary from "@trackingPortal/pages/HomePage/ExpenseTabPanel/Summary";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { ExpenseModel } from "@shared/models/Expense";
import { ExpenseAnalyticsModel } from "@shared/models";
import { Month, UnixTimeStampString, Year } from "@shared/primitives";
import AddExpense from "@trackingPortal/pages/HomePage/ExpenseTabPanel/AddExpense";

import ExpenseList from "@trackingPortal/pages/HomePage/ExpenseTabPanel/ExpenseList";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { MonthlyLimitModel } from "@shared/models";
import ExpenseAnalytics from "@trackingPortal/pages/HomePage/ExpenseTabPanel/ExpenseAnalytics";
import { SettingOutlined } from "@ant-design/icons";
import CategoryManager from "@trackingPortal/pages/HomePage/ExpenseTabPanel/CategoryManager/CategoryManager";

const ExpenseTabPanel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [limitLoading, setLimitLoading] = useState<boolean>(false);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
  const { apiGateway, user } = useStoreContext();
  const [filterMonth, setFilterMonth] = useState<Dayjs>(dayjs());
  const [monthLimit, setMonthLimit] = useState<MonthlyLimitModel>(
    {} as MonthlyLimitModel
  );
  const [expenseAnalytics, setExpenseAnalytics] =
    useState<ExpenseAnalyticsModel | null>(null);
  
  const [categoriesRefreshKey, setCategoriesRefreshKey] = useState<number>(0);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user.userId && !user.default) {
      getMonthlyLimit();
      getUserExpenses();
      getExpenseAnalytics();
    }
  }, [user, filterMonth]);

  const getMonthlyLimit = async () => {
    try {
      setLimitLoading(true);
      const monthlyLimit =
        await apiGateway.monthlyLimitService.getMonthlyLimitByUserId({
          userId: user.userId,
          month: (filterMonth.month() + 1) as Month,
          year: filterMonth.year() as Year,
        });
      setMonthLimit(monthlyLimit);
    } catch (error) {
      console.log(error);
    } finally {
      setLimitLoading(false);
    }
  };

  const getExpenseAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const analytics = await apiGateway.expenseService.getExpenseAnalytics({
        userId: user.userId,
        date: dayjs(filterMonth).unix() as unknown as UnixTimeStampString,
      });
      setExpenseAnalytics(analytics);
    } catch (error) {
      console.log("error", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const getUserExpenses = async () => {
    try {
      setLoading(true);
      const expenses = await apiGateway.expenseService.getExpenseByUser({
        userId: user.userId,
        date: dayjs(filterMonth).unix() as unknown as UnixTimeStampString,
      });
      setExpenses(expenses);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = expenses.reduce((acc, crr): number => {
    acc += crr.amount;
    return acc;
  }, 0);

  if (loading || limitLoading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          <Summary
            totalExpense={totalExpense}
            filterMonth={filterMonth}
            monthLimit={monthLimit}
            getMonthlyLimit={getMonthlyLimit}
          />
          <ExpenseAnalytics
            analytics={expenseAnalytics}
            loading={analyticsLoading}
          />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <MainCard
          title={
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" fontWeight={600}>
                  Expense's
                </Typography>
                <IconButton 
                  size="small" 
                  title="Manage Categories"
                  onClick={() => setIsCategoryManagerOpen(true)}
                >
                  <SettingOutlined style={{ fontSize: '16px' }} />
                </IconButton>
              </Box>
              <DatePicker
                views={["year", "month"]}
                value={filterMonth}
                onChange={(newValue) =>
                  newValue !== null && setFilterMonth(newValue)
                }
              />
            </Box>
          }
        >
          <AddExpense
            getUserExpenses={getUserExpenses}
            filterMonth={filterMonth}
            categoriesRefreshKey={categoriesRefreshKey}
          />
          {!!expenses.length && !loading ? (
            <ExpenseList
              expenses={expenses}
              getUserExpenses={getUserExpenses}
              categoriesRefreshKey={categoriesRefreshKey}
            />
          ) : (
            <Typography variant="h6">No Data Found!</Typography>
          )}
        </MainCard>
      </Grid>

      <CategoryManager 
        open={isCategoryManagerOpen} 
        onClose={() => setIsCategoryManagerOpen(false)}
        onCategoriesChange={() => {
          setCategoriesRefreshKey(prev => prev + 1);
        }}
      />
    </Grid>
  );
};

export default ExpenseTabPanel;
