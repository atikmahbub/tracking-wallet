import {
  DeleteOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Grid2 as Grid,
  Button,
  Box,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import React, { Fragment } from "react";
import {
  EAddExpenseFields,
  defaultQuestion,
  CreateExpenseSchema,
} from "@trackingPortal/pages/HomePage/ExpenseTabPanel";
import TextFieldWithTitle from "@trackingPortal/components/TextFieldWithTitle";
import { IAddExpense } from "@trackingPortal/pages/HomePage/ExpenseTabPanel/ExpenseTabPanel.interfaces";
import LoadingButton from "@trackingPortal/components/@extended/LoadingButton";
import { ExpenseModel } from "@shared/models/Expense";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { IAddExpenseParams } from "@shared/params";
import { makeUnixTimestampString } from "@shared/primitives";
import { convertKiloToNumber } from "@trackingPortal/utils/numberUtils";
import { toast } from "react-hot-toast";
interface IAddExpenseProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddExpense: React.FC<IAddExpenseProps> = ({ setLoading }) => {
  const { apiGateway, user } = useStoreContext();

  const handleAddExpense = async (values: IAddExpense, { resetForm }) => {
    if (user.default) return;
    try {
      setLoading(true);
      const addExpensePromiseList: Promise<ExpenseModel>[] = [];
      values.expense_list.map((expense) => {
        const params: IAddExpenseParams = {
          userId: user.userId,
          amount: convertKiloToNumber(expense.amount),
          date: makeUnixTimestampString(Number(new Date(expense.date))),
          description: expense.description,
        };

        addExpensePromiseList.push(
          apiGateway.expenseService.addExpense(params)
        );
      });

      !!addExpensePromiseList.length &&
        (await Promise.all(addExpensePromiseList));
      toast.success("Successfully Added!");
      resetForm();
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        [EAddExpenseFields.EXPENSE_LIST]: [],
      }}
      onSubmit={handleAddExpense}
      validationSchema={CreateExpenseSchema}
    >
      {({ values, resetForm, isSubmitting }) => {
        return (
          <Form>
            <Grid container spacing={3}>
              <Grid size={12}>
                <FieldArray
                  name={EAddExpenseFields.EXPENSE_LIST}
                  render={({ push, remove }) => (
                    <Fragment>
                      <Box display="flex" justifyContent="flex-end">
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
                          onClick={() => push(defaultQuestion)}
                        >
                          Add Expense
                        </Button>
                      </Box>
                      <Stack spacing={3} mt={5}>
                        {values[EAddExpenseFields.EXPENSE_LIST].map(
                          (item, index) => (
                            <Grid
                              container
                              key={index}
                              position="relative"
                              spacing={2}
                            >
                              <Grid size={{ xs: 12, md: 4 }}>
                                <TextFieldWithTitle
                                  name={`${EAddExpenseFields.EXPENSE_LIST}.${index}.${EAddExpenseFields.DATE}`}
                                  title="Date"
                                  noWordLimit
                                  type="date"
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 4 }}>
                                <TextFieldWithTitle
                                  name={`${EAddExpenseFields.EXPENSE_LIST}.${index}.${EAddExpenseFields.DESCRIPTION}`}
                                  title="Purpose"
                                  noWordLimit
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 4 }}>
                                <TextFieldWithTitle
                                  name={`${EAddExpenseFields.EXPENSE_LIST}.${index}.${EAddExpenseFields.AMOUNT}`}
                                  title="Amount"
                                  noWordLimit
                                />
                              </Grid>
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                sx={{
                                  position: "absolute",
                                  right: 0,
                                  top: -12,
                                }}
                              >
                                <IconButton
                                  onClick={() => push(defaultQuestion)}
                                  size="small"
                                >
                                  <PlusCircleOutlined />
                                </IconButton>
                                <IconButton
                                  onClick={() => remove(index)}
                                  size="small"
                                >
                                  <DeleteOutlined />
                                </IconButton>
                              </Box>
                              {index <
                                values[EAddExpenseFields.EXPENSE_LIST].length -
                                  1 && (
                                <Grid size={12}>
                                  <Divider />
                                </Grid>
                              )}
                            </Grid>
                          )
                        )}
                      </Stack>
                      {!!values[EAddExpenseFields.EXPENSE_LIST].length && (
                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          alignItems="center"
                          gap={2}
                          mt={2}
                        >
                          <Button variant="text" onClick={() => resetForm()}>
                            Cancel
                          </Button>
                          <LoadingButton
                            variant="contained"
                            type="submit"
                            loading={isSubmitting}
                          >
                            Save
                          </LoadingButton>
                        </Box>
                      )}
                    </Fragment>
                  )}
                />
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddExpense;
