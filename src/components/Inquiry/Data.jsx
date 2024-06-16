import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

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

  const [selectedStatus, setSelectedStatus] = useState("pending");
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

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
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
  const canAddData = LeadManagementPermissions.create;

  const handleAddLead = () => {
    navigate('/leads/addLead');
  };

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
            <option value="accepted">Accepted</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="converted">Converted</option>
          </Select>
          <Button
            colorScheme="blue"
            onClick={() => {
              if (canAddData) { handleAddLead() } else {
                Toast({
                  title: "You don't have permission to add lead",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                  position: "top-right",
                });
              }
            }}
          >
            Add Lead
          </Button>
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
                    <Button
                      variant="outline"
                      colorScheme="blue"
                      size="sm"
                      mr={2}
                      onClick={() => {
                        navigate(`/leads/editLead/${Lead.lead_id}`);
                      }}
                    >
                      View
                    </Button>
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
                <Text fontSize="sm" color="gray.500">
                  Email: {Lead.email}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Phone: {Lead.phoneNumber}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Status: {Lead.status}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Branch: {Lead.branchId}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Created On: {TimeConversion.unixTimeToRealTime(Lead.createdOn)}
                </Text>
              </Box>
            ))
          )}
        </Grid>
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
      </Box>

      <Modal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Lead</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this lead?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              colorScheme="red"
              mr={3}
              onClick={() => setIsDeleteConfirmationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteConfirmation}
              isLoading={isSaveLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}