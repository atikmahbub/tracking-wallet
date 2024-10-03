import { lazy } from "react";

// project import
import CommonLayout from "@trackingPortal/layout/CommonLayout";
import Loadable from "@trackingPortal/components/Loadable";

// render - login

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: "/",
  children: [
    {
      path: "/",
      element: <CommonLayout />,
      children: [],
    },
  ],
};

export default LoginRoutes;
