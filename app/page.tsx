"use client";

import React, { useState } from "react";

export default function RentXAdminDashboard() {
  // 1. NAVIGATION CONTROL
  const [activeTab, setActiveTab] = useState("Dashboard");

  // 2. MODAL INTERFACE CONTROLS
  const [showHouseModal, setShowHouseModal] = useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);

  // FORM STATES
  const [newHouse, setNewHouse] = useState({
    id: "",
    type: "Apartment",
    rent: "",
    status: "Available",
  });
  const [newTenant, setNewTenant] = useState({ name: "", phone: "", unit: "" });

  // 3. CORE REACTIVE STATE DATA LAYERS
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
      status: "Active",
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

  // LIVE STATS COUNTER CALCULATOR
  const totalHousesCount = 250 + (houses.length - 5);
  const occupiedCount =
    houses.filter((h) => h.status === "Occupied").length + 188;
  const availableCount =
    houses.filter((h) => h.status === "Available").length + 37;
  const reservedCount =
    houses.filter((h) => h.status === "Reserved").length + 11;
  const maintenanceCount =
    houses.filter((h) => h.status === "Under Maintenance").length + 9;

  const expectedRent = 1123000;
  const collectedRent = 520600;
  const unpaidBalance = expectedRent - collectedRent;
  const collectionRate = 46;

  // 4. LOGGING FEEDBACK CORE
  const [logs, setLogs] = useState([
    "RentX System Core Engine Online. Interactive management grids mounted.",
  ]);
  const [loadingId, setLoadingId] = useState<any>(null);

  const addLog = (msg: string) =>
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  // 5. DATA MUTATION ACTIONS
  const handleCreateHouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouse.id || !newHouse.rent) return;

    const entry = {
      id: newHouse.id,
      type: newHouse.type,
      status: newHouse.status,
      rent: parseFloat(newHouse.rent),
      tenant: "—",
    };

    setHouses([entry, ...houses]);
    addLog(
      `Asset Created: Asset Unit ${entry.id} added to cluster configuration registry.`
    );
    setShowHouseModal(false);
    setNewHouse({ id: "", type: "Apartment", rent: "", status: "Available" });
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name || !newTenant.phone) return;

    const generatedId = `T-${Math.floor(100 + Math.random() * 900)}`;
    const entry = {
      id: generatedId,
      name: newTenant.name,
      phone: newTenant.phone,
      status: "Active",
      unit: newTenant.unit || "Unassigned",
    };

    setTenants([entry, ...tenants]);

    // Side-effect: If a valid unit was attached, update that unit's allocation status
    if (newTenant.unit) {
      setHouses(
        houses.map((h) =>
          h.id === newTenant.unit
            ? { ...h, status: "Occupied", tenant: newTenant.name }
            : h
        )
      );
    }

    addLog(
      `Tenant Registered: ${entry.name} authorized with security token ${entry.id}.`
    );
    setShowTenantModal(false);
    setNewTenant({ name: "", phone: "", unit: "" });
  };

  const handleDeactivateTenant = (id: string, name: string) => {
    setTenants(
      tenants.map((t) => (t.id === id ? { ...t, status: "Deactivated" } : t))
    );
    addLog(
      `Account Revocation: Tenant protocol profile for ${name} set to DEACTIVATED status.`
    );
  };

  const handleToggleHouseStatus = (id: string, currentStatus: string) => {
    const nextStatusMap: { [key: string]: string } = {
      Available: "Under Maintenance",
      "Under Maintenance": "Reserved",
      Reserved: "Available",
    };
    const targetStatus = nextStatusMap[currentStatus] || "Available";
    setHouses(
      houses.map((h) =>
        h.id === id
          ? {
              ...h,
              status: targetStatus,
              tenant: targetStatus !== "Occupied" ? "—" : h.tenant,
            }
          : h
      )
    );
    addLog(
      `Asset Modification: Unit ${id} status context updated to [${targetStatus}].`
    );
  };

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
      await fetch("http://localhost:5000/api/send-warning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantName: tenant,
          unit,
          phoneNumber: phone,
          strikeCount: nextStrikeValue,
        }),
      });
      setLatePayments(
        latePayments.map((p) =>
          p.id === id ? { ...p, strikes: nextStrikeValue } : p
        )
      );
      addLog(
        `SMS Dispatched: Notification pushed to gateway engine for ${tenant}.`
      );
    } catch (err) {
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
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500">
      {/* ================= SIDEBAR NAVIGATION PANEL ================= */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black tracking-tight text-white">
              Rent<span className="text-blue-500">X</span>
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">
            Rental Admin
          </p>
        </div>

        <div className="p-4 flex-1 space-y-6">
          <div>
            <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Management Panel
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
                    addLog(
                      `Switched view viewport target context to: ${item.name}`
                    );
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 ${
                    activeTab === item.name
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-400">
              System Pipeline Secured
            </span>
          </div>
        </div>
      </aside>

      {/* ================= MAIN DISPLAY CANVAS ================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-950">
        <header className="h-16 bg-gray-900 border-b border-gray-800 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <span>ADDIS ABABA CITY ADMIN.</span>
            <span>/</span>
            <span className="text-gray-300 font-semibold">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "Houses" && (
              <button
                onClick={() => setShowHouseModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-md transition-all shadow-md"
              >
                + Create House Unit
              </button>
            )}
            {activeTab === "Tenants" && (
              <button
                onClick={() => setShowTenantModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-md transition-all shadow-md"
              >
                + Register New Tenant
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* ================= TAB 1: DASHBOARD VIEW WITH GRAPHICAL DATA REPRESENTATIONS ================= */}
          {activeTab === "Dashboard" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  Real-time analytical trends and data monitoring visual
                  metrics.
                </p>
              </div>

              {/* STAT METRIC SUMMARY PLATES */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 flex justify-between items-start shadow-lg">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Housing Inventory
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      {totalHousesCount} Units
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {availableCount} active available nodes
                    </p>
                  </div>
                  <span className="p-2 bg-gray-800 text-blue-400 rounded-lg">
                    🏢
                  </span>
                </div>
                <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 flex justify-between items-start shadow-lg">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Rent Collection Pool
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      {collectedRent.toLocaleString()} ETB
                    </h3>
                    <p className="text-xs text-emerald-400 mt-1 font-bold">
                      {collectionRate}% Net Rate
                    </p>
                  </div>
                  <span className="p-2 bg-gray-800 text-emerald-400 rounded-lg">
                    ✅
                  </span>
                </div>
                <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 flex justify-between items-start shadow-lg">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Outstanding Deficit
                    </span>
                    <h3 className="text-2xl font-black text-red-400 mt-1">
                      {unpaidBalance.toLocaleString()} ETB
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Pending allocation collection
                    </p>
                  </div>
                  <span className="p-2 bg-gray-800 text-red-400 rounded-lg">
                    📊
                  </span>
                </div>
                <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 flex justify-between items-start shadow-lg">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Arrears Incidents
                    </span>
                    <h3 className="text-2xl font-black text-amber-500 mt-1">
                      24 Escalations
                    </h3>
                    <p className="text-xs text-amber-400 mt-1 font-medium">
                      Flagged compliance risks
                    </p>
                  </div>
                  <span className="p-2 bg-gray-800 text-amber-400 rounded-lg">
                    ⚠️
                  </span>
                </div>
              </div>

              {/* GRAPHICAL DATA REPRESENTATION BLOCKS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Graph 1: Financial Allocation Efficiency Meter */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Financial Efficiency
                    </h3>
                    <p className="text-sm font-bold text-white mb-4">
                      Rent Position Liquidation Ratio
                    </p>

                    {/* Visual Radial Gauge Analogue */}
                    <div className="relative flex items-center justify-center my-4">
                      <div className="w-32 h-32 rounded-full border-8 border-gray-800 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-2xl font-black text-white">
                            {collectionRate}%
                          </span>
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">
                            Liquidated
                          </p>
                        </div>
                      </div>
                      {/* Decorative Accent Ring indicator */}
                      <div className="absolute w-32 h-32 rounded-full border-8 border-transparent border-t-emerald-500 border-r-emerald-500 animate-spin-slow" />
                    </div>
                  </div>

                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between text-xs font-medium text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
                        Collected Cash
                      </span>
                      <span className="font-mono text-gray-200">
                        {collectedRent.toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500" />{" "}
                        Outstanding Balance
                      </span>
                      <span className="font-mono text-gray-200">
                        {unpaidBalance.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Graph 2: Asset Deployment Ratio Breakdown Bar Chart */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Asset Allocation Mix
                    </h3>
                    <p className="text-sm font-bold text-white mb-6">
                      Proportional Housing Inventory Footprint
                    </p>

                    {/* Integrated Segmented Progress Chart Track */}
                    <div className="w-full h-5 bg-gray-800 rounded-full overflow-hidden flex shadow-inner mb-6">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: "76%" }}
                        title="Occupied"
                      />
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: "15%" }}
                        title="Available"
                      />
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: "5%" }}
                        title="Reserved"
                      />
                      <div
                        className="h-full bg-gray-500 transition-all duration-300"
                        style={{ width: "4%" }}
                        title="Maintenance"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-gray-950/40 p-2 rounded border border-gray-850 flex items-center justify-between">
                      <span className="text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{" "}
                        Occupied
                      </span>
                      <span className="text-white font-bold">
                        {occupiedCount}
                      </span>
                    </div>
                    <div className="bg-gray-950/40 p-2 rounded border border-gray-850 flex items-center justify-between">
                      <span className="text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />{" "}
                        Available
                      </span>
                      <span className="text-white font-bold">
                        {availableCount}
                      </span>
                    </div>
                    <div className="bg-gray-950/40 p-2 rounded border border-gray-850 flex items-center justify-between">
                      <span className="text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{" "}
                        Reserved
                      </span>
                      <span className="text-white font-bold">
                        {reservedCount}
                      </span>
                    </div>
                    <div className="bg-gray-950/40 p-2 rounded border border-gray-850 flex items-center justify-between">
                      <span className="text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />{" "}
                        Repair
                      </span>
                      <span className="text-white font-bold">
                        {maintenanceCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Graph 3: Linear Operational Health Metric Bars */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Operational Benchmarks
                    </h3>
                    <p className="text-sm font-bold text-white mb-4">
                      Cluster Performance Target Index
                    </p>

                    <div className="space-y-3.5 mt-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1 text-gray-400">
                          <span>Lease Occupancy Rate</span>
                          <span className="text-blue-400 font-bold">76%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: "76%" }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1 text-gray-400">
                          <span>Collections Fulfillment</span>
                          <span className="text-emerald-400 font-bold">
                            46%
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: "46%" }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1 text-gray-400">
                          <span>Asset Maintenance Target</span>
                          <span className="text-purple-400 font-bold">92%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-500 h-full rounded-full"
                            style={{ width: "92%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: HOUSES LEDGER (WITH LIVE ACCELERATED CYCLING ACTIONS) ================= */}
          {activeTab === "Houses" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Housing Inventory Matrix
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  Asset deployment register. Click status pills to toggle
                  allocation states.
                </p>
              </div>
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-950 text-gray-400 text-xs font-bold uppercase border-b border-gray-800">
                      <th className="p-4">Unit Identifier</th>
                      <th className="p-4">Structural Class</th>
                      <th className="p-4">Financial Yield Valuation</th>
                      <th className="p-4">Assigned Tenant Instance</th>
                      <th className="p-4">Status Module (Click to cycle)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
                    {houses.map((house) => (
                      <tr
                        key={house.id}
                        className="hover:bg-gray-850/40 transition-colors"
                      >
                        <td className="p-4 font-bold text-white">{house.id}</td>
                        <td className="p-4 text-gray-400 font-medium">
                          {house.type}
                        </td>
                        <td className="p-4 font-mono text-gray-200">
                          {house.rent.toLocaleString()} ETB
                        </td>
                        <td className="p-4 text-gray-400">{house.tenant}</td>
                        <td className="p-4">
                          <button
                            disabled={house.status === "Occupied"}
                            onClick={() =>
                              handleToggleHouseStatus(house.id, house.status)
                            }
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all border ${
                              house.status === "Available"
                                ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                                : house.status === "Occupied"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20 cursor-not-allowed"
                                : house.status === "Reserved"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                                : "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20"
                            }`}
                          >
                            {house.status} 🔄
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 3: TENANTS VIEW (WITH REGISTRATION AND DEACTIVATION CAPABILITIES) ================= */}
          {activeTab === "Tenants" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Authorized Tenants Directory
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  Lease authorization records ledger. Deactivation disconnects
                  standard account routes.
                </p>
              </div>
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-950 text-gray-400 text-xs font-bold uppercase border-b border-gray-800">
                      <th className="p-4">Tenant Code</th>
                      <th className="p-4">Legal Full Name</th>
                      <th className="p-4">Leasehold Unit</th>
                      <th className="p-4">Gateway Endpoint (Phone)</th>
                      <th className="p-4">Account Status</th>
                      <th className="p-4 text-right">System Interventions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
                    {tenants.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-gray-850/40 transition-colors"
                      >
                        <td className="p-4 font-mono text-gray-500">{t.id}</td>
                        <td className="p-4 font-bold text-white">{t.name}</td>
                        <td className="p-4 font-semibold text-blue-400">
                          {t.unit}
                        </td>
                        <td className="p-4 font-mono text-gray-400">
                          {t.phone}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded border ${
                              t.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {t.status === "Active" ? (
                            <button
                              onClick={() =>
                                handleDeactivateTenant(t.id, t.name)
                              }
                              className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 px-2.5 py-1 rounded transition-all"
                            >
                              Deactivate Protocol
                            </button>
                          ) : (
                            <span className="text-xs text-gray-600 font-medium italic">
                              Deactivated Route
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 4: LATE PAYMENTS CONTROLLER ================= */}
          {activeTab === "Late Payments" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Escalation Control Array
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  Automated warning framework targeting high-risk default
                  instances.
                </p>
              </div>
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-950 text-gray-400 text-xs font-bold uppercase border-b border-gray-800">
                      <th className="p-4">Target Unit</th>
                      <th className="p-4">Tenant Entity</th>
                      <th className="p-4">Arrears Balance</th>
                      <th className="p-4">Non-Compliance Level</th>
                      <th className="p-4 text-right">Gateway Action Push</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
                    {latePayments.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-850/40">
                        <td className="p-4 font-bold text-white">{p.unit}</td>
                        <td className="p-4">
                          <div className="font-medium text-gray-200">
                            {p.tenant}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {p.phone}
                          </div>
                        </td>
                        <td className="p-4 font-mono text-red-400 font-bold">
                          {p.rent.toLocaleString()} ETB
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1.5 items-center">
                            {[1, 2, 3].map((dot) => (
                              <div
                                key={dot}
                                className={`w-2 h-2 rounded-full ${
                                  dot <= p.strikes
                                    ? "bg-red-500 animate-pulse"
                                    : "bg-gray-800"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                              ({p.strikes}/3 Levels)
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
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                              loadingId === p.id
                                ? "bg-gray-800 text-gray-500 cursor-wait"
                                : p.strikes >= 2
                                ? "bg-gradient-to-r from-red-600 to-amber-600 text-white animate-bounce"
                                : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                            }`}
                          >
                            {loadingId === p.id
                              ? "Pushing..."
                              : p.strikes >= 2
                              ? "⚠️ Execute Eviction Notice"
                              : "Send Heads-up SMS"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= CONSOLE LOG WINDOW ================= */}
          <div className="bg-black border border-gray-800 rounded-xl p-5 font-mono text-xs shadow-inner mt-8">
            <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-3">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />{" "}
                System Log Buffer Output
              </span>
            </div>
            <div className="h-24 overflow-y-auto space-y-1 text-blue-400">
              {logs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ================= POPUP VIEW MODALS (RENDER LAYERS) ================= */}
      {showHouseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              Initialize New Property Node
            </h3>
            <form onSubmit={handleCreateHouse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Unit ID / Code
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. APT-502"
                  value={newHouse.id}
                  onChange={(e) =>
                    setNewHouse({
                      ...newHouse,
                      id: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    Structural Classification
                  </label>
                  <select
                    value={newHouse.type}
                    onChange={(e) =>
                      setNewHouse({ ...newHouse, type: e.target.value })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Studio</option>
                    <option>Commercial Space</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    Base Rental Yield (ETB)
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="45000"
                    value={newHouse.rent}
                    onChange={(e) =>
                      setNewHouse({ ...newHouse, rent: e.target.value })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHouseModal(false)}
                  className="text-xs font-bold text-gray-400 hover:text-white px-3 py-2"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded"
                >
                  Commit Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTenantModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              Authorize Tenant Identity Route
            </h3>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Legal Profile Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Almaz Kebede"
                  value={newTenant.name}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, name: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Primary Telecom Endpoint (SMS Gateway)
                </label>
                <input
                  required
                  type="text"
                  placeholder="+251911XXXXXX"
                  value={newTenant.phone}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, phone: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Immediate Lease Allocation Unit (Optional)
                </label>
                <select
                  value={newTenant.unit}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, unit: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none font-mono"
                >
                  <option value="">Leave Unassigned (Pool Status)</option>
                  {houses
                    .filter((h) => h.status === "Available")
                    .map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.id} - {h.type} ({h.rent} ETB)
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTenantModal(false)}
                  className="text-xs font-bold text-gray-400 hover:text-white px-3 py-2"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded"
                >
                  Authorize Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
