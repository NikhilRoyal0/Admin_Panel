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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
} from '@chakra-ui/react';
import { CheckCircleIcon, EditIcon } from '@chakra-ui/icons';
import NetworkError from "../NotFound/networkError";
import { selectleadData, selectleadError, selectleadLoading, fetchleadData, AddleadData } from "../../app/Slices/leadSlice";


export default function InquiryForm() {
  const branchId = sessionStorage.getItem("BranchId");
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const leadsData = useSelector(selectleadData);
  const error = useSelector(selectleadError);
  const isLoading = useSelector(selectleadLoading);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    qualification: '',
    phoneNumber: "",
    createdOn: Date.now(),
    branchId: branchId,
    primaryAddress: "",
    state: "",
    status: "Active",
    city: "",
    highestQualification: '',
    collegeName: '',
    boardUniversityName: '',
    hasCertificate: false,
    certificateNo: '',
    issuedBy: '',
    issueDate: '',
    otherQualifications: '',
    courses: [
      { id: 1, name: 'Course A', duration: '6 months', price: 'Rs. 500', selected: false },
      { id: 2, name: 'Course B', duration: '12 months', price: 'Rs. 800', selected: false },
      { id: 3, name: 'Course C', duration: '9 months', price: 'Rs. 600', selected: false },
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
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCourseSelection = (id) => {
    const updatedCourses = formData.courses.map((course) =>
      course.id === id ? { ...course, selected: !course.selected } : course
    );
    setFormData({ ...formData, courses: updatedCourses });
  };

  const handlePaymentMethodChange = (e) => {
    const { name, checked } = e.target;
  
    if (checked && formData.paymentMethods[name]) {
      return;
    }
  
    const updatedPaymentMethods = Object.keys(formData.paymentMethods).reduce((methods, method) => {
      methods[method] = false;
      return methods;
    }, {});
  
    updatedPaymentMethods[name] = checked;
  
    setFormData({
      ...formData,
      paymentMethods: updatedPaymentMethods,
    });
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = {
      ...formData,
      courses: JSON.stringify(selectedCourses),
      paymentMethods: JSON.stringify(formData.paymentMethods),
    };

    dispatch(AddleadData(formDataToSend));

    setShowSuccessDialog(true);

    // Reset form data after submission
    setFormData({
      studentName: '',
      email: '',
      qualification: '',
      phoneNumber: '',
      createdOn: Date.now(),
      branchId: branchId,
      primaryAddress: '',
      state: '',
      status: 'Active',
      city: '',
      highestQualification: '',
      collegeName: '',
      boardUniversityName: '',
      hasCertificate: false,
      certificateNo: '',
      issuedBy: '',
      issueDate: '',
      otherQualifications: '',
      courses: [
        { id: 1, name: 'Course A', duration: '6 months', price: 'Rs. 500', selected: false },
        { id: 2, name: 'Course B', duration: '12 months', price: 'Rs. 800', selected: false },
        { id: 3, name: 'Course C', duration: '9 months', price: 'Rs. 600', selected: false },
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

    // Refresh the page after 3 seconds
    setTimeout(() => {
      window.location.reload();
    }, 3000);
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
          formData.qualification !== '' &&
          (formData.qualification !== 'Other' || formData.highestQualification !== '') &&
          formData.collegeName !== '' &&
          formData.boardUniversityName !== ''
        );
      case 3:
        return formData.courses.some((course) => course.selected);
      case 4:
        return Object.values(formData.paymentMethods).some((method) => method);
      default:
        return true;
    }
  };

  const calculateTotalAmount = () => {
    const selectedCourses = formData.courses.filter(course => course.selected);

    const totalAmount = selectedCourses.reduce((total, course) => {
      const priceString = course.price.replace('Rs. ', ''); // Remove 'Rs. ' to get the numeric part
      const price = parseFloat(priceString);
      return total + price;
    }, 0);

    return totalAmount.toFixed(2);
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

  return (
    <Flex alignItems="center" justifyContent="center" minHeight="100%">
      <Box p={8} maxW="5xl" w="100%">
        <Stack direction="row" spacing={4} justify="space-around" mb={4}>
          <Flex direction="column" alignItems="center">
            {step > 1 ? (
              <CheckCircleIcon color="green.500" boxSize="2em" />
            ) : (
              <EditIcon color="gray.500" boxSize="2em" />
            )}
            <Box mt={2}>Basic Details</Box>
          </Flex>
          <Flex direction="column" alignItems="center">
            {step > 2 ? (
              <CheckCircleIcon color="green.500" boxSize="2em" />
            ) : (
              <EditIcon color="gray.500" boxSize="2em" />
            )}
            <Box mt={2}>Educational Details</Box>
          </Flex>
          <Flex direction="column" alignItems="center">
            {step > 3 ? (
              <CheckCircleIcon color="green.500" boxSize="2em" />
            ) : (
              <EditIcon color="gray.500" boxSize="2em" />
            )}
            <Box mt={2}>Course Selection</Box>
          </Flex>
          <Flex direction="column" alignItems="center">
            {step > 4 ? (
              <CheckCircleIcon color="green.500" boxSize="2em" />
            ) : (
              <EditIcon color="gray.500" boxSize="2em" />
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
              {step === 4 ? 'Payment Mode' : ''}
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
                        <Input
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
                    <Button colorScheme="blue" onClick={nextStep} type="submit">
                      Next
                    </Button>
                  </HStack>
                </VStack>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <Grid
                    templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                    gap={4}
                  >
                    <GridItem>
                      <FormControl>
                        <FormLabel>Qualification</FormLabel>
                        <Select
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Postgraduate">Postgraduate</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Other">Other</option>
                        </Select>
                      </FormControl>
                    </GridItem>
                    {formData.qualification === 'Other' && (
                      <GridItem>
                        <FormControl>
                          <FormLabel>Highest Qualification</FormLabel>
                          <Input
                            type="text"
                            name="highestQualification"
                            value={formData.highestQualification}
                            onChange={handleChange}
                            required
                          />
                        </FormControl>
                      </GridItem>
                    )}
                    <GridItem>
                      <FormControl>
                        <FormLabel>College/School Name</FormLabel>
                        <Input
                          type="text"
                          name="collegeName"
                          value={formData.collegeName}
                          onChange={handleChange}
                          required
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Board/University Name</FormLabel>
                        <Input
                          type="text"
                          name="boardUniversityName"
                          value={formData.boardUniversityName}
                          onChange={handleChange}
                          required
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Have Certificate?</FormLabel>
                        <Checkbox
                          name="hasCertificate"
                          isChecked={formData.hasCertificate}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </GridItem>
                    {formData.hasCertificate && (
                      <>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Certificate No.</FormLabel>
                            <Input
                              type="text"
                              name="certificateNo"
                              value={formData.certificateNo}
                              onChange={handleChange}
                            />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Issued By</FormLabel>
                            <Input
                              type="text"
                              name="issuedBy"
                              value={formData.issuedBy}
                              onChange={handleChange}
                            />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Issue Date</FormLabel>
                            <Input
                              type="date"
                              name="issueDate"
                              value={formData.issueDate}
                              onChange={handleChange}
                            />
                          </FormControl>
                        </GridItem>
                      </>
                    )}
                    <GridItem colSpan={2}>
                      <FormControl>
                        <FormLabel>Other Qualifications</FormLabel>
                        <Textarea
                          name="otherQualifications"
                          value={formData.otherQualifications}
                          onChange={handleChange}
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
                    <Button colorScheme="blue" onClick={nextStep}>
                      Next
                    </Button>
                  </HStack>
                </VStack>
              </form>
            )}

            {step === 3 && (
              <VStack spacing={4} align="stretch">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Course Name</Th>
                      <Th>Duration</Th>
                      <Th>Price</Th>
                      <Th>Select</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {formData.courses.map((course) => (
                      <Tr key={course.id}>
                        <Td>{course.name}</Td>
                        <Td>{course.duration}</Td>
                        <Td>{course.price}</Td>
                        <Td>
                          <Checkbox
                            isChecked={course.selected}
                            onChange={() => handleCourseSelection(course.id)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <HStack mt={8} spacing={4} justify="center">
                  {step > 1 && (
                    <Button colorScheme="blue" onClick={prevStep}>
                      Previous
                    </Button>
                  )}
                  <Button colorScheme="blue" onClick={nextStep}>
                    Next
                  </Button>
                </HStack>
              </VStack>
            )}

            {step === 4 && (
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
                {/* Left Side: Course Summary Card */}
                <Card>
                  <CardHeader>Total Payable Amount</CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {formData.courses.map((course) => (
                        course.selected && (
                          <Box key={course.id} borderBottomWidth="1px" pb={2}>
                            <Heading size="sm">{course.name}</Heading>
                            <Text>Duration: {course.duration}</Text>
                            <Text>Price: {course.price}</Text>
                          </Box>
                        )
                      ))}
                      <Box borderTopWidth="1px" pt={2}>
                        <Heading size="md">Total: Rs. {calculateTotalAmount()}</Heading>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Right Side: Payment Options */}
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Select Payment Method</FormLabel>
                    <CheckboxGroup colorScheme="blue" onChange={handlePaymentMethodChange}>
                      <VStack align="stretch">
                        <Checkbox name="creditCard" isChecked={formData.paymentMethods.creditCard}>
                          Credit Card
                        </Checkbox>
                        <Checkbox name="debitCard" isChecked={formData.paymentMethods.debitCard}>
                          Debit Card
                        </Checkbox>
                        <Checkbox name="emi" isChecked={formData.paymentMethods.emi}>
                          EMI
                        </Checkbox>
                        <Checkbox name="netBanking" isChecked={formData.paymentMethods.netBanking}>
                          Net Banking
                        </Checkbox>
                        <Checkbox name="upi" isChecked={formData.paymentMethods.upi}>
                          UPI
                        </Checkbox>
                        <Checkbox name="cash" isChecked={formData.paymentMethods.cash}>
                          Cash
                        </Checkbox>
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
                    <Button colorScheme="blue" onClick={handleSubmit}>
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
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Inquiry Submitted
              </AlertDialogHeader>
              <AlertDialogBody>
                Your inquiry has been submitted successfully!
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button colorScheme="blue" onClick={() => setShowSuccessDialog(false)}>
                  Close
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Flex>
  );
}

