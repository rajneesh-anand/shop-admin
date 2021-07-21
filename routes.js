// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Users",
    icon: Person,
    layout: "/admin",
  },

  {
    path: "/product",
    name: "New Product",
    icon: Person,
    layout: "/admin",
  },
  // {
  //   path: "/products",
  //   name: "Product List",
  //   rtlName: "قائمة الجدول",
  //   icon: "content_paste",
  //   layout: "/admin",
  // },

  {
    path: "/products",
    name: "Product List",
    icon: "content_paste",
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: LocationOn,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: Notifications,
    layout: "/admin",
  },
  {
    path: "/rtl-page",
    name: "RTL Support",
    icon: Language,
    layout: "/rtl",
  },
];

export default dashboardRoutes;
