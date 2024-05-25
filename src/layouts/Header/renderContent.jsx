import React from 'react';
import { Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const renderContent = (path) => {
    switch (path) {
      case "/":
        return (
          <Link to="/">
            <Text fontSize="xl" fontWeight="bold">
              Dashboard
            </Text>
          </Link>
        );
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
              User / Roles
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
      case "/branch/plan":
        return (
          <Link to="/branch/plan">
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
      case "/student/certificates":
        return (
          <Link to="/student/certificates">
            <Text fontSize="xl" fontWeight="bold">
              Student / Student Certificate
            </Text>
          </Link>
        );
      case "/certificate/template":
        return (
          <Link to="/certificate/template">
            <Text fontSize="xl" fontWeight="bold">
              Student / Certificate Templates
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
      case "/courses":
        return (
          <Link to="/courses">
            <Text fontSize="xl" fontWeight="bold">
              Course / Course List
            </Text>
          </Link>
        );
      case "/courses/categories":
        return (
          <Link to="/courses">
            <Text fontSize="xl" fontWeight="bold">
              Course / Course Categories
            </Text>
          </Link>
        );
      case "/course/contents":
        return (
          <Link to="/courses">
            <Text fontSize="xl" fontWeight="bold">
              Course / Course Content
            </Text>
          </Link>
        );
      case "/course/purchase/history":
        return (
          <Link to="/courses">
            <Text fontSize="xl" fontWeight="bold">
              Course / Course Purchase History
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
      case "/staff/attendance":
        return (
          <Link to="/staff/attendance">
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
