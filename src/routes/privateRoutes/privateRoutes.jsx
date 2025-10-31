import React from "react";
import { path } from "../../utils/constants";
import Account from "../../pages/account/Account";
import Dashboard from "../../pages/admin/Dashboard";
import LandlordDashboard from "../../pages/landlord/LandlordDashboard";
import CheckAuth from "../checkAuth/checkAuth";
import ManagePost from "../../pages/managePost/ManagePost";
import Chat from "../../pages/chat/Chat";

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
  // {
  //   element: <CheckAuth allowedRoles={["STUDENT"]} />,
  //   children: [
  //     { path: path.ACCOUNT, element: <Account /> },
  //     { path: path.MANAGE, element: <ManagePost /> },
  //   ],
  // },
  {
    path: path.ACCOUNT,
    element: <CheckAuth allowedRoles={["STUDENT"]} />,
    children: [
      {
        path: "",
        element: <Account />,
      },
    ],
  },
  {
    path: path.MANAGE,
    element: <CheckAuth allowedRoles={["STUDENT"]} />,
    children: [
      {
        path: "",
        element: <ManagePost />,
      },
    ],
  },
  {
    path: path.LANDLORD_DASHBOARD,
    element: <CheckAuth allowedRoles={["LANDLORD"]} />,
    children: [
      {
        path: "",
        element: <LandlordDashboard />,
      },
    ],
  },
  {
    path: path.CHAT,
    element: <CheckAuth allowedRoles={["STUDENT", "LANDLORD"]} />,
    children: [
      {
        path: "",
        element: <Chat />,
      },
    ],
  },
];

export default PrivateRoutes;
