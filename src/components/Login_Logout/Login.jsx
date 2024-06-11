import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { login, isAuthenticated, checkTokenExpiry } from "../../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      window.location.replace("/dashboard");
      checkTokenExpiry();
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const loginSuccessful = await login(email, password);
      if (loginSuccessful && isAuthenticated()) {
        navigate("/dashboard")
      } else {
        setError("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      if (error.message === "User is no longer available") {
        setError("User is no longer available.");
      } else if (error.message === "Role is no longer available for user") {
        setError("Role is no longer available for user.");
      } else if (error.message === "Invalid credentials") {
        setError("Sorry, your password and email was incorrect.");
      } else {
        setError("Enter valid credentials.");
      }
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
        width="fit-content"
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
