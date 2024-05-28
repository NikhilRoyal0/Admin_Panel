import React, { useEffect, useState } from 'react';
import {
  Box, Spinner, Text, Flex, SimpleGrid, Input, FormControl, FormLabel, Table, Thead, Tbody, Tr, Th, Td, Button, Divider,
  useToast
} from '@chakra-ui/react';
import { useParams } from "react-router-dom";
import {
  fetchBranchData,
  selectBranchData,
  selectBranchLoading,
  selectBranchError,
  updateBranchData,
} from "../../../app/Slices/branchSlice";
import { useSelector, useDispatch } from "react-redux";
import NetworkError from "../../NotFound/networkError";
import { fetchStudentData, selectStudentData } from '../../../app/Slices/studentSlice';
import Planner from '../Planner/Planner';
import { FaUserGraduate } from 'react-icons/fa';
import { SiCoursera } from "react-icons/si";



export default function Home_Branch() {
  const { branchId } = useParams();
  const BranchData = useSelector(selectBranchData);
  const StudentData = useSelector(selectStudentData);
  const isLoading = useSelector(selectBranchLoading);
  const error = useSelector(selectBranchError);
  const dispatch = useDispatch();
  const Toast = useToast()
  const [isEditable, setIsEditable] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [formData, setFormData] = useState({
    branchName: "",
    branchAddress: ""
  });

  useEffect(() => {
    dispatch(fetchBranchData());
    dispatch(fetchStudentData());

  }, [dispatch]);

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

  const handleEditToggle = () => {
    if (isEditable) {
      handleUpdateBranch();
    } else {
      setFormData({
        branchName: selectedBranch.branchName,
        branchAddress: selectedBranch.branchAddress
      });
      setIsEditable(!isEditable);
    }
  };

  const filteredStudents = StudentData.filter(student => {
    const matchBranchId = student.branchId === parseInt(branchId);
    const searchString = searchInput ? searchInput.toLowerCase() : '';
    return matchBranchId && (
      (student.admissionNo && student.admissionNo.toLowerCase().includes(searchString)) ||
      (student.email && student.email.toLowerCase().includes(searchString)) ||
      (student.studentName && student.studentName.toLowerCase().includes(searchString))
    );
  });

  const filteredStudentsCount = StudentData.filter(student => student.branchId === parseInt(branchId)).length;

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateBranch = () => {
    dispatch(updateBranchData(selectedBranch.branchId, formData))
      .then(() => {
        dispatch(fetchBranchData());
        setIsEditable(false);
        Toast({
          title: "Branch updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch(() => {
        Toast({
          title: "Failed to updating Branch",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };


  const selectedBranch = BranchData.find(branch => branch.branchId === parseInt(branchId));

  if (!selectedBranch) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }


  return (
    <Flex p="4" mt={2} direction={{ base: 'column', md: 'row' }}>
      <Box bg="white" boxShadow="md" p="4" borderRadius="md" w={{ base: '100%', md: '50%' }} height="1070px" overflow="auto" css={{
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
        <Flex justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold">Branch Details</Text>
          <Button onClick={handleEditToggle} colorScheme="teal">
            {isEditable ? 'Save' : 'Edit'}
          </Button>
        </Flex>
        <Divider my="4" />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel fontWeight="bold">Branch Id</FormLabel>
            <Input
              value={selectedBranch.branchId}
              isReadOnly
              bg="gray.100"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch Name</FormLabel>
            <Input
              value={formData.branchName || selectedBranch.branchName}
              name="branchName"
              onChange={handleFormChange}
              readOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontWeight="bold">Branch Admin</FormLabel>
            <Input
              value={selectedBranch.branchAdmin}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch Address</FormLabel>
            <Input
              value={formData.branchAddress || selectedBranch.branchAddress}
              name="branchAddress"
              onChange={handleFormChange}
              readOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Status</FormLabel>
            <Input
              value={selectedBranch.status}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch IP</FormLabel>
            <Input
              value={selectedBranch.branchIp}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch Password</FormLabel>
            <Input
              value={selectedBranch.branchPassword}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch Email</FormLabel>
            <Input
              value={selectedBranch.branchEmail}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch Phone</FormLabel>
            <Input
              value={selectedBranch.branchPhone}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Course List</FormLabel>
            <Input
              value={selectedBranch.courseList}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Wallet Amount</FormLabel>
            <Input
              value={selectedBranch.walletAmount}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Commission</FormLabel>
            <Input
              value={selectedBranch.commission}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Role</FormLabel>
            <Input
              value={selectedBranch.role}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Updated On</FormLabel>
            <Input
              value={selectedBranch.updatedOn}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Created On</FormLabel>
            <Input
              value={selectedBranch.createdOn}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Primary Device Id</FormLabel>
            <Input
              value={selectedBranch.primaryDeviceId}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Device Ids</FormLabel>
            <Input
              value={selectedBranch.deviceIds}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Last Active At</FormLabel>
            <Input
              value={selectedBranch.lastActiveAt}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Reason</FormLabel>
            <Input
              value={selectedBranch.reason}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch Users</FormLabel>
            <Input
              value={selectedBranch.branchUsers}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch Media</FormLabel>
            <Input
              value={selectedBranch.branchMedia}
              isReadOnly={!isEditable}
              bg={isEditable ? 'white' : 'gray.100'}
            />
          </FormControl>
        </SimpleGrid>
      </Box>
      <Box w={{ base: '100%', md: '50%' }} pl={{ md: '2' }} mt={{ base: 4, md: 0 }}>
        <Flex mb="4">
          <Box flex="1" mr="4">
            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
              <Box
                bg="white"
                boxShadow="md"
                p="4"
                borderRadius="md"
                height="162px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <FaUserGraduate size={50} color="#3182ce" />
                <Text fontSize="20px" fontWeight="bold" mt="4" textAlign="center">
                  Total Students
                </Text>
                <Text fontSize="25px" mt="2" fontWeight="bold" color="#4a5568">
                  {filteredStudentsCount}
                </Text>
              </Box>
              <Box
                bg="white"
                boxShadow="md"
                p="4"
                borderRadius="md"
                height="162px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <SiCoursera size={50} color="#3182ce" />
                <Text fontSize="20px" fontWeight="bold" mt="4" textAlign="center">
                  Total Courses
                </Text>
                <Text fontSize="25px" mt="2" fontWeight="bold" color="#4a5568">
                  {filteredStudentsCount}
                </Text>
              </Box>
            </SimpleGrid>
          </Box>
          <Box flex="1" overflow="auto" >
            <Box bg="white" boxShadow="md" p="4" borderRadius="md" overflow="auto" height="340px" width="100%"
              css={{
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
              <Planner />
            </Box>
          </Box>
        </Flex>
        <Box bg="white" boxShadow="md" p="4" borderRadius="md" overflow="auto" height="715px" css={{
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
          <Text fontSize="2xl" fontWeight="bold" mb="4">Students</Text>
          <Flex mb="4" justify="flex-end">
            <Input
              placeholder="Search student..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Flex>
          {filteredStudents.length === 0 ? (
            <Text textAlign="center" mt={20} fontSize="xl" fontWeight="bold">
              No Student available
            </Text>
          ) : (
            <Table variant="simple" overflow="auto">
              <Thead>
                <Tr>
                  <Th>Admission No.</Th>
                  <Th>Student Name</Th>
                  <Th>Email</Th>
                  <Th>Primary Address</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredStudents.map((student, index) => (
                  <Tr key={index}>
                    <Td>{student.admissionNo}</Td>
                    <Td>{student.studentName}</Td>
                    <Td>{student.email}</Td>
                    <Td>{student.primaryAddress}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Box>
    </Flex>
  );
}


