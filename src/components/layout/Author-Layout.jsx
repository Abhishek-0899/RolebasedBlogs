import { Outlet } from "react-router-dom";

const Authorlayout = () => {
  return (
    <div className="">
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default Authorlayout;
