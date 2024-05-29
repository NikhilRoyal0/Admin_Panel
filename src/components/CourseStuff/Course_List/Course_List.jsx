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
  Divider,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import {
  fetchcourseData,
  selectcourseData,
  selectcourseLoading,
  selectcourseError,
  AddcourseData,
  deletecourseData,
} from "../../../app/Slices/courseSlice";
import NetworkError from "../../NotFound/networkError";
import { getModulePermissions } from "../../../utils/permissions";
import { useNavigate } from "react-router-dom";


export default function Course_List() {
  const [isAddcourseModalOpen, setIsAddcourseModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedcourseId, setSelectedcourseId] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newcourseData, setNewcourseData] = useState({
    courseName: "",
    duration: "",
    price: "",
    shortInfo: "",
    longInfo: "",
    createdBy: "",
  });

  const courseData = useSelector(selectcourseData);
  const isLoading = useSelector(selectcourseLoading);
  const error = useSelector(selectcourseError);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Toast = useToast({
    position: "top-right",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [coursePerPage, setcoursePerPage] = useState(10);


  useEffect(() => {
    dispatch(fetchcourseData());
  }, [dispatch]);

  const handleAddcourse = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("courseName", newcourseData.courseName);
    formData.append("duration", newcourseData.duration);
    formData.append("price", newcourseData.price);
    formData.append("shortInfo", newcourseData.shortInfo);
    formData.append("longInfo", newcourseData.longInfo);
    formData.append("createdBy", newcourseData.createdBy);
    dispatch(AddcourseData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "course updated/deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewcourseData({
          courseName: "",
          duration: "",
          price: "",
          shortInfo: "",
          longInfo: "",
          createdBy: "",
        });
        setIsAddcourseModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to add course",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deletecourseData(selectedcourseId))
      .then(() => {
        dispatch(fetchcourseData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedcourseId(null);
        setIsSaveLoading(false);
        Toast({
          title: "course added/updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete course",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting course: ", error);
      });
  };

  const handleViewcourse = (courseId) => {
    navigate(`../course/info/${courseId}`);
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

  const totalPages = Math.ceil(courseData.length / coursePerPage);

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

  const indexOfLastcourse = currentPage * coursePerPage;
  const indexOfFirstcourse = indexOfLastcourse - coursePerPage;
  const currentcourse = courseData.slice(indexOfFirstcourse, indexOfLastcourse);


  const courseManagementPermissions = getModulePermissions('Courses');

  if (!courseManagementPermissions) {
    return <NetworkError />;
  }
  const canAddcourse = courseManagementPermissions.create;


  return (
    <Box p="3" >
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Course List
        </Text>
        <Flex align="center">
          <Button
            mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => {
              if (canAddcourse) {
                setIsAddcourseModalOpen(true);
              } else {
                Toast({
                  title: "You don't have permission to add course",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                  position: "top-right",
                });
              }
            }}
          >
            Add course
          </Button>
        </Flex>
      </Flex>
      <Box bg="gray.100" p="6" borderRadius="lg" overflowX="auto" css={{
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
        {currentcourse.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No course available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>Course Name</Th>
                <Th>Course Duration </Th>
                <Th>Course Price</Th>
                <Th>Short Info</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentcourse
                .filter(course => course.status === 'Active')
                .map((course, index) => (
                  <Tr key={index}>
                    <Td borderBottom="1px" borderColor="gray.200">
                      {course.courseName}
                    </Td>
                    <Td borderBottom="1px" borderColor="gray.200">
                      {course.duration}
                    </Td>
                    <Td borderBottom="1px" borderColor="gray.200">
                      {course.price}
                    </Td>
                    <Td borderBottom="1px" borderColor="gray.200">
                      {course.shortInfo}
                    </Td>
                    <Td borderBottom="1px" borderColor="gray.200">
                      <Flex>
                        <Button
                          size="xs"
                          colorScheme="teal"
                          mr="1"
                          onClick={() => handleViewcourse(course.courseId)}
                        >
                          More Info
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
        <Button onClick={() => paginate(1)} mr={2}>&lt;&lt;</Button>
        <Button onClick={() => paginate(currentPage - 1)} mr={2}>&lt;</Button>
        {renderPagination()}
        <Button onClick={() => paginate(currentPage + 1)} ml={2}>&gt;</Button>
        <Button onClick={() => paginate(totalPages)} ml={2}>&gt;&gt;</Button>
      </Flex>

      {/* Add course Modal */}
      <Modal
        isOpen={isAddcourseModalOpen}
        onClose={() => setIsAddcourseModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddcourse}>
          {" "}
          <ModalContent>
            <ModalHeader>Add course</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form input fields for adding a new course */}
              <Input
                mb="3"
                placeholder="Course Name"
                value={newcourseData.courseName}
                onChange={(e) =>
                  setNewcourseData({
                    ...newcourseData,
                    courseName: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Course Duration"
                value={newcourseData.duration}
                onChange={(e) =>
                  setNewcourseData({
                    ...newcourseData,
                    duration: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Course Price"
                value={newcourseData.price}
                onChange={(e) =>
                  setNewcourseData({
                    ...newcourseData,
                    price: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Short Info"
                value={newcourseData.shortInfo}
                onChange={(e) =>
                  setNewcourseData({
                    ...newcourseData,
                    shortInfo: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Long Info"
                value={newcourseData.longInfo}
                onChange={(e) =>
                  setNewcourseData({
                    ...newcourseData,
                    longInfo: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Created By"
                value={newcourseData.createdBy}
                onChange={(e) =>
                  setNewcourseData({
                    ...newcourseData,
                    createdBy: e.target.value,
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
                onClick={() => setIsAddcourseModalOpen(false)}
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
          <ModalBody>Are you sure you want to delete this course ?</ModalBody>
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
