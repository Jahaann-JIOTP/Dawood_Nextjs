"use client";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const TopHeader = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <header className="h-[55px] flex items-center justify-between px-4 bg-white dark:bg-gray-800">
      <Link href={"/dashboard"} className="flex items-center">
        {theme === "light" ? (
         <img 
            src="./nayalogo.png" 
            className="h-13 max-w-none object-contain filter contrast-125 brightness-90" 
            alt="Logo"
            style={{
           
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)) contrast(1.1)',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : (
          <img
            src="./Darkthemelogo.png"
            className="h-12"
            alt="Logo"
          />
        )}
      </Link>

      <div className="header-right flex items-center space-x-4">
        {theme === "light" ? (
          <img
            src={"./jahaann-light.svg"}
            alt="User Image"
            className={`h-[30px]`}
          />
        ) : (
          <img
            src={"./jahaann-dark.png"}
            alt="User Image"
            className={`h-[30px]`}
          />
        )}
      </div>
    </header>
  );
};

export default TopHeader;
