import { useAuth0 } from "@auth0/auth0-react";
import { Grid2 } from "@mui/material";
import MuiTabs, { TabPanel } from "@trackingPortal/components/Tabs";
import React, { useState } from "react";

import { tabItems, ETabStep } from "@trackingPortal/pages/HomePage";
import ExpenseTabPanel from "@trackingPortal/pages/HomePage/HomeTabs/ExpenseTabPanel";

const HomePage = () => {
  const { user } = useAuth0();
  const [value, setValue] = useState<ETabStep>(ETabStep.Expense);

  return (
    <Grid2 container spacing={3} mt={10}>
      <Grid2 size={12} display="flex" justifyContent="center">
        <MuiTabs
          value={value}
          onChange={(e, newValue: ETabStep) => setValue(newValue)}
          tabItems={tabItems}
        />
      </Grid2>
      <Grid2 size={12} mt={5}>
        <TabPanel value={value} index={ETabStep.Expense}>
          <ExpenseTabPanel />
        </TabPanel>
      </Grid2>
    </Grid2>
  );
};

export default HomePage;
