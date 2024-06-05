import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import FullLayout from "../layouts/FullLayout";
import Dashboard from "../components/Dashboard/Dashboard";
import NotFound from "../components/NotFound/NotFound";
import User_List from "../components/Users/Users_List/User_List";
import Role from "../components/Users/Role/Role";
import Branch_List from "../components/Branch/Branch_List/Branch_List";
import Planner from "../components/Branch/Planner/Planner";
import Student_List from "../components/Student/Students_List/Student_List";
import Qualifications from "../components/Student/Qualifications/Qualifications";
import Certificate from "../components/Student/Certificates/Certificates";
import Templetes from "../components/Student/Certificates/Certificates_Templete/Templetes";
import Fee_Option from "../components/Student/Fee_Options/Fee_Option";
import Course_List from "../components/CourseStuff/Course_List/Course_List";
import Course_Category from "../components/CourseStuff/Course_Category/Course_Category";
import Course_Content from "../components/CourseStuff/Course_Content/Course_Content";
import Purchase_History from "../components/CourseStuff/Purchase_History/Purchase_History";
import Media_Content from "../components/Media/Media_Content";
import Documents from "../components/Docx/Documents";
import Inquiry from "../components/Inquiry/Inquiry";
import Login from "../components/Login_Logout/Login";
import Logout from "../components/Login_Logout/Logout";
import EditRoles from "../components/Users/Role/EditRoles";
import Home_Branch from "../components/Branch/Branch_List/Home_Branch";
import { useParams } from "react-router-dom";
import StaffAttendance from "../components/Attendance/Staff/StaffAttendance";
import StudentAttendance from "../components/Attendance/Student/StudentAttendance";
import Course from "../components/CourseStuff/Course_List/Course";


const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      <Route
        path="/"
        element={
          sessionStorage.getItem("api-token") == "123" ? (
            <FullLayout />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user/user-list" element={<User_List />} />
        <Route path="/user/roles" element={<Role />} />
        <Route path="/user/roles/edit/:roleId" element={<EditRolesWithPermissionCheck />} />
        <Route path="/branch/branch-list" element={<Branch_List />} />
        <Route path="/branch/dashboard/:branchId" element={<Home_Branch />} />
        <Route path="/branch/plan" element={<Planner />} />
        <Route path="/student/student-list" element={<Student_List />} />
        <Route path="/student/qualifications" element={<Qualifications />} />
        <Route path="/student/certificates" element={<Certificate />} />
        <Route path="/certificate/template" element={<Templetes />} />
        <Route path="/student/fee-option" element={<Fee_Option />} />
        <Route path="/courses" element={<Course_List />} />
        <Route path="/courses/:branchId" element={<Course_List />} />
        <Route path="/course/info/:courseId" element={<Course />} />
        <Route path="/courses/categories" element={<Course_Category />} />
        <Route path="/course/contents" element={<Course_Content />} />
        <Route path="/course/purchase/history" element={<Purchase_History />} />
        <Route path="/media-content" element={<Media_Content />} />
        <Route path="/staff/attendance" element={<StaffAttendance />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/inquiry" element={<Inquiry />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  )
);

export default routes;

function EditRolesWithPermissionCheck() {
  const { roleId } = useParams();
  if (roleId === "1") {
    return <Navigate to="*" />;
  } else {
    return <EditRoles />;
  }
}
