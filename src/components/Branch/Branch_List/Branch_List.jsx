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
  Grid,
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
import {
  fetchrolesData,
  selectrolesData,
  selectrolesError,
  selectrolesLoading,
} from "../../../app/Slices/roleSlice";
import NetworkError from "../../NotFound/networkError";
import { getModulePermissions } from "../../../utils/permissions";
import { useNavigate } from "react-router-dom";

export default function Branch_List() {
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [newBranchData, setNewBranchData] = useState({
    branchName: "",
    branchAdmin: "",
    branchAddress: "",
    status: "",
    branchPassword: "",
    branchEmail: "",
    branchPhone: "",
    walletAmount: 0,
    commission: 0,
    role: "",
    createdOn: Date.now(),
  });

  const BranchData = useSelector(selectBranchData);
  const roleData = useSelector(selectrolesData);
  const roleError = useSelector(selectrolesError);
  const roleLoading = useSelector(selectrolesLoading);
  const isLoading = useSelector(selectBranchLoading);
  const error = useSelector(selectBranchError);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Toast = useToast({
    position: "top-right",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCount, setFilteredCount] = useState(0);

  const [BranchPerPage, setBranchPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchBranchData());
    dispatch(fetchrolesData());
  }, [dispatch]);

  useEffect(() => {
    const filteredBranch = BranchData.filter((branch) => {
      return selectedStatus ? branch.status === selectedStatus : true;
    });
    setFilteredCount(filteredBranch.length);
  }, [selectedStatus, BranchData]);

  const handleAddBranch = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("branchName", newBranchData.branchName);
    formData.append("branchAdmin", newBranchData.branchAdmin);
    formData.append("branchAddress", newBranchData.branchAddress);
    formData.append("status", newBranchData.status);
    formData.append("branchPassword", newBranchData.branchPassword);
    formData.append("branchEmail", newBranchData.branchEmail);
    formData.append("branchPhone", newBranchData.branchPhone);
    formData.append("walletAmount", 0);
    formData.append("commission", 0);
    formData.append("role", newBranchData.role);
    formData.append("createdOn", Date.now());
    dispatch(AddBranchData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "Branch added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewBranchData({
          branchName: "",
          branchAdmin: "",
          branchAddress: "",
          status: null,
          branchPassword: "",
          branchEmail: "",
          branchPhone: "",
          walletAmount: "",
          commission: "",
          role: "",
          createdOn: "",
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
    navigate(`/branch/dashboard/${branchId}`);
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

  const filteredBranch = BranchData.filter((branch) => {
    const statusMatch = selectedStatus ? branch.status == selectedStatus : true;
    return statusMatch;
  });

  const totalPages = Math.ceil(filteredBranch.length / BranchPerPage);

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

  const indexOfLastBranch = currentPage * BranchPerPage;
  const indexOfFirstBranch = indexOfLastBranch - BranchPerPage;
  const currentBranch = filteredBranch.slice(
    indexOfFirstBranch,
    indexOfLastBranch
  );

  const branchManagementPermissions = getModulePermissions("Branch");

  if (!branchManagementPermissions) {
    return <NetworkError />;
  }

  const canAddBranch = branchManagementPermissions.create;
  const canDeleteBranch = branchManagementPermissions.delete;

  return (
    <Box p="3">
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Branch List ({filteredCount})
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
        </Grid>
      </Flex>
      <Box
        bg="gray.100"
        p="6"
        borderRadius="lg"
        overflowX="auto"
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
        {currentBranch.length === 0 ? (
          <Flex justify="center" align="center" height="100%">
            <Box textAlign="center">
              <Text fontSize="xl" fontWeight="bold">
                No branch available
              </Text>
            </Box>
          </Flex>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>Branch Id</Th>
                <Th>Branch Name</Th>
                <Th>Branch Admin</Th>
                <Th>Branch Address</Th>
                <Th>Branch Email</Th>
                <Th>Branch Phone</Th>
                <Th>Role</Th>
                <Th>View/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentBranch.map((Branch, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Branch.branchId}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Branch.branchName}
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
                              title:
                                "You don't have permission to delete branch",
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
        {currentBranch.length > 0 && (
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

      {/* Add Branch Modal */}
      <Modal
        isOpen={isAddBranchModalOpen}
        onClose={() => setIsAddBranchModalOpen(false)}
        size="3xl"
      >
        <ModalOverlay />
        <form onSubmit={handleAddBranch}>
          <ModalContent>
            <ModalHeader>Add Branch</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={3}
              >
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
                <Select
                  mb="3"
                  placeholder="Select status"
                  value={newBranchData.status}
                  onChange={(e) =>
                    setNewBranchData({
                      ...newBranchData,
                      status: e.target.value,
                    })
                  }
                  isRequired
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Disabled">Disabled</option>
                  <option value="NeedKyc">Need KYC</option>
                </Select>
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
                  placeholder="Branch Password"
                  value={newBranchData.branchPassword}
                  onChange={(e) =>
                    setNewBranchData({
                      ...newBranchData,
                      branchPassword: e.target.value,
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
                <Select
                  mb="3"
                  placeholder="Select Role"
                  value={newBranchData.role}
                  onChange={(e) =>
                    setNewBranchData({
                      ...newBranchData,
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
                onClick={() => setIsAddBranchModalOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>{" "}
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
