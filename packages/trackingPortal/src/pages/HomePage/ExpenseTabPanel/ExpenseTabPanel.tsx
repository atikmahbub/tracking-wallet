import { Box, Grid2 as Grid, Typography } from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import { useEffect, useState } from "react";
import Loader from "@trackingPortal/components/Loader";
import Summary from "@trackingPortal/pages/HomePage/ExpenseTabPanel/Summary";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { ExpenseModel } from "@shared/models/Expense";
import { UnixTimeStampString } from "@shared/primitives";
import AddExpense from "@trackingPortal/pages/HomePage/ExpenseTabPanel/AddExpense";

import ExpenseList from "@trackingPortal/pages/HomePage/ExpenseTabPanel/ExpenseList";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

const ExpenseTabPanel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
  const { apiGateway, user } = useStoreContext();
  const [filterMonth, setFilterMonth] = useState<Dayjs>(dayjs(new Date()));

  useEffect(() => {
    if (!user.default) {
      getUserExpenses();
    }
  }, [user, filterMonth]);

  const getUserExpenses = async () => {
    try {
      const expenses = await apiGateway.expenseService.getExpenseByUser({
        userId: user.userId,
        date: dayjs(filterMonth).unix() as unknown as UnixTimeStampString,
      });
      setExpenses(expenses);
    } catch (error) {
      console.log("error", error);
    }
  };

  const totalExpense = expenses.reduce((acc, crr): number => {
    acc += crr.amount;
    return acc;
  }, 0);

  return (
    <Grid container spacing={3}>
      {loading && <Loader />}
      <Grid size={{ xs: 12, md: 4 }}>
        <Summary
          totalExpense={totalExpense}
          setLoading={setLoading}
          filterMonth={filterMonth}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <MainCard
          title={
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight={600}>
                Expense's
              </Typography>
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
            setLoading={setLoading}
            getUserExpenses={getUserExpenses}
            filterMonth={filterMonth}
          />
          {!!expenses.length && !loading ? (
            <ExpenseList
              setLoading={setLoading}
              expenses={expenses}
              getUserExpenses={getUserExpenses}
            />
          ) : (
            <Typography variant="h6">No Data Found!</Typography>
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default ExpenseTabPanel;
