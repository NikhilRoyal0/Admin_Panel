import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Flex, Text, Drawer, DrawerContent, List, ListItem, HStack, Icon, IconButton, Divider } from "@chakra-ui/react";
import { fetchLinkItems } from "../../app/Slices/menuSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { CloseIcon } from "@chakra-ui/icons";

const SidebarContent = ({ onClose, ...rest }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const pathDirect = pathname;

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    dispatch(fetchLinkItems());
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const LinkItems = useSelector((state) => state.menu.LinkItems);

  return (
    <Box
      transition="3s ease"
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w={{ base: "full", md: "72" }}
      pos="fixed"
      h="full"
      {...rest}
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#4A5568",
          borderRadius: "4px",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "thin",
      }}
      overflow="auto"
    >
      {isSmallScreen && (
        <Flex justifyContent="flex-end"  mt={2}>
          <IconButton
          variant="ghost"
            aria-label="Close Sidebar"
            icon={<CloseIcon />}
            onClick={onClose}
          />
        </Flex>
      )}
     <Flex h="20" alignItems="center" justifyContent="center" mx="8"> {/* Adjusted alignItems and added justifyContent */}
        <Text as="a" href="/" fontSize="3xl" fontWeight="bold">
          Admin Panel
        </Text>
      </Flex>
      <Divider mt={5} />
      <br />
      {LinkItems.map((item, index) => (
        <React.Fragment key={index}>
          <List styleType="none">
            <ListItem
              key={index}
              as={NavLink}
              to={item.href}
              selected={pathDirect === item.href}
              sx={{
                mb: 1,
                ...(pathDirect === item.href && {
                  color: "blue.500",
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }),
              }}
              onClick={onClose}
            >
              <Flex justifyContent="space-between" alignItems="center" pl={10} pb={5}>
                <HStack spacing="4">
                  <Icon as={item.icon} fontSize="1.4rem" />
                  <Text fontSize="md" fontWeight="bold">
                    {item.title}
                  </Text>
                </HStack>
              </Flex>
            </ListItem>
          </List>
        </React.Fragment>
      ))}
    </Box>
  );
};


const Sidebar = ({ isOpen, onClose }) => {
  return (
    <Box bg="gray.100">
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="md"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
