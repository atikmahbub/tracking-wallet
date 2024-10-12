import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  Grid2 as Grid,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  LoanId,
  makeUnixTimestampString,
  makeUnixTimestampToISOString,
} from "@shared/primitives";
import MuiTable from "@trackingPortal/components/MuiTable";
import TextFieldWithTitle from "@trackingPortal/components/TextFieldWithTitle";
import { Formik, Form, FieldArray } from "formik";
import React, { useRef, useState } from "react";

import LoadingButton from "@trackingPortal/components/@extended/LoadingButton";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";

import toast from "react-hot-toast";
import DatePickerFieldWithTitle from "@trackingPortal/components/DatePickerWithTitle/DatePickerWithTitle";
import dayjs from "dayjs";
import {
  EAddInvestFormFields,
  AddInvestSchema,
  filterInvestByStatusMenu,
} from "@trackingPortal/pages/HomePage/InvestTabPanel";
import SelectFieldWithTitle from "@trackingPortal/components/SelectFieldWithTitle";

import Loader from "@trackingPortal/components/Loader";
import AlertDialog from "@trackingPortal/components/AlertModal";

interface IInvestList {
  investList: any[];
  getUserInvest: () => void;
}

const InvestList: React.FC<IInvestList> = ({ investList, getUserInvest }) => {
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);
  const [editingRowId, setEditingRowId] = useState<LoanId | null>(null);
  const { apiGateway, user } = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const selectedRowIdRef = useRef<LoanId>("" as LoanId);

  const columns = !isMobileDevice
    ? [
        { label: "Name", key: "name", align: "left" as const },
        { label: "Status", key: "status", align: "left" as const },
        { label: "Duration", key: "duration", align: "left" as const },
        { label: "Amount", key: "amount", align: "right" as const },
      ]
    : [
        { label: "Name", key: "name", align: "left" as const },
        { label: "Status", key: "status", align: "left" as const },
        { label: "Amount", key: "amount", align: "right" as const },
      ];

  const handleActionClick = (row, action) => {
    if (action === "edit") {
      setOpenRowIndex((prevIndex) => {
        return prevIndex === row.id ? null : row.id;
      });
      setEditingRowId(row.id);
    }
  };

  // const handleDeleteLoan = async (rowId) => {
  //   try {
  //     setLoading(true);
  //     await apiGateway.loanServices.deleteLoan(rowId);
  //     await getUserLoans();
  //     toast.success("Deleted Successfully!");
  //   } catch (error) {
  //     console.log("error", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleUpdateLoan = async (values, { resetForm }) => {
  //   if (user.default) return;

  //   try {
  //     setLoading(true);
  //     const openRowIndexId = openRowIndex !== null && loans[openRowIndex].id; //* just to ensure the clicked row id as sometimes editingRowId is null for unknown reason
  //     const updatedLoanValues = values[EAddLoanFields.LOAN_LIST].find(
  //       (expense) => expense.id === (editingRowId || openRowIndexId)
  //     );

  //     const params: IUpdateLoanParams = {
  //       id: updatedLoanValues.id as LoanId,
  //       amount: updatedLoanValues.amount,
  //       deadLine: makeUnixTimestampString(
  //         Number(new Date(updatedLoanValues.deadLine))
  //       ),
  //       note: updatedLoanValues.note,
  //       name: updatedLoanValues.name,
  //     };
  //     await apiGateway.loanServices.updateLoan(params);
  //     await getUserLoans();
  //     await resetForm();
  //     handleCancel();
  //     toast.success("Updated Successfully!");
  //   } catch (error) {
  //     console.log("error", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        onSubmit={() => {}}
        initialValues={{
          [EAddInvestFormFields.INVEST_LIST]: investList?.map((item) => ({
            id: item.id,
            [EAddInvestFormFields.AMOUNT]: item.amount,
            [EAddInvestFormFields.START_DATE]: dayjs(
              makeUnixTimestampToISOString(Number(item.startDate))
            ).format("YYYY-MM-DD"),
            [EAddInvestFormFields.END_DATE]: item.endDate
              ? dayjs(
                  makeUnixTimestampToISOString(Number(item.endDate))
                ).format("YYYY-MM-DD")
              : dayjs(new Date()).format("YYYY-MM-DD"),
            [EAddInvestFormFields.NOTE]: item.note,
            [EAddInvestFormFields.NAME]: item.name,
          })),
        }}
        validationSchema={AddInvestSchema}
      >
        {({ resetForm, isSubmitting }) => {
          return (
            <Form>
              <FieldArray
                name={EAddInvestFormFields.INVEST_LIST}
                render={() => (
                  <MuiTable
                    columns={columns}
                    data={(investList || []).map((item) => ({
                      id: item.id,
                      date: dayjs(
                        makeUnixTimestampToISOString(Number(item.created))
                      ).format("MMMM D, YYYY"),
                      duration: dayjs(
                        makeUnixTimestampToISOString(Number(item.deadLine))
                      ).format("MMMM D, YYYY"),
                      note: item.note,
                      amount: item.amount,
                      name: item.name,
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
                            {/* <Grid size={{ xs: 12, md: 6 }}>
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
                            </Grid> */}
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
        description="Are you sure you want to delete this loan? This action cannot be undone."
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
          // if (selectedRowIdRef.current) {
          //   handleDeleteLoan(selectedRowIdRef.current);
          // }
        }}
      />
    </Box>
  );
};

export default InvestList;
