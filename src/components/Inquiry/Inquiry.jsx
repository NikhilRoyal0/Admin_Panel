import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  Textarea,
  Grid,
  GridItem,
  Heading,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Stack,
  Spinner,
  Text,
  useToast,
  Image,
  Table,
  Tbody,
  Td,
  Tr,
  TableCaption,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  Slider,
  Thead,
  Th,
} from "@chakra-ui/react";
import { CheckCircleIcon, EditIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import NetworkError from "../NotFound/networkError";
import fallbackImage from "../../assets/images/imageError.png";
import passwordGenerator from "../../utils/passwordGenerator";
import {
  selectcourseData,
  selectcourseError,
  selectcourseLoading,
  fetchcourseData,
} from "../../app/Slices/courseSlice";
import {
  selectleadData,
  selectleadError,
  selectleadLoading,
  fetchleadData,
  AddleadData,
  updateleadData,
} from "../../app/Slices/leadSlice";
import {
  selectbranchPlannerData,
  selectbranchPlannerError,
  selectbranchPlannerLoading,
  fetchbranchPlannerData,
} from "../../app/Slices/branchPlanner";
import {
  selectreferenceData,
  selectreferenceError,
  selectreferenceLoading,
  fetchreferenceData,
  AddreferenceData,
} from "../../app/Slices/referenceSlice";
import {
  selectmoduleData,
  selectmoduleError,
  selectmoduleLoading,
  fetchmoduleData,
} from "../../app/Slices/moduleSlice";
import {
  AddinvoiceData,
  updateinvoiceData,
} from "../../app/Slices/invoiceSlice";
import BillComponent from "./BillComponent";
import { useReactToPrint } from "react-to-print";
import TimeConversion from "../../utils/timeConversion";

export default function Inquiry() {
  const branchId = sessionStorage.getItem("BranchId");
  const discountLimit = sessionStorage.getItem("discountLimit");
  const dispatch = useDispatch();
  const leadsData = useSelector(selectleadData);
  const courseData = useSelector(selectcourseData);
  const courseError = useSelector(selectcourseError);
  const courseLoading = useSelector(selectcourseLoading);
  const plannerData = useSelector(selectbranchPlannerData);
  const plannerLoading = useSelector(selectbranchPlannerLoading);
  const plannerError = useSelector(selectbranchPlannerError);
  const referenceData = useSelector(selectreferenceData);
  const referenceLoading = useSelector(selectreferenceLoading);
  const referenceError = useSelector(selectreferenceError);
  const moduleData = useSelector(selectmoduleData);
  const moduleError = useSelector(selectmoduleError);
  const moduleLoading = useSelector(selectmoduleLoading);
  const error = useSelector(selectleadError);
  const isLoading = useSelector(selectleadLoading);
  const Toast = useToast({
    position: "top-right",
  });
  const navigate = useNavigate();
  const billComponentRef = useRef();
  const [step, setStep] = useState(1);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasReference, setHasReference] = useState(false);
  const [referName, setReferName] = useState("");
  const [referPhone, setReferPhone] = useState("");
  const [sliderValue, setSliderValue] = useState(0);
  const [userDiscountIncluded, setUserDiscountIncluded] = useState(false);
  const [userDiscountValue, setUserDiscountValue] = useState(0);
  const [selectedModules, setSelectedModules] = useState([]);
  const [address, setAddress] = useState("");
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    password: passwordGenerator.password(),
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
    createdOn: Date.now(),
    updatedOn: Date.now(),
    branchId: branchId,
    primaryAddress: "",
    state: "",
    status: "pending",
    city: "",
    courses: "",
    referredBy: "",
    module: [],
    qualifications: [
      {
        qualification: "",
        highestQualification: "",
        collegeName: "",
        boardUniversityName: "",
        hasCertificate: false,
        startDate: "",
        endDate: "",
        gradeMarks: "",
        certificateNo: "",
        issuedBy: "",
        issueDate: "",
      },
    ],
    paymentMethods: [],
  });

  const [kitFeeIncluded, setKitFeeIncluded] = useState(true);
  const [admissionFeeIncluded, setadmissionFeeIncluded] = useState(true);

  useEffect(() => {
    dispatch(fetchleadData());
    dispatch(fetchcourseData());
    dispatch(fetchbranchPlannerData());
    dispatch(fetchbranchPlannerData());
    dispatch(fetchreferenceData());
    dispatch(fetchmoduleData());
  }, [dispatch]);

  const CourseData = courseData.filter(branch => branch.status == 'Active');
  const ModuleData = moduleData.filter(branch => branch.status == 'Active');

  const handlePrintInvoice = useReactToPrint({
    content: () => billComponentRef.current,
  });

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
  const admissionDiscount = planner.admissionDiscount;
  const paymentMode = JSON.parse(planner.paymentMode);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  
    if (name === "referName") {
      setReferName(value);
    } else if (name === "referPhone") {
      // Check if the phone number has changed
      if (formData.referPhone !== value) {
        setReferPhone(value);
  
        const reference = referenceData.find((ref) => ref.referPhone == value);
  
        if (reference) {
          setReferName(reference.referName);
          setAddress(reference.address);
  
          setFormData((prevData) => ({
            ...prevData,
            referredBy: reference.referenceId || "",
          }));
        } else {
          setReferName("");
          setAddress("");
          setFormData((prevData) => ({
            ...prevData,
            referredBy: "",
          }));
        }
      }
    } else if (name === "address") {
      setAddress(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleQualificationChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedQualifications = [...formData.qualifications];
    updatedQualifications[index][name] = type === "checkbox" ? checked : value;
    setFormData({ ...formData, qualifications: updatedQualifications });
  };

  const addQualification = () => {
    if (formData.qualifications.length < 5) {
      setFormData({
        ...formData,
        qualifications: [
          ...formData.qualifications,
          {
            qualification: "",
            highestQualification: "",
            collegeName: "",
            boardUniversityName: "",
            startDate: "",
            endDate: "",
            gradeMarks: "",
            hasCertificate: false,
            certificateNo: "",
            issuedBy: "",
            issueDate: "",
          },
        ],
      });
    }
  };

  const removeQualification = (index) => {
    const updatedQualifications = formData.qualifications.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, qualifications: updatedQualifications });
  };

  const handleCourseSelection = (courseId) => {
    if (!CourseData) {
      return;
    }

    const selectedCourse = CourseData.find(
      (course) => course.courseId == courseId
    );

    if (!selectedCourse) {
      return (
        <Flex justify="center" align="center" h="100vh">
          <Spinner size="xl" />
        </Flex>
      );
    }

    setSelectedCourses((prevSelectedCourses) => {
      const courseIndex = prevSelectedCourses.findIndex(
        (course) => course.courseId == courseId
      );

      if (courseIndex !== -1) {
        const updatedSelectedCourses = [...prevSelectedCourses];
        updatedSelectedCourses.splice(courseIndex, 1);
        return updatedSelectedCourses;
      } else {
        const newSelectedCourses = [...prevSelectedCourses, selectedCourse];
        return newSelectedCourses;
      }
    });
  };

  const handlePaymentMethodChange = (mode, checked) => {
    setFormData((prevState) => ({
      ...prevState,
      paymentMethods: {
        ...prevState.paymentMethods,
        [mode]: checked,
      },
    }));
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleCheckboxChange = () => {
    setHasReference((prev) => !prev);
  };

  const filteredModules = ModuleData.filter((module) =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModuleChange = (module, isChecked) => {
    if (isChecked) {
      setSelectedModules((prevSelectedModules) => [
        ...prevSelectedModules,
        module,
      ]);
    } else {
      setSelectedModules((prevSelectedModules) =>
        prevSelectedModules.filter((m) => m.moduleId !== module.moduleId)
      );
    }
  };

  const createReference = async () => {
    try {
      const existingReference = referenceData.find(
        (ref) => ref.referPhone == referPhone
      );

      if (existingReference) {
        return existingReference.referenceId;
      }

      if (hasReference && referPhone.length >= 8) {
        const newReferenceData = {
          referName: referName,
          referPhone: referPhone,
          address: address,
          createdOn: Date.now(),
          status: "active",
        };

        const response = await dispatch(AddreferenceData(newReferenceData));

        if (response && response.data && response.data.referenceId) {
          const { referenceId } = response.data;
          return referenceId;
        } else {
          throw new Error("Failed to retrieve referenceId from response");
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error creating reference:", error);

      Toast({
        title: "Error creating reference",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errorMessage } = validateStep();
    if (!isValid) {
      Toast({
        title: "Validation Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      const referenceId = await createReference();

      const selectedPaymentMethods = Object.keys(
        formData.paymentMethods
      ).filter((method) => formData.paymentMethods[method]);

      const formDataToSend = {
        ...formData,
        currentCourseId:
          selectedCourses.length > 0 ? selectedCourses[0].courseId : "",
        qualifications: JSON.stringify(formData.qualifications),
        courses: JSON.stringify(selectedCourses),
        paymentMethods: JSON.stringify(selectedPaymentMethods),
        referredBy: referenceId || formData.referredBy,
        module: JSON.stringify(selectedModules),
      };

      delete formDataToSend.referName;
      delete formDataToSend.referPhone;
      delete formDataToSend.address;

      let response;
      if (formData.lead_id) {
        response = await dispatch(
          updateleadData(formData.lead_id, formDataToSend)
        );
        validateStep();
        nextStep();
      } else {
        response = await dispatch(AddleadData(formDataToSend));
        nextStep();

        const { lead_id, student_id } = response.data;

        setFormData((prevState) => ({
          ...prevState,
          lead_id: lead_id,
          student_id: student_id,
        }));

        const { totalAmount } = calculateTotalAmount();
        const invoiceDataToSend = {
          studentName: formData.studentName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          courses: JSON.stringify(selectedCourses),
          paymentMethod: JSON.stringify(selectedPaymentMethods),
          createdOn: Date.now(),
          kitFee: kitFeeIncluded ? kitFee : "",
          totalAmount: totalAmount,
          totalDiscount: userDiscountValue,
          userDiscount: sliderValue,
          branchDiscount: sliderValue,
          branchId: branchId,
          admissionFee: admissionFeeIncluded ? admissionFee : "",
          lead_id: lead_id,
          module: JSON.stringify(selectedModules),
        };

        const invoiceResponse = await dispatch(
          AddinvoiceData(invoiceDataToSend)
        );
      }
    } catch (error) {
      console.error("Error handling form submission:", error);

      Toast({
        title: "Error handling form submission",
        description: error.message || "An unexpected error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const validateStep = () => {
    let errorMessage = "";

    switch (step) {
      case 1:
        if (formData.studentName === "")
          errorMessage = "Student name is required";
        else if (formData.email === "") errorMessage = "Email is required";
        else if (formData.phoneNumber === "")
          errorMessage = "Phone number is required";
        else if (formData.state === "") errorMessage = "State is required";
        else if (formData.city === "") errorMessage = "City is required";
        else if (formData.primaryAddress === "")
          errorMessage = "Primary address is required";
        else if (hasReference) {
          if (referName === "") errorMessage = "Reference name is required";
          else if (referPhone === "")
            errorMessage = "Reference phone number is required";
          else if (address === "")
            errorMessage = "Reference address is required";
        }
        break;
      case 2:
        if (
          formData.qualifications.length === 0 ||
          formData.qualifications[0].qualification === ""
        )
          errorMessage = "Qualification is required";
        else if (
          formData.qualifications[0].qualification === "Other" &&
          formData.qualifications[0].highestQualification === ""
        )
          errorMessage = "Highest qualification is required";
        else if (formData.qualifications[0].collegeName === "")
          errorMessage = "College name is required";
        else if (formData.qualifications[0].boardUniversityName === "")
          errorMessage = "Board/University name is required";
        else if (formData.qualifications[0].startDate === "")
          errorMessage = "Start date is required";
        else if (formData.qualifications[0].endDate === "")
          errorMessage = "End date is required";
        else if (formData.qualifications[0].gradeMarks === "")
          errorMessage = "Grade/Marks are required";
        break;
      case 3:
      case 4:
        // Validate selected courses
        if (selectedCourses.length === 0)
          errorMessage = "At least one course must be selected";
        break;
      case 5:
        break;
      case 6:
        break;
      default:
        break;
    }

    return { isValid: errorMessage === "", errorMessage };
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    const selectedCourseDetails = [];
    const selectedModuleDetails = [];

    // Calculate total amount for selected courses
    selectedCourses.forEach((selected) => {
      const course = CourseData.find(
        (course) => course.courseId === selected.courseId
      );

      if (course) {
        totalAmount += parseFloat(course.price) || 0;
        selectedCourseDetails.push({
          courseTitle: course.courseTitle,
          price: parseFloat(course.price).toFixed(2),
        });
      }
    });

    // Calculate total amount for selected modules

    // Calculate discounted amount
    let totalDiscountPercentage =
      sliderValue / 100 + (userDiscountIncluded ? userDiscountValue / 100 : 0);
    totalDiscountPercentage = Math.min(totalDiscountPercentage, 1);
    let discountedAmount = totalAmount - totalDiscountPercentage * totalAmount;

    selectedModules.forEach((selected) => {
      const module = ModuleData.find(
        (module) => module.moduleId === selected.moduleId
      );

      if (module) {
        discountedAmount += parseFloat(module.price) || 0;
        selectedModuleDetails.push({
          title: module.title,
          price: parseFloat(module.price).toFixed(2),
        });
      }
    });

    if (kitFeeIncluded) {
      discountedAmount += parseFloat(kitFee);
    }

    if (admissionFeeIncluded) {
      discountedAmount += parseFloat(admissionFee);
    }
    return {
      totalAmount: discountedAmount.toFixed(2),
      selectedCourseDetails,
      selectedModuleDetails,
    };
  };

  const handleUpdate = async () => {
    const { isValid, errorMessage } = validateStep();
    if (!isValid) {
      Toast({
        title: "Validation Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      const referenceId = await createReference();

      const selectedPaymentMethods = Object.keys(
        formData.paymentMethods
      ).filter((method) => formData.paymentMethods[method]);

      const formDataToSend = {
        ...formData,
        currentCourseId:
          selectedCourses.length > 0 ? selectedCourses[0].courseId : "",
        qualifications: JSON.stringify(formData.qualifications),
        courses: JSON.stringify(selectedCourses),
        paymentMethods: JSON.stringify(selectedPaymentMethods),
        referredBy: referenceId || formData.referredBy,
        module: JSON.stringify(selectedModules),
      };

      delete formDataToSend.referName;
      delete formDataToSend.referPhone;
      delete formDataToSend.address;

      if (validateStep()) {
        await dispatch(updateleadData(formData.lead_id, formDataToSend));

        const { totalAmount } = calculateTotalAmount();

        const invoiceDataToSend = {
          studentName: formData.studentName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          courses: JSON.stringify(selectedCourses),
          paymentMethod: JSON.stringify(selectedPaymentMethods),
          createdOn: Date.now(),
          kitFee: kitFeeIncluded ? kitFee : "",
          totalAmount: totalAmount,
          totalDiscount:
            parseFloat(userDiscountValue) + parseFloat(sliderValue),
          userDiscount: userDiscountValue,
          branchDiscount: sliderValue,
          branchId: branchId,
          admissionFee: admissionFeeIncluded ? admissionFee : "",
          lead_id: formData.lead_id,
          module: JSON.stringify(selectedModules),
        };

        if (formData.lead_id) {
          await dispatch(
            updateinvoiceData(formData.lead_id, invoiceDataToSend)
          );
        } else {
          console.error("Lead ID is not available for update.");
        }
        nextStep();
      }
    } catch (error) {
      console.error("Error updating lead:", error);

      Toast({
        title: "Error updating lead",
        description: error.message || "An unexpected error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleOkay = () => {
    if (step === 7) {
      setTimeout(() => {
        navigate("/leads");
      }, 500);
    }
  };

  if (
    isLoading ||
    courseLoading ||
    plannerLoading ||
    referenceLoading ||
    moduleLoading
  ) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error || courseError || plannerError || referenceError || moduleError) {
    return <NetworkError />;
  }

  const filteredCourses = CourseData.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box bg="gray.100" minHeight="100vh" p="4">
      <Flex alignItems="center" justifyContent="center" minHeight="100%">
        <Box p={8} maxW="5xl" w="100%">
          <Stack direction="row" spacing={4} justify="space-around" mb={4}>
            <Flex direction="column" alignItems="center">
              {step > 1 ? (
                <CheckCircleIcon color="green.500" boxSize="2em" />
              ) : (
                <EditIcon
                  color={step === 1 ? "blue.500" : "gray.500"}
                  boxSize="2em"
                />
              )}
              <Box mt={2}>Basic Details</Box>
            </Flex>
            <Flex direction="column" alignItems="center">
              {step > 2 ? (
                <CheckCircleIcon color="green.500" boxSize="2em" />
              ) : (
                <EditIcon
                  color={step === 2 ? "blue.500" : "gray.500"}
                  boxSize="2em"
                />
              )}
              <Box mt={2}>Educational Details</Box>
            </Flex>
            <Flex direction="column" alignItems="center">
              {step > 3 ? (
                <CheckCircleIcon color="green.500" boxSize="2em" />
              ) : (
                <EditIcon
                  color={step === 3 ? "blue.500" : "gray.500"}
                  boxSize="2em"
                />
              )}
              <Box mt={2}>Course Selection</Box>
            </Flex>
            <Flex direction="column" alignItems="center">
              {step > 4 ? (
                <CheckCircleIcon color="green.500" boxSize="2em" />
              ) : (
                <EditIcon
                  color={step === 4 ? "blue.500" : "gray.500"}
                  boxSize="2em"
                />
              )}
              <Box mt={2}>Modules</Box>
            </Flex>
            <Flex direction="column" alignItems="center">
              {step > 5 ? (
                <CheckCircleIcon color="green.500" boxSize="2em" />
              ) : (
                <EditIcon
                  color={step === 5 ? "blue.500" : "gray.500"}
                  boxSize="2em"
                />
              )}
              <Box mt={2}>Review</Box>
            </Flex>
            <Flex direction="column" alignItems="center">
              {step > 6 ? (
                <CheckCircleIcon color="green.500" boxSize="2em" />
              ) : (
                <EditIcon
                  color={step === 6 ? "blue.500" : "gray.500"}
                  boxSize="2em"
                />
              )}
              <Box mt={2}>Payment Mode</Box>
            </Flex>
          </Stack>
          <Card>
            <CardHeader>
              <Heading size="md" textAlign="center">
                {step === 1 ? "Basic Details" : ""}
                {step === 2 ? "Educational Details" : ""}
                {step === 3 ? "Course Selection" : ""}
                {step === 4 ? "Modules" : ""}
                {step === 5 ? "Review" : ""}
                {step === 6 ? "Payment Mode" : ""}
              </Heading>
            </CardHeader>
            <CardBody>
              {step === 1 && (
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    <Grid
                      templateColumns={{
                        base: "repeat(1, 1fr)",
                        sm: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                      }}
                      gap={4}
                    >
                      <GridItem>
                        <FormControl>
                          <FormLabel>Student Name</FormLabel>
                          <Input
                            type="text"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleChange}
                            required
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Primary Phone</FormLabel>
                          <Input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Refer Code</FormLabel>
                          <Input
                            type="text"
                            name="referCode"
                            value={formData.referCode}
                            onChange={handleChange}
                            required
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Parent Code</FormLabel>
                          <Input
                            type="text"
                            name="parentCode"
                            value={formData.parentCode}
                            onChange={handleChange}
                            required
                          />
                          <Checkbox
                            mt={2}
                            isChecked={hasReference}
                            onChange={handleCheckboxChange}
                          >
                            Have Reference
                          </Checkbox>
                        </FormControl>
                      </GridItem>
                      {hasReference && (
                        <>
                          <GridItem>
                            <FormControl>
                              <FormLabel>Refer Phone Number</FormLabel>
                              <Input
                                type="text"
                                name="referPhone"
                                value={referPhone}
                                onChange={handleChange}
                              />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl>
                              <FormLabel>Refer Name</FormLabel>
                              <Input
                                type="text"
                                name="referName"
                                value={referName}
                                onChange={handleChange}
                              />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl>
                              <FormLabel>Refer Address</FormLabel>
                              <Input
                                type="text"
                                name="address"
                                value={address}
                                onChange={handleChange}
                              />
                            </FormControl>
                          </GridItem>
                        </>
                      )}
                      <GridItem>
                        <FormControl>
                          <FormLabel>State</FormLabel>
                          <Input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>City</FormLabel>
                          <Input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Address</FormLabel>
                          <Textarea
                            type="text"
                            name="primaryAddress"
                            value={formData.primaryAddress}
                            onChange={handleChange}
                            required
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                    <HStack mt={8} spacing={4} justify="center">
                      {step > 1 && (
                        <Button colorScheme="blue" onClick={prevStep}>
                          Previous
                        </Button>
                      )}
                      <Button
                        colorScheme="blue"
                        onClick={(e) => {
                          handleSubmit(e);
                        }}
                        type="submit"
                      >
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              )}

              {step === 2 && (
                <form>
                  {formData.qualifications.map((qualification, index) => (
                    <VStack key={index} spacing={4} align="stretch">
                      <Grid
                        templateColumns={{
                          base: "repeat(1, 1fr)",
                          sm: "repeat(1, 1fr)",
                          md: "repeat(2, 1fr)",
                        }}
                        gap={4}
                      >
                        <FormControl>
                          <FormLabel>Qualification</FormLabel>
                          <Select
                            name="qualification"
                            value={qualification.qualification}
                            onChange={(e) =>
                              handleQualificationChange(index, e)
                            }
                            required
                          >
                            <option value="">Select</option>
                            <option value="Undergraduate">Undergraduate</option>
                            <option value="Postgraduate">Postgraduate</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Other">Other</option>
                          </Select>
                        </FormControl>
                        {qualification.qualification === "Other" && (
                          <FormControl>
                            <FormLabel>Highest Qualification</FormLabel>
                            <Input
                              type="text"
                              name="highestQualification"
                              value={qualification.highestQualification}
                              onChange={(e) =>
                                handleQualificationChange(index, e)
                              }
                              required
                            />
                          </FormControl>
                        )}
                        <FormControl>
                          <FormLabel>College/School Name</FormLabel>
                          <Input
                            type="text"
                            name="collegeName"
                            value={qualification.collegeName}
                            onChange={(e) =>
                              handleQualificationChange(index, e)
                            }
                            required
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Board University Name</FormLabel>
                          <Input
                            type="text"
                            name="boardUniversityName"
                            value={qualification.boardUniversityName}
                            onChange={(e) =>
                              handleQualificationChange(index, e)
                            }
                            required
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Start Date</FormLabel>
                          <Input
                            type="date"
                            name="startDate"
                            value={qualification.startDate}
                            onChange={(e) =>
                              handleQualificationChange(index, e)
                            }
                            required
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>End Date</FormLabel>
                          <Input
                            type="date"
                            name="endDate"
                            value={qualification.endDate}
                            onChange={(e) =>
                              handleQualificationChange(index, e)
                            }
                            required
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Grade/Marks</FormLabel>
                          <Input
                            type="text"
                            name="gradeMarks"
                            value={qualification.gradeMarks}
                            onChange={(e) =>
                              handleQualificationChange(index, e)
                            }
                            required
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Has Certificate?</FormLabel>
                          <Checkbox
                            name="hasCertificate"
                            isChecked={qualification.hasCertificate}
                            onChange={(e) =>
                              handleQualificationChange(index, e)
                            }
                          />
                        </FormControl>
                        {qualification.hasCertificate && (
                          <>
                            <FormControl>
                              <FormLabel>Certificate No.</FormLabel>
                              <Input
                                type="text"
                                name="certificateNo"
                                value={qualification.certificateNo}
                                onChange={(e) =>
                                  handleQualificationChange(index, e)
                                }
                                required
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Issued By</FormLabel>
                              <Input
                                type="text"
                                name="issuedBy"
                                value={qualification.issuedBy}
                                onChange={(e) =>
                                  handleQualificationChange(index, e)
                                }
                                required
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Issue Date</FormLabel>
                              <Input
                                type="date"
                                name="issueDate"
                                value={qualification.issueDate}
                                onChange={(e) =>
                                  handleQualificationChange(index, e)
                                }
                                required
                              />
                            </FormControl>
                          </>
                        )}
                      </Grid>
                      {formData.qualifications.length > 1 && (
                        <HStack>
                          <Button
                            colorScheme="red"
                            onClick={() => removeQualification(index)}
                          >
                            Remove
                          </Button>
                        </HStack>
                      )}
                    </VStack>
                  ))}
                  {formData.qualifications.length < 5 && (
                    <Button
                      mt={4}
                      colorScheme="green"
                      onClick={addQualification}
                    >
                      Add Qualification
                    </Button>
                  )}
                  <HStack mt={8} spacing={4} justify="center">
                    {step > 1 && (
                      <Button colorScheme="blue" onClick={prevStep}>
                        Previous
                      </Button>
                    )}
                    <Button
                      colorScheme="blue"
                      onClick={(e) => {
                        handleUpdate(e);
                      }}
                    >
                      Next
                    </Button>
                  </HStack>
                </form>
              )}

              {step === 3 && (
                <VStack spacing={4} align="stretch">
                  <Box position="relative">
                    <Input
                      type="text"
                      placeholder="Search by course name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      position="relative"
                      maxWidth={280}
                      top="0"
                      right="0"
                      mr={4}
                      px={2}
                      py={1}
                    />
                  </Box>
                  <Grid
                    templateColumns={{
                      base: "repeat(1, 1fr)",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                    }}
                    gap={6}
                    mb={4}
                  >
                    {filteredCourses.length === 0 ? (
                      <Flex justify="center" align="center" height="100%">
                        <Box textAlign="center">
                          <Text fontSize="xl" fontWeight="bold">
                            No course available
                          </Text>
                        </Box>
                      </Flex>
                    ) : (
                      filteredCourses.map((course, index) => (
                        <Box
                          key={index}
                          bg="white"
                          p="4"
                          borderRadius="lg"
                          boxShadow="md"
                          maxWidth="300px"
                          boxSizing="border-box"
                          transition="box-shadow 0.3s"
                          _hover={{
                            boxShadow: "2xl",
                          }}
                          display="flex"
                          flexDirection="column"
                          justifyContent="space-between"
                          height="100%"
                        >
                          <Box>
                            <Image
                              src={course.smallThumbnail}
                              alt={course.courseName}
                              borderRadius="lg"
                              mb="4"
                              height="200px"
                              width="100%"
                              objectFit="cover"
                              onError={(e) => (e.target.src = fallbackImage)}
                            />
                            <Text fontWeight="bold" mb="2">
                              {course.courseName}
                            </Text>
                            <Text mb="2">
                              <b>Duration:</b> {course.duration}
                            </Text>
                            <Text mb="2">
                              <b>Price:</b> {course.price}
                            </Text>
                            <Text mb="2">
                              <b>Short Info:</b> {course.shortInfo}
                            </Text>
                            <Checkbox
                              key={course.courseId}
                              isChecked={selectedCourses.some(
                                (selected) =>
                                  selected.courseId === course.courseId
                              )}
                              onChange={() => {
                                handleCourseSelection(
                                  course.courseId.toString()
                                );
                              }}
                            />
                          </Box>
                          <Flex alignItems="center" mt="auto"></Flex>
                        </Box>
                      ))
                    )}
                  </Grid>
                  <HStack mt={8} spacing={4} justify="center">
                    {step > 1 && (
                      <Button colorScheme="blue" onClick={prevStep}>
                        Previous
                      </Button>
                    )}
                    <Button
                      colorScheme="blue"
                      onClick={(e) => {
                        handleUpdate(e);
                      }}
                    >
                      Next
                    </Button>
                  </HStack>
                </VStack>
              )}

              {step === 4 && (
                <VStack spacing={4} align="stretch">
                  <Box position="relative">
                    <Input
                      type="text"
                      placeholder="Search by module title"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      position="relative"
                      maxWidth={280}
                      top="0"
                      right="0"
                      mr={4}
                      px={2}
                      py={1}
                    />
                  </Box>
                  <Table variant="simple">
                    <TableCaption>Modules</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>
                          <Checkbox
                            isChecked={false} // Placeholder for the header checkbox state
                            onChange={() => {}} // Placeholder for the header checkbox onChange handler
                          />
                        </Th>
                        <Th>Title</Th>
                        <Th>Year</Th>
                        <Th>Price</Th>
                        <Th>Class</Th>
                        <Th>Published By</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredModules.length === 0 ? (
                        <Tr>
                          <Td colSpan={6} textAlign="center">
                            No modules available
                          </Td>
                        </Tr>
                      ) : (
                        filteredModules.map((module, index) => (
                          <Tr key={index}>
                            <Td>
                              <Checkbox
                                isChecked={selectedModules.some(
                                  (m) => m.moduleId === module.moduleId
                                )}
                                onChange={(e) =>
                                  handleModuleChange(module, e.target.checked)
                                }
                              />
                            </Td>
                            <Td>{module.title}</Td>
                            <Td>{module.year}</Td>
                            <Td>{module.price}</Td>
                            <Td>{module.class}</Td>
                            <Td>{module.publishedBy}</Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                  <Box gridColumn="span 2">
                    <HStack mt={8} spacing={4} justify="center">
                      {step > 1 && (
                        <Button colorScheme="blue" size="lg" onClick={prevStep}>
                          Previous
                        </Button>
                      )}
                      <Button
                        colorScheme="blue"
                        size="lg"
                        onClick={(e) => {
                          handleUpdate(e);
                        }}
                      >
                        Next
                      </Button>
                    </HStack>
                  </Box>
                </VStack>
              )}

              {step === 5 && (
                <Grid gap={4} templateColumns="repeat(2, 1fr)" overflow="auto">
                  <Box gridColumn="span 2">
                    <Heading size="lg" mb={4}>
                      Review Details
                    </Heading>
                  </Box>
                  <Box>
                    <Text fontSize="lg">
                      <strong>Student Name:</strong> {formData.studentName}
                    </Text>
                    <Text fontSize="lg">
                      <strong>Email:</strong> {formData.email}
                    </Text>
                    <Text fontSize="lg">
                      <strong>Primary Phone:</strong> {formData.phoneNumber}
                    </Text>
                    <Text fontSize="lg">
                      <strong>Refer Code:</strong> {formData.referCode}
                    </Text>
                    <Text fontSize="lg">
                      <strong>Address:</strong> {formData.primaryAddress},{" "}
                      {formData.city}, {formData.state}
                    </Text>
                  </Box>
                  <Box>
                    {formData.qualifications.map((qualification, index) => (
                      <div key={index}>
                        <Text fontSize="lg">
                          <strong>Qualification {index + 1}:</strong>{" "}
                          {qualification.qualification === "Other"
                            ? qualification.highestQualification
                            : qualification.qualification}
                        </Text>
                        <Text fontSize="lg">
                          <strong>College/School Name:</strong>{" "}
                          {qualification.collegeName}
                        </Text>
                        <Text fontSize="lg">
                          <strong>Board/University Name:</strong>{" "}
                          {qualification.boardUniversityName}
                        </Text>
                        {qualification.hasCertificate && (
                          <>
                            <Text fontSize="lg">
                              <strong>Certificate No.:</strong>{" "}
                              {qualification.certificateNo}
                            </Text>
                            <Text fontSize="lg">
                              <strong>Issued By:</strong>{" "}
                              {qualification.issuedBy}
                            </Text>
                            <Text fontSize="lg">
                              <strong>Issue Date:</strong>{" "}
                              {qualification.issueDate}
                            </Text>
                          </>
                        )}
                      </div>
                    ))}
                  </Box>
                  <Box gridColumn="span 2">
                    <Text fontSize="lg">
                      <strong>Selected Courses:</strong>
                    </Text>
                    <ul>
                      {selectedCourses.map((course) => (
                        <li
                          key={course.courseId}
                          style={{ fontSize: "1.5rem" }}
                        >
                          <Heading size="md">{course.courseTitle}</Heading>
                          <Text>Rs. {course.price}</Text>
                        </li>
                      ))}
                    </ul>
                  </Box>
                  <Box gridColumn="span 2">
                    <HStack mt={8} spacing={4} justify="center">
                      {step > 1 && (
                        <Button colorScheme="blue" size="lg" onClick={prevStep}>
                          Previous
                        </Button>
                      )}
                      <Button
                        colorScheme="blue"
                        size="lg"
                        onClick={(e) => {
                          handleUpdate(e);
                        }}
                      >
                        Next
                      </Button>
                    </HStack>
                  </Box>
                </Grid>
              )}

              {step === 6 && (
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
                  {/* Left Side: Payment Options */}
                  <Stack spacing={4} p={4} borderWidth="1px" borderRadius="md">
                    {paymentMode.map((mode) => (
                      <Box key={mode.id} borderRadius="lg" bg="aliceblue" p={2}>
                        <Checkbox
                          name={mode.mode}
                          isChecked={formData.paymentMethods[mode.mode]}
                          onChange={(e) =>
                            handlePaymentMethodChange(
                              mode.mode,
                              e.target.checked
                            )
                          }
                        >
                          {mode.mode.charAt(0).toUpperCase() +
                            mode.mode.slice(1).replace(/([A-Z])/g, " $1")}
                        </Checkbox>
                      </Box>
                    ))}
                  </Stack>

                  {/* Right Side: Course Summary Card */}
                  <Card borderWidth="1px" borderRadius="lg" overflow="hidden">
                    <CardBody>
                      <Table variant="simple" size="md">
                        <Heading size="md">Course Details</Heading>
                        <Tbody>
                          {calculateTotalAmount().selectedCourseDetails.map(
                            (course) => (
                              <Tr key={course.courseTitle}>
                                <Td fontSize="lg">{course.courseTitle}</Td>
                                <Td textAlign="right" fontSize="lg">
                                  Rs. {course.price}
                                </Td>
                              </Tr>
                            )
                          )}
                          {/* Render Modules heading and details only if there are selected modules */}
                          {calculateTotalAmount().selectedModuleDetails.length >
                            0 && (
                            <>
                              <Heading mt={5} size="md">
                                Modules
                              </Heading>
                              {calculateTotalAmount().selectedModuleDetails.map(
                                (module) => (
                                  <Tr key={module.title}>
                                    <Td fontSize="lg">{module.title}</Td>
                                    <Td textAlign="right" fontSize="lg">
                                      Rs. {module.price}
                                    </Td>
                                  </Tr>
                                )
                              )}
                            </>
                          )}
                          <Tr>
                            <Td colSpan={2}>
                              <Checkbox
                                isChecked={kitFeeIncluded}
                                onChange={() =>
                                  setKitFeeIncluded(!kitFeeIncluded)
                                }
                                size="lg"
                              >
                                Kit Fee (Rs. {kitFee})
                              </Checkbox>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td colSpan={2}>
                              <Checkbox
                                isChecked={admissionFeeIncluded}
                                onChange={() =>
                                  setadmissionFeeIncluded(!admissionFeeIncluded)
                                }
                                size="lg"
                              >
                                Admission Fee (Rs. {admissionFee})
                              </Checkbox>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td colSpan={2}>
                              <Flex alignItems="center">
                                <Box flex="1">
                                  <Slider
                                    aria-label="slider-ex-1"
                                    value={sliderValue}
                                    onChange={(value) => setSliderValue(value)}
                                    min={0}
                                    max={admissionDiscount - discountLimit}
                                  >
                                    <SliderTrack>
                                      <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb fontSize="sm" boxSize="32px" />
                                  </Slider>
                                </Box>
                              </Flex>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td colSpan={2} textAlign="center">
                              <Text fontSize="lg">
                                Additional Discount: {sliderValue}%
                              </Text>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td colSpan={2}>
                              <Checkbox
                                isChecked={userDiscountIncluded}
                                onChange={() =>
                                  setUserDiscountIncluded(!userDiscountIncluded)
                                }
                                size="lg"
                              >
                                User Discount
                              </Checkbox>
                            </Td>
                          </Tr>
                          {userDiscountIncluded && (
                            <>
                              <Tr>
                                <Td colSpan={2}>
                                  <Flex alignItems="center">
                                    <Box flex="1">
                                      <Slider
                                        aria-label="user-discount-slider"
                                        value={userDiscountValue}
                                        onChange={(value) =>
                                          setUserDiscountValue(value)
                                        }
                                        min={0}
                                        max={discountLimit}
                                      >
                                        <SliderTrack>
                                          <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb
                                          fontSize="sm"
                                          boxSize="32px"
                                        />
                                      </Slider>
                                    </Box>
                                  </Flex>
                                </Td>
                              </Tr>
                              <Tr>
                                <Td colSpan={2} textAlign="center">
                                  <Text fontSize="lg">
                                    User Discount: {userDiscountValue}%
                                  </Text>
                                </Td>
                              </Tr>
                            </>
                          )}
                          <Tr>
                            <Td colSpan={2} textAlign="center">
                              <Heading size="md" mt={4}>
                                Total: Rs. {calculateTotalAmount().totalAmount}
                              </Heading>
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </CardBody>
                  </Card>

                  {/* Buttons for Navigation */}
                  <VStack spacing={4} align="stretch">
                    <HStack mt={8} spacing={4} justify="center">
                      {step > 1 && (
                        <Button colorScheme="blue" onClick={prevStep}>
                          Previous
                        </Button>
                      )}
                      <Button
                        colorScheme="blue"
                        onClick={(e) => {
                          handleUpdate(e);
                        }}
                      >
                        Submit
                      </Button>
                    </HStack>
                  </VStack>
                </Grid>
              )}

              {step === 7 && (
                <VStack spacing={8} alignItems="center">
                  <Text fontSize="xl" fontWeight="bold" color="green.500">
                    Lead generated successfully!
                  </Text>
                  <Flex>
                    <Button colorScheme="blue" onClick={handleOkay} mr={5}>
                      Okay
                    </Button>
                    <Button colorScheme="blue" onClick={handlePrintInvoice}>
                      Download Invoice
                    </Button>
                  </Flex>

                  <div style={{ display: "none" }}>
                    <BillComponent
                      ref={billComponentRef}
                      lead_id={formData.lead_id}
                    />
                  </div>
                </VStack>
              )}
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
}
