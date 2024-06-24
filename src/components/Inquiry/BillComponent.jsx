import React, { forwardRef } from 'react';
import {
  Grid,
  Box,
  Card,
  CardHeader,
  CardBody,
  Table,
  Tbody,
  Tr,
  Td,
  Flex,
  Text,
  Heading,
  Checkbox,
} from '@chakra-ui/react';

const BillComponent = forwardRef(({ selectedCourseDetails, kitFee }, ref) => {
  const subtotal = JSON.parse(selectedCourseDetails).reduce((acc, course) => acc + parseFloat(course.price), 0);

  return (
    <div ref={ref}>
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
        <Card borderWidth="1px" borderRadius="lg" overflow="hidden" m={5}>
          <CardHeader>Total Payable Amount</CardHeader>
          <CardBody>
            <Table variant="simple" size="md">
              <Tbody>
                {JSON.parse(selectedCourseDetails).map((course) => (
                  <Tr key={course.courseTitle}>
                    <Td fontSize="lg">{course.courseTitle}</Td>
                    <Td textAlign="right" fontSize="lg">
                      Rs. {parseFloat(course.price).toFixed(2)}
                    </Td>
                  </Tr>
                ))}
                <Tr>
                  <Td colSpan={2}>
                    <Checkbox isChecked={true} size="lg" isDisabled>
                      Kit Fee (Rs. {parseFloat(kitFee).toFixed(2)})
                    </Checkbox>
                  </Td>
                </Tr>
                <Tr>
                  <Td colSpan={2} textAlign="center">
                    <Heading size="md" mt={4}>
                      Subtotal: Rs. {(parseFloat(subtotal.toFixed(2)) + parseFloat(kitFee)).toFixed(2)}
                    </Heading>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Grid>
    </div>
  );
});

export default BillComponent;
