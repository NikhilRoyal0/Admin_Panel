import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchrolesData, selectrolesData, selectrolesLoading, selectrolesError, updaterolesData } from "../../../app/Slices/roleSlice";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Button } from '@chakra-ui/react';

export default function Role() {
  const dispatch = useDispatch();

  const rolesData = useSelector(selectrolesData);
  const rolesLoading = useSelector(selectrolesLoading);
  const rolesError = useSelector(selectrolesError);
  
  useEffect(() => {
    dispatch(fetchrolesData());
  }, [dispatch]);
  
  const [rolePermissions, setRolePermissions] = useState([]);

  useEffect(() => {
    if (rolesData && rolesData.data && rolesData.data.length > 0) {
      const initialPermissions = rolesData.data.map(role => ({
        roleId: role.roleId,
        roleName: role.roleName,
        permissions: {
          create: role.permissions.create,
          read: role.permissions.read,
          update: role.permissions.update,
          delete: role.permissions.delete,
        },
      }));
      setRolePermissions(initialPermissions);
    }
  }, [rolesData]);

  if (rolesLoading) {
    return <div>Loading...</div>;
  }

  if (rolesError) {
    return <div>Error: {rolesError}</div>;
  }

  const handleSelectPermission = (roleId, permissions) => {
    setRolePermissions(prevState => {
      const updatedPermissions = prevState.map(role => {
        if (role.roleId === roleId) {
          const updatedRole = { ...role, permissions: { ...role.permissions, [permissions]: !role.permissions[permissions] } };
          return updatedRole;
        }
        return role;
      });
      return updatedPermissions;
    });
  };

  const handleSaveChanges = (roleId) => {
    const role = rolePermissions.find(role => role.roleId === roleId);
    if (role && role.permissions) {
      const updatedPermissions = Object.keys(role.permissions).reduce((acc, key) => {
        acc[key] = role.permissions[key] || false;
        return acc;
      }, {});
      dispatch(updaterolesData(role.roleId, { roleName: role.roleName, permissions: JSON.stringify(updatedPermissions) }));
    }
  };

  return (
    <Box mt={10} ml="5%" mr="5%" bg="white" p={4} borderRadius="md" overflow="auto">
      <Table variant="simple" >
        <Thead>
          <Tr>
            <Th>Role</Th>
            <Th>Create</Th>
            <Th>Read</Th>
            <Th>Update</Th>
            <Th>Delete</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rolesData.data && rolesData.data.map((role, index) => (
            <Tr key={role.roleId} style={{ marginBottom: index < rolesData.data.length - 1 ? '8px' : '0' }} _hover={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)" }}>
              <Td>{role.roleName}</Td>
              <Td>
                <Checkbox isChecked={rolePermissions.find(item => item.roleId === role.roleId)?.permissions.create} onChange={() => handleSelectPermission(role.roleId, 'create')} colorScheme="blue" />
              </Td>
              <Td>
                <Checkbox isChecked={rolePermissions.find(item => item.roleId === role.roleId)?.permissions.read} onChange={() => handleSelectPermission(role.roleId, 'read')} colorScheme="blue" />
              </Td>
              <Td>
                <Checkbox isChecked={rolePermissions.find(item => item.roleId === role.roleId)?.permissions.update} onChange={() => handleSelectPermission(role.roleId, 'update')} colorScheme="blue" />
              </Td>
              <Td>
                <Checkbox isChecked={rolePermissions.find(item => item.roleId === role.roleId)?.permissions.delete} onChange={() => handleSelectPermission(role.roleId, 'delete')} colorScheme="blue" />
              </Td>
              <Td>
                <Button colorScheme="blue" onClick={() => handleSaveChanges(role.roleId)}>Save</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
