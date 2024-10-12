import {
  DeleteOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Box, Button, Divider, Grid2 as Grid, IconButton } from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import React, { Fragment } from "react";

import {
  EAddInvestFormFields,
  IAddInvest,
  AddInvestSchema,
  defaultInvest,
} from "@trackingPortal/pages/HomePage/InvestTabPanel";
import TextFieldWithTitle from "@trackingPortal/components/TextFieldWithTitle";
import DatePickerFieldWithTitle from "@trackingPortal/components/DatePickerWithTitle";
import LoadingButton from "@trackingPortal/components/@extended/LoadingButton";

const AddInvest: React.FC = () => {
  const handleAddNewInvestment = async (values: IAddInvest) => {
    try {
    } catch (error) {}
  };

  return (
    <Formik
      initialValues={{
        [EAddInvestFormFields.INVEST_LIST]: [],
      }}
      onSubmit={handleAddNewInvestment}
      validationSchema={AddInvestSchema}
    >
      {({ values, isSubmitting, resetForm }) => {
        return (
          <Form>
            <Grid container spacing={3}>
              <Grid size={12}>
                <FieldArray
                  name={EAddInvestFormFields.INVEST_LIST}
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
                            onClick={() => push(defaultInvest)}
                          >
                            Add New Investment
                          </Button>
                        </Box>
                        {values[EAddInvestFormFields.INVEST_LIST].map(
                          (item, index) => (
                            <Grid
                              container
                              spacing={3}
                              mt={3}
                              position="relative"
                            >
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
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 6 }}>
                                <DatePickerFieldWithTitle
                                  name={`${EAddInvestFormFields.INVEST_LIST}.${index}.${EAddInvestFormFields.START_DATE}`}
                                  title="Start Date"
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
                              {index <
                                values[EAddInvestFormFields.INVEST_LIST]
                                  .length -
                                  1 && (
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
                                  onClick={() => push(defaultInvest)}
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
                          )
                        )}
                      </Fragment>
                    );
                  }}
                />
              </Grid>
            </Grid>
            {!!values[EAddInvestFormFields.INVEST_LIST].length && (
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
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddInvest;
