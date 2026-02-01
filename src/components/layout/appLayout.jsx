import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default AppLayout;
