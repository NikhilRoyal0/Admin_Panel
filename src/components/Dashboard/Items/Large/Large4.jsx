import React from 'react';
import { ChakraProvider, Box, Flex, Heading } from '@chakra-ui/react';

export default function Large4() {
    const cards = Array.from({ length: 4 }, (_, index) => index + 1);

    return (
        <ChakraProvider>
            <Box p={5} overflow="auto" width="450px" height="400px" css={{
                '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#cbd5e0',
                    borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#a0aec0',
                },
            }}>
                <Flex direction="column" align="center">
                    {cards.map(card => (
                        <Box
                            key={card}
                            border="1px solid #ccc"
                            borderRadius="8px"
                            boxShadow="lg"
                            color="antiquewhite"
                            textColor='black'
                            p="16px"
                            m="8px"
                            width="100%"
                            maxWidth="400px"
                            textAlign="center"
                        >
                            Card {card}
                        </Box>
                    ))}
                </Flex>
            </Box>
        </ChakraProvider>
    );
}
