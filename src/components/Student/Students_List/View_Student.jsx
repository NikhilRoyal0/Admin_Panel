import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid, GridItem, Table, Thead, Badge, Tbody, Tr, Th, Td, Image, Flex, Spinner, Text } from '@chakra-ui/react';
import { fetchStudentData, selectStudentData, selectStudentError, selectStudentLoading } from "../../../app/Slices/studentSlice";
import { useParams } from 'react-router-dom';
import fallbackImage from "../../../assets/images/StudentImage.png"

export default function StudentDashboard() {
    const { student_id } = useParams()
    const dispatch = useDispatch();
    const studentData = useSelector(selectStudentData);
    const error = useSelector(selectStudentError);
    const isLoading = useSelector(selectStudentLoading);

    useEffect(() => {
        dispatch(fetchStudentData());
    }, [dispatch]);


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

    const selectedStudent = studentData.filter(student => student.student_id === student_id)

    const student = selectedStudent[0]
    console.log("Data", student)

    const transactions = [
        { id: 1, studentName: 'John Doe', time: '2024-06-01', amount: 100 },
        { id: 2, studentName: 'John Doe', time: '2024-06-02', amount: -50 },
        { id: 3, studentName: 'John Doe', time: '2024-06-03', amount: 200 },
        { id: 3, studentName: 'John Doe', time: '2024-06-03', amount: 200 },
        { id: 3, studentName: 'John Doe', time: '2024-06-03', amount: 200 },
        { id: 3, studentName: 'John Doe', time: '2024-06-03', amount: 200 },
        { id: 3, studentName: 'John Doe', time: '2024-06-03', amount: 200 },
        { id: 3, studentName: 'John Doe', time: '2024-06-03', amount: 200 },
        { id: 3, studentName: 'John Doe', time: '2024-06-03', amount: 200 },
        { id: 3, studentName: 'John Doe', time: '2024-06-03', amount: 200 },
        { id: 3, studentName: 'John Doe', time: '2024-06-03', amount: 200 },
        { id: 3, studentName: 'John Doe', time: '2024-06-03', amount: 200 },
    ];

    return (
        <Box bg="white" p="4" maxHeight="auto">
            <Box bg="gray.100" boxShadow="md" borderRadius="md" p="4" overflow="auto">
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "repeat(3, 1fr)" }} gap={6}>
                    {/* First Card */}
                    <GridItem colSpan={1}>
                        <Box p="4" color="black" bgGradient="linear(to-b, blue.500 50%, white 50%)" boxShadow="md" borderRadius="md" display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" mb={10} maxHeight={450}>
                            <Box bg="white" borderRadius="full" overflow="hidden" boxSize="100px" marginBottom="20" >
                                <Image
                                    src={student.profilePhoto}
                                    alt="Fallback"
                                    objectFit="cover"
                                    boxSize="100%"
                                    onError={(e) => (e.target.src = fallbackImage)}
                                />
                            </Box>
                            <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="black">
                                {student.studentName}
                            </Text>
                            <Text textAlign="center" color="gray.500" mt="2">
                                Admission No: {student.admissionNo}

                            </Text>
                            <Flex justify="space-between" mt="4" width="80%">
                                <Box>
                                    <Text fontWeight="bold" textAlign="center" color="black">
                                        Wallet Amount
                                    </Text>
                                    <Text textAlign="center">
                                        Rs. {student.walletAmount}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontWeight="bold" textAlign="center" color="black">
                                        Total Courses
                                    </Text>
                                    <Text textAlign="center">
                                        {student.courseList}
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </GridItem>

                    {/* Second Card */}
                    <GridItem colSpan={1}>
                        <Box p="4" bg="gray.200" boxShadow="md" borderRadius="md" height="100%">
                            <Box>
                                <Box mb="4" fontSize="xl" fontWeight="bold">
                                    Additional Info
                                </Box>
                                <Box>
                                    <strong>Educational Details:</strong>
                                    <ul>
                                        <li>10th Grade: Lorem Ipsum High School</li>
                                        <li>12th Grade: Lorem Ipsum Senior Secondary School</li>
                                    </ul>
                                </Box>
                            </Box>
                        </Box>
                    </GridItem>

                    {/* Third Card */}
                    <GridItem colSpan={1}>
                        <Box p="4" bg="gray.300" boxShadow="md" borderRadius="md" height="100%">
                            <Box mb="4">Your Todo</Box>
                            <ul>
                                <li>Course 1</li>
                                <li>Course 2</li>
                                <li>Course 3</li>
                            </ul>
                        </Box>
                    </GridItem>

                    {/* Fourth Card */}
                    <GridItem colSpan={1}>
                        <Box p="4" bg="white" boxShadow="md" borderRadius="md" height="100%" maxHeight={500} overflow="auto">
                            <Box mt="4" mb="4" fontSize="xl" fontWeight="bold">
                                Your Courses
                            </Box>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Course</Th>
                                        <Th>Grade</Th>
                                        <Th>Duration</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>Course 1</Td>
                                        <Td>A</Td>
                                        <Td>4 weeks</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Course 2</Td>
                                        <Td>B</Td>
                                        <Td>6 weeks</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Course 3</Td>
                                        <Td>C</Td>
                                        <Td>8 weeks</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </Box>
                    </GridItem>

                    <GridItem colSpan={1}>
                        <Box p="4" bg="white" boxShadow="md" borderRadius="md" maxHeight={500} overflow="auto">
                            <Box mb="5" fontSize="xl" fontWeight="bold">
                                Your Transfers
                            </Box>
                            {/* Loop through transactions and render each */}
                            {transactions.map(transaction => (
                                <Flex key={transaction.id} alignItems="center" mb="4">
                                    {/* Profile Picture */}
                                    <Box mr="4" width="50px" height="50px" borderRadius="full" bg="blue.500" />
                                    {/* Student Name */}
                                    <Box flex="1">
                                        <Box fontSize="lg" fontWeight="bold">{transaction.studentName}</Box>
                                        <Box fontSize="sm" color="gray.500">Time of Transaction: {transaction.time}</Box>
                                    </Box>
                                    {/* Amount */}
                                    <Box>
                                        <Badge colorScheme={transaction.amount >= 0 ? "green" : "red"}>
                                            {transaction.amount >= 0 ? `+$${transaction.amount}` : `-$${Math.abs(transaction.amount)}`}
                                        </Badge>
                                    </Box>
                                </Flex>
                            ))}
                        </Box>
                    </GridItem>
                </Grid>
            </Box>
        </Box>
    );
}
