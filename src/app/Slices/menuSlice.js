import { createSlice } from "@reduxjs/toolkit";

import { RiDashboardLine } from "react-icons/ri";
import { FaUsersLine } from "react-icons/fa6";
import { PiUserList } from "react-icons/pi";
import { SlControlEnd } from "react-icons/sl";
import { FaBuilding } from "react-icons/fa6";
import { BsFillBuildingsFill } from "react-icons/bs";
import { GrPlan } from "react-icons/gr";
import { PiStudentBold } from "react-icons/pi";
import { LuListOrdered } from "react-icons/lu";
import { FaBook } from "react-icons/fa";
import { RiFilePaper2Line } from "react-icons/ri";
import { LiaNewspaper } from "react-icons/lia";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { FaBookBookmark } from "react-icons/fa6";
import { LuClipboardList } from "react-icons/lu";
import { MdCategory } from "react-icons/md";
import { SiContentstack } from "react-icons/si";
import { FaHistory } from "react-icons/fa";
import { FaPhotoVideo } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { IoDocument } from "react-icons/io5";
import { FaRegQuestionCircle } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";


const initialState = {
  LinkItems: [],
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setLinkItems: (state, action) => {
      state.LinkItems = action.payload;
    },
  },
});

export const { setLinkItems } = menuSlice.actions;

export const fetchLinkItems = () => (dispatch) => {
  const isVisible = true;

  const LinkItems = [
    {
      id: 1,
      title: "Dashboard",
      icon: RiDashboardLine,
      href: "/dashboard",
      visible: isVisible,
    },
    {
      id: 2,
      title: "User",
      icon: FaUsersLine,
      href: "#",
      visible: isVisible,
      subItems: [
        {
          id: 21,
          title: "User List",
          icon: PiUserList,
          href: "/user/user-list",
        },
        {
          id: 22,
          title: "Roles",
          icon: SlControlEnd,
          href: "/user/roles",
        },
      ],
    },
    {
        id: 3,
        title: "Branch",
        icon: FaBuilding,
        href: "#",
        visible: isVisible,
        subItems: [
          {
            id: 31,
            title: "Branch List",
            icon: BsFillBuildingsFill,
            href: "/branch/branch-list",
          },
          {
            id: 32,
            title: "Branch Planner",
            icon: GrPlan,
            href: "/branch/branch-planner",
          },
        ],
      },
      {
        id: 4,
        title: "Student",
        icon: PiStudentBold,
        href: "#",
        visible: isVisible,
        subItems: [
          {
            id: 41,
            title: "Students List",
            icon: LuListOrdered,
            href: "/student/student-list",
          },
          {
            id: 42,
            title: "Qualifications",
            icon: FaBook,
            href: "/student/qualifications",
          },
          {
            id: 43,
            title: "Certificate Templete",
            icon: RiFilePaper2Line,
            href: "/student/certificate-templete",
          },
          {
            id: 44,
            title: "Certificates",
            icon: LiaNewspaper,
            href: "/student/certificate",
          },
          {
            id: 45,
            title: "Fee Option",
            icon: FaMoneyCheckAlt,
            href: "/student/fee-option",
          },
        ],
      },
      {
        id: 5,
        title: "Course Stuff",
        icon: FaBookBookmark,
        href: "#",
        visible: isVisible,
        subItems: [
          {
            id: 51,
            title: "Course List",
            icon: LuClipboardList,
            href: "/courseStuff/course-list",
          },
          {
            id: 52,
            title: "Course Category",
            icon: MdCategory,
            href: "/courseStuff/course-category",
          },
          {
            id: 53,
            title: "Course Content",
            icon: SiContentstack,
            href: "/courseStuff/course-content",
          },
          {
            id: 54,
            title: "Purchase History",
            icon: FaHistory,
            href: "/courseStuff/course-purchase-history",
          },
        ],
      },
      {
        id: 6,
        title: "Media Content",
        icon: FaPhotoVideo,
        href: "/media-content",
        visible: isVisible,
      },
      {
        id: 7,
        title: "Staff Attendence",
        icon: FaCalendarDays,
        href: "/staff-attendence",
        visible: isVisible,
      },
      {
        id: 8,
        title: "Documents",
        icon: IoDocument,
        href: "/documents",
        visible: isVisible,
      },
      {
        id: 9,
        title: "Enquiry",
        icon: FaRegQuestionCircle,
        href: "/enquiry",
        visible: isVisible,
      },
      {
        id: 10,
        title: "Sign Out",
        icon: BiLogOut,
        href: "/logout",
        visible: isVisible,
      },
  ];

  const filteredLinkItems = LinkItems.filter((item) => item.visible);

  dispatch(setLinkItems(filteredLinkItems));
};

export default menuSlice.reducer;
