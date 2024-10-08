import { LoadingButton } from "@mui/lab";
import { Stack, Box, Typography, Button, Collapse } from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import TextFieldWithTitle from "@trackingPortal/components/TextFieldWithTitle";
import {
  convertKiloToNumber,
  convertToKilo,
} from "@trackingPortal/utils/numberUtils";
import { Formik, Form } from "formik";
import React, { useMemo, useState } from "react";
import { MonthlyLimitModel } from "@shared/models/MonthlyLimit";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { Month, Year } from "@shared/primitives";
import { EMonthlyLimitFields } from "@trackingPortal/pages/HomePage/ExpenseTabPanel";
import { toast } from "react-hot-toast";
import dayjs, { Dayjs } from "dayjs";
import Loader from "@trackingPortal/components/Loader";

interface ISummary {
  totalExpense: number;
  filterMonth: Dayjs;
  monthLimit: MonthlyLimitModel;
  getMonthlyLimit: () => void;
}

const Summary: React.FC<ISummary> = ({
  totalExpense,
  filterMonth,
  monthLimit,
  getMonthlyLimit,
}) => {
  const [openLimit, setOpenLimit] = useState<boolean>(false);
  const { apiGateway, user } = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSaveMonthlyLimit = async (values) => {
    try {
      setLoading(true);
      if (monthLimit?.id) {
        await apiGateway.monthlyLimitService.updateMonthlyLimit({
          id: monthLimit.id,
          limit: convertKiloToNumber(values.limit),
        });
        toast.success("Limit updated successfully!");
      } else {
        await apiGateway.monthlyLimitService.addMonthlyLimit({
          userId: user.userId,
          limit: convertKiloToNumber(values.limit),
          month: (filterMonth.month() + 1) as Month,
          year: filterMonth.year() as Year,
        });
        toast.success("Limit added successfully!");
      }
      setOpenLimit(false);
      await getMonthlyLimit();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const expensePercentage = useMemo(
    () => (totalExpense * 100) / (monthLimit?.limit ?? 0),
    [monthLimit, totalExpense]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <MainCard title="Summary">
      <Stack spacing={2}>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">Month:</Typography>
          <Typography variant="h6">
            {dayjs(new Date(filterMonth.toDate())).format("MMMM YYYY")}
          </Typography>
        </Box>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">Total Spend:</Typography>
          <Stack direction="row" spacing={1}>
            <Typography variant="h6">{convertToKilo(totalExpense)} </Typography>
            <Typography
              variant="h6"
              fontWeight={700}
              color={expensePercentage > 100 ? "error" : "unset"}
            >
              {monthLimit?.limit ? `(${expensePercentage.toFixed(2)}%)` : ""}
            </Typography>
          </Stack>
        </Box>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h5">Limit:</Typography>
          <Typography variant="h6">
            {convertToKilo(monthLimit?.limit || 0) ?? "N/A"}
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
            initialValues={{
              [EMonthlyLimitFields.LIMIT]: monthLimit?.limit ?? "",
            }}
            onSubmit={handleSaveMonthlyLimit}
          >
            {({ isSubmitting, values }) => (
              <Form>
                <Box mt={1}>
                  <TextFieldWithTitle
                    name={EMonthlyLimitFields.LIMIT}
                    value={values.limit}
                    title="Limit for this month"
                    noWordLimit
                    slotProps={{
                      htmlInput: {
                        inputMode: "numeric",
                        autoComplete: "off",
                      },
                    }}
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
