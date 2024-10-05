import { LoadingOutlined } from "@ant-design/icons";
import {
  ButtonProps as MuiButtonProps,
  Button as MuiButton,
} from "@mui/material";
import React, { ReactNode } from "react";

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
  loadingSpinner?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  loading = false,
  loadingSpinner,
  ...rest
}: ButtonProps) => {
  return (
    <MuiButton
      {...rest}
      {...(rest.variant === "outlined" && {
        sx: { border: "1px solid #D9D9D9" },
      })}
      {...(loading && {
        type: "button",
        endIcon: loadingSpinner || <LoadingOutlined />,
        onClick: () => {},
        onSubmit: () => {},
      })}
    />
  );
};

export default Button;
