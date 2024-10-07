import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import {
  TextFieldProps,
  TextField,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { Field, FieldProps, getIn } from "formik";
import React from "react";

interface IOption {
  value?: any;
  text: string;
  icon?: any;
}

export interface SelectFieldWithTitleProps
  extends Omit<TextFieldProps, "label"> {
  name: string;
  title: string;
  options: IOption[];
  onChangeCB?: () => void;
}

const SelectFieldWithTitle: React.FC<SelectFieldWithTitleProps> = ({
  name,
  title,
  options,
  placeholder,
  onChangeCB,
  ...rest
}: SelectFieldWithTitleProps) => {
  return (
    <Box mb="1rem">
      <Typography variant="h6" fontWeight={500}>
        {title}
      </Typography>
      <Field name={name} id={name}>
        {({
          field: { value },
          form: { setFieldValue, errors, touched },
        }: FieldProps) => {
          return (
            <TextField
              {...rest}
              name={name}
              select
              fullWidth
              value={value}
              error={!!getIn(touched, name) && !!getIn(errors, name)}
              helperText={<>{getIn(touched, name) && getIn(errors, name)}</>}
              sx={{
                "& .MuiSelect-outlined": {
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black",
                },
              }}
              onChange={(event) => {
                setFieldValue(name, event.target.value);
                onChangeCB && onChangeCB();
              }}
              SelectProps={{
                MenuProps: {
                  sx: {
                    maxHeight: 350,
                  },
                },
                displayEmpty: true,
                IconComponent: KeyboardArrowDownOutlinedIcon,
                style: {
                  backgroundColor: "#fff",
                },
              }}
            >
              {options.map((option, index) => (
                <MenuItem value={option.value} key={index}>
                  {option.icon && (
                    <Box
                      component="img"
                      src={option.icon}
                      width={18}
                      height={20}
                      mr={1}
                    />
                  )}
                  {option.text}
                </MenuItem>
              ))}
            </TextField>
          );
        }}
      </Field>
    </Box>
  );
};

export default SelectFieldWithTitle;
