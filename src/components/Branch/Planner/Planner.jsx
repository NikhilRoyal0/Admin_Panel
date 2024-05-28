import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Input,
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
  useToast,
  SimpleGrid,
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
import { getModulePermissions } from "../../../utils/permissions";
import { useParams } from "react-router-dom";


export default function Planner() {
  const [isAddbranchPlannerModalOpen, setIsAddbranchPlannerModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedplanerId, setSelectedplanerId] = useState(null);
  const [editedbranchPlannerData, setEditedbranchPlannerData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const { branchId } = useParams();

  const [newbranchPlannerData, setNewbranchPlannerData] = useState({
    branchId: branchId,
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

  useEffect(() => {
    dispatch(fetchbranchPlannerData());
  }, [dispatch]);

  const handleAddbranchPlanner = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("branchId", branchId);
    formData.append("admissionFee", newbranchPlannerData.admissionFee);
    formData.append("paymentMode", newbranchPlannerData.paymentMode);
    formData.append("kitFee", newbranchPlannerData.kitFee);
    formData.append("websiteUrl", newbranchPlannerData.websiteUrl);
    dispatch(AddbranchPlannerData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "Branch plan added successfully",
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
          title: "Branch plan deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete branch plan",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting branch plan: ", error);
      });
  };

  const handleEditbranchPlanner = (branchPlanner) => {
    setSelectedplanerId(branchPlanner.planerId);
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
          title: "Branch Plan updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating branch plan",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating branch plan: ", error);
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


  const selectedPlan = branchPlannerData.filter(branch => branch.branchId === parseInt(branchId));

  return (
    <Box p="0" width="100%">
      <Flex align="center" justify="space-between" >
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Branch Plan
        </Text>
        <Flex align="center">
          {selectedPlan.length === 0 && (
            <Button
              mr={5}
              ml="4"
              colorScheme="teal"
              onClick={() => {
                setIsAddbranchPlannerModalOpen(true);
              }}
            >
              Add Plan
            </Button>
          )}

        </Flex>
      </Flex>
      <Box p="6" borderRadius="lg">
        {selectedPlan.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No Plan available
          </Text>
        ) : (
          <Flex width={"fit-content"} justifyContent="space-between">
            {selectedPlan.map((branchPlanner, index) => (
              <Box
                key={index}
                width={["100%", "100%"]} // Adjust width based on screen size
                p="5"
                bg="white"
                boxShadow="md"
                borderRadius="md"
                borderBottom="1px"
                borderColor="gray.200"
                mb="20px" // Add margin for spacing between boxes
              >
                <Text >Admission Fee: {branchPlanner.admissionFee}</Text>
                <Text >Admission Discount: {branchPlanner.admissionDiscount}%</Text>
                <Text >Payment Mode: {branchPlanner.paymentMode}</Text>
                <Text >Kit Fee: {branchPlanner.kitFee}</Text>
                <Text >Website Url: {branchPlanner.websiteUrl}</Text>

                <Flex mt="3">
                  <Button
                    size="xs"
                    colorScheme="teal"
                    mr="1"
                    onClick={() => {
                      handleEditbranchPlanner(branchPlanner);
                    }}
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
              </Box>
            ))}
          </Flex>

        )}
      </Box>

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
              <Input
                mb="3"
                placeholder="Branch Id"
                value={branchId}
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
      </Modal>

      <Modal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this Plan?</ModalBody>
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
