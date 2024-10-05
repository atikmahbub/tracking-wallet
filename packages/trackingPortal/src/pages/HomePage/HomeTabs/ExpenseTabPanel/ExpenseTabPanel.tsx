import {
  Box,
  Button,
  Collapse,
  Grid2 as Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import React, { useEffect, useMemo, useState } from "react";

import { format } from "date-fns";
import { Form, Formik } from "formik";
import LoadingButton from "@trackingPortal/components/@extended/LoadingButton";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";

import { getMonth, getYear } from "date-fns";
import { Month, Year } from "@shared/primitives";
import { MonthlyLimitModel } from "@shared/models/MonthlyLimit";
import Loader from "@trackingPortal/components/Loader";
import { convertToKilo } from "@trackingPortal/utils/numberUtils";

const ExpenseTabPanel = () => {
  const [openLimit, setOpenLimit] = useState<boolean>(false);
  const { apiGateway, user } = useStoreContext();
  const [monthLimit, setMonthLimit] = useState<MonthlyLimitModel>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user.userId && !user.default) {
      getMonthlyLimit();
    }
  }, [user]);

  const getMonthlyLimit = async () => {
    try {
      setLoading(true);
      const monthlyLimit =
        await apiGateway.monthlyLimitService.getMonthlyLimitByUserId({
          userId: user.userId,
          month: (getMonth(new Date()) + 1) as Month,
          year: getYear(new Date()) as Year,
        });
      setMonthLimit(monthlyLimit);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMonthlyLimit = async (values) => {
    try {
      setLoading(true);
      if (monthLimit?.id) {
        await apiGateway.monthlyLimitService.updateMonthlyLimit({
          id: monthLimit.id,
          limit: values.limit,
        });
        await getMonthlyLimit();
      } else {
        await apiGateway.monthlyLimitService.addMonthlyLimit({
          userId: user.userId,
          limit: values.limit,
          month: (getMonth(new Date()) + 1) as Month,
          year: getYear(new Date()) as Year,
        });
      }
      setOpenLimit(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = 4000;
  const expensePercentage = useMemo(
    () => (totalExpense * 100) / (monthLimit?.limit ?? 0),
    [monthLimit]
  );

  return (
    <Grid container spacing={3}>
      {loading && <Loader />}
      <Grid size={{ xs: 12, md: 4 }}>
        <MainCard title="Summary">
          <Stack spacing={2}>
            <Box display="flex" gap={2} alignItems="center">
              <Typography variant="h5">Month:</Typography>
              <Typography variant="h6">
                {format(new Date(), "MMMM, yyyy")}
              </Typography>
            </Box>
            <Box display="flex" gap={2} alignItems="center">
              <Typography variant="h5">Total Spend:</Typography>
              <Typography variant="h6">
                {convertToKilo(totalExpense)}{" "}
                {monthLimit?.limit ? `(${expensePercentage}%)` : ""}
              </Typography>
            </Box>
            <Box display="flex" gap={2} alignItems="center">
              <Typography variant="h5">Limit:</Typography>
              <Typography variant="h6">
                {convertToKilo(monthLimit?.limit ?? 0) ?? "N/A"}
              </Typography>
              <Button
                variant="text"
                onClick={() => setOpenLimit((prevState) => !prevState)}
                sx={{
                  fontWeight: 700,
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.primary.darker
                      : theme.palette.primary.main,
                }}
              >
                Set limit
              </Button>
            </Box>
            <Collapse in={openLimit}>
              <Formik
                enableReinitialize={true}
                initialValues={{ limit: monthLimit?.limit }}
                onSubmit={handleSaveMonthlyLimit}
              >
                {({ isSubmitting, handleChange, values }) => (
                  <Form>
                    <Box mt={1}>
                      <Typography variant="h6">Limit for this month</Typography>
                      <TextField
                        value={values.limit}
                        variant="outlined"
                        name="limit"
                        fullWidth
                        onChange={handleChange}
                      />
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        gap={2}
                        mt={2}
                      >
                        <Button
                          variant="text"
                          onClick={() => setOpenLimit(false)}
                        >
                          Cancel
                        </Button>
                        <LoadingButton
                          variant="contained"
                          type="submit"
                          loading={isSubmitting}
                        >
                          {monthLimit?.id ? "Update" : "Save"}
                        </LoadingButton>
                      </Box>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Collapse>
          </Stack>
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <MainCard title="Expense's">Hello</MainCard>
      </Grid>
    </Grid>
  );
};

export default ExpenseTabPanel;
