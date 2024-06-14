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
  Checkbox,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import {
  selectleadData,
  selectleadError,
  selectleadLoading,
  deleteleadData,
  updateleadData,
  fetchleadData,
} from "../../app/Slices/leadSlice";
import NetworkError from "../NotFound/networkError";
import { getModulePermissions } from "../../utils/permissions";
import { useNavigate } from "react-router-dom";
import {
  fetchBranchData,
  selectBranchData,
  selectBranchError,
  selectBranchLoading,
} from "../../app/Slices/branchSlice";
import {
  fetchcourseData,
  selectcourseData,
  selectcourseError,
  selectcourseLoading,
} from "../../app/Slices/courseSlice";
import TimeConversion from "../../utils/timeConversion";

export default function Data() {
  const branchId = sessionStorage.getItem("BranchId");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [editedLeadData, setEditedLeadData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [newLeadData, setNewLeadData] = useState({
    studentName: "",
    email: "",
    qualification: "",
    phoneNumber: "",
    updatedOn: "",
    branchId: "",
    primaryAddress: "",
    state: "",
    city: "",
    status: "",
    highestQualification: "",
    collegeName: "",
    boardUniversityName: "",
    hasCertificate: false,
    certificateNo: "",
    issuedBy: "",
    issueDate: "",
    otherQualifications: "",
    courses: "",
    paymentMethods: ""
  });

  const leadData = useSelector(selectleadData);
  const isLoading = useSelector(selectleadLoading);
  const error = useSelector(selectleadError);
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
  const [filteredCount, setFilteredCount] = useState(0);

  useEffect(() => {
    dispatch(fetchleadData());
    dispatch(fetchBranchData());
    dispatch(fetchcourseData());
  }, [dispatch]);

  const DataByBranch = branchId == 0 ? leadData : leadData.filter(user => user.branchId == branchId);

  useEffect(() => {
    const filteredLead = DataByBranch.filter((student) => {
      return selectedStatus ? student.status === selectedStatus : true;
    });
    setFilteredCount(filteredLead.length);
  }, [selectedStatus, DataByBranch]);

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deleteleadData(selectedLeadId))
      .then(() => {
        dispatch(fetchleadData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedLeadId(null);
        setIsSaveLoading(false);
        Toast({
          title: "Lead deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete Lead",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting Lead: ", error);
      });
  };

  const handleSaveChanges = () => {
    if (isEditing) {
      setIsSaveLoading(true);
    }
    const formData = {
      studentName: editedLeadData.studentName,
      email: editedLeadData.email,
      qualification: editedLeadData.qualification,
      phoneNumber: editedLeadData.phoneNumber,
      updatedOn: Date.now(),
      branchId: editedLeadData.branchId,
      primaryAddress: editedLeadData.primaryAddress,
      state: editedLeadData.state,
      city: editedLeadData.city,
      status: editedLeadData.status,
      highestQualification: editedLeadData.highestQualification,
      collegeName: editedLeadData.collegeName,
      boardUniversityName: editedLeadData.boardUniversityName,
      hasCertificate: editedLeadData.hasCertificate,
      certificateNo: editedLeadData.certificateNo,
      issuedBy: editedLeadData.issuedBy,
      issueDate: editedLeadData.issueDate,
      otherQualifications: editedLeadData.otherQualifications,
      courses: editedLeadData.courses,
      paymentMethods: editedLeadData.paymentMethods
    };

    dispatch(updateleadData(editedLeadData.lead_id, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedLeadId(null);
        dispatch(fetchleadData());
        setIsSaveLoading(false);
        setNewLeadData({
          studentName: "",
          email: "",
          qualification: "",
          phoneNumber: "",
          updatedOn: "",
          branchId: "",
          primaryAddress: "",
          state: "",
          city: "",
          status: "",
          highestQualification: "",
          collegeName: "",
          boardUniversityName: "",
          hasCertificate: false,
          certificateNo: "",
          issuedBy: "",
          issueDate: "",
          otherQualifications: "",
          courses: "",
          paymentMethods: ""
        });
        Toast({
          title: "Lead updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to update Lead",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating Lead: ", error);
      });
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  const handleCancel = () => {
    setIsEditModalOpen(false);
    setIsEditing(false);
  }

  const handleEditLead = (Lead) => {
    setIsEditing(true);
    setSelectedLeadId(Lead.lead_id);
    setEditedLeadData(Lead);
  };


  if (isLoading || branchLoading || courseLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error || branchError || courseError) {
    return <NetworkError />;
  }

  const filteredInquiries = DataByBranch.filter((Lead) => {
    const statusMatch = selectedStatus ? Lead.status === selectedStatus : true;
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

  const indexOfLastLead = currentPage * inquiriesPerPage;
  const indexOfFirstLead = indexOfLastLead - inquiriesPerPage;
  const currentInquiries = filteredInquiries.slice(indexOfFirstLead, indexOfLastLead);

  const LeadManagementPermissions = getModulePermissions("Inquiry");

  if (!LeadManagementPermissions) {
    return <NetworkError />;
  }

  const canDeleteData = LeadManagementPermissions.delete;
  const canEditData = LeadManagementPermissions.update;

  return (
    <Box p="3">
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Lead List
          ({filteredCount})
        </Text>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(1, 1fr)",
          }}
          gap={3}
          alignItems="center"
          mr={2}
        >
          <Select
            mr={5}
            placeholder="Filter by Status"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">InActive</option>
          </Select>
        </Grid>
      </Flex>
      <Box>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)",
          }}
          gap={4}
          justifyContent="center"
        >
          {currentInquiries.length === 0 ? (
            <Flex justify="center" align="center" height="100%">
              <Box textAlign="center">
                <Text fontSize="xl" fontWeight="bold">No leads available</Text>
              </Box>
            </Flex>
          ) : (
            currentInquiries.map((Lead) => (
              <Box
                key={Lead.lead_id}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="lg"
                maxW="xl"
              >
                <Flex justify="space-between">
                  <Text fontSize="lg" fontWeight="semibold">
                    {Lead.studentName}
                  </Text>
                  <Flex>
                    {canEditData && (
                      <Button
                        variant="outline"
                        colorScheme="blue"
                        size="sm"
                        mr={2}
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setEditedLeadData(Lead);

                        }}
                      >
                        View
                      </Button>
                    )}
                    {canDeleteData && (
                      <Button
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        onClick={() => {
                          setIsDeleteConfirmationModalOpen(true);
                          setSelectedLeadId(Lead.lead_id);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </Flex>
                </Flex>

                <Box mt={2}>
                  <Text>Email: {Lead.email}</Text>
                  <Text>Phone Number: {Lead.phoneNumber}</Text>
                  <Text>Status: {Lead.status}</Text>
                  <Text>Created On: {TimeConversion.unixTimeToRealTime(Lead.createdOn)}</Text>
                </Box>
              </Box>
            ))
          )}
        </Grid>
      </Box >

      <Flex justify="flex-end" mt="4">
        {currentInquiries.length > 0 && (
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

      <Modal size="5xl" isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Lead</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={3}>
              <FormControl mb={4}>
                <FormLabel>Student Name</FormLabel>
                <Input
                  value={editedLeadData.studentName}
                  isDisabled={!isEditing}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      studentName: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  isDisabled={!isEditing}
                  value={editedLeadData.email}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      email: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  isDisabled={!isEditing}
                  value={editedLeadData.phoneNumber}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Qualification</FormLabel>
                <Input
                  isDisabled={!isEditing}
                  value={editedLeadData.qualification}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      qualification: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Branch ID</FormLabel>
                <Input
                  isDisabled={!isEditing}
                  value={editedLeadData.branchId}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      branchId: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Primary Address</FormLabel>
                <Input
                  isDisabled={!isEditing}
                  value={editedLeadData.primaryAddress}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      primaryAddress: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>State</FormLabel>
                <Input
                  isDisabled={!isEditing}
                  value={editedLeadData.state}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      state: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>City</FormLabel>
                <Input
                  isDisabled={!isEditing}
                  value={editedLeadData.city}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      city: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Status</FormLabel>
                <Select
                  isDisabled={!isEditing}
                  value={editedLeadData.status}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">InActive</option>
                </Select>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Highest Qualification</FormLabel>
                <Input
                  isDisabled={!isEditing}
                  value={editedLeadData.highestQualification}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      highestQualification: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>College Name</FormLabel>
                <Input
                  isDisabled={!isEditing}
                  value={editedLeadData.collegeName}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      collegeName: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Board/University Name</FormLabel>
                <Input
                  isDisabled={!isEditing}
                  value={editedLeadData.boardUniversityName}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      boardUniversityName: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Has Certificate?</FormLabel>
                <Checkbox
                  isDisabled={!isEditing}
                  isChecked={editedLeadData.hasCertificate}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      hasCertificate: e.target.checked,
                    })
                  }
                >
                  Has Certificate
                </Checkbox>
              </FormControl>

              {editedLeadData.hasCertificate && (
                <>
                  <FormControl mb={4}>
                    <FormLabel>Certificate Number</FormLabel>
                    <Input
                      isDisabled={!isEditing}
                      value={editedLeadData.certificateNo}
                      onChange={(e) =>
                        setEditedLeadData({
                          ...editedLeadData,
                          certificateNo: e.target.value,
                        })
                      }
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel>Issued By</FormLabel>
                    <Input
                      isDisabled={!isEditing}
                      value={editedLeadData.issuedBy}
                      onChange={(e) =>
                        setEditedLeadData({
                          ...editedLeadData,
                          issuedBy: e.target.value,
                        })
                      }
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel>Issue Date</FormLabel>
                    <Input
                      isDisabled={!isEditing}
                      type="date"
                      value={editedLeadData.issueDate}
                      onChange={(e) =>
                        setEditedLeadData({
                          ...editedLeadData,
                          issueDate: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </>
              )}

              <FormControl mb={4}>
                <FormLabel>Other Qualifications</FormLabel>
                <Textarea
                  isDisabled={!isEditing}
                  value={editedLeadData.otherQualifications}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      otherQualifications: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Courses</FormLabel>
                <Select
                  isDisabled={!isEditing}
                  value={editedLeadData.courses}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      courses: e.target.value,
                    })
                  }
                >
                  {/* Populate options based on available courses */}
                  {courseData.map((course) => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseTitle}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Payment Methods</FormLabel>
                <Input
                  value={editedLeadData.paymentMethods}
                  onChange={(e) =>
                    setEditedLeadData({
                      ...editedLeadData,
                      paymentMethods: e.target.value,
                    })
                  }
                  isDisabled={!isEditing}
                />
              </FormControl>
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
                onClick={() => handleEditLead(editedLeadData)}
              >
                Edit
              </Button>
            )}
          </ModalFooter>

        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this lead?
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsDeleteConfirmationModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="red" isLoading={isSaveLoading} onClick={handleDeleteConfirmation}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box >
  );
}
