import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Text,
    Input,
    Flex,
    Spinner,
    Button,
    useToast,
    Select,
    Textarea,
    Checkbox,
    Grid,
    GridItem,
    Divider,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import { fetchleadData, selectleadData, updateleadData, selectleadError, selectleadLoading } from "../../app/Slices/leadSlice";
import { getModulePermissions } from "../../utils/permissions";

export default function Edit_Leads() {
    const { lead_id } = useParams();
    const error = useSelector(selectleadError);
    const isLoading = useSelector(selectleadLoading);
    const [lead, setLead] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [hasCertificate, setHasCertificate] = useState(false); // State to track checkbox status

    const Toast = useToast({
        position: "top-right",
    });
    const [formData, setFormData] = useState({
        studentName: "",
        email: "",
        qualification: "",
        phoneNumber: "",
        createdOn: "",
        branchId: "",
        primaryAddress: "",
        state: "",
        city: "",
        status: "",
        highestQualification: "",
        collegeName: "",
        boardUniversityName: "",
        hasCertificate: false,
        certificateNo: "",
        issuedBy: "",
        issueDate: "",
        otherQualifications: "",
        courses: "",
        paymentMethods: "",
        referCode: "",
        parentCode: "",
    });
    const leadData = useSelector(selectleadData);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast({
        position: "top-right",
    });

    useEffect(() => {
        if (!leadData.length) {
            dispatch(fetchleadData());
        }
    }, [dispatch, leadData.length]);

    useEffect(() => {
        const leadDetails = leadData.find((lead) => lead.lead_id === lead_id);
        if (leadDetails) {
            setLead(leadDetails);
            setFormData(leadDetails);
            setHasCertificate(leadDetails.hasCertificate);
        }
    }, [leadData, lead_id]);

    if (!lead) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
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


    const handleSave = () => {
        dispatch(updateleadData(lead_id, formData))
            .then(() => {
                toast({
                    title: "Lead updated successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                setIsEditing(false);
            })
            .catch((error) => {
                toast({
                    title: "Failed to update lead",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                console.log("Error updating lead: ", error);
            });
    };

    const handleEditToggle = () => {
        setIsEditing((prevEditing) => !prevEditing);
    };

    const handleCancel = () => {
        setIsEditing(false);
    }


    const LeadManagementPermissions = getModulePermissions("Inquiry");

    if (!LeadManagementPermissions) {
        return <NetworkError />;
    }

    const canEditData = LeadManagementPermissions.update;

    return (
        <Box p={2} m={5}>
            <Box m="auto" bg="white" boxShadow="md" p="4" borderRadius="md" overflow="auto" css={{
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
                <Flex justify="space-between" align="center">
                    <Text fontSize="2xl" fontWeight="bold">Leads Details</Text>
                    <Flex>
                        {isEditing ? (
                            <>
                                <Button
                                    onClick={handleSave}
                                    colorScheme="teal" mr={2}
                                    isLoading={isSaveLoading}
                                    spinner={<BeatLoader size={8} color="white" />}
                                >
                                    Save
                                </Button>
                                <Button onClick={handleCancel} colorScheme="gray" isDisabled={!isEditing}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => {
                                if (canEditData) {
                                    handleEditToggle();
                                } else {
                                    Toast({
                                        title: "You don't have permission to edit this lead",
                                        status: "error",
                                        duration: 3000,
                                        isClosable: true,
                                        position: "top-right",
                                    });
                                }
                            }} colorScheme="teal">
                                Edit
                            </Button>
                        )}
                    </Flex>
                </Flex>
                <Divider my="4" />
                <Grid
                    templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(3, 1fr)" }}
                    gap={4}
                >
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Student Name</Text>
                        <Input
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Email</Text>
                        <Input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Qualification</Text>
                        <Input
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Phone Number</Text>
                        <Input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Refer Code</Text>
                        <Input
                            name="referCode"
                            type="text"
                            value={formData.referCode}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Parent Code</Text>
                        <Input
                            name="parentCode"
                            type="text"
                            value={formData.parentCode}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Created On</Text>
                        <Input
                            name="createdOn"
                            type="date"
                            value={formData.createdOn}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Branch ID</Text>
                        <Input
                            name="branchId"
                            value={formData.branchId}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem colSpan={1}>
                        <Text mb={2} fontWeight="bold">Primary Address</Text>
                        <Textarea
                            name="primaryAddress"
                            value={formData.primaryAddress}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">State</Text>
                        <Input
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">City</Text>
                        <Input
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Status</Text>
                        <Select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        >
                            <option value="accepted">Accepted</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                            <option value="converted">Converted</option>
                        </Select>
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Highest Qualification</Text>
                        <Input
                            name="highestQualification"
                            value={formData.highestQualification}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">College Name</Text>
                        <Input
                            name="collegeName"
                            value={formData.collegeName}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Board/University Name</Text>
                        <Input
                            name="boardUniversityName"
                            value={formData.boardUniversityName}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Has Certificate</Text>
                        <Checkbox
                            name="hasCertificate"
                            isChecked={formData.hasCertificate}
                            onChange={(e) => {
                                handleInputChange(e);
                                setHasCertificate(e.target.checked); // Update the state of hasCertificate
                            }}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    {hasCertificate && (
                        <>
                            <GridItem>
                                <Text mb={2} fontWeight="bold">Certificate Number</Text>
                                <Input
                                    name="certificateNo"
                                    value={formData.certificateNo}
                                    onChange={handleInputChange}
                                    isDisabled={!isEditing}
                                    bg={isEditing ? 'white' : 'gray.100'}
                                />
                            </GridItem>
                            <GridItem>
                                <Text mb={2} fontWeight="bold">Issued By</Text>
                                <Input
                                    name="issuedBy"
                                    value={formData.issuedBy}
                                    onChange={handleInputChange}
                                    isDisabled={!isEditing}
                                    bg={isEditing ? 'white' : 'gray.100'}
                                />
                            </GridItem>
                            <GridItem>
                                <Text mb={2} fontWeight="bold">Issue Date</Text>
                                <Input
                                    name="issueDate"
                                    type="date"
                                    value={formData.issueDate}
                                    onChange={handleInputChange}
                                    isDisabled={!isEditing}
                                    bg={isEditing ? 'white' : 'gray.100'}
                                />
                            </GridItem>
                        </>
                    )}
                    <GridItem colSpan={1}>
                        <Text mb={2} fontWeight="bold">Other Qualifications</Text>
                        <Textarea
                            name="otherQualifications"
                            value={formData.otherQualifications}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem colSpan={1}>
                        <Text mb={2} fontWeight="bold">Courses</Text>
                        <Textarea
                            name="courses"
                            value={formData.courses}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Payment Method</Text>
                        <Input
                            name="paymentMethods"
                            type="text"
                            value={formData.paymentMethods}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>

                </Grid>
            </Box>
        </Box>
    )
}

