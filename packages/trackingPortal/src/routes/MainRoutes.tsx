import { lazy } from "react";
import MainLayout from "layout/MainLayout";
import Loadable from "components/Loadable";
import path from "path";

// Lazy-load the Expense component
const HomePage = Loadable(lazy(() => import("@trackingPortal/pages/HomePage")));
const ProfilePage = Loadable(
  lazy(() => import("@trackingPortal/pages/ProfilePage"))
);

const MainRoutes = {
  path: "/",
  element: <MainLayout />, // Ensure MainLayout is wrapped in JSX
  children: [
    {
      path: "expense",
      element: <HomePage />,
    },
    { path: "profile", element: <ProfilePage /> },
  ],
};

export default MainRoutes;
