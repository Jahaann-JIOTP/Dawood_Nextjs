import SidebarMenu from "@/components/sidebarComponents/SidebarMenu";
import { useEffect, useState } from "react";
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";
import { IoLogOut } from "react-icons/io5";
import { logout } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const Sidebar = ({ activeTab, handleTabClick }) => {
  const [iscollapese, setIsCollapse] = useState(false);
  const [tabWidth, setTabWidth] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const handleLogout = () => {
    setTimeout(() => dispatch(logout()), 0);
    router.push("/");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1300) {
        setIsCollapse(true);
        setTabWidth(true);
      } else {
        setIsCollapse(false);
        setTabWidth(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <aside
      className={`hidden relative border-t-3 border-[#1F5897] rounded-lg shadow xl:flex flex-col bg-white dark:bg-gray-800 py-3 h-[81vh] z-50 overflow-hidden ${
        iscollapese ? "w-[60px]" : tabWidth ? "w-[19vw]" : "w-[14vw]"
      }`}
    >
      {/* Top Section (fixed) */}
      <div
        className={`w-full border-b-1 border-gray-300 flex px-4 ${
          iscollapese ? "justify-center" : "justify-between"
        }`}
      >
        {!iscollapese && (
          <div
            className={`flex gap-2 items-center text-[13.216px] justify-start w-full pb-1`}
            style={{ fontWeight: 700 }}
          >
            <span className="">
              {activeTab === "Home" ? "Dashboard" : activeTab}
            </span>
            {!tabWidth && <span>Section</span>}
          </div>
        )}
        <button
          onClick={() => setIsCollapse(!iscollapese)}
          className="cursor-pointer py-1"
        >
          {iscollapese ? <CgMenuLeft size={23} /> : <CgMenuRight size={23} />}
        </button>
      </div>

      {/* Center Scrollable Section */}
      <div className="flex-1 overflow-y-auto w-full">
        <SidebarMenu tab={activeTab} iscollapese={iscollapese} />
      </div>

      {/* Bottom Section (fixed) */}
      <div className="w-full">
        <button
          onClick={() => handleLogout()}
          className="w-full pt-2 text-[16.004px] flex items-center justify-center gap-2 cursor-pointer rounded-md"
          style={{ fontWeight: 600 }}
        >
          <IoLogOut size={28} className="text-[#1A68B2]" />
          {!iscollapese && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;