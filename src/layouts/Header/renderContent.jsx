import React from 'react';
import { Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // assuming you are using React Router

const renderContent = (path) => {
    switch (path) {
      case "/dashboard":
        return (
          <Link to="/dashboard">
            <Text fontSize="xl" fontWeight="bold">
              Dashboard
            </Text>
          </Link>
        );
      case "/user/user-list":
        return (
          <Link to="/user/user-list">
            <Text fontSize="xl" fontWeight="bold">
              User / User List
            </Text>
          </Link>
        );
      case "/user/roles":
        return (
          <Link to="/user/roles">
            <Text fontSize="xl" fontWeight="bold">
              User / User Roles
            </Text>
          </Link>
        );
      case "/branch/branch-list":
        return (
          <Link to="/branch/branch-list">
            <Text fontSize="xl" fontWeight="bold">
              Branch / Branch List
            </Text>
          </Link>
        );
      case "/branch/branch-planner":
        return (
          <Link to="/branch/branch-planner">
            <Text fontSize="xl" fontWeight="bold">
              Branch / Branch Planner
            </Text>
          </Link>
        );
      case "/student/student-list":
        return (
          <Link to="/student/student-list">
            <Text fontSize="xl" fontWeight="bold">
              Student / Student List
            </Text>
          </Link>
        );
      case "/student/qualifications":
        return (
          <Link to="/student/qualifications">
            <Text fontSize="xl" fontWeight="bold">
              Student / Student Qualifications
            </Text>
          </Link>
        );
      case "/student/certificate-templete":
        return (
          <Link to="/student/certificate-template">
            <Text fontSize="xl" fontWeight="bold">
              Student / Certificate Templates
            </Text>
          </Link>
        );
      case "/student/certificate":
        return (
          <Link to="/student/certificate">
            <Text fontSize="xl" fontWeight="bold">
              Student / Student Certificate
            </Text>
          </Link>
        );
      case "/student/fee-option":
        return (
          <Link to="/student/fee-option">
            <Text fontSize="xl" fontWeight="bold">
              Student / Fee Options
            </Text>
          </Link>
        );
      case "/courseStuff/course-list":
        return (
          <Link to="/courseStuff/course-list">
            <Text fontSize="xl" fontWeight="bold">
              Course Stuff / Course List
            </Text>
          </Link>
        );
      case "/courseStuff/course-category":
        return (
          <Link to="/courseStuff/course-category">
            <Text fontSize="xl" fontWeight="bold">
              Course Stuff / Course Categories
            </Text>
          </Link>
        );
      case "/courseStuff/course-content":
        return (
          <Link to="/courseStuff/course-content">
            <Text fontSize="xl" fontWeight="bold">
              Course Stuff / Course Content
            </Text>
          </Link>
        );
      case "/courseStuff/course-purchase-history":
        return (
          <Link to="/courseStuff/course-purchase-history">
            <Text fontSize="xl" fontWeight="bold">
              Course Stuff / Course Purchase History
            </Text>
          </Link>
        );
      case "/media-content":
        return (
          <Link to="/media-content">
            <Text fontSize="xl" fontWeight="bold">
              Media Content
            </Text>
          </Link>
        );
      case "/staff-attendence":
        return (
          <Link to="/staff-attendance">
            <Text fontSize="xl" fontWeight="bold">
              Staff / Staff Attendance
            </Text>
          </Link>
        );
      case "/documents":
        return (
          <Link to="/documents">
            <Text fontSize="xl" fontWeight="bold">
              Documents
            </Text>
          </Link>
        );
      case "/enquiry":
        return (
          <Link to="/enquiry">
            <Text fontSize="xl" fontWeight="bold">
              Enquiry
            </Text>
          </Link>
        );
      case "/logout":
        return (
          <Link to="/logout">
            <Text fontSize="xl" fontWeight="bold">
              Logout
            </Text>
          </Link>
        );
      default:
        return null;
    }
};

export default renderContent;
