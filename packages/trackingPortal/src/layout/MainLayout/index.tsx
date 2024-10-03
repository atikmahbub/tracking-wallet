import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loader from "@trackingPortal/components/Loader";
import React from "react";

const MainLayout: React.FC = () => {
  return <div>Hello</div>;
};

export default withAuthenticationRequired(MainLayout, {
  onRedirecting: () => <Loader />,
});
