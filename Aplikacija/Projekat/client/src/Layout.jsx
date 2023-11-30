import React, { useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = ({ socket }) => {
  return (
    <div>
      <div className="py-8 px-8 flex flex-col min-h-screen">
        <Header socket={socket} />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
