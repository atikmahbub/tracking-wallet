import { lazy } from "react";
import MainLayout from "layout/MainLayout";
import Loadable from "components/Loadable";

// Lazy-load the Expense component
const Expense = Loadable(lazy(() => import("@trackingPortal/pages/Expense")));

const MainRoutes = {
  path: "/",
  element: <MainLayout />, // Ensure MainLayout is wrapped in JSX
  children: [
    {
      path: "expense",
      element: <Expense />,
    },
  ],
};

export default MainRoutes;
