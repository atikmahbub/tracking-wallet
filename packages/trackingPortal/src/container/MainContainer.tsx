import React from "react";
import ThemeCustomization from "@trackingPortal/themes";
import Locales from "@trackingPortal/components/Locales";
import ScrollTop from "@trackingPortal/components/ScrollTop";
import Auth0ProviderWithHistory from "@trackingPortal/auth/Auth0ProviderWithHistory";
import App from "@trackingPortal/App";
import StoreProvider from "@trackingPortal/contexts/StoreProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

const MainContainer = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
    </LocalizationProvider>
  );
};

export default MainContainer;
