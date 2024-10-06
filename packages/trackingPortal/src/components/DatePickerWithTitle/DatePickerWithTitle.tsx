import { TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DesktopDatePicker, DesktopDatePickerProps } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Field, FieldProps, getIn } from "formik";
import React from "react";

export interface DatePickerFieldWithTitleProps
  extends Omit<DesktopDatePickerProps<any>, "label"> {
  name: string;
  title: string;
  onChangeCB?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  validateOnChange?: boolean;
}

const DatePickerFieldWithTitle: React.FC<DatePickerFieldWithTitleProps> = ({
  name,
  title,
  onChangeCB,
  validateOnChange,
  sx,
  ...rest
}: DatePickerFieldWithTitleProps) => {
  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={500}>
          {title}
        </Typography>
      </Box>
      <Field name={name}>
        {({
          form: { setFieldValue, setFieldTouched, errors, touched, values },
        }: FieldProps) => {
          const isTouched = getIn(touched, name);
          const error = isTouched && getIn(errors, name);
          const currentValue = getIn(values, name);
          return (
            <DesktopDatePicker
              {...rest}
              value={currentValue ? dayjs(currentValue) : null}
              format="DD-MM-YYYY"
              onClose={() => setFieldTouched(name, true)} // Mark field as touched on close
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error ? error : undefined,
                },
              }}
              onChange={(value) => setFieldValue(name, value)}
            />
          );
        }}
      </Field>
    </Box>
  );
};

export default DatePickerFieldWithTitle;
