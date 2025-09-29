import React from "react";
import { path } from "../../utils/constants";
import Account from "../../pages/account/Account";
import Dashboard from "../../pages/admin/Dashboard";
import CheckAuth from "../checkAuth/checkAuth";

const PrivateRoutes = [
  {
    path: path.ADMIN,
    element: <CheckAuth allowedRoles={["ADMIN"]} />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: path.ACCOUNT,
    element: <CheckAuth allowedRoles={["STUDENT"]} />,
    children: [
      {
        index: path.ACCOUNT,
        element: <Account />,
      },
    ],
  },
];

export default PrivateRoutes;
