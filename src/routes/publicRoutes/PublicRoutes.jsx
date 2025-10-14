import About from "../../pages/about/About";
import Account from "../../pages/account/Account";
import AuthForm from "../../pages/auth/AuthForm";
import Contact from "../../pages/contact/Contact";
import HomePage from "../../pages/home/HomePage";
import PostList from "../../pages/post/Post";
import PostDetail from "../../pages/postDetail/PostDetail";
import VerifyEmail from "../../pages/verifyEmail/VerifyEmail";
// import RoomList from "../../components/room/RoomList";
import RoomForm from "../../components/room/RoomForm";
import ApiDebugPanel from "../../components/debug/ApiDebugPanel";
import TestRoomApi from "../../components/debug/TestRoomApi";
import RoomApiComparison from "../../components/debug/RoomApiComparison";
// import AllRooms from "../../pages/rooms/AllRooms";
// import RoomDetail from "../../pages/rooms/RoomDetail";
import { path } from "../../utils/constants";
import ResetPassword from "../../pages/resetPassword/ResetPassword";
import ForgotPassword from "../../pages/forgotPassword/ForgotPassword";
import RoomMatching from "../../pages/roomMatching/RoomMatching";
import GroupFinder from "../../pages/groupFinder/GroupFinder";
import Community from "../../pages/community/Community";
import VideoCallPage from "../../pages/call/VideoCallPage";

const PublicRoutes = [
  { index: true, element: <HomePage /> },
  { path: path.ABOUT, element: <About /> },
  { path: path.CONTACT, element: <Contact /> },
  { path: path.POST, element: <PostList /> },
  { path: path.DETAIL, element: <PostDetail /> },
  { path: path.LOGIN, element: <AuthForm /> },
  { path: path.REGISTER, element: <AuthForm isRegister /> },
  { path: path.VERIFY_EMAIL, element: <VerifyEmail /> },
  { path: path.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: path.RESET_PASSWORD, element: <ResetPassword /> },
  { path: path.ROOMS_MATCHING, element: <RoomMatching /> },
  { path: path.GROUP_FINDER, element: <GroupFinder /> },
  { path: path.COMMUNITY, element: <Community /> },
  { path: path.CALL, element: <VideoCallPage /> },
  // Room management routes
  // { path: "/rooms", element: <RoomList /> },
  // { path: "/rooms/all", element: <AllRooms /> },
  // { path: "/rooms/:id", element: <RoomDetail /> },
  // { path: "/rooms/all/:id", element: <RoomDetail /> },
  { path: "/rooms/create", element: <RoomForm /> },
  { path: "/rooms/edit/:id", element: <RoomForm /> },
  // Debug routes
  // { path: "/debug/api", element: <ApiDebugPanel /> },
  // { path: "/debug/test-rooms", element: <TestRoomApi /> },
  // { path: "/debug/compare-apis", element: <RoomApiComparison /> },
];

export default PublicRoutes;
