import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid, GridItem, Table, Thead, Badge, Tbody, Tr, Th, Td, Image, Flex, Spinner, Text, IconButton, Input, useToast, Stack, Tooltip, Checkbox, Select, Avatar } from '@chakra-ui/react';
import { fetchUsersData, selectUsersData, selectUsersError, selectUsersLoading, updateUserData } from "../../../app/Slices/usersSlice";
import { selectBranchData, selectBranchError, selectBranchLoading, fetchBranchData } from "../../../app/Slices/branchSlice";
import { selectrolesData, selectrolesError, selectrolesLoading, fetchrolesData } from "../../../app/Slices/roleSlice";
import { useParams } from 'react-router-dom';
import fallbackImage from "../../../assets/images/StudentImage.png";
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { getModulePermissions } from "../../../utils/permissions";
import NetworkError from "../../NotFound/networkError";
import TimeConversion from "../../../utils/timeConversion";


export default function View_Users() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector(selectUsersData);
  const branchData = useSelector(selectBranchData);
  const branchError = useSelector(selectBranchError);
  const branchLoading = useSelector(selectBranchLoading);
  const roleData = useSelector(selectrolesData);
  const roleError = useSelector(selectrolesError);
  const roleLoading = useSelector(selectrolesLoading);
  const error = useSelector(selectUsersError);
  const isLoading = useSelector(selectUsersLoading);
  const Toast = useToast({
    position: "top-right",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    dispatch(fetchUsersData());
    dispatch(fetchBranchData());
    dispatch(fetchrolesData());
  }, [dispatch]);

  useEffect(() => {
    if (userData.length > 0) {
      const selectedUser = userData.find(user => user.userId === userId);
      if (selectedUser) {
        setFormData(selectedUser);
      }
    }
  }, [userData, userId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    const selectedUser = userData.find(user => user.userId === userId);
    setFormData(selectedUser);
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    const updatedFormData = {
      ...formData,
      updatedOn: Date.now()
    };
    dispatch(updateUserData(userId, updatedFormData)).then(() => {
      dispatch(fetchUsersData())
      setIsEditing(false);
      Toast({
        title: "User updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to update user",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  if (isLoading || branchLoading || roleLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error || branchError || roleError) {
    return (
      <NetworkError />
    );
  }

  if (!formData) {
    return null;
  }

  const userManagementPermissions = getModulePermissions('Users');
  if (!userManagementPermissions) {
    return <NetworkError />;
  }
  const canEditData = userManagementPermissions.update;

  const transactions = [
    { id: 1, userName: 'John Doe', time: '2024-06-01', amount: 100 },
    { id: 2, userName: 'John Doe', time: '2024-06-02', amount: -50 },
    { id: 3, userName: 'John Doe', time: '2024-06-03', amount: 200 },
    { id: 4, userName: 'John Doe', time: '2024-06-03', amount: -90 },
    { id: 5, userName: 'John Doe', time: '2024-06-03', amount: 200 },
    { id: 6, userName: 'John Doe', time: '2024-06-03', amount: -100 },
    { id: 7, userName: 'John Doe', time: '2024-06-03', amount: 200 },
    { id: 8, userName: 'John Doe', time: '2024-06-03', amount: -200 },
  ];

  const toDoList = [
    { id: 1, task: 'Task 1', isChecked: false },
    { id: 2, task: 'Task 2', isChecked: true },
    { id: 3, task: 'Task 3', isChecked: false },
    { id: 4, task: 'Task 4', isChecked: false },
    { id: 5, task: 'Task 5', isChecked: true },
    { id: 6, task: 'Task 6', isChecked: true },
  ];

  return (
    <Box bg="white" p="4" maxHeight="auto">
      <Box bg="white" boxShadow="md" borderRadius="md" p="4" overflow="auto" css={{
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
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap={6}>
          {/* Left Cards */}
          <GridItem colSpan={2}>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(2, 1fr)" }} gap={6}>
              {/* First Card */}
              <GridItem colSpan={1}>
                <Box p="4" color="black" bgGradient="linear(to-b, blue.500 50%, blue.50 50%)" boxShadow="md" borderRadius="md" display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" mb={10} maxHeight={450}>
                  <Box bg="white" borderRadius="full" overflow="hidden" boxSize="100px" marginBottom="20" >
                    <Image
                      src={formData.profilePhoto}
                      alt="Fallback"
                      objectFit="cover"
                      boxSize="100%"
                      onError={(e) => (e.target.src = fallbackImage)}
                    />
                  </Box>
                  <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="black">
                    {formData.firstName} {formData.lastName}
                  </Text>
                  <Text textAlign="center" color="gray.500" mt="2">
                    Email: {formData.email}
                  </Text>
                  <Flex justify="space-between" mt="4" width="80%">
                    <Box>
                      <Text fontWeight="bold" textAlign="center" color="black">
                        Branch
                      </Text>
                      <Text textAlign="center">
                        {branchData && branchData.find(branch => branch.branchId == formData.branchId)?.branchName}

                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" textAlign="center" color="black">
                        Role
                      </Text>
                      <Text textAlign="center">
                        {roleData && roleData.find(role => role.roleId === formData.role)?.roleName}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </GridItem>

              {/* Third Card */}
              <GridItem colSpan={1}>
                <Box p="4" bg="blue.50" boxShadow="md" borderRadius="md" height="100%" overflow="auto" css={{
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
                  <Stack spacing={3} align="stretch">
                    <Text fontSize="lg" fontWeight="bold" mb={2}>Your Todo</Text>
                    {toDoList.map(task => (
                      <Tooltip key={task.id} label={task.task} placement="top">
                        <Box p={3} bg="white" borderRadius="md" boxShadow="md">
                          <Flex alignItems="center">
                            <Checkbox isChecked={task.isChecked} onChange={() => console.log("Checkbox clicked")} />
                            <Text ml={3} textDecoration={task.isChecked ? 'line-through' : 'none'}>{task.task}</Text>
                          </Flex>
                        </Box>
                      </Tooltip>
                    ))}
                  </Stack>
                </Box>
              </GridItem>

              {/* Fourth Card */}
              <GridItem colSpan={1}>
                <Box p="4" bg="blue.50" boxShadow="md" borderRadius="md" height="100%" maxHeight={500} overflow="auto">
                  <Box mt="4" mb="4" fontSize="xl" fontWeight="bold">
                    Your Courses
                  </Box>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Course</Th>
                        <Th>Grade</Th>
                        <Th>Duration</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Course 1</Td>
                        <Td>A</Td>
                        <Td>4 weeks</Td>
                      </Tr>
                      <Tr>
                        <Td>Course 2</Td>
                        <Td>B</Td>
                        <Td>6 weeks</Td>
                      </Tr>
                      <Tr>
                        <Td>Course 3</Td>
                        <Td>C</Td>
                        <Td>8 weeks</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </GridItem>

              {/* Fifth Card */}
              <GridItem colSpan={1}>
                <Box p="4" bg="blue.50" boxShadow="md" borderRadius="md" maxHeight={500} overflow="auto" css={{
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
                  <Box mb="5" fontSize="xl" fontWeight="bold">
                    Your Transfers
                  </Box>
                  {transactions.map(transaction => (
                    <Flex key={transaction.id} alignItems="center" mb="4">
                      <Avatar src={transaction.profilePhoto} mr="4" />
                      <Box>
                        <Text fontWeight="bold">{transaction.userName}</Text>
                        <Text>{transaction.time}</Text>
                      </Box>
                      <Badge ml="auto" colorScheme={transaction.amount > 0 ? 'green' : 'red'} fontSize="md" borderRadius="8">
                        {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                      </Badge>
                    </Flex>
                  ))}
                </Box>
              </GridItem>

            </Grid>
          </GridItem>

          {/* Right Card */}
          <GridItem colSpan={{ base: 2, md: "3", lg: "2", xl: "1" }}>
            <Box p="4" bg="blue.50" boxShadow="md" borderRadius="md" height="100%" position="relative" overflow="auto" css={{
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
              <Box mb="4" fontSize="xl" fontWeight="bold" display="flex" justifyContent="space-between" >
                Additional Info
                {isEditing ? (
                  <Box>
                    <IconButton
                      aria-label="Save"
                      icon={<CheckIcon />}
                      onClick={handleSaveClick}
                      mr="2"
                    />
                    <IconButton
                      aria-label="Cancel"
                      icon={<CloseIcon />}
                      onClick={handleCancelClick}
                    />
                  </Box>
                ) : (
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    onClick={() => {
                      if (canEditData) {
                        handleEditClick()
                      } else {
                        Toast({
                          title: "You don't have permission to edit user",
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                          position: "top-right",
                        });
                      }
                    }} />
                )}
              </Box>
              <Box>
                <Box mb="2">
                  <strong>First Name: </strong>
                  {isEditing ? (
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      ml="2"
                      size="sm"
                    />
                  ) : (
                    <span>{formData.firstName}</span>
                  )}
                </Box>
                <Box mb="2">
                  <strong>Last Name: </strong>
                  {isEditing ? (
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      ml="2"
                      size="sm"
                    />
                  ) : (
                    <span>{formData.lastName}</span>
                  )}
                </Box>
                <Box mb="2">
                  <strong>Email: </strong>
                  {isEditing ? (
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      ml="2"
                      size="sm"
                    />
                  ) : (
                    <span>{formData.email}</span>
                  )}
                </Box>
                <Box mb="2">
                  <strong>Password: </strong>
                  {isEditing ? (
                    <Input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      ml="2"
                      size="sm"
                    />
                  ) : (
                    <span>{formData.password}</span>
                  )}
                </Box>
                <Box mb="2">
                  <strong>Primary Phone: </strong>
                  {isEditing ? (
                    <Input
                      name="primaryPhone"
                      value={formData.primaryPhone}
                      onChange={handleChange}
                      ml="2"
                      size="sm"
                    />
                  ) : (
                    <span>{formData.primaryPhone}</span>
                  )}
                </Box>
                <Box mb="2">
                  <strong>Secondary Phone: </strong>
                  {isEditing ? (
                    <Input
                      name="secondaryPhone"
                      value={formData.secondaryPhone}
                      onChange={handleChange}
                      ml="2"
                      size="sm"
                    />
                  ) : (
                    <span>{formData.secondaryPhone}</span>
                  )}
                </Box>
                <Box mb="2">
                  <strong>Role: </strong>
                  {isEditing ? (
                    <Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      ml="2"
                      size="sm"
                    >
                      {roleData && roleData.map(role => (
                        <option key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <span>
                      {roleData && roleData.find(role => role.roleId === formData.role)?.roleName}
                    </span>
                  )}
                </Box>
                <Box mb="2">
                  <strong>Status: </strong>
                  {isEditing ? (
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      ml="2"
                      size="sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Disabled">Disabled</option>
                      <option value="NeedKyc">NeedKyc</option>
                    </Select>
                  ) : (
                    <span>{formData.status}</span>
                  )}
                </Box>
                <Box mb="2">
                  <strong>Branch: </strong>
                  {isEditing ? (
                    <Select
                      name="branchId"
                      value={formData.branchId}
                      onChange={handleChange}
                      ml="2"
                      size="sm"
                    >
                      {branchData && branchData.map(branch => (
                        <option key={branch.branchId} value={branch.branchId}>
                          {branch.branchName}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <span>
                      {branchData && branchData.find(branch => branch.branchId == formData.branchId)?.branchName}
                    </span>
                  )}
                </Box>
                <Box mb="2">
                  <strong>Profile Photo: </strong>
                  {isEditing ? (
                    <Input
                      name="profilePhoto"
                      value={formData.profilePhoto}
                      onChange={handleChange}
                      ml="2"
                      size="sm"
                    />
                  ) : (
                    <span>{formData.profilePhoto}</span>
                  )}
                </Box>
              </Box>
            </Box>
          </GridItem>

        </Grid>
      </Box>
    </Box>
  );
}


