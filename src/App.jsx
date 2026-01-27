import { RouterProvider } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layout/appLayout";
import Home from "./pages/Home";
import Login from "./pages/login";
import SignIn from "./pages/SignIn";
import router from "./routes";
function App() {


  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
