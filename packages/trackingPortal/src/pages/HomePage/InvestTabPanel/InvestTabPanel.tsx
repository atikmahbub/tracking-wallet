import {
  Box,
  Grid2 as Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import InvestSummary from "@trackingPortal/pages/HomePage/InvestTabPanel/Summary";
import MainCard from "@trackingPortal/components/MainCard";
import { filterInvestByStatusMenu } from "@trackingPortal/pages/HomePage/InvestTabPanel";
import { EInvestStatus } from "@shared/enums";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import AddInvest from "@trackingPortal/pages/HomePage/InvestTabPanel/AddInvest";
import InvestList from "@trackingPortal/pages/HomePage/InvestTabPanel/InvestList";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import Loader from "@trackingPortal/components/Loader";

const InvestTabPanel: React.FC = () => {
  const [status, setStatus] = React.useState<EInvestStatus>(
    EInvestStatus.Active
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [investList, setInvestList] = useState<any[]>([]);
  const { user, apiGateway } = useStoreContext();
  const isActive = status === EInvestStatus.Active;

  useEffect(() => {
    if (!user.default && user.userId) {
      getUserInvest();
    }
  }, [user, status]);

  const getUserInvest = async () => {
    try {
      const response = await apiGateway.investService.getInvestByUserId({
        userId: user.userId,
        status: status,
      });

      setInvestList(response);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value as unknown as EInvestStatus);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <InvestSummary investList={investList} status={status} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <MainCard
          title={
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight={600}>
                Investment History
              </Typography>
              <TextField
                select
                variant="outlined"
                value={status}
                onChange={handleChange}
                SelectProps={{
                  MenuProps: {
                    sx: {
                      maxHeight: 350,
                    },
                  },
                  displayEmpty: true,
                  IconComponent: KeyboardArrowDownOutlinedIcon,
                }}
              >
                {filterInvestByStatusMenu.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.text}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          }
        >
          <AddInvest getUserInvest={getUserInvest} />

          {!!investList.length && !loading ? (
            <InvestList investList={investList} getUserInvest={getUserInvest} />
          ) : (
            <Typography variant="h6">No Data found!</Typography>
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default InvestTabPanel;
