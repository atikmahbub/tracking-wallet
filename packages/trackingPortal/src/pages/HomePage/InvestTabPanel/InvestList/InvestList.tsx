import { EditOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  Grid2 as Grid,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  InvestId,
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
import { InvestModel } from "@shared/models";
import { EInvestStatus } from "@shared/enums";
import { IUpdateInvestParams } from "@shared/params";
import CheckboxField from "@trackingPortal/components/CheckboxField";

interface IInvestList {
  investList: InvestModel[];
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
        { label: "Profit", key: "profit", align: "right" as const },
      ]
    : [
        { label: "Name", key: "name", align: "left" as const },
        { label: "Status", key: "status", align: "left" as const },
        { label: "Amount", key: "amount", align: "right" as const },
        { label: "Profit", key: "profit", align: "right" as const },
      ];

  const handleActionClick = (row, action) => {
    if (action === "edit") {
      setOpenRowIndex((prevIndex) => {
        return prevIndex === row.id ? null : row.id;
      });
      setEditingRowId(row.id);
    }
  };

  const handleDeleteInvest = async (rowId) => {
    try {
      setLoading(true);
      await apiGateway.investService.deleteInvest(rowId);
      setIsDeleteModalOpen(false);
      await getUserInvest();
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
      const openRowIndexId =
        openRowIndex !== null && investList[openRowIndex].id; //* just to ensure the clicked row id as sometimes editingRowId is null for unknown reason
      const updatedInvestValues = values[EAddInvestFormFields.INVEST_LIST].find(
        (expense) => expense.id === (editingRowId || openRowIndexId)
      );

      const params: IUpdateInvestParams = {
        id: updatedInvestValues.id as InvestId,
        amount: updatedInvestValues.amount,
        endDate:
          updatedInvestValues.end_date &&
          makeUnixTimestampString(
            Number(new Date(updatedInvestValues.end_date))
          ),
        startDate: makeUnixTimestampString(
          Number(new Date(updatedInvestValues.start_date))
        ),
        note: updatedInvestValues.note,
        name: updatedInvestValues.name,
        earned: updatedInvestValues.earned,
        status:
          updatedInvestValues.status === true
            ? EInvestStatus.Completed
            : EInvestStatus.Active,
      };
      await apiGateway.investService.updateInvest(params);
      await getUserInvest();
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

  const getProfit = (capital: number, totalEarned: number | null) => {
    if (!totalEarned) return "N/A";
    const profit = totalEarned - capital;
    const profitPercentage = (profit / capital) * 100;
    return `${profitPercentage.toFixed(2)}%`;
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
          [EAddInvestFormFields.INVEST_LIST]: investList.map((item) => ({
            id: item.id,
            [EAddInvestFormFields.AMOUNT]: item.amount,
            [EAddInvestFormFields.START_DATE]: dayjs(
              makeUnixTimestampToISOString(Number(item.startDate))
            ).format("YYYY-MM-DD"),
            [EAddInvestFormFields.END_DATE]: item.endDate
              ? dayjs(
                  makeUnixTimestampToISOString(Number(item.endDate))
                ).format("YYYY-MM-DD")
              : "",
            [EAddInvestFormFields.NOTE]: item.note,
            [EAddInvestFormFields.NAME]: item.name,
            [EAddInvestFormFields.EARNED]: item.earned,
            [EAddInvestFormFields.STATUS]:
              item.status === EInvestStatus.Active ? false : true,
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
                      status:
                        item.status === EInvestStatus.Active
                          ? "Active"
                          : "Completed",
                      duration: `${dayjs(
                        makeUnixTimestampToISOString(Number(item.startDate))
                      ).format("MMMM D, YYYY")} - ${
                        item.endDate
                          ? dayjs(
                              makeUnixTimestampToISOString(
                                Number(item.startDate)
                              )
                            ).format("MMMM D, YYYY")
                          : "Now"
                      }`,
                      note: item.note,
                      amount: item.amount,
                      name: item.name,
                      profit: getProfit(item.amount, item.earned),
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
                            <Grid size={{ xs: 12, md: 6 }}>
                              <TextFieldWithTitle
                                name={`${EAddInvestFormFields.INVEST_LIST}.${index}.${EAddInvestFormFields.NAME}`}
                                title="Name"
                                noWordLimit
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <TextFieldWithTitle
                                name={`${EAddInvestFormFields.INVEST_LIST}.${index}.${EAddInvestFormFields.AMOUNT}`}
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
                                name={`${EAddInvestFormFields.INVEST_LIST}.${index}.${EAddInvestFormFields.START_DATE}`}
                                title="Start Date"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <DatePickerFieldWithTitle
                                name={`${EAddInvestFormFields.INVEST_LIST}.${index}.${EAddInvestFormFields.END_DATE}`}
                                title="End Date"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <TextFieldWithTitle
                                name={`${EAddInvestFormFields.INVEST_LIST}.${index}.${EAddInvestFormFields.EARNED}`}
                                title="Profit (with capital)"
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
                              <TextFieldWithTitle
                                name={`${EAddInvestFormFields.INVEST_LIST}.${index}.${EAddInvestFormFields.NOTE}`}
                                title="Note"
                                wordLength={512}
                                multiline
                                minRows={3}
                              />
                            </Grid>
                            <Grid size={12}>
                              <CheckboxField
                                name={`${EAddInvestFormFields.INVEST_LIST}.${index}.${EAddInvestFormFields.STATUS}`}
                                label="Mark this as completed"
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
        description="Are you sure you want to delete this investment? This action cannot be undone."
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
            handleDeleteInvest(selectedRowIdRef.current);
          }
        }}
      />
    </Box>
  );
};

export default InvestList;
