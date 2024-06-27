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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Checkbox,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import {
  fetchbranchPlannerData,
  selectbranchPlannerData,
  selectbranchPlannerLoading,
  selectbranchPlannerError,
  AddbranchPlannerData,
  updatebranchPlannerData,
} from "../../../app/Slices/branchPlanner";
import { selectmoduleData, selectmoduleError, selectmoduleLoading, fetchmoduleData } from "../../../app/Slices/moduleSlice";
import NetworkError from "../../NotFound/networkError";
import { useParams } from "react-router-dom";
import { getModulePermissions } from "../../../utils/permissions";
import { ChevronDownIcon } from "@chakra-ui/icons";


export default function Planner() {
  const [isAddbranchPlannerModalOpen, setIsAddbranchPlannerModalOpen] = useState(false);
  const [selectedplanerId, setSelectedplanerId] = useState(null);
  const [editedbranchPlannerData, setEditedbranchPlannerData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const { branchId } = useParams();

  const {
    isOpen: isSelectModuleModalOpen,
    onOpen: onSelectModuleModalOpen,
    onClose: onSelectModuleModalClose,
  } = useDisclosure();

  const [newbranchPlannerData, setNewbranchPlannerData] = useState({
    branchId: branchId,
    admissionFee: "",
    admissionDiscount: "",
    paymentMode: "",
    kitFee: "",
    websiteUrl: "",
    module: [],
  });

  const branchPlannerData = useSelector(selectbranchPlannerData);
  const moduleData = useSelector(selectmoduleData);
  const moduleError = useSelector(selectmoduleError);
  const moduleLoading = useSelector(selectmoduleLoading);
  const isLoading = useSelector(selectbranchPlannerLoading);
  const error = useSelector(selectbranchPlannerError);
  const dispatch = useDispatch();
  const Toast = useToast({
    position: "top-right",
  });

  useEffect(() => {
    dispatch(fetchbranchPlannerData());
    dispatch(fetchmoduleData());
  }, [dispatch]);


  const filteredModules = moduleData.filter((module) =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveModule = (moduleId) => {
    setNewbranchPlannerData((prevData) => ({
      ...prevData,
      module: (prevData.module || []).filter((module) => module.moduleId !== moduleId),
    }));
  };

  const handleCheckboxChange = (module, isChecked) => {
    setNewbranchPlannerData((prevData) => ({
      ...prevData,
      module: isChecked
        ? [...(prevData.module || []), module]
        : (prevData.module || []).filter((m) => m.moduleId !== module.moduleId),
    }));
  };

  const handleAddbranchPlanner = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("branchId", branchId);
    formData.append("admissionFee", newbranchPlannerData.admissionFee);
    formData.append("admissionDiscount", newbranchPlannerData.admissionDiscount);
    formData.append("paymentMode", newbranchPlannerData.paymentMode);
    formData.append("kitFee", newbranchPlannerData.kitFee);
    formData.append("websiteUrl", newbranchPlannerData.websiteUrl);
    formData.append("module", JSON.stringify(newbranchPlannerData.module));
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


  const handleEditbranchPlanner = (branchPlanner) => {
    setSelectedplanerId(branchPlanner.planerId);
    setEditedbranchPlannerData(branchPlanner);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      admissionFee: editedbranchPlannerData.admissionFee,
      admissionDiscount: editedbranchPlannerData.admissionDiscount,
      paymentMode: editedbranchPlannerData.paymentMode,
      kitFee: editedbranchPlannerData.kitFee,
      websiteUrl: editedbranchPlannerData.websiteUrl,
      module: editedbranchPlannerData.module,
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

  if (isLoading || moduleLoading) {
    return (
      <Flex justify="center" align="center" h="32vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error || moduleError) {
    return (
      <NetworkError />
    );
  }


  const selectedPlan = branchPlannerData.filter(branch => branch.branchId == (branchId));

  const branchManagementPermissions = getModulePermissions('Branch');

  if (!branchManagementPermissions) {
    return <NetworkError />;
  }

  const canEditBranch = branchManagementPermissions.update;

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
          <Flex justify="center" align="center" height="100%">
            <Box textAlign="center">
              <Text fontSize="xl" fontWeight="bold">No branch plan available</Text>
            </Box>
          </Flex>
        ) : (
          <Flex width={"fit-content"} justifyContent="space-between">
            {selectedPlan.map((branchPlanner, index) => (
              <Box
                key={index}
                width={["100%", "100%"]}
                p="5"
                bg="white"
                boxShadow="md"
                borderRadius="md"
                borderBottom="1px"
                borderColor="gray.200"
                mb="20px"
              >
                <Text >Admission Fee: {branchPlanner.admissionFee}</Text>
                <Text >Admission Discount: {branchPlanner.admissionDiscount}%</Text>
                <Text >Payment Mode: {branchPlanner.paymentMode}</Text>
                <Text >Kit Fee: {branchPlanner.kitFee}</Text>
                <Text >Website Url: {branchPlanner.websiteUrl}</Text>
                <Text >Module: {branchPlanner.module}</Text>

                <Flex mt="3">
                  <Button
                    size="xs"
                    colorScheme="teal"
                    mr="1"
                    onClick={() => {
                      if (canEditBranch) {
                        handleEditbranchPlanner(branchPlanner);
                      } else {
                        Toast({
                          title: "You don't have permission to edit branch plan",
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
          <ModalContent>
            <ModalHeader>Add Plan</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input mb="3" placeholder="Branch Id" value={branchId} isRequired />
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
                placeholder="Admission Discount"
                value={newbranchPlannerData.admissionDiscount}
                onChange={(e) =>
                  setNewbranchPlannerData({
                    ...newbranchPlannerData,
                    admissionDiscount: e.target.value,
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

              <Box mb="3" p="2" borderWidth="1px" borderRadius="md">
                {newbranchPlannerData.module && newbranchPlannerData.module.length > 0 ? (
                  newbranchPlannerData.module.map((module) => (
                    <Tag
                      key={module.moduleId}
                      size="lg"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="teal"
                      m="1"
                    >
                      <TagLabel>{module.title}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveModule(module.moduleId)} />
                    </Tag>
                  ))
                ) : (
                  <Button
                    rightIcon={<ChevronDownIcon />}
                    onClick={onSelectModuleModalOpen}
                  >
                    Select Modules
                  </Button>
                )}
              </Box>
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
        </form>
      </Modal>

      <Modal
        isOpen={isSelectModuleModalOpen}
        onClose={onSelectModuleModalClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Modules</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              mb="3"
              placeholder="Search Modules"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Accordion allowMultiple>
              {filteredModules.map((module) => (
                <AccordionItem key={module.moduleId}>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      {module.title}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <Checkbox
                      value={module.moduleId}
                      isChecked={newbranchPlannerData.module?.some((m) => m.moduleId === module.moduleId) || false}
                      onChange={(e) => handleCheckboxChange(module, e.target.checked)}
                    >
                      {module.title}
                    </Checkbox>
                    <Box mt="2">
                      <Text><b>Year:</b> {module.year}</Text>
                      <Text><b>Price:</b> {module.price}</Text>
                      <Text><b>Class:</b> {module.class}</Text>
                      <Text><b>Published By:</b> {module.publishedBy}</Text>
                    </Box>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onSelectModuleModalClose}>
              Close
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
              <Text mb="1" color="gray.600">
                Payment Mode
              </Text>
              <Input
                mb="3"
                placeholder="Payment Mode"
                value={editedbranchPlannerData?.paymentMode || ""}
                onChange={(e) =>
                  setEditedbranchPlannerData({
                    ...editedbranchPlannerData,
                    paymentMode: e.target.value,
                  })
                }
                required
              />
              <Text mb="1" color="gray.600">
                Kit Fee
              </Text>
              <Input
                mb="3"
                placeholder="Kit Fee"
                value={editedbranchPlannerData?.kitFee || ""}
                onChange={(e) =>
                  setEditedbranchPlannerData({
                    ...editedbranchPlannerData,
                    kitFee: e.target.value,
                  })
                }
                required
              />
              <Text mb="1" color="gray.600">
                Website URL
              </Text>
              <Input
                mb="3"
                placeholder="Website URL"
                value={editedbranchPlannerData?.websiteUrl || ""}
                onChange={(e) =>
                  setEditedbranchPlannerData({
                    ...editedbranchPlannerData,
                    websiteUrl: e.target.value,
                  })
                }
                required
              />
              <Text mb="1" color="gray.600">
                Admission Discount
              </Text>
              <Input
                mb="3"
                placeholder="Admission Fees"
                value={editedbranchPlannerData?.admissionDiscount || ""}
                onChange={(e) =>
                  setEditedbranchPlannerData({
                    ...editedbranchPlannerData,
                    admissionDiscount: e.target.value,
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
