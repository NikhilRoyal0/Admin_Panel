import React, { useState, useEffect } from 'react';
import {
    GridItem,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Checkbox,
    IconButton,
    Flex,
    Box,
    CloseButton,
} from '@chakra-ui/react';
import { MdArrowDropDown } from 'react-icons/md';

const CourseSelect = ({ formData, setFormData, isEditing, coursesData }) => {
    const initialSelectedCourses = formData.courses ? JSON.parse(formData.courses) : [];
    const [selectedCourses, setSelectedCourses] = useState(initialSelectedCourses);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setFormData({
            ...formData,
            courses: JSON.stringify(selectedCourses),
        });
    }, [selectedCourses, setFormData]);

    const toggleCourseSelection = (course) => {
        if (isSelected(course)) {
            setSelectedCourses(selectedCourses.filter(selectedCourse => selectedCourse.courseId !== course.courseId));
        } else {
            setSelectedCourses([...selectedCourses, course]);
        }
    };

    const isSelected = (course) => {
        return selectedCourses.some(selectedCourse => selectedCourse.courseId === course.courseId);
    };

    const handleMenuToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen && isEditing) {
            setSelectedCourses(initialSelectedCourses);
        }
    };

    const removeCourse = (course) => {
        setSelectedCourses(selectedCourses.filter(selectedCourse => selectedCourse.courseId !== course.courseId));
    };

    return (
        <GridItem colSpan={2}>
            <Text mb={2} fontWeight="bold">Courses</Text>

            <Flex flexDirection="column" alignItems="flex-start">
                <Menu isOpen={isOpen && isEditing} onClose={() => setIsOpen(false)}>
                    <MenuButton
                        as={IconButton}
                        icon={<Text m={5} display="flex">Select Courses <MdArrowDropDown style={{ marginLeft: "5px" }} size={25} /></Text>}
                        variant="outline"
                        size="md"
                        aria-label="Select courses"
                        maxWidth={200}
                        isDisabled={!isEditing}
                        onClick={handleMenuToggle}
                    >
                        Select Courses
                    </MenuButton>
                    <MenuList minWidth="240px">
                        {coursesData.map(course => (
                            <MenuItem key={course.courseId}>
                                <Checkbox
                                    mr={2}
                                    isChecked={isSelected(course)}
                                    onChange={() => toggleCourseSelection(course)}
                                    isDisabled={!isEditing}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    {course.courseName}
                                </Checkbox>
                                {isSelected(course) && (
                                    <Text>{course.courseLabel}</Text>
                                )}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>

                <Box border="1px solid" borderColor="gray.300" p={3} borderRadius="md" mt={3} width="100%">
                    <Flex flexWrap="wrap" mt={1}>
                        {selectedCourses.map(course => (
                            <Flex key={course.courseId} alignItems="center" mr={2} mb={2} bg="gray.100" p={2} borderRadius="md">
                                <Text>{course.courseName}</Text>
                                {isEditing && <CloseButton ml={2} onClick={() => removeCourse(course)} />}
                            </Flex>
                        ))}
                    </Flex>
                </Box>
            </Flex>
        </GridItem>
    );
};

export default CourseSelect;
