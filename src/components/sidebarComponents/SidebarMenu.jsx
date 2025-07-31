import Link from "next/link";
import { sidebarLinksMap } from "@/constant/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarDropdown from "./SidebarDropdown";
import { Tooltip } from "@mui/material";
export default function SidebarMenu({ tab, iscollapese }) {
  const links = sidebarLinksMap[tab] || [];
  const [openDropdownIndex, setOpenDropdownIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const path = usePathname();

  useEffect(() => {
    setIsClient(true);
    const matchedIndex = links.findIndex((item) =>
      item.submenu?.some((sub) => sub.href === path)
    );
    if (matchedIndex !== -1) {
      setOpenDropdownIndex(matchedIndex);
    }
  }, [path, links]);
  return (
    <div className=" py-2 px-2 ">
      {links.map((item, index) => {
        const activePath = path === item.href ? true : false;
        return item.submenu ? (
          <SidebarDropdown
            key={index}
            item={item}
            isOpen={openDropdownIndex === index}
            iscollapese={iscollapese}
            onClick={() =>
              setOpenDropdownIndex(openDropdownIndex === index ? -1 : index)
            }
          />
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex w-full p-2 rounded-md text-[13.216px] hover:text-[#1A68B2] transition-all duration-300 ${
              iscollapese
                ? "items-center justify-center"
                : "items-center justify-start"
            } `}
            style={{ fontWeight: 500 }}
          >
            {iscollapese ? (
              isClient && (
                <Tooltip
                  title={item.title}
                  arrow
                  placement="left"
                  slotProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "#025697",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: 500,
                      },
                    },
                    arrow: {
                      sx: {
                        color: "#025697",
                      },
                    },
                  }}
                >
                  <span>
                    <item.icon
                      className={`w-4 h-4  dark:text-white  group-hover:text-[#1A68B2] transition-all duration-300 ${
                        activePath
                          ? "text-[#1A68B2] dark:text-[#1A68B2]"
                          : "text-black dark:text-white"
                      }`}
                    />
                  </span>
                </Tooltip>
              )
            ) : (
              <span
                className={`flex items-center justify-center gap-2 ${
                  activePath
                    ? "text-[#1A68B2] dark:text-[#1A68B2]"
                    : "text-black dark:text-white"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 ${
                    activePath
                      ? "text-[#1A68B2] dark:text-[#1A68B2]"
                      : "text-black"
                  } dark:text-white`}
                />
                {item.title}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}