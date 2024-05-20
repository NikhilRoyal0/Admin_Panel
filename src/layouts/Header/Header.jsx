import React from "react";
import {
  Flex,
  Box,
  Input,
  IconButton,
  Avatar,
  Text,
  useColorMode,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import {
  BellIcon,
  MoonIcon,
  SunIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import renderContent from "./renderContent";

const Header = ({ toggleSidebar, isSidebarOpen, closeSidebar }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const path = location.pathname;

  const isSmallScreen = useBreakpointValue({ base: true, md: false });
  const isLargeScreen = useBreakpointValue({ base: false, md: true });

  return (
    <Flex
      position="fixed"
      top="5"
      left={isLargeScreen || isSidebarOpen ? "300px" : "20px"}
      minHeight={{ base: "100px", md: "70px" }}
      width={{ base: "calc(100% - 40px)", md: isLargeScreen || isSidebarOpen ? "calc(100% - 310px)" : "calc(100% - 20px)" }}
      bg="rgba(173, 216, 230, 0.2)"
      backdropFilter="blur(10px)"
      alignItems="center"
      px="4"
      zIndex="1"
      borderRadius="10px 10px 10px 10px"
      display={{ sm: "grid" }}
      gridTemplateColumns="auto 1fr"
      gridColumnGap="20px"
      pl={5}
    >

      <Text fontSize="lg" fontWeight="bold">
      {renderContent(path)}
      </Text>
      <Box
        bg="white"
        display="flex"
        boxShadow="md"
        p={2}
        borderRadius={50}
        gridColumn={{ base: "auto", md: "3" }}
        mt={{ base: "4", md: "4" }}
        mb={4}
        maxW="fit-content"
      >
        <Input
          borderRadius={50}
          variant="filled"
          placeholder="Search..."
          size="sm"
          flex="1"
          maxWidth="200px"
        />
        {isSmallScreen && (
          <IconButton
            aria-label="Toggle Menu"
            icon={<HamburgerIcon />}
            variant="ghost"
            size="sm"
            ml="2"
            onClick={toggleSidebar}
          />
        )}
        <IconButton
          aria-label="Notifications"
          icon={<BellIcon />}
          variant="ghost"
          size="sm"
          ml="2"
        />
        <IconButton
          aria-label="Change Theme"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          variant="ghost"
          size="sm"
          ml="2"
        // onClick={toggleColorMode}
        />
        <Avatar ml="2" size="sm" name="User" src="https://bit.ly/dan-abramov" />
      </Box>
    </Flex>
  );
};

export default Header;
