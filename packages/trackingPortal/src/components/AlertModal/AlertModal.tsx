import * as React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface IActionButton extends ButtonProps {
  buttonLabel: string;
}

interface IAlertDialog {
  title: string;
  isOpen: boolean;
  handleClose: () => void;
  description: string;
  onConfirmClick: () => void;
  onCancelClick: () => void;
  confirmButtonProps: IActionButton;
  cancelButtonProps: IActionButton;
}

const AlertDialog: React.FC<IAlertDialog> = ({
  title,
  isOpen,
  handleClose,
  description,
  onCancelClick,
  onConfirmClick,
  confirmButtonProps,
  cancelButtonProps,
}) => {
  const { buttonLabel: ConfirmButtonLabel, ...confirmRest } =
    confirmButtonProps;
  const { buttonLabel: CancelButtonLabel, ...cancelRest } = cancelButtonProps;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelClick} {...cancelRest}>
          {CancelButtonLabel}
        </Button>
        <Button onClick={onConfirmClick} {...confirmRest}>
          {ConfirmButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
