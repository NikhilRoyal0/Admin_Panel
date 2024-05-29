import React, { useState } from 'react';
import { ChakraProvider, Box, Heading, SimpleGrid, Text, Flex, Input, Button, HStack } from '@chakra-ui/react';

export default function StaffAttendance() {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(4);

  const attendanceData = {
    '2024-05-07': { status: 'A', shift: '09:00 - 17:00', login: 'N/A', netHours: 'N/A' },
    '2024-05-06': { status: 'HW', shift: '09:00 - 17:00', login: '09:05 - 17:12 ', netHours: '7h 55m' },
    '2024-05-05': { status: 'H', shift: '09:00 - 17:00', login: '09:05 - 17:12', netHours: 'N/A' },
    '2024-05-04': { status: 'L', shift: '09:00 - 17:00', login: 'N/A', netHours: 'N/A' },
    '2024-05-03': { status: 'U', shift: '09:00 - 17:00', login: 'N/A', netHours: 'N/A' },
    '2024-05-02': { status: 'P', shift: '09:00 - 17:00', login: '09:05 - 17:12', netHours: '7h 50m' },
    '2024-05-01': { status: 'A', shift: '09:00 - 17:00', login: 'N/A', netHours: 'N/A' },
  };

  const getAllDatesInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const dates = [];
    while (date.getMonth() === month) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const datesInMonth = getAllDatesInMonth(year, month);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const getColorScheme = (status) => {
    switch (status) {
      case 'P':
        return { bg: 'green.100', text: 'green.500', displayText: 'Present' };
      case 'A':
        return { bg: 'red.100', text: 'red.500', displayText: 'Absent' };
      case 'H':
        return { bg: 'blue.100', text: 'blue.500', displayText: 'Holiday' };
      case 'HW':
        return { bg: 'purple.100', text: 'purple.500', displayText: 'Half Day' };
      case 'L':
        return { bg: 'yellow.100', text: 'yellow.500', displayText: 'Leave' };
      case 'U':
        return { bg: 'gray.100', text: 'gray.500', displayText: 'Unmarked' };
      default:
        return { bg: 'white', text: 'gray.500', displayText: 'No Data' };
    }
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const changeMonth = (direction) => {
    setMonth((prevMonth) => {
      let newMonth = prevMonth + direction;
      if (newMonth < 0) {
        newMonth = 11;
        setYear((prevYear) => prevYear - 1);
      } else if (newMonth > 11) {
        newMonth = 0;
        setYear((prevYear) => prevYear + 1);
      }
      return newMonth;
    });
  };

  const changeYear = (direction) => {
    setYear((prevYear) => prevYear + direction);
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" p={4}>
      <Box mb={5} mt={5}>
        <HStack justifyContent="space-between" mb={4}>
          <Input
            placeholder="Search staff by the staff id and name..."
            width="400px"
          />
          <HStack spacing={2}>
            <Button onClick={() => changeYear(-1)}>&laquo;</Button>
            <Button onClick={() => changeMonth(-1)}>&lsaquo;</Button>
            <Text fontSize="lg">{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</Text>
            <Button onClick={() => changeMonth(1)}>&rsaquo;</Button>
            <Button onClick={() => changeYear(1)}>&raquo;</Button>
          </HStack>
        </HStack>
      </Box>
      <Flex flexGrow={1} justifyContent="center">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} width="100%">

          <SimpleGrid columns={[1, 2, 3, 4, 7]} spacing={4} flexGrow={1}>
            {datesInMonth.map((date) => {
              const dateString = date.toISOString().split('T')[0];
              const attendance = attendanceData[dateString] || { status: 'No Data', shift: 'N/A', login: 'N/A', netHours: 'N/A' };
              const dayOfWeek = daysOfWeek[date.getDay()];
              const today = new Date();
              const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

              return (
                <Box
                  key={dateString}
                  bg={getColorScheme(attendance.status).bg}
                  color={getColorScheme(attendance.status).text}
                  boxShadow={isToday ? "outline" : "md"}
                  p="4"
                  borderRadius="md"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                >
                  <Text fontSize="18px" fontWeight="bold">
                    {formatDate(date)}
                  </Text>
                  <Text fontSize="16px" mt="2" fontWeight="medium" color={getColorScheme(attendance.status).text}>
                    {dayOfWeek}
                  </Text>
                  <Text fontSize="16px" mt="2" fontWeight="medium" color={getColorScheme(attendance.status).text}>
                    {getColorScheme(attendance.status).displayText}
                  </Text>
                  <Text fontSize="14px" mt="1">
                    Shift: {attendance.shift}
                  </Text>
                  <Text fontSize="14px" mt="1">
                    Login: {attendance.login}
                  </Text>
                  <Text fontSize="14px" mt="1">
                    Net Hours: {attendance.netHours}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
}

