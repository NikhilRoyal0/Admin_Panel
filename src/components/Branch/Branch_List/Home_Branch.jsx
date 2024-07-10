import React, { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Select,
  Text,
  Flex,
  SimpleGrid,
  Input,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Divider,
  useToast,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchBranchData,
  selectBranchData,
  selectBranchLoading,
  selectBranchError,
  updateBranchData,
} from "../../../app/Slices/branchSlice";
import { useSelector, useDispatch } from "react-redux";
import NetworkError from "../../NotFound/networkError";
import {
  fetchStudentData,
  selectStudentData,
  selectStudentError,
  selectStudentLoading,
} from "../../../app/Slices/studentSlice";
import Planner from "../Planner/Planner";
import { FaUserGraduate } from "react-icons/fa";
import { SiCoursera } from "react-icons/si";
import {
  selectcourseData,
  selectcourseError,
  selectcourseLoading,
  fetchcourseData,
} from "../../../app/Slices/courseSlice";
import {
  fetchrolesData,
  selectrolesData,
  selectrolesError,
  selectrolesLoading,
} from "../../../app/Slices/roleSlice";
import TimeConversion from "../../../utils/timeConversion";
import { getModulePermissions } from "../../../utils/permissions";

export default function Home_Branch() {
  const { branchId } = useParams();
  const BranchData = useSelector(selectBranchData);
  const courseData = useSelector(selectcourseData);
  const courseError = useSelector(selectcourseError);
  const courseLoading = useSelector(selectcourseLoading);
  const StudentData = useSelector(selectStudentData);
  const studentLoading = useSelector(selectStudentLoading);
  const studentError = useSelector(selectStudentError);
  const roleData = useSelector(selectrolesData);
  const roleError = useSelector(selectrolesError);
  const roleLoading = useSelector(selectrolesLoading);
  const isLoading = useSelector(selectBranchLoading);
  const error = useSelector(selectBranchError);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Toast = useToast();
  const [isEditable, setIsEditable] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [formData, setFormData] = useState({
    branchName: "",
    branchAdmin: "",
    branchAddress: "",
    status: "",
    branchPassword: "",
    branchEmail: "",
    branchPhone: "",
    walletAmount: "",
    commission: "",
    role: "",
    updatedOn: Date.now(),
  });

  useEffect(() => {
    dispatch(fetchBranchData());
    dispatch(fetchStudentData());
    dispatch(fetchcourseData());
    dispatch(fetchrolesData());
  }, [dispatch]);

  useEffect(() => {
    if (BranchData.length > 0) {
      const selectedBranch = BranchData.find(
        (branch) => branch.branchId == branchId
      );
      if (selectedBranch) {
        setFormData({
          branchName: selectedBranch.branchName,
          branchAdmin: selectedBranch.branchAdmin,
          branchAddress: selectedBranch.branchAddress,
          status: selectedBranch.status,
          branchPassword: selectedBranch.branchPassword,
          branchEmail: selectedBranch.branchEmail,
          branchPhone: selectedBranch.branchPhone,
          walletAmount: selectedBranch.walletAmount,
          commission: selectedBranch.commission,
          role: selectedBranch.role,
          updatedOn: Date.now(),
        });
      }
    }
  }, [BranchData, branchId]);

  if (isLoading || roleLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error || roleError) {
    return <NetworkError />;
  }

  if (courseLoading || studentLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (courseError || studentError) {
    return <NetworkError />;
  }

  const handleEditToggle = () => {
    if (isEditable) {
      handleUpdateBranch();
    } else {
      setIsEditable(!isEditable);
    }
  };

  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    setSelectedCourses((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((item) => item !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };

  const handleCancel = () => {
    setIsEditable(false);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
          title: "Failed to update Branch",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const handleCourses = (branchId) => {
    navigate(`/courses/${branchId}`);
  };

  const selectedCourse = courseData.filter(
    (course) => course.branchId === branchId
  ).length;

  const selectedBranch = BranchData.find(
    (branch) => branch.branchId === branchId
  );

  if (!selectedBranch) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const filteredStudents = StudentData.filter((student) => {
    const matchBranchId = student.branchId === branchId;
    const searchString = searchInput ? searchInput.toLowerCase() : "";
    return (
      matchBranchId &&
      ((student.admissionNo &&
        student.admissionNo.toLowerCase().includes(searchString)) ||
        (student.email && student.email.toLowerCase().includes(searchString)) ||
        (student.studentName &&
          student.studentName.toLowerCase().includes(searchString)))
    );
  });

  const filteredStudentsCount = StudentData.filter(
    (student) => student.branchId === branchId
  ).length;

  const branchManagementPermissions = getModulePermissions("Branch");

  if (!branchManagementPermissions) {
    return <NetworkError />;
  }

  const canEditBranch = branchManagementPermissions.update;

  return (
    <Flex p="4" mt={2} direction={{ base: "column", md: "row" }}>
      <Box
        bg="white"
        boxShadow="md"
        p="4"
        borderRadius="md"
        w={{ base: "100%", md: "50%" }}
        height="1070px"
        overflow="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e0",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#a0aec0",
          },
        }}
      >
        <Flex justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold">
            Branch Details
          </Text>
          <Flex>
            {isEditable && (
              <Button mr={2} onClick={handleCancel} colorScheme="red">
                Cancel
              </Button>
            )}
            <Button
              onClick={() => {
                if (canEditBranch) {
                  handleEditToggle();
                } else {
                  Toast({
                    title: "You don't have permission to edit branch",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                  });
                }
              }}
              colorScheme="teal"
            >
              {isEditable ? "Save" : "Edit"}
            </Button>
          </Flex>
        </Flex>
        <Divider my="4" />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel>Branch Name</FormLabel>
            <Input
              name="branchName"
              value={formData.branchName}
              onChange={handleFormChange}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontWeight="bold">Branch Admin</FormLabel>
            <Input
              name="branchAdmin"
              value={formData.branchAdmin}
              onChange={handleFormChange}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch Address</FormLabel>
            <Input
              name="branchAddress"
              value={formData.branchAddress}
              onChange={handleFormChange}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Status</FormLabel>
            {isEditable ? (
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                bg="white"
                isRequired
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Disabled">Disabled</option>
                <option value="NeedKyc">Need KYC</option>
              </Select>
            ) : (
              <Input
                value={formData.status || selectedBranch.status}
                isDisabled
                bg="gray.100"
              />
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Branch IP</FormLabel>
            <Input
              name="branchIp"
              value={formData.branchIp}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch Password</FormLabel>
            <Input
              name="branchPassword"
              value={formData.branchPassword}
              onChange={handleFormChange}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch Email</FormLabel>
            <Input
              name="branchEmail"
              value={formData.branchEmail}
              onChange={handleFormChange}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch Phone</FormLabel>
            <Input
              name="branchPhone"
              value={formData.branchPhone}
              onChange={handleFormChange}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Wallet Amount</FormLabel>
            <Input
              name="walletAmount"
              value={formData.walletAmount}
              onChange={handleFormChange}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Commission</FormLabel>
            <Input
              name="commission"
              value={formData.commission}
              onChange={handleFormChange}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Role</FormLabel>
            <Select
              mb="3"
              name="role"
              placeholder="Select Role"
              value={formData.role}
              onChange={handleFormChange}
              isRequired
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            >
              {roleData.map((role) => (
                <option key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Updated On</FormLabel>
            <Input
              name="updatedOn"
              value={TimeConversion.unixTimeToRealTime(formData.updatedOn)}
              onChange={handleFormChange}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Created On</FormLabel>
            <Input
              name="createdOn"
              value={TimeConversion.unixTimeToRealTime(
                selectedBranch.createdOn
              )}
              isDisabled
              bg="gray.100"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Primary Device Id</FormLabel>
            <Input
              name="primaryDeviceId"
              value={selectedBranch.primaryDeviceId}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Device Ids</FormLabel>
            <Input
              name="deviceIds"
              value={selectedBranch.deviceIds}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Last Active At</FormLabel>
            <Input
              name="lastActiveAt"
              value={TimeConversion.unixTimeToRealTime(
                selectedBranch.lastActiveAt
              )}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Reason</FormLabel>
            <Input
              name="reason"
              value={formData.reason}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch Users</FormLabel>
            <Input
              name="branchUsers"
              value={selectedBranch.branchUsers}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Branch Media</FormLabel>
            <Input
              name="branchMedia"
              value={selectedBranch.branchMedia}
              isDisabled={!isEditable}
              bg={isEditable ? "white" : "gray.100"}
            />
          </FormControl>
        </SimpleGrid>
      </Box>
      <Box
        w={{ base: "100%", md: "50%" }}
        pl={{ md: "2" }}
        mt={{ base: 4, md: 0 }}
      >
        <Flex direction={{ base: "column", md: "row" }} mb="4">
          <Box flex="1" mr={{ base: "0", md: "4" }} mb={{ base: "4", md: "0" }}>
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
                <Text
                  fontSize="20px"
                  fontWeight="bold"
                  mt="4"
                  textAlign="center"
                >
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
                <Text
                  fontSize="20px"
                  fontWeight="bold"
                  mt="4"
                  textAlign="center"
                  onClick={() => handleCourses(branchId)}
                  cursor="pointer"
                >
                  Total Courses
                </Text>
                <Text fontSize="25px" mt="2" fontWeight="bold" color="#4a5568">
                  {selectedCourse}
                </Text>
              </Box>
            </SimpleGrid>
          </Box>
          <Box flex="1" overflow="auto">
            <Box
              bg="white"
              boxShadow="md"
              p="4"
              borderRadius="md"
              overflow="auto"
              height="340px"
              width="100%"
              css={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                  height: "8px",
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#cbd5e0",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#a0aec0",
                },
              }}
            >
              <Planner />
            </Box>
          </Box>
        </Flex>

        <Box
          bg="white"
          boxShadow="md"
          p="4"
          borderRadius="md"
          overflow="auto"
          height="715px"
          css={{
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cbd5e0",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#a0aec0",
            },
          }}
        >
          <Text fontSize="2xl" fontWeight="bold" mb="4">
            Students
          </Text>
          <Flex mb="4" justify="flex-end">
            <Input
              placeholder="Search student..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Flex>
          {filteredStudents.length === 0 ? (
            <Flex justify="center" align="center" height="80%">
              <Box textAlign="center">
                <Text fontSize="xl" fontWeight="bold">
                  No student available
                </Text>
              </Box>
            </Flex>
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
