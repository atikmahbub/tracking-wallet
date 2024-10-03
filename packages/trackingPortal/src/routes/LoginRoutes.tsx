import { lazy } from "react";

// project import
import CommonLayout from "@trackingPortal/layout/CommonLayout";
import Loadable from "@trackingPortal/components/Loadable";
import { ERoutes } from "./ERoutes";

const LoginPage = Loadable(
  lazy(() => import("@trackingPortal/pages/LoginPage"))
);

const LoginRoutes = {
  path: "/",
  element: <CommonLayout />,
  children: [
    {
      path: "/",
      element: <LoginPage />,
    },
  ],
};

export default LoginRoutes;
