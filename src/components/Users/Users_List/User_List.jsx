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
  useToast,
  Select,
  Grid,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsersData,
  selectUsersData,
  selectUsersLoading,
  selectUsersError,
  AddUserData,
  updateUserData,
  deleteUserData
} from "../../../app/Slices/usersSlice";
import { fetchrolesData, selectrolesData, selectrolesError, selectrolesLoading } from "../../../app/Slices/roleSlice";
import { BeatLoader } from "react-spinners";
import NetworkError from "../../NotFound/networkError";
import { getModulePermissions } from "../../../utils/permissions";
import { fetchBranchData, selectBranchData, selectBranchError, selectBranchLoading } from "../../../app/Slices/branchSlice";


export default function UserList() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    primaryPhone: "",
    secondaryPhone: "",
    role: "",
    status: "",
    createdOn: Date.now(),
    branchId: "",
    profilePhoto: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedUserData, setEditedUserData] = useState({});
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const usersData = useSelector(selectUsersData);
  const roleData = useSelector(selectrolesData);
  const BranchData = useSelector(selectBranchData);
  const BranchError = useSelector(selectBranchError);
  const BranchLoading = useSelector(selectBranchLoading);
  const roleError = useSelector(selectrolesError);
  const roleLoading = useSelector(selectrolesLoading);
  const isLoading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const dispatch = useDispatch();
  const Toast = useToast({
    position: "top-right",
  });

  useEffect(() => {
    dispatch(fetchUsersData());
    dispatch(fetchrolesData());
    dispatch(fetchBranchData());
  }, [dispatch]);

  const filteredUsers = usersData.filter(
    (user) =>
      user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.primaryPhone.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleAddUser = (e) => {
    e.preventDefault();

    dispatch(AddUserData(newUserData))
      .then(() => {
        setNewUserData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          primaryPhone: "",
          secondaryPhone: "",
          role: "",
          status: "",
          createdOn: "",
          branchId: "",
          profilePhoto: "",
        });
        setIsAddUserModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      firstName: editedUserData.firstName,
      lastName: editedUserData.lastName,
      email: editedUserData.email,
      password: editedUserData.password,
      primaryPhone: editedUserData.primaryPhone,
      secondaryPhone: editedUserData.secondaryPhone,
      role: editedUserData.role,
      status: editedUserData.status,
      updatedOn: editedUserData.updatedOn,
      branchId: editedUserData.branchId,
      profilePhoto: editedUserData.profilePhoto

    };

    dispatch(updateUserData(editedUserData.userId, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedUserId(null);
        dispatch(fetchUsersData());
        setIsSaveLoading(false);
        setNewUserData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          primaryPhone: "",
          secondaryPhone: "",
          role: "",
          status: "",
          createdOn: "",
          branchId: "",
          profilePhoto: "",
        });
        Toast({
          title: "User updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating User",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating User: ", error);
      });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deleteUserData(selectedUserId))
      .then(() => {
        dispatch(fetchUsersData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedUserId(null);
        setIsSaveLoading(false);
        Toast({
          title: "User deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete User",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting User: ", error);
      });
  };

  const handleEditUser = (user) => {
    setSelectedUserId(user.userId);
    setEditedUserData(user);
    setIsEditModalOpen(true);
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

  if (roleLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (roleError) {
    return (
      <NetworkError />
    );
  }

  if (BranchLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (BranchError) {
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

  const UserManagementPermissions = getModulePermissions('Users');

  if (!UserManagementPermissions) {
    return <NetworkError />;
  }
  const canAddData = UserManagementPermissions.create;
  const canDeleteData = UserManagementPermissions.delete;
  const canEditData = UserManagementPermissions.update;



  return (
    <Box p="3" >
      <Flex
        align="center"
        justify="space-between"
        mb="6"
        mt={5}
        direction={{ base: "row", md: "row" }} // Switch direction based on screen width
      >
        <Text fontSize="2xl" fontWeight="bold" ml={{ base: 0, md: 5 }} mb={{ base: 4, md: 0 }}> {/* Adjust margin bottom for smaller screens */}
          User List
        </Text>
        <Flex align="center" mb={{ base: 4, md: 0 }}> {/* Adjust margin bottom for smaller screens */}
          <Input
            placeholder="Search by Email, Phone, or First Name"
            w={{ base: "100%", md: "300px" }} // Adjust width based on screen width
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            mr={3}
          />
          <Button
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
                        <Flex>
                          <Button
                            size="xs"
                            colorScheme="teal"
                            mr="2"
                            onClick={() => {
                              if (canEditData) {
                                handleEditUser(user);
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
                                setIsDeleteConfirmationModalOpen(true);
                                setSelectedUserId(user.userId);
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
                        </Flex>
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
        size="3xl"
      >
        <ModalOverlay />
        <form onSubmit={handleAddUser}>
          {" "}
          <ModalContent>
            <ModalHeader>Add User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
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
                  placeholder="Password"
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, password: e.target.value })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="Primary Phone Number"
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
                  placeholder="Secondary Phone Number"
                  value={newUserData.secondaryPhone}
                  onChange={(e) =>
                    setNewUserData({
                      ...newUserData,
                      secondaryPhone: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="Profile Photo"
                  value={newUserData.profilePhoto}
                  onChange={(e) =>
                    setNewUserData({
                      ...newUserData,
                      profilePhoto: e.target.value,
                    })
                  }
                  isRequired
                />
                <Select
                  mb="3"
                  placeholder="Select Branch"
                  value={newUserData.branchId}
                  onChange={(e) =>
                    setNewUserData({
                      ...newUserData,
                      branchId: e.target.value,
                    })
                  }
                  isRequired
                >
                  {BranchData.map((branch) => (
                    <option key={branch.branchId} value={branch.branchId}>
                      {branch.branchName}
                    </option>
                  ))}
                </Select>
                <Select
                  mb="3"
                  placeholder="Select Role"
                  value={newUserData.role}
                  onChange={(e) =>
                    setNewUserData({
                      ...newUserData,
                      role: e.target.value,
                    })
                  }
                  isRequired
                >
                  {roleData.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </Select>
                <Select
                  mb="3"
                  placeholder="Select status"
                  value={newUserData.status}
                  onChange={(e) =>
                    setNewUserData({
                      ...newUserData,
                      status: e.target.value,
                    })
                  }
                  isRequired
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Disabled">Disabled</option>
                  <option value="NeedKyc">Need KYC</option>
                </Select>
              </Grid>
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
      <Modal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this User?</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={handleDeleteConfirmation}
              isLoading={isSaveLoading}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteConfirmationModalOpen(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
              <Box>
                <Text mb="1" color="gray.600">
                  First Name
                </Text>
                <Input
                  mb="3"
                  placeholder="First Name"
                  value={editedUserData?.firstName || ""}
                  onChange={(e) =>
                    setEditedUserData({
                      ...editedUserData,
                      firstName: e.target.value,
                    })
                  }
                  required
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Last Name
                </Text>
                <Input
                  mb="3"
                  placeholder="Last Name"
                  value={editedUserData?.lastName || ""}
                  onChange={(e) =>
                    setEditedUserData({
                      ...editedUserData,
                      lastName: e.target.value,
                    })
                  }
                  required
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Email
                </Text>
                <Input
                  mb="3"
                  placeholder="Email"
                  value={editedUserData?.email || ""}
                  onChange={(e) =>
                    setEditedUserData({
                      ...editedUserData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Primary Phone
                </Text>
                <Input
                  mb="3"
                  placeholder="Primary Phone"
                  value={editedUserData?.primaryPhone || ""}
                  onChange={(e) =>
                    setEditedUserData({
                      ...editedUserData,
                      primaryPhone: e.target.value,
                    })
                  }
                  required
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Secondary Phone
                </Text>
                <Input
                  mb="3"
                  placeholder="Secondary Phone"
                  value={editedUserData?.secondaryPhone || ""}
                  onChange={(e) =>
                    setEditedUserData({
                      ...editedUserData,
                      secondaryPhone: e.target.value,
                    })
                  }
                  required
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Role
                </Text>
                <Select
                  mb="3"
                  placeholder="Select Role"
                  value={editedUserData?.role || ""}
                  onChange={(e) =>
                    setEditedUserData({
                      ...editedUserData,
                      role: e.target.value,
                    })
                  }
                  isRequired
                >
                  {roleData.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Status
                </Text>
                <Select
                  mb="3"
                  placeholder="Select status"
                  value={editedUserData?.status || ""}
                  onChange={(e) =>
                    setEditedUserData({
                      ...editedUserData,
                      status: e.target.value,
                    })
                  }
                  isRequired
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Disabled">Disabled</option>
                  <option value="NeedKyc">Need KYC</option>
                </Select>
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Branch Id
                </Text>
                <Select
                  mb="3"
                  placeholder="Select Branch"
                  value={editedUserData?.branchId || ""}
                  onChange={(e) =>
                    setEditedUserData({
                      ...editedUserData,
                      branchId: e.target.value,
                    })
                  }
                  isRequired
                >
                  {BranchData.map((branch) => (
                    <option key={branch.branchId} value={branch.branchId}>
                      {branch.branchName}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Profile Photo
                </Text>
                <Input
                  mb="3"
                  placeholder="Profile Photo"
                  value={editedUserData?.profilePhoto || ""}
                  onChange={(e) =>
                    setEditedUserData({
                      ...editedUserData,
                      profilePhoto: e.target.value,
                    })
                  }
                  required
                />
              </Box>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={handleSaveChanges}
              isLoading={isSaveLoading}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Save Changes
            </Button>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
