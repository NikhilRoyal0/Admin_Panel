import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';

export default function Small1({ totalBranches }) {
  return (
    <Flex alignItems="center">
      <Box mr="10px">
        <FontAwesomeIcon icon={faCodeBranch} size="2x"/>
      </Box>
      <Box ml={3}>
        <Heading as="h6" size="md">Total Branches</Heading>
        <Text fontSize={20} fontWeight="semibold">{totalBranches}</Text>
      </Box>
    </Flex>
  );
}
