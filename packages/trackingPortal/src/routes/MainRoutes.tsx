import { lazy } from "react";

// project import
import MainLayout from "layout/MainLayout";
import CommonLayout from "layout/CommonLayout";
import Loadable from "components/Loadable";

// const MaintenanceComingSoon = Loadable(
//   lazy(() => import("pages/maintenance/coming-soon"))
// );

const MainRoutes = {
  path: "/",
  children: [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "sample-page",
          element: <></>,
        },
      ],
    },
  ],
};

export default MainRoutes;
