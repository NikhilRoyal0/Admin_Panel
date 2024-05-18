import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons'; // Assuming you want to use a book icon for courses

export default function Small3({ totalCourses }) {
  return (
    <Flex alignItems="center">
      <Box mr="10px">
        <FontAwesomeIcon icon={faBook} size="2x"/>
      </Box>
      <Box ml={3}>
        <Heading as="h6" size="md">Total Courses</Heading>
        <Text fontSize={20} fontWeight="semibold">{totalCourses}</Text>
      </Box>
    </Flex>
  );
}
