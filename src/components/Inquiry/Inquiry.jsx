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
  fetchinquiryData,
  selectinquiryData,
  selectinquiryLoading,
  selectinquiryError,
  AddinquiryData,
  deleteinquiryData,
  updateinquiryData,
} from "../../app/Slices/inquirySlice";
import NetworkError from "../NotFound/networkError";
import { getModulePermissions } from "../../utils/permissions";
import { useNavigate } from "react-router-dom";
import { fetchBranchData, selectBranchData, selectBranchError, selectBranchLoading } from "../../app/Slices/branchSlice";
import { fetchcourseData, selectcourseData, selectcourseError, selectcourseLoading } from "../../app/Slices/courseSlice";
import TimeConversion from '../../utils/timeConversion';


export default function Inquiry() {
  const [isAddInquiryModalOpen, setIsAddInquiryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [editedInquiryData, setEditedInquiryData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [newInquiryData, setNewInquiryData] = useState({
    title: "",
    info: "",
    branchId: "",
    firstName: "",
    lastName: "",
    courseId: "",
    createdOn: "",
    updatedOn: "",
    status: "",
    nextUpdateDate: "",
    mobileNumber: "",
    cityId: "",
    address: "",
    handledBy: "",
  });

  const inquiryData = useSelector(selectinquiryData);
  const isLoading = useSelector(selectinquiryLoading);
  const error = useSelector(selectinquiryError);
  const branchData = useSelector(selectBranchData);
  const branchError = useSelector(selectBranchError);
  const branchLoading = useSelector(selectBranchLoading);
  const courseData = useSelector(selectcourseData);
  const courseError = useSelector(selectcourseError);
  const courseLoading = useSelector(selectcourseLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Toast = useToast({
    position: "top-right",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [inquiriesPerPage, setInquiriesPerPage] = useState(10);

  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    dispatch(fetchinquiryData());
    dispatch(fetchBranchData());
    dispatch(fetchcourseData());
  }, [dispatch]);

  const handleAddInquiry = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("title", newInquiryData.title);
    formData.append("info", newInquiryData.info);
    formData.append("branchId", newInquiryData.branchId);
    formData.append("firstName", newInquiryData.firstName);
    formData.append("lastName", newInquiryData.lastName);
    formData.append("courseId", newInquiryData.courseId);
    formData.append("createdOn", Date.now());
    formData.append("status", "Pending");
    formData.append("mobileNumber", newInquiryData.mobileNumber);
    formData.append("cityId", newInquiryData.cityId);
    formData.append("address", newInquiryData.address);

    dispatch(AddinquiryData(formData))
      .then(() => {
        setIsSaveLoading(false);
        dispatch(fetchinquiryData());
        Toast({
          title: "Inquiry added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewInquiryData({
          title: "",
          info: "",
          branchId: "",
          firstName: "",
          lastName: "",
          courseId: "",
          createdOn: "",
          status: "",
          mobileNumber: "",
          cityId: "",
          address: "",
        });
        setIsAddInquiryModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to add inquiry",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deleteinquiryData(selectedInquiryId))
      .then(() => {
        dispatch(fetchinquiryData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedInquiryId(null);
        setIsSaveLoading(false);
        Toast({
          title: "Inquiry deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete inquiry",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting inquiry: ", error);
      });
  };

  const handleSaveChanges = () => {
    if (isEditing) {
      setIsSaveLoading(true);
    }
    const formData = {
      title: editedInquiryData.title,
      branchId: editedInquiryData.branchId,
      firstName: editedInquiryData.firstName,
      lastName: editedInquiryData.lastName,
      courseId: editedInquiryData.courseId,
      updatedOn: Date.now(),
      status: editedInquiryData.status,
      nextUpdateDate: editedInquiryData.nextUpdateDate,
      mobileNumber: editedInquiryData.mobileNumber,
      cityId: editedInquiryData.cityId,
      address: editedInquiryData.address,
      handledBy: editedInquiryData.handledBy,
      info: editedInquiryData.info,
    };

    dispatch(updateinquiryData(editedInquiryData.inquiryId, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedInquiryId(null);
        dispatch(fetchinquiryData());
        setIsSaveLoading(false);
        setNewInquiryData({
          title: "",
          info: "",
          branchId: "",
          firstName: "",
          lastName: "",
          courseId: "",
          updatedOn: "",
          status: "",
          nextUpdateDate: "",
          mobileNumber: "",
          cityId: "",
          address: "",
          handledBy: "",
        });
        Toast({
          title: "Inquiry updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating Inquiry",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating inquiry: ", error);
      });
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setIsEditing(false);
  };

  const handleEditInquiry = (inquiry) => {
    setIsEditing(true);
    setSelectedInquiryId(inquiry.inquiryId);
    setEditedInquiryData(inquiry);
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

  if (courseLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (courseError) {
    return <NetworkError />;
  }

  const filteredInquiries = inquiryData.filter((inquiry) => {
    const statusMatch = selectedStatus ? inquiry.status === selectedStatus : true;
    return statusMatch;
  });

  const totalPages = Math.ceil(filteredInquiries.length / inquiriesPerPage);

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

  const indexOfLastInquiry = currentPage * inquiriesPerPage;
  const indexOfFirstInquiry = indexOfLastInquiry - inquiriesPerPage;
  const currentInquiries = filteredInquiries.slice(indexOfFirstInquiry, indexOfLastInquiry);

  const inquiryManagementPermissions = getModulePermissions("Inquiry");

  if (!inquiryManagementPermissions) {
    return <NetworkError />;
  }

  const canAddData = inquiryManagementPermissions.create;
  const canDeleteData = inquiryManagementPermissions.delete;
  const canEditData = inquiryManagementPermissions.update;



  return (
    <Box p="3">
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Inquiry List
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
            <option value="Reject">Reject</option>
            <option value="Pending">Pending</option>
            <option value="Converted">Converted</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
          <Button
            colorScheme="blue"
            onClick={() => {
              if (canAddData) {
                setIsAddInquiryModalOpen(true);
              } else {
                Toast({
                  title: "You don't have permission to add Inquiry",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                  position: "top-right",
                });
              }
            }}
          >
            Add Inquiry
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
          {currentInquiries.length === 0 ? (
            <Flex justify="center" align="center" height="100%">
              <Box textAlign="center">
                <Text fontSize="xl" fontWeight="bold">No inquiries available</Text>
              </Box>
            </Flex>
          ) : (
            currentInquiries.map((inquiry, index) => (
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
                  <Text fontWeight="bold" mb="2">
                    {inquiry.inquiryTitle}
                  </Text>
                  <Text mb="2">
                    <b>Title:</b> {inquiry.title}
                  </Text>
                  <Text mb="2">
                    <b>First Name:</b> {inquiry.firstName}
                  </Text>
                  <Text mb="2">
                    <b>Last Name:</b> {inquiry.lastName}
                  </Text>
                  <Text mb="2">
                    <b>Course Id:</b> {inquiry.courseId}
                  </Text>
                  <Text mb="2">
                    <b>Branch Id:</b> {inquiry.branchId}
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
                        setEditedInquiryData(inquiry);
                      } else {
                        Toast({
                          title: "You don't have permission to edit inquiry",
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                          position: "top-right",
                        });
                      }
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => {
                      if (canDeleteData) {
                        setSelectedInquiryId(inquiry.inquiryId);
                        setIsDeleteConfirmationModalOpen(true);
                      } else {
                        Toast({
                          title: "You don't have permission to delete inquiry",
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
        {filteredInquiries.length > 0 && (
          <Flex justify="flex-end" mt="4">
            <Button onClick={() => paginate(1)} mr={2}>
              &lt;&lt;
            </Button>
            <Button onClick={() => paginate(currentPage - 1)} mr={2}>
              &lt;
            </Button>
            {renderPagination()}
            <Button onClick={() => paginate(currentPage + 1)} mr={2}>
              &gt;
            </Button>
            <Button onClick={() => paginate(totalPages)} mr={2}>
              &gt;&gt;
            </Button>
          </Flex>
        )}
      </Flex>

      {/* Add Inquiry Modal */}
      <Modal
        isOpen={isAddInquiryModalOpen}
        onClose={() => setIsAddInquiryModalOpen(false)}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Inquiry</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleAddInquiry}>
            <ModalBody>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
                <Input
                  mb="3"
                  placeholder="Inquiry Title"
                  value={newInquiryData.title}
                  onChange={(e) =>
                    setNewInquiryData({
                      ...newInquiryData,
                      title: e.target.value,
                    })
                  }
                  isRequired
                />
                <Select
                  mb="3"
                  placeholder="Select Branch"
                  value={newInquiryData.branchId}
                  onChange={(e) =>
                    setNewInquiryData({
                      ...newInquiryData,
                      branchId: e.target.value,
                    })
                  }
                  isRequired
                >
                  {branchData.map((branch) => (
                    <option key={branch.branchId} value={branch.branchId}>
                      {branch.branchName}
                    </option>
                  ))}
                </Select>
                <Input
                  mb="3"
                  placeholder="First Name"
                  value={newInquiryData.firstName}
                  onChange={(e) =>
                    setNewInquiryData({
                      ...newInquiryData,
                      firstName: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="Last Name"
                  value={newInquiryData.lastName}
                  onChange={(e) =>
                    setNewInquiryData({
                      ...newInquiryData,
                      lastName: e.target.value,
                    })
                  }
                  isRequired
                />
                <Select
                  mb="3"
                  placeholder="Select Course"
                  value={newInquiryData.courseId}
                  onChange={(e) =>
                    setNewInquiryData({
                      ...newInquiryData,
                      courseId: e.target.value,
                    })
                  }
                  isRequired
                >
                  {courseData.map((course) => (
                    <option key={course.branchId} value={course.courseId}>
                      {course.courseTitle}
                    </option>
                  ))}
                </Select>
                <Input
                  mb="3"
                  placeholder="Mobile Number"
                  value={newInquiryData.mobileNumber}
                  onChange={(e) =>
                    setNewInquiryData({
                      ...newInquiryData,
                      mobileNumber: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="City Pincode"
                  value={newInquiryData.cityId}
                  onChange={(e) =>
                    setNewInquiryData({
                      ...newInquiryData,
                      cityId: e.target.value,
                    })
                  }
                  isRequired
                />
                <Input
                  mb="3"
                  placeholder="Address"
                  value={newInquiryData.address}
                  onChange={(e) =>
                    setNewInquiryData({
                      ...newInquiryData,
                      address: e.target.value,
                    })
                  }
                  isRequired
                />
                <Textarea
                  mb="3"
                  placeholder="Inquiry Info"
                  value={newInquiryData.info}
                  onChange={(e) => setNewInquiryData({
                    ...newInquiryData,
                    info: e.target.value,
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
                onClick={() => setIsAddInquiryModalOpen(false)}
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
          <ModalBody>Are you sure you want to delete this inquiry?</ModalBody>
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
          <ModalHeader>Inquiry Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
              <Box>
                <Text mb="1" color="gray.600">
                  Inquiry Title
                </Text>
                <Input
                  mb="3"
                  placeholder="Inquiry Title"
                  value={editedInquiryData?.title || ""}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      title: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Branch Id
                </Text>
                <Select
                  mb="3"
                  placeholder="Select Branch"
                  value={editedInquiryData?.branchId || ""}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      branchId: e.target.value,
                    })
                  }
                  isRequired
                  isDisabled={!isEditing}
                >
                  {branchData.map((branch) => (
                    <option key={branch.branchId} value={branch.branchId}>
                      {branch.branchName}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  First Name
                </Text>
                <Input
                  mb="3"
                  placeholder="First Name"
                  value={editedInquiryData?.firstName || ""}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      firstName: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Last Name
                </Text>
                <Input
                  mb="3"
                  placeholder="Last Name"
                  value={editedInquiryData?.lastName || ""}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      lastName: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Course Id
                </Text>
                <Select
                  mb="3"
                  placeholder="Select Course"
                  value={editedInquiryData?.courseId || ""}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      courseId: e.target.value,
                    })
                  }
                  isRequired
                  isDisabled={!isEditing}
                >
                  {courseData.map((course) => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseTitle}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Status
                </Text>
                <Select
                  mb="3"
                  placeholder="Select Status"
                  value={editedInquiryData?.status || ""}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      status: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                >
                  <option value="Reject">Reject</option>
                  <option value="Pending">Pending</option>
                  <option value="Converted">Converted</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Next Update Date
                </Text>
                <Input
                  mb="3"
                  placeholder="Next Update Date"
                  value={editedInquiryData?.nextUpdateDate || ""}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      nextUpdateDate: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Updated On
                </Text>
                <Input
                  mb="3"
                  placeholder="Updated On"
                  value={TimeConversion.unixTimeToRealTime(editedInquiryData?.updatedOn || "")}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      updatedOn: e.target.value,
                    })
                  }
                  required
                  isDisabled
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Created On
                </Text>
                <Input
                  mb="3"
                  placeholder="Created On"
                  value={TimeConversion.unixTimeToRealTime(editedInquiryData?.createdOn || "")}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      createdOn: e.target.value,
                    })
                  }
                  required
                  isDisabled
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Mobile Number
                </Text>
                <Input
                  mb="3"
                  placeholder="Mobile Number"
                  value={editedInquiryData?.mobileNumber || ""}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      mobileNumber: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  City PinCode
                </Text>
                <Input
                  mb="3"
                  placeholder="City Pincode"
                  value={editedInquiryData?.cityId || ""}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      cityId: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Address
                </Text>
                <Input
                  mb="3"
                  placeholder="Address"
                  value={editedInquiryData?.address || ""}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      address: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Handled By
                </Text>
                <Input
                  mb="3"
                  placeholder="Handled By"
                  value={editedInquiryData?.handledBy || ""}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      handledBy: e.target.value,
                    })
                  }
                  required
                  isDisabled={!isEditing}
                />
              </Box>
              <Box>
                <Text mb="1" color="gray.600">
                  Inquiry Info
                </Text>
                <Textarea
                  mb="3"
                  placeholder="Inquiry Info"
                  value={editedInquiryData?.info || ""}
                  onChange={(e) =>
                    setEditedInquiryData({
                      ...editedInquiryData,
                      info: e.target.value,
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
                onClick={() => handleEditInquiry(editedInquiryData)}
              >
                Edit
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}