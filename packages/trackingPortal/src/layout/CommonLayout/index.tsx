import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";

import { styled } from "@mui/material/styles";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";

const Header = lazy(() => import("./Header"));

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

const CommonLayout = ({ layout = "blank" }: { layout?: string }) => (
  <>
    {(layout === "landing" || layout === "simple") && (
      <Suspense fallback={<Loader />}>
        <Header layout={layout} />
        <Outlet />
      </Suspense>
    )}
    {layout === "blank" && <Outlet />}
  </>
);

export default CommonLayout;
