import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Divider, Heading, Table, Tbody, Td, Th, Thead, Tr, Button, Flex, Spinner, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchrolesData, selectrolesData, updaterolesData, selectrolesError, selectrolesLoading } from '../../../app/Slices/roleSlice';
import NetworkError from "../../NotFound/networkError";

export default function EditRoles() {
    const { roleId } = useParams();
    const dispatch = useDispatch();
    const roleData = useSelector(selectrolesData);
    const loading = useSelector(selectrolesLoading);
    const error = useSelector(selectrolesError);

    const [role, setRole] = useState(null);
    const [roleName, setRoleName] = useState('');
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        dispatch(fetchrolesData());
    }, [dispatch]);

    useEffect(() => {
        if (roleData && roleId) {
            const selectedRole = roleData.find(role => role.roleId == roleId);
            setRole(selectedRole);
            if (selectedRole) {
                setRoleName(selectedRole.roleName);
                setIsActive(selectedRole.isActive);
            }
        }
    }, [roleData, roleId]);

    const toggleCheckbox = () => {
        setIsActive(!isActive);
    };

    const onSave = () => {
        if (role) {
            const updatedRoleData = {
                ...role,
                roleName: roleName,
                isActive: isActive
            };

            dispatch(updaterolesData(updatedRoleData));
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (error) {
        return <NetworkError />;
    }

    if (!role) {
        return <div>No role data available</div>;
    }

    return (
        <Box p="4" ml={4} mr={4} mt={4} bg="white" overflow="auto">
            <Heading mb="4">{roleName}</Heading>
            <Divider mb={5} borderWidth="1px" borderColor="black" />
            <FormControl mb={5}>
                <FormLabel>Role Name</FormLabel>
                <Input 
                    value={roleName} 
                    onChange={(e) => setRoleName(e.target.value)} 
                    placeholder="Enter role name"
                />
            </FormControl>
            <Flex justify="flex-end" mt={4}>
                <Button colorScheme="blue" onClick={onSave}>Save</Button>
            </Flex>
        </Box>
    );
}
