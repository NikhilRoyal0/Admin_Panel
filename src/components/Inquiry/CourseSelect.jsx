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
    Spinner,
    Flex,
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

    return (
        <GridItem colSpan={1}>
            <Text mb={2} fontWeight="bold">Courses</Text>
            <Menu isOpen={isOpen && isEditing} onClose={() => setIsOpen(false)}>
                <MenuButton
                    as={IconButton}
                    icon={<Text m={5} display="flex">Select Courses  <MdArrowDropDown style={{ marginLeft: "5px" }} size={25} /></Text>}
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
        </GridItem>
    );
};

export default CourseSelect;
