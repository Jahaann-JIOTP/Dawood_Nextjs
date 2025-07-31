import {
  faTachometerAlt,
  faProjectDiagram,
  faChartBar,
  faFileAlt,
  faBell,
  faUser,
  faMicrochip,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";

import PowerIcon from "../../public/sidebarIcons/PowerIcon";
import TransformerIcon from "../../public/sidebarIcons/Transformer";
import Unit4Lt1 from "../../public/sidebarIcons/Unit4Lt1";
import PlantOverview from "../../public/sidebarIcons/PlantOverview";

export const privilegeConfig = {
  Dashboard: {
    href: "/dashboard",
    icon: faTachometerAlt,
    label: "DASHBOARD",
    matchPaths: ["/dashboard", "/process", "/chillers", "/differentials"],
    tab: "Home",
  },

 

  Diagram: {
    href: "/diagram_sld",
    icon: faProjectDiagram,
    label: "DIAGRAM",
    tab: "Diagram",
    matchPaths: ["/diagram_sld", "/diagram_processor"],
  },
    Alarms: {
    href: "/all_Alarms",
    icon: faBell,
    label: "ALARMS",
    tab: "Alarms",
    matchPaths: ["/all_Alarms", "/recent_Alarms", "/alarms_Threshold"],
  },

  Reports: {
    href: "/energy_cost_report",
    icon: faFileAlt,
    label: "REPORTS",
    tab: "Reports",
    matchPaths: ["/energy_cost_report", "/energy_usage_report"],
  },

  Trends:{
    href: "/trends",
    icon: faFileAlt,
    label: "TRENDS",
    tab: "Trends",
    matchPaths: ["/trends"],

  },


  "User Management": {
    href: "/user_management",
    icon: faUser,
    label: "User Management",
    tab: "User Management",
    matchPaths: ["/user_management"],
  },
};

export const privilegeOrder = [
  "Dashboard",
  "Diagram",
  "Reports",
   "Trends",
    "Alarms",
  "User Management",
];

export const sidebarLinksMap = {
  Home: [
    {
      id: 0,
      title: "Dashboard",
      icon: PowerIcon,
      submenu: [
        {
          id: 0,
          title: "Plant Summary",
          href: "/dashboard",
          icon: PlantOverview,
        },
        // {
        //   id: 1,
        //   title: "Process",
        //   href: "/process",
        //   icon: PlantOverview,
        // },
        // {
        //   id: 2,
        //   title: "Chillers",
        //   href: "/chillers",
        //   icon: TransformerIcon,
        // },
        // {
        //   id: 3,
        //   title: "Differentials",
        //   href: "/differentials",
        //   icon: TransformerIcon,
        // },
      ],
    },
  ],

  Diagram: [
    {
      id: 0,
      title: "Sld diagram ",
      icon: PowerIcon,
      submenu: [
        {
          id: 0,
          title: "Meter diagram ",
          href: "/diagram_sld",
          icon: PlantOverview,
        },
     
      ],
    },
  ],

 Trends: [
    {
      title: "Customized Trends",
      icon: TransformerIcon,
      href: "/trends",
    },
  ],
"Alarms": [
    {
      title: "All alarms ",
      icon: TransformerIcon,
      href: "/all_Alarms",
    },

    {
      title: "Recent alarms ",
      icon: TransformerIcon,
      href: "/recent_Alarms",
    },
    {
      title: "Alarms threshhold",
      icon: TransformerIcon,
      href: "/alarms_Threshold",
    },

  ],  
  
  Reports: [
    {
      title: "Energy Cost Report",
      icon: TransformerIcon,
      href: "/energy_cost_report",
    },
    {
      title: "Energy Usage Report",
      icon: TransformerIcon,
      href: "/energy_usage_report",
    },
  ],

  "User Management": [
    {
      title: "User Management",
      icon: TransformerIcon,
      href: "/user_management",
    },
  ],
};
