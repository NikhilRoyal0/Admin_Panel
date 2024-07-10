import React, { useState, useEffect } from "react";
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
  Table,
  Tr,
  Td,
  Thead,
  Tbody,
  Th,
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
import {
  selectmoduleData,
  selectmoduleError,
  selectmoduleLoading,
  fetchmoduleData,
} from "../../../app/Slices/moduleSlice";
import NetworkError from "../../NotFound/networkError";
import { useParams } from "react-router-dom";
import { getModulePermissions } from "../../../utils/permissions";
import { ChevronDownIcon } from "@chakra-ui/icons";
import PaymentPage from "./PaymentPage";

export default function Planner() {
  const [isAddbranchPlannerModalOpen, setIsAddbranchPlannerModalOpen] =
    useState(false);
  const [selectedplanerId, setSelectedplanerId] = useState(null);
  const [editedbranchPlannerData, setEditedbranchPlannerData] = useState({
    branchId: "",
    admissionFee: "",
    admissionDiscount: "",
    paymentMode: "",
    kitFee: "",
    websiteUrl: "",
    module: JSON.stringify([]), // Ensure this is initialized as a valid JSON string
  });
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
    paymentMode: [],
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
    if (isAddbranchPlannerModalOpen) {
      setNewbranchPlannerData((prevData) => ({
        ...prevData,
        module: Array.isArray(prevData.module)
          ? prevData.module.filter((m) => m.moduleId !== moduleId)
          : [],
      }));
    } else if (isEditModalOpen) {
      setEditedbranchPlannerData((prevData) => {
        const parsedModules = JSON.parse(prevData.module || "[]");
        const updatedModules = parsedModules.filter(
          (m) => m.moduleId !== moduleId
        );
        return {
          ...prevData,
          module: JSON.stringify(updatedModules),
        };
      });
    }
  };

  const handleCheckboxChange = (module, isChecked) => {
    if (isAddbranchPlannerModalOpen) {
      if (isChecked) {
        setNewbranchPlannerData((prevData) => ({
          ...prevData,
          module: [...prevData.module, module],
        }));
      } else {
        setNewbranchPlannerData((prevData) => ({
          ...prevData,
          module: prevData.module.filter((m) => m.moduleId !== module.moduleId),
        }));
      }
    } else if (isEditModalOpen) {
      if (isChecked) {
        const updatedModules = [
          ...(editedbranchPlannerData.module
            ? JSON.parse(editedbranchPlannerData.module)
            : []),
          module,
        ];

        setEditedbranchPlannerData((prevData) => ({
          ...prevData,
          module: JSON.stringify(updatedModules),
        }));
      } else {
        const parsedModules = JSON.parse(
          editedbranchPlannerData.module || "[]"
        );
        const updatedModules = parsedModules.filter(
          (m) => m.moduleId !== module.moduleId
        );

        setEditedbranchPlannerData((prevData) => ({
          ...prevData,
          module: JSON.stringify(updatedModules),
        }));
      }
    }
  };

  const handleAddbranchPlanner = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("branchId", branchId);
    formData.append("admissionFee", newbranchPlannerData.admissionFee);
    formData.append(
      "admissionDiscount",
      newbranchPlannerData.admissionDiscount
    );
    formData.append("kitFee", newbranchPlannerData.kitFee);
    formData.append("websiteUrl", newbranchPlannerData.websiteUrl);
    formData.append("module", JSON.stringify(newbranchPlannerData.module));
    console.log("Form Data:", newbranchPlannerData.paymentMode);
    formData.append(
      "paymentMode",
      JSON.stringify(newbranchPlannerData.paymentMode)
    );

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
          admissionDiscount: "",
          paymentMode: [],
          kitFee: "",
          websiteUrl: "",
          module: [],
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
    setEditedbranchPlannerData({
      ...branchPlanner,
      module: branchPlanner.module || JSON.stringify([]),
    });
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      admissionFee: editedbranchPlannerData.admissionFee,
      admissionDiscount: editedbranchPlannerData.admissionDiscount,
      paymentMode: JSON.stringify(newbranchPlannerData.paymentMode),
      kitFee: editedbranchPlannerData.kitFee,
      websiteUrl: editedbranchPlannerData.websiteUrl,
      module: editedbranchPlannerData.module,
    };

    dispatch(
      updatebranchPlannerData(editedbranchPlannerData.planerId, formData)
    )
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
    return <NetworkError />;
  }

  const selectedPlan = branchPlannerData.filter(
    (branch) => branch.branchId == branchId
  );

  const branchManagementPermissions = getModulePermissions("Branch");

  if (!branchManagementPermissions) {
    return <NetworkError />;
  }

  const canEditBranch = branchManagementPermissions.update;

  return (
    <Box p="0" width="100%">
      <Flex align="center" justify="space-between">
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Branch Plan
        </Text>
        <Flex align="center">
          {selectedPlan.length === 0 && (
            <Button
              mr={5}
              ml="2"
              colorScheme="teal"
              size="sm"
              isLoading={isSaveLoading}
              onClick={() => setIsAddbranchPlannerModalOpen(true)}
            >
              Create Branch Plan
            </Button>
          )}
        </Flex>
      </Flex>
      {selectedPlan.map((branch) => (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Field</Th>
              <Th>Details</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td fontWeight="bold">Admission Fee</Td>
              <Td>{branch.admissionFee}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Admission Discount</Td>
              <Td>{branch.admissionDiscount}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Payment Mode</Td>
              <Td>
                {branch.paymentMode &&
                Array.isArray(JSON.parse(branch.paymentMode)) ? (
                  JSON.parse(branch.paymentMode).map((modeObj, index) => (
                    <span key={index}>
                      {modeObj.mode}
                      {index !== JSON.parse(branch.paymentMode).length - 1
                        ? ", "
                        : ""}
                    </span>
                  ))
                ) : (
                  <span>No payment mode selected</span>
                )}
              </Td>
            </Tr>

            <Tr>
              <Td fontWeight="bold">Kit Fee</Td>
              <Td>{branch.kitFee}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Website URL</Td>
              <Td>{branch.websiteUrl}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Modules</Td>
              <Td>
                {branch.module ? (
                  JSON.parse(branch.module).map((module) => (
                    <Tag
                      size="md"
                      key={module.moduleId}
                      borderRadius="full"
                      variant="solid"
                      colorScheme="teal"
                      mr={2}
                      mb={2}
                    >
                      <TagLabel>{module.title}</TagLabel>
                    </Tag>
                  ))
                ) : (
                  <Text>No modules selected</Text>
                )}
              </Td>
            </Tr>
          </Tbody>
          {canEditBranch && (
            <Tr>
              <Td colSpan="2" textAlign="center">
                <Button
                  colorScheme="teal"
                  size="sm"
                  onClick={() => handleEditbranchPlanner(branch)}
                >
                  Edit
                </Button>
              </Td>
            </Tr>
          )}
        </Table>
      ))}

      <Modal
        isOpen={isAddbranchPlannerModalOpen}
        onClose={() => setIsAddbranchPlannerModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Branch Planner</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              placeholder="Admission Fee"
              value={newbranchPlannerData.admissionFee}
              onChange={(e) =>
                setNewbranchPlannerData((prevData) => ({
                  ...prevData,
                  admissionFee: e.target.value,
                }))
              }
              mb={4}
            />
            <Input
              placeholder="Admission Discount"
              value={newbranchPlannerData.admissionDiscount}
              onChange={(e) =>
                setNewbranchPlannerData((prevData) => ({
                  ...prevData,
                  admissionDiscount: e.target.value,
                }))
              }
              mb={4}
            />
            <PaymentPage
              newbranchPlannerData={newbranchPlannerData}
              setNewbranchPlannerData={setNewbranchPlannerData}
            />
            <Input
              placeholder="Kit Fee"
              value={newbranchPlannerData.kitFee}
              onChange={(e) =>
                setNewbranchPlannerData((prevData) => ({
                  ...prevData,
                  kitFee: e.target.value,
                }))
              }
              mb={4}
            />
            <Input
              placeholder="Website URL"
              value={newbranchPlannerData.websiteUrl}
              onChange={(e) =>
                setNewbranchPlannerData((prevData) => ({
                  ...prevData,
                  websiteUrl: e.target.value,
                }))
              }
              mb={4}
            />
            <Button colorScheme="teal" onClick={onSelectModuleModalOpen} mb={4}>
              Select Modules
            </Button>
            {newbranchPlannerData.module &&
              newbranchPlannerData.module.map((module) => (
                <Tag
                  size="md"
                  key={module.moduleId}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="teal"
                  mr={2}
                  mb={2}
                >
                  <TagLabel>{module.title}</TagLabel>
                  <TagCloseButton
                    onClick={() => handleRemoveModule(module.moduleId)}
                  />
                </Tag>
              ))}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => setIsAddbranchPlannerModalOpen(false)}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleAddbranchPlanner}
              ml={3}
              isLoading={isSaveLoading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Branch Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              placeholder="Admission Fee"
              value={editedbranchPlannerData.admissionFee}
              onChange={(e) =>
                setEditedbranchPlannerData((prevData) => ({
                  ...prevData,
                  admissionFee: e.target.value,
                }))
              }
              mb={4}
            />
            <Input
              placeholder="Admission Discount"
              value={editedbranchPlannerData.admissionDiscount}
              onChange={(e) =>
                setEditedbranchPlannerData((prevData) => ({
                  ...prevData,
                  admissionDiscount: e.target.value,
                }))
              }
              mb={4}
            />
            <PaymentPage
              newbranchPlannerData={newbranchPlannerData}
              setNewbranchPlannerData={setNewbranchPlannerData}
            />
            <Input
              placeholder="Kit Fee"
              value={editedbranchPlannerData.kitFee}
              onChange={(e) =>
                setEditedbranchPlannerData((prevData) => ({
                  ...prevData,
                  kitFee: e.target.value,
                }))
              }
              mb={4}
            />
            <Input
              placeholder="Website URL"
              value={editedbranchPlannerData.websiteUrl}
              onChange={(e) =>
                setEditedbranchPlannerData((prevData) => ({
                  ...prevData,
                  websiteUrl: e.target.value,
                }))
              }
              mb={4}
            />
            <Button colorScheme="teal" onClick={onSelectModuleModalOpen} mb={4}>
              Select Modules
            </Button>
            {editedbranchPlannerData.module &&
              JSON.parse(editedbranchPlannerData.module).map((module) => (
                <Tag
                  size="md"
                  key={module.moduleId}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="teal"
                  mr={2}
                  mb={2}
                >
                  <TagLabel>{module.title}</TagLabel>
                  <TagCloseButton
                    onClick={() => handleRemoveModule(module.moduleId)}
                  />
                </Tag>
              ))}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button
              colorScheme="teal"
              onClick={handleSaveChanges}
              ml={3}
              isLoading={isSaveLoading}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
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
              placeholder="Search Modules"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              mb={4}
            />
            <Accordion allowToggle>
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
                      isChecked={(isAddbranchPlannerModalOpen
                        ? newbranchPlannerData.module
                        : JSON.parse(editedbranchPlannerData.module || "[]")
                      ).some((m) => m.moduleId === module.moduleId)}
                      onChange={(e) =>
                        handleCheckboxChange(module, e.target.checked)
                      }
                    >
                      <Box mt="2" ml={2}>
                        <Text>
                          <b>Year:</b> {module.year}
                        </Text>
                        <Text>
                          <b>Price:</b> {module.price}
                        </Text>
                        <Text>
                          <b>Class:</b> {module.class}
                        </Text>
                        <Text>
                          <b>Published By:</b> {module.publishedBy}
                        </Text>
                      </Box>
                    </Checkbox>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onSelectModuleModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
