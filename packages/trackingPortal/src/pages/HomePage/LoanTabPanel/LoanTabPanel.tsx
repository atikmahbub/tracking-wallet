import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import LoanSummary from "@trackingPortal/pages/HomePage/LoanTabPanel/LoanSummary";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { LoanModel } from "@shared/models/LoanModel";
import toast from "react-hot-toast";
import { LoanType } from "@shared/enums";
import Loader from "@trackingPortal/components/Loader";
import AddLoan from "@trackingPortal/pages/HomePage/LoanTabPanel/AddLoan/AddLoan";
import LoanList from "@trackingPortal/pages/HomePage/LoanTabPanel/LoanList/LoanList";

const LoanTabPanel = () => {
  const { apiGateway, user } = useStoreContext();
  const [loans, setLoans] = useState<LoanModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user.default) {
      getUserLoans();
    }
  }, [user]);

  const getUserLoans = async () => {
    try {
      setLoading(true);
      const responses = await apiGateway.loanServices.getLoanByUserId(
        user.userId
      );
      setLoans(responses);
    } catch (error) {
      toast.error("Something went wrong while getting the loan");
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const totalGiven = loans?.reduce((acc, crr): number => {
    if (crr.loanType === LoanType.GIVEN) {
      acc += crr.amount;
    }
    return acc;
  }, 0);

  const totalBorrowed = loans?.reduce((acc, crr): number => {
    if (crr.loanType === LoanType.TAKEN) {
      acc += crr.amount;
    }
    return acc;
  }, 0);

  return (
    <Grid container spacing={3}>
      {loading && <Loader />}
      <Grid size={{ xs: 12, md: 4 }}>
        <LoanSummary
          totalBorrowed={totalBorrowed ?? 0}
          totalGiven={totalGiven ?? 0}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <MainCard title="Loan History">
          <AddLoan setLoading={setLoading} getUserLoans={getUserLoans} />
          {!!loans.length && !loading ? (
            <LoanList
              loans={loans}
              setLoading={setLoading}
              getUserLoans={getUserLoans}
            />
          ) : (
            <Typography variant="h6">No data found</Typography>
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default LoanTabPanel;
