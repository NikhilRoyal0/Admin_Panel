import React from 'react';
import { Text } from '@chakra-ui/react';


const renderContent = (path) => {
    switch (path) {
      case "/dashboard":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Dashboard
          </Text>
        );
      case "/user/user-list":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Users Lists
          </Text>
        );
      case "/user/roles":
        return (
          <Text fontSize="xl" fontWeight="bold">
            User Roles
          </Text>
        );
      case "/branch/branch-list":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Branch List
          </Text>
        );
      case "/branch/branch-planner":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Branch Planner
          </Text>
        );
      case "/student/student-list":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Student List
          </Text>
        );
      case "/student/qualifications":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Student Qualifications
          </Text>
        );
      case "/student/certificate-templete":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Certificate Templates
          </Text>
        );
      case "/student/certificate":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Student Certificate
          </Text>
        );
      case "/student/fee-option":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Fee Options
          </Text>
        );
      case "/courseStuff/course-list":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Course List
          </Text>
        );
      case "/courseStuff/course-category":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Course Categories
          </Text>
        );
      case "/courseStuff/course-content":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Course Content
          </Text>
        );
      case "/courseStuff/course-purchase-history":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Course Purchase History
          </Text>
        );
      case "/media-content":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Media Content
          </Text>
        );
      case "/staff-attendence":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Staff Attendance
          </Text>
        );
      case "/documents":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Documents
          </Text>
        );
      case "/enquiry":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Enquiry
          </Text>
        );
      case "/logout":
        return (
          <Text fontSize="xl" fontWeight="bold">
            Logout
          </Text>
        );
      default:
        return null;
    }
};

export default renderContent;
