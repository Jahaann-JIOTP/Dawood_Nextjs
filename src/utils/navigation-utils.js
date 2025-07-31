import { privilegeConfig } from "@/constant/navigation";

// Utility function to determine the active tab based on current pathname
export const getActiveTabFromPathname = (pathname) => {
  for (const [key, config] of Object.entries(privilegeConfig)) {
    if (
      Array.isArray(config.matchPaths) &&
      config.matchPaths.includes(pathname)
    ) {
      return config.tab;
    }
  }
  // Default to first tab if no match found
  return "Home";
};

// Utility function to check if a path matches any of the config paths
export const isPathActive = (pathname, matchPaths) => {
  return Array.isArray(matchPaths) && matchPaths.includes(pathname);
};
