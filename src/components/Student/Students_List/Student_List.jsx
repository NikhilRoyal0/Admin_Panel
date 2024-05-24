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
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
  useToast,
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
  updateStudentData,
} from "../../../app/Slices/studentSlice";
import NetworkError from "../../NotFound/networkError";

export default function Student_List() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedstudent_id, setSelectedstudent_id] = useState(null);
  const [editedStudentData, setEditedStudentData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newStudentData, setNewStudentData] = useState({
    studentName: "",
    email: "",
    password: "",
    role: "",
    branchId: "",
    handledBy: "",
    currentCourseId: "",
    primaryAddress: "",
    state: "",
    city: "",
    interestIn: "",
  });

  const StudentData = useSelector(selectStudentData);
  const isLoading = useSelector(selectStudentLoading);
  const error = useSelector(selectStudentError);
  const dispatch = useDispatch();
  const Toast = useToast({
    position: "top-right",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [StudentsPerPage, setStudentsPerPage] = useState(10);


  useEffect(() => {
    dispatch(fetchStudentData());
  }, [dispatch]);

  const handleAddStudent = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("studentName", newStudentData.studentName);
    formData.append("email", newStudentData.email);
    formData.append("password", newStudentData.password);
    formData.append("role", newStudentData.role);
    formData.append("branchId", newStudentData.branchId);
    formData.append("handledBy", newStudentData.handledBy);
    formData.append("currentCourseId", newStudentData.currentCourseId);
    formData.append("primaryAddress", newStudentData.primaryAddress);
    formData.append("state", newStudentData.state);
    formData.append("city", newStudentData.city);
    formData.append("interestIn", newStudentData.interestIn);
    dispatch(AddStudentData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "Student updated/deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewStudentData({
          studentName: "",
          email: "",
          password: "",
          role: "",
          branchId: "",
          handledBy: "",
          currentCourseId: "",
          primaryAddress: "",
          state: "",
          city: "",
          interestIn: "",
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
          title: "Student added/updated successfully",
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

  const handleEditStudent = (Student) => {
    setSelectedstudent_id(Student.bank_id);
    setEditedStudentData(Student);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      email: editedStudentData.email,
      password: editedStudentData.password,
      primaryAddress: editedStudentData.primaryAddress,

    };

    dispatch(updateStudentData(editedStudentData.student_id, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedstudent_id(null);
        dispatch(fetchStudentData());
        setIsSaveLoading(false);
        setNewStudentData({
          studentName: "",
          email: "",
          password: "",
          role: "",
          branchId: "",
          handledBy: "",
          currentCourseId: "",
          primaryAddress: "",
          state: "",
          city: "",
          interestIn: "",
        });
        Toast({
          title: "Student added/updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating Student",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating Student: ", error);
      });
  };

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

  const totalPages = Math.ceil(StudentData.length / StudentsPerPage);

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
    for (let i = 1; i <= totalPages; i++) {
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
    return pageButtons;
  };

  const indexOfLastStudent = currentPage * StudentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - StudentsPerPage;
  const currentStudents = StudentData.slice(indexOfFirstStudent, indexOfLastStudent);


  return (
    <Box p="3" >
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Student List
        </Text>
        <Flex align="center">
          <Button
            mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => setIsAddStudentModalOpen(true)}
          >
            Add Student
          </Button>
        </Flex>
      </Flex>
      <Box bg="gray.100" p="6" borderRadius="lg" overflow="auto" css={{
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
        {currentStudents.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No Student available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>Student Id</Th>
                <Th>Student Name</Th>
                <Th>Student Email</Th>
                <Th>Student Password</Th>
                <Th>Role</Th>
                <Th>Branch Id</Th>
                <Th>Handled By</Th>
                <Th>Current CourseId</Th>
                <Th>Primary Address</Th>
                <Th>State</Th>
                <Th>City </Th>
                <Th>Interest In</Th>
                <Th>Edit/Delete</Th>
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
                    {Student.password}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.role}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.branchId}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.handledBy}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.currentCourseId}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.primaryAddress}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.state}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.city}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Student.interestIn}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="teal"
                        mr="1"
                        onClick={() => handleEditStudent(Student)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => {
                          setSelectedstudent_id(Student.student_id);
                          setIsDeleteConfirmationModalOpen(true);
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
      <Flex justify="center" mt="4">
        <Button onClick={() => paginate(1)} mr={2}>&lt;&lt;</Button>
        <Button onClick={() => paginate(currentPage - 1)} mr={2}>&lt;</Button>
        {renderPagination()}
        <Button onClick={() => paginate(currentPage + 1)} ml={2}>&gt;</Button>
        <Button onClick={() => paginate(totalPages)} ml={2}>&gt;&gt;</Button>
      </Flex>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddStudent}>
          {" "}
          <ModalContent>
            <ModalHeader>Add Student</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form input fields for adding a new Student */}
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
                placeholder="Student email"
                value={newStudentData.email}
                onChange={(e) =>
                  setNewStudentData({
                    ...newStudentData,
                    email: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Student password"
                value={newStudentData.password}
                onChange={(e) =>
                  setNewStudentData({
                    ...newStudentData,
                    password: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Student Email"
                value={newStudentData.role}
                onChange={(e) =>
                  setNewStudentData({
                    ...newStudentData,
                    role: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Branch Id"
                value={newStudentData.branchId}
                onChange={(e) =>
                  setNewStudentData({
                    ...newStudentData,
                    branchId: e.target.value,
                  })
                }
                isRequired
              />
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
                placeholder=" Current CourseId"
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

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Student</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text mb="1" color="gray.600">
                Student Email
              </Text>
              <Input
                mb="3"
                placeholder="Student Email"
                value={editedStudentData?.email || ""}
                onChange={(e) =>
                  setEditedStudentData({
                    ...editedStudentData,
                    email: e.target.value,
                  })
                }
                required
              />
            </Box>
            <Box>
              <Text mb="1" color="gray.600">
                Student Password
              </Text>
              <Input
                mb="3"
                placeholder="Student Password"
                value={editedStudentData?.password || ""}
                onChange={(e) =>
                  setEditedStudentData({
                    ...editedStudentData,
                    password: e.target.value,
                  })
                }
                required
              />
            </Box>
            <Box>
              <Text mb="1" color="gray.600">
                Primary Address
              </Text>
              <Input
                mb="3"
                placeholder="Primary Address"
                value={editedStudentData?.primaryAddress || ""}
                onChange={(e) =>
                  setEditedStudentData({
                    ...editedStudentData,
                    primaryAddress: e.target.value,
                  })
                }
                required
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={handleSaveChanges}
              isLoading={isSaveLoading}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Save Changes
            </Button>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
}
