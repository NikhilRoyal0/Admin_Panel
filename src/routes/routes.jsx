import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
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
import Enquiry from "../components/Enquiry/Enquiry";
import Attendence from "../components/Attendence/Attendence";
import Login from "../components/Login_Logout/Login";
import Logout from "../components/Login_Logout/Logout";



const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/login" element={<Login/>}/>
    <Route path="/logout" element={<Logout/>}/>

      <Route path="/" element={<FullLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user/user-list" element={<User_List />} />
        <Route path="/user/roles" element={<Role />} />
        <Route path="/branch/branch-list" element={<Branch_List />} />
        <Route path="/branch/branch-planner" element={<Planner />} />
        <Route path="/student/student-list" element={<Student_List />} />
        <Route path="/student/qualifications" element={<Qualifications />} />
        <Route path="/student/certificate" element={<Certificate />} />
        <Route path="/student/certificate-templete" element={<Templetes />} />
        <Route path="/student/fee-option" element={<Fee_Option />} />
        <Route path="/courseStuff/course-list" element={<Course_List />} />
        <Route path="/courseStuff/course-category" element={<Course_Category />} />
        <Route path="/courseStuff/course-content" element={<Course_Content />} />
        <Route path="/courseStuff/course-purchase-history" element={<Purchase_History />} />
        <Route path="/media-content" element={<Media_Content />} />
        <Route path="/staff-attendence" element={<Attendence />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/enquiry" element={<Enquiry />} />

      </Route>
      <Route path="*" element={<NotFound />} />

    </>
  )
);

export default routes;
