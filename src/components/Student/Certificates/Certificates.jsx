import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import {
  fetchCertificateData,
  selectCertificateData,
  selectCertificateLoading,
  selectCertificateError,
  AddCertificateData,
} from "../../../app/Slices/certificateSlice";
import NetworkError from "../../NotFound/networkError";
import { getModulePermissions } from "../../../utils/permissions";


export default function Certificate() {
  const [isAddCertificateModalOpen, setIsAddCertificateModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newCertificateData, setNewCertificateData] = useState({
    title: "",
    studentName: "",
    issueBy: "",
  });

  const CertificateData = useSelector(selectCertificateData);
  const isLoading = useSelector(selectCertificateLoading);
  const error = useSelector(selectCertificateError);
  const dispatch = useDispatch();
  const Toast = useToast({
    position: "top-right",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [CertificatePerPage, setCertificatePerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchCertificateData());
  }, [dispatch]);

  const handleAddCertificate = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("title", newCertificateData.title);
    formData.append("studentName", newCertificateData.studentName);
    formData.append("issueBy", newCertificateData.issueBy);
    dispatch(AddCertificateData(formData))
      .then(() => {
        dispatch(fetchCertificateData());
        setIsSaveLoading(false);
        Toast({
          title: "Certificate added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewCertificateData({
          title: "",
          studentName: "",
          issueBy: "",
        });
        setIsAddCertificateModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to add Certificate",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

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

  const totalPages = Math.ceil(CertificateData.length / CertificatePerPage);

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
          variant={currentPage === i ? "solid" : "outline"}
          colorScheme={currentPage === i ? "blue" : undefined}
          mr={2}
        >
          {i}
        </Button>
      );
    }
    return pageButtons;
  };

  const indexOfLastCertificate = currentPage * CertificatePerPage;
  const indexOfFirstCertificate = indexOfLastCertificate - CertificatePerPage;
  const currentCertificate = CertificateData.slice(indexOfFirstCertificate, indexOfLastCertificate);

  const branchManagementPermissions = getModulePermissions('Certificates');
  const canAddData = branchManagementPermissions.create;


  return (
    <Box p="3">
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          Certificates List
        </Text>
        <Flex align="center">
          <Button
            mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => {
              if (canAddData) {
                setIsAddCertificateModalOpen(true)
              } else {
                Toast({
                  title: "You don't have permission to add certificate",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                  position: "top-right",
                });
              }
            }}
          >
            Add Certificate
          </Button>
        </Flex>
      </Flex>
      <Box
        bg="gray.100"
        p="6"
        borderRadius="lg"
        overflowX="auto"
        css={{
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
        }}
      >
        {currentCertificate.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No Certificates available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>Certificate Title</Th>
                <Th>Student Name</Th>
                <Th>Issued By</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentCertificate.map((Certificate, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Certificate.title}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Certificate.studentName}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Certificate.issueBy}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Flex justify="flex-end" mt="4">
        <Button onClick={() => paginate(1)} mr={2}>&lt;&lt;</Button>
        <Button onClick={() => paginate(currentPage - 1)} mr={2}>&lt;</Button>
        {renderPagination()}
        <Button onClick={() => paginate(currentPage + 1)} ml={2}>&gt;</Button>
        <Button onClick={() => paginate(totalPages)} ml={2}>&gt;&gt;</Button>
      </Flex>

      {/* Add Certificate Modal */}
      <Modal
        isOpen={isAddCertificateModalOpen}
        onClose={() => setIsAddCertificateModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddCertificate}>
          <ModalContent>
            <ModalHeader>Add Certificate</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                mb="3"
                placeholder="Certificate Title"
                value={newCertificateData.title}
                onChange={(e) =>
                  setNewCertificateData({
                    ...newCertificateData,
                    title: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Student Name"
                value={newCertificateData.studentName}
                onChange={(e) =>
                  setNewCertificateData({
                    ...newCertificateData,
                    studentName: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Issued By"
                value={newCertificateData.issueBy}
                onChange={(e) =>
                  setNewCertificateData({
                    ...newCertificateData,
                    issueBy: e.target.value,
                  })
                }
                isRequired
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                colorScheme="teal"
                isLoading={isSaveLoading}
                spinner={<BeatLoader size={8} color="white" />}
              >
                Submit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsAddCertificateModalOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Box>
  );
}
