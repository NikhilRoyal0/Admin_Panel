import React, { useState, useEffect } from "react";
import {
    Box,
    Text,
    Input,
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
    Table,
    Tr,
    Td,
    Th,
    Tbody,
    Thead,
    Select,
    Grid,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import { selectmoduleData, selectmoduleError, selectmoduleLoading, fetchmoduleData, AddmoduleData, updatemoduleData, deletemoduleData } from "../../../app/Slices/moduleSlice"
import NetworkError from "../../NotFound/networkError";
import { getModulePermissions } from "../../../utils/permissions";
import { useNavigate } from "react-router-dom";


export default function Module() {
    const [isAddmoduleModalOpen, setIsAddmoduleModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
    const [selectedmoduleId, setSelectedmoduleId] = useState(null);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [editedmoduleData, setEditedmoduleData] = useState({});
    const [isEditing, setIsEditing] = useState(false);


    const [newmoduleData, setNewmoduleData] = useState({
        title: "",
        year: "",
        price: "",
        createdOn: "",
        class: "",
        status: "",
        publishedBy: "",
    });

    const moduleData = useSelector(selectmoduleData);
    const isLoading = useSelector(selectmoduleLoading);
    const error = useSelector(selectmoduleError);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const Toast = useToast({
        position: "top-right",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [modulePerPage, setmodulePerPage] = useState(10);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [filteredCount, setFilteredCount] = useState(0);


    useEffect(() => {
        dispatch(fetchmoduleData());
    }, [dispatch]);

    useEffect(() => {
        const filteredmodule = moduleData.filter((student) => {
            return selectedStatus ? student.status === selectedStatus : true;
        });
        setFilteredCount(filteredmodule.length);
    }, [selectedStatus, moduleData]);

    const handleAddmodule = (e) => {
        e.preventDefault();
        setIsSaveLoading(true);

        const formData = new FormData();
        formData.append("title", newmoduleData.title);
        formData.append("year", newmoduleData.year);
        formData.append("price", newmoduleData.price);
        formData.append("createdOn", Date.now());
        formData.append("class", newmoduleData.class);
        formData.append("status", newmoduleData.status);
        formData.append("publishedBy", newmoduleData.publishedBy);
        dispatch(AddmoduleData(formData))
            .then(() => {
                setIsSaveLoading(false);
                Toast({
                    title: "Module added successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                setNewmoduleData({
                    moduleTitle: "",
                    shortInfo: "",
                    longInfo: "",
                    backgroundImage: "",
                    icon: "",
                    status: "",
                    parentmoduleId: "",
                });
                setIsAddmoduleModalOpen(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                Toast({
                    title: "Failed to add module",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
            });
    };

    const handleDeleteConfirmation = () => {
        setIsSaveLoading(true);

        dispatch(deletemoduleData(selectedmoduleId))
            .then(() => {
                dispatch(fetchmoduleData());
                setIsDeleteConfirmationModalOpen(false);
                setSelectedmoduleId(null);
                setIsSaveLoading(false);
                Toast({
                    title: "Module deleted successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
            })
            .catch((error) => {
                setIsSaveLoading(false);
                Toast({
                    title: "Failed to delete module",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                console.log("Error deleting module: ", error);
            });
    };


    const handleSaveChanges = () => {
        if (isEditing) {
            setIsSaveLoading(true);
        }
        const formData = {
            title: editedmoduleData.title,
            year: editedmoduleData.year,
            price: editedmoduleData.price,
            status: editedmoduleData.status,
            class: editedmoduleData.class,
            publishedBy: editedmoduleData.publishedBy,
        };

        dispatch(updatemoduleData(editedmoduleData.moduleId, formData))
            .then(() => {
                setIsEditModalOpen(false);
                setSelectedmoduleId(null);
                dispatch(fetchmoduleData());
                setIsSaveLoading(false);
                setNewmoduleData({
                    title: "",
                    year: "",
                    price: "",
                    status: "",
                    class: "",
                    publishedBy: "",
                });
                Toast({
                    title: "module updated successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
            })
            .catch((error) => {
                setIsSaveLoading(false);
                Toast({
                    title: "Failed to updating module",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                console.log("Error updating module: ", error);
            });
    };


    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleCancel = () => {
        setIsEditModalOpen(false);
        setIsEditing(false);
    }

    const handleEditmodule = (module) => {
        setIsEditing(true);
        setSelectedmoduleId(module.moduleId);
        setEditedmoduleData(module);
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


    const filteredmodule = moduleData.filter((module) => {

        const statusMatch = selectedStatus ? module.status == selectedStatus : true;
        return statusMatch;
    });

    const totalPages = Math.ceil(filteredmodule.length / modulePerPage);

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

    const indexOfLastmodule = currentPage * modulePerPage;
    const indexOfFirstmodule = indexOfLastmodule - modulePerPage;
    const currentmodule = filteredmodule.slice(indexOfFirstmodule, indexOfLastmodule);

    const moduleManagementPermissions = getModulePermissions("Modules");

    if (!moduleManagementPermissions) {
        return <NetworkError />;
    }

    const canAddData = moduleManagementPermissions.create;
    const canDeleteData = moduleManagementPermissions.delete;
    const canEditData = moduleManagementPermissions.update;


    return (
        <Box p="3">
            <Flex align="center" justify="space-between" mb="6" mt={5}>
                <Text fontSize="2xl" fontWeight="bold" ml={5}>
                    Module List
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
                    <Select
                        placeholder="Filter by Status"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                    >
                        <option value="inactive">Inactive</option>
                        <option value="active">Active</option>
                    </Select>
                    <Button
                        colorScheme="blue"
                        onClick={() => {
                            if (canAddData) {
                                setIsAddmoduleModalOpen(true)
                            } else {
                                Toast({
                                    title: "You don't have permission to add module",
                                    status: "error",
                                    duration: 3000,
                                    isClosable: true,
                                    position: "top-right",
                                });
                            }
                        }}
                    >
                        Add module
                    </Button>
                </Grid>
            </Flex>

            <Box
                bg="gray.100"
                p="6"
                borderRadius="lg"
                overflowX="auto"
                width="100%"
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
                <Table colorScheme="teal" mb={4}>
                    <Thead>
                        <Tr>
                            <Th>Title</Th>
                            <Th>Year</Th>
                            <Th>Price</Th>
                            <Th>Status</Th>
                            <Th>Class</Th>
                            <Th>Published By</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {currentmodule.length === 0 ? (
                            <Tr>
                                <Td colSpan={7} textAlign="center">
                                    <Text fontSize="xl" fontWeight="bold">No module available</Text>
                                </Td>
                            </Tr>
                        ) : (
                            currentmodule.map((module, index) => (
                                <Tr key={index}>
                                    <Td>{module.title}</Td>
                                    <Td>{module.year}</Td>
                                    <Td>{module.price}</Td>
                                    <Td>{module.status}</Td>
                                    <Td>{module.class}</Td>
                                    <Td>{module.publishedBy}</Td>
                                    <Td>
                                        <Button
                                            size="sm"
                                            mr={2}
                                            colorScheme="teal"
                                            onClick={() => {
                                                if (canEditData) {
                                                    setIsEditModalOpen(true);
                                                    setEditedmoduleData(module);
                                                } else {
                                                    Toast({
                                                        title: "You don't have permission to edit module",
                                                        status: "error",
                                                        duration: 3000,
                                                        isClosable: true,
                                                        position: "top-right",
                                                    });
                                                }
                                            }}
                                        >
                                            More Info
                                        </Button>
                                        <Button
                                            size="sm"
                                            colorScheme="red"
                                            onClick={() => {
                                                if (canDeleteData) {
                                                    setSelectedmoduleId(module.moduleId);
                                                    setIsDeleteConfirmationModalOpen(true);
                                                } else {
                                                    Toast({
                                                        title: "You don't have permission to delete module",
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
                                    </Td>
                                </Tr>
                            ))
                        )}
                    </Tbody>
                </Table>

            </Box>

            <Flex justify="flex-end" mt="4">
                {currentmodule.length > 0 && (
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

            {/* Add/Edit module Modal */}
            <Modal
                isOpen={isAddmoduleModalOpen}
                onClose={() => setIsAddmoduleModalOpen(false)}
                size="3xl"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add module</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleAddmodule}>
                        <ModalBody>
                            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
                                <Input
                                    mb="3"
                                    placeholder="Title"
                                    value={newmoduleData.title}
                                    onChange={(e) =>
                                        setNewmoduleData({
                                            ...newmoduleData,
                                            title: e.target.value,
                                        })
                                    }
                                    isRequired
                                />
                                <Input
                                    mb="3"
                                    placeholder="Year"
                                    value={newmoduleData.year}
                                    onChange={(e) =>
                                        setNewmoduleData({
                                            ...newmoduleData,
                                            year: e.target.value,
                                        })
                                    }
                                    isRequired
                                />
                                <Input
                                    mb="3"
                                    placeholder="Price"
                                    value={newmoduleData.price}
                                    onChange={(e) =>
                                        setNewmoduleData({
                                            ...newmoduleData,
                                            price: e.target.value,
                                        })
                                    }
                                    isRequired
                                />
                                <Input
                                    mb="3"
                                    placeholder="Class"
                                    value={newmoduleData.class}
                                    onChange={(e) =>
                                        setNewmoduleData({
                                            ...newmoduleData,
                                            class: e.target.value,
                                        })
                                    }
                                    isRequired
                                />
                                <Select
                                    mb="3"
                                    placeholder="Select status"
                                    value={newmoduleData.status}
                                    onChange={(e) =>
                                        setNewmoduleData({
                                            ...newmoduleData,
                                            status: e.target.value,
                                        })
                                    }
                                    isRequired
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Select>
                                <Input
                                    mb="3"
                                    placeholder="Published By"
                                    value={newmoduleData.publishedBy}
                                    onChange={(e) =>
                                        setNewmoduleData({
                                            ...newmoduleData,
                                            publishedBy: e.target.value,
                                        })
                                    }
                                    isRequired
                                />

                            </Grid>
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
                                onClick={() => setIsAddmoduleModalOpen(false)}
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
                    <ModalBody>Are you sure you want to delete this module?</ModalBody>
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

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="3xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>module details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
                            <Box>
                                <Text mb="1" color="gray.600">
                                    Title
                                </Text>
                                <Input
                                    mb="3"
                                    placeholder="Title"
                                    value={editedmoduleData?.title || ""}
                                    onChange={(e) =>
                                        setEditedmoduleData({
                                            ...editedmoduleData,
                                            title: e.target.value,
                                        })
                                    }
                                    required
                                    isDisabled={!isEditing}
                                />
                            </Box>
                            <Box>
                                <Text mb="1" color="gray.600">
                                    Year
                                </Text>
                                <Input
                                    mb="3"
                                    placeholder="Year"
                                    value={editedmoduleData?.year || ""}
                                    onChange={(e) =>
                                        setEditedmoduleData({
                                            ...editedmoduleData,
                                            year: e.target.value,
                                        })
                                    }
                                    required
                                    isDisabled={!isEditing}
                                />
                            </Box>
                            <Box>
                                <Text mb="1" color="gray.600">
                                    Price
                                </Text>
                                <Input
                                    mb="3"
                                    placeholder="Price"
                                    value={editedmoduleData?.price || ""}
                                    onChange={(e) =>
                                        setEditedmoduleData({
                                            ...editedmoduleData,
                                            price: e.target.value,
                                        })
                                    }
                                    required
                                    isDisabled={!isEditing}
                                />
                            </Box>
                            <Box>
                                <Text mb="1" color="gray.600">
                                    Class
                                </Text>
                                <Input
                                    mb="3"
                                    placeholder="Class"
                                    value={editedmoduleData?.class || ""}
                                    onChange={(e) =>
                                        setEditedmoduleData({
                                            ...editedmoduleData,
                                            class: e.target.value,
                                        })
                                    }
                                    required
                                    isDisabled={!isEditing}
                                />
                            </Box>
                            <Box>
                                <Text mb="1" color="gray.600">
                                    Status
                                </Text>
                                <Select
                                    mb="3"
                                    placeholder="Select status"
                                    value={editedmoduleData?.status || ""}
                                    onChange={(e) =>
                                        setEditedmoduleData({
                                            ...editedmoduleData,
                                            status: e.target.value,
                                        })
                                    }
                                    required
                                    isDisabled={!isEditing}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Select>
                            </Box>
                            <Box>
                                <Text mb="1" color="gray.600">
                                    Published By
                                </Text>
                                <Input
                                    mb="3"
                                    placeholder="Published By"
                                    value={editedmoduleData?.publishedBy || ""}
                                    onChange={(e) =>
                                        setEditedmoduleData({
                                            ...editedmoduleData,
                                            publishedBy: e.target.value,
                                        })
                                    }
                                    isDisabled={!isEditing}
                                    required
                                />
                            </Box>
                        </Grid>
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
                                onClick={() => handleEditmodule(editedmoduleData)}
                            >
                                Edit
                            </Button>
                        )}
                    </ModalFooter>;
                </ModalContent>
            </Modal>
        </Box>
    );
}
