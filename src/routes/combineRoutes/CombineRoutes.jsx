import { createBrowserRouter } from "react-router-dom";
import PublicRoutes from "../publicRoutes/PublicRoutes";
import App from "../../App";

const routes = createBrowserRouter([
  { path: "/", element: <App />, children: [...PublicRoutes] },
]);

export default routes;
