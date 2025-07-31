export const getDateRangeFromString = (rangeType) => {
  const today = new Date();
  const start = new Date();

  const formatDate = (date) => date.toISOString().split("T")[0];

  switch (rangeType.toLowerCase()) {
    case "today":
      break;

  

    case "thisweek": {
      const day = today.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      start.setDate(today.getDate() + mondayOffset);
      break;
    }

    

    case "thismonth":
      start.setDate(1);
      break;



    case "thisyear":
      start.setMonth(0);
      start.setDate(1);
      break;

    default:
      throw new Error(
        `Invalid range type: "${rangeType}". Use one of: today, yesterday, thisWeek, last7Days, thisMonth, last30Days, or thisYear.`
      );
  }

  return {
    startDateDropdown: formatDate(start),
    endDateDropdown: formatDate(today),
  };
};
