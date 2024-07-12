import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  GridItem,
  Table,
  Thead,
  Badge,
  Tbody,
  Heading,
  Tr,
  Th,
  Td,
  Image,
  Flex,
  Spinner,
  Text,
  IconButton,
  Input,
  useToast,
  Stack,
  Tooltip,
  Checkbox,
  Select,
  Avatar,
  Button,
} from "@chakra-ui/react";
import {
  fetchStudentData,
  selectStudentData,
  selectStudentError,
  selectStudentLoading,
  updateStudentData,
} from "../../../app/Slices/studentSlice";
import {
  selectBranchData,
  selectBranchError,
  selectBranchLoading,
  fetchBranchData,
} from "../../../app/Slices/branchSlice";
import {
  selectstudentWalletData,
  selectstudentWalletError,
  selectstudentWalletLoading,
  fetchstudentWalletData,
} from "../../../app/Slices/studentWalletSlice";
import {
  selectrolesData,
  selectrolesError,
  selectrolesLoading,
  fetchrolesData,
} from "../../../app/Slices/roleSlice";
import {
  selectcourseData,
  selectcourseError,
  selectcourseLoading,
  fetchcourseData,
} from "../../../app/Slices/courseSlice";
import { useNavigate, useParams } from "react-router-dom";
import fallbackImage from "../../../assets/images/StudentImage.png";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { getModulePermissions } from "../../../utils/permissions";
import NetworkError from "../../NotFound/networkError";
import TimeConversion from "../../../utils/timeConversion";
import CourseSelect from "../../Inquiry/CourseSelect";

export default function StudentDashboard() {
  const branchId = sessionStorage.getItem("BranchId");
  const navigate = useNavigate();
  const { student_id } = useParams();
  const dispatch = useDispatch();
  const studentData = useSelector(selectStudentData);
  const branchData = useSelector(selectBranchData);
  const branchError = useSelector(selectBranchError);
  const branchLoading = useSelector(selectBranchLoading);
  const transData = useSelector(selectstudentWalletData);
  const transError = useSelector(selectstudentWalletError);
  const transLoading = useSelector(selectstudentWalletLoading);
  const roleData = useSelector(selectrolesData);
  const roleError = useSelector(selectrolesError);
  const roleLoading = useSelector(selectrolesLoading);
  const courseData = useSelector(selectcourseData);
  const courseError = useSelector(selectcourseLoading);
  const courseLoading = useSelector(selectcourseLoading);
  const error = useSelector(selectStudentError);
  const isLoading = useSelector(selectStudentLoading);
  const Toast = useToast({
    position: "top-right",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    password: "",
    role: "",
    updatedOn: "",
    status: "",
    branchId: "",
    handledBy: "",
    currentCourseId: "",
    walletAmount: "",
    referCode: "",
    parentCode: "",
    primaryAddress: "",
    state: "",
    city: "",
    interestIn: "",
    admissionNo: "",
    profilePhoto: "",
    courses: "[]",
    paymentMethods: "[]",
    qualifications: "[]",
    referredBy: "",
  });

  useEffect(() => {
    dispatch(fetchStudentData());
    dispatch(fetchBranchData());
    dispatch(fetchstudentWalletData());
    dispatch(fetchrolesData());
    dispatch(fetchcourseData());
  }, [dispatch]);

  useEffect(() => {
    if (studentData.length > 0) {
      const selectedStudent = studentData.find(
        (student) => student.student_id === student_id
      );
      if (selectedStudent) {
        setFormData(selectedStudent);
      }
    }
  }, [studentData, student_id]);

  const BranchData = branchData.filter((branch) => branch.status == "Active");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    const selectedStudent = studentData.find(
      (student) => student.student_id === student_id
    );
    setFormData(selectedStudent);
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    const updatedFormData = {
      ...formData,
      updatedOn: Date.now(),
    };
    dispatch(updateStudentData(student_id, updatedFormData))
      .then(() => {
        dispatch(fetchStudentData());
        setIsEditing(false);
        Toast({
          title: "Student updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to update Student",
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

  const handleViewAll = () => {
    navigate(`/student/dashboard/alltransaction/${student_id}`);
  };

  if (
    isLoading ||
    branchLoading ||
    transLoading ||
    roleLoading ||
    courseLoading
  ) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error || branchError || transError || roleError || courseError) {
    return <NetworkError />;
  }

  if (!formData) {
    return null;
  }

  const studentManagementPermissions = getModulePermissions("Students");
  if (!studentManagementPermissions) {
    return <NetworkError />;
  }
  const canEditData = studentManagementPermissions.update;

  const toDoList = [
    { id: 1, task: "Task 1", isChecked: false },
    { id: 2, task: "Task 2", isChecked: true },
    { id: 3, task: "Task 3", isChecked: false },
    { id: 4, task: "Task 4", isChecked: false },
    { id: 5, task: "Task 5", isChecked: true },
    { id: 6, task: "Task 6", isChecked: true },
  ];

  const transactions = transData.filter(
    (student) => student.student_id === student_id
  );
  const transactionsToShow = transactions.slice(0, 5);
  const coursesData =
    branchId == 0
      ? courseData
      : courseData.filter((course) => course.branchId == branchId);

  return (
    <Box p="4" maxHeight="auto">
      <Box
        bg="white"
        boxShadow="md"
        borderRadius="md"
        p="4"
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
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(2, 1fr)",
            xl: "repeat(3, 1fr)",
          }}
          gap={6}
        >
          {/* Left Cards */}
          <GridItem colSpan={2}>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(2, 1fr)",
              }}
              gap={6}
            >
              {/* First Card */}
              <GridItem colSpan={1}>
                <Box
                  p="4"
                  color="black"
                  bgGradient="linear(to-b, blue.500 36%, blue.50 36%)"
                  boxShadow="md"
                  borderRadius="md"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  mb={10}
                  maxHeight={450}
                >
                  <Box
                    bg="white"
                    borderRadius="full"
                    overflow="hidden"
                    boxSize="120px"
                    marginBottom="10"
                    marginTop={10}
                  >
                    <Image
                      src={formData.profilePhoto}
                      alt="Fallback"
                      objectFit="cover"
                      boxSize="100%"
                      onError={(e) => (e.target.src = fallbackImage)}
                    />
                  </Box>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    textAlign="center"
                    color="black"
                  >
                    {formData.studentName}
                  </Text>
                  <Text textAlign="center" color="gray.500" mt="2">
                    Admission No: {formData.admissionNo}
                  </Text>
                  <Flex justify="space-between" mt="4" width="80%">
                    <Box>
                      <Text fontWeight="bold" textAlign="center" color="black">
                        Wallet Amount
                      </Text>
                      <Text textAlign="center">
                        Rs. {formData.walletAmount}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" textAlign="center" color="black">
                        Total Courses
                      </Text>
                      <Text textAlign="center">
                        {JSON.parse(formData.courses).length}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </GridItem>

              {/* Third Card */}
              <GridItem colSpan={1}>
                <Box
                  p="4"
                  bg="blue.50"
                  boxShadow="md"
                  borderRadius="md"
                  height="100%"
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
                  <Stack spacing={3} align="stretch">
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                      Your Todo
                    </Text>
                    {toDoList.map((task) => (
                      <Tooltip key={task.id} label={task.task} placement="top">
                        <Box p={3} bg="white" borderRadius="md" boxShadow="md">
                          <Flex alignItems="center">
                            <Checkbox
                              isChecked={task.isChecked}
                              onChange={() => console.log("Checkbox clicked")}
                            />
                            <Text
                              ml={3}
                              textDecoration={
                                task.isChecked ? "line-through" : "none"
                              }
                            >
                              {task.task}
                            </Text>
                          </Flex>
                        </Box>
                      </Tooltip>
                    ))}
                  </Stack>
                </Box>
              </GridItem>

              {/* Fourth Card */}
              <GridItem colSpan={1}>
                <Box
                  p="4"
                  bg="blue.50"
                  boxShadow="md"
                  borderRadius="md"
                  height="100%"
                  maxHeight={500}
                  overflow="auto"
                >
                  <Box mt="4" mb="4" fontSize="xl" fontWeight="bold">
                    Your Courses
                  </Box>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Course</Th>
                        <Th>Price</Th>
                        <Th>Duration</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {JSON.parse(formData.courses).map((course, index) => (
                        <Tr key={index}>
                          <Td>{course.courseName}</Td>
                          <Td>{course.price}</Td>
                          <Td>{course.duration}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </GridItem>

              {/* Fifth Card */}
              <GridItem colSpan={1}>
                <Box
                  p="4"
                  bg="blue.50"
                  boxShadow="md"
                  borderRadius="md"
                  maxHeight={500}
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
                  <Box mb="5" fontSize="xl" fontWeight="bold">
                    <Flex alignItems="center" justifyContent="space-between">
                      <Heading fontSize={25} mb={5}>
                        Your Transfer
                      </Heading>
                      {transactions.length < 6 && (
                        <Button
                          onClick={handleViewAll}
                          variant="link"
                          color="blue.500"
                          mt="-5"
                        >
                          Add Transaction
                        </Button>
                      )}
                    </Flex>
                    {transactionsToShow.length === 0 ? (
                      <Flex justify="center" align="center" height="100%">
                        <Box textAlign="center" mt={50}>
                          <Text fontSize="xl" fontWeight="bold">
                            No transaction available
                          </Text>
                        </Box>
                      </Flex>
                    ) : (
                      <>
                        {transactionsToShow.map((transaction, index) => {
                          const student = studentData.find(
                            (student) =>
                              student.student_id === transaction.student_id
                          );
                          return (
                            <Flex
                              key={transaction.trans_id}
                              alignItems="center"
                              mb="3"
                            >
                              <Avatar
                                src={
                                  student ? student.profilePhoto : fallbackImage
                                }
                                mr="4"
                              />
                              <Box>
                                <Text fontWeight="bold">
                                  {student
                                    ? student.studentName
                                    : "Unknown Student"}
                                </Text>
                                <Text>
                                  {TimeConversion.unixTimeToRealTime(
                                    transaction.createdOn
                                  )}
                                </Text>
                              </Box>
                              <Badge
                                ml="auto"
                                colorScheme={
                                  transaction.type === "credit"
                                    ? "green"
                                    : "red"
                                }
                                fontSize="md"
                                borderRadius="8"
                              >
                                {transaction.type === "credit"
                                  ? `+${transaction.amount}`
                                  : `-${transaction.amount}`}
                              </Badge>
                            </Flex>
                          );
                        })}
                        {transactions.length > 5 && (
                          <Button
                            onClick={handleViewAll}
                            variant="link"
                            color="blue.500"
                            mt="3"
                          >
                            View All
                          </Button>
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              </GridItem>
            </Grid>
          </GridItem>

          {/* Right Card */}
          <GridItem colSpan={1}>
            <Box
              p="4"
              bg="blue.50"
              boxShadow="md"
              borderRadius="md"
              height="auto"
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
              <Box
                mb="4"
                fontSize="xl"
                fontWeight="bold"
                display="flex"
                justifyContent="space-between"
              >
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
                        handleEditClick();
                      } else {
                        Toast({
                          title: "You don't have permission to edit student",
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                          position: "top-right",
                        });
                      }
                    }}
                  />
                )}
              </Box>
              <Box>
                <Box mb="2">
                  <strong>Student Name: </strong>
                  <Input
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  />
                </Box>
                <Box mb="2">
                  <strong>Email: </strong>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  />
                </Box>
                <Box mb="2">
                  <strong>Password: </strong>
                  <Input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  />
                </Box>
                <Box mb="2">
                  <strong>Status: </strong>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Disabled">Disabled</option>
                    <option value="NeedKyc">NeedKyc</option>
                  </Select>
                </Box>
                <Box mb="2">
                  <strong>Branch: </strong>
                  <Select
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  >
                    {BranchData &&
                      BranchData.map((branch) => (
                        <option key={branch.branchId} value={branch.branchId}>
                          {branch.branchName}
                        </option>
                      ))}
                  </Select>
                </Box>
                <Box mb="2">
                  <strong>Role: </strong>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  >
                    {roleData &&
                      roleData.map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </option>
                      ))}
                  </Select>
                </Box>
                <Box mb="2">
                  <strong>Handled By: </strong>
                  <Input
                    name="handledBy"
                    value={formData.handledBy}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  />
                </Box>
                <Box mb="2">
                  <strong>Current Course ID: </strong>
                  <Input
                    name="currentCourseId"
                    value={formData.currentCourseId}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  />
                </Box>
                <Box mb="2">
                  <strong>Wallet Amount: </strong>
                  <Input
                    name="walletAmount"
                    value={formData.walletAmount}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  />
                </Box>
                <Box mb="2">
                  <strong>Refer Code: </strong>
                  <Input
                    name="referCode"
                    value={formData.referCode}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  />
                </Box>
                <Box mb="2">
                  <strong>Parent Code: </strong>
                  <Input
                    name="parentCode"
                    value={formData.parentCode}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  />
                </Box>
                <Box mb="2">
                  <strong>Primary Address: </strong>
                  <Input
                    name="primaryAddress"
                    value={formData.primaryAddress}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  />
                </Box>
                <Box mb="2">
                  <strong>State: </strong>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  />
                </Box>
                <Box mb="2">
                  <strong>City: </strong>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  />
                </Box>
                <Box mb="2">
                  <strong>Interest In: </strong>
                  <Input
                    name="interestIn"
                    value={formData.interestIn}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  />
                </Box>
                <Box mb="2">
                  <strong>Profile Photo: </strong>
                  <Input
                    name="profilePhoto"
                    value={formData.profilePhoto}
                    onChange={handleChange}
                    ml="2"
                    size="sm"
                    readOnly={!isEditing}
                  />
                </Box>
                <Box mb="2">
                  <CourseSelect
                    formData={formData}
                    setFormData={setFormData}
                    isEditing={isEditing}
                    coursesData={coursesData}
                  />
                </Box>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
