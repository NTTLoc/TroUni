import { createBrowserRouter } from "react-router-dom";
import PublicRoutes from "../publicRoutes/PublicRoutes";
import App from "../../App";
import PrivateRoutes from "../privateRoutes/privateRoutes";
import CheckAuth from "../checkAuth/checkAuth";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [...PublicRoutes, ...PrivateRoutes],
  },
]);

export default routes;
