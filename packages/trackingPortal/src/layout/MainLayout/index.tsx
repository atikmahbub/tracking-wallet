import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Box, Grid2 } from "@mui/material";
import Loader from "@trackingPortal/components/Loader";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <Box component="main" display="flex" justifyContent="center">
      <Grid2
        container
        maxWidth="xl"
        width="100%"
        sx={{
          px: { xs: 0, sm: 2 },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </Grid2>
    </Box>
  );
};

export default withAuthenticationRequired(MainLayout, {
  onRedirecting: () => <Loader />,
});
