import {
  DeleteOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Box, Button, Divider, Grid2 as Grid, IconButton } from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import React, { Fragment, useState } from "react";

import {
  EAddInvestFormFields,
  IAddInvest,
  AddInvestSchema,
  defaultInvest,
} from "@trackingPortal/pages/HomePage/InvestTabPanel";
import TextFieldWithTitle from "@trackingPortal/components/TextFieldWithTitle";
import DatePickerFieldWithTitle from "@trackingPortal/components/DatePickerWithTitle";
import LoadingButton from "@trackingPortal/components/@extended/LoadingButton";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { InvestModel } from "@shared/models";
import { IAddInvestParams } from "@shared/params";
import { convertKiloToNumber } from "@trackingPortal/utils/numberUtils";
import { makeUnixTimestampString } from "@shared/primitives";
import toast from "react-hot-toast";
import Loader from "@trackingPortal/components/Loader";

interface IAddInvestProps {
  getUserInvest: () => void;
}

const AddInvest: React.FC<IAddInvestProps> = ({ getUserInvest }) => {
  const { user, apiGateway } = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddNewInvestment = async (values: IAddInvest, { resetForm }) => {
    if (user.default) return;
    try {
      setLoading(true);
      const addInvestPromiseList: Promise<InvestModel>[] = [];
      values.invest_list.map((invest) => {
        const params: IAddInvestParams = {
          userId: user.userId,
          amount: convertKiloToNumber(invest.amount),
          startDate: makeUnixTimestampString(
            Number(new Date(invest.start_date.toDate()))
          ),
          note: invest.note,
          name: invest.name,
        };

        addInvestPromiseList.push(apiGateway.investService.addInvest(params));
      });

      !!addInvestPromiseList.length &&
        (await Promise.all(addInvestPromiseList));
      toast.success("Successfully Added!");
      resetForm();
      await getUserInvest();
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

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
