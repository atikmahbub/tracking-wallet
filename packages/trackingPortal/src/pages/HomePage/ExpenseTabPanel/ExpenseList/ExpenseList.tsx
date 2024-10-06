import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Box, Button, Grid2 as Grid, IconButton } from "@mui/material";
import { ExpenseModel } from "@shared/models/Expense";
import {
  ExpenseId,
  makeUnixTimestampString,
  makeUnixTimestampToISOString,
} from "@shared/primitives";
import MuiTable from "@trackingPortal/components/MuiTable";
import TextFieldWithTitle from "@trackingPortal/components/TextFieldWithTitle";
import { Formik, Form, FieldArray } from "formik";
import React, { useState } from "react";
import {
  CreateExpenseSchema,
  EAddExpenseFields,
} from "@trackingPortal/pages/HomePage/ExpenseTabPanel";
import LoadingButton from "@trackingPortal/components/@extended/LoadingButton";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { IUpdateExpenseParams } from "@shared/params";
import toast from "react-hot-toast";
import DatePickerFieldWithTitle from "@trackingPortal/components/DatePickerWithTitle/DatePickerWithTitle";
import dayjs from "dayjs";

interface IExpenseList {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  expenses: ExpenseModel[];
  getUserExpenses: () => void;
}

const columns = [
  { label: "Date", key: "date", align: "left" as const },
  { label: "Description", key: "description", align: "left" as const },
  { label: "Amount", key: "amount", align: "right" as const },
];

const ExpenseList: React.FC<IExpenseList> = ({
  setLoading,
  expenses,
  getUserExpenses,
}) => {
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);
  const [editingRowId, setEditingRowId] = useState<ExpenseId | null>(null);
  const { apiGateway, user } = useStoreContext();

  const handleActionClick = (row, action) => {
    if (action === "delete") {
      row.id && handleDeleteExpense(row.id);
    }
    if (action === "edit") {
      setOpenRowIndex((prevIndex) => {
        return prevIndex === row.id ? null : row.id;
      });
      setEditingRowId(row.id);
    }
  };

  const handleDeleteExpense = async (rowId) => {
    try {
      setLoading(true);
      await apiGateway.expenseService.deleteExpense(rowId);
      await getUserExpenses();
      toast.success("Deleted Successfully!");
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExpense = async (values, { resetForm }) => {
    if (user.default) return;
    try {
      setLoading(true);
      const openRowIndexId = openRowIndex !== null && expenses[openRowIndex].id; //* just to ensure the clicked row id as sometimes editingRowId is null for unknown reason
      const updatedExpenseValues = values[EAddExpenseFields.EXPENSE_LIST].find(
        (expense) => expense.id === (editingRowId || openRowIndexId)
      );

      const params: IUpdateExpenseParams = {
        id: updatedExpenseValues.id as ExpenseId,
        amount: updatedExpenseValues.amount,
        date: makeUnixTimestampString(
          Number(new Date(updatedExpenseValues.date))
        ),
        description: updatedExpenseValues.description,
      };
      await apiGateway.expenseService.updateExpense(params);
      await getUserExpenses();
      await resetForm();
      handleCancel();
      toast.success("Updated Successfully!");
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpenRowIndex(null);
  };

  return (
    <Box mt={2}>
      <Formik
        enableReinitialize
        onSubmit={handleUpdateExpense}
        initialValues={{
          [EAddExpenseFields.EXPENSE_LIST]: expenses.map((item) => ({
            id: item.id,
            [EAddExpenseFields.AMOUNT]: item.amount,
            [EAddExpenseFields.DATE]: dayjs(
              makeUnixTimestampToISOString(Number(item.date))
            ).format("YYYY-MM-DD"),
            [EAddExpenseFields.DESCRIPTION]: item.description,
          })),
        }}
        validationSchema={CreateExpenseSchema}
      >
        {({ resetForm, isSubmitting }) => {
          return (
            <Form>
              <FieldArray
                name={EAddExpenseFields.EXPENSE_LIST}
                render={() => (
                  <MuiTable
                    columns={columns}
                    data={expenses.map((item) => ({
                      id: item.id,
                      date: dayjs(
                        makeUnixTimestampToISOString(Number(item.date))
                      ).format("MMMM D, YYYY"),
                      description: item.description,
                      amount: item.amount,
                    }))}
                    showRowNumber
                    collapsible={true}
                    collapsibleOpenIndex={openRowIndex}
                    onCollapseToggle={setOpenRowIndex}
                    actionIcons={(row) => [
                      <IconButton
                        onClick={() => {
                          handleActionClick(row, "edit");
                        }}
                      >
                        <EditOutlined />
                      </IconButton>,
                      <IconButton
                        onClick={() => handleActionClick(row, "delete")}
                      >
                        <DeleteOutlined />
                      </IconButton>,
                    ]}
                    collapsibleContent={(row, index) => {
                      return (
                        <Box pt={4} pb={4}>
                          <Grid container key={row.id} spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <DatePickerFieldWithTitle
                                name={`${EAddExpenseFields.EXPENSE_LIST}.${index}.${EAddExpenseFields.DATE}`}
                                title="Date"
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
                                slotProps={{
                                  htmlInput: {
                                    inputMode: "numeric",
                                    autoComplete: "off",
                                  },
                                }}
                              />
                            </Grid>
                            <Grid
                              size={12}
                              display="flex"
                              justifyContent="flex-end"
                              alignItems="center"
                              gap={2}
                              mt={2}
                            >
                              <Button
                                variant="text"
                                onClick={() => {
                                  resetForm();
                                  handleCancel();
                                }}
                              >
                                Cancel
                              </Button>
                              <LoadingButton
                                variant="contained"
                                type="submit"
                                loading={isSubmitting}
                              >
                                Update
                              </LoadingButton>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    }}
                  />
                )}
              />
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default ExpenseList;
