import React from "react";
import { path } from "../../utils/constants";
import Account from "../../pages/account/Account";

const PrivateRoutes = [
  // {
  //   path: "admin",
  //   element: <AdminDashboard />,
  // },
  {
    path: path.ACCOUNT,
    element: <Account />,
  },
];

export default PrivateRoutes;
