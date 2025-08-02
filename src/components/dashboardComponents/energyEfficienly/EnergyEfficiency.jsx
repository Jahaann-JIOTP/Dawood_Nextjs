"use client";
import { useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import config from "@/constant/apiRouteList";
import { MdFullscreenExit, MdOutlineFullscreen } from "react-icons/md";

const EnergyEfficiency = ({ theme }) => {
  const [expanded, setExpanded] = useState(false);
  const currentDate = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const fetchEnergyEfficiencyData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}/dashboard/dashboard-data2`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate,
            endDate,
          }),
        }
      );
      const resResult = await response.json();
      if (response.ok) {
        setData(resResult.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEnergyEfficiencyData();
  }, [startDate, endDate]);

  useEffect(() => {
    const root = am5.Root.new("EnergyEfficiencychart");
    root._logo?.dispose();

    // Theme setup
    const themes = [
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ];
    if (theme === "dark") {
      themes.push(am5themes_Dark.new(root));
    }
    root.setThemes(themes);

    // Chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50),
      })
    );

    // Series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: true,
      })
    );

    // Configure labels to show percentage - FIXED
    series.labels.template.setAll({
      fontSize: 12,
      fill: theme === "dark" ? am5.color(0xffffff) : am5.color(0x000000),
      text: "{value.formatNumber()}%",
      populateText: true,
      forceHidden: false,
      visible: true,
      centerX: am5.p50,
      centerY: am5.p50,
      radius: 10, // Distance from slice
    });

    // Configure label positions and slice appearance
    series.slices.template.setAll({
      stroke: am5.color(0xffffff),
      strokeWidth: 2,
    });

    // Hide tick lines
    series.ticks.template.setAll({
      forceHidden: true,
    });

    const labelMap = {
      M1_Import_Diff: "WAPDA Import",
      M1_Export_Diff: "WAPDA Export",
      M2_Import: "Solar Generation",
    };

    // Transform data from object to array
    const chartData = Object.entries(data || {}).map(([key, value]) => ({
      category: labelMap[key] || key.replace(/_/g, " "),
      value: Number(value) || 0,
    }));

    // Only set data if we have valid data
    if (chartData.length > 0 && chartData.some((item) => item.value > 0)) {
      series.data.setAll(chartData);
    } else {
      // Fallback data for demonstration
      series.data.setAll([
        { category: "WAPDA Import", value: 45 },
        { category: "WAPDA Export", value: 30 },
        { category: "Solar Generation", value: 25 },
      ]);
    }

    // Legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      })
    );

    legend.valueLabels.template.setAll({
      forceHidden: true,
    });

    legend.labels.template.setAll({
      fontSize: 12,
      fill: theme === "dark" ? am5.color(0xffffff) : am5.color(0x000000),
    });

    legend.markers.template.setAll({
      width: 12,
      height: 12,
    });

    legend.data.setAll(series.dataItems);

    // Configure tooltips
    series.slices.template.set(
      "tooltipText",
      "{category}: {value.formatNumber('#.0')} ({value.percent.formatNumber('#.0')}%)"
    );

    // Animate
    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data, theme, expanded]);

  return (
    <div
      className={`flex w-full flex-col bg-white dark:bg-gray-800 shadow-md border-t-3 border-[#1f5897] rounded-md transition-all duration-300 ${
        expanded
          ? "absolute h-screen top-0 left-0 z-50 overflow-auto"
          : "relative"
      }`}
    >
      <div className="flex justify-between items-center p-2 sm:p-4 flex-shrink-0">
        <h4 className="text-[16px] font-semibold text-[#1F5897] dark:text-[#D1D5DB] transition-colors duration-300">
          Energy Efficiency
        </h4>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-2 py-1 text-[13px]"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-2 py-1 text-[13px]"
          />
          <button
            className="cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded === true ? (
              <MdFullscreenExit size={20} />
            ) : (
              <MdOutlineFullscreen size={20} />
            )}
          </button>
        </div>
      </div>
      <div className="relative w-full flex-1" style={{ minWidth: 0 }}>
        <div
          className={`w-full ${expanded ? "h-[90%]" : "h-[15rem]"}`}
          id="EnergyEfficiencychart"
        />
      </div>
    </div>
  );
};

export default EnergyEfficiency;
