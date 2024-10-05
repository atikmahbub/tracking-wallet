import * as React from "react";
import Tabs, { TabsProps } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/material";

interface IMuiTabs extends TabsProps {
  value: number;
  tabItems: string[];
}

const MuiTabs: React.FC<IMuiTabs> = ({ value, tabItems, ...rest }) => {
  return (
    <Box>
      <Tabs
        {...rest}
        value={value}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
        sx={{
          borderRadius: "30px",
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.primary.contrastText
              : "#23272E",
          width: "max-content",
          alignItems: "center",
          "& button.Mui-selected": {
            color: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : "#fff",
            fontWeight: 700,
            bgcolor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.primary[100]
                : "#1e1e1e",
            borderRadius: "30px",
            ":hover": {
              borderBottom: "none",
            },
            minHeight: "30px",
          },
        }}
        TabIndicatorProps={{
          style: {
            display: "none",
          },
        }}
      >
        {tabItems.map((tab, index) => (
          <Tab label={tab} key={index} />
        ))}
      </Tabs>
    </Box>
  );
};

export default MuiTabs;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number | string;
  value: number | string;
  sx?: SxProps;
}

export const TabPanel: React.FC<TabPanelProps> = (props: TabPanelProps) => {
  const { children, value, index, sx, ...rest } = props;

  return (
    <Box
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...rest}
      sx={{ width: "100%", ...sx }}
    >
      {value === index && <Box sx={{ ...sx }}>{children}</Box>}
    </Box>
  );
};
