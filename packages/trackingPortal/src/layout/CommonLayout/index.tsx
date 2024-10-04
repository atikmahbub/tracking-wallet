import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { styled } from "@mui/material/styles";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";

import Header from "@trackingPortal/layout/CommonLayout/Header";
import { Box } from "@mui/material";

// ==============================|| Loader ||============================== //

const LoaderWrapper = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 2001,
  width: "100%",
  "& > * + *": {
    marginTop: theme.spacing(2),
  },
}));

export interface LoaderProps extends LinearProgressProps {}

const Loader = () => (
  <LoaderWrapper>
    <LinearProgress color="primary" />
  </LoaderWrapper>
);

const CommonLayout = () => (
  <Box
    component="main"
    sx={{
      px: { xs: 2, sm: 2 },
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <Header />
    <Suspense fallback={<Loader />}>
      <Outlet />
    </Suspense>
  </Box>
);

export default CommonLayout;
