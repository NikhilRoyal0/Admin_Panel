import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Divider } from '@chakra-ui/react';

export default function Large1() {
    // Sample data for courses
    const courses = [
        { id: 1, name: 'Course 1', instructor: 'John Doe', duration: '8 weeks' },
        { id: 2, name: 'Course 2', instructor: 'Jane Smith', duration: '10 weeks' },
        { id: 3, name: 'Course 3', instructor: 'Alice Johnson', duration: '6 weeks' },
        { id: 4, name: 'Course 4', instructor: 'Bob Brown', duration: '12 weeks' },
        { id: 5, name: 'Course 5', instructor: 'Emily Davis', duration: '8 weeks' },
        { id: 6, name: 'Course 6', instructor: 'Michael Wilson', duration: '10 weeks' },
        { id: 7, name: 'Course 7', instructor: 'Samantha Garcia', duration: '6 weeks' },
        { id: 8, name: 'Course 8', instructor: 'David Martinez', duration: '12 weeks' },
        { id: 9, name: 'Course 9', instructor: 'Jennifer Rodriguez', duration: '8 weeks' },
        { id: 10, name: 'Course 10', instructor: 'Daniel Lee', duration: '10 weeks' },
        { id: 11, name: 'Course 11', instructor: 'Melissa Taylor', duration: '6 weeks' },
        { id: 12, name: 'Course 12', instructor: 'Christopher Hernandez', duration: '12 weeks' },
        // Add more courses as needed
    ];

    return (
        <Box height="350px" overflowY="scroll" css={{
            '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
                backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#cbd5e0',
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#a0aec0',
            },
        }}>
            <Text fontSize="xl" fontWeight="bold" mb="4">Available Courses</Text>
            <Divider />
            <Table variant="simple" colorScheme="gray">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Instructor</Th>
                        <Th>Duration</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {courses.map(course => (
                        <Tr key={course.id}>
                            <Td>{course.id}</Td>
                            <Td>{course.name}</Td>
                            <Td>{course.instructor}</Td>
                            <Td>{course.duration}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
}
