import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ConfigProvider } from "@trackingPortal/contexts/ConfigContext";
import MainContainer from "@trackingPortal/container/MainContainer";
import { Toaster } from "react-hot-toast";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <ConfigProvider>
    <Toaster position="top-center" />
    <BrowserRouter>
      <MainContainer />
    </BrowserRouter>
  </ConfigProvider>
);

// Register the service worker
serviceWorkerRegistration.register();
