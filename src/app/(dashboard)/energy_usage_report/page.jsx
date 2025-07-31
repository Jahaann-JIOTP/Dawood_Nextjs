
"use client"
import { useState, useEffect } from "react"
import * as XLSX from "xlsx"

const EnergyUsageReport = () => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedMeters, setSelectedMeters] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fetchedData, setFetchedData] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const meters = [
    { id: "M1_", name: "Wapda", category: "generation" },
    { id: "M2_", name: "Solar", category: "generation" },
  ]

  const primaryParameters = {
    M1_: {
      import: "Energy_Active_Import_kWh",
      export: "Energy_Active_Export_kWh",
    },
    M2_: {
      generation: "Energy_Active_Import_kWh",
    },
  }

  const alternativeParameters = {
    M1_: [
      "Energy_Active_Import_kWh",
      "Energy_Active_Export_kWh",
      "Reactive_Power_Phase_A_kVAR",
      "Reactive_Power_Phase_B_kVAR",
      "Reactive_Power_Phase_C_kVAR",
      "Voltage_L-N_Average_V",
      "Voltage_L-L_Phase_AB_V",
      "Voltage_L-L_Phase_BC_V",
      "Voltage_L-L_Phase_CA_V",
      "Voltage_L-L_Average_V",
      "Current_Phase_A_A",
      "Current_Phase_B_A",
      "Current_Phase_C_A",
      "Current_Average_A",
      "Current_Demand_A",
      "Current_Peak_Demand_A",
      "Current_4th_Input_A",
      "Frequency_Hz",
      "Power_Factor_Total",
      "Power_Factor_Phase_A",
      "Power_Factor_Phase_B",
      "Power_Factor_Phase_C",
      "Active_Power_Total_kW",
      "Reactive_Power_Total_kVAR",
      "Apparent_Power_Total_kVA",
      "Active_Power_Phase_A_kW",
      "Active_Power_Phase_B_kW",
      "Active_Power_Phase_C_kW",
      "Apparent_Power_Phase_A_kVA",
      "Apparent_Power_Phase_B_kVA",
      "Apparent_Power_Phase_C_kVA",
      "Active_Power_Demand_kW",
      "Active_Power_Peak_Demand_kW",
      "Reactive_Power_Demand_kVAR",
      "Apparent_Power_Demand_kVA",
      "Reactive_Power_Peak_Demand_kVAR",
      "Apparent_Power_Peak_Demand_kVA",
      "Energy_Reactive_Import_kVARh",
      "Energy_Reactive_Export_kVARh",
      "Energy_Apparent_Total_kVAh",
    ],
    M2_: [
      "Energy_Active_Import_kWh",
      "Energy_Active_Export_kWh",
      "Reactive_Power_Phase_A_kVAR",
      "Reactive_Power_Phase_B_kVAR",
      "Reactive_Power_Phase_C_kVAR",
      "Voltage_L-N_Average_V",
      "Voltage_L-L_Phase_AB_V",
      "Voltage_L-L_Phase_BC_V",
      "Voltage_L-L_Phase_CA_V",
      "Voltage_L-L_Average_V",
      "Current_Phase_A_A",
      "Current_Phase_B_A",
      "Current_Phase_C_A",
      "Current_Average_A",
      "Current_Demand_A",
      "Current_Peak_Demand_A",
      "Current_4th_Input_A",
      "Frequency_Hz",
      "Power_Factor_Total",
      "Power_Factor_Phase_A",
      "Power_Factor_Phase_B",
      "Power_Factor_Phase_C",
      "Active_Power_Total_kW",
      "Reactive_Power_Total_kVAR",
      "Apparent_Power_Total_kVA",
      "Active_Power_Phase_A_kW",
      "Active_Power_Phase_B_kW",
      "Active_Power_Phase_C_kW",
      "Apparent_Power_Phase_A_kVA",
      "Apparent_Power_Phase_B_kVA",
      "Apparent_Power_Phase_C_kVA",
      "Active_Power_Demand_kW",
      "Active_Power_Peak_Demand_kW",
      "Reactive_Power_Demand_kVAR",
      "Apparent_Power_Demand_kVA",
      "Reactive_Power_Peak_Demand_kVAR",
      "Apparent_Power_Peak_Demand_kVA",
      "Energy_Reactive_Import_kVARh",
      "Energy_Reactive_Export_kVARh",
      "Energy_Apparent_Total_kVAh",
    ],
  }

  const generationMeters = meters.filter((m) => m.category === "generation")
  const consumptionMeters = meters.filter((m) => m.category === "consumption")

  const hasConsumption = selectedMeters.some((id) => consumptionMeters.map((m) => m.id).includes(id))
  const hasGeneration = selectedMeters.some((id) => generationMeters.map((m) => m.id).includes(id))

  const handleSelectGroup = (group, checked) => {
    console.log("🔄 Select All clicked:", checked)
    const groupIds = group.map((m) => m.id)
    if (checked) {
      setSelectedMeters((prev) => [...new Set([...prev, ...groupIds])])
    } else {
      setSelectedMeters((prev) => prev.filter((id) => !groupIds.includes(id)))
    }
  }

  const isGroupFullySelected = (group) => group.every((m) => selectedMeters.includes(m.id))

  const toggleModal = () => {
    console.log("🔄 Toggling modal. Current state:", isModalOpen)
    setIsModalOpen((prev) => !prev)
  }

  const closeModal = () => {
    console.log("❌ Closing modal explicitly")
    setIsModalOpen(false)
  }

  const handleMeterSelect = (meterId) => {
    console.log("🔍 Selecting meter:", meterId)
    const selectedMeter = meters.find((m) => m.id === meterId)
    const selectedCategory = selectedMeter?.category

    setSelectedMeters((prev) => {
      const isSelected = prev.includes(meterId)
      let updated = [...prev]

      if (isSelected) {
        updated = updated.filter((id) => id !== meterId)
      } else {
        const oppositeCategory = selectedCategory === "generation" ? "consumption" : "generation"
        const oppositeMeters = meters.filter((m) => m.category === oppositeCategory).map((m) => m.id)
        updated = updated.filter((id) => !oppositeMeters.includes(id))
        updated.push(meterId)
      }

      console.log("✅ Updated selected meters:", updated)
      return updated
    })
  }

  const tryAlternativeParameters = async (originalPayload) => {
    console.log("🔄 Trying alternative parameters...")
    const successfulResults = []

    for (const meterId of selectedMeters) {
      const alternatives = alternativeParameters[meterId] || []
      let foundForThisMeter = false

      for (const altSuffix of alternatives) {
        if (foundForThisMeter) break

        const altPayload = {
          ...originalPayload,
          meterIds: [meterId],
          suffixes: [altSuffix],
        }

        try {
          const response = await fetch("http://localhost:5000/energy_usage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(altPayload),
          })

          if (response.ok) {
            const data = await response.json()
            if (data && Array.isArray(data) && data.length > 0) {
              console.log(`✅ Found data with ${meterId} - ${altSuffix}`)
              successfulResults.push({
                meterId,
                suffix: altSuffix,
                data: data[0],
              })
              foundForThisMeter = true
            }
          }
        } catch (error) {
          console.log(`❌ Failed ${meterId} - ${altSuffix}:`, error.message)
        }
      }
    }

    if (successfulResults.length > 0) {
      const processedData = successfulResults.map((result) => ({
        ...result.data,
        suffix: result.suffix,
        consumption: result.data.consumption || result.data.energy || result.data.kwh || result.data.value || 0,
        meterId: result.meterId,
      }))
      return { success: true, data: processedData }
    }

    return { success: false }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!startDate || !endDate || selectedMeters.length === 0) {
      alert("Please fill out all fields including date range and sources.")
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      alert("End date must be after start date.")
      return
    }

    const requests = []

    console.log("🔍 Processing selected meters:", selectedMeters)

    selectedMeters.forEach((meterId) => {
      console.log("🔍 Processing meter ID:", meterId)

      if (meterId === "M1_") {
        requests.push({
          meterId: "M1",
          suffix: primaryParameters["M1_"].import,
          type: "import",
        })
        requests.push({
          meterId: "M1",
          suffix: primaryParameters["M1_"].export,
          type: "export",
        })
        console.log("✅ Added M1_ (Wapda) with import/export parameters")
      }

      if (meterId === "M2_") {
        requests.push({
          meterId: "M2",
          suffix: primaryParameters["M2_"].generation,
          type: "generation",
        })
        console.log("✅ Added M2_ (Solar) with generation parameter")
      }
    })

    const meterIds = [...new Set(requests.map((req) => req.meterId))]
    const suffixes = requests.map((req) => req.suffix)

    console.log("📊 Selected Meters:", selectedMeters)
    console.log("📊 Unique meterIds for API:", meterIds)
    console.log("📊 All suffixes:", suffixes)
    console.log("📊 Request details:", requests)

    const payload = {
      start_date: startDate,
      end_date: endDate,
      meterIds: meterIds,
      suffixes: suffixes,
    }

    console.log("📤 Final Payload:", JSON.stringify(payload, null, 2))

    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/energy_usage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("📥 API Response:", data)

      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.log("⚠️ Empty response, trying alternative parameters...")
        const altResult = await tryAlternativeParameters(payload)
        if (altResult.success) {
          setFetchedData(altResult.data)
          setIsSubmitted(true)
          return
        }

        setFetchedData([])
        setIsSubmitted(false)
        return
      }

      let processedData = []
      if (Array.isArray(data)) {
        processedData = data.map((item, index) => ({
          ...item,
          suffix: suffixes[index] || "",
          consumption: item.consumption || item.energy || item.kwh || item.value || 0,
          meterId: item.meterId || meterIds[index] || `M${index + 1}`,
        }))
      } else if (typeof data === "object") {
        processedData = [
          {
            ...data,
            suffix: suffixes[0] || "",
            consumption: data.consumption || data.energy || data.kwh || data.value || 0,
            meterId: data.meterId || meterIds[0] || "M1",
          },
        ]
      }

      console.log("✅ Processed Data:", processedData)

      if (processedData.length === 0 || processedData.every((item) => item.consumption === 0)) {
        console.log("⚠️ Data found but all consumption values are zero")
      }

      setFetchedData(processedData)
      setIsSubmitted(true)
    } catch (error) {
      console.error("❌ Error fetching data:", error)
      let errorMessage = "Failed to fetch data from the API."

      if (error.message.includes("Failed to fetch")) {
        errorMessage +=
          "\n\nPossible causes:\n• API server is not running on localhost:5000\n• CORS issues\n• Network connectivity problems"
      } else if (error.message.includes("500")) {
        errorMessage += "\n\nServer error - check API logs for details."
      } else if (error.message.includes("404")) {
        errorMessage += "\n\nAPI endpoint not found - verify the URL is correct."
      }

      alert(errorMessage + `\n\nError details: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!fetchedData || fetchedData.length === 0) {
      alert("No data to export")
      return
    }

    const headers = ["No", "Sources", "KWH", "Unit Price (PKR)", "Total Price (PKR)"]
    const rows = fetchedData.map((item, index) => {
      const totalPrice = item.consumption * 0.0 // Placeholder for rates, adjust as needed
      return [
        index + 1,
        (() => {
          if (item.meterId === "M1") {
            if (item.suffix.includes("Import")) return "Wapda Import"
            if (item.suffix.includes("Export")) return "Wapda Export"
            return "Wapda"
          }
          if (item.meterId === "M2") return "Solar Generation"
          return meters.find((m) => m.id === item.meterId)?.name || "Unknown"
        })(),
        item.consumption.toFixed(2),
        0.0, // Placeholder for rates, adjust as needed
        totalPrice.toFixed(2),
      ]
    })

    const titleRow = ["Energy Usage Report"]
    const dataForExcel = [titleRow, [], headers, ...rows]

    const worksheet = XLSX.utils.aoa_to_sheet(dataForExcel)
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }]

    const titleCellAddress = XLSX.utils.encode_cell({ r: 0, c: 0 })
    worksheet[titleCellAddress] = {
      v: "Energy Usage Report",
      s: {
        fill: { fgColor: { rgb: "0070C0" } },
        font: { sz: 16, bold: true, color: { rgb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "center" },
      },
    }

    headers.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: colIndex })
      if (!worksheet[cellAddress]) worksheet[cellAddress] = {}
      worksheet[cellAddress].s = {
        fill: { fgColor: { rgb: "0070C0" } },
        font: { color: { rgb: "FFFFFF" }, bold: true, sz: 14 },
        alignment: { horizontal: "center", vertical: "center" },
      }
    })

    worksheet["!cols"] = [{ wpx: 50 }, { wpx: 150 }, { wpx: 100 }, { wpx: 120 }, { wpx: 150 }]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Billing Report")
    XLSX.writeFile(workbook, "Energy_Cost_Report.xlsx")
  }

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isModalOpen])

  useEffect(() => {
    return () => {
      console.log("🧹 Component unmounting: Final cleanup")
      document.body.style.overflow = "unset"
      setIsModalOpen(false)
    }
  }, [])

  if (isSubmitted && fetchedData && fetchedData.length > 0) {
    return (
      <div className="relative shadow-lg rounded-[8px] w-full mt-[-7px]">
        <div className="absolute inset-0 bg-white dark:bg-gray-800" style={{ opacity: 1 }} />
        <div className="relative z-10 p-6 h-[39.9vw] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-700 dark:text-white">Energy Usage  Report</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          <hr />

          <div className="mb-8">
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Invoice To:</h2>
                <p className="text-gray-600 dark:text-white">Dawood Floor mills</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Jahaann Technologies</h2>
                <p className="text-gray-600 dark:text-white">
                  22-C Block, G.E.C.H.S, Phase 3 Peco Road, Lahore, Pakistan
                </p>
                <p className="text-gray-600 dark:text-white">Phone: +924235949261</p>
              </div>
            </div>
          </div>

          <div className="w-full h-[2px] bg-gradient-to-r from-blue-500 via-green-500 to-red-500 my-4" />

          <div className="mb-4">
            <div className="flex justify-between items-start">
              <button onClick={handleExport} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Export
              </button>
              <div className="text-right">
                <h2 className="text-lg font-bold text-blue-700">Billing Report</h2>
                <div className="text-gray-600 dark:text-white mt-2">
                  <p>Start Date: {startDate}</p>
                  <p>End Date: {endDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
            <div>
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-center text-sm font-semibold text-gray-700 dark:bg-gray-900 dark:text-white">
                    <th className="border border-gray-300 px-4 py-2">No</th>
                    <th className="border border-gray-300 px-4 py-2">Sources</th>
                    <th className="border border-gray-300 px-4 py-2">KWH</th>
                    <th className="border border-gray-300 px-4 py-2">Unit Price (PKR)</th>
                    <th className="border border-gray-300 px-4 py-2">Total Price (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {fetchedData.map((item, index) => {
                    const totalPrice = item.consumption * 0.0 // Placeholder for rates, adjust as needed
                    return (
                      <tr key={index} className={`text-center ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="border border-gray-300 px-4 py-2 bg-[#3989c6] dark:bg-blue-900 text-white font-semibold">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700 dark:bg-gray-900 dark:text-white">
                          {(() => {
                            if (item.meterId === "M1") {
                              if (item.suffix.includes("Import")) return "Wapda Import"
                              if (item.suffix.includes("Export")) return "Wapda Export"
                              return "Wapda"
                            }
                            if (item.meterId === "M2") return "Solar Generation"
                            return meters.find((m) => m.id === item.meterId)?.name || "Unknown"
                          })()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700 dark:bg-gray-900 dark:text-white">
                          {item.consumption.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700 dark:bg-gray-900 dark:text-white">
                          {0.0} {/* Placeholder for rates, adjust as needed */}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 bg-[#3989c6] dark:bg-blue-900 text-white font-semibold">
                          {totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {hasConsumption && (
              <div className="mt-4">
                <div className="flex justify-between items-center text-lg font-bold text-white bg-[#3989c6] dark:bg-blue-900 p-4 rounded-md">
                  <span>GRAND TOTAL</span>
                  <span>
                    {fetchedData.reduce((acc, item) => acc + item.consumption * 0.0, 0).toFixed(2)} PKR {/* Placeholder for rates, adjust as needed */}
                  </span>
                </div>
              </div>
            )}

            {hasGeneration && (
              <div className="mt-4 p-4 border rounded bg-[#3989c6] dark:bg-blue-900 text-white text-sm">
                <h3 className="text-lg font-bold text-white mb-1">Report Summary:</h3>
                {(() => {
                  let wapdaImport = 0
                  let wapdaExport = 0
                  let solarGeneration = 0

                  const wapdaRows = fetchedData.filter((item) => item.meterId === "M1")
                  wapdaRows.forEach((row) => {
                    if (row.suffix.includes("Import")) {
                      wapdaImport = row.consumption * 0.0 // Placeholder for rates, adjust as needed
                    }
                    if (row.suffix.includes("Export")) {
                      wapdaExport = row.consumption * 0.0 // Placeholder for rates, adjust as needed
                    }
                  })

                  const solarRow = fetchedData.find((item) => item.meterId === "M2")
                  if (solarRow) solarGeneration = solarRow.consumption * 0.0 // Placeholder for rates, adjust as needed

                  const netWapdaCost = Math.max(wapdaImport - wapdaExport, 0)

                  return (
                    <>
                      <p>
                        <strong>Wapda Import Cost:</strong> {wapdaImport.toFixed(2)} PKR
                      </p>
                      <p>
                        <strong>Wapda Export Saving:</strong> {wapdaExport.toFixed(2)} PKR
                      </p>
                      <p>
                        <strong>Solar Generation Value:</strong> {solarGeneration.toFixed(2)} PKR
                      </p>
                      <p className="text-[16px] flex">
                        <strong>Net Wapda Cost (Import - Export):</strong>
                        <p className="bg-white rounded-md text-black px-2 py-0 ml-2">{netWapdaCost.toFixed(2)} PKR</p>
                      </p>
                    </>
                  )
                })()}
              </div>
            )}

            <div className="mt-8 text-sm text-gray-600 dark:text-white">
              <p className="border-l-4 border-[#3a8ac5] mb-2 pl-2">
                Thank you very much for doing business with us. We look forward to working with you again.
              </p>
              <div className="flex justify-between mt-4 border-t pt-4 bg-[#e6e4e4] dark:bg-gray-900 p-4">
                <p>
                  Generated on: {new Date().toLocaleTimeString()}, Date: {new Date().toISOString().split("T")[0]}
                </p>
                <p>Generated By: Jahaann Technologies</p>
                <p>Email: info@jahaann.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      id="energy-cost-report"
      className="relative shadow-lg rounded-[8px] w-full h-[43.5vw] max-md:h-[83vh] border-t-2 border-red-600 mt-[-7px]"
    >
      <div className="absolute inset-0 bg-white dark:bg-gray-800 border-t-2 border-red-600" style={{ opacity: 1 }} />
      <div className="relative z-10 p-6">
        <h1 className="text-lg font-bold text-gray-700 dark:text-white mb-4">Energy Usage Report</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[13px] font-bold text-[#626469] dark:text-white mb-2">Sources</label>
            <button
              type="button"
              onClick={toggleModal}
              className="relative w-full p-2 rounded-lg text-[14px] font-bold text-white overflow-hidden border-2"
              style={{
                background: "#1F5897",
                borderColor: "#1F5897",
                color: "#EFFFFF",
              }}
            >
              <span className="relative z-10">
                {selectedMeters.length > 0 ? `Selected: ${selectedMeters.length} Meters` : "Select Sources"}
              </span>
            </button>
            {selectedMeters.length > 0 && (
              <div className="mt-2">
                <label className="block text-[13px] font-bold text-[#626469] dark:text-white">Selected Sources</label>
                <input
                  type="text"
                  value={selectedMeters.map((id) => meters.find((meter) => meter.id === id)?.name).join(", ")}
                  readOnly
                  className="w-full p-2 border border-[#9f9fa3] rounded-md text-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-2">
              <label className="block text-[13px] font-bold text-[#626469] dark:text-white">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onFocus={(e) => e.target.showPicker()}
                className="w-full p-2 border border-[#9f9fa3] rounded-md text-gray-700 dark:bg-gray-700 dark:text-white"
                max={endDate}
              />
            </div>
            <div className="flex-1 ml-2">
              <label className="block text-[13px] font-bold text-[#626469] dark:text-white">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onFocus={(e) => e.target.showPicker()}
                className="w-full p-2 border border-[#9f9fa3] rounded-md text-gray-700 dark:bg-gray-700 dark:text-white"
                min={startDate}
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-[240px] h-[35px] block font-sans text-[16px] font-bold text-white no-underline uppercase text-center pt-[4px] mt-[10px] ml-[5px] relative cursor-pointer border-none rounded-[5px] bg-[#1784d9] bg-gradient-to-b from-[#1784d9] to-[#389de9] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "GENERATE REPORT"}
            </button>
          </div>
        </form>

        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-opacity-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsModalOpen(false)
              }}
            />
            <div
              className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[400px] max-w-[90vw] max-h-[80vh] overflow-hidden z-[1010]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-blue-200 dark:bg-blue-800 p-3 rounded-t-lg flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-700 dark:text-white">Select Sources</h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-1 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 max-h-[300px] overflow-y-auto">
                <div className="mb-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGroupFullySelected(generationMeters)}
                      onChange={(e) => handleSelectGroup(generationMeters, e.target.checked)}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Select All</span>
                  </label>
                </div>
                {generationMeters.map((meter) => (
                  <div key={meter.id} className="mb-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedMeters.includes(meter.id)}
                        onChange={() => handleMeterSelect(meter.id)}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{meter.name}</span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex justify-end p-4 space-x-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnergyUsageReport
