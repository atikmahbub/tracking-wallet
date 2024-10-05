import { Button, Grid2 as Grid } from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import React, { useEffect, useMemo, useState } from "react";
import { Form, Formik } from "formik";
import Loader from "@trackingPortal/components/Loader";
import { PlusOutlined } from "@ant-design/icons";
import Summary from "@trackingPortal/pages/HomePage/ExpenseTabPanel/Summary";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { ExpenseModel } from "@shared/models/Expense";
import { makeUnixTimestampString } from "@shared/primitives";

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
          <Grid container spacing={3}>
            <Grid size={12} display="flex" justifyContent="flex-end">
              <Button
                startIcon={<PlusOutlined />}
                variant="text"
                sx={{
                  fontWeight: 700,
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.primary.darker
                      : theme.palette.primary.main,
                }}
              >
                Add One
              </Button>
            </Grid>
            <Grid size={12}>
              <Formik
                initialValues={{ amount: "", description: "" }}
                onSubmit={() => {}}
              >
                {() => <Form></Form>}
              </Formik>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default ExpenseTabPanel;
