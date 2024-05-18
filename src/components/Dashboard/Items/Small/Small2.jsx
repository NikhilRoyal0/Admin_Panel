import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons'; // Assuming you want to use a users icon for students

export default function Small2({ totalStudents }) {
  return (
    <Flex alignItems="center">
      <Box mr="10px">
        <FontAwesomeIcon icon={faUsers} size="2x"/>
      </Box>
      <Box ml={3}>
        <Heading as="h6" size="md">Total Students</Heading>
        <Text fontSize={20} fontWeight="semibold">{totalStudents}</Text>
      </Box>
    </Flex>
  );
}
