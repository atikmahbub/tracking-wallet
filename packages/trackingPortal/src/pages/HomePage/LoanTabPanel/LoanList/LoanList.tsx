import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Box, Button, Grid2 as Grid, IconButton } from "@mui/material";
import {
  ExpenseId,
  LoanId,
  makeUnixTimestampString,
  makeUnixTimestampToISOString,
} from "@shared/primitives";
import MuiTable from "@trackingPortal/components/MuiTable";
import TextFieldWithTitle from "@trackingPortal/components/TextFieldWithTitle";
import { Formik, Form, FieldArray } from "formik";
import React, { useState } from "react";

import LoadingButton from "@trackingPortal/components/@extended/LoadingButton";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { IUpdateLoanParams } from "@shared/params";
import toast from "react-hot-toast";
import DatePickerFieldWithTitle from "@trackingPortal/components/DatePickerWithTitle/DatePickerWithTitle";
import dayjs from "dayjs";
import { LoanModel } from "@shared/models";
import {
  EAddLoanFields,
  AddLoanSchema,
  loanTypeOptions,
} from "@trackingPortal/pages/HomePage/LoanTabPanel";
import SelectFieldWithTitle from "@trackingPortal/components/SelectFieldWithTitle";
import { LoanType } from "@shared/enums";
import Loader from "@trackingPortal/components/Loader";

interface ILoanList {
  loans: LoanModel[];
  getUserLoans: () => void;
}

const columns = [
  { label: "Soft Deadline", key: "deadLine", align: "left" as const },
  { label: "Type", key: "type", align: "left" as const },
  { label: "Name", key: "name", align: "left" as const },
  { label: "Note", key: "note", align: "left" as const },
  { label: "Amount", key: "amount", align: "right" as const },
];

const LoanList: React.FC<ILoanList> = ({ loans, getUserLoans }) => {
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);
  const [editingRowId, setEditingRowId] = useState<ExpenseId | null>(null);
  const { apiGateway, user } = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);

  const handleActionClick = (row, action) => {
    if (action === "delete") {
      row.id && handleDeleteLoan(row.id);
    }
    if (action === "edit") {
      setOpenRowIndex((prevIndex) => {
        return prevIndex === row.id ? null : row.id;
      });
      setEditingRowId(row.id);
    }
  };

  const handleDeleteLoan = async (rowId) => {
    try {
      setLoading(true);
      await apiGateway.loanServices.deleteLoan(rowId);
      await getUserLoans();
      toast.success("Deleted Successfully!");
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLoan = async (values, { resetForm }) => {
    if (user.default) return;

    try {
      setLoading(true);
      const openRowIndexId = openRowIndex !== null && loans[openRowIndex].id; //* just to ensure the clicked row id as sometimes editingRowId is null for unknown reason
      const updatedLoanValues = values[EAddLoanFields.LOAN_LIST].find(
        (expense) => expense.id === (editingRowId || openRowIndexId)
      );

      const params: IUpdateLoanParams = {
        id: updatedLoanValues.id as LoanId,
        amount: updatedLoanValues.amount,
        deadLine: makeUnixTimestampString(
          Number(new Date(updatedLoanValues.deadLine))
        ),
        note: updatedLoanValues.note,
        name: updatedLoanValues.name,
      };
      await apiGateway.loanServices.updateLoan(params);
      await getUserLoans();
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
        onSubmit={handleUpdateLoan}
        initialValues={{
          [EAddLoanFields.LOAN_LIST]: loans?.map((item) => ({
            id: item.id,
            [EAddLoanFields.AMOUNT]: item.amount,
            [EAddLoanFields.DEADLINE]: dayjs(
              makeUnixTimestampToISOString(Number(item.deadLine))
            ).format("YYYY-MM-DD"),
            [EAddLoanFields.NOTE]: item.note,
            [EAddLoanFields.NAME]: item.name,
          })),
        }}
        validationSchema={AddLoanSchema}
      >
        {({ resetForm, isSubmitting }) => {
          return (
            <Form>
              <FieldArray
                name={EAddLoanFields.LOAN_LIST}
                render={() => (
                  <MuiTable
                    columns={columns}
                    data={(loans || []).map((item) => ({
                      id: item.id,
                      deadLine: item.deadLine
                        ? dayjs(
                            makeUnixTimestampToISOString(Number(item.deadLine))
                          ).format("MMMM D, YYYY")
                        : "N/A",
                      note: item.note || "No note available",
                      amount: item.amount,
                      name: item.name,
                      type:
                        item.loanType === LoanType.GIVEN ? "Given" : "Taken", // Mapping loanType to user-friendly labels
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
                            <Grid size={{ xs: 12, md: 6 }}>
                              <SelectFieldWithTitle
                                name={`${EAddLoanFields.LOAN_LIST}.${index}.${EAddLoanFields.LOAN_TYPE}`}
                                title="Loan Type"
                                options={loanTypeOptions}
                                defaultValue={LoanType.GIVEN}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <TextFieldWithTitle
                                name={`${EAddLoanFields.LOAN_LIST}.${index}.${EAddLoanFields.NAME}`}
                                title="Name"
                                noWordLimit
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <TextFieldWithTitle
                                name={`${EAddLoanFields.LOAN_LIST}.${index}.${EAddLoanFields.AMOUNT}`}
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
                            <Grid size={{ xs: 12, md: 6 }}>
                              <DatePickerFieldWithTitle
                                name={`${EAddLoanFields.LOAN_LIST}.${index}.${EAddLoanFields.DEADLINE}`}
                                title="Soft Deadline"
                              />
                            </Grid>
                            <Grid size={12}>
                              <TextFieldWithTitle
                                name={`${EAddLoanFields.LOAN_LIST}.${index}.${EAddLoanFields.NOTE}`}
                                title="Add Note"
                                multiline
                                minRows={3}
                                wordLength={512}
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

export default LoanList;
