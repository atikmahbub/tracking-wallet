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
import React, { Fragment, useState } from "react";
import {
  EAddExpenseFields,
  CreateExpenseSchema,
  defaultQuestion,
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
import DatePickerFieldWithTitle from "@trackingPortal/components/DatePickerWithTitle/DatePickerWithTitle";
import dayjs, { Dayjs } from "dayjs";
import Loader from "@trackingPortal/components/Loader";
import SelectFieldWithTitle from "@trackingPortal/components/SelectFieldWithTitle/SelectFieldWithTitle";
import { CategoryModel } from "@shared/models/Category";
import { CategoryId } from "@shared/primitives";

interface IAddExpenseProps {
  getUserExpenses: () => void;
  filterMonth: Dayjs;
  categoriesRefreshKey: number;
}

const AddExpense: React.FC<IAddExpenseProps> = ({
  getUserExpenses,
  filterMonth,
  categoriesRefreshKey,
}) => {
  const { apiGateway, user } = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);
  
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<boolean>(false);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(false);
      const data = await apiGateway.categoryService.getCategories({ userId: user.userId });
      setCategories(data);
    } catch (err) {
      setCategoriesError(true);
      toast.error("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, [categoriesRefreshKey]);

  const handleAddExpense = async (values: IAddExpense, { resetForm }) => {
    if (user.default) return;
    try {
      setLoading(true);

      const addExpensePromiseList: Promise<ExpenseModel>[] = [];
      values.expense_list.map((expense) => {
        const safeDate = dayjs(expense.date)
          .hour(12)
          .minute(0)
          .second(0)
          .millisecond(0)
          .toDate();

        const params: IAddExpenseParams = {
          userId: user.userId,
          amount: convertKiloToNumber(expense.amount),
          date: makeUnixTimestampString(Number(safeDate)),
          description: expense.description,
          categoryId: expense.categoryId ? (expense.categoryId as CategoryId) : null,
        };

        addExpensePromiseList.push(
          apiGateway.expenseService.addExpense(params),
        );
      });

      !!addExpensePromiseList.length &&
        (await Promise.all(addExpensePromiseList));
      toast.success("Successfully Added!");
      resetForm();
      await getUserExpenses();
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
      enableReinitialize={false}
      initialValues={{
        [EAddExpenseFields.EXPENSE_LIST]: categories.length > 0 ? [{ ...defaultQuestion, categoryId: categories[0].id }] : [],
      }}
      onSubmit={handleAddExpense}
      validationSchema={CreateExpenseSchema}
    >
      {({ values, resetForm, isSubmitting }) => {
        return (
          <Form>
            <Grid container spacing={3}>
              {categoriesError && (
                <Grid size={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" bgcolor="error.light" p={2} borderRadius={1}>
                    <Box color="error.main">Failed to load categories</Box>
                    <Button onClick={fetchCategories} size="small" variant="contained" color="error">Retry</Button>
                  </Box>
                </Grid>
              )}
              {categoriesLoading && !categoriesError && (
                <Grid size={12}>
                  <Box p={2}>Loading categories...</Box>
                </Grid>
              )}
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
                          onClick={() => {
                            const lastUsedCategory =
                              values[EAddExpenseFields.EXPENSE_LIST].length > 0
                                ? values[EAddExpenseFields.EXPENSE_LIST][
                                    values[EAddExpenseFields.EXPENSE_LIST].length - 1
                                  ][EAddExpenseFields.CATEGORY_ID]
                                : categories.length > 0
                                ? categories[0].id
                                : "";

                            push({
                              ...defaultQuestion,
                              date: dayjs(filterMonth, "yyyy-MM-dd"),
                              categoryId: lastUsedCategory,
                            });
                          }}
                        >
                          Add Expense
                        </Button>
                      </Box>
                      {values[EAddExpenseFields.EXPENSE_LIST].map(
                        (item, index) => (
                          <Grid
                            container
                            key={index}
                            position="relative"
                            spacing={2}
                            mt={3}
                          >
                            <Grid size={{ xs: 12, md: 3 }}>
                              <DatePickerFieldWithTitle
                                name={`${EAddExpenseFields.EXPENSE_LIST}.${index}.${EAddExpenseFields.DATE}`}
                                title="Date"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                              <SelectFieldWithTitle
                                name={`${EAddExpenseFields.EXPENSE_LIST}.${index}.${EAddExpenseFields.CATEGORY_ID}`}
                                title="Category"
                                options={categories.map(c => ({ value: c.id, text: c.name }))}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                              <TextFieldWithTitle
                                name={`${EAddExpenseFields.EXPENSE_LIST}.${index}.${EAddExpenseFields.DESCRIPTION}`}
                                title="Purpose"
                                noWordLimit
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
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
                                onClick={() => {
                                  const lastUsedCategory =
                                    values[EAddExpenseFields.EXPENSE_LIST][index][EAddExpenseFields.CATEGORY_ID] ||
                                    (categories.length > 0 ? categories[0].id : "");

                                  push({
                                    ...defaultQuestion,
                                    date: dayjs(filterMonth, "yyyy-MM-dd"),
                                    categoryId: lastUsedCategory,
                                  });
                                }}
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
                        ),
                      )}
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
