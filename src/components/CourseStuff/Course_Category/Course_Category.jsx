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
  fetchcategoryData,
  selectcategoryData,
  selectcategoryLoading,
  selectcategoryError,
  AddcategoryData,
  deletecategoryData,
  updatecategoryData,
} from "../../../app/Slices/categorySlice";
import NetworkError from "../../NotFound/networkError";
import { getModulePermissions } from "../../../utils/permissions";
import { useNavigate } from "react-router-dom";
import fallbackImage from "../../../assets/images/imageError.png";
import { fetchBranchData } from "../../../app/Slices/branchSlice";


export default function Course_Category() {
  const [isAddcourseCategoryModalOpen, setIsAddcourseCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [selectedcourseCategoryId, setSelectedcourseCategoryId] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [editedCategoryData, setEditedCategoryData] = useState({});
  const [isEditing, setIsEditing] = useState(false);


  const [newcourseCategoryData, setNewcourseCategoryData] = useState({
    categoryTitle: "",
    shortInfo: "",
    longInfo: "",
    backgroundImage: "",
    icon: "",
    status: "",
    parentCategoryId: "",
  });

  const categoryData = useSelector(selectcategoryData);
  const categoryError = useSelector(selectcategoryError);
  const categoryLoading = useSelector(selectcategoryLoading);
  const isLoading = useSelector(selectcategoryLoading);
  const error = useSelector(selectcategoryError);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Toast = useToast({
    position: "top-right",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [courseCategoryPerPage, setcourseCategoryPerPage] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredCount, setFilteredCount] = useState(0);


  useEffect(() => {
    dispatch(fetchcategoryData());
    dispatch(fetchBranchData());
  }, [dispatch]);

  useEffect(() => {
    const filteredCategory = categoryData.filter((student) => {
      return selectedStatus ? student.status === selectedStatus : true;
    });
    setFilteredCount(filteredCategory.length);
  }, [selectedStatus, categoryData]);

  const handleAddcourseCategory = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("categoryTitle", newcourseCategoryData.categoryTitle);
    formData.append("shortInfo", newcourseCategoryData.shortInfo);
    formData.append("longInfo", newcourseCategoryData.longInfo);
    formData.append("backgroundImage", newcourseCategoryData.backgroundImage);
    formData.append("icon", newcourseCategoryData.icon);
    formData.append("status", newcourseCategoryData.status);
    formData.append("parentCategoryId", newcourseCategoryData.parentCategoryId);
    dispatch(AddcategoryData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "Course category added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewcourseCategoryData({
          categoryTitle: "",
          shortInfo: "",
          longInfo: "",
          backgroundImage: "",
          icon: "",
          status: "",
          parentCategoryId: "",
        });
        setIsAddcourseCategoryModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to add course category",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deletecategoryData(selectedcourseCategoryId))
      .then(() => {
        dispatch(fetchcategoryData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedcourseCategoryId(null);
        setIsSaveLoading(false);
        Toast({
          title: "Course category deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete course category",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting course category: ", error);
      });
  };


  const handleSaveChanges = () => {
    if (isEditing) {
      setIsSaveLoading(true);
    }
    const formData = {
      categoryTitle: editedCategoryData.categoryTitle,
      shortInfo: editedCategoryData.shortInfo,
      longInfo: editedCategoryData.longInfo,
      backgroundImage: editedCategoryData.backgroundImage,
      icon: editedCategoryData.icon,
      status: editedCategoryData.status,
      parentCategoryId: editedCategoryData.parentCategoryId,
    };

    dispatch(updatecategoryData(editedCategoryData.categoryId, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedcourseCategoryId(null);
        dispatch(fetchcategoryData());
        setIsSaveLoading(false);
        setNewcourseCategoryData({
          categoryTitle: "",
          shortInfo: "",
          longInfo: "",
          backgroundImage: "",
          icon: "",
          status: "",
          parentCategoryId: "",
        });
        Toast({
          title: "Category updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating Category",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating category: ", error);
      });
  };


  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setIsEditing(false);
  }

  const handleEditCategory = (courseCategory) => {
    setIsEditing(true);
    setSelectedcourseCategoryId(courseCategory.categoryId);
    setEditedCategoryData(courseCategory);
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

  const filteredcourseCategory = categoryData.filter((courseCategory) => {

    const statusMatch = selectedStatus ? courseCategory.status == selectedStatus : true;
    return statusMatch;
  });

  const totalPages = Math.ceil(filteredcourseCategory.length / courseCategoryPerPage);

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

  const indexOfLastcourseCategory = currentPage * courseCategoryPerPage;
  const indexOfFirstcourseCategory = indexOfLastcourseCategory - courseCategoryPerPage;
  const currentcourseCategory = filteredcourseCategory.slice(indexOfFirstcourseCategory, indexOfLastcourseCategory);

  const courseCategoryManagementPermissions = getModulePermissions("Course Category");

  if (!courseCategoryManagementPermissions) {
    return <NetworkError />;
  }

  const canAddData = courseCategoryManagementPermissions.create;
  const canDeleteData = courseCategoryManagementPermissions.delete;
  const canEditData = courseCategoryManagementPermissions.update;


  return (
    <Box p="3">
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Category List
          ({filteredCount})
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
          </Select>
          <Button
            colorScheme="blue"
            onClick={() => {
              if (canAddData) {
                setIsAddcourseCategoryModalOpen(true)
              } else {
                Toast({
                  title: "You don't have permission to add Category",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                  position: "top-right",
                });
              }
            }}
          >
            Add Category
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
          {currentcourseCategory.length === 0 ? (
            <Flex justify="center" align="center" height="100%">
              <Box textAlign="center">
                <Text fontSize="xl" fontWeight="bold">No course category available</Text>
              </Box>
            </Flex>
          ) : (
            currentcourseCategory
              .map((courseCategory, index) => (
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
                      src={courseCategory.backgroundImage}
                      alt={courseCategory.categoryTitle}
                      borderRadius="lg"
                      mb="4"
                      height="200px"
                      width="100%"
                      objectFit="cover"
                      onError={(e) => (e.target.src = fallbackImage)}
                    />
                    <Text fontWeight="bold" mb="2">
                      {courseCategory.categoryTitle}
                    </Text>
                    <Text mb="2">
                      <b>Short Info:</b> {courseCategory.shortInfo}
                    </Text>
                  </Box>
                  <Flex alignItems="center" mt="auto">
                    <Button
                      size="sm"
                      mr={2}
                      colorScheme="teal"
                      onClick={() => {
                        if (canEditData) {
                          setIsEditModalOpen(true);
                          setEditedCategoryData(courseCategory);
                        } else {
                          Toast({
                            title: "You don't have permission to edit category",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                            position: "top-right",
                          });
                        }
                      }}                    >
                      More Info
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        if (canDeleteData) {
                          setSelectedcourseCategoryId(courseCategory.categoryId);
                          setIsDeleteConfirmationModalOpen(true);
                        } else {
                          Toast({
                            title: "You don't have permission to delete courseCategory",
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
        {currentcourseCategory.length > 0 && (
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

      {/* Add/Edit courseCategory Modal */}
      <Modal
        isOpen={isAddcourseCategoryModalOpen}
        onClose={() => setIsAddcourseCategoryModalOpen(false)}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add courseCategory</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleAddcourseCategory}>
            <ModalBody>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
                <Input
                  mb="3"
                  placeholder="Category Title"
                  value={newcourseCategoryData.categoryTitle}
                  onChange={(e) =>
                    setNewcourseCategoryData({
                      ...newcourseCategoryData,
                      categoryTitle: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="Short Info"
                  value={newcourseCategoryData.shortInfo}
                  onChange={(e) =>
                    setNewcourseCategoryData({
                      ...newcourseCategoryData,
                      shortInfo: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="Background Image"
                  value={newcourseCategoryData.backgroundImage}
                  onChange={(e) =>
                    setNewcourseCategoryData({
                      ...newcourseCategoryData,
                      backgroundImage: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="Icon"
                  value={newcourseCategoryData.icon}
                  onChange={(e) =>
                    setNewcourseCategoryData({
                      ...newcourseCategoryData,
                      icon: e.target.value,
                    })
                  }
                  isRequired
                />
                <Select
                  mb="3"
                  placeholder="Select status"
                  value={newcourseCategoryData.status}
                  onChange={(e) =>
                    setNewcourseCategoryData({
                      ...newcourseCategoryData,
                      status: e.target.value,
                    })
                  }
                  isRequired
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
                <Input
                  mb="3"
                  placeholder="Parent Category Id"
                  value={newcourseCategoryData.parentCategoryId}
                  onChange={(e) =>
                    setNewcourseCategoryData({
                      ...newcourseCategoryData,
                      parentCategoryId: e.target.value,
                    })
                  }
                  isRequired
                />
                <Textarea
                  mb="3"
                  placeholder="Long Info"
                  value={newcourseCategoryData.longInfo}
                  onChange={(e) =>
                    setNewcourseCategoryData({
                      ...newcourseCategoryData,
                      longInfo: e.target.value,
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
                onClick={() => setIsAddcourseCategoryModalOpen(false)}
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
          <ModalBody>Are you sure you want to delete this courseCategory?</ModalBody>
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

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Category details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
              <Box>
                <Text mb="1" color="gray.600">
                  Category Title
                </Text>
                <Input
                  mb="3"
                  placeholder="Category Title"
                  value={editedCategoryData?.categoryTitle || ""}
                  onChange={(e) =>
                    setEditedCategoryData({
                      ...editedCategoryData,
                      categoryTitle: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Short Info
                </Text>
                <Input
                  mb="3"
                  placeholder="Short Info"
                  value={editedCategoryData?.shortInfo || ""}
                  onChange={(e) =>
                    setEditedCategoryData({
                      ...editedCategoryData,
                      shortInfo: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Background Image
                </Text>
                <Input
                  mb="3"
                  placeholder="Background Image"
                  value={editedCategoryData?.backgroundImage || ""}
                  onChange={(e) =>
                    setEditedCategoryData({
                      ...editedCategoryData,
                      backgroundImage: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Icon
                </Text>
                <Input
                  mb="3"
                  placeholder="Icon"
                  value={editedCategoryData?.icon || ""}
                  onChange={(e) =>
                    setEditedCategoryData({
                      ...editedCategoryData,
                      icon: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Status
                </Text>
                <Select
                  mb="3"
                  placeholder="Select status"
                  value={editedCategoryData?.status || ""}
                  onChange={(e) =>
                    setEditedCategoryData({
                      ...editedCategoryData,
                      status: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Parent category id
                </Text>
                <Input
                  mb="3"
                  placeholder="Parent Category Id"
                  value={editedCategoryData?.parentCategoryId || ""}
                  onChange={(e) =>
                    setEditedCategoryData({
                      ...editedCategoryData,
                      parentCategoryId: e.target.value,
                    })
                  }
                  isDisabled={!isEditing}
                  required
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Long Info
                </Text>
                <Textarea
                  mb="3"
                  placeholder="Long Info"
                  value={editedCategoryData?.longInfo || ""}
                  onChange={(e) =>
                    setEditedCategoryData({
                      ...editedCategoryData,
                      longInfo: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                />
              </Box>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={handleSaveChanges}
              isLoading={isSaveLoading}
              spinner={<BeatLoader size={8} color="white" />}
              isDisabled={!isEditing}
            >
              Save Changes
            </Button>
            {isEditing ? (
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => handleEditCategory(editedCategoryData)}
              >
                Edit
              </Button>
            )}
          </ModalFooter>;
        </ModalContent>
      </Modal>
    </Box>
  );
}
