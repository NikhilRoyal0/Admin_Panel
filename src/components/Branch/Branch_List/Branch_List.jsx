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
  fetchBranchData,
  selectBranchData,
  selectBranchLoading,
  selectBranchError,
  AddBranchData,
  deleteBranchData,
} from "../../../app/Slices/branchSlice";
import NetworkError from "../../NotFound/networkError";
import { getModulePermissions } from "../../../utils/permissions";
import {useNavigate} from "react-router-dom";


export default function Branch_List() {
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newBranchData, setNewBranchData] = useState({
    branchName: "",
    branchAdmin: "",
    branchAddress: "",
    branchEmail: "",
    branchPhone: "",
    role: "",
    primaryDeviceId: "",
  });

  const BranchData = useSelector(selectBranchData);
  const isLoading = useSelector(selectBranchLoading);
  const error = useSelector(selectBranchError);
  const dispatch = useDispatch();
  const navigate  = useNavigate();
  const Toast = useToast({
    position: "top-right",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [BranchPerPage, setBranchPerPage] = useState(10);


  useEffect(() => {
    dispatch(fetchBranchData());
  }, [dispatch]);

  const handleAddBranch = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("branchName", newBranchData.branchName);
    formData.append("branchAdmin", newBranchData.branchAdmin);
    formData.append("branchAddress", newBranchData.branchAddress);
    formData.append("branchEmail", newBranchData.branchEmail);
    formData.append("branchPhone", newBranchData.branchPhone);
    formData.append("role", newBranchData.role);
    formData.append("primaryDeviceId", newBranchData.primaryDeviceId);
    dispatch(AddBranchData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "Branch updated/deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewBranchData({
          branchName: "",
          branchAdmin: "",
          branchAddress: "",
          branchEmail: "",
          branchPhone: "",
          role: "",
          primaryDeviceId: "",
        });
        setIsAddBranchModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to add Branch",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deleteBranchData(selectedBranchId))
      .then(() => {
        dispatch(fetchBranchData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedBranchId(null);
        setIsSaveLoading(false);
        Toast({
          title: "Branch added/updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete Branch",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting Branch: ", error);
      });
  };

  const handleViewBranch = (branchId) => {
    navigate(`../branch/dashboard/${branchId}`);
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

  const totalPages = Math.ceil(BranchData.length / BranchPerPage);

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

  const indexOfLastBranch = currentPage * BranchPerPage;
  const indexOfFirstBranch = indexOfLastBranch - BranchPerPage;
  const currentBranch = BranchData.slice(indexOfFirstBranch, indexOfLastBranch);


  const branchManagementPermissions = getModulePermissions('Branch');
  const canAddBranch = branchManagementPermissions.create;
  const canDeleteBranch = branchManagementPermissions.delete;


  return (
    <Box p="3" >
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Branch List
        </Text>
        <Flex align="center">
          <Button
            mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => {
              if (canAddBranch) {
                setIsAddBranchModalOpen(true);
              } else {
                Toast({
                  title: "You don't have permission to add branch",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                  position: "top-right",
                });
              }
            }}
          >
            Add Branch
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
        {currentBranch.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No Branch available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>Branch Id</Th>
                <Th>Branch Admin</Th>
                <Th>Branch Address</Th>
                <Th>Branch Email</Th>
                <Th>Branch Phone</Th>
                <Th>Role</Th>
                <Th>Primary DeviceId</Th>
                <Th>View/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentBranch
                .filter(Branch => Branch.status === 'Active')
                .map((Branch, index) => (
                  <Tr key={index}>
                    <Td borderBottom="1px" borderColor="gray.200">
                      {Branch.branchId}
                    </Td>
                    <Td borderBottom="1px" borderColor="gray.200">
                      {Branch.branchAdmin}
                    </Td>
                    <Td borderBottom="1px" borderColor="gray.200">
                      {Branch.branchAddress}
                    </Td>
                    <Td borderBottom="1px" borderColor="gray.200">
                      {Branch.branchEmail}
                    </Td>
                    <Td borderBottom="1px" borderColor="gray.200">
                      {Branch.branchPhone}
                    </Td>
                    <Td borderBottom="1px" borderColor="gray.200">
                      {Branch.role}
                    </Td>
                    <Td borderBottom="1px" borderColor="gray.200">
                      {Branch.primaryDeviceId}
                    </Td>
                    <Td borderBottom="1px" borderColor="gray.200">
                      <Flex>
                        <Button
                          size="xs"
                          colorScheme="teal"
                          mr="1"
                          onClick={() => handleViewBranch(Branch.branchId)}
                          >
                          View
                        </Button>
                        <Button
                          size="xs"
                          colorScheme="red"
                          onClick={() => {
                            if (canDeleteBranch) {
                              setSelectedBranchId(Branch.branchId);
                              setIsDeleteConfirmationModalOpen(true);
                            } else {
                              Toast({
                                title: "You don't have permission to delete branch",
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
        <Button onClick={() => paginate(1)} mr={2}>&lt;&lt;</Button>
        <Button onClick={() => paginate(currentPage - 1)} mr={2}>&lt;</Button>
        {renderPagination()}
        <Button onClick={() => paginate(currentPage + 1)} ml={2}>&gt;</Button>
        <Button onClick={() => paginate(totalPages)} ml={2}>&gt;&gt;</Button>
      </Flex>

      {/* Add Branch Modal */}
      <Modal
        isOpen={isAddBranchModalOpen}
        onClose={() => setIsAddBranchModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddBranch}>
          {" "}
          <ModalContent>
            <ModalHeader>Add Branch</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form input fields for adding a new Branch */}
              <Input
                mb="3"
                placeholder="Branch Name"
                value={newBranchData.branchName}
                onChange={(e) =>
                  setNewBranchData({
                    ...newBranchData,
                    branchName: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Branch Admin"
                value={newBranchData.branchAdmin}
                onChange={(e) =>
                  setNewBranchData({
                    ...newBranchData,
                    branchAdmin: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Branch Address"
                value={newBranchData.branchAddress}
                onChange={(e) =>
                  setNewBranchData({
                    ...newBranchData,
                    branchAddress: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Branch Email"
                value={newBranchData.branchEmail}
                onChange={(e) =>
                  setNewBranchData({
                    ...newBranchData,
                    branchEmail: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Branch Phone"
                value={newBranchData.branchPhone}
                onChange={(e) =>
                  setNewBranchData({
                    ...newBranchData,
                    branchPhone: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Role"
                value={newBranchData.role}
                onChange={(e) =>
                  setNewBranchData({
                    ...newBranchData,
                    role: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Primary DeviceId"
                value={newBranchData.primaryDeviceId}
                onChange={(e) =>
                  setNewBranchData({
                    ...newBranchData,
                    primaryDeviceId: e.target.value,
                  })
                }
                isRequired
              />

            </ModalBody>
            <Divider />
            <ModalHeader>Branch Plan</ModalHeader>
            <ModalBody>
              <Input
                mb="3"
                placeholder="Branch Id"

                isRequired
              />
              <Input
                mb="3"
                placeholder="Admission Fee"

                isRequired
              />
              <Input
                mb="3"
                placeholder="Payment Mode"

                isRequired
              />
              <Input
                mb="3"
                placeholder="Kit Fee"
                isRequired
              />
              <Input
                mb="3"
                placeholder="Website Url"

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
                onClick={() => setIsAddBranchModalOpen(false)}
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
          <ModalBody>Are you sure you want to delete this Branch ?</ModalBody>
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
