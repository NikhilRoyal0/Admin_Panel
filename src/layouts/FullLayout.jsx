import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

const FullLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar}  />
      <Flex flex="1">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <Box ml={{ base: 0, md: 72 }} p="0" flex="1" mt={{ base: "150px", md: "100px" }}>
          <Box minHeight="calc(100vh - 100px)">
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Flex>
    </Flex>
  );
};

export default FullLayout;
