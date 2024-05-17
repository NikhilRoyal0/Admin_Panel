import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spinner,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsersData,
  selectUsersData,
  selectUsersLoading,
  selectUsersError,
  AddUserData,
} from "../../../app/Slices/usersSlice";

export default function UserList() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    primaryPhone: "",
    deviceId: "",
    password: "abc#123",
    role:"",
  });

  const usersData = useSelector(selectUsersData);
  const isLoading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsersData());
  }, [dispatch]);

  const filteredUsers = usersData.filter(
    (user) =>
      user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.primaryPhone.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleAddUser = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Dispatch the action to add new user data
    dispatch(AddUserData(newUserData))
      .then(() => {
        setNewUserData({
          firstName: "",
          lastName: "",
          email: "",
          primaryPhone: "",
          password: "",
          deviceId:"",
          role:"",
        });
        setIsAddUserModalOpen(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text color="red">Error: {error}</Text>
      </Flex>
    );
  }

  return (
    <Box p="1" overflowX="auto">
      <Flex align="center" justify="space-between" mb="6" mt={5} overflow="auto">
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          User List
        </Text>
        <Flex align="center">
          <Input
            placeholder="Search by Email, Phone, or First Name"
            w="300px"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button
          mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            Add User
          </Button>
        </Flex>
      </Flex>
      <Box bg="gray.100" p="6" borderRadius="lg">
        {filteredUsers.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No users available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>Email</Th>
                <Th>Primary Phone</Th>
                <Th>Device Id </Th>
                <Th>Role</Th>
                <Th>Edit/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.map((user, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {user.firstName}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {user.lastName}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {user.email}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {user.primaryPhone}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {user.deviceId}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {user.role}
                  </Td>
                 
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="teal"
                        mr="1"
                        onClick={() =>
                          console.log("Edit user with ID:", user.user_id)
                        }
                      >
                        Edit
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddUser}>
          {" "}
          <ModalContent>
            <ModalHeader>Add User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form input fields for adding a new user */}
              <Input
                mb="3"
                placeholder="First Name"
                value={newUserData.firstName}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, firstName: e.target.value })
                }
                isRequired 
              />
              <Input
                mb="3"
                placeholder="Last Name"
                value={newUserData.lastName}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, lastName: e.target.value })
                }
                isRequired 
              />
              <Input
                mb="3"
                placeholder="Email"
                value={newUserData.email}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, email: e.target.value })
                }
                isRequired 
              />
              <Input
                mb="3"
                placeholder=" Primary Phone Number"
                value={newUserData.primaryPhone}
                onChange={(e) =>
                  setNewUserData({
                    ...newUserData,
                    primaryPhone: e.target.value,
                  })
                }
                isRequired 
              />
              <Input
                mb="3"
                placeholder="Enter Password"
                value={newUserData.password}
                onChange={(e) =>
                  setNewUserData({
                    ...newUserData,
                    password: e.target.value,
                  })
                }
                isRequired 
              />
              <Input
                mb="3"
                placeholder="Device Id"
                value={newUserData.deviceId}
                onChange={(e) =>
                  setNewUserData({
                    ...newUserData,
                    deviceId: e.target.value,
                  })
                }
                isRequired 
              />
              <Input
                mb="3"
                placeholder="Role"
                value={newUserData.role}
                onChange={(e) =>
                  setNewUserData({
                    ...newUserData,
                    role: e.target.value,
                  })
                }
                isRequired 
              />
             
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="teal">
                Submit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsAddUserModalOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>{" "}
        {/* Close form tag */}
      </Modal>
    </Box>
  );
}
