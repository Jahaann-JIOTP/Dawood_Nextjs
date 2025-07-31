import * as React from "react";
import DateRangeSelector from "@/components/DateRangeSelector";

function OverviewHeader() {
  return (
    <header className="flex">
      <DateRangeSelector />
    </header>
  );
}

export default OverviewHeader;
