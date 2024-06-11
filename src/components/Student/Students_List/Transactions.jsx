import React, { useEffect, useState, useRef } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Flex, Spinner, Heading, Input, FormControl, FormLabel, Select, Grid, Divider, Text } from '@chakra-ui/react';
import NetworkError from '../../NotFound/networkError';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import TimeConversion from '../../../utils/timeConversion';
import { selectstudentWalletData, selectstudentWalletError, selectstudentWalletLoading, fetchstudentWalletData } from "../../../app/Slices/studentWalletSlice";

export default function Student_Transactions() {
    const { student_id } = useParams();
    const dispatch = useDispatch();
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const transactionsData = useSelector(selectstudentWalletData);
    const error = useSelector(selectstudentWalletError);
    const isLoading = useSelector(selectstudentWalletLoading);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        dispatch(fetchstudentWalletData());
    }, [dispatch]);

    const handleStartDateChange = (e) => {
        const selectedStartDate = e.target.value;
        setStartDate(selectedStartDate);
    };

    const handleEndDateChange = (e) => {
        const selectedEndDate = e.target.value;
        setEndDate(selectedEndDate);
    };

    const handleFilterTypeChange = (e) => {
        const selectedFilterType = e.target.value;
        setFilterType(selectedFilterType);
    };

    const filteredTransactions = transactionsData.filter((transaction) => {
        const matchesStudentId = transaction.student_id === student_id;
        const startDateUnix = startDate ? new Date(startDate).getTime() / 1000 : 0;
        const endDateUnix = endDate ? new Date(endDate).getTime() / 1000 : Number.MAX_SAFE_INTEGER;

        const isWithinDateRange = transaction.createdOn >= startDateUnix && transaction.createdOn <= endDateUnix;

        if (filterType === 'All') {
            return matchesStudentId && isWithinDateRange;
        } else {
            return matchesStudentId && isWithinDateRange && transaction.type === filterType;
        }
    });
    const filteredCount = filteredTransactions.length;

    if (isLoading) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (error) {
        return <NetworkError />;
    }

    return (
        <Box p="4">
            <Heading fontWeight="bold" fontSize="30" mb="4">All Transactions({filteredCount}) </Heading>
            <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={{ base: 2, md: 4 }} mb="4">
                <FormControl>
                    <FormLabel>Start Date</FormLabel>
                    <Input type="date" ref={startDateRef} value={startDate} onChange={handleStartDateChange} size="sm" maxW={300} cursor="pointer" />
                </FormControl>
                <FormControl>
                    <FormLabel>End Date</FormLabel>
                    <Input type="date" ref={endDateRef} value={endDate} onChange={handleEndDateChange} size="sm" maxW={300} cursor="pointer" />
                </FormControl>
                <FormControl>
                    <FormLabel>Filter By Type</FormLabel>
                    <Select value={filterType} onChange={handleFilterTypeChange} size="sm" maxW={300} >
                        <option value="All">All</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </Select>
                </FormControl>
            </Grid>
            <Divider py="0.45" borderWidth="1" bg="black" />

            <Box overflow="auto">
                {filteredTransactions.length === 0 ? (
                    <Flex justify="center" align="center" height="100%">
                        <Box textAlign="center" mt={50}>
                            <Text fontSize="xl" fontWeight="bold">No transaction available</Text>
                        </Box>
                    </Flex>
                ) : (
                    <Table variant="simple" >
                        <Thead>
                            <Tr>
                                <Th>Transaction ID</Th>
                                <Th>Student ID</Th>
                                <Th>Amount</Th>
                                <Th>Last Amount</Th>
                                <Th>Type</Th>
                                <Th>Status</Th>
                                <Th>Date</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredTransactions.map((transaction) => (
                                <Tr key={transaction.trans_id}>
                                    <Td>{transaction.trans_id}</Td>
                                    <Td>{transaction.student_id}</Td>
                                    <Td>{transaction.type === 'credit' ? `+${transaction.amount}` : `-${transaction.amount}`}</Td>
                                    <Td>{transaction.last_amount}</Td>
                                    <Td>{transaction.type}</Td>
                                    <Td>{transaction.status}</Td>
                                    <Td>{TimeConversion.unixTimeToRealTime(transaction.createdOn)}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </Box>
        </Box>
    );
}
