import { Outlet } from "react-router-dom";

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
