import React from "react";
import ThemeCustomization from "@trackingPortal/themes";
import Locales from "@trackingPortal/components/Locales";
import ScrollTop from "@trackingPortal/components/ScrollTop";
import Auth0ProviderWithHistory from "@trackingPortal/auth/Auth0ProviderWithHistory";
import App from "@trackingPortal/App";
import StoreProvider from "@trackingPortal/contexts/StoreProvider";

const MainContainer = () => {
  return (
    <Auth0ProviderWithHistory>
      <StoreProvider>
        <ThemeCustomization>
          <Locales>
            <ScrollTop>
              <App />
            </ScrollTop>
          </Locales>
        </ThemeCustomization>
      </StoreProvider>
    </Auth0ProviderWithHistory>
  );
};

export default MainContainer;
