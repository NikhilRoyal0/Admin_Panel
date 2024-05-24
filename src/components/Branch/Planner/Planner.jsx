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
  fetchbranchPlannerData,
  selectbranchPlannerData,
  selectbranchPlannerLoading,
  selectbranchPlannerError,
  AddbranchPlannerData,
  deletebranchPlannerData,
  updatebranchPlannerData,
} from "../../../app/Slices/branchPlanner";
import NetworkError from "../../NotFound/networkError";

export default function Planner() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddbranchPlannerModalOpen, setIsAddbranchPlannerModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedplanerId, setSelectedplanerId] = useState(null);
  const [editedbranchPlannerData, setEditedbranchPlannerData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newbranchPlannerData, setNewbranchPlannerData] = useState({
    branchId: "",
    admissionFee: "",
    paymentMode: "",
    kitFee: "",
    websiteUrl: "",
  });

  const branchPlannerData = useSelector(selectbranchPlannerData);
  const isLoading = useSelector(selectbranchPlannerLoading);
  const error = useSelector(selectbranchPlannerError);
  const dispatch = useDispatch();
  const Toast = useToast({
    position: "top-right",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [branchPlannerPerPage, setbranchPlannerPerPage] = useState(10);


  useEffect(() => {
    dispatch(fetchbranchPlannerData());
  }, [dispatch]);

  const handleAddbranchPlanner = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("branchId", newbranchPlannerData.branchId);
    formData.append("admissionFee", newbranchPlannerData.admissionFee);
    formData.append("paymentMode", newbranchPlannerData.paymentMode);
    formData.append("kitFee", newbranchPlannerData.kitFee);
    formData.append("websiteUrl", newbranchPlannerData.websiteUrl);
    dispatch(AddbranchPlannerData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "branchPlanner updated/deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewbranchPlannerData({
          branchId: "",
          admissionFee: "",
          paymentMode: "",
          kitFee: "",
          websiteUrl: "",
        });
        setIsAddbranchPlannerModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to add branchPlanner",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deletebranchPlannerData(selectedplanerId))
      .then(() => {
        dispatch(fetchbranchPlannerData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedplanerId(null);
        setIsSaveLoading(false);
        Toast({
          title: "branchPlanner added/updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete branchPlanner",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting branchPlanner: ", error);
      });
  };

  const handleEditbranchPlanner = (branchPlanner) => {
    setSelectedplanerId(branchPlanner.bank_id);
    setEditedbranchPlannerData(branchPlanner);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      admissionFee: editedbranchPlannerData.admissionFee,
    };

    dispatch(updatebranchPlannerData(editedbranchPlannerData.planerId, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedplanerId(null);
        dispatch(fetchbranchPlannerData());
        setIsSaveLoading(false);
        setNewbranchPlannerData({
          admissionFee: "",
        });
        Toast({
          title: "branchPlanner added/updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating branchPlanner",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating branchPlanner: ", error);
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

  const totalPages = Math.ceil(branchPlannerData.length / branchPlannerPerPage);

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

  const indexOfLastbranchPlanner = currentPage * branchPlannerPerPage;
  const indexOfFirstbranchPlanner = indexOfLastbranchPlanner - branchPlannerPerPage;
  const currentbranchPlanner = branchPlannerData.slice(indexOfFirstbranchPlanner, indexOfLastbranchPlanner);



  return (
    <Box p="3" >
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Plan List
        </Text>
        <Flex align="center">
          <Button
            mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => setIsAddbranchPlannerModalOpen(true)}
          >
            Add Plan
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
        {currentbranchPlanner.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No Plan available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>Branch Id</Th>
                <Th>Admission Fees</Th>
                <Th>Admission Discount</Th>
                <Th>Payment Mode</Th>
                <Th>Kit Fee</Th>
                <Th>Website Url</Th>
                <Th>Edit/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentbranchPlanner.map((branchPlanner, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {branchPlanner.planerId}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {branchPlanner.admissionFee}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {branchPlanner.admissionDiscount}%
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {branchPlanner.paymentMode}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {branchPlanner.kitFee}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {branchPlanner.websiteUrl}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="teal"
                        mr="1"
                        onClick={() => handleEditbranchPlanner(branchPlanner)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => {
                          setSelectedplanerId(branchPlanner.planerId);
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

      {/* Add branchPlanner Modal */}
      <Modal
        isOpen={isAddbranchPlannerModalOpen}
        onClose={() => setIsAddbranchPlannerModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddbranchPlanner}>
          {" "}
          <ModalContent>
            <ModalHeader>Add Plan</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form input fields for adding a new branchPlanner */}
              <Input
                mb="3"
                placeholder="Branch Id"
                value={newbranchPlannerData.branchId}
                onChange={(e) =>
                  setNewbranchPlannerData({
                    ...newbranchPlannerData,
                    branchId: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Admission Fee"
                value={newbranchPlannerData.admissionFee}
                onChange={(e) =>
                  setNewbranchPlannerData({
                    ...newbranchPlannerData,
                    admissionFee: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Payment Mode"
                value={newbranchPlannerData.paymentMode}
                onChange={(e) =>
                  setNewbranchPlannerData({
                    ...newbranchPlannerData,
                    paymentMode: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Kit Fee"
                value={newbranchPlannerData.kitFee}
                onChange={(e) =>
                  setNewbranchPlannerData({
                    ...newbranchPlannerData,
                    kitFee: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Website Url"
                value={newbranchPlannerData.websiteUrl}
                onChange={(e) =>
                  setNewbranchPlannerData({
                    ...newbranchPlannerData,
                    websiteUrl: e.target.value,
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
                onClick={() => setIsAddbranchPlannerModalOpen(false)}
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
          <ModalBody>Are you sure you want to delete this Plan ?</ModalBody>
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
          <ModalHeader>Edit Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text mb="1" color="gray.600">
                Admission Fees
              </Text>
              <Input
                mb="3"
                placeholder="Admission Fees"
                value={editedbranchPlannerData?.admissionFee || ""}
                onChange={(e) =>
                  setEditedbranchPlannerData({
                    ...editedbranchPlannerData,
                    admissionFee: e.target.value,
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
