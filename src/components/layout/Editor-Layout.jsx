import { Outlet } from "react-router-dom";
import Navbar from "../navbar";

const Editorlayout = () => {
  return (
    <div className="">
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default Editorlayout;
