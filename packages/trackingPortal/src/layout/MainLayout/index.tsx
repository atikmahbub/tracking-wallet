import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Box, Grid2, IconButton, useTheme } from "@mui/material";
import Loader from "@trackingPortal/components/Loader";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "@trackingPortal/layout/MainLayout/Header";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import useConfig from "@trackingPortal/hooks/useConfig";
import { AppThemeMode } from "@trackingPortal/types/config";

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const { onChangeMode, mode } = useConfig();

  const getMenuItemColor = isDarkMode ? "#fff" : "#2A47AB";
  const toggleMode =
    mode === AppThemeMode.DARK ? AppThemeMode.LIGHT : AppThemeMode.DARK;

  return (
    <Box component="main" display="flex" justifyContent="center">
      <Grid2
        container
        maxWidth="xl"
        width="100%"
        sx={{
          px: { xs: 2, sm: 2 },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Grid2 size={12} mt={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Header />
            <IconButton onClick={() => onChangeMode(toggleMode)}>
              {isDarkMode ? (
                <LightModeIcon sx={{ getMenuItemColor }} />
              ) : (
                <DarkModeIcon sx={{ getMenuItemColor }} />
              )}
            </IconButton>
          </Box>
        </Grid2>
        <Grid2 size={12}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default withAuthenticationRequired(MainLayout, {
  onRedirecting: () => <Loader />,
});
