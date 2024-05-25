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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsersData,
  selectUsersData,
  selectUsersLoading,
  selectUsersError,
  AddUserData,
} from "../../../app/Slices/usersSlice";
import NetworkError from "../../NotFound/networkError";
import { getModulePermissions } from "../../../utils/permissions";


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
    role: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

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
          deviceId: "",
          role: "",
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
      <NetworkError />
    );
  }

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1) {
      setCurrentPage(1);
    } else if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <Button
          key={i}
          onClick={() => paginate(i)}
          variant={currentPage === i ? "solid" : "outline"}
          colorScheme={currentPage === i ? "blue" : undefined}
          mr={2}
        >
          {i}
        </Button>
      );
    }
    return pageButtons;
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const branchManagementPermissions = getModulePermissions('Users');
  const canAddData = branchManagementPermissions.create;
  const canDeleteData = branchManagementPermissions.delete;
  const canEditData = branchManagementPermissions.update;


  return (
    <Box p="3" >
      <Flex align="center" justify="space-between" mb="6" mt={5}>
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
            onClick={() => {
              if (canAddData) {
                setIsAddUserModalOpen(true)
              } else {
                Toast({
                  title: "You don't have permission to add user",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                  position: "top-right",
                });
              }
            }}
          >
            Add User
          </Button>
        </Flex>
      </Flex>
      <Box p="6" borderRadius="lg" overflowX="auto" css={{
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#cbd5e0',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#a0aec0',
        },
      }}>
        {filteredUsers.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No users available
          </Text>
        ) : (
          <>
            <Table variant="simple" minWidth="100%">
              <Thead>
                <Tr>
                  <Th>First Name</Th>
                  <Th>Last Name</Th>
                  <Th>Email</Th>
                  <Th>Primary Phone</Th>
                  <Th>Device Id</Th>
                  <Th>Role</Th>
                  <Th>Edit/Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentUsers
                  .filter(user => user.status === 'Active')
                  .map((user, index) => (
                    <Tr key={index}>
                      <Td>{user.firstName}</Td>
                      <Td>{user.lastName}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.primaryPhone}</Td>
                      <Td>{user.deviceId}</Td>
                      <Td>{user.role}</Td>
                      <Td>
                        <Button
                          size="xs"
                          colorScheme="teal"
                          mr="2"
                          onClick={() => {
                            if (canEditData) {
                              handleEdit(user.id);
                            } else {
                              Toast({
                                title: "You don't have permission to edit user",
                                status: "error",
                                duration: 3000,
                                isClosable: true,
                                position: "top-right",
                              });
                            }
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          colorScheme="red"
                          onClick={() => {
                            if (canDeleteData) {
                              handleDelete(user.id);
                            } else {
                              Toast({
                                title: "You don't have permission to delete user",
                                status: "error",
                                duration: 3000,
                                isClosable: true,
                                position: "top-right",
                              });
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
            <Flex justify="flex-end" mt="4">
              <Button onClick={() => paginate(1)} mr={2}>&lt;&lt;</Button>
              <Button onClick={() => paginate(currentPage - 1)} mr={2}>&lt;</Button>
              {renderPagination()}
              <Button onClick={() => paginate(currentPage + 1)} ml={2}>&gt;</Button>
              <Button onClick={() => paginate(totalPages)} ml={2}>&gt;&gt;</Button>
            </Flex>
          </>
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
