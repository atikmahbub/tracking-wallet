import { Button, useTheme, Grid2 as Grid } from "@mui/material";
import { keyframes } from "@emotion/react";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { ERoutes } from "@trackingPortal/routes/ERoutes";

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const { loginWithRedirect, loginWithPopup } = useAuth0();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Grid container spacing={3}>
      <Grid
        display="flex"
        justifyContent="center"
        alignItems="center"
        size={12}
      >
        <Button
          onClick={() =>
            loginWithRedirect({
              appState: {
                returnTo: ERoutes.Expense,
              },
            })
          } // or loginWithPopup()
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            position: "relative",
            overflow: "hidden",
            padding: "10px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor:
              theme.palette.mode === "dark" ? "#14213D" : "#F0F8FF", // background based on mode
            color: theme.palette.mode === "dark" ? "#FFF" : "#2A47AB",
            borderRadius: "30px",
            boxShadow: `0px 4px 15px rgba(42, 71, 171, 0.5)`,
            transition: "all 0.4s ease-in-out",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#2A47AB" : "#87CEEB",
              transform: "scale(1.05)",
              boxShadow: `0px 8px 20px rgba(42, 71, 171, 0.7)`,
            },
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.1)",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.4s ease",
            },
            "&:active": {
              transform: "scale(0.98)",
            },
          }}
        >
          Login with Auth0
        </Button>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
