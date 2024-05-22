import React, { useState } from 'react';
import { Flex, Box, Text, IconButton, Icon } from '@chakra-ui/react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

export default function Calendar() {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const totalDays = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const firstDay = getFirstDayOfMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const renderCalendar = () => {
    const calendar = [];
    let day = 1;
    const todayDate = today.getDate(); // Get the day of the month for today

    // Render days of the week with color
    const days = daysOfWeek.map((day, index) => (
      <Box key={index} p={2} textAlign="center" fontWeight="bold" color="blue.500">
        {day}
      </Box>
    ));

    calendar.push(
      <Flex key="days-of-week" justify="space-around">
        {days}
      </Flex>
    );

    // Render days of the month with color
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push(<Box key={`empty-${j}`} flex="1" />);
        } else if (day <= totalDays) {
          const isToday = day === todayDate && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
          week.push(
            <Box
              key={day}
              flex="1"
              p={2}
              textAlign="center"
              color={isToday ? "blue.500" : "black"}
              fontWeight={isToday ? "bold" : "normal"}
              bgColor={isToday ? "blue.100" : ""}
              borderRadius={isToday ? "10px" : ""}
            >
              {day}
            </Box>
          );
          day++;
        } else {
          week.push(<Box key={`empty-${j}`} flex="1" />);
        }
      }
      calendar.push(
        <Flex key={`week-${i}`} justify="space-around">
          {week}
        </Flex>
      );
    }

    return calendar;
  };


  const handlePrevMonth = () => {
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(nextMonth);
  };

  const handlePrevYear = () => {
    const prevYear = new Date(currentDate.getFullYear() - 1, 0, 1);
    setCurrentDate(prevYear);
  };

  const handleNextYear = () => {
    const nextYear = new Date(currentDate.getFullYear() + 1, 0, 1);
    setCurrentDate(nextYear);
  };

  return (
    <Box width="auto" overflowX="auto" css={{
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
      }
    }}
    >
      <Flex align="center" mb={5}>
        <IconButton
          variant="ghost"
          fontSize={30}
          aria-label="Previous Year"
          icon={<Icon as={MdChevronLeft} />}
          onClick={handlePrevYear}
        />
        <IconButton
          variant="ghost"
          fontSize={25}
          aria-label="Previous Month"
          icon={<Icon as={MdChevronLeft} />}
          onClick={handlePrevMonth}
        />
        <Flex ml={5} mr={5} align="center">
          <Text color="blue.500">{`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</Text>
        </Flex>
        <Flex>
          <IconButton
            variant="ghost"
            fontSize={25}
            aria-label="Next Month"
            icon={<Icon as={MdChevronRight} />}
            onClick={handleNextMonth}
          />
          <IconButton
            variant="ghost"
            fontSize={30}
            aria-label="Next Year"
            icon={<Icon as={MdChevronRight} />}
            onClick={handleNextYear}
          />
        </Flex>
      </Flex>

      {renderCalendar()}
    </Box>
  );
}
