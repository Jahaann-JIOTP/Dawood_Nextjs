const config = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  AUTH: {
    LOGIN: "/auth/login",
  },
  USER: {
    PROFILE: "/users/myprofile",
  },
  ALARMS: {
    BELL: "/bell",
    ACKNOWLEDGE: "/bell/acknowledge",
  },
};

export default config;
