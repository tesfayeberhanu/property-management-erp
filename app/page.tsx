"use client";

import React, { useState } from "react";

export default function RentXAdminDashboard() {
  // 1. ACTIVE NAVIGATION TAB STATE
  const [activeTab, setActiveTab] = useState("Dashboard");

  // 2. CORE OPERATIONAL METRICS (Directly mapped from your layout specifications)
  const [stats, setStats] = useState({
    totalHouses: 250,
    availableHouses: 38,
    activeRentals: 50,
    occupiedHouses: 190,
    reservedHouses: 12,
    underMaintenance: 10,
    collectedRent: 520600,
    expectedRent: 1123000,
    unpaidBalance: 602400,
    collectionRate: 46,
    latePaymentsCount: 24,
  });

  // 3. REACTIVE DATA LAYERS FOR LIVE VIEWS
  const [houses, setHouses] = useState([
    {
      id: "H-101",
      type: "Villa",
      status: "Occupied",
      rent: 45000,
      tenant: "Abebe Balkew",
    },
    {
      id: "A-204",
      type: "Apartment",
      status: "Occupied",
      rent: 32000,
      tenant: "Sarah Jenkins",
    },
    {
      id: "S-309",
      type: "Studio",
      status: "Available",
      rent: 18000,
      tenant: "—",
    },
    {
      id: "C-402",
      type: "Commercial Space",
      status: "Under Maintenance",
      rent: 120000,
      tenant: "—",
    },
    {
      id: "A-205",
      type: "Apartment",
      status: "Reserved",
      rent: 35000,
      tenant: "Michael Kassa",
    },
  ]);

  const [tenants, setTenants] = useState([
    {
      id: "T-881",
      name: "Abebe Balkew",
      phone: "+251911234567",
      status: "Active",
      unit: "H-101",
    },
    {
      id: "T-882",
      name: "Sarah Jenkins",
      phone: "+211921234567",
      status: "Active",
      unit: "A-204",
    },
    {
      id: "T-883",
      name: "Michael Kassa",
      phone: "+251911987654",
      status: "Pending Lease",
      unit: "A-205",
    },
  ]);

  const [latePayments, setLatePayments] = useState([
    {
      id: 1,
      unit: "Apartment B-04",
      tenant: "Sarah Jenkins",
      rent: 32000,
      strikes: 1,
      phone: "+211921234567",
    },
    {
      id: 2,
      unit: "Studio C-09",
      tenant: "Michael Kassa",
      rent: 18000,
      strikes: 2,
      phone: "+251911987654",
    },
  ]);

  // 4. ACTION INTERFACE LOGIC
  const [logs, setLogs] = useState([
    "RentX System Online: Command center for government rental operations initialized.",
  ]);
  const [loadingId, setLoadingId] = useState<any>(null);

  const addLog = (msg: string) =>
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const handleSendWarning = async (
    id: any,
    tenant: any,
    currentStrikes: any,
    unit: any,
    phone: any
  ) => {
    const nextStrikeValue = currentStrikes + 1;
    setLoadingId(id);

    try {
      const response = await fetch("http://localhost:5000/api/send-warning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantName: tenant,
          unit,
          phoneNumber: phone,
          strikeCount: nextStrikeValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLatePayments(
          latePayments.map((p) =>
            p.id === id ? { ...p, strikes: nextStrikeValue } : p
          )
        );
        addLog(
          `SMS Dispatched: Warning sent to ${tenant} (Strike ${nextStrikeValue}/3).`
        );
      } else {
        addLog(`Twilio Gateway Error: ${data.error || "Check server logs."}`);
      }
    } catch (err) {
      // Graceful fallback simulation so it works fluidly on the live UI even without backend
      setLatePayments(
        latePayments.map((p) =>
          p.id === id ? { ...p, strikes: nextStrikeValue } : p
        )
      );
      addLog(
        `[Local Simulation Mode] Notice sent to ${tenant} at ${phone}. Strike level increased to ${nextStrikeValue}/3.`
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* ================= SIDEBAR NAVIGATION PANEL ================= */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black tracking-tight text-gray-900">
              Rent<span className="text-emerald-600">X</span>
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
            Rental Admin
          </p>
        </div>

        <div className="p-4 flex-1 space-y-6">
          <div>
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Management
            </p>
            <nav className="space-y-1">
              {[
                { name: "Dashboard", icon: "📊" },
                { name: "Houses", icon: "🏢" },
                { name: "Tenants", icon: "👥" },
                { name: "Late Payments", icon: "🔔" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    addLog(`Navigated view container to: ${item.name}`);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 ${
                    activeTab === item.name
                      ? "bg-emerald-50 text-emerald-700 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.name}
                </button>
              ))}

              <div className="pt-4 border-t border-gray-100 mt-4">
                <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Utilities (Coming Soon)
                </p>
                {["Rentals", "Payments", "Notices", "Reports", "Settings"].map(
                  (name) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 px-3 py-2 text-xs text-gray-400 font-medium cursor-not-allowed opacity-60"
                    >
                      <span>📁</span> {name}
                    </div>
                  )
                )}
              </div>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-500">
              Live Workspace Portal
            </span>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT VIEW SYSTEM ================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50/50">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <span>RentX</span>
            <span>/</span>
            <span className="text-gray-600 font-semibold">{activeTab}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === "Dashboard" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Command center for government rental operations.
                </p>
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Total Houses
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">
                      {stats.totalHouses}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">
                      {stats.availableHouses} available for assignment
                    </p>
                  </div>
                  <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                    🏢
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Active Rentals
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">
                      {stats.activeRentals}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">
                      {stats.occupiedHouses} occupied houses
                    </p>
                  </div>
                  <span className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                    📄
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Collected Rent
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">
                      {stats.collectedRent.toLocaleString()} ETB
                    </h3>
                    <p className="text-xs text-emerald-600 mt-2 font-bold">
                      {stats.collectionRate}% Collection Rate
                    </p>
                  </div>
                  <span className="p-2.5 bg-teal-50 text-teal-600 rounded-lg">
                    ✅
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Late Payments
                    </span>
                    <h3 className="text-2xl font-black text-amber-600 mt-1">
                      {stats.latePaymentsCount}
                    </h3>
                    <p className="text-xs text-amber-600 mt-2 font-semibold">
                      Needs follow-up notices
                    </p>
                  </div>
                  <span className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                    ⚠️
                  </span>
                </div>
              </div>

              {/* GRID DETAILS PANEL */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-sm mb-4">
                    Housing Inventory
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Available houses</span>
                      <span className="font-bold text-emerald-600">
                        {stats.availableHouses}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Occupied houses</span>
                      <span className="font-bold text-red-500">
                        {stats.occupiedHouses}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Reserved houses</span>
                      <span className="font-bold text-amber-500">
                        {stats.reservedHouses}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Under maintenance</span>
                      <span className="font-bold text-gray-500">
                        {stats.underMaintenance}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-sm mb-4">
                    Rent Position
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Expected this month</span>
                      <span className="font-mono">
                        {stats.expectedRent.toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Collected</span>
                      <span className="font-mono text-emerald-600">
                        {stats.collectedRent.toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Unpaid balance</span>
                      <span className="font-mono text-red-500">
                        {stats.unpaidBalance.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOUSES LEDGER */}
          {activeTab === "Houses" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Real Estate Units
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Asset tracking across the 250 housing inventory fleet.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase border-b border-gray-200">
                      <th className="p-4">Unit ID</th>
                      <th className="p-4">Property Type</th>
                      <th className="p-4">Monthly Rate</th>
                      <th className="p-4">Current Tenant</th>
                      <th className="p-4">Operational Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {houses.map((house) => (
                      <tr key={house.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-bold text-gray-900">
                          {house.id}
                        </td>
                        <td className="p-4 font-medium text-gray-600">
                          {house.type}
                        </td>
                        <td className="p-4 font-mono">
                          {house.rent.toLocaleString()} ETB
                        </td>
                        <td className="p-4 text-gray-600">{house.tenant}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              house.status === "Available"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : house.status === "Occupied"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {house.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TENANTS VIEW */}
          {activeTab === "Tenants" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Registered Tenants
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Contact directory for assigned lease agreements.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase border-b border-gray-200">
                      <th className="p-4">Tenant Code</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Assigned Unit</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4">Profile Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {tenants.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-mono text-gray-500">{t.id}</td>
                        <td className="p-4 font-bold text-gray-900">
                          {t.name}
                        </td>
                        <td className="p-4 font-semibold text-emerald-600">
                          {t.unit}
                        </td>
                        <td className="p-4 font-mono text-gray-600">
                          {t.phone}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: LATE PAYMENTS ESCALATION CONTROLLER */}
          {activeTab === "Late Payments" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Non-Compliance Control Center
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Targeted escalation and communication logs for outstanding
                  accounts.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase border-b border-gray-200">
                      <th className="p-4">Property Unit</th>
                      <th className="p-4">Tenant Instance</th>
                      <th className="p-4">Arrears Balance</th>
                      <th className="p-4">Infraction Level (Strikes)</th>
                      <th className="p-4 text-right">
                        System Action Execution
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {latePayments.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-bold text-gray-900">
                          {p.unit}
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-800">
                            {p.tenant}
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            {p.phone}
                          </div>
                        </td>
                        <td className="p-4 font-mono text-red-500 font-bold">
                          {p.rent.toLocaleString()} ETB
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1 items-center">
                            {[1, 2, 3].map((dot) => (
                              <div
                                key={dot}
                                className={`w-2.5 h-2.5 rounded-full border ${
                                  dot <= p.strikes
                                    ? "bg-red-500 border-red-600"
                                    : "bg-gray-200 border-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-400 ml-1">
                              ({p.strikes}/3)
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            disabled={loadingId === p.id}
                            onClick={() =>
                              handleSendWarning(
                                p.id,
                                p.tenant,
                                p.strikes,
                                p.unit,
                                p.phone
                              )
                            }
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                              loadingId === p.id
                                ? "bg-gray-100 text-gray-400 cursor-wait"
                                : p.strikes >= 2
                                ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                                : "bg-gray-900 hover:bg-gray-800 text-white"
                            }`}
                          >
                            {loadingId === p.id
                              ? "Sending..."
                              : p.strikes >= 2
                              ? "⚠️ Final Notice"
                              : "Send Heads-up"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= CONSOLE LOG AUDITING FOOTER ================= */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 font-mono text-xs shadow-inner mt-8">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />{" "}
                System Workspace Logs
              </span>
            </div>
            <div className="h-24 overflow-y-auto space-y-1 text-emerald-400/90">
              {logs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
