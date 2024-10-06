import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "@trackingPortal/App";
import { ConfigProvider } from "@trackingPortal/contexts/ConfigContext";
import MainContainer from "@trackingPortal/container/MainContainer";
import { Toaster } from "react-hot-toast";

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
