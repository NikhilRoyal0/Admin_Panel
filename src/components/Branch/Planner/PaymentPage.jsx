import React, { useState, useEffect } from "react";
import {
  GridItem,
  Text,
  Checkbox,
  Flex,
  Box,
  CloseButton,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";

const PaymentPage = ({
  newbranchPlannerData,
  setNewbranchPlannerData,
}) => {
  const initialSelectedpaymentMode = newbranchPlannerData.paymentMode || [];
  const [selectedpaymentMode, setSelectedpaymentMode] = useState(
    initialSelectedpaymentMode
  );
  const [isOpen, setIsOpen] = useState(false);

  const paymentModeData = [
    { id: 1, mode: "Credit Card " },
    { id: 2, mode: "Debit Card " },
    { id: 3, mode: "UPI" },
    { id: 4, mode: "Net Banking" },
    { id: 5, mode: "Cash" },
    { id: 6, mode: "EMI" },
    { id: 7, mode: "Cheque" },
    { id: 8, mode: "Demand Draft" },
  ];

  useEffect(() => {
    setNewbranchPlannerData((prevData) => ({
      ...prevData,
      paymentMode: selectedpaymentMode,
    }));
  }, [selectedpaymentMode, setNewbranchPlannerData]);

  const togglePaymentModeSelection = (mode) => {
    if (isSelected(mode)) {
      setSelectedpaymentMode(
        selectedpaymentMode.filter(
          (selectedMode) => selectedMode.id !== mode.id
        )
      );
    } else {
      setSelectedpaymentMode([...selectedpaymentMode, mode]);
    }
  };

  const isSelected = (mode) => {
    return selectedpaymentMode.some(
      (selectedMode) => selectedMode.id === mode.id
    );
  };

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSelectedpaymentMode(initialSelectedpaymentMode);
    }
  };

  const removeMode = (mode) => {
    setSelectedpaymentMode(
      selectedpaymentMode.filter((selectedMode) => selectedMode.id !== mode.id)
    );
  };


  return (
    <GridItem colSpan={2}>
      <Flex flexDirection="column" alignItems="flex-start">
        <Menu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <MenuButton
            as={IconButton}
            icon={
              <Text m={5} display="flex">
                Select Payment Mode{" "}
                <MdArrowDropDown style={{ marginLeft: "5px" }} size={25} />
              </Text>
            }
            variant="outline"
            size="md"
            aria-label="Select Payment Mode"
            maxWidth={200}
            onClick={handleMenuToggle}
          >
            Select Payment Mode
          </MenuButton>
          <MenuList minWidth="240px">
            {paymentModeData.map((mode) => (
              <MenuItem key={mode.id}>
                <Checkbox
                  mr={2}
                  isChecked={isSelected(mode)}
                  onChange={() => togglePaymentModeSelection(mode)}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {mode.mode}
                </Checkbox>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Box
          border="1px solid"
          borderColor="gray.300"
          p={3}
          borderRadius="md"
          mt={3}
          width="100%"
          mb={3}
        >
          <Flex flexWrap="wrap" mt={1}>
            {selectedpaymentMode.map((mode) => (
              <Flex
                key={mode.id}
                alignItems="center"
                mr={2}
                mb={2}
                bg="gray.100"
                p={2}
                borderRadius="md"
              >
                <Text>{mode.mode}</Text>
                <CloseButton ml={2} onClick={() => removeMode(mode)} />
              </Flex>
            ))}
          </Flex>
        </Box>
      </Flex>
    </GridItem>
  );
};

export default PaymentPage;
