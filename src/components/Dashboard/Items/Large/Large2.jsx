import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Divider } from '@chakra-ui/react';

export default function Large2() {
  // Sample data for upcoming courses
  const upcomingCourses = [
    { id: 1, name: 'Upcoming Course 1', instructor: 'John Doe', startDate: '2024-08-01', duration: '8 weeks' },
    { id: 2, name: 'Upcoming Course 2', instructor: 'Jane Smith', startDate: '2024-08-15', duration: '10 weeks' },
    { id: 3, name: 'Upcoming Course 3', instructor: 'Alice Johnson', startDate: '2024-09-01', duration: '6 weeks' },
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
      <Text fontSize="xl" fontWeight="bold" mb="4">Upcoming Courses</Text>
      <Divider />
      <Table variant="simple" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Instructor</Th>
            <Th>Start Date</Th>
            <Th>Duration</Th>
          </Tr>
        </Thead>
        <Tbody>
          {upcomingCourses.map(course => (
            <Tr key={course.id}>
              <Td>{course.id}</Td>
              <Td>{course.name}</Td>
              <Td>{course.instructor}</Td>
              <Td>{course.startDate}</Td>
              <Td>{course.duration}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
