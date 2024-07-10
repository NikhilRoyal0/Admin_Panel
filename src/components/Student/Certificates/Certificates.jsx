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
  Select,
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
import {
  selecttempleteData,
  selecttempleteError,
  selecttempleteLoading,
  fetchtempleteData,
} from "../../../app/Slices/templete";
import {
  selectStudentData,
  selectStudentError,
  selectStudentLoading,
  fetchStudentData,
} from "../../../app/Slices/studentSlice";
import NetworkError from "../../NotFound/networkError";
import { getModulePermissions } from "../../../utils/permissions";
import TimeConversion from "../../../utils/timeConversion";

export default function Certificate() {
  const branchId = sessionStorage.getItem("BranchId");
  const [isAddCertificateModalOpen, setIsAddCertificateModalOpen] =
    useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newCertificateData, setNewCertificateData] = useState({
    title: "",
    studentName: "",
    student_id: "",
    issueDate: Date.now(),
    issueBy: "",
    certificateHash: "",
    templeteId: "",
    certificateNumber: "",
  });

  const CertificateData = useSelector(selectCertificateData);
  const templeteData = useSelector(selecttempleteData);
  const tempeleteError = useSelector(selecttempleteError);
  const templeteLoading = useSelector(selecttempleteLoading);
  const studentData = useSelector(selectStudentData);
  const studentError = useSelector(selectStudentError);
  const studentLoading = useSelector(selectStudentLoading);
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
    dispatch(fetchtempleteData());
    dispatch(fetchStudentData());
  }, [dispatch]);

  const DataByBranch =
    branchId == 0
      ? studentData
      : studentData.filter((user) => user.branchId == branchId);

      const TempleteData = templeteData.filter(branch => branch.status == 'Active');


  const handleAddCertificate = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("title", newCertificateData.title);
    formData.append("studentName", newCertificateData.studentName);
    formData.append("student_id", newCertificateData.student_id);
    formData.append("issueDate", Date.now());
    formData.append("issueBy", newCertificateData.issueBy);
    formData.append("certificateHash", newCertificateData.certificateHash);
    formData.append("templeteId", newCertificateData.templeteId);
    formData.append("certificateNumber", newCertificateData.certificateNumber);
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
          student_id: "",
          issueDate: "",
          issueBy: "",
          certificateHash: "",
          templeteId: "",
          certificateNumber: "",
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

  if (templeteLoading || studentLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (tempeleteError || studentError) {
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

    // Only render a maximum of 5 page buttons near the current page
    const maxButtonsToShow = 3;
    const startIndex = Math.max(
      Math.ceil(currentPage - (maxButtonsToShow - 1) / 2),
      1
    );
    const endIndex = Math.min(startIndex + maxButtonsToShow - 1, totalPages);

    for (let i = startIndex; i <= endIndex; i++) {
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

    if (startIndex > 1) {
      pageButtons.unshift(
        <Button key="first" onClick={() => paginate(1)} mr={2}>
          &lt;&lt;
        </Button>,
        <Button
          key="ellipsisBefore"
          onClick={() => paginate(startIndex - 1)}
          mr={2}
        >
          ...
        </Button>
      );
    }

    if (endIndex < totalPages) {
      pageButtons.push(
        <Button
          key="ellipsisAfter"
          onClick={() => paginate(endIndex + 1)}
          ml={2}
        >
          ...
        </Button>,
        <Button key="last" onClick={() => paginate(totalPages)} ml={2}>
          &gt;&gt;
        </Button>
      );
    }

    return pageButtons;
  };

  const indexOfLastCertificate = currentPage * CertificatePerPage;
  const indexOfFirstCertificate = indexOfLastCertificate - CertificatePerPage;
  const currentCertificate = CertificateData.slice(
    indexOfFirstCertificate,
    indexOfLastCertificate
  );

  const certificateManagementPermissions = getModulePermissions("Certificates");
  if (!certificateManagementPermissions) {
    return <NetworkError />;
  }
  const canAddData = certificateManagementPermissions.create;
  const canEditData = certificateManagementPermissions.update;
  const canDeleteData = certificateManagementPermissions.delete;

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
                setIsAddCertificateModalOpen(true);
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
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e0",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#a0aec0",
          },
        }}
      >
        {currentCertificate.length === 0 ? (
          <Flex justify="center" align="center" height="100%">
            <Box textAlign="center">
              <Text fontSize="xl" fontWeight="bold">
                No certificate available
              </Text>
            </Box>
          </Flex>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>Certificate Number</Th>
                <Th>Certificate Title</Th>
                <Th>Certificate Hash</Th>
                <Th>Student Name</Th>
                <Th>Issued By</Th>
                <Th>Template Id</Th>
                <Th>Issued Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentCertificate.map((Certificate, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Certificate.certificateNumber}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Certificate.title}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Certificate.certificateHash}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Certificate.studentName}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Certificate.issueBy}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Certificate.templeteId}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {TimeConversion.unixTimeToRealTime(Certificate.issueDate)}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Flex justify="flex-end" mt="4">
        {currentCertificate.length > 0 && (
          <Flex justify="flex-end" mt="4">
            {currentPage > 1 && (
              <Button onClick={() => paginate(currentPage - 1)} mr={2}>
                &lt;
              </Button>
            )}
            {renderPagination()}
            {currentPage < totalPages && (
              <Button onClick={() => paginate(currentPage + 1)} mr={2}>
                &gt;
              </Button>
            )}
          </Flex>
        )}
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
              <Select
                mb="3"
                placeholder="Select Student"
                value={newCertificateData.studentName}
                onChange={(e) => {
                  const selectedStudentName = e.target.value;
                  const selectedStudent = DataByBranch.find(
                    (student) => student.studentName === selectedStudentName
                  );

                  setNewCertificateData({
                    ...newCertificateData,
                    studentName: selectedStudentName,
                    student_id: selectedStudent
                      ? selectedStudent.student_id
                      : "",
                  });
                }}
                isRequired
              >
                {DataByBranch.map((student) => (
                  <option key={student.student_id} value={student.studentName}>
                    {student.studentName}
                  </option>
                ))}
              </Select>
              <Input
                mb="3"
                placeholder="Student Id"
                value={newCertificateData.student_id}
                isDisabled
                onChange={(e) =>
                  setNewCertificateData({
                    ...newCertificateData,
                    student_id: e.target.value,
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
              <Input
                mb="3"
                placeholder="Certificate Hash"
                value={newCertificateData.certificateHash}
                onChange={(e) =>
                  setNewCertificateData({
                    ...newCertificateData,
                    certificateHash: e.target.value,
                  })
                }
                isRequired
              />
              <Select
                mb="3"
                placeholder="Select Templete"
                value={newCertificateData.templeteId}
                onChange={(e) =>
                  setNewCertificateData({
                    ...newCertificateData,
                    templeteId: e.target.value,
                  })
                }
                isRequired
              >
                {TempleteData.map((templete) => (
                  <option key={templete.templeteId} value={templete.templeteId}>
                    {templete.title}
                  </option>
                ))}
              </Select>
              <Input
                mb="3"
                placeholder="Certificate Number"
                value={newCertificateData.certificateNumber}
                onChange={(e) =>
                  setNewCertificateData({
                    ...newCertificateData,
                    certificateNumber: e.target.value,
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
