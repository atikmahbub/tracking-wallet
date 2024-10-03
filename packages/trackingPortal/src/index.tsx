import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "@trackingPortal/App";
import { ConfigProvider } from "@trackingPortal/contexts/ConfigContext";
import MainContainer from "@trackingPortal/container/MainContainer";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <ConfigProvider>
    <BrowserRouter>
      <MainContainer />
    </BrowserRouter>
  </ConfigProvider>
);
