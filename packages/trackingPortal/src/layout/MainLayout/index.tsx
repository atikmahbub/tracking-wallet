import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loader from "@trackingPortal/components/Loader";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Outlet />
    </Suspense>
  );
};

export default withAuthenticationRequired(MainLayout, {
  onRedirecting: () => <Loader />,
});
