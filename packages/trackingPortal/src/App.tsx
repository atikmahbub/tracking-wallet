import Routes from "routes";
import ThemeCustomization from "@trackingPortal/themes";
import Locales from "@trackingPortal/components/Locales";
// import RTLLayout from 'components/RTLLayout';
import ScrollTop from "@trackingPortal/components/ScrollTop";
import { SnackbarContextProvider } from "@trackingPortal/contexts/SnackbarContext";

const App = () => (
  <ThemeCustomization>
    <SnackbarContextProvider>
      {/* <RTLLayout> */}
      <Locales>
        <ScrollTop>
          <>
            <Routes />
          </>
        </ScrollTop>
      </Locales>
      {/* </RTLLayout> */}
    </SnackbarContextProvider>
  </ThemeCustomization>
);

export default App;
