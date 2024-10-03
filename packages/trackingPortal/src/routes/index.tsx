import { useRoutes } from "react-router-dom";

// project import
import LoginRoutes from "@trackingPortal/routes/LoginRoutes";
import MainRoutes from "@trackingPortal/routes/MainRoutes";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([LoginRoutes, MainRoutes]);
}
