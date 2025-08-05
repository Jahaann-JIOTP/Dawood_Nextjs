"use client";
import { useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import { MdOutlineFullscreen, MdFullscreenExit } from "react-icons/md";
import config from "@/constant/apiRouteList";

const TimeBasedEnergyComparison = ({ theme }) => {
  const [timeFrame, setTimeFrame] = useState("day");
  const [dataType, setDataType] = useState("import");
  const [meterType, setMeterType] = useState("Wapda");
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState(null);
  const [expand, setExpand] = useState(false);
  const [apiData, setApiData] = useState(null);

  const fetchEnergyComparison = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}/dashboard/dashboard-data3`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            range: timeFrame,
            meterType: meterType,
          }),
        }
      );
      const resResult = await response.json();
      if (response.ok) {
        setApiData(resResult.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnergyComparison();
  }, [meterType, timeFrame]);

  // Time frame options
  const timeFrameOptions = [
    { value: "day", label: "Today vs Yesterday" },
    { value: "week", label: "This Week vs Last Week" },
    { value: "month", label: "This Month vs Last Month" },
    { value: "year", label: "This Year vs Last Year" },
  ];

  // meter type options
  const meterTypeOptions = [
    { value: "Wapda", label: "Wapda" },
    { value: "Solar", label: "Solar" },
  ];

  // Data type options
  const dataTypeOptions = [
    { value: "import", label: "Import" },
    { value: "export", label: "Export" },
  ];

  // Get legend labels based on time frame
  const getLegendLabels = (timeFrame) => {
    switch (timeFrame) {
      case "day":
        return { current: "Today", previous: "Yesterday" };
      case "week":
        return { current: "This Week", previous: "Last Week" };
      case "month":
        return { current: "This Month", previous: "Last Month" };
      case "year":
        return { current: "This Year", previous: "Last Year" };
      default:
        return { current: "Current", previous: "Previous" };
    }
  };

  // Process data for the chart with data type filtering
  const processChartData = (rawData, typeFilter, timeFrame) => {
    if (!rawData || !rawData.current || !rawData.previous) return null;

    const legendLabels = getLegendLabels(timeFrame);
    const meterPrefix = meterType === "Wapda" ? "M1" : "M2";
    const dataField = typeFilter === "import" ? "Import_Diff" : "Export_Diff";
    const meterKey = `${meterPrefix}_${dataField}`;

    const currentData = rawData.current[meterKey] || [];
    const previousData = rawData.previous[meterKey] || [];

    const seriesData = currentData.map((currItem, index) => {
      const prevItem = previousData[index] || {
        group: currItem.group,
        diff: 0,
      };
      return {
        group: currItem.group,
        currentValue: currItem.diff,
        previousValue: prevItem.diff,
      };
    });

    return {
      seriesData,
      legendLabels,
      timeFrameLabel:
        timeFrameOptions.find((opt) => opt.value === timeFrame)?.label ||
        "Comparison",
    };
  };

  // Render/update chart when data or filter changes
  useEffect(() => {
    if (!apiData) return;

    const processedData = processChartData(apiData, dataType, timeFrame);
    if (!processedData) return;

    if (chart) {
      chart.dispose();
    }

    const root = am5.Root.new("TimeFramComparisonChart");
    root.setThemes([am5themes_Animated.new(root)]);
    if (theme === "dark") {
      root.setThemes([am5themes_Animated.new(root), am5themes_Dark.new(root)]);
    } else {
      root.setThemes([am5themes_Animated.new(root)]);
    }

    root._logo?.dispose();

    const newChart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
      })
    );

    const legend = newChart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );
    legend.markers.template.setAll({
      width: 12,
      height: 12,
    });
    legend.labels.template.setAll({
      fontSize: 12,
    });

    const xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.5,
      minorGridEnabled: true,
    });

    const xAxis = newChart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "group",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xAxis.get("renderer").labels.template.setAll({
      fontSize: 12,
    });

    xRenderer.grid.template.setAll({ location: 1 });
    xAxis.data.setAll(processedData.seriesData);

    const yAxis = newChart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
      })
    );
    yAxis.get("renderer").labels.template.setAll({
      fontSize: 12,
    });

    const colorCurrent = am5.color(0x5f9ed1);
    const colorPrevious = am5.color(0xff8000);

    // Current period series
    const currentSeries = newChart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: processedData.legendLabels.current,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "currentValue",
        categoryXField: "group",
        clustered: true,
      })
    );

    currentSeries.columns.template.setAll({
      tooltipText: "{name}, {categoryX}: {valueY} kWh",
      width: am5.percent(70),
      tooltipY: 0,
      strokeOpacity: 0,
      fill: colorCurrent,
      stroke: colorCurrent,
    });

    currentSeries.data.setAll(processedData.seriesData);

    // Previous period series
    const previousSeries = newChart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: processedData.legendLabels.previous,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "previousValue",
        categoryXField: "group",
        clustered: true,
      })
    );

    previousSeries.columns.template.setAll({
      tooltipText: "{name}, {categoryX}: {valueY} kWh",
      width: am5.percent(70),
      tooltipY: 0,
      strokeOpacity: 0,
      fill: colorPrevious,
      stroke: colorPrevious,
    });

    previousSeries.data.setAll(processedData.seriesData);

    legend.data.setAll([currentSeries, previousSeries]);

    newChart.appear(1000, 100);
    setChart(root);

    return () => {
      if (root) {
        root.dispose();
      }
    };
  }, [apiData, dataType, timeFrame, meterType, theme]);

  return (
    <div
      className={`w-full bg-white dark:bg-gray-800 rounded-md  border-t-3 border-[#1f5897] px-4 py-2 ${
        expand === true
          ? "absolute z-50 top-0 left-0 h-screen"
          : "relative h-[18rem]"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-[#1F5897] dark:text-[#D1D5DB] transition-colors duration-300">
          Time-Based Comparison of Energy Sources
        </h3>
        <button className="cursor-pointer" onClick={() => setExpand(!expand)}>
          {expand === true ? (
            <MdFullscreenExit size={20} />
          ) : (
            <MdOutlineFullscreen size={20} />
          )}
        </button>
      </div>
      <div className="flex w-full items-center justify-end gap-4 mb-4">
        <div className="flex items-center">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            disabled={loading}
            className="outline-none border-1 border-gray-300 dark:border-gray-500 dark:bg-gray-800 rounded px-2 py-1 text-[13px]"
          >
            {timeFrameOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <select
            value={meterType}
            onChange={(e) => setMeterType(e.target.value)}
            disabled={loading}
            className="outline-none border-1 border-gray-300 dark:border-gray-500 dark:bg-gray-800 rounded px-2 py-1 text-[13px]"
          >
            {meterTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            disabled={loading}
            className="outline-none border-1 border-gray-300 dark:border-gray-500 dark:bg-gray-800 rounded px-2 py-1 text-[13px]"
          >
            {dataTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-5 text-gray-600">Loading data...</div>
      ) : (
        <div
          id="TimeFramComparisonChart"
          className={`w-full`}
          style={{ height: expand === true ? "90%" : "14rem" }}
        ></div>
      )}
    </div>
  );
};

export default TimeBasedEnergyComparison;
