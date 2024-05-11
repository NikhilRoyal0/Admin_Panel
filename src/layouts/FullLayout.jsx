import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import Header from "./Header/Header"; 
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const FullLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/> 
      <Box display="flex" flex="1">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <Box flex="1" marginTop="100px" marginLeft={isSidebarOpen ? "250px" : "0"}>
          <Box minHeight="calc(100vh - 100px - 60px)">
            <Outlet />
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default FullLayout;
