import React from "react";
import { Grid2 as Grid } from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import LoanSummary from "@trackingPortal/pages/HomePage/LoanTabPanel/LoanSummary";

const LoanTabPanel = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <LoanSummary />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <MainCard></MainCard>
      </Grid>
    </Grid>
  );
};

export default LoanTabPanel;
