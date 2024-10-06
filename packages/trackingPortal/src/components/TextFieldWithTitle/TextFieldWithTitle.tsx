import { TextFieldProps, Typography, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Field, FieldProps, getIn } from "formik";
import React, { useState } from "react";

export interface WordLengthProps {
  wordLength?: number;
}

export interface TextFieldWithTitleProps extends Omit<TextFieldProps, "label"> {
  name: string;
  title: string;
  wordLength?: number;
  noWordLimit?: boolean;
  onChangeCB?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  validateOnChange?: boolean;
}

const TextFieldWithTitle: React.FC<TextFieldWithTitleProps> = ({
  name,
  title,
  wordLength,
  type,
  noWordLimit,
  onChangeCB,
  validateOnChange,
  sx,
  ...rest
}: TextFieldWithTitleProps) => {
  const [textLength, setTextLength] = useState(0);

  if (!noWordLimit && !wordLength) {
    wordLength = rest.multiline ? 240 : 128;
  }

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={500}>
          {title}
        </Typography>
        {wordLength && (
          <Typography variant="caption" color="grey.500">
            {`${textLength}/${wordLength}`}
          </Typography>
        )}
      </Box>
      <Field name={name} id={name} type={type}>
        {({
          form: { setFieldValue, errors, touched, values, setFieldTouched },
        }: FieldProps) => {
          const isTouched = getIn(touched, name);
          const error =
            (validateOnChange || getIn(touched, name)) &&
            typeof getIn(errors, name) === "string"
              ? getIn(errors, name)
              : null;

          return (
            <TextField
              {...rest}
              value={getIn(values, name)}
              name={name}
              type={type}
              fullWidth
              onChange={(e) => {
                if (
                  wordLength &&
                  textLength >= wordLength &&
                  e.target.value.length > textLength
                ) {
                  return;
                }
                if (validateOnChange) {
                  setFieldTouched(name);
                }
                setTextLength(e.target.value.length);
                setFieldValue(name, e.target.value);
                onChangeCB && onChangeCB(e);
              }}
              error={!!isTouched && !!error}
              helperText={<>{isTouched && error}</>}
            />
          );
        }}
      </Field>
    </Box>
  );
};

export default TextFieldWithTitle;
