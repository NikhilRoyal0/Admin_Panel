import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Input,
  Flex,
  Spinner,
  Button,
  useToast,
  Select,
  Textarea,
  Grid,
  GridItem,
  Divider,
  Modal,
  ModalBody,
  Td,
  Tr,
  Table,
  Tbody,
  Heading,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import {
  fetchleadData,
  selectleadData,
  updateleadData,
  selectleadError,
  selectleadLoading,
} from "../../app/Slices/leadSlice";
import { getModulePermissions } from "../../utils/permissions";
import {
  AddStudentData,
  updateStudentData,
  checkStudentExistence,
} from "../../app/Slices/studentSlice";
import timeConversion from "../../utils/timeConversion";
import {
  selectrolesData,
  selectrolesError,
  selectrolesLoading,
  fetchrolesData,
} from "../../app/Slices/roleSlice";
import {
  selectcourseData,
  selectcourseError,
  selectcourseLoading,
  fetchcourseData,
} from "../../app/Slices/courseSlice";
import {
  selectBranchData,
  selectBranchError,
  selectBranchLoading,
  fetchBranchData,
} from "../../app/Slices/branchSlice";
import {
  selectbranchPlannerData,
  selectbranchPlannerError,
  selectbranchPlannerLoading,
  fetchbranchPlannerData,
} from "../../app/Slices/branchPlanner";
import {
  selectmoduleData,
  selectmoduleError,
  selectmoduleLoading,
  fetchmoduleData,
} from "../../app/Slices/moduleSlice";
import { updateinvoiceData } from "../../app/Slices/invoiceSlice";
import {
  selectinvoiceData,
  selectinvoiceError,
  selectinvoiceLoading,
  fetchinvoiceData,
} from "../../app/Slices/invoiceSlice";
import QualificationsModal from "./QualificationsModal";
import CourseSelect from "./CourseSelect";
import ModuleSelect from "./ModuleSelection";
import NetworkError from "../NotFound/networkError";
import BillComponent from "./BillComponent";
import { useReactToPrint } from "react-to-print";

export default function Edit_Leads() {
  const branchId = sessionStorage.getItem("BranchId");
  const { lead_id } = useParams();
  const error = useSelector(selectleadError);
  const isLoading = useSelector(selectleadLoading);
  const roleData = useSelector(selectrolesData);
  const roleError = useSelector(selectrolesError);
  const roleLoading = useSelector(selectrolesLoading);
  const courseData = useSelector(selectcourseData);
  const courseError = useSelector(selectcourseError);
  const courseLoading = useSelector(selectcourseLoading);
  const branchData = useSelector(selectBranchData);
  const branchLoading = useSelector(selectBranchLoading);
  const branchError = useSelector(selectBranchError);
  const plannerData = useSelector(selectbranchPlannerData);
  const plannerLoading = useSelector(selectbranchPlannerLoading);
  const plannerError = useSelector(selectbranchPlannerError);
  const invoiceData = useSelector(selectinvoiceData);
  const invoiceError = useSelector(selectinvoiceError);
  const invoiceLoading = useSelector(selectinvoiceLoading);
  const moduleData = useSelector(selectmoduleData);
  const moduleError = useSelector(selectmoduleError);
  const moduleLoading = useSelector(selectmoduleLoading);
  const billComponentRef = useRef();
  const [lead, setLead] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoice, setInvoice] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    password: "",
    phoneNumber: "",
    referCode: "",
    parentCode: "",
    role: "",
    walletAmount: "0",
    profilePhoto: "",
    branchFeeStructureId: "",
    currentCourseId: "",
    handledBy: "",
    deviceId: "",
    lastActiveAt: "",
    interestIn: "",
    reason: "",
    updatedOn: Date.now(),
    createdOn: "",
    branchId: "",
    primaryAddress: "",
    state: "",
    status: "",
    city: "",
    courses: "",
    qualifications: "[]",
    paymentMethods: "[]",
    module: "[]",
  });

  const leadData = useSelector(selectleadData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
  });

  useEffect(() => {
    if (!leadData.length) {
      dispatch(fetchleadData());
    }
    dispatch(fetchrolesData());
    dispatch(fetchcourseData());
    dispatch(fetchBranchData());
    dispatch(fetchbranchPlannerData());
    dispatch(fetchinvoiceData());
    dispatch(fetchmoduleData());
  }, [dispatch, leadData.length]);

  useEffect(() => {
    const leadDetails = leadData.find((lead) => lead.lead_id === lead_id);
    if (leadDetails) {
      setLead(leadDetails);
      setFormData(leadDetails);
    }
  }, [leadData, lead_id]);

  const handlePrintInvoice = useReactToPrint({
    content: () => billComponentRef.current,
  });

  const BranchData = branchData.filter((branch) => branch.status == "Active");

  const planner = plannerData.find((plan) => plan.branchId == branchId);

  if (!planner) {
    return (
      <Flex justify="center" align="center" h="80vh" bg="gray.50">
        <Text fontSize="3xl" fontWeight="bold" color="teal.500">
          No branch plan has been added. Please add a branch plan and try again.
        </Text>
      </Flex>
    );
  }
  const kitFee = planner.kitFee;

  const admissionFee = planner.admissionFee;

  const paymentMode = planner.paymentMode;

  if (!formData.courses || !formData.module) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }
  const courses = JSON.parse(formData.courses);
  const module = JSON.parse(formData.module);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleQualificationChange = (index, event) => {
    const { name, value } = event.target;
    const newQualifications = JSON.parse(formData.qualifications);
    newQualifications[index] = {
      ...newQualifications[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      qualifications: JSON.stringify(newQualifications),
    });
  };

  const addQualification = () => {
    const newQualifications = JSON.parse(formData.qualifications);
    if (newQualifications.length < 5) {
      newQualifications.push({
        qualification: "",
        highestQualification: "",
      });
      setFormData({
        ...formData,
        qualifications: JSON.stringify(newQualifications),
      });
    }
  };

  const removeQualification = (index) => {
    const newQualifications = JSON.parse(formData.qualifications);
    newQualifications.splice(index, 1);
    setFormData({
      ...formData,
      qualifications: JSON.stringify(newQualifications),
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "paymentMethods") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: JSON.stringify([value]),
        updatedOn: Date.now(),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        updatedOn: Date.now(),
      }));
    }
  };

  const coursesData =
    branchId == 0
      ? courseData
      : courseData.filter((course) => course.branchId == branchId);

  const invoices = invoiceData.find((item) => item.lead_id === lead_id);

  if (!invoices) {
    return null;
  }

  const totalPrices = courses.reduce(
    (acc, course) => acc + parseFloat(course.price),
    0
  );
  const totalModule = module.reduce(
    (acc, module) => acc + parseFloat(module.price),
    0
  );
  const discountedTotal =
    totalPrices * (1 - parseFloat(invoices.totalDiscount) / 100);
  const totalAmount =
    totalModule +
    discountedTotal +
    parseFloat(invoices.kitFee) +
    parseFloat(invoices.admissionFee);

  const handleSave = async () => {
    setIsSaveLoading(true);

    try {
      await dispatch(updateleadData(lead_id, formData));

      toast({
        title: "Lead updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Create the invoice data object
      const invoiceDataToSend = {
        studentName: formData.studentName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        courses: JSON.stringify(courses),
        paymentMethod: formData.paymentMethods,
        kitFee: invoices.kitFee,
        totalAmount: totalAmount,
        totalDiscount: invoices.totalDiscount,
        module: formData.module,
        userDiscount: invoices.userDiscount,
        branchDiscount: invoices.branchDiscount,
        branchId: branchId,
        admissionFee: invoices.admissionFee,
        lead_id: formData.lead_id,
      };

      // Dispatch the update invoice action
      await dispatch(updateinvoiceData(lead_id, invoiceDataToSend));

      toast({
        title: "Invoice updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsEditing(false);

      if (formData.status === "converted") {
        const { lead_id, lead_No, ...formData2 } = formData;

        dispatch(checkStudentExistence(formData2.student_id))
          .then((studentExists) => {
            if (studentExists) {
              dispatch(updateStudentData(formData2.student_id, formData2))
                .then(() => {
                  toast({
                    title: "Student data updated successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                })
                .catch((error) => {
                  toast({
                    title: "Failed to update student data",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                  console.log("Error updating student data: ", error);
                });
            } else {
              // If student does not exist, add the student data
              dispatch(AddStudentData(formData2))
                .then(() => {
                  toast({
                    title: "Student data added successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                })
                .catch((error) => {
                  toast({
                    title: "Failed to add student data",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                  console.log("Error adding student data: ", error);
                });
            }
          })
          .catch((error) => {
            toast({
              title: "Failed to check student existence",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            console.log("Error checking student existence: ", error);
          });
      }
    } catch (error) {
      toast({
        title: "Failed to update lead",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log("Error updating lead: ", error);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const handleCancel = () => {
    setIsEditing(false);
    dispatch(fetchleadData());
  };

  const handleViewInvoice = () => {
    setInvoice(true);
  };

  const LeadManagementPermissions = getModulePermissions("Inquiry");

  if (!LeadManagementPermissions) {
    return <NetworkError />;
  }

  const canEditData = LeadManagementPermissions.update;

  if (!lead) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (
    isLoading ||
    roleLoading ||
    courseLoading ||
    branchLoading ||
    plannerLoading ||
    invoiceLoading ||
    moduleLoading
  ) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (
    error ||
    roleError ||
    courseError ||
    branchError ||
    plannerError ||
    invoiceError ||
    moduleError
  ) {
    return <NetworkError />;
  }

  return (
    <Box p={2} m={5}>
      <Box
        m="auto"
        bg="white"
        boxShadow="md"
        p="4"
        borderRadius="md"
        overflow="auto"
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
        <Flex justify="space-between" align="center">
          <Flex direction="column" align="center">
            <Text fontSize="2xl" fontWeight="bold">
              Leads Details
            </Text>
            <Text
              fontSize="md"
              cursor="pointer"
              color="blue"
              fontWeight="bold"
              onClick={handleViewInvoice}
            >
              Invoice
            </Text>
          </Flex>
          <Flex>
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  colorScheme="teal"
                  mr={2}
                  isLoading={isSaveLoading}
                  spinner={<BeatLoader size={8} color="white" />}
                >
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  colorScheme="gray"
                  isDisabled={!isEditing}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  if (canEditData && formData.status !== "converted") {
                    handleEditToggle();
                  } else {
                    toast({
                      title: "You don't have permission to edit this lead",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                      position: "top-right",
                    });
                  }
                }}
                colorScheme="teal"
              >
                Edit
              </Button>
            )}
          </Flex>
        </Flex>
        <Divider my="4" />
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={4}
        >
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Student Name
            </Text>
            <Input
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Email
            </Text>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Password
            </Text>
            <Input
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Phone Number
            </Text>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Refer Code
            </Text>
            <Input
              name="referCode"
              type="text"
              value={formData.referCode}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Parent Code
            </Text>
            <Input
              name="parentCode"
              type="text"
              value={formData.parentCode}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Qualifications
            </Text>
            <Input
              name="qualifications"
              value={formData.qualifications}
              onClick={openModal}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Status
            </Text>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            >
              <option value="accepted">Accepted</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="converted">Converted</option>
            </Select>
          </GridItem>

          <GridItem>
            <Text mb={2} fontWeight="bold">
              Role
            </Text>
            <Select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            >
              {roleData.map((role) => (
                <option key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </option>
              ))}
            </Select>
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Wallet Amount
            </Text>
            <Input
              name="walletAmount"
              value={formData.walletAmount}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Profile Photo
            </Text>
            <Input
              name="profilePhoto"
              value={formData.profilePhoto}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Branch Fee Structure Id
            </Text>
            <Input
              name="branchFeeStructureId"
              value={formData.branchFeeStructureId}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Current Course Id
            </Text>
            <Input
              name="currentCourseId"
              value={formData.currentCourseId}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Handled By
            </Text>
            <Input
              name="handledBy"
              value={formData.handledBy}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Device Id
            </Text>
            <Input
              name="deviceId"
              value={formData.deviceId}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Created On
            </Text>
            <Input
              name="createdOn"
              value={timeConversion.unixTimeToRealTime(formData.createdOn)}
              isDisabled
              bg="gray.100"
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Branch
            </Text>
            <Select
              name="branchId"
              value={formData.branchId}
              onChange={handleInputChange}
              ml="2"
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            >
              {BranchData &&
                BranchData.map((branch) => (
                  <option key={branch.branchId} value={branch.branchId}>
                    {branch.branchName}
                  </option>
                ))}
            </Select>
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              State
            </Text>
            <Input
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              City
            </Text>
            <Input
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem colSpan={1}>
            <Text mb={2} fontWeight="bold">
              Primary Address
            </Text>
            <Textarea
              name="primaryAddress"
              value={formData.primaryAddress}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            />
          </GridItem>
          <GridItem>
            <Text mb={2} fontWeight="bold">
              Payment Method
            </Text>
            <Select
              name="paymentMethods"
              value={JSON.parse(formData.paymentMethods)[0] || ""}
              onChange={handleInputChange}
              isDisabled={!isEditing}
              bg={isEditing ? "white" : "gray.100"}
            >
              {JSON.parse(paymentMode).map((mode) => (
                <option key={mode.id} value={mode.mode}>
                  {mode.mode}
                </option>
              ))}
            </Select>
          </GridItem>
          <GridItem>
            <CourseSelect
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              coursesData={coursesData}
            />
          </GridItem>
          <GridItem>
            <ModuleSelect
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              moduleData={moduleData}
            />
          </GridItem>
        </Grid>

        <QualificationsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          qualifications={formData.qualifications}
          handleQualificationChange={handleQualificationChange}
          addQualification={addQualification}
          removeQualification={removeQualification}
        />
        <Modal isOpen={isInvoice} size="lg" onClose={() => setInvoice(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Invoice Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table variant="simple" size="md">
                <Tbody>
                  {courses.map((course) => (
                    <Tr key={course.courseId}>
                      <Td fontSize="lg">{course.courseTitle}</Td>
                      <Td textAlign="right" fontSize="lg">
                        Rs. {course.price}
                      </Td>
                    </Tr>
                  ))}
                  <Tr>
                    <Td colSpan={1} fontWeight="bold" fontSize="lg">
                      Kit Fee
                    </Td>
                    <Td textAlign="right" fontSize="lg" fontWeight="bold">
                      Rs. {kitFee}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td colSpan={1} fontWeight="bold" fontSize="lg">
                      Admission Fee
                    </Td>
                    <Td textAlign="right" fontSize="lg" fontWeight="bold">
                      Rs. {admissionFee}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td colSpan={1}>
                      <Heading size="md" mt={4}>
                        Total Amount:
                      </Heading>
                    </Td>
                    <Td colSpan={1}>
                      <Heading
                        size="md"
                        mt={4}
                        display="flex"
                        justifyContent="flex-end"
                      >
                        Rs. {totalAmount.toFixed(2)}
                      </Heading>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td colSpan={2} textAlign="right">
                      <Button colorScheme="blue" onClick={handlePrintInvoice}>
                        Download Invoice
                      </Button>

                      <div style={{ display: "none" }}>
                        <BillComponent
                          ref={billComponentRef}
                          lead_id={lead_id}
                        />
                      </div>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
