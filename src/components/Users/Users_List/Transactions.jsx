import React, { useEffect, useState, useRef } from 'react';
import { Table, Thead, Tbody, useToast, Modal, ModalBody, ModalFooter, ModalHeader, ModalContent, ModalCloseButton, ModalOverlay, Button, Tr, GridItem, Th, Td, Box, Flex, Spinner, Heading, Input, FormControl, FormLabel, Select, Grid, Divider, Text, Textarea } from '@chakra-ui/react';
import NetworkError from '../../NotFound/networkError';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import TimeConversion from '../../../utils/timeConversion';
import { selectuserWalletData, selectuserWalletError, selectuserWalletLoading, fetchuserWalletData, AdduserWalletData } from "../../../app/Slices/userWalletSlice";
import { BeatLoader } from "react-spinners";
import { selectUsersData, selectUsersError, selectUsersLoading, fetchUsersData } from "../../../app/Slices/usersSlice";

export default function User_Transactions() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const Toast = useToast({
    position: "top-right",
  });
  const transactionsData = useSelector(selectuserWalletData);
  const error = useSelector(selectuserWalletError);
  const isLoading = useSelector(selectuserWalletLoading);
  const userData = useSelector(selectUsersData);
  const userError = useSelector(selectUsersError);
  const userLoading = useSelector(selectUsersLoading);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [newTransactionData, setNewTransactionData] = useState({
    userId: "",
    amount: "",
    type: "",
    createdOn: Date.now(),
    status: "inprogress",
    reason: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const purchasePerPage = 10;


  useEffect(() => {
    dispatch(fetchuserWalletData());
    dispatch(fetchUsersData());
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

  const handleNewTransaction = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const amount = parseFloat(newTransactionData.amount);
    const user = userData.find(user => user.userId === userId);
    const userWalletAmount = user.walletAmount;

    if (newTransactionData.type === 'debit' && amount > userWalletAmount) {
      setIsSaveLoading(false);
      Toast({
        title: "Insufficient balance",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("amount", newTransactionData.amount);
    formData.append("type", newTransactionData.type);
    formData.append("createdOn", Date.now());
    formData.append("status", "inprogress");
    formData.append("reason", newTransactionData.reason);

    dispatch(AdduserWalletData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "Transaction added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewTransactionData({
          userId: "",
          amount: "",
          type: "",
          createdOn: Date.now(),
          status: "",
          reason: "",
        });
        setIsNewTransactionModalOpen(false);
        dispatch(fetchuserWalletData());
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to add transaction",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const filteredTransactions = transactionsData.filter((transaction) => {
    const matchesuserId = transaction.userId === userId;
    const startDateUnix = startDate ? new Date(startDate).getTime() / 1 : 0;
    const endDateUnix = endDate ? new Date(endDate).getTime() / 1 : Number.MAX_SAFE_INTEGER;

    const isWithinDateRange = transaction.createdOn >= startDateUnix && transaction.createdOn <= endDateUnix;

    if (filterType === 'All') {
      return matchesuserId && isWithinDateRange;
    } else {
      return matchesuserId && isWithinDateRange && transaction.type === filterType;
    }
  });

  if (isLoading || userLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error || userError) {
    return <NetworkError />;
  }

  const totalPages = Math.ceil(filteredTransactions.length / purchasePerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1) {
      setCurrentPage(1);
    } else if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <Button
          key={i}
          onClick={() => paginate(i)}
          variant={currentPage === i ? 'solid' : 'outline'}
          colorScheme={currentPage === i ? 'blue' : undefined}
          mr={2}
        >
          {i}
        </Button>
      );
    }
    return pageButtons;
  };

  const indexOfLastTransaction = currentPage * purchasePerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - purchasePerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const filteredCount = filteredTransactions.length

  return (
    <Box p="4">
      <Grid templateColumns={{ base: "1fr", sm: "1fr auto" }}
        alignItems="center" mb="4" >
        <GridItem>
          <Heading fontWeight="bold" fontSize="30">
            All Transactions ({filteredCount})
          </Heading>
        </GridItem>
        <GridItem>
          <Button
            mr={5}
            ml="4"
            mt={5}
            colorScheme="teal"
            onClick={() => {
              setIsNewTransactionModalOpen(true);
            }}
          >
            New Transaction
          </Button>
        </GridItem>
      </Grid>
      <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={{ base: 2, md: 4 }} mb="4">
        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <Input type="date" value={startDate} onChange={handleStartDateChange} size="sm" maxW={300} cursor="pointer" />
        </FormControl>
        <FormControl>
          <FormLabel>End Date</FormLabel>
          <Input type="date" value={endDate} onChange={handleEndDateChange} size="sm" maxW={300} cursor="pointer" />
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
        {currentTransactions.length === 0 ? (
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
                <Th>user ID</Th>
                <Th>Amount</Th>
                <Th>Current Amount</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentTransactions.map((transaction) => (
                <Tr key={transaction.trans_id}>
                  <Td>{transaction.trans_id}</Td>
                  <Td>{transaction.userId}</Td>
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
        {currentTransactions.length > 0 && (
          <Flex justify="flex-end" mt="4">
            <Button onClick={() => paginate(1)} mr={2}>
              &lt;&lt;
            </Button>
            <Button onClick={() => paginate(currentPage - 1)} mr={2}>
              &lt;
            </Button>
            {renderPagination()}
            <Button onClick={() => paginate(currentPage + 1)} mr={2}>
              &gt;
            </Button>
            <Button onClick={() => paginate(totalPages)} mr={2}>
              &gt;&gt;
            </Button>
          </Flex>
        )}
      </Box>
      <Modal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
        size="md"
      >
        <ModalOverlay />
        <form onSubmit={handleNewTransaction}>
          {" "}
          <ModalContent>
            <ModalHeader>New Transaction</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns={{ base: "1fr", md: "repeat(1, 1fr)" }} gap={3}>
                <Input
                  mb="3"
                  placeholder="Amount"
                  value={newTransactionData.amount}
                  onChange={(e) =>
                    setNewTransactionData({
                      ...newTransactionData,
                      amount: e.target.value,
                    })
                  }
                  isRequired
                />
                <Select
                  mb="3"
                  placeholder="Select type"
                  value={newTransactionData.type}
                  onChange={(e) =>
                    setNewTransactionData({
                      ...newTransactionData,
                      type: e.target.value,
                    })
                  }
                  isRequired
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </Select>
                <Textarea
                  mb="3"
                  placeholder="Reason"
                  value={newTransactionData.reason}
                  onChange={(e) =>
                    setNewTransactionData({
                      ...newTransactionData,
                      reason: e.target.value,
                    })
                  }
                  isRequired
                />
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button
                mr={2}
                type="submit"
                colorScheme="teal"
                isLoading={isSaveLoading}
                spinner={<BeatLoader size={8} color="white" />}
              >
                Submit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsNewTransactionModalOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>{" "}
        {/* Close form tag */}
      </Modal>
    </Box>

  );
}
