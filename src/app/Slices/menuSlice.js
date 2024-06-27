import { createSlice } from "@reduxjs/toolkit";
import { RiDashboardLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { SlControlEnd } from "react-icons/sl";
import { FaBuilding } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { RiFilePaper2Line } from "react-icons/ri";
import { FaBook } from "react-icons/fa";
import { LiaNewspaper } from "react-icons/lia";
import { LuClipboardList } from "react-icons/lu";
import { MdCategory } from "react-icons/md";
import { SiContentstack } from "react-icons/si";
import { FaHistory } from "react-icons/fa";
import { FaRegQuestionCircle } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { PiStudentFill } from "react-icons/pi";
import { VscFileSubmodule } from "react-icons/vsc";



const getIconComponentByName = (name) => {
  switch (name) {
    case "Branch":
      return FaBuilding;
    case "Users":
      return FaUsers;
    case "Staff Attendance":
      return FaCalendarDays;
    case "Roles":
      return SlControlEnd;
    case "Courses":
      return LuClipboardList;
    case "Course Category":
      return MdCategory;
    case "Course Content":
      return SiContentstack;
    case "Course Purchase History":
      return FaHistory;
    case "Benefits":
      return FaBook;
    case "Certificates":
      return LiaNewspaper;
    case "Certificate Template":
      return RiFilePaper2Line;
    case "Inquiry":
      return FaRegQuestionCircle;
    case "Student Attendance":
      return FaCalendarDays;
    case "Students":
      return PiStudentFill;
    case "Modules":
      return VscFileSubmodule;
    default:
      return null;
  }
};
const initialState = {
  LinkItems: [],
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setLinkItems: (state, action) => {
      state.LinkItems = action.payload || [];
    },
  },
});

export const { setLinkItems } = menuSlice.actions;

export const fetchLinkItems = () => async (dispatch) => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      console.error("Token not found in session storage");
      return;
    }

    let decodedToken;
    try {
      decodedToken = JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error("Error parsing JWT token:", error);
      return;
    }


    const userPermissions = decodedToken.userData.roleAttribute[0].permissions || [];
    const permissions = JSON.parse(userPermissions);


    const menuItems = permissions
      .filter(permission => permission.permissionsList && permission.permissionsList.read) 
      .map(permission => ({
        title: permission.module,
        href: permission.pageRoute,
        icon: getIconComponentByName(permission.module)
      }));

    const dashboardItem = {
      title: "Dashboard",
      href: "/dashboard",
      icon: RiDashboardLine
    };

    const signOutItem = {
      title: "Signout",
      href: "/logout",
      icon: BiLogOut
    };

    dispatch(setLinkItems([dashboardItem, ...menuItems, signOutItem]));
  } catch (error) {
    console.error("Error fetching menu items:", error);
  }
};


export default menuSlice.reducer;
