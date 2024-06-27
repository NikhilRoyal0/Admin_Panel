import React from 'react';
import { Text } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';

const RenderContent = () => {
  const { branchId } = useParams();
  const { courseId } = useParams();
  const { userId } = useParams();
  const { student_id } = useParams();
  const { lead_id } = useParams();

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
      case `/user/dashboard/${userId}`:
        return (
          <Link to={`/user/user-list`}>
            <Text fontSize="xl" fontWeight="bold">
              User / Dashboard
            </Text>
          </Link>
        );
      case `/user/dashboard/alltransaction/${userId}`:
        return (
          <Link to={`/user/dashboard/${userId}`}>
            <Text fontSize="xl" fontWeight="bold">
              User / Wallet History
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
      case `/branch/dashboard/${branchId}`:
        return (
          <Link to={`/branch/branch-list`}>
            <Text fontSize="xl" fontWeight="bold">
              Branch / Dashboard
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
      case `/student/dashboard/${student_id}`:
        return (
          <Link to={`/student/student-list`}>
            <Text fontSize="xl" fontWeight="bold">
              Student / Dashboard
            </Text>
          </Link>
        );
      case `/student/dashboard/alltransaction/${student_id}`:
        return (
          <Link to={`/student/dashboard/${student_id}`}>
            <Text fontSize="xl" fontWeight="bold">
              Student / Wallet History
            </Text>
          </Link>
        );
      case "/student/attendance":
        return (
          <Link to="/student/student-list">
            <Text fontSize="xl" fontWeight="bold">
              Student / Student Attendance
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
      case "/student/modules":
        return (
          <Link to="/student/modules">
            <Text fontSize="xl" fontWeight="bold">
              Student / Modules
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
      case `/courses/${branchId}`:
        return (
          <Link to={`/branch/dashboard/${branchId}`}>
            <Text fontSize="xl" fontWeight="bold">
              Course / Branch Course
            </Text>
          </Link>
        );
      case `/course/info/${courseId}`:
        return (
          <Link to="/courses">
            <Text fontSize="xl" fontWeight="bold">
              Course / Course Details
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
      case `/course/info/purchaseHistory/${courseId}`:
        return (
          <Link to={`/course/info/${courseId}`}>
            <Text fontSize="xl" fontWeight="bold">
              Course / Purchase History
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
      case "/benefits":
        return (
          <Link to="/benefits">
            <Text fontSize="xl" fontWeight="bold">
              Benefits
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
      case "/leads":
        return (
          <Link to="/leads">
            <Text fontSize="xl" fontWeight="bold">
              Leads
            </Text>
          </Link>
        );
      case "/leads/addLead":
        return (
          <Link to="/leads">
            <Text fontSize="xl" fontWeight="bold">
              Leads / Add Lead
            </Text>
          </Link>
        );
        case `/leads/editLead/${lead_id}`:
          return (
          <Link to="/leads">
            <Text fontSize="xl" fontWeight="bold">
              Leads / Edit Lead
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

  return renderContent(window.location.pathname);
};

export default RenderContent;
