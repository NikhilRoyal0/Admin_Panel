import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { login, isAuthenticated } from "../../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      if (isAuthenticated()) {
        window.location.replace("/dashboard");
      } else {
        setError("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("Login Error:", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#f0f0f0"
      minHeight="100vh"
    >
      <Box
        width="-moz-fit-content"
        backgroundColor="white"
        color="black"
        borderRadius="xl"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <Box p="5" flex="1">
          <form onSubmit={handleSubmit}>
            <Heading as="h1" size="lg" mb="4" mt="8">
              Welcome Back!
            </Heading>
            <Text color="gray.600" mb="4">
              Welcome Back! Please enter your details
            </Text>

            <FormControl mb="3">
              <FormLabel>Email Address</FormLabel>
              <Input
                placeholder="Enter your email address"
                size="sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl mb="3">
              <FormLabel>Password</FormLabel>
              <Input
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                size="sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                pr="3.5rem"
                _focus={{
                  borderColor: "blue.400",
                }}
              />
              <Button
                position="absolute"
                right="0.1rem"
                size="sm"
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </FormControl>

            {error && (
              <Text color="red.500" mb="4">
                {error}
              </Text>
            )}

            <FormControl display="flex" alignItems="center" mb="3">
              <Checkbox defaultChecked={false} />
              <FormLabel ml="2" fontSize="sm">
                Remember me
              </FormLabel>
            </FormControl>

            <Button
              colorScheme="blue"
              variant="solid"
              size="md"
              width="100%"
              type="submit"
            >
              Sign in
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
