import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Box, Input, Button, Grid, Select, FormControl, FormLabel, SimpleGrid, Flex, Text, Divider, Textarea, Spinner, useToast, Image } from '@chakra-ui/react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updatecourseData, selectcourseData, fetchcourseData, selectcourseError, selectcourseLoading } from "../../../app/Slices/courseSlice";
import { fetchcategoryData, selectcategoryData, selectcategoryError } from '../../../app/Slices/categorySlice';
import { getModulePermissions } from "../../../utils/permissions";
import { BeatLoader } from "react-spinners";
import TimeConversion from '../../../utils/timeConversion';
import fallbackImage from "../../../assets/images/imageError.png";
import fallbackVideo from "../../../assets/images/errorVideo.jpg";

export default function EditableCourseDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isEditable, setIsEditable] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const courseData = useSelector(selectcourseData);
    const error = useSelector(selectcourseError);
    const isLoading = useSelector(selectcourseLoading);
    const categoryData = useSelector(selectcategoryData);
    const categoryError = useSelector(selectcategoryError);
    const categoryLoading = useSelector(selectcategoryError);
    const Toast = useToast({
        position: "top-right",
    });

    const { courseId } = useParams();

    useEffect(() => {
        dispatch(fetchcourseData());
        dispatch(fetchcategoryData());
    }, [dispatch]);

    useEffect(() => {
        const selectedCourse = courseData.find(course => course.courseId === courseId);
        if (selectedCourse) {
            setFormData(selectedCourse);
        }
    }, [courseData, courseId]);

    const CategoryData = categoryData.filter(branch => branch.status == 'Active');


    const handleInputChange = (e, field) => {
        setFormData({
            ...formData,
            [field]: e.target.value
        });
    };

    const handleEditToggle = () => {
        setIsEditable(!isEditable);
    };

    const handleSave = () => {
        const updatedFormData = {
            ...formData,
            updatedOn: Date.now()
        };

        setIsSaveLoading(true);

        dispatch(updatecourseData(updatedFormData, courseId))
            .then(() => {
                dispatch(fetchcourseData());
                setIsEditable(false);
                setIsSaveLoading(false);
                Toast({
                    title: "Course updated successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
            })
            .catch((error) => {
                setIsSaveLoading(false);
                Toast({
                    title: "Failed to update course",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                console.log("Error updating course: ", error);
            });
    };

    const handleCancel = () => {
        const selectedCourse = courseData.find(course => course.courseId === courseId);
        if (selectedCourse) {
            setFormData(selectedCourse);
        }
        setIsEditable(false);
    };

    const handleClick = () => {
        navigate(`/course/info/purchaseHistory/${courseId}`)
    }

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setSelectedCategory(selectedCategoryId);
        setFormData({
            ...formData,
            categoryId: selectedCategoryId
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

    if (categoryLoading) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (categoryError) {
        return <NetworkError />;
    }

    const courseManagementPermissions = getModulePermissions("Courses");

    if (!courseManagementPermissions) {
        return <NetworkError />;
    }

    const canEditData = courseManagementPermissions.update;

    return (
        <Box mt="5" mb="5" ml="5" mr="5">
            <Box m="auto" bg="white" boxShadow="md" p="4" borderRadius="md" w={{ base: '100%', md: '82%' }} overflow="auto" css={{
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
                    <Text fontSize="2xl" fontWeight="bold">Course Details</Text>
                    <Flex>
                        {isEditable ? (
                            <>
                                <Button
                                    onClick={handleSave}
                                    colorScheme="teal" mr={2}
                                    isLoading={isSaveLoading}
                                    spinner={<BeatLoader size={8} color="white" />}
                                >
                                    Save
                                </Button>
                                <Button onClick={handleCancel} colorScheme="gray" isDisabled={!isEditable}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => {
                                if (canEditData) {
                                    handleEditToggle();
                                } else {
                                    Toast({
                                        title: "You don't have permission to edit this course",
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
                <Text fontSize="sm" cursor="pointer" color="blue" ml={6} fontWeight="bold" onClick={handleClick}>Purchase History</Text>
                <Divider my="4" />
                <Grid templateColumns={{ base: "1fr", md: "3fr 1fr" }} gap={4}>
                    <SimpleGrid
                        columns={{
                            base: 1,
                            sm: 2,
                            md: 2,
                            lg: 3,
                            xl: 3
                        }}
                        spacing={4}
                    >
                        <FormControl>
                            <FormLabel>Course Name</FormLabel>
                            <Input
                                name="courseName"
                                value={formData.courseName || ''}
                                onChange={(e) => handleInputChange(e, 'courseName')}
                                readOnly={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Course Title</FormLabel>
                            <Input
                                name="courseTitle"
                                value={formData.courseTitle || ''}
                                onChange={(e) => handleInputChange(e, 'courseTitle')}
                                readOnly={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Course Duration</FormLabel>
                            <Input
                                name="duration"
                                value={formData.duration || ''}
                                onChange={(e) => handleInputChange(e, 'duration')}
                                readOnly={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Course Price</FormLabel>
                            <Input
                                name="price"
                                value={formData.price || ''}
                                onChange={(e) => handleInputChange(e, 'price')}
                                readOnly={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Course Mrp</FormLabel>
                            <Input
                                name="mrp"
                                value={formData.mrp || ''}
                                onChange={(e) => handleInputChange(e, 'mrp')}
                                readOnly={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Created By</FormLabel>
                            <Input
                                name="createdBy"
                                value={formData.createdBy || ''}
                                onChange={(e) => handleInputChange(e, 'createdBy')}
                                readOnly
                                bg='gray.100'
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Short Info</FormLabel>
                            <Input
                                name="shortInfo"
                                value={formData.shortInfo || ''}
                                onChange={(e) => handleInputChange(e, 'shortInfo')}
                                readOnly={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Thumbnail</FormLabel>
                            <Input
                                name="thumbnail"
                                value={formData.thumbnail || ''}
                                onChange={(e) => handleInputChange(e, 'thumbnail')}
                                readOnly={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Small Thumbnail</FormLabel>
                            <Input
                                name="smallThumbnail"
                                value={formData.smallThumbnail || ''}
                                onChange={(e) => handleInputChange(e, 'smallThumbnail')}
                                readOnly={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Sample Video</FormLabel>
                            <Input
                                name="sampleVideo"
                                value={formData.sampleVideo || ''}
                                onChange={(e) => handleInputChange(e, 'sampleVideo')}
                                readOnly={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            />
                        </FormControl>
                        <FormControl ml={5}>
                            <FormLabel>Overall Rating</FormLabel>
                            <StarRatings
                                rating={formData.overAllRating || 0}
                                starRatedColor="gold"
                                starHoverColor="gold"
                                changeRating={(newRating) => handleInputChange({ target: { name: 'overAllRating', value: newRating } }, 'overAllRating')}
                                numberOfStars={5}
                                starDimension="40px"
                                starSpacing="5px"
                                name="overallRating"
                                readOnly={!isEditable}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Status</FormLabel>
                            {isEditable ? (
                                <Select
                                    name="status"
                                    value={formData.status || ''}
                                    onChange={(e) => handleInputChange(e, 'status')}
                                    bg="white"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Active">Active</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Archive">Archive</option>
                                </Select>
                            ) : (
                                <Input
                                    name="status"
                                    value={formData.status || ''}
                                    readOnly
                                    bg="gray.100"
                                />
                            )}
                        </FormControl>
                        <FormControl>
                            <FormLabel>Created On</FormLabel>
                            <Input
                                name="Created On"
                                value={TimeConversion.unixTimeToRealTime(formData.createdOn)}
                                readOnly
                                bg='gray.100'
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Updated On</FormLabel>
                            <Input
                                name="updatedOn"
                                value={TimeConversion.unixTimeToRealTime(formData.updatedOn || '')}
                                onChange={(e) => handleInputChange(e, 'updatedOn')}
                                readOnly
                                bg='gray.100'
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Happy Students</FormLabel>
                            <Input
                                name="happyStudents"
                                value={formData.happyStudents || ''}
                                onChange={(e) => handleInputChange(e, 'happyStudents')}
                                readOnly={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Benefits</FormLabel>
                            <Input
                                name="benefits"
                                value={formData.benefits || ''}
                                onChange={(e) => handleInputChange(e, 'benefits')}
                                readOnly={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Category</FormLabel>
                            <Select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                isDisabled={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            >
                                {CategoryData.map((category) => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.categoryTitle}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Category ID</FormLabel>
                            <Input
                                name="categoryId"
                                value={formData.categoryId || ''}
                                readOnly
                                bg="gray.100"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Long Info</FormLabel>
                            <Textarea
                                name="longInfo"
                                value={formData.longInfo || ''}
                                onChange={(e) => handleInputChange(e, 'longInfo')}
                                readOnly={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>HTML Info</FormLabel>
                            <Textarea
                                name="htmlInfo"
                                value={formData.htmlInfo || ''}
                                onChange={(e) => handleInputChange(e, 'htmlInfo')}
                                readOnly={!isEditable}
                                bg={isEditable ? 'white' : 'gray.100'}
                            />
                        </FormControl>
                    </SimpleGrid>
                    <Box display={{ base: 'block', md: 'block' }}>
                        {formData.thumbnail && (
                            <Box mb={4} maxW="100%">
                                <Text mb={2}>Thumbnail Preview:</Text>
                                <Image src={formData.thumbnail} alt="Thumbnail" onError={(e) => (e.target.src = fallbackImage)} maxW="100%" h="auto" />
                            </Box>
                        )}
                        {formData.smallThumbnail && (
                            <Box mb={4} maxW="100%">
                                <Text mb={2}>Small Thumbnail Preview:</Text>
                                <Image src={formData.smallThumbnail} alt="Small Thumbnail" onError={(e) => (e.target.src = fallbackImage)} maxW="100%" h="auto" />
                            </Box>
                        )}
                        {formData.sampleVideo && (
                            <Box maxW="100%" mb={4}>
                                <Text mb={2}>Sample Video Preview:</Text>
                                <Box maxW="100%" overflow="hidden" position="relative" pb="56.25%">
                                    <video style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }} controls>
                                        <source src={formData.sampleVideo} type="video/mp4" onError={(e) => e.target.src = fallbackVideo} />
                                        Your browser does not support the video tag.
                                    </video>
                                </Box>
                            </Box>
                        )}
                    </Box>

                </Grid>
            </Box>
        </Box>
    );
}
