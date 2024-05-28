import React, { useState } from 'react';
import { ChakraProvider, Box, Heading, Flex } from '@chakra-ui/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function StudentAttendance() {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const attendanceData = {
    '2024-05-28': 'Present',
    '2024-05-29': 'Absent',
  };

  const tileClassName = ({ date }) => {
    const currentDate = date.toISOString().split('T')[0];
    return attendanceData[currentDate] === 'Present' ? 'present-day' : null;
  };

  const tileContent = ({ date }) => {
    const currentDate = date.toISOString().split('T')[0];
    return attendanceData[currentDate] ? <p>{attendanceData[currentDate]}</p> : null;
  };

  return (
    <ChakraProvider>
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <Box>
          <Heading mb={5} textAlign="center">Student Attendance</Heading>
          <Flex justifyContent="center">
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} width="100%">
              <Calendar
                onChange={onChange}
                value={date}
                tileClassName={tileClassName}
                tileContent={tileContent}
              />
            </Box>
          </Flex>
        </Box>
      </Box>
    </ChakraProvider>
  );
}
