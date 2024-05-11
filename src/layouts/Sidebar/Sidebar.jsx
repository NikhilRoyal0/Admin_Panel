import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Flex, Text, Divider, Icon, IconButton } from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; 
import { fetchLinkItems } from "../../app/Slices/menuSlice";

const Sidebar = ({ isSidebarOpen }) => {
  const dispatch = useDispatch();
  const menuItems = useSelector((state) => state.menuSlice.LinkItems);
  const [expandedItems, setExpandedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); 

  useEffect(() => {
    dispatch(fetchLinkItems());
  }, [dispatch]);

  const toggleExpansion = (itemId) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter((id) => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  const handleItemClick = (itemId) => {
    setSelectedItem(itemId);
  };

  const renderMenuItem = (item) => (
    <a
      key={item.id}
      href={item.href}
      style={{ textDecoration: "none" }}
      onClick={() => handleItemClick(item.id)}
    >
      <Box
        p="2"
        borderRadius="md"
        mb="2"
        width="100%"
        alignItems="center"
        justifyContent="center"
        color={selectedItem === item.id ? "blue" : "black"}
      >
        <Flex alignItems="center">
          <Icon as={item.icon} mr="2" />
          <Text fontSize="md" fontWeight="bold" flex="1">
            {item.title}
          </Text>
        </Flex>
      </Box>
    </a>
  );

  const renderMenuItemWithSubitems = (item) => (
    <Box key={item.id} mb="2">
      <Box
        color="black"
        borderRadius="md"
        width="100%"
        cursor="pointer"
        onClick={() => {
          toggleExpansion(item.id);
          handleItemClick(item.id);
        }}
      >
        <Flex alignItems="center" ml={2}>
          <Icon
            as={item.icon}
            mr="2"
            color={selectedItem === item.id ? "blue" : "black"}
          />
          <Text fontSize="md" fontWeight="bold" flex="1">
            {item.title}
          </Text>
          <IconButton
            icon={
              expandedItems.includes(item.id) ? <FaChevronUp /> : <FaChevronDown />
            }
            onClick={() => toggleExpansion(item.id)}
            variant="ghost"
            color="black"
            fontSize="16px"
            mr={1}
            ml={15}
          />
        </Flex>
      </Box>
      {expandedItems.includes(item.id) && (
        <Box ml="4">
          {item.subItems.map((subItem) => (
            <a
              key={subItem.id}
              href={subItem.href}
              style={{ color: "blue" }}
              onClick={() => handleItemClick(subItem.id)}
            >
              <Box
                color="black"
                alignItems="center"
                borderRadius="md"
                mt="2"
                width="calc(100% - 20px)"
              >
                <Flex alignItems="center" p={1}>
                  <Icon as={subItem.icon} mr="2"  />
                  <Text fontSize="md" fontWeight="bold">{subItem.title}</Text>
                </Flex>
              </Box>
            </a>
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <Flex
      as="nav"
      width={isSidebarOpen ? "250px" : "0"}
      bg="white"
      color="black"
      flexDirection="column"
      p={isSidebarOpen ? "4" : "0"}
      borderRadius="lg"
      height="100vh"
      overflowY="auto"
      position="fixed"
      left="0"
      top="0"
      zIndex="1"
    >
      <Box mb="5" mt="5">
        <Text fontSize="22px" fontWeight="bold" align={"center"}>
          Admin Chakra
        </Text>
    
      </Box>
      <Divider mb="5" />
      <Box ml={4}>
        {menuItems.map((menuItem) =>
          menuItem.subItems
            ? renderMenuItemWithSubitems(menuItem)
            : renderMenuItem(menuItem)
        )}
      </Box>
    </Flex>
  );
};

export default Sidebar;
