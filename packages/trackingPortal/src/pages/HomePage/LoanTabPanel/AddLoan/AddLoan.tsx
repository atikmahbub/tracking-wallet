import {
  DeleteOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Grid2 as Grid,
  IconButton,
} from "@mui/material";
import TextFieldWithTitle from "@trackingPortal/components/TextFieldWithTitle";
import { FieldArray, Form, Formik } from "formik";
import React, { Fragment } from "react";
import {
  IAddLoan,
  EAddLoanFields,
  defaultLoan,
  loanTypeOptions,
  AddLoanSchema,
} from "@trackingPortal/pages/HomePage/LoanTabPanel";
import SelectFieldWithTitle from "@trackingPortal/components/SelectFieldWithTitle";
import { LoanType } from "@shared/enums";
import DatePickerFieldWithTitle from "@trackingPortal/components/DatePickerWithTitle";
import LoadingButton from "@trackingPortal/components/@extended/LoadingButton";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import toast from "react-hot-toast";
import { LoanModel } from "@shared/models";
import { IAddLoanParams } from "@shared/params";
import { convertKiloToNumber } from "@trackingPortal/utils/numberUtils";
import { makeUnixTimestampString } from "@shared/primitives";

interface IAddLoanProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getUserLoans: () => void;
}

const AddLoan: React.FC<IAddLoanProps> = ({ setLoading, getUserLoans }) => {
  const { apiGateway, user } = useStoreContext();

  const handleAddLoan = async (values: IAddLoan, { resetForm }) => {
    if (user.default) return;
    try {
      setLoading(true);
      const addLoanPromiseList: Promise<LoanModel>[] = [];
      values.loan_list.map((loan) => {
        const params: IAddLoanParams = {
          userId: user.userId,
          name: loan.name,
          amount: convertKiloToNumber(loan.amount),
          deadLine: makeUnixTimestampString(
            Number(new Date(loan.deadLine.toDate()))
          ),
          loanType: loan.loan_type,
          note: loan.note,
        };

        addLoanPromiseList.push(apiGateway.loanServices.addLoan(params));
      });

      !!addLoanPromiseList.length && (await Promise.all(addLoanPromiseList));
      toast.success("Successfully Added!");
      resetForm();
      await getUserLoans();
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{ [EAddLoanFields.LOAN_LIST]: [] }}
      onSubmit={handleAddLoan}
      validationSchema={AddLoanSchema}
    >
      {({ values, isSubmitting, resetForm }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid size={12}>
              <FieldArray
                name="loan_list"
                render={({ push, remove }) => {
                  return (
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
                          onClick={() => push(defaultLoan)}
                        >
                          Add One
                        </Button>
                      </Box>

                      {values[EAddLoanFields.LOAN_LIST].map((item, index) => {
                        return (
                          <Grid
                            container
                            spacing={3}
                            position="relative"
                            mt={3}
                          >
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
                            {index <
                              values[EAddLoanFields.LOAN_LIST].length - 1 && (
                              <Grid size={12}>
                                <Divider />
                              </Grid>
                            )}
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
                                onClick={() => push(defaultLoan)}
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
                          </Grid>
                        );
                      })}

                      {!!values[EAddLoanFields.LOAN_LIST].length && (
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
                  );
                }}
              />
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default AddLoan;
