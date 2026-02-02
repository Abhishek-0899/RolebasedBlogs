import { Outlet } from "react-router-dom";
import Navbar from "../navbar";

const Authorlayout = () => {
  return (
    <div className="">
      <main className="">
        <Navbar/>
        <Outlet />
      </main>
    </div>
  );
};

export default Authorlayout;
