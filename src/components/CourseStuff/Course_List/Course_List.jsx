import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Text,
  Input,
  Flex,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
  useToast,
  Select,
  Grid,
  Textarea,
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
import fallbackImage from "../../../assets/images/imageError.png";
import { fetchcategoryData, selectcategoryData, selectcategoryError, selectcategoryLoading } from "../../../app/Slices/categorySlice";


export default function Course_List() {
  const id = sessionStorage.getItem('BranchId');
  const [isAddcourseModalOpen, setIsAddcourseModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [selectedcourseId, setSelectedcourseId] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newcourseData, setNewcourseData] = useState({
    courseName: "",
    duration: "",
    price: "",
    mrp: "",
    createdBy: "",
    shortInfo: "",
    longInfo: "",
    thumbnail: "",
    smallThumbnail: "",
    courseTitle: "",
    sampleVideo: "",
    status: "Pending",
    createdOn: Date.now(),
    category: "",
    categoryId: "",
    htmlInfo: "",
    benefits: "",
  });

  const courseData = useSelector(selectcourseData);
  const categoryData = useSelector(selectcategoryData);
  const categoryError = useSelector(selectcategoryError);
  const categoryLoading = useSelector(selectcategoryLoading);
  const isLoading = useSelector(selectcourseLoading);
  const error = useSelector(selectcourseError);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { branchId } = useParams();
  const Toast = useToast({
    position: "top-right",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [coursePerPage, setcoursePerPage] = useState(10);


  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");


  useEffect(() => {
    dispatch(fetchcourseData());
    dispatch(fetchcategoryData());
  }, [dispatch]);

  const DataByBranch = id == 0 ? courseData : courseData.filter(user => user.branchId == id);

  useEffect(() => {
    const filteredCourse = DataByBranch.filter((student) => {
      return selectedStatus ? student.status === selectedStatus : true;
    });
  }, [selectedStatus, DataByBranch]);

  const CategoryData = categoryData.filter(branch => branch.status == 'Active');



  const handleAddcourse = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      console.error('User ID not found');
    }

    if (!branchId) {
      console.error('Branch ID not found');
    }

    const formData = new FormData();
    formData.append("courseName", newcourseData.courseName);
    formData.append("duration", newcourseData.duration);
    formData.append("price", newcourseData.price);
    formData.append("mrp", newcourseData.mrp);
    formData.append("createdBy", userId);
    formData.append("shortInfo", newcourseData.shortInfo);
    formData.append("longInfo", newcourseData.longInfo);
    formData.append("thumbnail", newcourseData.thumbnail);
    formData.append("smallThumbnail", newcourseData.smallThumbnail);
    formData.append("courseTitle", newcourseData.courseTitle);
    formData.append("sampleVideo", newcourseData.sampleVideo);
    formData.append("status", "Pending");
    formData.append("createdOn", Date.now());
    formData.append("category", newcourseData.category);
    formData.append("categoryId", newcourseData.categoryId);
    formData.append("branchId", id);
    formData.append("htmlInfo", newcourseData.htmlInfo);
    formData.append("benefits", newcourseData.benefits);
    dispatch(AddcourseData(formData))
      .then(() => {
        dispatch(fetchcourseData());
        setIsSaveLoading(false);
        Toast({
          title: "Course added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewcourseData({
          courseName: "",
          duration: "",
          price: "",
          mrp: "",
          createdBy: "",
          shortInfo: "",
          longInfo: "",
          thumbnail: "",
          smallThumbnail: "",
          courseTitle: "",
          sampleVideo: "",
          status: "",
          createdOn: "",
          category: "",
          categoryId: "",
          htmlInfo: "",
          benefits: "",
        });
        setIsAddcourseModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsSaveLoading(false);
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
          title: "Course deleted successfully",
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
    navigate(`/course/info/${courseId}`);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
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

  if (categoryLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (categoryError) {
    return <NetworkError />;
  }

  const filteredCourses = DataByBranch.filter((course) => {
    const categoryMatch = selectedCategory
      ? course.categoryId == selectedCategory
      : true;
    const statusMatch = selectedStatus ? course.status == selectedStatus : true;
    const branchMatch = branchId ? course.branchId == branchId : true;
    return categoryMatch && statusMatch && branchMatch;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursePerPage);

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
    const startIndex = Math.max(Math.ceil(currentPage - (maxButtonsToShow - 1) / 2), 1);
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
        <Button key="ellipsisBefore" onClick={() => paginate(startIndex - 1)} mr={2}>
          ...
        </Button>
      );
    }

    if (endIndex < totalPages) {
      pageButtons.push(
        <Button key="ellipsisAfter" onClick={() => paginate(endIndex + 1)} ml={2}>
          ...
        </Button>,
        <Button key="last" onClick={() => paginate(totalPages)} ml={2}>
          &gt;&gt;
        </Button>
      );
    }

    return pageButtons;
  };

  const indexOfLastcourse = currentPage * coursePerPage;
  const indexOfFirstcourse = indexOfLastcourse - coursePerPage;
  const currentcourse = filteredCourses.slice(indexOfFirstcourse, indexOfLastcourse);

  const courseManagementPermissions = getModulePermissions("Courses");

  if (!courseManagementPermissions) {
    return <NetworkError />;
  }

  const canAddData = courseManagementPermissions.create;
  const canDeleteData = courseManagementPermissions.delete;

  const filteredCount = currentcourse.length;

  return (
    <Box p="3">
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Course List
          ({filteredCount})
        </Text>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
          }}
          gap={3}
          alignItems="center"
        >
          <Select
            placeholder="Filter by Category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {CategoryData.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryTitle}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Filter by Status"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archive">Archive</option>
          </Select>
          <Button
            colorScheme="blue"
            onClick={() => {
              if (canAddData) {
                setIsAddcourseModalOpen(true)
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
            Add Course
          </Button>
        </Grid>
      </Flex>

      <Box
        bg="gray.100"
        p="6"
        borderRadius="lg"
        overflowX="auto"
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
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(5, 1fr)" }}
          gap={6}
          mb={4}
        >
          {currentcourse.length === 0 ? (
            <Flex justify="center" align="center" height="100%">
              <Box textAlign="center">
                <Text fontSize="xl" fontWeight="bold">No course available</Text>
              </Box>
            </Flex>
          ) : (
            currentcourse
              .map((course, index) => (
                <Box
                  key={index}
                  bg="white"
                  p="4"
                  borderRadius="lg"
                  boxShadow="md"
                  maxWidth="300px"
                  boxSizing="border-box"
                  transition="box-shadow 0.3s"
                  _hover={{
                    boxShadow: "2xl",
                  }}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="100%"
                >
                  <Box>
                    <Image
                      src={course.smallThumbnail}
                      alt={course.courseName}
                      borderRadius="lg"
                      mb="4"
                      height="200px"
                      width="100%"
                      objectFit="cover"
                      onError={(e) => (e.target.src = fallbackImage)}
                    />
                    <Text fontWeight="bold" mb="2">
                      {course.courseName}
                    </Text>
                    <Text mb="2">
                      <b>Duration:</b> {course.duration}
                    </Text>
                    <Text mb="2">
                      <b>Price:</b> {course.price}
                    </Text>
                    <Text mb="2">
                      <b>Short Info:</b> {course.shortInfo}
                    </Text>
                  </Box>
                  <Flex alignItems="center" mt="auto">
                    <Button
                      size="sm"
                      mr={2}
                      colorScheme="teal"
                      onClick={() => handleViewcourse(course.courseId)}
                    >
                      More Info
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        if (canDeleteData) {
                          setSelectedcourseId(course.courseId);
                          setIsDeleteConfirmationModalOpen(true);
                        } else {
                          Toast({
                            title: "You don't have permission to delete course",
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
                </Box>

              ))
          )}
        </Grid>
      </Box>
      <Flex justify="flex-end" mt="4">
        {currentcourse.length > 0 && (
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
      {/* Add/Edit course Modal */}
      <Modal
        isOpen={isAddcourseModalOpen}
        onClose={() => setIsAddcourseModalOpen(false)}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Course</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleAddcourse}>
            <ModalBody>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
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
                  placeholder="Course Title"
                  value={newcourseData.courseTitle}
                  onChange={(e) =>
                    setNewcourseData({
                      ...newcourseData,
                      courseTitle: e.target.value,
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
                  placeholder="Course Mrp"
                  value={newcourseData.mrp}
                  onChange={(e) =>
                    setNewcourseData({
                      ...newcourseData,
                      mrp: e.target.value,
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
                  placeholder="Thumbnail"
                  value={newcourseData.thumbnail}
                  onChange={(e) =>
                    setNewcourseData({
                      ...newcourseData,
                      thumbnail: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="Small Thumbnail"
                  value={newcourseData.smallThumbnail}
                  onChange={(e) =>
                    setNewcourseData({
                      ...newcourseData,
                      smallThumbnail: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="Sample Video"
                  value={newcourseData.sampleVideo}
                  onChange={(e) =>
                    setNewcourseData({
                      ...newcourseData,
                      sampleVideo: e.target.value,
                    })
                  }
                  isRequired
                />
                <Select
                  mb="3"
                  placeholder="Select Category"
                  value={newcourseData.category}
                  onChange={(e) => {
                    const selectedCategory = CategoryData.find(category => category.categoryTitle === e.target.value);
                    setNewcourseData({
                      ...newcourseData,
                      category: e.target.value,
                      categoryId: selectedCategory ? selectedCategory.categoryId : ''
                    });
                  }}
                  isRequired
                >
                  {CategoryData.map((category) => (
                    <option key={category.categoryId} value={category.categoryTitle}>
                      {category.categoryTitle}
                    </option>
                  ))}
                </Select>
                <Select
                  mb="3"
                  placeholder="Select Category Id"
                  value={newcourseData.categoryId}
                  onChange={(e) =>
                    setNewcourseData({
                      ...newcourseData,
                      categoryId: e.target.value,
                    })
                  }
                  isDisabled={true}
                  isRequired
                >
                  {CategoryData.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryId}
                    </option>
                  ))}
                </Select>
                <Input
                  mb="3"
                  placeholder="Benefits"
                  value={newcourseData.benefits}
                  onChange={(e) =>
                    setNewcourseData({
                      ...newcourseData,
                      benefits: e.target.value,
                    })
                  }
                  isRequired
                />
                <Textarea
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
                <Textarea
                  mb="3"
                  placeholder="HTML Info"
                  value={newcourseData.htmlInfo}
                  onChange={(e) =>
                    setNewcourseData({
                      ...newcourseData,
                      htmlInfo: e.target.value,
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
                onClick={() => setIsAddcourseModalOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this course?</ModalBody>
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
