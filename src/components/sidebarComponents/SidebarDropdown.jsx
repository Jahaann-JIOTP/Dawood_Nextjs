"use client";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { usePathname } from "next/navigation";
export default function SidebarDropdown({
  item,
  isOpen,
  onClick,
  iscollapese,
}) {
  const [isClient, setIsClient] = useState(false);
  const path = usePathname();
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="flex items-center flex-col">
      <button
        onClick={onClick}
        className="group w-full flex  text-[13.216px] justify-between items-center p-2 hover:text-[#1A68B2] rounded-md"
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
                <item.icon className="w-4 h-4 text-black dark:text-white  group-hover:text-[#1A68B2] dark:group-hover:text-[#1A68B2]" />
              </span>
            </Tooltip>
          )
        ) : (
          <span className="flex items-center justify-center gap-2">
            <item.icon className="w-4 h-4 text-black dark:text-white group-hover:text-[#1A68B2] dark:group-hover:text-[#1A68B2]" />
            {item.title}
          </span>
        )}
        <span>{isOpen ? <HiChevronUp /> : <HiChevronDown />}</span>
      </button>

      {isOpen && (
        <div
          className={`w-full flex flex-col  ${
            iscollapese
              ? "p-auto justify-center items-center px-1"
              : "pr-2 pl-4"
          } gap-2`}
        >
          {item.submenu.map((sub) => {
            const activePath = path === sub.href;
            return (
              <Link
                key={sub.id}
                href={sub.href}
                className={`group flex hover:text-[#1A68B2] w-full py-[7px] text-[13.216px] rounded-md ${
                  iscollapese ? "items-center justify-center" : ""
                }`}
                style={{ fontWeight: 500 }}
              >
                {iscollapese ? (
                  <div className=" relative flex items-center justify-center">
                    {isClient && (
                      <Tooltip
                        title={sub.title}
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
                          <sub.icon
                            className={`w-5 h-5   ${
                              activePath
                                ? "text-[#1A68B2]"
                                : "text-black dark:text-white"
                            } group-hover:text-[#1A68B2] dark:group-hover:text-[#1A68B2]`}
                          />
                        </span>
                      </Tooltip>
                    )}
                  </div>
                ) : (
                  <div
                    className={`text-[13px] ${
                      activePath
                        ? "text-[#1A68B2]"
                        : "text-black dark:text-white"
                    } w-full flex items-center justify-start pl-4 gap-2 group-hover:text-[#1A68B2] dark:group-hover:text-[#1A68B2]`}
                  >
                    <sub.icon
                      className={`w-5 h-5 ${
                        activePath
                          ? "text-[#1A68B2]"
                          : "text-black dark:text-white"
                      }  group-hover:text-[#1A68B2] dark:group-hover:text-[#1A68B2]`}
                    />
                    {sub.title}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}