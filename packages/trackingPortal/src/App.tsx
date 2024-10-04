import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { ERoutes } from "@trackingPortal/routes/ERoutes";
import { useNavigate, useSearchParams } from "react-router-dom";

import Routes from "@trackingPortal/routes";
import Loader from "@trackingPortal/components/Loader";
import {
  UNAUTHORIZED_SEARCH_PARAMS,
  URL_ERROR_PARAM,
} from "@trackingPortal/constants/constants";

const App = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const isUnAuthorized =
    searchParams.get(URL_ERROR_PARAM) === UNAUTHORIZED_SEARCH_PARAMS;

  useEffect(() => {
    if (isAuthenticated) {
      handleRedirect();
    }
  }, [isAuthenticated, isLoading]);

  const handleRedirect = () => {
    if (window.location.pathname === "/" && isAuthenticated) {
      navigate(ERoutes.Expense);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isUnAuthorized) {
    return navigate(ERoutes.Login);
  }

  return (
    <>
      <Routes />
    </>
  );
};

export default App;
