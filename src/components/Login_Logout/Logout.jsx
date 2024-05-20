import React, {useEffect} from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Text,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { logout } from '../../utils/auth';


export default function Logout() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    if (location.pathname === "/logout") {
      logout(); 
    }
  }, [location.pathname]);



  return (
    <Center h="100vh">
      <Box maxW="400px" w="full" bg="white" rounded="md" shadow="md" p="4">
        <Flex direction="column" align="center">
          <Icon as={CheckCircleIcon} w={12} h={12} color="green.500" />
          <Heading size="lg" mt="4" textAlign="center">
            Successfully Logged Out
          </Heading>
          <Text mt="2" textAlign="center">
            Login again to access the page
          </Text>
          <Button mt="6" colorScheme="blue" onClick={handleGoToLogin}>
            Go to Login
          </Button>
        </Flex>
      </Box>
    </Center>
  );
}
