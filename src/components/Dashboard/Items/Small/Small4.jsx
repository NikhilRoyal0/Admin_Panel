import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons'; // Assuming you want to use a certificate icon

export default function Small4({ totalCertificates }) {
  return (
    <Flex alignItems="center">
      <Box mr="10px">
        <FontAwesomeIcon icon={faCertificate} size="2x"/>
      </Box>
      <Box ml={3}>
        <Heading as="h9" fontSize={18} >Issued Certificates</Heading>
        <Text fontSize={20} fontWeight="semibold">{totalCertificates}</Text>
      </Box>
    </Flex>
  );
}
