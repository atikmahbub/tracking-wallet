import { Grid2 as Grid } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { ERoutes } from "@trackingPortal/routes/ERoutes";
import LoginButton from "@trackingPortal/components/LoginButton";

const LoginPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Grid container spacing={3}>
      <Grid
        size={12}
        display="flex"
        justifyContent="center"
        alignItems={"center"}
      >
        <LoginButton
          onClick={() =>
            loginWithRedirect({
              appState: {
                returnTo: ERoutes.Expense,
              },
            })
          }
        />
      </Grid>
    </Grid>
  );
};

export default LoginPage;
