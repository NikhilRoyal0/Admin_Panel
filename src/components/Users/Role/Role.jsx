import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchrolesData, selectrolesData, selectrolesLoading, selectrolesError,
  addrolesData, deleterolesData
} from "../../../app/Slices/roleSlice";
import {
  Box, Spinner, Table, Text, FormControl, FormLabel, Divider, Thead, Tbody, Tr, Th, Td, Flex, IconButton,
  Input, Button, Card, CardHeader, CardBody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, useToast, Grid, GridItem
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import NetworkError from "../../NotFound/networkError";

export default function Role() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
  });
  const rolesData = useSelector(selectrolesData);
  const isLoading = useSelector(selectrolesLoading);
  const error = useSelector(selectrolesError);
  const userId = sessionStorage.getItem("userId");

  const [newRoleName, setNewRoleName] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    dispatch(fetchrolesData());
  }, [dispatch]);

  const handleEditRole = (roleId) => {
    if (roleId !== 1) {
      navigate(`/user/roles/edit/${roleId}`);
    }
  };

  const handleDeleteRole = (role) => {
    if (role.roleId !== 1) {
      setSelectedRole(role);
      setDeleteModalOpen(true);
    }
  };

  const confirmDeleteRole = () => {
    if (selectedRole) {
      dispatch(deleterolesData(selectedRole.roleId))
        .then(() => {
          setDeleteModalOpen(false);
          setSelectedRole(null);
          dispatch(fetchrolesData());
          toast({
            title: "Role deleted.",
            description: "The role has been deleted successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((error) => {
          console.error("Error deleting role:", error);
          toast({
            title: "Error deleting role.",
            description: "There was an error deleting the role.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedRole(null);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      const createdBy = userId;
      const createdOn = Date.now();
      const status = "Active"
      const permissions = "[{\"module\":\"Branch\",\"pageRoute\":\"/branch\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}},{\"module\":\"Users\",\"pageRoute\":\"/users\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}},{\"module\":\"Staff Attendance\",\"pageRoute\":\"/staff/attendance\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}},{\"module\":\"Users\",\"pageRoute\":\"/studentDashBoard\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}},{\"module\":\"Roles\",\"pageRoute\":\"/role\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}},{\"module\":\"Courses\",\"pageRoute\":\"/student\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}},{\"module\":\"Course Category\",\"pageRoute\":\"/courses/categories\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}},{\"module\":\"Course Content\",\"pageRoute\":\"/course/contents\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}},{\"module\":\"Benefits\",\"pageRoute\":\"/benefits\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}},{\"module\":\"Certificates\",\"pageRoute\":\"/certificates\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}},{\"module\":\"Certificate Template\",\"pageRoute\":\"/certificate/template\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}},{\"module\":\"Inquiry\",\"pageRoute\":\"/leads\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}},{\"module\":\"Student Attendance\",\"pageRoute\":\"/student/attendance\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}},{\"module\":\"Modules\",\"pageRoute\":\"/student/modules\",\"permissionsList\":{\"create\":false,\"update\":false,\"read\":false,\"delete\":false}}]";
      dispatch(addrolesData({ roleName: newRoleName.trim(), permissions, createdBy, createdOn, status }))
        .then(() => {
          setNewRoleName('');
          dispatch(fetchrolesData());
          toast({
            title: "Role added.",
            description: "The new role has been added successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((error) => {
          console.error("Error adding role:", error);
          toast({
            title: "Error adding role.",
            description: "There was an error adding the role.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return <NetworkError />;
  }

  return (
    <Flex mt={10} ml="5%" mr="5%" p={4} borderRadius="md" overflow="auto" wrap="wrap" gap={4}>
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={4} width="100%">
        <GridItem>
          <Card width="100%" p={4} borderRadius="md" height="250px">
            <CardHeader>
              <Box fontSize="lg" fontWeight="bold">Role</Box>
            </CardHeader>
            <Divider />
            <CardBody>
              <FormControl isRequired>
                <FormLabel>Name <Box as="span" color="red"></Box></FormLabel>
                <Input
                  isRequired
                  placeholder="New role name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  mb={3}
                />
              </FormControl>
              <Flex justify="flex-end">
                <Button size="sm" onClick={handleAddRole} colorScheme="blue">Save</Button>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card p={4} bg="white" borderRadius="md" overflow="auto" css={{
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
            <CardHeader>
              <Box fontSize="lg" fontWeight="bold">Roles List</Box>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Role</Th>
                    <Th textAlign="center">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {rolesData
                    .filter(role => role.status === 'Active')
                    .map((role) => (
                      <Tr key={role.roleId} _hover={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)" }}>
                        <Td>{role.roleName}</Td>
                        <Td>
                          <Flex justify="center">
                            {role.roleId !== 1 && (
                              <>
                                <IconButton
                                  aria-label="Edit role"
                                  icon={<EditIcon />}
                                  onClick={() => handleEditRole(role.roleId)}
                                  mr={2}
                                  colorScheme="blue"
                                  onMouseEnter={() => setIsHovered(`edit_${role.roleId}`)}
                                  onMouseLeave={() => setIsHovered(null)}
                                  fontSize={isHovered === `edit_${role.roleId}` ? '24px' : '16px'}
                                  transition="font-size 0.3s ease"
                                />
                                <IconButton
                                  aria-label="Delete role"
                                  icon={<DeleteIcon />}
                                  onClick={() => handleDeleteRole(role)}
                                  colorScheme="red"
                                  onMouseEnter={() => setIsHovered(`delete_${role.roleId}`)}
                                  onMouseLeave={() => setIsHovered(null)}
                                  fontSize={isHovered === `delete_${role.roleId}` ? '24px' : '16px'}
                                  transition="font-size 0.3s ease"
                                />
                              </>
                            )}
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
      <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete this role?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={confirmDeleteRole}>
              Delete
            </Button>
            <Button onClick={handleCloseDeleteModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
