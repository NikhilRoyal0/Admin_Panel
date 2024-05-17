import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import loginimg from "../../assets/images/login-bg.png";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/dashboard");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#f0f0f0"
      minHeight="100vh"
    >
      <Stack direction={{ base: "column", md: "row" }} spacing="20px">
        <Box
          width={{ base: "100%", md: "100%" }}
          backgroundColor="white"
          color="black"
          borderRadius="md"
          overflowX="auto"
          overflowY="auto"
          display="flex"
          p="5"
        >
          <form onSubmit={handleSubmit}>
            <Heading as="h1" size="lg" mb="4" mt="10">
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
                onChange={(e) => setemail(e.target.value)}
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
          <Box width={{ base: "100%", md: "50%" }} ml={20}>
            <Image
              src={loginimg}
              alt="Portrait"
              maxWidth="100%"
              maxHeight="100%"
              height="450px"
              objectFit=""
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
