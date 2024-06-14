import React from 'react';
import { Flex, Box, Heading, Text, Button, Grid, GridItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function View() {
  const navigate = useNavigate();

  const handleViewAllLeads = () => {
    navigate('/leads/viewLeads');
  };

  const handleAddLead = () => {
    navigate('/leads/addLead');
  };

  return (
    <Box p="4" m={5}>
      <Flex minHeight="80vh" justify="center" align="center" p={4}>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={20}>
          <GridItem>
            <Box
              p={8}
              borderWidth="1px"
              bg="white"
              borderRadius="lg"
              maxW="3xl"
              width="100%"
              textAlign="center"
              transition="transform 0.3s, box-shadow 0.3s"
              _hover={{
                transform: 'scale(1.55)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Heading as="h2" size="lg" mb={4}>
                View All Leads
              </Heading>
              <Text mb={6}>Click below to view all leads</Text>
              <Button colorScheme="teal" onClick={handleViewAllLeads}>
                View All Leads
              </Button>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              p={8}
              borderWidth="1px"
              bg="white"
              borderRadius="lg"
              maxW="3xl"
              width="100%"
              textAlign="center"
              transition="transform 0.3s, box-shadow 0.3s"
              _hover={{
                transform: 'scale(1.55)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Heading as="h2" size="lg" mb={4}>
                Add Lead
              </Heading>
              <Text mb={6}>Click below to add a new lead</Text>
              <Button colorScheme="teal" onClick={handleAddLead}>
                Add Lead
              </Button>
            </Box>
          </GridItem>
        </Grid>
      </Flex>
    </Box>
  );
}
