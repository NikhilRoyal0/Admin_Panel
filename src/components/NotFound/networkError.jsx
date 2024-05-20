import React from 'react';
import { Box, Image, Heading, Text } from '@chakra-ui/react';
import networkErrorImage from '../../assets/images/networkError.png';

export default function NetworkError() {
  return (
    <Box textAlign="center" mt="20vh">
      <Image src={networkErrorImage} alt="Network Error" maxW="300px" mx="auto" mb="20px" />
      <Heading as="h1" fontSize="30px" fontWeight="bold" mb="10px">
        Network Error
      </Heading>
      <Text fontSize="20px" lineHeight="1.5">
        Sorry, something went wrong with the network. Please try again later.
      </Text>
    </Box>
  );
}
