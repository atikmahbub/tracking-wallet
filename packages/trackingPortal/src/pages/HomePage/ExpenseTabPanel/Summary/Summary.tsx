import { LoadingButton } from "@mui/lab";
import { Stack, Box, Typography, Button, Collapse } from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import TextFieldWithTitle from "@trackingPortal/components/TextFieldWithTitle";
import { convertToKilo } from "@trackingPortal/utils/numberUtils";
import { Formik, Form } from "formik";
import React, { SetStateAction, useEffect, useMemo, useState } from "react";
import { format, getMonth, getYear } from "date-fns";
import { MonthlyLimitModel } from "@shared/models/MonthlyLimit";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { Month, Year } from "@shared/primitives";

interface ISummary {
  totalExpense: number;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}

const Summary: React.FC<ISummary> = ({ setLoading, totalExpense }) => {
  const [openLimit, setOpenLimit] = useState<boolean>(false);
  const { apiGateway, user } = useStoreContext();
  const [monthLimit, setMonthLimit] = useState<MonthlyLimitModel>();

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

  const expensePercentage = useMemo(
    () => (totalExpense * 100) / (monthLimit?.limit ?? 0),
    [monthLimit, totalExpense]
  );

  return (
    <MainCard title="Summary">
      <Stack spacing={2}>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">Month:</Typography>
          <Typography variant="h6">
            {format(new Date(), "MMMM, yyyy")}
          </Typography>
        </Box>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">Total Spend:</Typography>
          <Typography variant="h6">
            {convertToKilo(totalExpense)}{" "}
            {monthLimit?.limit ? `(${expensePercentage}%)` : ""}
          </Typography>
        </Box>
        <Box display="flex" gap={1} alignItems="center">
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
            {({ isSubmitting, values }) => (
              <Form>
                <Box mt={1}>
                  <TextFieldWithTitle
                    name="limit"
                    value={values.limit}
                    title="Limit for this month"
                    noWordLimit
                  />
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap={2}
                    mt={2}
                  >
                    <Button variant="text" onClick={() => setOpenLimit(false)}>
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
  );
};

export default Summary;
