import { createBrowserRouter } from "react-router-dom";
import Signin from "./components/signin";
import Signup from "./components/signup";
import Dashboard from "./Dashboard/Dashboard.jsx";
import App from "./App.jsx";
import PrivateRouter from "./PrivateRouter.jsx";
import ConfiremeEmail from "./components/ConfiremeEmail.jsx";
import UpdatePassword from "./components/UpdatePassword.jsx"; 

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signin", element: <Signin /> },
  { path: "/signup", element: <Signup /> },
  { path: "/ConfiremeEmail", element: <ConfiremeEmail /> },
  { path: "/update-password", element: <UpdatePassword /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRouter>
        <Dashboard />
      </PrivateRouter>
    ),
  },
]);