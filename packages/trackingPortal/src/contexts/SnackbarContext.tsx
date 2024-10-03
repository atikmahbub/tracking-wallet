import React, { useState, useContext } from "react";

import { SnackbarProps } from "@trackingPortal/types/snackbar";

const initialState: SnackbarProps = {
  action: false,
  open: false,
  message: "...",
  anchorOrigin: {
    vertical: "top",
    horizontal: "right",
  },
  variant: "alert",
  alert: {
    color: "info",
    variant: "standard",
    severity: "info",
  },
  transition: "SlideLeft",
  close: true,
  actionButton: false,
};

interface IProviderValues {
  openSnackbar: (actions: any) => void;
  closeSnackbar: () => void;
  snackbar: SnackbarProps;
}

export const SnackbarContext = React.createContext<IProviderValues>(undefined!);

type ConfigProviderProps = {
  children: React.ReactNode;
};

export const SnackbarContextProvider: React.FC<ConfigProviderProps> = ({
  children,
}) => {
  const [snackbar, setSnackBar] = useState<SnackbarProps>(initialState);

  const initialValues: IProviderValues = {
    openSnackbar,
    closeSnackbar,
    snackbar,
  };

  function openSnackbar(action: any) {
    const {
      open,
      message,
      anchorOrigin,
      variant,
      alert,
      transition,
      close,
      actionButton,
    } = action;

    setSnackBar({
      ...snackbar,
      action: !snackbar.action,
      open: open || snackbar.open,
      message: message || snackbar.message,
      anchorOrigin: anchorOrigin || snackbar.anchorOrigin,
      variant: variant || snackbar.variant,
      alert: {
        color: alert?.color || snackbar.alert.color,
        variant: alert?.variant || snackbar.alert.variant,
        severity: alert?.severity || snackbar.alert.severity,
      },
      transition: transition || snackbar.transition,
      close: close === false ? close : snackbar.close,
      actionButton: actionButton || snackbar.actionButton,
    });
  }

  function closeSnackbar() {
    setSnackBar({
      ...snackbar,
      open: false,
    });
  }

  return (
    <SnackbarContext.Provider value={initialValues}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => useContext(SnackbarContext);
