"use client";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import "react-datepicker/dist/react-datepicker.css";
import {
  CalendarDaysIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
// Helper functions for formatting dates
const formatDate = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatRange = (start, end) => {
  if (!start && !end) return "Select date range";
  if (start && !end) return `${formatDate(start)} - ...`;
  if (!start && end) return `... - ${formatDate(end)}`;
  return `${formatDate(start)} - ${formatDate(end)}`;
};

am4core.useTheme(am4themes_animated);

const CoolingTowerSelector = ({ onTowerChange, selectedTower }) => {
  return (
    <div className="flex  items-center gap-4">
      <h4 className="text-gray-700 dark:text-white font-medium sm:text-base">
        Select Cooling Tower:
      </h4>
      <div className="relative">
        <select
          className="appearance-none bg-white dark:bg-gray-700 text-gray-800 border dark:text-white border-gray-300 rounded-lg px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:w-auto min-w-[200px] transition"
          value={selectedTower}
          onChange={onTowerChange}>
          <option value="tower1">Tower 1 (4201-E01)</option>
          <option value="tower2">Tower 2 (4201-E02)</option>
          <option value="tower3">Tower 3 (4201-E03)</option>
        </select>
        {/* Down Arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const ChartCoolingCapacity = ({ selectedTower }) => {
  const chartRef = useRef(null);

  // Tower data arrays
  const towerData = {
    tower1: [
      0.5, 0.5, 0.5, 0.5, 1.906, 0.5, 0.5, 0.5, 0.5, 0.5, 1.464, 0.5, 0.5, 0.5,
      0.5, 0.5, 1.406, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.888, 0.5, 0.5,
      0.5, 0.5, 0.5, 0.5, 0.5, 2.053, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.518,
      0.5, 0.5, 0.5,
    ],
    tower2: [
      2.559, 0.5, 2.633, 0.5, 2.623, 0.5, 2.557, 0.5, 2.244, 0.5, 2.279, 0.5,
      2.256, 0.5, 2.166, 0.5, 0.5, 0.5, 0.5, 2.307, 0.5, 2.291, 0.5, 2.164, 0.5,
      2.451, 0.5, 2.561, 0.5, 2.539, 0.5, 2.303, 0.5, 1.404, 0.5, 2.32, 0.5,
      2.131, 0.5, 2.141, 2.615, 0.5, 2.225, 0.5, 2.434, 0.5, 0.5,
    ],
    tower3: [
      3.457, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 3.486, 0.5, 0.5, 0.5,
      0.5, 0.5, 0.5, 0.5, 2.008, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
      3.764, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 2.457, 0.5, 0.5, 0.5, 0.5, 0.5,
      0.5, 0.5, 1.231, 0.5, 0.5, 0.5, 0.5,
    ],
  };

  // Helper function to generate chart data
  const generateData = (primaryData, chart) => {
    const data = [];
    let date = new Date(2024, 9, 2, 0, 0); // Starting date: Oct 2, 2024
    for (let i = 0; i < primaryData.length; i++) {
      data.push({
        date: new Date(date.getTime()),
        primaryValue: primaryData[i],
      });
      date.setHours(date.getHours() + 1);
    }
    chart.data = data;
  };

  // Initialize chart on mount
  useEffect(() => {
    let chart = am4core.create("chartdivCWS", am4charts.XYChart);
    chartRef.current = chart;

    if (chart.logo) {
      chart.logo.disabled = true;
    }
    chart.padding(17, 17, 17, 17);

    // X Axis
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.baseInterval = { timeUnit: "hour", count: 1 };
    dateAxis.renderer.labels.template.fontSize = 14;
    dateAxis.renderer.labels.template.fill = am4core.color("#666666");
    dateAxis.renderer.grid.template.stroke = am4core.color("#666666");
    dateAxis.renderer.ticks.template.stroke = am4core.color("#666666");
    dateAxis.renderer.axisFills.template.fill = am4core.color("#666666");
    dateAxis.renderer.line.stroke = am4core.color("#666666");

    // Primary Y Axis
    var valueAxisPrimary = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisPrimary.title.text = "Vibration Analysis";
    valueAxisPrimary.title.fontSize = 14;
    valueAxisPrimary.title.fill = am4core.color("#666666");
    valueAxisPrimary.renderer.labels.template.fontSize = 14;
    valueAxisPrimary.renderer.labels.template.fill = am4core.color("#666666");
    valueAxisPrimary.renderer.grid.template.stroke = am4core.color("#666666");
    valueAxisPrimary.renderer.ticks.template.stroke = am4core.color("#666666");
    valueAxisPrimary.renderer.axisFills.template.fill =
      am4core.color("#666666");
    valueAxisPrimary.renderer.line.stroke = am4core.color("#666666");

    // Line Series
    var seriesPrimary = chart.series.push(new am4charts.LineSeries());
    seriesPrimary.dataFields.dateX = "date";
    seriesPrimary.dataFields.valueY = "primaryValue";
    seriesPrimary.name = "Vibration Analysis";
    seriesPrimary.tooltipText = "Vibration: {valueY} mm/s";
    seriesPrimary.stroke = am4core.color("#FCC60D");
    seriesPrimary.strokeWidth = 3;

    chart.cursor = new am4charts.XYCursor();

    // Load initial data
    generateData(towerData[selectedTower], chart);

    return () => {
      chart.dispose();
    };
  }, []);

  // Update chart data when tower selection changes
  useEffect(() => {
    if (chartRef.current) {
      generateData(towerData[selectedTower], chartRef.current);
    }
  }, [selectedTower]);

  return;
};

const ChartPO2 = ({ selectedTower }) => {
  const chartRef = useRef(null);

  const towerData = {
    tower1: {
      PumpAmpere: [
        350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 351,
        352, 353, 352, 353, 353, 352, 351, 353, 352, 352, 346, 346, 346, 346,
        346, 350, 350, 350, 350, 350, 350, 350, 350, 350, 351, 352, 353, 353,
        352, 354, 353, 351, 352, 354,
      ],
      PO2: [
        224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 226,
        227, 228, 226, 226, 226, 225, 226, 225, 226, 226, 217, 217, 217, 217,
        217, 224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 226, 227, 228,
        226, 226, 226, 225, 226, 225, 226,
      ],
    },
    tower2: {
      PumpAmpere: [
        350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 351,
        352, 353, 352, 353, 353, 352, 351, 353, 352, 352, 346, 346, 346, 346,
        346, 350, 350, 350, 350, 350, 350, 350, 350, 350, 351, 352, 353, 353,
        352, 354, 353, 351, 352, 354,
      ],
      PO2: [
        224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 226,
        227, 228, 226, 226, 226, 225, 226, 225, 226, 226, 217, 217, 217, 217,
        217, 224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 226, 227, 228,
        226, 226, 226, 225, 226, 225, 226,
      ],
    },
    tower3: {
      PumpAmpere: [
        350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 351,
        352, 353, 352, 353, 353, 352, 351, 353, 352, 352, 346, 346, 346, 346,
        346, 350, 350, 350, 350, 350, 350, 350, 350, 350, 351, 352, 353, 353,
        352, 354, 353, 351, 352, 354,
      ],
      PO2: [
        224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 226,
        227, 228, 226, 226, 226, 225, 226, 225, 226, 226, 217, 217, 217, 217,
        217, 224, 224, 224, 224, 224, 224, 224, 224, 224, 224, 226, 227, 228,
        226, 226, 226, 225, 226, 225, 226,
      ],
    },
  };
  useEffect(() => {
    if (!towerData[selectedTower]) {
      console.error("Invalid tower selection:", selectedTower);
      return;
    }

    let chart = am4core.create("chartdivCooling", am4charts.XYChart);

    let tower = towerData[selectedTower] || towerData["tower1"]; // Fallback to tower1 if undefined
    let data = tower.PumpAmpere.map((temp, index) => ({
      time: index,
      pumpampere: tower.PumpAmpere[index] ?? 0,

      po2: tower.PO2[index] ?? 0,
    }));

    chart.data = data;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "time";

    let valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis1.title.text = "Pump Ampere";
    valueAxis1.title.fontSize = 14;
    valueAxis1.title.fill = am4core.color("#666666");
    valueAxis1.renderer.labels.template.fontSize = 14;
    valueAxis1.renderer.labels.template.fill = am4core.color("#666666");
    valueAxis1.renderer.grid.template.stroke = am4core.color("#666666");
    valueAxis1.renderer.ticks.template.stroke = am4core.color("#666666");
    valueAxis1.renderer.axisFills.template.fill = am4core.color("#666666");
    valueAxis1.renderer.line.stroke = am4core.color("#666666");
    valueAxis1.renderer.minLabelPosition = 0;
    valueAxis1.renderer.maxLabelPosition = 0.9;

    let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.title.text = "PO2";
    valueAxis2.renderer.opposite = true;
    valueAxis2.title.fontSize = 14;
    valueAxis2.renderer.grid.template.disabled = true;
    valueAxis2.title.fill = am4core.color("#666666");
    valueAxis2.renderer.labels.template.fontSize = 14;
    valueAxis2.renderer.labels.template.fill = am4core.color("#666666");
    valueAxis2.renderer.grid.template.stroke = am4core.color("#666666");
    valueAxis2.renderer.ticks.template.stroke = am4core.color("#666666");
    valueAxis2.renderer.axisFills.template.fill = am4core.color("#666666");
    valueAxis2.renderer.line.stroke = am4core.color("#666666");
    valueAxis2.min = 0;
    valueAxis2.max = 100;
    valueAxis2.strictMinMax = true;

    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "pumpampere";
    series1.dataFields.categoryX = "time";
    series1.name = "PumpAmpere";
    series1.tooltipText = "{name}: {valueY}%";
    series1.fill = am4core.color("#F57F62");
    series1.stroke = am4core.color("#F57F62");
    series1.strokeWidth = 3;

    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = "po2";
    series3.dataFields.categoryX = "time";
    series3.name = "PO2";
    series3.tooltipText = "{name}: {valueY}%";
    series3.fill = am4core.color("#4682B4");
    series3.stroke = am4core.color("#4682B4");
    series3.strokeWidth = 3;

    chart.cursor = new am4charts.XYCursor();

    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 5; // Adjust size
    chart.legend.labels.template.maxWidth = 100; // Prevents text overflow
    chart.legend.labels.template.truncate = true; // Truncate long names
    chart.legend.itemContainers.template.paddingTop = 2;
    chart.legend.itemContainers.template.paddingBottom = 2;
    chart.legend.position = "bottom";
    chart.legend.labels._template.fill = am4core.color("#666666");
    chart.legend.marginTop = 0;
    chart.legend.fontSize = 12;
    chart.legend.itemContainers.template.width = 110;
    chart.legend.itemContainers.template.height = 18;
    chart.legend.markers.template.width = 10;
    chart.legend.markers.template.height = 10;
    chart.legend.labels.template.wrap = true;
    chart.legend.labels.template.truncate = true;
    chart.legend.labels.template.maxWidth = 140;

    chart.logo.disabled = true;

    chart.cursor = new am4charts.XYCursor();
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.minHeight = 15;
    // chart.scrollbarX.series.push(series)
    // Style scrollbar
    function customizeGrip(grip) {
      // Remove default grip image
      grip.icon.disabled = true;

      // Disable background
      grip.background.disabled = true;

      // Add rotated rectangle as bi-di arrow
      var img = grip.createChild(am4core.Rectangle);
      img.width = 6;
      img.height = 6;
      img.fill = am4core.color("#999");
      img.rotation = 45;
      img.align = "center";
      img.valign = "middle";

      // Add vertical bar
      var line = grip.createChild(am4core.Rectangle);
      line.height = 15;
      line.width = 2;
      line.fill = am4core.color("#999");
      line.align = "center";
      line.valign = "middle";
    }

    return () => {
      chart.dispose();
    };
  }, [selectedTower]);

  return;
};

const DashboardPage = () => {
  const [selectedTower, setSelectedTower] = useState("tower1");

  const handleTowerChange = (event) => {
    setSelectedTower(event.target.value);
  };
  const [dateRange1, setDateRange1] = useState([null, null]);
  const [showCalendar1, setShowCalendar1] = useState(false);
  const [isExpanded1, setIsExpanded1] = useState(false);
  const [startDate1, endDate1] = dateRange1;
  const calendarRef1 = useRef(null);

  // Card 3: COOLING CAPACITY
  const [dateRange3, setDateRange3] = useState([null, null]);
  const [showCalendar3, setShowCalendar3] = useState(false);
  const [isExpanded3, setIsExpanded3] = useState(false);
  const [startDate3, endDate3] = dateRange3;
  const calendarRef3 = useRef(null);

  return (
    <div className="flex flex-col p-2 w-full bg-white dark:bg-gray-800 rounded-lg border-t-3 border-[#1f5897] h-max xl:h-[81vh] 2xl:h-[81vh] gap-3 overflow-y-auto">
      <div className="pr-0 sm:pr-4 text-[#626469] w-full max-w-full">
        {/* Cooling Tower Selector at the top */}
        <CoolingTowerSelector
          onTowerChange={handleTowerChange}
          selectedTower={selectedTower}
        />
        <ChartCoolingCapacity selectedTower={selectedTower} />
        <ChartPO2 selectedTower={selectedTower} />

        {/* Responsive Grid containing 2 cards */}
        <div className="grid grid-cols-1 gap-2 gap-y-3 w-full items-stretch justify-between">
          {/* Card 1: VIBRATION ANALYSIS */}
          <div
            className={
              isExpanded1
                ? "fixed inset-0 z-50 sm:p-4 flex flex-col w-full  border-2 border-gray-400 border-t-4 border-t-[#1d5999] rounded-md transition-all bg-white dark:bg-gray-900 mt-0"
                : "relative h-[55vh] md:h-[35vh] p-2 dark:bg-gray-900 flex flex-col border-2 border-gray-400 border-t-4 border-t-[#1d5999] rounded-md transition-all bg-white  mt-0"
            }>
            <div className=" flex flex-wrap items-center justify-between p-2 border-b border-gray-300 bg-white dark:bg-gray-700 rounded-t-md">
              <h2 className="font-bold text-xs sm:text-sm md:text-base dark:text-white">
                VIBRATION ANALYSIS
              </h2>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm text-gray-700 dark:text-white mr-2 mt-[1px]">
                  {formatRange(startDate1, endDate1)}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowCalendar1(!showCalendar1)}
                    className="relative z-20">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-600 dark:text-white" />
                  </button>
                  {showCalendar1 && (
                    <div
                      ref={calendarRef1}
                      className="absolute top-full left-[-240px] mt-2 bg-white p-2 rounded shadow z-30">
                      <DatePicker
                        selectsRange
                        startDate={startDate1}
                        endDate={endDate1}
                        onChange={(update) => setDateRange1(update)}
                        isClearable
                        inline
                      />
                    </div>
                  )}
                </div>
                <button onClick={() => setIsExpanded1(!isExpanded1)}>
                  <ArrowsPointingOutIcon className="w-5 h-5 text-gray-600 dark:text-white ml-2 mt-[-2px]" />
                </button>
              </div>
            </div>
            <div
              id="chartdivCWS"
              className="w-full flex-1 h-[45vh] md:h-[25vh]"
              style={{ transition: "height 0.3s ease" }}></div>
          </div>

          {/* Card 2: PO2 */}
          <div
            className={
              isExpanded3
                ? "fixed inset-0 z-50 sm:p-4 flex flex-col w-full  border-2 border-gray-400 border-t-4 border-t-[#1d5999] rounded-md transition-all bg-white dark:bg-gray-900 mt-0"
                : "relative h-[55vh] md:h-[35vh] p-2 dark:bg-gray-900 flex flex-col border-2 border-gray-400 border-t-4 border-t-[#1d5999] rounded-md transition-all bg-white  mt-0"
            }>
            <div className=" flex flex-wrap items-center justify-between p-2 border-b border-gray-300 bg-white dark:bg-gray-800 rounded-t-md">
              <h2 className="font-bold text-xs sm:text-sm md:text-base dark:text-white">
                PO2
              </h2>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm text-gray-700 dark:text-white mr-2 mt-[1px]">
                  {formatRange(startDate3, endDate3)}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowCalendar3(!showCalendar3)}
                    className="relative z-20">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-600 dark:text-white" />
                  </button>
                  {showCalendar3 && (
                    <div
                      ref={calendarRef3}
                      className="absolute top-full left-[-240px] mt-2 bg-white p-2 rounded shadow z-30">
                      <DatePicker
                        selectsRange
                        startDate={startDate3}
                        endDate={endDate3}
                        onChange={(update) => setDateRange3(update)}
                        isClearable
                        inline
                      />
                    </div>
                  )}
                </div>
                <button onClick={() => setIsExpanded3(!isExpanded3)}>
                  <ArrowsPointingOutIcon className="w-5 h-5 text-gray-600 dark:text-white ml-2 mt-[-2px]" />
                </button>
              </div>
            </div>
            <div
              id="chartdivCooling"
              className="w-full flex-1 h-[45vh] md:h-[25vh]"
              style={{ transition: "height 0.3s ease" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
