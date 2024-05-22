import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchrolesData, selectrolesData, selectrolesLoading, selectrolesError, updaterolesData } from "../../../app/Slices/roleSlice";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Flex, Spinner, Button } from '@chakra-ui/react';
import NetworkError from "../../NotFound/networkError";

export default function Role() {
  const dispatch = useDispatch();

  const rolesData = useSelector(selectrolesData);
  const rolesLoading = useSelector(selectrolesLoading);
  const rolesError = useSelector(selectrolesError);

  useEffect(() => {
    dispatch(fetchrolesData());
  }, [dispatch]);

  const [rolePermissions, setRolePermissions] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [changedRows, setChangedRows] = useState([]);
  const [Loading, setLoading] = useState(false)

  useEffect(() => {
    if (rolesData && rolesData.data && rolesData.data.length > 0) {
      const initialPermissions = rolesData.data.map(role => {
        const permissions = JSON.parse(role.permissions);
        return {
          roleId: role.roleId,
          roleName: role.roleName,
          permissions: {
            create: permissions.create,
            read: permissions.read,
            update: permissions.update,
            delete: permissions.delete,
          },
        };
      });
      setRolePermissions(initialPermissions);
    }
  }, [rolesData]);

  useEffect(() => {
    const changedRowsIds = rolePermissions.reduce((acc, role) => {
      const originalRole = rolesData.data.find(original => original.roleId === role.roleId);
      if (JSON.stringify(role.permissions) !== originalRole.permissions) {
        acc.push(role.roleId);
      }
      return acc;
    }, []);
    setChangedRows(changedRowsIds);
    setIsChanged(changedRowsIds.length > 0);
  }, [rolesData, rolePermissions]);

  if (rolesLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (rolesError) {
    return <NetworkError />;
  }

  const handleSelectPermission = (roleId, permissionType) => {
    setRolePermissions(prevState => {
      const updatedPermissions = prevState.map(role => {
        if (role.roleId === roleId) {
          const updatedRole = { ...role, permissions: { ...role.permissions, [permissionType]: !role.permissions[permissionType] } };
          return updatedRole;
        }
        return role;
      });
      return updatedPermissions;
    });
  };

  const handleSaveChanges = (roleId) => {
    const role = rolePermissions.find(role => role.roleId === roleId);
    if (role) {
      const { roleId: id, ...roleDataWithoutId } = role;
      const roleDataWithStringPermissions = {
        roleId: id,
        ...roleDataWithoutId,
        permissions: JSON.stringify(roleDataWithoutId.permissions),
      };
      setLoading(true);
      dispatch(updaterolesData(roleDataWithStringPermissions))
        .then(() => {
          dispatch(fetchrolesData());
          setLoading(false);
          setIsChanged(false);
        })
        .catch((error) => {
          console.error("Error updating role:", error);
        });
    }
  };

  return (
    <Box mt={10} ml="5%" mr="5%" bg="white" p={4} borderRadius="md" overflow="auto" css={{
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
      <Table variant="simple">
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
                <Button
                  isLoading={Loading}
                  colorScheme="blue"
                  onClick={() => { role.roleId && handleSaveChanges(role.roleId); }}
                  disabled={!changedRows.includes(role.roleId)}
                  style={{ backgroundColor: changedRows.includes(role.roleId) ? 'blue' : 'grey' }}
                >
                  Save
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
