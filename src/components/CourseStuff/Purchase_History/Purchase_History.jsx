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
  Grid,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStudentData,
  selectStudentData,
  selectStudentError,
  selectStudentLoading,
} from "../../../app/Slices/studentSlice";
import {
  fetchcourseData,
  selectcourseData,
  selectcourseError,
  selectcourseLoading,
} from "../../../app/Slices/courseSlice";
import {
  fetchpurchaseData,
  selectpurchaseData,
  selectpurchaseError,
  selectpurchaseLoading,
  AddpurchaseData,
  updatepurchaseData,
} from "../../../app/Slices/purchaseSlice";
import { BeatLoader } from "react-spinners";
import NetworkError from "../../NotFound/networkError";
import { getModulePermissions } from "../../../utils/permissions";
import TimeConversion from '../../../utils/timeConversion';
import { useParams } from "react-router-dom";

export default function purchaseList() {
  const { courseId } = useParams();
  const [searchValue, setSearchValue] = useState("");
  const [isAddpurchaseModalOpen, setIsAddpurchaseModalOpen] = useState(false);
  const [newpurchaseData, setNewpurchaseData] = useState({
    student_id: "",
    courseId: "",
    amount: "",
    discount: "",
    createdOn: "",
    paymentMode: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [purchasePerPage, setpurchasePerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedpurchaseData, setEditedpurchaseData] = useState({});
  const [selectedpurchaseId, setSelectedpurchaseId] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // const [filteredCount, setFilteredCount] = useState(0);


  const purchaseData = useSelector(selectpurchaseData);
  const courseData = useSelector(selectcourseData);
  const studentData = useSelector(selectStudentData);
  const courseError = useSelector(selectcourseError);
  const courseLoading = useSelector(selectcourseLoading);
  const studentError = useSelector(selectStudentError);
  const studentLoading = useSelector(selectStudentLoading);
  const isLoading = useSelector(selectpurchaseLoading);
  const error = useSelector(selectpurchaseError);
  const dispatch = useDispatch();
  const Toast = useToast({
    position: "top-right",
  });

  useEffect(() => {
    dispatch(fetchpurchaseData());
    dispatch(fetchStudentData());
    dispatch(fetchcourseData());
  }, [dispatch]);


  // useEffect(() => {
  //   const filteredHistory = purchaseData.filter((purchase) => {
  //     return selectedStatus ? purchase.status === selectedStatus : true;
  //   });
  //   setFilteredCount(filteredHistory.length);
  // }, [selectedStatus, purchaseData]);

  const DataByCourse = purchaseData.filter(course => course.courseId == courseId);
  const CourseData = courseData.filter(branch => branch.status == 'Active');
  const StudentData = studentData.filter(branch => branch.status == 'Active');


  const filteredpurchase = searchValue
    ? DataByCourse.filter((purchase) =>
      purchase.student_id.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
    : DataByCourse;

  const handleAddpurchase = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("student_id", newpurchaseData.student_id);
    formData.append("courseId", newpurchaseData.courseId);
    formData.append("amount", newpurchaseData.amount);
    formData.append("discount", newpurchaseData.discount);
    formData.append("paymentMode", newpurchaseData.paymentMode);
    formData.append("createdOn", Date.now());

    dispatch(AddpurchaseData(formData))
      .then(() => {
        Toast({
          title: "Purchase History added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewpurchaseData({
          student_id: "",
          courseId: "",
          amount: "",
          discount: "",
          createdOn: Date.now(),
        });
        setIsAddpurchaseModalOpen(false);
        dispatch(fetchpurchaseData());
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      student_id: editedpurchaseData.student_id,
      courseId: editedpurchaseData.courseId,
      amount: editedpurchaseData.amount,
      discount: editedpurchaseData.discount,
      paymentMode: editedpurchaseData.paymentMode,
    };

    dispatch(updatepurchaseData(editedpurchaseData.purchaseId, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedpurchaseId(null);
        dispatch(fetchpurchaseData());
        setIsSaveLoading(false);
        setNewpurchaseData({
          student_id: "",
          courseId: "",
          amount: "",
          discount: "",
        });
        Toast({
          title: "purchase updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating purchase",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating purchase: ", error);
      });
  };

  const handleEditpurchase = (purchase) => {
    setIsEditing(true);
    setSelectedpurchaseId(purchase.purchaseId);
    setEditedpurchaseData(purchase);
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setIsEditing(false);
  };


  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error || courseError || studentError) {
    return <NetworkError />;
  }

  if (courseLoading || studentLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const totalPages = Math.ceil(filteredpurchase.length / purchasePerPage);

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
    const startIndex = Math.max(Math.ceil(currentPage - (maxButtonsToShow - 1) / 2), 1);
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
        <Button key="ellipsisBefore" onClick={() => paginate(startIndex - 1)} mr={2}>
          ...
        </Button>
      );
    }

    if (endIndex < totalPages) {
      pageButtons.push(
        <Button key="ellipsisAfter" onClick={() => paginate(endIndex + 1)} ml={2}>
          ...
        </Button>,
        <Button key="last" onClick={() => paginate(totalPages)} ml={2}>
          &gt;&gt;
        </Button>
      );
    }

    return pageButtons;
  };

  const indexOfLastpurchase = currentPage * purchasePerPage;
  const indexOfFirstpurchase = indexOfLastpurchase - purchasePerPage;
  const currentpurchase = filteredpurchase.slice(indexOfFirstpurchase, indexOfLastpurchase);

  const filteredCount = currentpurchase.length;
  return (
    <Box p="3" m={5}>
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={{ base: 0, md: 5 }} mb={{ base: 4, md: 0 }}>
          Purchase List
          ({filteredCount})
        </Text>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={3}
          alignItems="center"
        >
          <Input
            placeholder="Search by Student ID"
            w={{ base: "100%", md: "200px" }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            mr={3}
          />
          <Button
            colorScheme="teal"
            onClick={() => {
              setIsAddpurchaseModalOpen(true);
            }}
          >
            Add Purchase
          </Button>
        </Grid>
      </Flex>
      <Box p="6" borderRadius="lg" overflowX="auto" css={{
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
        {currentpurchase.length === 0 ? (
          <Flex justify="center" align="center" height="100%">
            <Box textAlign="center">
              <Text fontSize="xl" fontWeight="bold">No purchase available</Text>
            </Box>
          </Flex>
        ) : (
          <>
            <Table variant="simple" minWidth="100%">
              <Thead>
                <Tr>
                  <Th>Student Id</Th>
                  <Th>Course Id</Th>
                  <Th>Amount</Th>
                  <Th>Discount</Th>
                  <Th>Payment Mode</Th>
                  <Th>Created On</Th>
                  <Th>Edit</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentpurchase.map((purchase, index) => (
                  <Tr key={index}>
                    <Td>{purchase.student_id}</Td>
                    <Td>{purchase.courseId}</Td>
                    <Td>{purchase.amount}</Td>
                    <Td>{purchase.discount}</Td>
                    <Td>{purchase.paymentMode}</Td>
                    <Td>{TimeConversion.unixTimeToRealTime(purchase.createdOn)}</Td>
                    <Td>
                      <Flex>
                        <Button
                          size="xs"
                          colorScheme="teal"
                          mr="2"
                          onClick={() => {
                            setIsEditModalOpen(true);
                            setEditedpurchaseData(purchase);
                          }}
                        >
                          Edit
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Flex justify="flex-end" mt="4">
              {currentpurchase.length > 0 && (
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
          </>
        )}
      </Box>

      <Modal
        isOpen={isAddpurchaseModalOpen}
        onClose={() => setIsAddpurchaseModalOpen(false)}
        size="md"
      >
        <ModalOverlay />
        <form onSubmit={handleAddpurchase}>
          <ModalContent>
            <ModalHeader>Add Purchase</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Select
                mb="3"
                placeholder="Select Student"
                value={newpurchaseData.student_id}
                onChange={(e) =>
                  setNewpurchaseData({ ...newpurchaseData, student_id: e.target.value })
                }
                isRequired
              >
                {StudentData.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.studentName}
                  </option>
                ))}
              </Select>
              <Select
                mb="3"
                placeholder="Select Course"
                value={newpurchaseData.courseId}
                onChange={(e) =>
                  setNewpurchaseData({ ...newpurchaseData, courseId: e.target.value })
                }
                isRequired
              >
                {CourseData.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseTitle}
                  </option>
                ))}
              </Select>
              <Input
                mb="3"
                placeholder="Amount"
                type="number"
                value={newpurchaseData.amount}
                onChange={(e) =>
                  setNewpurchaseData({ ...newpurchaseData, amount: e.target.value })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Discount"
                type="number"
                value={newpurchaseData.discount}
                onChange={(e) =>
                  setNewpurchaseData({ ...newpurchaseData, discount: e.target.value })
                }
                isRequired
              />
              <Select
                mb="3"
                placeholder="Payment Mode"
                value={newpurchaseData.paymentMode}
                onChange={(e) =>
                  setNewpurchaseData({ ...newpurchaseData, paymentMode: e.target.value })
                }
                isRequired
              >
                <option value="emi">EMI</option>
                <option value="oneTime">One Time</option>
                <option value="N/A">N/A</option>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="teal">
                Submit
              </Button>
              <Button variant="ghost" onClick={() => setIsAddpurchaseModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Purchase</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text mb="1" color="gray.600">
                Student
              </Text>
              <Select
                mb="3"
                placeholder="Select Student"
                value={editedpurchaseData?.student_id || ""}
                onChange={(e) =>
                  setEditedpurchaseData({
                    ...editedpurchaseData,
                    student_id: e.target.value,
                  })
                }
                isRequired
                isDisabled={!isEditing}
              >
                {StudentData.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.studentName}
                  </option>
                ))}
              </Select>
            </Box>
            <Box>
              <Text mb="1" color="gray.600">
                Course
              </Text>
              <Select
                mb="3"
                placeholder="Select Course"
                value={editedpurchaseData.courseId || ""}
                onChange={(e) =>
                  setEditedpurchaseData({ ...editedpurchaseData, courseId: e.target.value })
                }
                isRequired
                isDisabled={!isEditing}
              >
                {CourseData.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseTitle}
                  </option>
                ))}
              </Select>
            </Box>
            <Box>
              <Text mb="1" color="gray.600">
                Amount
              </Text>
              <Input
                mb="3"
                placeholder="Amount"
                type="number"
                value={editedpurchaseData.amount || ""}
                onChange={(e) =>
                  setEditedpurchaseData({ ...editedpurchaseData, amount: e.target.value })
                }
                isRequired
                isDisabled={!isEditing}
              />
            </Box>
            <Box>
              <Text mb="1" color="gray.600">
                Discount
              </Text>
              <Input
                mb="3"
                placeholder="Discount"
                type="number"
                value={editedpurchaseData.discount || ""}
                onChange={(e) =>
                  setEditedpurchaseData({ ...editedpurchaseData, discount: e.target.value })
                }
                isRequired
                isDisabled={!isEditing}
              />
            </Box>
            <Box>
              <Text mb="1" color="gray.600">
                Payment Mode
              </Text>
              <Select
                mb="3"
                placeholder="Select Payment Mode"
                value={editedpurchaseData.paymentMode || ""}
                onChange={(e) =>
                  setEditedpurchaseData({ ...editedpurchaseData, paymentMode: e.target.value })
                }
                isRequired
                isDisabled={!isEditing}
              >
                <option value="emi">EMI</option>
                <option value="oneTime">One Time</option>
                <option value="N/A">N/A</option>
              </Select>
            </Box>
            <Box>
              <Text mb="1" color="gray.600">
                Created On
              </Text>
              <Input
                mb="3"
                placeholder="Created On"
                type="text"
                value={TimeConversion.unixTimeToRealTime(editedpurchaseData.createdOn)}
                isDisabled
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={handleSaveChanges}
              isLoading={isSaveLoading}
              spinner={<BeatLoader size={8} color="white" />}
              isDisabled={!isEditing}
            >
              Save Changes
            </Button>
            {isEditing ? (
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => handleEditpurchase(editedpurchaseData)}
              >
                Edit
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>


    </Box>
  );
}

