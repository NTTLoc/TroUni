import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/combineRoutes/CombineRoutes.jsx";
import { AuthWrapper } from "./components/context/auth.context.jsx";
import { ThemeProvider } from "./components/context/theme.context.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ProfileWrapper } from "./components/context/profile.context.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthWrapper>
      <ProfileWrapper>
        <ThemeProvider>
          <RouterProvider router={routes} />
        </ThemeProvider>
      </ProfileWrapper>
    </AuthWrapper>
  </GoogleOAuthProvider>
);
