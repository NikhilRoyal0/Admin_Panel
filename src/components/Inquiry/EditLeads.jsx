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
    Grid,
    GridItem,
    Divider
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import { fetchleadData, selectleadData, updateleadData, selectleadError, selectleadLoading } from "../../app/Slices/leadSlice";
import { getModulePermissions } from "../../utils/permissions";
import { AddStudentData } from "../../app/Slices/studentSlice";
import timeConversion from "../../utils/timeConversion";
import { selectrolesData, selectrolesError, selectrolesLoading, fetchrolesData } from "../../app/Slices/roleSlice";
import { selectcourseData, selectcourseError, selectcourseLoading, fetchcourseData } from "../../app/Slices/courseSlice";
import QualificationsModal from "./QualificationsModal";

export default function Edit_Leads() {
    const { lead_id } = useParams();
    const error = useSelector(selectleadError);
    const isLoading = useSelector(selectleadLoading);
    const roleData = useSelector(selectrolesData);
    const roleError = useSelector(selectrolesError);
    const roleLoading = useSelector(selectrolesLoading);
    const courseData = useSelector(selectcourseData);
    const courseError = useSelector(selectcourseError);
    const courseLoading = useSelector(selectcourseLoading);
    const [lead, setLead] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [hasCertificate, setHasCertificate] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        studentName: "",
        email: "",
        password: "",
        phoneNumber: "",
        referCode: "",
        parentCode: "",
        role: "",
        walletAmount: "0",
        admissionNo: "",
        profilePhoto: "",
        branchFeeStructureId: "",
        currentCourseId: "",
        handledBy: "",
        deviceId: "",
        lastActiveAt: "",
        interestIn: "",
        reason: "",
        updatedOn: Date.now(),
        createdOn: "",
        branchId: "",
        primaryAddress: "",
        state: "",
        status: "",
        city: "",
        courses: "",
        qualifications: "[]",
        paymentMethods: "",
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
        dispatch(fetchrolesData());
        dispatch(fetchcourseData());
    }, [dispatch, leadData.length]);

    useEffect(() => {
        const leadDetails = leadData.find((lead) => lead.lead_id === lead_id);
        if (leadDetails) {
            setLead(leadDetails);
            setFormData(leadDetails);
        }
    }, [leadData, lead_id]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleQualificationChange = (index, event) => {
        const { name, value } = event.target;
        const newQualifications = JSON.parse(formData.qualifications);
        newQualifications[index] = {
            ...newQualifications[index],
            [name]: value,
        };
        setFormData({ ...formData, qualifications: JSON.stringify(newQualifications) });
    };

    const addQualification = () => {
        const newQualifications = JSON.parse(formData.qualifications);
        if (newQualifications.length < 5) {
            newQualifications.push({
                qualification: '',
                highestQualification: '',
            });
            setFormData({ ...formData, qualifications: JSON.stringify(newQualifications) });
        }
    };

    const removeQualification = (index) => {
        const newQualifications = JSON.parse(formData.qualifications);
        newQualifications.splice(index, 1);
        setFormData({ ...formData, qualifications: JSON.stringify(newQualifications) });
    };



    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            updatedOn: Date.now(),
        }));
    };


    const handleSave = () => {
        dispatch(updateleadData(lead_id, formData))
            .then((response) => {
                toast({
                    title: "Lead updated successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                if (formData.status === "converted") {
                    const { lead_id, ...formData2 } = formData;

                    dispatch(AddStudentData(formData2))
                        .then(() => {
                            toast({
                                title: "Student data updated successfully",
                                status: "success",
                                duration: 3000,
                                isClosable: true,
                            });
                        })
                        .catch((error) => {
                            toast({
                                title: "Failed to update student data",
                                status: "error",
                                duration: 3000,
                                isClosable: true,
                            });
                            console.log("Error updating student data: ", error);
                        });
                }

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
        dispatch(fetchleadData());
    };

    const LeadManagementPermissions = getModulePermissions("Inquiry");

    if (!LeadManagementPermissions) {
        return <NetworkError />;
    }

    const canEditData = LeadManagementPermissions.update;

    if (!lead) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (isLoading || roleLoading || courseLoading) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (error || roleError || courseError) {
        return <NetworkError />;
    }



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
                        <Text mb={2} fontWeight="bold">Password</Text>
                        <Input
                            name="password"
                            value={formData.password}
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
                        <Text mb={2} fontWeight="bold">
                            Qualifications
                        </Text>
                        <Input
                            name="qualifications"
                            value={formData.qualifications}  // Ensure this is correct for your UI needs
                            onClick={openModal}
                            isDisabled={!isEditing}
                            bg={isEditing ? "white" : "gray.100"}
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
                        <Text mb={2} fontWeight="bold">
                            Role
                        </Text>
                        <Select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        >
                            {roleData.map((role) => (
                                <option key={role.roleId} value={role.roleId}>
                                    {role.roleName}
                                </option>
                            ))}
                        </Select>
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Wallet Amount</Text>
                        <Input
                            name="walletAmount"
                            value={formData.walletAmount}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Admission No</Text>
                        <Input
                            name="admissionNo"
                            value={formData.admissionNo}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Profile Photo</Text>
                        <Input
                            name="profilePhoto"
                            value={formData.profilePhoto}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Branch Fee Structure Id</Text>
                        <Input
                            name="branchFeeStructureId"
                            value={formData.branchFeeStructureId}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Current Course Id</Text>
                        <Input
                            name="currentCourseId"
                            value={formData.currentCourseId}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Handled By</Text>
                        <Input
                            name="handledBy"
                            value={formData.handledBy}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Device Id</Text>
                        <Input
                            name="deviceId"
                            value={formData.deviceId}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Interest In</Text>
                        <Input
                            name="interestIn"
                            value={formData.interestIn}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Last Active</Text>
                        <Input
                            name="lastActiveAt"
                            value={formData.lastActiveAt}
                            onChange={handleInputChange}
                            isDisabled
                            bg='gray.100'
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Reason</Text>
                        <Input
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            isDisabled={!isEditing}
                            bg={isEditing ? 'white' : 'gray.100'}
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Created On</Text>
                        <Input
                            name="createdOn"
                            value={timeConversion.unixTimeToRealTime(formData.createdOn)}
                            isDisabled
                            bg='gray.100'
                        />
                    </GridItem>
                    <GridItem>
                        <Text mb={2} fontWeight="bold">Updated On</Text>
                        <Input
                            name="updatedOn"
                            value={timeConversion.unixTimeToRealTime(formData.updatedOn)}
                            onChange={handleInputChange}
                            isDisabled
                            bg='gray.100'
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

                <QualificationsModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    qualifications={formData.qualifications}
                    handleQualificationChange={handleQualificationChange}
                    addQualification={addQualification}
                    removeQualification={removeQualification}
                />
            </Box>
        </Box>
    )
}

