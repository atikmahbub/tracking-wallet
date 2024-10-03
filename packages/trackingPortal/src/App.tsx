import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { ERoutes } from "@trackingPortal/routes/ERoutes";
import { useNavigate } from "react-router";

import Routes from "@trackingPortal/routes";

const App = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    handleRedirect();
  }, [isAuthenticated]);

  const handleRedirect = () => {
    if (window.location.pathname === "/" && isAuthenticated) {
      navigate(ERoutes.Expense);
    }
  };

  return (
    <>
      <Routes />
    </>
  );
};

export default App;
