import React from "react";
import ThemeCustomization from "@trackingPortal/themes";
import Locales from "@trackingPortal/components/Locales";
import ScrollTop from "@trackingPortal/components/ScrollTop";
import { SnackbarContextProvider } from "@trackingPortal/contexts/SnackbarContext";
import Auth0ProviderWithHistory from "@trackingPortal/auth/Auth0ProviderWithHistory";
import App from "@trackingPortal/App";

const MainContainer = () => {
  return (
    <Auth0ProviderWithHistory>
      <ThemeCustomization>
        <SnackbarContextProvider>
          <Locales>
            <ScrollTop>
              <App />
            </ScrollTop>
          </Locales>
        </SnackbarContextProvider>
      </ThemeCustomization>
    </Auth0ProviderWithHistory>
  );
};

export default MainContainer;
