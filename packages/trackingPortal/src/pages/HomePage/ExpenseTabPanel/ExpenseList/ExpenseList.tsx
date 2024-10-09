import { EditOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  Grid2 as Grid,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { ExpenseModel } from "@shared/models/Expense";
import {
  ExpenseId,
  makeUnixTimestampString,
  makeUnixTimestampToISOString,
} from "@shared/primitives";
import MuiTable from "@trackingPortal/components/MuiTable";
import TextFieldWithTitle from "@trackingPortal/components/TextFieldWithTitle";
import { Formik, Form, FieldArray } from "formik";
import React, { useRef, useState } from "react";
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
import Loader from "@trackingPortal/components/Loader";
import { useTheme } from "@mui/material";
import AlertDialog from "@trackingPortal/components/AlertModal";

interface IExpenseList {
  expenses: ExpenseModel[];
  getUserExpenses: () => void;
}

const ExpenseList: React.FC<IExpenseList> = ({ expenses, getUserExpenses }) => {
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);
  const [editingRowId, setEditingRowId] = useState<ExpenseId | null>(null);
  const { apiGateway, user } = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const selectedRowIdRef = useRef<ExpenseId>("" as ExpenseId);

  const handleActionClick = (row, action) => {
    if (action === "edit") {
      setOpenRowIndex((prevIndex) => {
        return prevIndex === row.id ? null : row.id;
      });
      setEditingRowId(row.id);
    }
  };

  const columns = !isMobileDevice
    ? [
        { label: "Date", key: "date", align: "left" as const },
        { label: "Purpose", key: "description", align: "left" as const },
        { label: "Amount", key: "amount", align: "right" as const },
      ]
    : [
        { label: "Date", key: "date", align: "left" as const },
        { label: "Purpose", key: "description", align: "left" as const },
        { label: "Amount", key: "amount", align: "right" as const },
      ];

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

  if (loading) {
    return <Loader />;
  }

  return (
    <Box mt={4}>
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
                    showRowNumber={!isMobileDevice}
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
                              justifyContent="space-between"
                              alignItems="center"
                              gap={2}
                              mt={2}
                            >
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                  setIsDeleteModalOpen(true);
                                  selectedRowIdRef.current = row.id;
                                }}
                                size="small"
                              >
                                Delete
                              </Button>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}
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
                              </Box>
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
      <AlertDialog
        isOpen={isDeleteModalOpen}
        handleClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        confirmButtonProps={{
          buttonLabel: "Delete",
          color: "error",
          variant: "contained",
        }}
        cancelButtonProps={{
          buttonLabel: "Cancel",
          variant: "text",
        }}
        onCancelClick={() => setIsDeleteModalOpen(false)}
        onConfirmClick={() => {
          if (selectedRowIdRef.current) {
            handleDeleteExpense(selectedRowIdRef.current);
          }
        }}
      />
    </Box>
  );
};

export default ExpenseList;
