import { createBrowserRouter } from "react-router-dom";
import Signin from "./components/signin";
import Signup from "./components/signup";
import Dashboard from "./section/Dashboard.jsx";
import App from "./App.jsx";
import PrivateRouter from "./PrivateRouter.jsx";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signin", element: <Signin /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRouter>
        <Dashboard />
      </PrivateRouter>
    ),
  },
]);