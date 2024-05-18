import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Flex, CloseButton, Text, Drawer, DrawerContent,List,ListItem,HStack,Icon ,IconButton, Divider   } from "@chakra-ui/react";
import { fetchLinkItems } from "../../app/Slices/menuSlice";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";

const SidebarContent = ({ onClose, ...rest }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const pathDirect = pathname;

  const [open, setOpen] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  

  const handleClick = (index, hasSubItems) => {
    if (hasSubItems) {
      setOpen(open === index ? null : index);
    } else {
      if (isSmallScreen) {
        onClose();
      }
    }
  };

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
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text as="a" href="/" fontSize="3xl" fontWeight="bold" ml={4} mt={5}>
          Admin Panel
        </Text>
      </Flex>
        <Divider mt={5}/>
      <br />
      {LinkItems.map((item, index) => (
        <React.Fragment key={index}>
          <List styleType="none">
            <ListItem
              key={index}
              onClick={() => handleClick(index, !!item.subItems)}
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
            >
              <Flex
                justifyContent="space-between"
                alignItems="center"
                pl={10}
                pb={5}
              >
                <HStack spacing="4">
                  <Icon as={item.icon} fontSize="1.4rem" />
                  <Text fontSize="md" fontWeight="bold">
                    {item.title}
                  </Text>
                </HStack>
                {item.subItems && (
                  <IconButton
                    onClick={() => handleClick(index, !!item.subItems)}
                    icon={
                      open === index ? <ChevronUpIcon /> : <ChevronDownIcon />
                    }
                    variant="hidden"
                    aria-label={open === index ? "Close" : "Open"}
                    size="sm"
                    pr={20}
                    fontSize={23}
                  />
                )}
              </Flex>
            </ListItem>
          </List>

          {item.subItems && open === index && (
            <List styleType="none" pl={20} pb={2}>
              {item.subItems.map((subItem, subIndex) => (
                <ListItem
                  key={subIndex}
                  onClick={() => handleClick(index, false)}
                  as={NavLink}
                  to={subItem.href}
                  selected={pathDirect === subItem.href}
                  sx={{
                    mb: 1,
                    ...(pathDirect === subItem.href && {
                      color: "blue.500",
                      backgroundColor: "lightblue",
                      fontWeight: "bold",
                    }),
                  }}
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    pb={5}
                  >
                    <HStack spacing="3">
                      <Icon as={subItem.icon} fontSize="1.2rem" />
                      <Text fontSize="md" fontWeight="bold">
                        {subItem.title}
                      </Text>
                    </HStack>
                  </Flex>
                </ListItem>
              ))}
            </List>
          )}
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
