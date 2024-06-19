import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleArrows } from '@fortawesome/free-solid-svg-icons'; // Assuming you want to use a users icon for students

export default function Small5({ totalconverted }) {
  return (
    <Flex alignItems="center">
      <Box mr="7px">
        <FontAwesomeIcon icon={faPeopleArrows} size='2xl' />
      </Box>
      <Box ml={3}>
        <Heading as="h6" size="md">Leads Converted</Heading>
        <Text fontSize={20} fontWeight="semibold">{totalconverted}</Text>
      </Box>
    </Flex>
  );
}
