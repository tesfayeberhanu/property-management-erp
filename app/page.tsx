import React, { useState } from "react";

// Mock database simulating properties under management
const initialProperties = [
  {
    id: 1,
    unit: "Villa Unit A-12",
    tenant: "Abebe Balkew",
    rent: 45000,
    status: "Paid",
    strikes: 0,
  },
  {
    id: 2,
    unit: "Apartment B-04",
    tenant: "Sarah Jenkins",
    rent: 32000,
    status: "Overdue",
    strikes: 1,
  },
  {
    id: 3,
    unit: "Studio C-09",
    tenant: "Michael Kassa",
    rent: 18000,
    status: "Overdue",
    strikes: 2,
  },
  {
    id: 4,
    unit: "Commercial Space 2",
    tenant: "John Doe Corp",
    rent: 120000,
    status: "Paid",
    strikes: 0,
  },
];

export default function ErpDashboard() {
  const [properties, setProperties] = useState(initialProperties);
  const [logs, setLogs] = useState([
    "ERP System Initialized... Ready to track rental cycle.",
  ]);

  const addLog = (message) => {
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev,
    ]);
  };

  // Action 1: Collect Rent Fee
  const handleCollectRent = (id, tenant) => {
    setProperties(
      properties.map((p) => (p.id === id ? { ...p, status: "Paid" } : p))
    );
    addLog(`Success: Payment logged for ${tenant}. Receipt dispatched.`);
  };

  // Action 2: Trigger Warning / Strike Circulation
  const handleSendWarning = (id, tenant, currentStrikes) => {
    const newStrikes = currentStrikes + 1;
    setProperties(
      properties.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            strikes: newStrikes,
            status: newStrikes >= 3 ? "Terminated" : "Overdue",
          };
        }
        return p;
      })
    );

    if (newStrikes >= 3) {
      addLog(
        `CRITICAL: ${tenant} reached ${newStrikes} strikes. Automated lease agreement termination triggered.`
      );
    } else {
      addLog(
        `Warning sent: Formal overdue notice text dispatched to ${tenant} (Strike ${newStrikes}/3).`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Property Management ERP
          </h1>
          <p className="text-gray-400">
            Automated Rent Ledger & Contract Enforcement System
          </p>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400">
              Total Portfolio Revenue
            </h3>
            <p className="text-2xl font-bold mt-2">215,000 ETB</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400">
              Active Non-Compliance Alerts
            </h3>
            <p className="text-2xl font-bold mt-2 text-amber-500">
              {properties.filter((p) => p.status === "Overdue").length} Units
              Delayed
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400">
              Lease Terminations Pending
            </h3>
            <p className="text-2xl font-bold mt-2 text-red-500">
              {properties.filter((p) => p.status === "Terminated").length}{" "}
              Agreements Flagged
            </p>
          </div>
        </div>

        {/* Main Property Ledger */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50">
            <h2 className="font-semibold text-lg">Real Estate Units Status</h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-gray-400 text-xs tracking-wider uppercase border-b border-gray-700">
                <th className="p-4">Unit Details</th>
                <th className="p-4">Tenant</th>
                <th className="p-4">Monthly Rate</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Infraction Record</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {properties.map((prop) => (
                <tr
                  key={prop.id}
                  className="hover:bg-gray-750 transition-colors"
                >
                  <td className="p-4 font-medium">{prop.unit}</td>
                  <td className="p-4 text-gray-300">{prop.tenant}</td>
                  <td className="p-4">{prop.rent.toLocaleString()} ETB</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        prop.status === "Paid"
                          ? "bg-green-400/10 text-green-400"
                          : prop.status === "Overdue"
                          ? "bg-amber-400/10 text-amber-400"
                          : "bg-red-400/10 text-red-400"
                      }`}
                    >
                      {prop.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((dot) => (
                        <div
                          key={dot}
                          className={`w-3 h-3 rounded-full ${
                            dot <= prop.strikes ? "bg-red-500" : "bg-gray-600"
                          }`}
                          title={`Strike ${prop.strikes}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {prop.status !== "Paid" && prop.status !== "Terminated" && (
                      <button
                        onClick={() => handleCollectRent(prop.id, prop.tenant)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-xs font-semibold"
                      >
                        Collect Rent
                      </button>
                    )}
                    {prop.status !== "Terminated" && (
                      <button
                        onClick={() =>
                          handleSendWarning(prop.id, prop.tenant, prop.strikes)
                        }
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          prop.strikes === 2
                            ? "bg-red-600 hover:bg-red-500"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        {prop.strikes === 2
                          ? "⚠️ Issue Final Notice"
                          : "Send Heads-up"}
                      </button>
                    )}
                    {prop.status === "Terminated" && (
                      <span className="text-xs font-bold uppercase text-red-500 tracking-wider">
                        Legal Dept Sign-Off
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Automation Audit Logs */}
        <div className="bg-black/40 rounded-xl p-4 border border-gray-800 font-mono text-xs text-gray-400">
          <div className="text-gray-300 font-bold mb-2">
            Automated Communications Logs:
          </div>
          <div className="h-28 overflow-y-auto space-y-1">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
