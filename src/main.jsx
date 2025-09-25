import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/combineRoutes/CombineRoutes.jsx";
import { AuthWrapper } from "./components/context/auth.context.jsx";
import { ThemeProvider } from "./components/context/theme.context.jsx";

createRoot(document.getElementById("root")).render(
  <AuthWrapper>
    <ThemeProvider>
      <RouterProvider router={routes} />
    </ThemeProvider>
  </AuthWrapper>
);
