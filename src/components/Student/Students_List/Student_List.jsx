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
  Grid,
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
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import {
  fetchStudentData,
  selectStudentData,
  selectStudentLoading,
  selectStudentError,
  AddStudentData,
  deleteStudentData,
} from "../../../app/Slices/studentSlice";
import {
  selectBranchData,
  selectBranchError,
  selectBranchLoading,
  fetchBranchData,
} from "../../../app/Slices/branchSlice";
import {
  selectrolesData,
  selectrolesError,
  selectrolesLoading,
  fetchrolesData,
} from "../../../app/Slices/roleSlice";
import NetworkError from "../../NotFound/networkError";
import { getModulePermissions } from "../../../utils/permissions";
import { useNavigate } from "react-router-dom";
import passwordGenerator from "../../../utils/passwordGenerator";

export default function Student_List() {
  const branchId = sessionStorage.getItem("BranchId");
  const navigate = useNavigate();
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedstudent_id, setSelectedstudent_id] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newStudentData, setNewStudentData] = useState({
    studentName: "",
    email: "",
    password: "",
    role: "",
    createdOn: Date.now(),
    status: "",
    branchId: "",
    handledBy: "",
    currentCourseId: "",
    walletAmount: 0,
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

  const StudentData = useSelector(selectStudentData);
  const roleData = useSelector(selectrolesData);
  const roleLoading = useSelector(selectrolesLoading);
  const roleError = useSelector(selectrolesError);
  const branchData = useSelector(selectBranchData);
  const branchLoading = useSelector(selectBranchLoading);
  const branchError = useSelector(selectBranchError);
  const isLoading = useSelector(selectStudentLoading);
  const error = useSelector(selectStudentError);
  const dispatch = useDispatch();
  const Toast = useToast({
    position: "top-right",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [StudentsPerPage, setStudentsPerPage] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredCount, setFilteredCount] = useState(0);

  useEffect(() => {
    dispatch(fetchStudentData());
    dispatch(fetchBranchData());
    dispatch(fetchrolesData());
  }, [dispatch]);

  const DataByBranch =
    branchId == 0
      ? StudentData
      : StudentData.filter((user) => user.branchId == branchId);

  useEffect(() => {
    const filteredStudents = DataByBranch.filter((student) => {
      return selectedStatus ? student.status === selectedStatus : true;
    });
    setFilteredCount(filteredStudents.length);
  }, [selectedStatus, StudentData]);

  const BranchData = branchData.filter((branch) => branch.status == "Active");

  const handleAddStudent = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData2 = new FormData();
    formData2.append("studentName", newStudentData.studentName);
    formData2.append("email", newStudentData.email);
    formData2.append("password", passwordGenerator.password());
    formData2.append("role", newStudentData.role);
    formData2.append("createdOn", Date.now());
    formData2.append("status", "NeedKyc");
    formData2.append("branchId", newStudentData.branchId);
    formData2.append("handledBy", newStudentData.handledBy);
    formData2.append("currentCourseId", newStudentData.currentCourseId);
    formData2.append("walletAmount", 0);
    formData2.append("referCode", newStudentData.referCode);
    formData2.append("parentCode", newStudentData.parentCode);
    formData2.append("primaryAddress", newStudentData.primaryAddress);
    formData2.append("state", newStudentData.state);
    formData2.append("city", newStudentData.city);
    formData2.append("interestIn", newStudentData.interestIn);
    formData2.append("admissionNo", newStudentData.admissionNo);
    formData2.append("profilePhoto", newStudentData.profilePhoto);
    formData2.append("courses", "[]");
    formData2.append("paymentMethods", "[]");
    formData2.append("qualifications", "[]");
    formData2.append("referredBy", newStudentData.referredBy);
    dispatch(AddStudentData(formData2))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "Student added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewStudentData({
          studentName: "",
          email: "",
          password: passwordGenerator.password(),
          role: "",
          createdOn: Date.now(),
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
        });
        setIsAddStudentModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to add Student",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deleteStudentData(selectedstudent_id))
      .then(() => {
        dispatch(fetchStudentData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedstudent_id(null);
        setIsSaveLoading(false);
        Toast({
          title: "Student deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete Student",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting Student: ", error);
      });
  };

  const handleViewStudent = (student_id) => {
    navigate(`/student/dashboard/${student_id}`);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
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

  if (roleLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (roleError) {
    return <NetworkError />;
  }

  if (branchLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (branchError) {
    return <NetworkError />;
  }

  const filteredStudent = DataByBranch.filter((student) => {
    const statusMatch = selectedStatus
      ? student.status == selectedStatus
      : true;
    return statusMatch;
  });

  const totalPages = Math.ceil(filteredStudent.length / StudentsPerPage);

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

    // Only render a maximum of 5 page buttons near the current page
    const maxButtonsToShow = 3;
    const startIndex = Math.max(
      Math.ceil(currentPage - (maxButtonsToShow - 1) / 2),
      1
    );
    const endIndex = Math.min(startIndex + maxButtonsToShow - 1, totalPages);

    for (let i = startIndex; i <= endIndex; i++) {
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

    if (startIndex > 1) {
      pageButtons.unshift(
        <Button key="first" onClick={() => paginate(1)} mr={2}>
          &lt;&lt;
        </Button>,
        <Button
          key="ellipsisBefore"
          onClick={() => paginate(startIndex - 1)}
          mr={2}
        >
          ...
        </Button>
      );
    }

    if (endIndex < totalPages) {
      pageButtons.push(
        <Button
          key="ellipsisAfter"
          onClick={() => paginate(endIndex + 1)}
          ml={2}
        >
          ...
        </Button>,
        <Button key="last" onClick={() => paginate(totalPages)} ml={2}>
          &gt;&gt;
        </Button>
      );
    }

    return pageButtons;
  };

  const indexOfLastStudent = currentPage * StudentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - StudentsPerPage;
  const currentStudents = filteredStudent.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const studentManagementPermissions = getModulePermissions("Students");
  if (!studentManagementPermissions) {
    return <NetworkError />;
  }
  const canAddData = studentManagementPermissions.create;
  const canDeleteData = studentManagementPermissions.delete;

  return (
    <Box p="3">
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Student List ({filteredCount})
        </Text>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={3}
          alignItems="center"
        >
          <Select
            placeholder="Filter by Status"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="Inactive">Inactive</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
            <option value="NeedKyc">NeedKyc</option>
          </Select>
          <Button
            mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => {
              if (canAddData) {
                setIsAddStudentModalOpen(true);
              } else {
                Toast({
                  title: "You don't have permission to add student",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                  position: "top-right",
                });
              }
            }}
          >
            Add Student
          </Button>
        </Grid>
      </Flex>
      <Box
        bg="gray.100"
        p="6"
        borderRadius="lg"
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
        {currentStudents.length === 0 ? (
          <Flex justify="center" align="center" height="100%">
            <Box textAlign="center">
              <Text fontSize="xl" fontWeight="bold">
                No student available
              </Text>
            </Box>
          </Flex>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>Student Id</Th>
                <Th>Student Name</Th>
                <Th>Student Email</Th>
                <Th>Branch Id</Th>
                <Th>Current CourseId</Th>
                <Th>City</Th>
                <Th>View/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentStudents.map((Student, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.student_id}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.studentName}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.email}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.branchId}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.currentCourseId}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.city}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="teal"
                        mr="1"
                        onClick={() => {
                          handleViewStudent(Student.student_id);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => {
                          if (canDeleteData) {
                            setSelectedstudent_id(Student.student_id);
                            setIsDeleteConfirmationModalOpen(true);
                          } else {
                            Toast({
                              title:
                                "You don't have permission to delete student",
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
        )}
      </Box>
      <Flex justify="flex-end" mt="4">
        {currentStudents.length > 0 && (
          <Flex justify="flex-end" mt="4">
            {currentPage > 1 && (
              <Button onClick={() => paginate(currentPage - 1)} mr={2}>
                &lt;
              </Button>
            )}
            {renderPagination()}
            {currentPage < totalPages && (
              <Button onClick={() => paginate(currentPage + 1)} mr={2}>
                &gt;
              </Button>
            )}
          </Flex>
        )}
      </Flex>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        size="3xl"
      >
        <ModalOverlay />
        <form onSubmit={handleAddStudent}>
          {" "}
          <ModalContent>
            <ModalHeader>Add Student</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={3}
              >
                <Input
                  mb="3"
                  placeholder="Student Name"
                  value={newStudentData.studentName}
                  onChange={(e) =>
                    setNewStudentData({
                      ...newStudentData,
                      studentName: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="Student Email"
                  value={newStudentData.email}
                  onChange={(e) =>
                    setNewStudentData({
                      ...newStudentData,
                      email: e.target.value,
                    })
                  }
                  isRequired
                />
                <Select
                  mb="3"
                  placeholder="Select Role"
                  value={newStudentData.role}
                  onChange={(e) =>
                    setNewStudentData({
                      ...newStudentData,
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
                  placeholder="Select Branch"
                  value={newStudentData.branchId}
                  onChange={(e) =>
                    setNewStudentData({
                      ...newStudentData,
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
                <Input
                  mb="3"
                  placeholder="Handled By"
                  value={newStudentData.handledBy}
                  onChange={(e) =>
                    setNewStudentData({
                      ...newStudentData,
                      handledBy: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder=" Current CourseId"
                  value={newStudentData.currentCourseId}
                  onChange={(e) =>
                    setNewStudentData({
                      ...newStudentData,
                      currentCourseId: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder=" Refer Code"
                  value={newStudentData.referCode}
                  onChange={(e) =>
                    setNewStudentData({
                      ...newStudentData,
                      referCode: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder=" Parent Code"
                  value={newStudentData.parentCode}
                  onChange={(e) =>
                    setNewStudentData({
                      ...newStudentData,
                      parentCode: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="Primary Address"
                  value={newStudentData.primaryAddress}
                  onChange={(e) =>
                    setNewStudentData({
                      ...newStudentData,
                      primaryAddress: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="State"
                  value={newStudentData.state}
                  onChange={(e) =>
                    setNewStudentData({
                      ...newStudentData,
                      state: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder=" City"
                  value={newStudentData.city}
                  onChange={(e) =>
                    setNewStudentData({
                      ...newStudentData,
                      city: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="Interest In"
                  value={newStudentData.interestIn}
                  onChange={(e) =>
                    setNewStudentData({
                      ...newStudentData,
                      interestIn: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="Profile Photo"
                  value={newStudentData.profilePhoto}
                  onChange={(e) =>
                    setNewStudentData({
                      ...newStudentData,
                      profilePhoto: e.target.value,
                    })
                  }
                  isRequired
                />
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                colorScheme="teal"
                isLoading={isSaveLoading}
                spinner={<BeatLoader size={8} color="white" />}
              >
                Submit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsAddStudentModalOpen(false)}
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
          <ModalBody>Are you sure you want to delete this Student ?</ModalBody>
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
    </Box>
  );
}
