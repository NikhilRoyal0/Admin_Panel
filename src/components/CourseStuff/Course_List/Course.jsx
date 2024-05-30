import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Flex, Center, Image, SimpleGrid, Icon } from '@chakra-ui/react';
import { useSelector, useDispatch } from "react-redux";
import { FaStar } from 'react-icons/fa';
import {
    fetchcourseData,
    selectcourseData,
    selectcourseLoading,
    selectcourseError,
} from "../../../app/Slices/courseSlice";

export default function Course() {
    const dispatch = useDispatch();
    const courseData = useSelector(selectcourseData);
    const isLoading = useSelector(selectcourseLoading);
    const error = useSelector(selectcourseError);
    const { courseId } = useParams();

    useEffect(() => {
        dispatch(fetchcourseData());
    }, [dispatch]);

    const selectedCourse = courseData.find(course => course.courseId === (courseId));

    if (!selectedCourse) {
        return <div>Course not found for courseId: {courseId}</div>;
    }

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
        <Center h="100vh" bg="gray.100">
            <Box w="full" maxW="4xl" bg="white" p={4} ml={5} mr={5} borderRadius="lg" boxShadow="lg" overflow="hidden">
                <Flex direction={{ base: 'column', md: 'row' }} mb={4}>
                    <Box flex="1" mb={{ base: 4, md: 0 }} mr={{ md: 4 }}>
                        {selectedCourse.thumbnail && (
                            <Image src={selectedCourse.thumbnail} alt={selectedCourse.courseName} borderRadius="lg" mb={4} />
                        )}
                        <Heading as="h2" size="lg">{selectedCourse.courseName}</Heading>
                    </Box>
                    <Box flex="2">
                        <Text fontSize="sm" color="gray.500">Course Title: {selectedCourse.courseTitle}</Text>
                        <Text fontSize="sm" color="gray.500">Duration: {selectedCourse.duration} mins</Text>
                        <Text fontSize="sm" color="gray.500">Price: {selectedCourse.price}</Text>
                        <Text fontSize="sm" color="gray.500">Created By: {selectedCourse.createdBy}</Text>
                        <Text fontSize="sm" color="gray.500">Short Info: {selectedCourse.shortInfo}</Text>
                        <Text fontSize="sm" color="gray.500">Long Info: {selectedCourse.longInfo}</Text>
                        <Text fontSize="sm" color="gray.500">Overall Rating: {selectedCourse.overAllRating}</Text>
                        <Text fontSize="sm" color="gray.500">Status: {selectedCourse.status}</Text>
                        <Text fontSize="sm" color="gray.500">Created On: {selectedCourse.createdOn}</Text>
                        <Text fontSize="sm" color="gray.500">Updated On: {selectedCourse.updatedOn}</Text>
                        <Text fontSize="sm" color="gray.500">Category: {selectedCourse.category}</Text>
                        <Text fontSize="sm" color="gray.500">Happy Students: {selectedCourse.happyStudents}</Text>
                        <Text fontSize="sm" color="gray.500">Benefits: {selectedCourse.benefits}</Text>
                    </Box>
                </Flex>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box p={4} borderRadius="lg" boxShadow="md" bg="white">
                        <Heading as="h4" size="md" mb={2}>Feedback</Heading>
                        <Text>{selectedCourse.feedback}</Text>
                    </Box>
                    <Box p={4} borderRadius="lg" boxShadow="md" bg="white">
                        <Heading as="h4" size="md" mb={2}>Rating</Heading>
                        <Flex align="center">
                            {Array(5).fill('').map((_, i) => (
                                <Icon
                                    as={FaStar}
                                    key={i}
                                    color={i < selectedCourse.rating ? "yellow.500" : "gray.300"}
                                />
                            ))}
                        </Flex>
                    </Box>
                    {/* Add two more cards if needed with different details */}
                    <Box p={4} borderRadius="lg" boxShadow="md" bg="white">
                        <Heading as="h4" size="md" mb={2}>Additional Detail 1</Heading>
                        <Text>{selectedCourse.additionalDetail1}</Text>
                    </Box>
                    <Box p={4} borderRadius="lg" boxShadow="md" bg="white">
                        <Heading as="h4" size="md" mb={2}>Additional Detail 2</Heading>
                        <Text>{selectedCourse.additionalDetail2}</Text>
                    </Box>
                </SimpleGrid>
            </Box>
        </Center>
    );
}
