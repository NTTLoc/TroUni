import About from "../../pages/about/About";
import Account from "../../pages/account/Account";
import AuthForm from "../../pages/auth/AuthForm";
import Contact from "../../pages/contact/Contact";
import HomePage from "../../pages/home/HomePage";
import PostList from "../../pages/post/Post";
import PostDetail from "../../pages/postDetail/PostDetail";
import { path } from "../../utils/constants";

const PublicRoutes = [
  { index: true, element: <HomePage /> },
  { path: path.ABOUT, element: <About /> },
  { path: path.CONTACT, element: <Contact /> },
  { path: path.POST, element: <PostList /> },
  { path: path.DETAIL, element: <PostDetail /> },
  { path: path.LOGIN, element: <AuthForm /> },
  { path: path.REGISTER, element: <AuthForm isRegister /> },
];

export default PublicRoutes;
