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
  SearchIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();

  const renderContent = () => {
    const path = location.pathname;
    switch (path) {
      case "/dashboard":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Dashboard
          </Text>
        );
      case "/user/user-list":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Users
          </Text>
        );
      default:
        return null;
    }
  };

  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <Flex
      position="fixed"
      top="5"
      right="7"
      width={isSidebarOpen ? "calc(100% - 300px)" : "calc(100% - 50px)"}
      minHeight={{ base: "100px", md: "70px" }}
      bg="rgba(173, 216, 230, 0.2)"
      backdropFilter="blur(10px)"
      alignItems="center"
      px="4"
      zIndex="1"
      borderRadius="10px 10px 10px 10px"
      display={{ md: "grid" }}
      gridTemplateColumns="auto 1fr"
      gridColumnGap="20px"
    >
      <Box flex="1">
        <Text fontSize="lg" fontWeight="bold">Home / Dashboard</Text>
        <Text> {renderContent()}</Text>
      </Box>
      <Box
        bg="white"
        display="flex"
        boxShadow="md"
        p={2}
        borderRadius={50}
        gridColumn={{ base: "auto", md: "3" }}
        mt={{ base: "4", md: "4" }}
        mb={4}
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
          onClick={toggleColorMode}
        />
        <Avatar ml="2" size="sm" name="User" src="https://bit.ly/dan-abramov" />
      </Box>
    </Flex>
  );
};

export default Header;
