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

// Cooling Tower Selector Component
const FanSpeed = ({ selectedTower }) => {
  const chartRef = useRef(null);

  const towerData = {
    tower1: {
      FanSpeed: [
        28, 28, 31, 35, 37, 38, 39, 39, 36, 37, 38, 37, 38, 37, 37, 36, 29, 29,
        29, 27, 27, 27, 26, 26, 28, 28, 31, 35, 25, 25, 28, 30, 32, 35, 34, 36,
        36, 36, 36, 36, 36, 36, 35, 33, 32, 31, 32, 31,
      ],
      FanAmpere: [
        45, 45, 50, 56, 60, 61, 63, 62, 58, 60, 61, 60, 61, 60, 59, 58, 46, 46,
        46, 44, 43, 43, 42, 42, 45, 45, 45, 50, 56, 40, 45, 48, 52, 56, 55, 57,
        58, 58, 57, 58, 57, 57, 56, 53, 51, 50, 51, 50,
      ],
    },
    tower2: {
      FanSpeed: [
        860, 885, 1010, 1085, 1310, 1316, 1350, 1342, 1302, 1310, 1320, 1310,
        1305, 1310, 1312, 1301, 860, 858, 860, 778, 731, 731, 702, 710, 950,
        950, 950, 1000, 1008, 900, 950, 988, 1018, 1227, 1227, 1285, 1300, 1325,
        1271, 1277, 1255, 1246, 1208, 1185, 1052, 1077, 1075, 1052,
      ],
      FanAmpere: [
        36, 36, 37, 36, 37, 37, 36, 36, 36, 36, 37, 36, 37, 37, 38, 37, 36, 36,
        36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 37, 37, 36, 37, 36, 36, 37,
        36, 37, 36, 38, 37, 36, 36, 36, 36, 36, 36, 36,
      ],
    },
    tower3: {
      FanSpeed: [
        1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1210,
        1205, 1199, 1195, 1200, 1195, 1200, 1199, 1200, 1200, 1200, 1200, 1195,
        1196, 1196, 1196, 1196, 1196, 1200, 1200, 1200, 1200, 1200, 1200, 1200,
        1210, 1205, 1199, 1195, 1200, 1202, 1200, 1202, 1202, 1202, 1202, 1202,
      ],
      FanAmpere: [
        75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 74, 73, 74, 72, 71, 72, 75, 72,
        70, 69, 68, 67, 67, 68, 75, 75, 75, 75, 75, 74, 74, 75, 75, 75, 75, 74,
        62, 59, 58, 55, 54, 53, 51, 51, 50, 50, 50, 50,
      ],
    },
  };
  useEffect(() => {
    if (!towerData[selectedTower]) {
      console.error("Invalid tower selection:", selectedTower);
      return;
    }

    let chart = am4core.create("chartdivCWS", am4charts.XYChart);

    let tower = towerData[selectedTower] || towerData["tower1"]; // Fallback to tower1 if undefined
    let data = tower.FanSpeed.map((temp, index) => ({
      time: index,
      fanspeed: tower.FanSpeed[index] ?? 0,

      fanampere: tower.FanAmpere[index] ?? 0,
    }));

    chart.data = data;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "time";

    let valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis1.title.text = "Fan Ampere";
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
    valueAxis2.title.text = "Fan Speed";
    valueAxis2.renderer.opposite = true;
    valueAxis2.title.fill = am4core.color("#666666");
    valueAxis2.renderer.grid.template.disabled = true;
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
    series1.dataFields.valueY = "fanspeed";
    series1.dataFields.categoryX = "time";
    series1.name = "Fan Speed";
    series1.tooltipText = "{name}: {valueY}%";
    series1.fill = am4core.color("#219ebc");
    series1.stroke = am4core.color("#219ebc");
    series1.strokeWidth = 3;

    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = "fanampere";
    series3.dataFields.categoryX = "time";
    series3.name = "Fan Ampere";
    series3.tooltipText = "{name}: {valueY}%";
    series3.fill = am4core.color("#feb703");
    series3.stroke = am4core.color("#feb703");
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
const ChartPO2 = ({ selectedTower }) => {
  const chartRef = useRef(null);

  const towerData = {
    tower1: {
      AmbientAirTemperature: [
        27, 28, 30, 32, 34, 34.5, 35, 35.5, 36, 35.5, 34, 33, 32.5, 32, 31.5,
        30.5, 29.5, 27, 27, 26.5, 26.5, 26.5, 26.5, 26, 25, 27, 28, 29, 30, 33,
        34, 34.5, 35, 36.5, 34.5, 33, 32.5, 32, 30.5, 29, 29, 28.5, 30, 26.5,
        26, 25, 25, 25,
      ],
      WetBulbTemperature: [
        25, 26, 27, 27.5, 28, 28, 28, 28, 27.5, 27.5, 28, 28, 27.5, 27, 26.5,
        26, 26, 25, 25, 25, 25, 25, 25, 25, 23.5, 25.5, 26, 26, 27, 26, 26, 2.6,
        26.5, 27, 27, 27, 26.5, 26, 26, 26, 26, 25.5, 25.5, 24.5, 24.5, 24,
        23.5, 23.5,
      ],
      DeltaBetweenTemperature: [
        2, 2, 3, 4.5, 6, 6.5, 7, 7, 8.5, 8, 6, 5.5, 4.5, 5, 5, 4.5, 4.5, 2, 2,
        1.5, 1.5, 1.5, 1.5, 1, 1.5, 1.5, 2, 3, 3, 7, 8, 8, 8.5, 9.5, 7.5, 6, 6,
        6, 4.5, 3, 3, 3, 4.5, 2, 1.5, 1, 1.5, 1.5,
      ],
    },
    tower2: {
      AmbientAirTemperature: [
        27, 28, 30, 32, 34, 34.5, 35, 35.5, 36, 35.5, 34, 33, 32.5, 32, 31.5,
        30.5, 29.5, 27, 27, 26.5, 26.5, 26.5, 26.5, 26, 25, 27, 28, 29, 30, 33,
        34, 34.5, 35, 36.5, 34.5, 33, 32.5, 32, 30.5, 29, 29, 28.5, 30, 26.5,
        26, 25, 25, 25,
      ],
      WetBulbTemperature: [
        25, 26, 27, 27.5, 28, 28, 28, 28, 27.5, 27.5, 28, 28, 27.5, 27, 26.5,
        26, 26, 25, 25, 25, 25, 25, 25, 25, 23.5, 25.5, 26, 26, 27, 26, 26, 2.6,
        26.5, 27, 27, 27, 26.5, 26, 26, 26, 26, 25.5, 25.5, 24.5, 24.5, 24,
        23.5, 23.5,
      ],
      DeltaBetweenTemperature: [
        2, 2, 3, 4.5, 6, 6.5, 7, 7, 8.5, 8, 6, 5.5, 4.5, 5, 5, 4.5, 4.5, 2, 2,
        1.5, 1.5, 1.5, 1.5, 1, 1.5, 1.5, 2, 3, 3, 7, 8, 8, 8.5, 9.5, 7.5, 6, 6,
        6, 4.5, 3, 3, 3, 4.5, 2, 1.5, 1, 1.5, 1.5,
      ],
    },
    tower3: {
      AmbientAirTemperature: [
        27, 28, 30, 32, 34, 34.5, 35, 35.5, 36, 35.5, 34, 33, 32.5, 32, 31.5,
        30.5, 29.5, 27, 27, 26.5, 26.5, 26.5, 26.5, 26, 25, 27, 28, 29, 30, 33,
        34, 34.5, 35, 36.5, 34.5, 33, 32.5, 32, 30.5, 29, 29, 28.5, 30, 26.5,
        26, 25, 25, 25,
      ],
      WetBulbTemperature: [
        25, 26, 27, 27.5, 28, 28, 28, 28, 27.5, 27.5, 28, 28, 27.5, 27, 26.5,
        26, 26, 25, 25, 25, 25, 25, 25, 25, 25.5, 26, 26, 27, 26, 26, 26, 26,
        26.5, 26.5, 27, 27, 27, 26.5, 26, 26, 26, 25.5, 25.5, 24.5, 24.5, 24,
        23.5, 23.5,
      ],
      DeltaBetweenTemperature: [
        2, 2, 3, 4.5, 6, 6.5, 7, 7, 8.5, 8, 6, 5, 5, 5, 5, 4.5, 3.5, 2, 2, 1.5,
        1.5, 1.5, 1.5, 1, 0, 1.5, 2, 3, 3, 7, 8, 8, 8.5, 8, 9.5, 7, 7, 6.5, 5,
        4.5, 3, 3, 3, 4.5, 2, 1.5, 1, 1.5, 1.5,
      ],
    },
  };

  useEffect(() => {
    if (!towerData[selectedTower]) {
      console.error("Invalid tower selection:", selectedTower);
      return;
    }

    let chart = am4core.create("chartdivPO2", am4charts.XYChart);

    let tower = towerData[selectedTower] || towerData["tower1"]; // Fallback to tower1 if undefined
    let data = tower.AmbientAirTemperature.map((temp, index) => ({
      time: index,
      ambientairtemperature: tower.AmbientAirTemperature[index] ?? 0,

      deltabetweentemperature: tower.DeltaBetweenTemperature[index] ?? 0,
      wetBulbTemp: tower.WetBulbTemperature?.[index] ?? 0, // Avoids undefined errors
    }));

    chart.data = data;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "time";

    let valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis1.title.text = "Temperatures";
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
    valueAxis2.title.text = "Delta Between Temperature";
    valueAxis2.renderer.opposite = true;
    valueAxis2.title.fill = am4core.color("#666666");
    valueAxis2.renderer.grid.template.disabled = true;
    valueAxis2.renderer.labels.template.fontSize = 14;
    valueAxis2.renderer.labels.template.fill = am4core.color("#666666");
    valueAxis2.renderer.grid.template.stroke = am4core.color("#666666");
    valueAxis2.renderer.ticks.template.stroke = am4core.color("#666666");
    valueAxis2.renderer.axisFills.template.fill = am4core.color("#666666");
    valueAxis2.renderer.line.stroke = am4core.color("#666666");
    valueAxis2.min = 0;
    valueAxis2.max = 100;
    valueAxis2.strictMinMax = true;

    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.dataFields.valueY = "ambientairtemperature";
    series1.dataFields.categoryX = "time";
    series1.name = "Ambient Air Temperature";
    series1.tooltipText = "{name}: {valueY}°C";

    series1.fill = am4core.color("#219ebc");
    series1.stroke = am4core.color("#219ebc");

    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = "deltabetweentemperature";
    series3.dataFields.categoryX = "time";
    series3.name = "Delta Between Temperature";
    series3.tooltipText = "{name}: {valueY}%";
    series3.fill = am4core.color("#feb703");
    series3.stroke = am4core.color("#feb703");

    let series4 = chart.series.push(new am4charts.ColumnSeries());
    series4.dataFields.valueY = "wetBulbTemp";
    series4.dataFields.categoryX = "time";
    series4.name = "Wet Bulb Temperature";
    series4.tooltipText = "{name}: {valueY}°C";
    series4.fill = am4core.color("#8f8f8f");

    series4.stroke = am4core.color("#8f8f8f");

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

const ChartCoolingCapacity = ({ selectedTower }) => {
  const chartRef = useRef(null);

  // Tower data arrays
  const towerData2 = {
    tower1: [
      765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765,
      765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765,
      765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765,
      765, 765, 765,
    ],
    tower2: [
      765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765,
      765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765,
      765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765,
      765, 765, 765,
    ],
    tower3: [
      765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765,
      765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765,
      765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765, 765,
      765, 765, 765,
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
    let chart = am4core.create("chartdivCooling", am4charts.XYChart);
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

    // Primary Y Axis
    var valueAxisPrimary = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisPrimary.title.text = "Return Water Flow";
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
    seriesPrimary.name = "Return Water Flow";
    seriesPrimary.tooltipText = "Vibration: {valueY} mm/s";
    seriesPrimary.stroke = am4core.color("#023047");
    seriesPrimary.strokeWidth = 3;

    chart.cursor = new am4charts.XYCursor();

    // Load initial data
    generateData(towerData2[selectedTower], chart);

    return () => {
      chart.dispose();
    };
  }, []);

  // Update chart data when tower selection changes
  useEffect(() => {
    if (chartRef.current) {
      generateData(towerData2[selectedTower], chartRef.current);
    }
  }, [selectedTower]);

  return;
};

const ReturnWaterFlow = ({ selectedTower }) => {
  const chartRef = useRef(null);

  const towerData = {
    tower1: {
      CoolingWaterSupplyTemperature: [
        34, 33.5, 33.5, 33.5, 33.5, 33.5, 33.5, 33.5, 32.5, 32, 31.5, 31, 30.5,
        30.5, 30, 30, 33, 33.5, 33.5, 33.5, 33.5, 33, 33, 33, 32.7, 32.5, 33.3,
        32.9, 32.6, 33.5, 33.5, 32.2, 32.4, 32.4, 32.5, 32.2, 32.1, 32, 32,
        31.6, 31.9, 31.9, 31.8, 31.8, 31.7, 31.9, 31.8, 32,
      ],
      CoolingWaterReturnTemperature: [
        37.2, 38.1, 38.6, 39, 36.7, 36.9, 38, 38.2, 38, 37.2, 36.9, 37, 38.2,
        37.4, 36.1, 37.1, 36.9, 37.7, 37.2, 36.8, 35.9, 36.8, 37.4, 37.6, 37.4,
        37.1, 38.2, 37.1, 35.9, 37.4, 35.8, 36.8, 37.2, 37.1, 37.8, 37.6, 37.2,
        37.1, 37.6, 36.5, 36.1, 37.3, 36.4, 37, 36.7, 36.5, 36.9, 37.4,
      ],
      FanPowerConsumption: [
        28, 28, 31, 35, 37, 38, 39, 39, 36, 37, 38, 37, 38, 37, 37, 36, 29, 29,
        29, 27, 27, 27, 26, 26, 28, 28, 31, 35, 25, 25, 28, 30, 32, 35, 34, 36,
        36, 36, 36, 36, 36, 36, 35, 33, 32, 31, 32, 31,
      ],
    },
    tower2: {
      CoolingWaterSupplyTemperature: [
        33.5, 34, 34, 35, 35, 35, 35, 35, 34, 33, 32.5, 32, 31.5, 31.5, 31,
        30.5, 33, 33.5, 33.5, 33, 33.5, 33.5, 33.5, 33.5, 31.9, 32.3, 32.5,
        32.5, 31.9, 34, 34, 31.2, 31.2, 32, 32.9, 32.3, 31.3, 32, 31.7, 31.8,
        31.9, 31.2, 32, 31.6, 31.6, 31.7, 32.2, 31.9,
      ],
      CoolingWaterReturnTemperature: [
        37.2, 38.1, 38.6, 39, 36.7, 36.9, 38, 38.2, 38, 37.2, 36.9, 37, 38.2,
        37.4, 36.1, 37.1, 36.9, 37.7, 37.2, 36.8, 35.9, 36.8, 37.4, 37.6, 37.4,
        37.1, 38.2, 37.1, 35.9, 37.4, 35.8, 36.8, 37.2, 37.1, 37.8, 37.6, 37.2,
        37.1, 37.6, 36.5, 36.1, 37.3, 36.4, 37, 36.7, 36.5, 36.9, 37.4,
      ],
      FanPowerConsumption: [
        36, 36, 37, 36, 37, 37, 36, 36, 36, 36, 37, 36, 37, 37, 38, 37, 36, 36,
        36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 37, 37, 36, 37, 36, 36, 37,
        36, 37, 36, 38, 37, 36, 36, 36, 36, 36, 36, 36,
      ],
    },
    tower3: {
      CoolingWaterSupplyTemperature: [
        30, 30.5, 31, 31, 31, 31, 31, 31, 31, 31, 30, 30, 30, 31, 30, 30, 30,
        30, 30, 30, 30, 30, 30, 30, 30, 30.2, 31, 30.9, 30.8, 30.5, 30.5, 30.9,
        30.1, 29.6, 30.2, 30.3, 30.8, 30.4, 30.4, 30.5, 30.6, 30.3, 31.2, 30.5,
        31, 30.7, 31.1, 30.8,
      ],
      CoolingWaterReturnTemperature: [
        37.2, 38.1, 38.6, 39, 36.7, 36.9, 38, 38.2, 38, 37.2, 36.9, 37, 38.2,
        37.4, 36.1, 37.1, 36.9, 37.7, 37.2, 36.8, 35.9, 36.8, 37.4, 37.6, 37.4,
        37.1, 38.2, 37.1, 35.9, 37.4, 35.8, 36.8, 37.2, 37.1, 37.8, 37.6, 37.2,
        37.1, 37.6, 36.5, 36.1, 37.3, 36.4, 37, 36.7, 36.5, 36.9, 37.4,
      ],
      FanPowerConsumption: [
        47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 46, 46, 46, 45, 44, 45, 47, 45,
        44, 43, 42, 42, 42, 42, 47, 47, 47, 47, 47, 46, 46, 47, 47, 47, 47, 46,
        39, 37, 36, 34, 34, 33, 32, 32, 31, 31, 31, 31,
      ],
    },
  };

  useEffect(() => {
    if (!towerData[selectedTower]) {
      console.error("Invalid tower selection:", selectedTower);
      return;
    }

    let chart = am4core.create("chartdivRTF", am4charts.XYChart);

    let tower = towerData[selectedTower] || towerData["tower1"]; // Fallback to tower1 if undefined
    let data = tower.CoolingWaterSupplyTemperature.map((temp, index) => ({
      time: index,
      coolingwatersupplytemperature:
        tower.CoolingWaterSupplyTemperature[index] ?? 0,

      coolingwaterreturntemperature:
        tower.CoolingWaterReturnTemperature[index] ?? 0,
      fanpowerconsumption: tower.FanPowerConsumption?.[index] ?? 0, // Avoids undefined errors
    }));

    chart.data = data;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "time";

    let valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis1.title.text = "Temperatures";
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
    valueAxis2.title.text = "Fan Power Consumption";
    valueAxis2.renderer.opposite = true;
    valueAxis2.title.fill = am4core.color("#666666");
    valueAxis2.renderer.grid.template.disabled = true;
    valueAxis2.renderer.labels.template.fontSize = 14;
    valueAxis2.renderer.labels.template.fill = am4core.color("#666666");
    valueAxis2.renderer.grid.template.stroke = am4core.color("#666666");
    valueAxis2.renderer.ticks.template.stroke = am4core.color("#666666");
    valueAxis2.renderer.axisFills.template.fill = am4core.color("#666666");
    valueAxis2.renderer.line.stroke = am4core.color("#666666");
    valueAxis2.min = 0;
    valueAxis2.max = 100;
    valueAxis2.strictMinMax = true;

    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.dataFields.valueY = "coolingwatersupplytemperature";
    series1.dataFields.categoryX = "time";
    series1.name = "CoolingWaterSupplyTemperature";
    series1.tooltipText = "{name}: {valueY}°C";

    series1.fill = am4core.color("#219ebc");
    series1.stroke = am4core.color("#219ebc");

    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = "fanpowerconsumption";
    series3.dataFields.categoryX = "time";
    series3.name = "FanPowerConsumption";
    series3.tooltipText = "{name}: {valueY}%";
    series3.fill = am4core.color("#feb703");
    series3.stroke = am4core.color("#feb703");

    let series4 = chart.series.push(new am4charts.ColumnSeries());
    series4.dataFields.valueY = "coolingwaterreturntemperature";
    series4.dataFields.categoryX = "time";
    series4.name = "CoolingWaterReturnTemperature";
    series4.tooltipText = "{name}: {valueY}°C";
    series4.fill = am4core.color("#8f8f8f");

    series4.stroke = am4core.color("#8f8f8f");

    chart.cursor = new am4charts.XYCursor();

    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 5; // Adjust size
    chart.legend.labels.template.maxWidth = 100; // Prevents text overflow
    chart.legend.labels.template.truncate = true; // Truncate long names
    chart.legend.itemContainers.template.paddingTop = 2;
    chart.legend.itemContainers.template.paddingBottom = 2;
    chart.legend.position = "bottom";
    chart.legend.marginTop = 0;
    chart.legend.labels._template.fill = am4core.color("#666666");
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

  const [dateRange2, setDateRange2] = useState([null, null]);
  const [showCalendar2, setShowCalendar2] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const [startDate2, endDate2] = dateRange2;
  const calendarRef2 = useRef(null);

  const [dateRange3, setDateRange3] = useState([null, null]);
  const [showCalendar3, setShowCalendar3] = useState(false);
  const [isExpanded3, setIsExpanded3] = useState(false);
  const [startDate3, endDate3] = dateRange3;
  const calendarRef3 = useRef(null);

  const [dateRange4, setDateRange4] = useState([null, null]);
  const [showCalendar4, setShowCalendar4] = useState(false);
  const [isExpanded4, setIsExpanded4] = useState(false);
  const [startDate4, endDate4] = dateRange4;
  const calendarRef4 = useRef(null);

  return (
    <div className="flex flex-col p-2 w-full bg-white dark:bg-gray-800 rounded-lg border-t-3 border-[#1f5897] h-max xl:h-[81vh] 2xl:h-[81vh] gap-3 overflow-y-auto">
      <div className="pr-0 sm:pr-4 text-[#626469] w-full max-w-full">
        {/* Cooling Tower Selector at the top */}
        <div>
          <CoolingTowerSelector
            onTowerChange={handleTowerChange}
            selectedTower={selectedTower}
          />
        </div>
        <FanSpeed selectedTower={selectedTower} />
        <ChartPO2 selectedTower={selectedTower} />
        <ChartCoolingCapacity selectedTower={selectedTower} />
        <ReturnWaterFlow selectedTower={selectedTower} />

        {/* Responsive Grid containing 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 gap-y-3 w-full items-stretch justify-between">
          {/* Card 1: FAN SPEED */}
          <div
            className={
              isExpanded1
                ? "fixed inset-0 z-50 sm:p-4 dark:bg-gray-900 flex flex-col border-2 border-gray-400 border-t-4 border-t-[#1d5999] rounded-md transition-all bg-white mb-2 mt-2"
                : "relative h-[55vh] md:h-[35vh] p-2 dark:bg-gray-900 flex flex-col border-2 border-gray-400 border-t-4 border-t-[#1d5999] rounded-md transition-all bg-white mb-2 mt-2"
            }>
            <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between p-2 border-b border-gray-300 bg-white dark:bg-gray-800 rounded-t-md">
              <h2 className="font-bold text-xs sm:text-sm md:text-base dark:text-white">
                FAN SPEED
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
              className="w-full flex-1 h-[55vh] md:h-[35vh]"
              style={{ transition: "height 0.3s ease" }}></div>
          </div>

          {/* Card 2: DELTA B/W TEMPERATURES */}
          <div
            className={
              isExpanded2
                ? "fixed inset-0 z-50 sm:p-4 flex flex-col border-2 border-gray-400 border-t-4 border-t-[#1d5999] rounded-md transition-all bg-white dark:bg-gray-900 mb-2 mt-2"
                : "relative h-[55vh] md:h-[35vh] p-2 dark:bg-gray-900 flex flex-col border-2 border-gray-400 border-t-4 border-t-[#1d5999] rounded-md transition-all bg-white mb-2 mt-2"
            }>
            <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between p-2 border-b border-gray-300 bg-white dark:bg-gray-800 rounded-t-md">
              <h2 className="font-bold text-xs sm:text-sm md:text-base dark:text-white">
                DELTA B/W TEMPERATURES
              </h2>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm text-gray-700 dark:text-white mr-2 mt-[1px]">
                  {formatRange(startDate2, endDate2)}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowCalendar2(!showCalendar2)}
                    className="relative z-20">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-600 dark:text-white" />
                  </button>
                  {showCalendar2 && (
                    <div
                      ref={calendarRef2}
                      className="absolute top-full left-[-240px] mt-2 bg-white p-2 rounded shadow z-30">
                      <DatePicker
                        selectsRange
                        startDate={startDate2}
                        endDate={endDate2}
                        onChange={(update) => setDateRange2(update)}
                        isClearable
                        inline
                      />
                    </div>
                  )}
                </div>
                <button onClick={() => setIsExpanded2(!isExpanded2)}>
                  <ArrowsPointingOutIcon className="w-5 h-5 text-gray-600 dark:text-white ml-2 mt-[-2px]" />
                </button>
              </div>
            </div>
            <div
              id="chartdivPO2"
              className="w-full flex-1 h-[55vh] md:h-[35vh]"
              style={{ transition: "height 0.3s ease" }}></div>
          </div>

          {/* Card 3: RETURN WATER FLOW */}
          <div
            className={
              isExpanded3
                ? "fixed inset-0 z-50 sm:p-4 flex flex-col w-full border-2 border-gray-400 border-t-4 border-t-[#1d5999] rounded-md transition-all bg-white dark:bg-gray-900 mt-0"
                : "relative h-[55vh] md:h-[35vh] p-2 dark:bg-gray-900 flex flex-col border-2 border-gray-400 border-t-4 border-t-[#1d5999] rounded-md transition-all bg-white mt-0"
            }>
            <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between p-2 border-b border-gray-300 bg-white dark:bg-gray-800 rounded-t-md">
              <h2 className="font-bold text-xs sm:text-sm md:text-base dark:text-white">
                RETURN WATER FLOW
              </h2>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm text-gray-700 dark:text-white mr-2 mt-[1px]">
                  {formatRange(startDate3, endDate3)}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowCalendar3(!showCalendar3)}
                    className="relative">
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
              className="w-full flex-1 h-[55vh] md:h-[35vh]"
              style={{ transition: "height 0.3s ease" }}></div>
          </div>

          {/* Card 4: COOLING WATER SUPPLY */}
          <div
            className={
              isExpanded4
                ? "fixed inset-0 z-50 p-2 sm:p-4 dark:bg-gray-900 overflow-auto flex flex-col w-full border-2 border-gray-400 border-t-4 border-t-[#1d5999] rounded-md transition-all bg-white mt-0"
                : "relative h-[55vh] md:h-[35vh] p-2 dark:bg-gray-900 flex flex-col border-2 border-gray-400 border-t-4 border-t-[#1d5999] rounded-md transition-all bg-white mt-0"
            }>
            <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between p-2 border-b border-gray-300 bg-white dark:bg-gray-800 rounded-t-md">
              <h2 className="font-bold text-xs sm:text-sm md:text-base dark:text-white">
                COOLING WATER SUPPLY
              </h2>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm text-gray-700 dark:text-white mr-2 mt-[1px]">
                  {formatRange(startDate4, endDate4)}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowCalendar4(!showCalendar4)}
                    className="relative z-20">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-600 dark:text-white" />
                  </button>
                  {showCalendar4 && (
                    <div
                      ref={calendarRef4}
                      className="absolute top-full left-[-240px] mt-2 bg-white p-2 rounded shadow z-30">
                      <DatePicker
                        selectsRange
                        startDate={startDate4}
                        endDate={endDate4}
                        onChange={(update) => setDateRange4(update)}
                        isClearable
                        inline
                      />
                    </div>
                  )}
                </div>
                <button onClick={() => setIsExpanded4(!isExpanded4)}>
                  <ArrowsPointingOutIcon className="w-5 h-5 text-gray-600 dark:text-white ml-2 mt-[-2px]" />
                </button>
              </div>
            </div>
            <div
              id="chartdivRTF"
              style={{
                width: "100%",
                height: "90%",
                transition: "height 0.3s ease",
              }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
