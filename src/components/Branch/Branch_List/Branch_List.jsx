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
  fetchBranchData,
  selectBranchData,
  selectBranchLoading,
  selectBranchError,
  AddBranchData,
  deleteBranchData,
  updateBranchData,
} from "../../../app/Slices/branchSlice";

export default function Branch_List() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [editedBranchData, setEditedBranchData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
  const Toast = useToast();

  var currentDate = new Date();

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

  const handleEditBranch = (Branch) => {
    setSelectedBranchId(Branch.bank_id);
    setEditedBranchData(Branch);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      branchName: editedBranchData.branchName,
      branchAdmin: editedBranchData.branchAdmin,
      branchAddress: editedBranchData.branchAddress,
      branchEmail: editedBranchData.branchEmail,
      branchPhone: editedBranchData.branchPhone,
      role: editedBranchData.role,
      primaryDeviceId: editedBranchData.primaryDeviceId,
    };

    dispatch(updateBranchData(editedBranchData.branchId, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedBranchId(null);
        dispatch(fetchBranchData());
        setIsSaveLoading(false);
        setNewBranchData({
          branchName: "",
          branchAdmin: "",
          branchAddress: "",
          branchEmail: "",
          branchPhone: "",
          role: "",
          primaryDeviceId: "",
        });
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
          title: "Failed to updating Branch",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating Branch: ", error);
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
      <Flex justify="center" align="center" h="100vh">
        <Text color="red">Error: {error}</Text>
      </Flex>
    );
  }

  return (
    <Box p="1" >
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Branch List
        </Text>
        <Flex align="center">
          <Button
            mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => setIsAddBranchModalOpen(true)}
          >
            Add Branch
          </Button>
        </Flex>
      </Flex>
      <Box bg="gray.100" p="6" borderRadius="lg" overflowX="auto">
        {BranchData.length === 0 ? (
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
                <Th>Edit/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {BranchData.map((Branch, index) => (
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
                        onClick={() => handleEditBranch(Branch)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => {
                          setSelectedBranchId(Branch.branchId);
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

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Branch</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text mb="1" color="gray.600">
                Branch Name
              </Text>
              <Input
                mb="3"
                placeholder="Branch Name"
                value={editedBranchData?.branchName || ""}
                onChange={(e) =>
                  setEditedBranchData({
                    ...editedBranchData,
                    branchName: e.target.value,
                  })
                }
                required
              />
            </Box>
            <Box>
              <Text mb="1" color="gray.600">
                Branch Code
              </Text>
              <Input
                mb="3"
                placeholder="Branch Address"
                value={editedBranchData?.branchAddress || ""}
                onChange={(e) =>
                  setEditedBranchData({
                    ...editedBranchData,
                    branchAddress: e.target.value,
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
