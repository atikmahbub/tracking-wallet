import { Grid2 as Grid } from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import React, { useEffect, useState } from "react";
import Loader from "@trackingPortal/components/Loader";
import Summary from "@trackingPortal/pages/HomePage/ExpenseTabPanel/Summary";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { ExpenseModel } from "@shared/models/Expense";
import { makeUnixTimestampString } from "@shared/primitives";
import AddExpense from "@trackingPortal/pages/HomePage/ExpenseTabPanel/AddExpense";

const ExpenseTabPanel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
  const { apiGateway, user } = useStoreContext();

  useEffect(() => {
    if (!user.default) {
      getUserExpenses();
    }
  }, [user]);

  const getUserExpenses = async () => {
    try {
      const expenses = await apiGateway.expenseService.getExpenseByUser({
        userId: user.userId,
        date: makeUnixTimestampString(Number(new Date())),
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
        <Summary totalExpense={totalExpense} setLoading={setLoading} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <MainCard title="Expense's">
          <AddExpense setLoading={setLoading} />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default ExpenseTabPanel;
