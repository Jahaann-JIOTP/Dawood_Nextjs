"use client"
import { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"
import am4themes_animated from "@amcharts/amcharts4/themes/animated"
import am4themes_dark from "@amcharts/amcharts4/themes/dark"
import Image from "next/image"
import MetricCard from "@/components/MetricCard"
import axios from "axios"
import TimePeriodSelector from "@/components/timePeriodSelector/TimePeriodSelector"

const DashboardPage = () => {
  const [expanded, setExpanded] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCompressor, setSelectedCompressor] = useState("Compressor1")
  const [selectedSubMetric, setSelectedSubMetric] = useState("Import")
  const [expandedCards, setExpandedCards] = useState({
    airConsumption1: false,
  })
  const [loading1, setLoading1] = useState(false)
  const [error1, setError1] = useState(null)
  const [isDark, setIsDark] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // States for dashboard data (first API)
  const [dashboardData, setDashboardData] = useState(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [dashboardError, setDashboardError] = useState(null)
  const [dashboardTimePeriod, setDashboardTimePeriod] = useState("today")

  console.log("This is dashboard Time period==============", dashboardTimePeriod)

  // States for real-time meter data (fourth API)
  const [realTimeMeterData, setRealTimeMeterData] = useState([])
  const [realTimeLoading, setRealTimeLoading] = useState(true)
  const [realTimeError, setRealTimeError] = useState(null)

  // States for energy efficiency chart data (second API)
  const [energyData, setEnergyData] = useState(null)
  const [energyLoading, setEnergyLoading] = useState(true)
  const [energyError, setEnergyError] = useState(null)

  // States for time-based comparison chart data (third API)
  const [timeBasedData, setTimeBasedData] = useState(null)
  const [timeBasedLoading, setTimeBasedLoading] = useState(true)
  const [timeBasedError, setTimeBasedError] = useState(null)

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const chart1Ref = useRef(null)
  const chart2Ref = useRef(null)
  const energyChartRef = useRef(null)
  const timeBasedChartRef = useRef(null)

  const dispatch = useDispatch()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Apply the animated theme globally
  const applyTheme = () => {
    if (isDark) {
      am4core.useTheme(am4themes_dark)
    } else {
      am4core.unuseTheme(am4themes_dark)
    }
  }

  // useEffect to fetch dashboard data when dashboardTimePeriod changes
  useEffect(() => {
    if (mounted) {
      fetchDashboardData()
    }
  }, [dashboardTimePeriod, mounted])

  // Fetch dashboard data when dashboardTimePeriod changes
  const fetchDashboardData = async () => {
    setDashboardLoading(true)
    setDashboardError(null) // Clear previous errors

    try {
      const response = await fetch("http://localhost:5000/dashboard/dashboard-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          range: dashboardTimePeriod, // Payload with the range parameter
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Dashboard Data:", result)

      // Set the dashboard data from the API response
      setDashboardData(result.data || result)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setDashboardError(error.message || "Failed to fetch dashboard data")
    } finally {
      setDashboardLoading(false)
    }
  }

  const fetchEnergyData = async () => {
    try {
      setEnergyLoading(true)
      setEnergyError(null)
      const response = await axios.post("http://localhost:5000/dashboard/dashboard-data2", {
        fromDate: startDate,
        toDate: endDate,
      })
      setEnergyData(response.data?.data)
    } catch (error) {
      console.error("Error fetching energy data:", error)
      setEnergyError(error?.response?.data?.message || error.message)
    } finally {
      setEnergyLoading(false)
    }
  }

  const fetchTimeBasedData = async () => {
    try {
      setTimeBasedLoading(true)
      setTimeBasedError(null)
      const compressorToMeterMap = {
        Compressor1: "Wapda",
        Compressor2: "Solar",
      }
      const apiRange = selectedPeriod === "today" ? "day" : selectedPeriod
      const requestBody = {
        range: apiRange, // 'day', 'week', etc.
        meterType: compressorToMeterMap[selectedCompressor],
      }
      const response = await fetch("http://localhost:5000/dashboard/dashboard-data3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
      const result = await response.json()
      setTimeBasedData(result.data || result)
    } catch (error) {
      console.error("Error fetching time-based data:", error)
      setTimeBasedError(error.message)
    } finally {
      setTimeBasedLoading(false)
    }
  }

  const fetchRealTimeMeterData = async () => {
    try {
      setRealTimeLoading(true)
      setRealTimeError(null)
      const response = await fetch("http://localhost:5000/dashboard/dashboard-data4", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      const apiData = result.data // This is the object with M1_ prefixed keys
      const extractedMeterData = []
      const ro1Voltage = apiData.M1_Voltage_L_L_Average_V !== undefined ? apiData.M1_Voltage_L_L_Average_V : 0
      const ro1Current = apiData.M1_Current_Average_A !== undefined ? apiData.M1_Current_Average_A : 0
      const ro1Power = apiData.M1_Active_Power_Total_kW !== undefined ? apiData.M1_Active_Power_Total_kW : 0
      extractedMeterData.push({
        source: "RO-1",
        current: `${ro1Current} (A)`,
        voltage: `${ro1Voltage} (V)`,
        power: `${ro1Power} (kW)`,
        status: Number.parseFloat(ro1Voltage) === 0 ? "Inactive" : "Active",
        image: "/meter.png",
      })
      const ro2Voltage = apiData.M2_Voltage_L_L_Average_V !== undefined ? apiData.M2_Voltage_L_L_Average_V : 0
      const ro2Current = apiData.M2_Current_Average_A !== undefined ? apiData.M2_Current_Average_A : 0
      const ro2Power = apiData.M2_Active_Power_Total_kW !== undefined ? apiData.M2_Active_Power_Total_kW : 0
      extractedMeterData.push({
        source: "RO-2",
        current: `${ro2Current} (A)`,
        voltage: `${ro2Voltage} (V)`,
        power: `${ro2Power} (kW)`,
        status: Number.parseFloat(ro2Voltage) === 0 ? "Inactive" : "Active",
        image: "/meter.png",
      })
      setRealTimeMeterData(extractedMeterData)
    } catch (error) {
      console.error("Error fetching real-time meter data:", error)
      setRealTimeError(error.message)
    } finally {
      setRealTimeLoading(false)
    }
  }

  // Helper function to check if a value represents "no data"
  const createEnergyChart = () => {
    if (!energyData || energyLoading) return
    // Dispose existing chart
    if (energyChartRef.current) {
      energyChartRef.current.dispose()
    }
    // Create chart instance
    const chart = am4core.create("coolingEfficiencyChart", am4charts.PieChart)
    energyChartRef.current = chart
    chart.logo.disabled = true
    // Prepare chart data based on API response
    const chartData = [
      {
        category: "WAPDA Import",
        value: Math.abs(energyData.M1_Import_Diff || 0),
        color: am4core.color("#FFB74D"), // Orange/Yellow
      },
      {
        category: "WAPDA Export",
        value: Math.abs(energyData.M1_Export_Diff || 0),
        color: am4core.color("#81C784"), // Light Green
      },
      {
        category: "Solar Generation",
        value: Math.abs(energyData.M2_Import || 0),
        color: am4core.color("#4CAF50"), // Green
      },
    ]
    // Filter out zero values for better visualization
    chart.data = chartData.filter((item) => item.value > 0)
    // Add and configure Series
    const pieSeries = chart.series.push(new am4charts.PieSeries())
    pieSeries.dataFields.value = "value"
    pieSeries.dataFields.category = "category"
    pieSeries.slices.template.propertyFields.fill = "color"
    // Configure slice appearance
    pieSeries.slices.template.stroke = am4core.color("#fff")
    pieSeries.slices.template.strokeWidth = 2
    pieSeries.slices.template.strokeOpacity = 1
    // Add hover effects
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
    const hs = pieSeries.slices.template.states.getKey("hover")
    hs.properties.scale = 1.1
    hs.properties.fillOpacity = 0.8
    // Configure labels
    pieSeries.labels.template.disabled = true
    // Configure ticks
    pieSeries.ticks.template.disabled = true
    // Configure inner radius for donut chart
    pieSeries.innerRadius = am4core.percent(40)
    chart.legend = new am4charts.Legend()
    chart.legend.position = "bottom"
    chart.legend.paddingTop = 20
    chart.legend.labels.template.text = "{name}"
    chart.legend.labels.template.fill = isDark ? am4core.color("#fff") : am4core.color("#000")
    chart.legend.valueLabels.template.fill = isDark ? am4core.color("#fff") : am4core.color("#000")
    chart.legend.markers.template.width = 12
    chart.legend.markers.template.height = 12
    // Ensure legend is visible at different zoom levels
    chart.legend.minHeight = 40 // Minimum height to prevent clipping
    chart.legend.itemContainers.template.padding(5, 5, 5, 5) // Add padding to items
    chart.legend.fontSize = 12 // Set a reasonable font size
    // Make legend responsive
    chart.legend.maxHeight = 80
    chart.legend.scrollable = true

    // Responsive design
    chart.responsive.enabled = true
  }

  const isNoData = (value) => {
    return value === 0 || value === null || value === undefined || value === "" || isNaN(value)
  }

  const createTimeBasedChart = () => {
    if (!timeBasedData || timeBasedLoading) return
    // Dispose existing chart
    if (timeBasedChartRef.current) {
      timeBasedChartRef.current.dispose()
    }
    // Create chart instance
    const chart = am4core.create("chartdiv", am4charts.XYChart)
    timeBasedChartRef.current = chart
    chart.logo.disabled = true
    // Define colors
    const grayColor = "#808080" // Gray for zero data
    const yesterdayColor = "#87CEEB" // Light blue for yesterday
    const todayColor = "#4682B4" // Steel blue for today
    // Determine the data field keys based on selected compressor and sub-metric
    let currentDataKey = ""
    let previousDataKey = ""
    if (selectedCompressor === "Compressor1") {
      // Wapda
      if (selectedSubMetric === "Import") {
        currentDataKey = "M1_Import_Diff"
        previousDataKey = "M1_Import_Diff" // Assuming previous also uses M1_Import_Diff
      } else {
        // Export
        currentDataKey = "M1_Export_Diff"
        previousDataKey = "M1_Export_Diff" // Assuming previous also uses M1_Export_Diff
      }
    } else {
      // Compressor2 - Solar
      if (selectedSubMetric === "Import") {
        currentDataKey = "M2_Import_Diff"
        previousDataKey = "M2_Import_Diff"
      } else {
        // Export
        currentDataKey = "M2_Export_Diff" // Corrected for Solar Export
        previousDataKey = "M2_Export_Diff" // Corrected for Solar Export
      }
    }
    // Extract raw data from the API response based on the determined keys
    const currentPeriodData = timeBasedData.current?.[currentDataKey] || []
    const previousPeriodData = timeBasedData.previous?.[previousDataKey] || []
    // Combine and process data for the chart
    const chartData = currentPeriodData.map((currentItem, index) => {
      const previousItem = previousPeriodData[index] || {}
      const yesterdayValue = Number.parseFloat(previousItem.diff) || 0
      const todayValue = Number.parseFloat(currentItem.diff) || 0
      // Determine if there's "no data" for this entire period
      const periodHasNoData = isNoData(yesterdayValue) && isNoData(todayValue)
      return {
        week: currentItem.group || `Period ${index + 1}`, // Use 'group' as the category
        yesterday: yesterdayValue,
        today: todayValue,
        yesterdayColor: periodHasNoData ? grayColor : yesterdayColor,
        todayColor: periodHasNoData ? grayColor : todayColor,
      }
    })
    console.log("Processed chart data:", chartData) // Debug log
    chart.data = chartData
    // Create category axis (X-axis)
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    categoryAxis.dataFields.category = "week"
    categoryAxis.renderer.labels.template.fill = isDark ? am4core.color("#fff") : am4core.color("#000")
    // Increased grid line visibility
    categoryAxis.renderer.grid.template.stroke = isDark ? am4core.color("#666") : am4core.color("#999")
    categoryAxis.renderer.grid.template.strokeWidth = 2
    categoryAxis.renderer.grid.template.strokeOpacity = 0.8
    categoryAxis.renderer.grid.template.strokeDasharray = "3,3"
    // Create value axis (Y-axis)
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
    valueAxis.title.text = "Energy (kWh)"
    valueAxis.title.fill = isDark ? am4core.color("#fff") : am4core.color("#000")
    valueAxis.renderer.labels.template.fill = isDark ? am4core.color("#fff") : am4core.color("#000")
    // Increased grid line visibility
    valueAxis.renderer.grid.template.stroke = isDark ? am4core.color("#666") : am4core.color("#999")
    valueAxis.renderer.grid.template.strokeWidth = 2
    valueAxis.renderer.grid.template.strokeOpacity = 0.8
    valueAxis.renderer.grid.template.strokeDasharray = "3,3"
    valueAxis.min = 0
    // Create Yesterday series with conditional coloring using propertyFields
    const yesterdaySeries = chart.series.push(new am4charts.ColumnSeries())
    yesterdaySeries.dataFields.valueY = "yesterday"
    yesterdaySeries.dataFields.categoryX = "week"
    yesterdaySeries.name = "Yesterday (kWh)"
    yesterdaySeries.tooltipText = "{name}: {valueY} kWh"
    yesterdaySeries.columns.template.width = am4core.percent(40)
    // Use propertyFields to set color from data
    yesterdaySeries.columns.template.propertyFields.fill = "yesterdayColor"
    yesterdaySeries.columns.template.propertyFields.stroke = "yesterdayColor"
    // Create Today series with conditional coloring using propertyFields
    const todaySeries = chart.series.push(new am4charts.ColumnSeries())
    todaySeries.dataFields.valueY = "today"
    todaySeries.dataFields.categoryX = "week"
    todaySeries.name = "Today (kWh)"
    todaySeries.tooltipText = "{name}: {valueY} kWh"
    todaySeries.columns.template.width = am4core.percent(40)
    // Use propertyFields to set color from data
    todaySeries.columns.template.propertyFields.fill = "todayColor"
    todaySeries.columns.template.propertyFields.stroke = "todayColor"
    // Configure column appearance
    yesterdaySeries.columns.template.strokeWidth = 1
    todaySeries.columns.template.strokeWidth = 1
    // Add hover effects
    const yesterdayHoverState = yesterdaySeries.columns.template.states.create("hover")
    yesterdayHoverState.properties.fillOpacity = 0.8
    const todayHoverState = todaySeries.columns.template.states.create("hover")
    todayHoverState.properties.fillOpacity = 0.8
    // Add cursor
    chart.cursor = new am4charts.XYCursor()
    chart.cursor.behavior = "none"
    // ADD LEGEND with labels and responsive adjustments
    chart.legend = new am4charts.Legend()
    chart.legend.position = "bottom"
    chart.legend.paddingTop = 20
    chart.legend.labels.template.text = "{name}"
    chart.legend.labels.template.fill = isDark ? am4core.color("#fff") : am4core.color("#000")
    chart.legend.valueLabels.template.fill = isDark ? am4core.color("#fff") : am4core.color("#000")
    chart.legend.markers.template.width = 12
    chart.legend.markers.template.height = 12
    // Ensure legend is visible at different zoom levels
    chart.legend.minHeight = 40 // Minimum height to prevent clipping
    chart.legend.itemContainers.template.padding(5, 5, 5, 5) // Add padding to items
    chart.legend.fontSize = 12 // Set a reasonable font size
    // Responsive design - simplified without problematic rules
    chart.responsive.enabled = true
  }

  // Auto-fetch energy data when dates change
  useEffect(() => {
    if (startDate && endDate && mounted) {
      fetchEnergyData()
    }
  }, [startDate, endDate, mounted])

  // useEffect to fetch data on component mount
  useEffect(() => {
    if (!mounted) {
      fetchDashboardData()
      fetchEnergyData()
      fetchTimeBasedData()
      fetchRealTimeMeterData() // Fetch real-time meter data
      setMounted(true)
    }
  }, [])

  // useEffect to refetch time-based data when period, compressor, or sub-metric changes
  useEffect(() => {
    if (mounted) {
      fetchTimeBasedData()
    }
  }, [selectedPeriod, selectedCompressor, selectedSubMetric, mounted])

  // useEffect to create energy chart when data is available
  useEffect(() => {
    if (mounted && energyData && !energyLoading) {
      createEnergyChart()
    }
    // Cleanup function
    return () => {
      if (energyChartRef.current) {
        energyChartRef.current.dispose()
      }
    }
  }, [energyData, energyLoading, mounted, isDark])

  // useEffect to create time-based chart when data is available
  useEffect(() => {
    if (mounted && timeBasedData && !timeBasedLoading) {
      createTimeBasedChart()
    }
    // Cleanup function
    return () => {
      if (timeBasedChartRef.current) {
        timeBasedChartRef.current.dispose()
      }
    }
  }, [timeBasedData, timeBasedLoading, mounted, isDark, selectedSubMetric, selectedCompressor])

  // Function to toggle card expansion
  const toggleExpand = (cardName) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardName]: !prev[cardName],
    }))
  }

  const secondRowMetrics = [
    {
      label: "WAPDA Import",
      value: dashboardLoading ? "Loading..." : dashboardError ? "Error" : `${dashboardData?.M1_Import_Diff || 0} kW`,
      className: "font-bold",
      color: "#2196F3",
    },
    {
      label: "WAPDA Export",
      value: dashboardLoading ? "Loading..." : dashboardError ? "Error" : `${dashboardData?.M1_Export_Diff || 0} kW`,
      className: "font-bold",
      color: "#2196F3",
    },
    {
      label: "Solar Generation",
      value: dashboardLoading ? "Loading..." : dashboardError ? "Error" : `${dashboardData?.M2_Import_Diff || 0} kW`,
      className: "font-bold",
      color: "#2196F3",
    },
    {
      label: "Total Generation (Solar + Wapda)",
      value: dashboardLoading ? "Loading..." : dashboardError ? "Error" : `${dashboardData?.Total_Generation || 0} kW`,
      className: "font-bold",
      color: "#2196F3",
    },
  ]

  // Apply themes at the top level
  useEffect(() => {
    am4core.useTheme(am4themes_animated)
    applyTheme()
  }, [isDark])

  return (
    <div className="w-full h-[81vh] overflow-auto bg-white dark:bg-gray-900">
      <section className="flex flex-col sm:p-4 w-full h-[81vh] bg-white dark:bg-gray-800 rounded-lg border-t-3 gap-2 sm:gap-4">
        <div className="flex-shrink-0 w-full">
          <TimePeriodSelector selected={dashboardTimePeriod} setSelected={setDashboardTimePeriod} />
        </div>

        {/* Second Row Metrics with API Data */}
        <div className="flex-shrink-0 w-full">
          {dashboardError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <div className="flex justify-between items-center">
                <span>Error loading dashboard data: {dashboardError}</span>
                <button
                  onClick={fetchDashboardData}
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {secondRowMetrics.map((metric, index) => (
              <MetricCard
                key={`second-row-${index}`}
                label={metric.label}
                value={metric.value}
                color={metric.color}
                className={`${metric.className} ${dashboardLoading ? "animate-pulse" : ""}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-4 flex-1 min-h-0 w-full">
          <div className="flex flex-col xl:flex-row gap-2 sm:gap-4 w-full">
            <div
              className={`flex flex-col bg-white dark:bg-gray-800 shadow-md border-t-3 border-[#1f5897] rounded-md transition-all duration-300 ${
                expanded
                  ? "fixed top-4 left-4 right-4 bottom-4 z-50 m-2 sm:m-4 overflow-auto"
                  : "flex-1 w-full xl:w-1/2 min-h-[140px] sm:min-h-[220px] md:min-h-[300px]"
              }`}
            >
              <div className="flex justify-between items-center p-2 sm:p-4 flex-shrink-0">
                <h4 className="text-base sm:text-lg font-bold text-[#1F5897] dark:text-[#D1D5DB] pl-2 sm:pl-4 transition-colors duration-300">
                  Energy Efficiency
                </h4>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="outline-none border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="outline-none border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
              <div className="relative w-full flex-1 min-h-[200px] sm:min-h-[180px]" style={{ minWidth: 0 }}>
                {energyError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                    <div className="text-center">
                      <p className="text-red-500 text-sm mb-2">Error loading chart data: {energyError}</p>
                      <button
                        onClick={fetchEnergyData}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
                {energyLoading && (
                  <div className="absolute inset-0 flex items-center justify-center dark:bg-gray-800 bg-opacity-70 z-10">
                    <p className="text-gray-500 dark:text-white text-base sm:text-lg transition-colors duration-300">
                      Loading chart...
                    </p>
                  </div>
                )}
                <div
                  id="coolingEfficiencyChart"
                  className="transition-all duration-300 w-full h-full"
                  style={{ minWidth: 0 }}
                ></div>
              </div>
            </div>

            <div
              className={`flex flex-col bg-white dark:bg-gray-800 shadow-md border-t-4 border-[#1f5897] rounded-md transition-all duration-300 ${
                expandedCards.airConsumption1
                  ? "fixed top-4 left-4 right-4 bottom-4 z-50 m-2 sm:m-4 overflow-auto"
                  : "flex-1 w-full xl:w-1/2 min-h-[140px] sm:min-h-[220px] md:min-h-[300px]"
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="flex flex-wrap justify-between items-center p-2 sm:p-4 flex-shrink-0 gap-2 sm:gap-4">
                  <h3 className="text-base sm:text-lg font-bold text-[#1F5897] dark:text-[#D1D5DB] transition-colors duration-300">
                    Time-Based Comparison of Energy Sources
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
                    <select
                      id="compressor-period"
                      className="w-[90px] sm:w-[180px] text-xs sm:text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md px-2 py-1 text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      value={selectedPeriod}
                    >
                      <option value="today">Today over Yesterday</option>
                      <option value="week">This Week over Last Week</option>
                      <option value="month">This Month over Last Month</option>
                      <option value="year">This Year over Last Year</option>
                    </select>
                    <select
                      id="compressor-selection"
                      className="w-[70px] sm:w-[140px] text-xs sm:text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md px-2 py-1 text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
                      onChange={(e) => setSelectedCompressor(e.target.value)}
                      value={selectedCompressor}
                    >
                      <option value="Compressor1">Wapda </option>
                      <option value="Compressor2">Solar </option>
                    </select>
                    <select
                      id="sub-metric-selection"
                      className="w-[100px] sm:w-[160px] text-xs sm:text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md px-2 py-1 text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
                      onChange={(e) => setSelectedSubMetric(e.target.value)}
                      value={selectedSubMetric}
                    >
                      <option value="Import">Import</option>
                      <option value="Export">Export</option>
                    </select>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpand("airConsumption1")
                      }}
                      className="text-base sm:text-lg font-bold text-gray-700 dark:text-white hover:text-blue-500 transition-colors duration-300"
                      title={expandedCards.airConsumption1 ? "Minimize" : "Maximize"}
                    >
                      {expandedCards.airConsumption1 ? "✖" : "⛶"}
                    </button>
                  </div>
                </div>
                <div className="relative w-full flex-1 min-h-[100px] sm:min-h-[180px]" style={{ minWidth: 0 }}>
                  {timeBasedError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                      <div className="text-center">
                        <p className="text-red-500 text-sm mb-2">Error loading chart data: {timeBasedError}</p>
                      </div>
                    </div>
                  )}
                  {timeBasedLoading && (
                    <div className="absolute inset-0 flex items-center justify-center dark:bg-gray-800 bg-opacity-70 z-10">
                      <p className="text-gray-500 dark:text-white text-base sm:text-lg transition-colors duration-300">
                        Loading chart...
                      </p>
                    </div>
                  )}
                  <div
                    id="chartdiv"
                    className="w-full h-full transition-all duration-300"
                    style={{ minWidth: 0 }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Real Time Value Table - Made to fill remaining height */}
          <div className="bg-white dark:bg-gray-900 shadow-md border-t-3 border-[#1f5897] rounded-md transition-colors duration-300 flex-1 w-full overflow-hidden flex flex-col">
            <div className="px-2 sm:px-4 py-2 border-b border-blue-800 dark:border-gray-800 dark:bg-gray-800 flex-shrink-0">
              <h3 className="text-base sm:text-lg font-semibold text-[#1F5897] dark:text-[#D1D5DB] transition-colors duration-300">
                Real Time Value
              </h3>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs sm:text-sm min-w-[320px] h-full">
                <thead className="sticky top-0">
                  <tr className="bg-blue-200 dark:bg-blue-800 text-gray-800 dark:text-gray-100 transition-colors duration-300">
                    <th className="px-2 sm:px-4 py-2 text-left font-medium border-r border-gray-300 dark:border-gray-600">
                      Source
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-center font-medium border-r border-gray-300 dark:border-gray-600">
                      Current avg (A)
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-center font-medium border-r border-gray-300 dark:border-gray-600">
                      Voltage L-L avg (V)
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-center font-medium border-r border-gray-300 dark:border-gray-600">
                      Total Power (kW)
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {realTimeLoading && (
                    <tr>
                      <td colSpan="5" className="px-2 sm:px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                        Loading real-time data...
                      </td>
                    </tr>
                  )}
                  {realTimeError && (
                    <tr>
                      <td colSpan="5" className="px-2 sm:px-4 py-4 text-center text-red-500 dark:text-red-400">
                        Error loading real-time data: {realTimeError}
                      </td>
                    </tr>
                  )}
                  {!realTimeLoading && !realTimeError && realTimeMeterData.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-2 sm:px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                        No real-time data available.
                      </td>
                    </tr>
                  )}
                  {!realTimeLoading &&
                    !realTimeError &&
                    realTimeMeterData.length > 0 &&
                    realTimeMeterData.map((item, index) => (
                      <tr
                        key={index}
                        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                      >
                        <td className="px-2 sm:px-4 py-2 border-r border-gray-300 dark:border-gray-600">
                          <div className="flex items-center">
                            <Image
                              src={"/meter.png"} // Use a default image as API might not provide it
                              alt="Meter"
                              width={32}
                              height={32}
                              className="border border-gray-300 dark:border-gray-600 rounded"
                            />
                            <span className="ml-1 sm:ml-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                              {item.source}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-center text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600 transition-colors duration-300">
                          {item.current}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-center text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600 transition-colors duration-300">
                          {item.voltage}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-center text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600 transition-colors duration-300">
                          {item.power}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-center">
                          <span
                            className={`inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2 ${
                              Number.parseFloat(item.voltage) === 0 ? "bg-red-500" : "bg-green-500"
                            }`}
                          ></span>
                          <span className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
                            {Number.parseFloat(item.voltage) === 0 ? "Inactive" : "Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage