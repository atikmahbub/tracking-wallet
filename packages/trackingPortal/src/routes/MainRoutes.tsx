import { lazy } from "react";
import MainLayout from "layout/MainLayout";
import Loadable from "components/Loadable";

// Lazy-load the Expense component
const HomePage = Loadable(lazy(() => import("@trackingPortal/pages/HomePage")));

const MainRoutes = {
  path: "/",
  element: <MainLayout />, // Ensure MainLayout is wrapped in JSX
  children: [
    {
      path: "expense",
      element: <HomePage />,
    },
  ],
};

export default MainRoutes;
