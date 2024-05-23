import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchrolesData, selectrolesData, selectrolesLoading, selectrolesError, addrolesData, deleterolesData } from "../../../app/Slices/roleSlice";
import { Box, Spinner, Table, Text, FormControl, FormLabel, Divider, Thead, Tbody, Tr, Th, Td, Flex, IconButton, Input, Button, Card, CardHeader, CardBody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import NetworkError from "../../NotFound/networkError";

export default function Role() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const rolesData = useSelector(selectrolesData);
  const isLoading = useSelector(selectrolesLoading);
  const error = useSelector(selectrolesError);
  const userId = sessionStorage.getItem("userId");

  const [newRoleName, setNewRoleName] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchrolesData());
  }, [dispatch]);

  const handleEditRole = (roleId) => {
    navigate(`/user/roles/edit/${roleId}`);
  };

  const handleDeleteRole = (role) => {
    setSelectedRole(role);
    setDeleteModalOpen(true);
  };

  const confirmDeleteRole = () => {
    if (selectedRole) {
      dispatch(deleterolesData(selectedRole.roleId))
        .then(() => {
          setDeleteModalOpen(false);
          dispatch(fetchrolesData());
        })
        .catch((error) => {
          console.error("Error deleting role:", error);
        });
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedRole(null);
  };

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      const createdBy = userId;
      const permissions = {};
      dispatch(addrolesData({ roleName: newRoleName.trim(), permissions, createdBy }))
        .then(() => {
          setNewRoleName('');
          dispatch(fetchrolesData());
        })
        .catch((error) => {
          console.error("Error adding role:", error);
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
      <Card width="100%" maxW="300px" p={4} borderRadius="md" height="250px">
        <CardHeader>
          <Box fontSize="lg" fontWeight="bold">Role</Box>
        </CardHeader>
        <Divider />
        <CardBody>
          <FormControl isRequired>
            <FormLabel>Name <Box as="span" color="red"></Box></FormLabel>
            <Input
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
      <Card flex="1" p={4} bg="white" borderRadius="md" overflow="auto" css={{
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
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rolesData
                .filter(role => role.status === 'Active')
                .map((role) => (
                  <Tr key={role.roleId} _hover={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)" }}>
                    <Td>{role.roleName}</Td>
                    <Td>
                      <Flex justify="flex-end">
                        <IconButton
                          aria-label="Edit role"
                          icon={<EditIcon />}
                          onClick={() => handleEditRole(role.roleId)}
                          mr={2}
                          colorScheme="blue"
                        />
                        <IconButton
                          aria-label="Delete role"
                          icon={<DeleteIcon />}
                          onClick={() => handleDeleteRole(role)}
                          colorScheme="red"
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
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
