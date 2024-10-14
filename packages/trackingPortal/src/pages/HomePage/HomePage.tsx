import { Grid2 } from "@mui/material";
import MuiTabs, { TabPanel } from "@trackingPortal/components/Tabs";
import React, { useEffect, useState } from "react";

import {
  tabItems,
  ETabStep,
  TabNameValueMap,
  TabValueNameMap,
} from "@trackingPortal/pages/HomePage";
import ExpenseTabPanel from "@trackingPortal/pages/HomePage/ExpenseTabPanel";
import LoanTabPanel from "@trackingPortal/pages/HomePage/LoanTabPanel";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import InvestTabPanel from "@trackingPortal/pages/HomePage/InvestTabPanel";

const HomePage = () => {
  const [value, setValue] = useState<ETabStep>(ETabStep.Expense);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (tab && TabNameValueMap[tab]) {
      setValue(TabNameValueMap[tab]);
    }
  }, [tab]);

  useEffect(() => {
    navigate(`${location.pathname}?tab=${TabValueNameMap[value]}`, {
      replace: true,
    });
  }, [value]);

  return (
    <Grid2 container spacing={3} mt={{ xs: 5, md: 10 }}>
      <Grid2 size={12} display="flex" justifyContent="center">
        <MuiTabs
          value={value}
          onChange={(e, newValue: ETabStep) => setValue(newValue)}
          tabItems={tabItems}
        />
      </Grid2>
      <Grid2 size={12} mt={{ xs: 1, md: 5 }}>
        <TabPanel value={value} index={ETabStep.Expense}>
          <ExpenseTabPanel />
        </TabPanel>
        <TabPanel value={value} index={ETabStep.Loan}>
          <LoanTabPanel />
        </TabPanel>
        <TabPanel value={value} index={ETabStep.Investment}>
          <InvestTabPanel />
        </TabPanel>
      </Grid2>
    </Grid2>
  );
};

export default HomePage;
