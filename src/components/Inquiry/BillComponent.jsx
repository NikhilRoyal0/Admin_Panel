import React, { forwardRef, useEffect } from 'react';
import {
  Grid,
  Card,
  CardHeader,
  CardBody,
  Table,
  Tbody,
  Tr,
  Td,
  Heading,
  Checkbox,
  Spinner,
  Flex,
  Box,
  Text,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import NetworkError from "../NotFound/networkError";
import { selectinvoiceData, selectinvoiceError, selectinvoiceLoading, fetchinvoiceData } from "../../app/Slices/invoiceSlice";
import { selectBranchData, selectBranchError, selectBranchLoading, fetchBranchData } from '../../app/Slices/branchSlice';
import TimeConversion from '../../utils/timeConversion';

const BillComponent = forwardRef(({ lead_id, }, ref) => {
  const dispatch = useDispatch();
  const invoiceData = useSelector(selectinvoiceData);
  const error = useSelector(selectinvoiceError);
  const isLoading = useSelector(selectinvoiceLoading);
  const branchData = useSelector(selectBranchData);
  const branchLoading = useSelector(selectBranchLoading);
  const branchError = useSelector(selectBranchError);

  // Fetch data on initial render
  useEffect(() => {
    dispatch(fetchinvoiceData());
    dispatch(fetchBranchData());
  }, [dispatch]);

  // Handle loading states
  if (isLoading || branchLoading || !invoiceData || !branchData) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error || branchError) {
    return <NetworkError />;
  }

  const foundInvoice = invoiceData.find(item => item.lead_id == lead_id);

  if (!foundInvoice) {
    return <NetworkError />;
  }

  const foundBranch = branchData.find(item => item.branchId === foundInvoice.branchId);

  if (!foundBranch) {
    return <NetworkError />;
  }

  const selectedCourses = JSON.parse(foundInvoice.courses);
  const selectedModules = JSON.parse(foundInvoice.module);
  const formattedCourses = selectedCourses.map(course => ({
    courseTitle: course.courseTitle,
    price: parseFloat(course.price).toFixed(2),
  }));
  const formattedModules = selectedModules.map(module => ({
    title: module.title,
    price: parseFloat(module.price).toFixed(2),
  }));

  const validKitFee = parseFloat(foundInvoice.kitFee) || 0;
  const formattedAdmissionFee = parseFloat(foundInvoice.admissionFee) || 0;
  const formattedTotalDiscount = parseFloat(foundInvoice.totalDiscount) || 0;

  const coursesTotal = formattedCourses.reduce((acc, course) => acc + parseFloat(course.price), 0);
  const modulesTotal = formattedModules.reduce((acc, module) => acc + parseFloat(module.price), 0);
  const subtotal = modulesTotal + coursesTotal + validKitFee + formattedAdmissionFee - formattedTotalDiscount;

  return (
    <div ref={ref}>
      <Card borderWidth="1px" borderRadius="lg" overflow="hidden" m={5} p={5}>
        <CardHeader>
          <Heading size="lg">Invoice Details</Heading>
        </CardHeader>
        <CardBody>
          <Grid templateColumns="1fr 1fr" gap={8}>
            {/* Left side: Student Details */}
            <Box>
              <Box mb={2}>
                <Heading size="md" mb={4}>Student Details</Heading>
                <Text><strong>Name:</strong> {foundInvoice.studentName}</Text>
                <Text><strong>Email:</strong> {foundInvoice.email}</Text>
                <Text><strong>Phone Number:</strong> {foundInvoice.phoneNumber}</Text>
                {/* Add more student details here */}
              </Box >
              <Text><strong>Invoice ID:</strong> {foundInvoice.invoice_id}</Text>
              <Text><strong>Created On:</strong> {TimeConversion.unixTimeToRealTime(foundInvoice.createdOn)}</Text>
              <Text><strong>Payment Method:</strong> {foundInvoice.paymentMethod}</Text>
              {/* Add more student details here */}
            </Box>


            {/* Right side: Branch Details */}
            <Box>
              <Heading size="md" mb={4}>Branch Details</Heading>
              <Text><strong>Branch ID:</strong> {foundBranch.branchId}</Text>
              <Text><strong>Branch Name:</strong> {foundBranch.branchName}</Text>
              <Text><strong>Branch Address:</strong> {foundBranch.branchAddress}</Text>
              <Text><strong>Branch Email:</strong> {foundBranch.branchEmail}</Text>
              <Text><strong>Branch Phone:</strong> {foundBranch.branchPhone}</Text>

              {/* Add more invoice details here */}
            </Box>

          </Grid>

          {/* Courses Details */}
          <Heading size="md" mt={8} mb={4}>Courses Details</Heading>
          <Table variant="simple" size="md">
            <Tbody>
              {formattedCourses.map((course, index) => (
                <Tr key={index}>
                  <Td>{course.courseTitle}</Td>
                  <Td textAlign="right">Rs. {course.price}</Td>
                </Tr>
              ))}
              <Tr>
                <Td>Total Discount:</Td>
                <Td textAlign="right"> {formattedTotalDiscount.toFixed(2)} %</Td>
              </Tr>
            </Tbody>
          </Table>

          {/* Modules Details */}
          {formattedModules.length > 0 && (
            <>
              <Heading size="md" mt={8} mb={4}>Modules Details</Heading>
              <Table variant="simple" size="md">
                <Tbody>
                  {formattedModules.map((module, index) => (
                    <Tr key={index}>
                      <Td>{module.title}</Td>
                      <Td textAlign="right">Rs. {module.price}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          )}

          {/* Additional Fees */}
          <Table variant="simple" size="md">
            <Tbody>
              <Tr>
                <Td>
                  Kit Fee :
                </Td>
                <Td textAlign="right">Rs. {validKitFee.toFixed(2)}</Td>
              </Tr>
              <Tr>
                <Td>Admission Fee:</Td>
                <Td textAlign="right">Rs. {formattedAdmissionFee.toFixed(2)}</Td>
              </Tr>
              <Tr>
                <Td colSpan={2} textAlign="center">
                  <Heading size="md" mt={4}>
                    Total Payable Amount: Rs. {foundInvoice.totalAmount.toFixed(2)}
                  </Heading>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </CardBody>
      </Card>

    </div>
  );
});

export default BillComponent;
