import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  CheckboxGroup,
  Text,
  useToast,
  Image,
} from '@chakra-ui/react';
import { CheckCircleIcon, EditIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import NetworkError from "../NotFound/networkError";
import fallbackImage from "../../assets/images/imageError.png";
import { selectcourseData, selectcourseError, selectcourseLoading, fetchcourseData } from '../../app/Slices/courseSlice';
import { selectleadData, selectleadError, selectleadLoading, fetchleadData, AddleadData, updateleadData } from "../../app/Slices/leadSlice";

export default function InquiryForm() {
  const branchId = sessionStorage.getItem("BranchId");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const leadsData = useSelector(selectleadData);
  const courseData = useSelector(selectcourseData);
  const courseError = useSelector(selectcourseError);
  const courseLoading = useSelector(selectcourseLoading);
  const error = useSelector(selectleadError);
  const isLoading = useSelector(selectleadLoading);
  const Toast = useToast({
    position: "top-right",
  });
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phoneNumber: '',
    referCode: '',
    parentCode: '',
    createdOn: Date.now(),
    updatedOn: Date.now(),
    branchId: branchId,
    primaryAddress: '',
    state: '',
    status: 'pending',
    city: '',
    courses: '',
    qualifications: [
      {
        qualification: '',
        highestQualification: '',
        collegeName: '',
        boardUniversityName: '',
        hasCertificate: false,
        startDate: '',
        endDate: '',
        gradeMarks: '',
        certificateNo: '',
        issuedBy: '',
        issueDate: '',
      }
    ],
    paymentMethods: {
      creditCard: false,
      debitCard: false,
      emi: false,
      netBanking: false,
      upi: false,
      cash: false,
    },
  });

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchleadData());
    dispatch(fetchcourseData());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleQualificationChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedQualifications = [...formData.qualifications];
    updatedQualifications[index][name] = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, qualifications: updatedQualifications });
  };

  const addQualification = () => {
    if (formData.qualifications.length < 5) {
      setFormData({
        ...formData,
        qualifications: [
          ...formData.qualifications,
          {
            qualification: '',
            highestQualification: '',
            collegeName: '',
            boardUniversityName: '',
            startDate: '',
            endDate: '',
            gradeMarks: '',
            hasCertificate: false,
            certificateNo: '',
            issuedBy: '',
            issueDate: '',
          },
        ],
      });
    }
  };

  const removeQualification = (index) => {
    const updatedQualifications = formData.qualifications.filter((_, i) => i !== index);
    setFormData({ ...formData, qualifications: updatedQualifications });
  };

  const handleCourseSelection = (courseId) => {
    if (!courseData) {
      return;
    }

    const selectedCourse = courseData.find(course => course.courseId === courseId);

    if (!selectedCourse) {
      return;
    }

    setSelectedCourses(prevSelectedCourses => {
      const courseIndex = prevSelectedCourses.findIndex(course => course.courseId === courseId);

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

  const handlePaymentMethodChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      paymentMethods: {
        ...prevState.paymentMethods,
        [name]: checked,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = {
      ...formData,
      qualifications: JSON.stringify(formData.qualifications),
      courses: JSON.stringify(selectedCourses),
      paymentMethods: JSON.stringify(formData.paymentMethods),
    };

    try {
      if (formData.lead_id) {
        const response = await dispatch(updateleadData(formData.lead_id, formDataToSend));
        console.log('UpdateleadData response:', response);
      } else {
        const response = await dispatch(AddleadData(formDataToSend));
        console.log('AddleadData response:', response);

        const { lead_id, student_id } = response.data;

        setFormData(prevState => ({
          ...prevState,
          lead_id: lead_id,
          student_id: student_id,
        }));
      }

    } catch (error) {
      console.error('Error handling form submission:', error);
    }
  };

  const handleUpdate = async () => {
    const formDataToSend = {
      ...formData,
      qualifications: JSON.stringify(formData.qualifications),
      courses: JSON.stringify(selectedCourses),
      paymentMethods: JSON.stringify(formData.paymentMethods),
    };

    try {
      await dispatch(updateleadData(formData.lead_id, formDataToSend));
      nextStep();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return (
          formData.studentName !== '' &&
          formData.email !== '' &&
          formData.phoneNumber !== '' &&
          formData.state !== '' &&
          formData.city !== '' &&
          formData.primaryAddress !== ''
        );
      case 2:
        return (
          formData.qualifications[0].qualification !== '' &&
          (formData.qualifications[0].qualification !== 'Other' || formData.qualifications[0].highestQualification !== '') &&
          formData.qualifications[0].collegeName !== '' &&
          formData.qualifications[0].boardUniversityName !== ''
        );
      case 3:
        return selectedCourses.length > 0;
      case 4:
        return selectedCourses.length > 0;
      case 5:
        return Object.values(formData.paymentMethods).some((method) => method);
      default:
        return true;
    }
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    const selectedCourseDetails = [];

    selectedCourses.forEach(selected => {
      const course = courseData.find(course => course.courseId === selected.courseId);

      if (course) {
        totalAmount += parseFloat(course.price);
        selectedCourseDetails.push({
          courseTitle: course.courseTitle,
          price: parseFloat(course.price).toFixed(2),
        });
      }
    });

    return { totalAmount: totalAmount.toFixed(2), selectedCourseDetails };
  };

  if (isLoading || courseLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error || courseError) {
    return <NetworkError />;
  }

  const handleOverlayClick = (e) => {
    e.stopPropagation();
  };


  return (
    <Box bg="gray.100" minHeight="100vh" p="4">
      <Flex alignItems="center" justifyContent="center" minHeight="100%">
        <Box p={8} maxW="5xl" w="100%">
          <Stack direction="row" spacing={4} justify="space-around" mb={4}>
            <Flex direction="column" alignItems="center">
              {step > 1 ? (
                <CheckCircleIcon color="green.500" boxSize="2em" />
              ) : (
                <EditIcon color={step === 1 ? 'blue.500' : 'gray.500'} boxSize="2em" />
              )}
              <Box mt={2}>Basic Details</Box>
            </Flex>
            <Flex direction="column" alignItems="center">
              {step > 2 ? (
                <CheckCircleIcon color="green.500" boxSize="2em" />
              ) : (
                <EditIcon color={step === 2 ? 'blue.500' : 'gray.500'} boxSize="2em" />
              )}
              <Box mt={2}>Educational Details</Box>
            </Flex>
            <Flex direction="column" alignItems="center">
              {step > 3 ? (
                <CheckCircleIcon color="green.500" boxSize="2em" />
              ) : (
                <EditIcon color={step === 3 ? 'blue.500' : 'gray.500'} boxSize="2em" />
              )}
              <Box mt={2}>Course Selection</Box>
            </Flex>
            <Flex direction="column" alignItems="center">
              {step > 4 ? (
                <CheckCircleIcon color="green.500" boxSize="2em" />
              ) : (
                <EditIcon color={step === 4 ? 'blue.500' : 'gray.500'} boxSize="2em" />
              )}
              <Box mt={2}>Review</Box>
            </Flex>
            <Flex direction="column" alignItems="center">
              {step > 5 ? (
                <CheckCircleIcon color="green.500" boxSize="2em" />
              ) : (
                <EditIcon color={step === 5 ? 'blue.500' : 'gray.500'} boxSize="2em" />
              )}
              <Box mt={2}>Payment Mode</Box>
            </Flex>
          </Stack>
          <Card>
            <CardHeader>
              <Heading size="md" textAlign="center">
                {step === 1 ? 'Basic Details' : ''}
                {step === 2 ? 'Educational Details' : ''}
                {step === 3 ? 'Course Selection' : ''}
                {step === 4 ? 'Review' : ''}
                {step === 5 ? 'Payment Mode' : ''}
              </Heading>
            </CardHeader>
            <CardBody>
              {step === 1 && (
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    <Grid
                      templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
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
                      <Button colorScheme="blue" onClick={(e) => { nextStep(); handleSubmit(e); }} type="submit">
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
                      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={4}>
                        <FormControl>
                          <FormLabel>Qualification</FormLabel>
                          <Select
                            name="qualification"
                            value={qualification.qualification}
                            onChange={(e) => handleQualificationChange(index, e)}
                            required
                          >
                            <option value="">Select</option>
                            <option value="Undergraduate">Undergraduate</option>
                            <option value="Postgraduate">Postgraduate</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Other">Other</option>
                          </Select>
                        </FormControl>
                        {qualification.qualification === 'Other' && (
                          <FormControl>
                            <FormLabel>Highest Qualification</FormLabel>
                            <Input
                              type="text"
                              name="highestQualification"
                              value={qualification.highestQualification}
                              onChange={(e) => handleQualificationChange(index, e)}
                              required
                            />
                          </FormControl>
                        )}
                        <FormControl>
                          <FormLabel>College Name</FormLabel>
                          <Input
                            type="text"
                            name="collegeName"
                            value={qualification.collegeName}
                            onChange={(e) => handleQualificationChange(index, e)}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Board University Name</FormLabel>
                          <Input
                            type="text"
                            name="boardUniversityName"
                            value={qualification.boardUniversityName}
                            onChange={(e) => handleQualificationChange(index, e)}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Start Date</FormLabel>
                          <Input
                            type="date"
                            name="startDate"
                            value={qualification.startDate}
                            onChange={(e) => handleQualificationChange(index, e)}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>End Date</FormLabel>
                          <Input
                            type="date"
                            name="endDate"
                            value={qualification.endDate}
                            onChange={(e) => handleQualificationChange(index, e)}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Grade/Marks</FormLabel>
                          <Input
                            type="text"
                            name="gradeMarks"
                            value={qualification.gradeMarks}
                            onChange={(e) => handleQualificationChange(index, e)}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Has Certificate?</FormLabel>
                          <Checkbox
                            name="hasCertificate"
                            isChecked={qualification.hasCertificate}
                            onChange={(e) => handleQualificationChange(index, e)}
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
                                onChange={(e) => handleQualificationChange(index, e)}
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Issued By</FormLabel>
                              <Input
                                type="text"
                                name="issuedBy"
                                value={qualification.issuedBy}
                                onChange={(e) => handleQualificationChange(index, e)}
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Issue Date</FormLabel>
                              <Input
                                type="date"
                                name="issueDate"
                                value={qualification.issueDate}
                                onChange={(e) => handleQualificationChange(index, e)}
                              />
                            </FormControl>
                          </>
                        )}
                      </Grid>
                      {formData.qualifications.length > 1 && (
                        <HStack>
                          <Button colorScheme="red" onClick={() => removeQualification(index)}>
                            Remove
                          </Button>
                        </HStack>
                      )}
                    </VStack>
                  ))}
                  {formData.qualifications.length < 5 && (
                    <Button mt={4} colorScheme="green" onClick={addQualification}>
                      Add Qualification
                    </Button>
                  )}
                  <HStack mt={8} spacing={4} justify="center">
                    {step > 1 && (
                      <Button colorScheme="blue" onClick={prevStep}>
                        Previous
                      </Button>
                    )}
                    <Button colorScheme="blue" onClick={(e) => handleUpdate(e)}>
                      Next
                    </Button>
                  </HStack>
                </form>
              )}

              {step === 3 && (
                <VStack spacing={4} align="stretch" overflow="auto">
                  <Grid
                    templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                    gap={6}
                    mb={4}
                  >
                    {courseData.length === 0 ? (
                      <Flex justify="center" align="center" height="100%">
                        <Box textAlign="center">
                          <Text fontSize="xl" fontWeight="bold">No course available</Text>
                        </Box>
                      </Flex>
                    ) : (
                      courseData
                        .map((course, index) => (
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
                                isChecked={selectedCourses.some(selected => selected.courseId === course.courseId)}
                                onChange={() => {
                                  handleCourseSelection(course.courseId.toString());
                                }} />
                            </Box>
                            <Flex alignItems="center" mt="auto">
                            </Flex>
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
                    <Button colorScheme="blue" onClick={(e) => { handleUpdate(e); }}>
                      Next
                    </Button>
                  </HStack>
                </VStack>
              )}

              {step === 4 && (
                <Grid gap={4} templateColumns="repeat(2, 1fr)" overflow="auto">
                  <Box gridColumn="span 2">
                    <Heading size="lg" mb={4}>Review Details</Heading>
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
                      <strong>Address:</strong> {formData.primaryAddress}, {formData.city}, {formData.state}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="lg">
                      <strong>Qualification:</strong> {formData.qualifications.qualification === 'Other' ? formData.qualifications.highestQualification : formData.qualifications.qualification}
                    </Text>
                    <Text fontSize="lg">
                      <strong>College/School Name:</strong> {formData.collegeName}
                    </Text>
                    <Text fontSize="lg">
                      <strong>Board/University Name:</strong> {formData.boardUniversityName}
                    </Text>
                    {formData.hasCertificate && (
                      <>
                        <Text fontSize="lg">
                          <strong>Certificate No.:</strong> {formData.certificateNo}
                        </Text>
                        <Text fontSize="lg">
                          <strong>Issued By:</strong> {formData.issuedBy}
                        </Text>
                        <Text fontSize="lg">
                          <strong>Issue Date:</strong> {formData.issueDate}
                        </Text>
                      </>
                    )}
                  </Box>
                  <Box gridColumn="span 2">
                    <Text fontSize="lg">
                      <strong>Selected Courses:</strong>
                    </Text>
                    <ul>
                      {selectedCourses.map((course) => (
                        <li key={course.courseId} style={{ fontSize: '1.5rem' }}>
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
                      <Button colorScheme="blue" size="lg" onClick={(e) => { handleUpdate(e); }}>
                        Next
                      </Button>
                    </HStack>
                  </Box>
                </Grid>
              )}

              {step === 5 && (
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
                  {/* Left Side: Course Summary Card */}
                  <Card>
                    <CardHeader>Total Payable Amount</CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        {calculateTotalAmount().selectedCourseDetails.map(course => (
                          <Box key={course.courseId} borderBottomWidth="1px" pb={2}>
                            <Heading size="sm">{course.courseTitle}</Heading>
                            <Text>Price: Rs. {course.price}</Text>
                          </Box>
                        ))}
                        <Box borderTopWidth="1px" pt={2}>
                          <Heading size="md">Total: Rs. {calculateTotalAmount().totalAmount}</Heading>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Right Side: Payment Options */}
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Select Payment Method</FormLabel>
                      <CheckboxGroup colorScheme="blue" onChange={handlePaymentMethodChange}>
                        <VStack spacing={4} align="stretch">
                          <FormControl>
                            <VStack align="stretch">
                              <Checkbox
                                name="creditCard"
                                isChecked={formData.paymentMethods.creditCard}
                                onChange={handlePaymentMethodChange}
                              >
                                Credit Card
                              </Checkbox>
                              <Checkbox
                                name="debitCard"
                                isChecked={formData.paymentMethods.debitCard}
                                onChange={handlePaymentMethodChange}
                              >
                                Debit Card
                              </Checkbox>
                              <Checkbox
                                name="emi"
                                isChecked={formData.paymentMethods.emi}
                                onChange={handlePaymentMethodChange}
                              >
                                EMI
                              </Checkbox>
                              <Checkbox
                                name="netBanking"
                                isChecked={formData.paymentMethods.netBanking}
                                onChange={handlePaymentMethodChange}
                              >
                                Net Banking
                              </Checkbox>
                              <Checkbox
                                name="upi"
                                isChecked={formData.paymentMethods.upi}
                                onChange={handlePaymentMethodChange}
                              >
                                UPI
                              </Checkbox>
                              <Checkbox
                                name="cash"
                                isChecked={formData.paymentMethods.cash}
                                onChange={handlePaymentMethodChange}
                              >
                                Cash
                              </Checkbox>
                            </VStack>
                          </FormControl>
                        </VStack>

                      </CheckboxGroup>
                    </FormControl>

                    {/* Buttons for Navigation */}
                    <HStack mt={8} spacing={4} justify="center">
                      {step > 1 && (
                        <Button colorScheme="blue" onClick={prevStep}>
                          Previous
                        </Button>
                      )}
                      <Button colorScheme="blue" onClick={handleUpdate}>
                        Submit
                      </Button>
                    </HStack>
                  </VStack>
                </Grid>
              )}


            </CardBody>
          </Card>

          {/* Success Dialog */}
          <AlertDialog
            isOpen={showSuccessDialog}
            leastDestructiveRef={undefined}
            onClose={() => setShowSuccessDialog(false)}
            motionPreset="slideInBottom"
            onOverlayClick={handleOverlayClick}
          >
            <AlertDialogOverlay />
            <AlertDialogContent
              mx="auto" // Centers horizontally
              my="auto" // Centers vertically
              maxWidth="sm" // Optional: sets a maximum width for the dialog
            >
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Inquiry Submitted
              </AlertDialogHeader>
              <AlertDialogBody>
                Your inquiry has been submitted successfully!
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button colorScheme="blue" onClick={() => setShowSuccessDialog(false)}>
                  Okay
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Box>
      </Flex>
    </Box>
  );
}

