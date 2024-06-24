import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid, Flex, Card, CardBody, CardFooter, Heading, Button, Spinner, Select, Image, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { selecttempleteData, selecttempleteError, selecttempleteLoading, fetchtempleteData, AddtempleteData, deletetempleteData } from '../../../../app/Slices/templete';
import NetworkError from '../../../NotFound/networkError';
import { getModulePermissions } from "../../../../utils/permissions";
import fallbackImage from "../../../../assets/images/imageError.png";
import { BeatLoader } from "react-spinners";

export default function Templetes() {
  const dispatch = useDispatch();
  const templeteData = useSelector(selecttempleteData);
  const error = useSelector(selecttempleteError);
  const isLoading = useSelector(selecttempleteLoading);
  const [newTempleteData, setNewTempleteData] = useState({
    title: "",
    info: "",
    headingText: "",
    backgroundImage: "",
    status: "",
    createdBy: "",
    createdOn: Date.now(),
  });

  const [isAddTempleteModalOpen, setIsAddTempleteModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [selectedTempleteId, setSelectedTempleteId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [templetePerPage] = useState(9);
  const Toast = useToast({
    position: "top-right",
  });

  const handleAddTemplete = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      console.error('User ID not found');
      setIsSaveLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", newTempleteData.title);
    formData.append("info", newTempleteData.info);
    formData.append("headingText", newTempleteData.headingText);
    formData.append("backgroundImage", newTempleteData.backgroundImage);
    formData.append("status", selectedStatus);
    formData.append("createdBy", userId);
    formData.append("createdOn", Date.now());

    dispatch(AddtempleteData(formData))
      .then(() => {
        dispatch(fetchtempleteData());
        setIsSaveLoading(false);
        Toast({
          title: "Templete added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewTempleteData({
          title: "",
          info: "",
          headingText: "",
          backgroundImage: "",
          status: "",
          createdBy: "",
          createdOn: "",
        });
        setSelectedStatus("");
        setIsAddTempleteModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsSaveLoading(false);
        Toast({
          title: "Failed to add Templete",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  useEffect(() => {
    dispatch(fetchtempleteData());
  }, [dispatch]);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setNewTempleteData({
      ...newTempleteData,
      status: e.target.value,
    });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deletetempleteData(selectedTempleteId))
      .then(() => {
        dispatch(fetchtempleteData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedTempleteId(null);
        setIsSaveLoading(false);
        Toast({
          title: "Templete deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete templete",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting templete: ", error);
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

  const totalPages = Math.ceil(templeteData.length / templetePerPage);
  const indexOfLastTemplete = currentPage * templetePerPage;
  const indexOfFirstTemplete = indexOfLastTemplete - templetePerPage;
  const currentTempleteData = templeteData.slice(indexOfFirstTemplete, indexOfLastTemplete);

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

  const certificateManagementPermissions = getModulePermissions('Certificate Template');
  if (!certificateManagementPermissions) {
    return <NetworkError />;
  }
  const canAddData = certificateManagementPermissions.create;
  const canDeleteData = certificateManagementPermissions.delete;

  return (
    <Box p={4} mt={5}>
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(5, 1fr)" }}
        gap={6}
        mb={4}
      >
        {canAddData && (
          <Card onClick={() => setIsAddTempleteModalOpen(true)} cursor="pointer">
            <CardBody>
              <Flex direction="column" justify="center" align="center" height="400px">
                <AddIcon boxSize={12} mb={5} />
                <Text>Add new Template</Text>
              </Flex>
            </CardBody>
          </Card>
        )}
        {currentTempleteData.map((templete) => (
          <Card key={templete.templeteId}>
            <CardBody>
              <Box>
                <Image
                  src={templete.backgroundImage}
                  alt={templete.title}
                  borderRadius="lg"
                  mb="4"
                  height="200px"
                  width="100%"
                  objectFit="cover"
                  onError={(e) => (e.target.src = fallbackImage)}
                />
                <Heading size="md">{templete.title}</Heading>
                <Text mt={2}>{templete.info}</Text>
                <Text mt={2} fontSize="sm" color="gray.500">Created by: {templete.createdBy}</Text>
                <Text mt={2} fontSize="sm" color="gray.500">Created on: {new Date(templete.createdOn).toLocaleDateString()}</Text>
                <Text mt={2} fontSize="sm" color="gray.500">Status: {templete.status}</Text>
              </Box>
            </CardBody>
            <CardFooter>
              <Button size="sm" mr={2} colorScheme="teal">Use Templete</Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => {
                  if (canDeleteData) {
                    setSelectedTempleteId(templete.templeteId);
                    setIsDeleteConfirmationModalOpen(true);
                  } else {
                    Toast({
                      title: "You don't have permission to delete templete",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                      position: "top-right",
                    });
                  }
                }}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </Grid>
      <Flex justify="flex-end" mt="4">
        {currentTempleteData.length > 0 && (
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

      <Modal
        isOpen={isAddTempleteModalOpen}
        onClose={() => setIsAddTempleteModalOpen(false)}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Templete</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleAddTemplete}>
            <ModalBody>
              <Input
                mb="3"
                placeholder="Templete Title"
                value={newTempleteData.title}
                onChange={(e) =>
                  setNewTempleteData({
                    ...newTempleteData,
                    title: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Templete Info"
                value={newTempleteData.info}
                onChange={(e) =>
                  setNewTempleteData({
                    ...newTempleteData,
                    info: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Heading Text"
                value={newTempleteData.headingText}
                onChange={(e) =>
                  setNewTempleteData({
                    ...newTempleteData,
                    headingText: e.target.value,
                  })
                }
                isRequired
              />
              <Select
                mb="3"
                placeholder="Select Status"
                value={selectedStatus}
                onChange={handleStatusChange}
                isRequired
              >
                <option value="Inactive">Inactive</option>
                <option value="Active">Active</option>
              </Select>
              <Input
                mb="3"
                placeholder="Background Image"
                value={newTempleteData.backgroundImage}
                onChange={(e) =>
                  setNewTempleteData({
                    ...newTempleteData,
                    backgroundImage: e.target.value,
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
                ml={2}
                variant="ghost"
                onClick={() => setIsAddTempleteModalOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this Templete?</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={handleDeleteConfirmation}
              isLoading={isSaveLoading}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteConfirmationModalOpen(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
