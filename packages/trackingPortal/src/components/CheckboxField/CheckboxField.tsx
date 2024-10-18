import { Checkbox, FormControlLabel, Stack } from "@mui/material";
import { AppThemeMode } from "@trackingPortal/types/config";
import { ErrorMessage, Field, getIn } from "formik";
import React from "react";

interface ICheckBox {
  name: string;
  label: string | React.ReactNode;
  disabled?: boolean;
}

const CheckboxField: React.FC<ICheckBox> = ({ name, label, disabled }) => {
  return (
    <Stack spacing={0.5}>
      <Field name={name}>
        {({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={!!field.value}
                sx={{
                  "& .icon": {
                    borderRadius: "4px",
                  },
                }}
              />
            }
            label={label}
            disabled={disabled}
            sx={{
              color: (theme) =>
                theme.palette.mode === AppThemeMode.DARK ? "#fff" : "#222",
            }}
          />
        )}
      </Field>
      <ErrorMessage name={name} />
    </Stack>
  );
};

export default CheckboxField;
