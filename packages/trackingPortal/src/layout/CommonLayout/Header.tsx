import { Box, Grid2 as Grid, Typography } from "@mui/material";
import React from "react";

import LOGO from "@trackingPortal/assets/images/icons/tw.png";

const Header: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid
        size={12}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        mb={3}
      >
        <Box component="img" src={LOGO} height={150} width={100} mb={5} />
        <Typography variant="h2" fontWeight={900} mb={2}>
          TrackWallet
        </Typography>
        <Typography variant="h6" maxWidth={500} textAlign="center">
          TrackWallet helps you effortlessly manage your daily spending, set
          monthly goals, and keep your finances in check. Stay on top of your
          budget with a clean, intuitive interface designed to make tracking
          your expenses fast and easy.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Header;
