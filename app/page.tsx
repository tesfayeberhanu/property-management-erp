//"use client";

//import React, { useState } from "react";
"use client";

import React, { useState } from "react";
// ... rest of the code follows below ...
// 1. MOCK DATABASE (Simulating properties under management with tenant contacts)
const initialProperties = [
  {
    id: 1,
    unit: "Villa Unit A-12",
    tenant: "Abebe Balkew",
    rent: 45000,
    status: "Paid",
    strikes: 0,
    phone: "+251911234567",
  },
  {
    id: 2,
    unit: "Apartment B-04",
    tenant: "Sarah Jenkins",
    rent: 32000,
    status: "Overdue",
    strikes: 1,
    phone: "+211921234567",
  },
  {
    id: 3,
    unit: "Studio C-09",
    tenant: "Michael Kassa",
    rent: 18000,
    status: "Overdue",
    strikes: 2,
    phone: "+251911987654",
  },
  {
    id: 4,
    unit: "Commercial Space 2",
    tenant: "John Doe Corp",
    rent: 120000,
    status: "Paid",
    strikes: 0,
    phone: "+251911000111",
  },
];

export default function ErpDashboard() {
  // 2. CORE APPLICATION STATE
  const [properties, setProperties] = useState(initialProperties);
  const [logs, setLogs] = useState([
    "ERP System Initialized... Ready to track rental cycle.",
  ]);
  const [loadingId, setLoadingId] = useState<number | null>(null); // Tracks active SMS loading status

  // Helper function to update the live system log console
  const addLog = (message: string) => {
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev,
    ]);
  };

  // 3. ACTION: MANUAL RENT COLLECTION LOGGING
  const handleCollectRent = (id: number, tenant: string) => {
    setProperties(
      properties.map((p) =>
        p.id === id ? { ...p, status: "Paid", strikes: 0 } : p
      )
    );
    addLog(
      `Success: Payment logged manually for ${tenant}. Ledger updated & receipt dispatched.`
    );
  };

  // 4. ACTION: CONNECT TO BACKEND GATEWAY TO DISPATCH TWILIO SMS WARNING
  const handleSendWarning = async (
    id: number,
    tenant: string,
    currentStrikes: number,
    unit: string,
    phone: string
  ) => {
    const nextStrikeValue = currentStrikes + 1;
    setLoadingId(id); // Spin button indicator for this specific unit row

    try {
      // Direct connection to your secure Node.js server endpoint
      const response = await fetch("http://localhost:5000/api/send-warning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantName: tenant,
          unit: unit,
          phoneNumber: phone,
          strikeCount: nextStrikeValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local React UI layout state if the SMS API delivery succeeded
        setProperties(
          properties.map((p) => {
            if (p.id === id) {
              return {
                ...p,
                strikes: nextStrikeValue,
                status: nextStrikeValue >= 3 ? "Terminated" : "Overdue",
              };
            }
            return p;
          })
        );

        if (nextStrikeValue >= 3) {
          addLog(
            `CRITICAL NOTICE: SMS sent to ${tenant}. Agreement automatically flagged for legal termination!`
          );
        } else {
          addLog(
            `SMS Dispatched: Warning text pushed to ${tenant} at ${phone} (Strike ${nextStrikeValue}/3).`
          );
        }
      } else {
        addLog(`Twilio Gateway Error: ${data.error || "Check server logs."}`);
      }
    } catch (err) {
      addLog(
        `Network Failure: Local messaging backend server (port 5000) is unreachable.`
      );
    } finally {
      setLoadingId(null); // Stop button loading spinner animation
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Dashboard Banner */}
        <header className="mb-8 border-b border-gray-800 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            AbolBet Property ERP
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Automated Rental Collections & Non-Compliance Escalation Control
          </p>
        </header>

        {/* Real-time High Level Aggregate Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Portfolio Revenue
            </h3>
            <p className="text-3xl font-bold mt-2 text-white">215,000 ETB</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Active Overdue Alerts
            </h3>
            <p className="text-3xl font-bold mt-2 text-amber-500">
              {properties.filter((p) => p.status === "Overdue").length} Units
              Delayed
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Lease Terminations Pending
            </h3>
            <p className="text-3xl font-bold mt-2 text-red-500">
              {properties.filter((p) => p.status === "Terminated").length}{" "}
              Agreements Flagged
            </p>
          </div>
        </div>

        {/* Centralized Real Estate Ledger Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-2xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-white">
              Real Estate Units Control Ledger
            </h2>
            <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
              Live Sync Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-950 text-gray-400 text-xs tracking-wider uppercase border-b border-gray-800">
                  <th className="p-4">Unit</th>
                  <th className="p-4">Tenant</th>
                  <th className="p-4">Monthly Rent</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Infraction History (Strikes)</th>
                  <th className="p-4 text-right">System Action Rules</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {properties.map((prop) => (
                  <tr
                    key={prop.id}
                    className="hover:bg-gray-850/40 transition-colors"
                  >
                    <td className="p-4 font-semibold text-gray-200">
                      {prop.unit}
                    </td>
                    <td className="p-4 text-gray-300">
                      <div>{prop.tenant}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {prop.phone}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-300">
                      {prop.rent.toLocaleString()} ETB
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
                          prop.status === "Paid"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : prop.status === "Overdue"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        ● {prop.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1.5 items-center">
                        {[1, 2, 3].map((dot) => (
                          <div
                            key={dot}
                            className={`w-3 h-3 rounded-full border ${
                              dot <= prop.strikes
                                ? "bg-gradient-to-br from-red-500 to-red-600 border-red-400 shadow-sm shadow-red-900"
                                : "bg-gray-800 border-gray-700"
                            }`}
                            title={`Infraction Status: ${prop.strikes} Strikes`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          ({prop.strikes}/3)
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      {prop.status !== "Paid" &&
                        prop.status !== "Terminated" && (
                          <button
                            onClick={() =>
                              handleCollectRent(prop.id, prop.tenant)
                            }
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-md text-xs font-bold shadow-md transition-all active:scale-95"
                          >
                            Collect Rent
                          </button>
                        )}
                      {prop.status !== "Terminated" && (
                        <button
                          disabled={loadingId === prop.id}
                          onClick={() =>
                            handleSendWarning(
                              prop.id,
                              prop.tenant,
                              prop.strikes,
                              prop.unit,
                              prop.phone
                            )
                          }
                          className={`px-3 py-1.5 rounded-md text-xs font-bold shadow-md transition-all active:scale-95 text-white ${
                            loadingId === prop.id
                              ? "bg-gray-700 cursor-wait opacity-60"
                              : prop.strikes === 2
                              ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 animate-pulse"
                              : "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                          }`}
                        >
                          {loadingId === prop.id
                            ? "Sending..."
                            : prop.strikes === 2
                            ? "⚠️ Issue Final Notice"
                            : "Send Heads-up"}
                        </button>
                      )}
                      {prop.status === "Terminated" && (
                        <span className="inline-flex items-center text-xs font-black uppercase text-red-500 tracking-wider bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                          🚫 Eviction / Contract Dissolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Embedded Live System Automation Terminal Console Logs */}
        <div className="bg-black border border-gray-800 rounded-xl p-5 font-mono text-xs shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-3">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />{" "}
              System Communications Engine Logs
            </span>
            <span className="text-gray-600 text-[10px]">v1.0.2-prod</span>
          </div>
          <div className="h-32 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-gray-800 text-gray-400 select-all">
            {logs.map((log, index) => (
              <div
                key={index}
                className={
                  log.includes("CRITICAL")
                    ? "text-red-400 font-semibold"
                    : log.includes("Success")
                    ? "text-green-400"
                    : ""
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
