"use client";

import React, { useState } from "react";

export default function RentXAdminDashboard() {
  // 1. ACTIVE SIDEBAR NAVIGATION TAB LINK STATE
  const [activeTab, setActiveTab] = useState("Dashboard");

  // 2. MODAL & TELEBIRR TRANSACTION PANEL STATES
  const [showHouseModal, setShowHouseModal] = useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // DATA ENGINE CONTEXT FOR NEW ENTRIES
  const [newHouse, setNewHouse] = useState({
    id: "",
    type: "Apartment",
    rent: "",
    status: "Available",
  });
  const [newTenant, setNewTenant] = useState({ name: "", phone: "", unit: "" });

  // SYSTEM PREFERENCES SETTINGS STATE
  const [settings, setSettings] = useState({
    companyName: "ADDIS ABABA CITY ADMIN.",
    smsGateway: "Twilio Cloud Sandbox",
    currencyCode: "ETB",
    maxStrikes: "3",
    autoEvict: true,
  });

  // 3. REACTIVE STATE STORAGE LAYERS (Matches layout metric counts exactly)
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

  const [pendingBills, setPendingBills] = useState([
    {
      id: "INV-2026-001",
      tenant: "Sarah Jenkins",
      unit: "A-204",
      amount: 32000,
      month: "June 2026",
      status: "Unpaid",
    },
    {
      id: "INV-2026-002",
      tenant: "Michael Kassa",
      unit: "A-205",
      amount: 18000,
      month: "June 2026",
      status: "Unpaid",
    },
    {
      id: "INV-2026-003",
      tenant: "Abebe Balkew",
      unit: "H-101",
      amount: 45000,
      month: "June 2026",
      status: "Paid",
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

  // LIVE ANALYTICAL AGGREGATION COUNTERS
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
  const collectedRent = pendingBills
    .filter((b) => b.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 520600 - 45000);
  const unpaidBalance = expectedRent - collectedRent;
  const collectionRate = Math.round((collectedRent / expectedRent) * 100);

  // LOG LOGIC FEEDBACK CONTROL
  const [logs, setLogs] = useState([
    "AA Core Framework Initialized: Reconfigured color scheme contexts loaded.",
  ]);
  const addLog = (msg: string) =>
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  // 4. ACTION MUTATIONS & INTERACTION CONTROLLERS
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
      `Asset Implemented: Architectural cluster node assigned to unit ID ${entry.id}.`
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
    if (newTenant.unit) {
      setHouses(
        houses.map((h) =>
          h.id === newTenant.unit
            ? { ...h, status: "Occupied", tenant: newTenant.name }
            : h
        )
      );
      setPendingBills([
        {
          id: `INV-2026-09${houses.length}`,
          tenant: newTenant.name,
          unit: newTenant.unit,
          amount: 25000,
          month: "June 2026",
          status: "Unpaid",
        },
        ...pendingBills,
      ]);
    }
    addLog(
      `Identity Framework Provisioned: Authorized credentials token issued for ${entry.name}.`
    );
    setShowTenantModal(false);
    setNewTenant({ name: "", phone: "", unit: "" });
  };

  const handleDeactivateTenant = (id: string, name: string) => {
    setTenants(
      tenants.map((t) => (t.id === id ? { ...t, status: "Deactivated" } : t))
    );
    addLog(
      `Security Isolation Triggered: Revoked pipeline routing context profiles for tenant ${name}.`
    );
  };

  // TELEBIRR PAYMENTS OVERLAY HANDLER
  const executeTelebirrPaymentSimulation = () => {
    if (!selectedInvoice) return;
    setIsProcessingPayment(true);
    addLog(
      `Telebirr Merchant Gateway: Dispatched push authorization request to node account link.`
    );

    setTimeout(() => {
      setPendingBills(
        pendingBills.map((b) =>
          b.id === selectedInvoice.id ? { ...b, status: "Paid" } : b
        )
      );
      addLog(
        `Telebirr Transaction Validated: Invoice reference ${selectedInvoice.id} settled successfully via secure wallet hook.`
      );
      setIsProcessingPayment(false);
      setSelectedInvoice(null);
    }, 1800);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600">
      {/* ================= SIDEBAR NAVIGATION PANEL ================= */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-white">
              Rent<span className="text-blue-500">X</span>
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">
            Rental Operations Admin
          </p>
        </div>

        <div className="p-4 flex-1 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Management Framework
          </p>
          <nav className="space-y-1">
            {[
              { name: "Dashboard", icon: "📊" },
              { name: "Houses", icon: "🏢" },
              { name: "Tenants", icon: "👥" },
              { name: "Rentals", icon: "📄" },
              { name: "Payments", icon: "💳" },
              { name: "Late Payments", icon: "🔔" },
              { name: "Notices", icon: "💬" },
              { name: "Reports", icon: "📈" },
              { name: "Settings", icon: "⚙️" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  addLog(
                    `Redirected control view target path to: ${item.name}`
                  );
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 ${
                  activeTab === item.name
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-blue-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-400">
              Environment Active
            </span>
          </div>
        </div>
      </aside>

      {/* ================= MAIN OPERATIONAL WORKSPACE ================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>ADDIS ABABA CITY ADMIN. PORTAL</span>
            <span>/</span>
            <span className="text-slate-300 font-semibold">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "Houses" && (
              <button
                onClick={() => setShowHouseModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-md transition-all shadow-md"
              >
                + Create Asset Unit
              </button>
            )}
            {activeTab === "Tenants" && (
              <button
                onClick={() => setShowTenantModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-md transition-all shadow-md"
              >
                + Register Tenant Profile
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* ================= TAB 1: DASHBOARD VIEW WITH INTEGRATED METRICS BAR CHARTING ================= */}
          {activeTab === "Dashboard" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Dashboard Command
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Unified overview for government asset telemetry modules.
                </p>
              </div>

              {/* STAT SUMMARY LABELS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-start shadow-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Total Fleet Volume
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      {totalHousesCount} Units
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {availableCount} deployment vacancies
                    </p>
                  </div>
                  <span className="p-2 bg-slate-800 text-blue-400 rounded-lg">
                    🏢
                  </span>
                </div>
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-start shadow-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Collected Liquidity
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      {collectedRent.toLocaleString()} ETB
                    </h3>
                    <p className="text-xs text-emerald-400 mt-1 font-bold">
                      {collectionRate}% Net Performance
                    </p>
                  </div>
                  <span className="p-2 bg-slate-800 text-emerald-400 rounded-lg">
                    ✅
                  </span>
                </div>
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-start shadow-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Outstanding Deficit
                    </span>
                    <h3 className="text-2xl font-black text-red-400 mt-1">
                      {unpaidBalance.toLocaleString()} ETB
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Pending allocation processing
                    </p>
                  </div>
                  <span className="p-2 bg-slate-800 text-red-400 rounded-lg">
                    📊
                  </span>
                </div>
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-start shadow-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Escalated Arrears
                    </span>
                    <h3 className="text-2xl font-black text-amber-500 mt-1">
                      24 Active
                    </h3>
                    <p className="text-xs text-amber-400 mt-1 font-medium">
                      Flagged compliance risks
                    </p>
                  </div>
                  <span className="p-2 bg-slate-800 text-amber-400 rounded-lg">
                    ⚠️
                  </span>
                </div>
              </div>

              {/* METRIC GRAPH LABELS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Ratio 1: Collections Liquidation Efficiency Track */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Financial Inflow Ratio
                  </h3>
                  <p className="text-sm font-bold text-white mb-4">
                    Fulfillment Level Progress Index
                  </p>

                  <div className="space-y-4 my-2">
                    <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${collectionRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-blue-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />{" "}
                        Settled: {collectionRate}%
                      </span>
                      <span className="text-slate-500">
                        Target Framework Ceiling: 100%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Ratio 2: Housing Inventory Deployment Mix Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Asset Allocation Map
                  </h3>
                  <p className="text-sm font-bold text-white mb-4">
                    Proportional Footprint Distribution Bar
                  </p>

                  <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 mb-4">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: "76%" }}
                      title="Occupied"
                    />
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: "15%" }}
                      title="Available"
                    />
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: "5%" }}
                      title="Reserved"
                    />
                    <div
                      className="h-full bg-slate-600"
                      style={{ width: "4%" }}
                      title="Maintenance"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-[11px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{" "}
                      Occupied ({occupiedCount})
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                      Vacant ({availableCount})
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{" "}
                      Reserved ({reservedCount})
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />{" "}
                      Repair ({maintenanceCount})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: HOUSES GRID MODULE ================= */}
          {activeTab === "Houses" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Housing Inventory Ledger
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Configuration mapping dashboard for state real estate
                  structures.
                </p>
              </div>
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
                      <th className="p-4">Unit Code Reference</th>
                      <th className="p-4">Structural Class</th>
                      <th className="p-4">Yield Rate Valuations</th>
                      <th className="p-4">Current Tenant Target</th>
                      <th className="p-4">Operational State Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                    {houses.map((house) => (
                      <tr
                        key={house.id}
                        className="hover:bg-slate-850/40 transition-all"
                      >
                        <td className="p-4 font-bold text-white font-mono">
                          {house.id}
                        </td>
                        <td className="p-4 text-slate-400 font-medium">
                          {house.type}
                        </td>
                        <td className="p-4 font-mono">
                          {house.rent.toLocaleString()} ETB
                        </td>
                        <td className="p-4 text-slate-400">{house.tenant}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              house.status === "Available"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : house.status === "Occupied"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
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

          {/* ================= TAB 3: TENANTS DIRECTORY ROUTER ================= */}
          {activeTab === "Tenants" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Registered Tenant Protocols
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Authorized profiles dictionary database ledger records.
                </p>
              </div>
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
                      <th className="p-4">Profile Code Token</th>
                      <th className="p-4">Full Legal Name</th>
                      <th className="p-4">Allocated Asset Node</th>
                      <th className="p-4">SMS Endpoint Contact</th>
                      <th className="p-4">Account Routing Status</th>
                      <th className="p-4 text-right">
                        System Management Intervention
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                    {tenants.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-slate-850/40 transition-colors"
                      >
                        <td className="p-4 font-mono text-slate-500">{t.id}</td>
                        <td className="p-4 font-bold text-white">{t.name}</td>
                        <td className="p-4 font-semibold text-blue-400 font-mono">
                          {t.unit}
                        </td>
                        <td className="p-4 font-mono text-slate-400">
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
                              className="text-xs font-bold text-red-400 hover:text-white bg-red-950/30 border border-red-900/40 hover:bg-red-600 px-2.5 py-1 rounded transition-all"
                            >
                              Deactivate Route Context
                            </button>
                          ) : (
                            <span className="text-xs text-slate-600 font-medium italic">
                              Pipeline Terminated
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

          {/* ================= TAB 4: RENTALS STATIC PREVIEW CONTAINER ================= */}
          {activeTab === "Rentals" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Active Leasehold Contracts
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Regulatory lease structural terms monitoring terminal config.
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
                <span className="text-4xl block mb-2">📄</span>
                <p className="text-sm font-semibold text-slate-400">
                  Lease Agreement Configuration Matrix Mount
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Cross-referencing legal framework arrays matching operational
                  housing targets.
                </p>
              </div>
            </div>
          )}

          {/* ================= TAB 5: PAYMENTS (INTERACTIVE TELEBIRR GATEWAY INTERACTION DRIVER) ================= */}
          {activeTab === "Payments" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Billing Settlements Console
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Process payment flows directly through simulated local mobile
                  platform endpoints.
                </p>
              </div>

              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
                      <th className="p-4">Invoice Reference</th>
                      <th className="p-4">Target Debtor Entity</th>
                      <th className="p-4">Assigned Unit</th>
                      <th className="p-4">Billing Cycle Month</th>
                      <th className="p-4">Outstanding Due Amount</th>
                      <th className="p-4 text-right">
                        Gateway Settlement Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                    {pendingBills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-slate-850/40">
                        <td className="p-4 font-mono text-slate-400 font-bold">
                          {bill.id}
                        </td>
                        <td className="p-4 font-medium text-white">
                          {bill.tenant}
                        </td>
                        <td className="p-4 font-mono text-blue-400">
                          {bill.unit}
                        </td>
                        <td className="p-4 text-slate-400">{bill.month}</td>
                        <td className="p-4 font-mono font-bold text-gray-200">
                          {bill.amount.toLocaleString()} ETB
                        </td>
                        <td className="p-4 text-right">
                          {bill.status === "Unpaid" ? (
                            <button
                              onClick={() => setSelectedInvoice(bill)}
                              className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/20 text-white font-bold text-xs px-3 py-1.5 rounded transition-all shadow-sm"
                            >
                              ⚡ Pay with Telebirr
                            </button>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-black uppercase">
                              Settled Clear
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

          {/* ================= TAB 6: LATE PAYMENTS CONTROLLER ================= */}
          {activeTab === "Late Payments" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Arrears Infraction Control Array
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Targeted enforcement warning compliance loops targeting
                  accounts.
                </p>
              </div>
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
                      <th className="p-4">Target Property Node</th>
                      <th className="p-4">Tenant Account Entity</th>
                      <th className="p-4">Deficit Debt Volume</th>
                      <th className="p-4">Compliance Infraction Strikes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                    {latePayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-850/40">
                        <td className="p-4 font-bold text-white font-mono">
                          {p.unit}
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-200">
                            {p.tenant}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
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
                                    : "bg-slate-800"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-slate-500 ml-1">
                              ({p.strikes}/{settings.maxStrikes} Flags)
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 7: NOTICES PREVIEW MODAL FRAMEWORK ================= */}
          {activeTab === "Notices" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  System Communication Engine
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Dispatched automated templates routing overview logs tracking
                  history logs.
                </p>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                <div className="p-4 bg-slate-950 rounded border border-slate-850">
                  <span className="text-xs font-bold text-amber-400 font-mono uppercase block mb-1">
                    Notice Dispatch Buffer Context Template
                  </span>
                  <p className="text-sm font-mono text-slate-300">
                    "Dear Abebe Kebede, your rent payment of 8,000 ETB for house
                    H-001 is late. Please complete your payment as soon as
                    possible."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 8: REPORTS INTERFACE PANEL ================= */}
          {activeTab === "Reports" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Analytical Asset Reports
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Export operational and financial metrics across property
                  blocks.
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
                <span className="text-4xl block mb-2">📈</span>
                <p className="text-sm font-semibold text-slate-400">
                  Yield and Deficiency Reporting Matrix
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Ready to compile data files matching structural
                  configurations.
                </p>
              </div>
            </div>
          )}

          {/* ================= TAB 9: SETTINGS PREFERENCES INTERFACE PANEL ================= */}
          {activeTab === "Settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  System Preference Configurations
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Adjust workspace parameters, automated rules, and API
                  connection properties.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl max-w-2xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addLog(
                      "System Update: Configuration matrix parameters updated successfully."
                    );
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                        Administrative Node Title
                      </label>
                      <input
                        type="text"
                        value={settings.companyName}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            companyName: e.target.value,
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                        Telecom Gateway Server Provider
                      </label>
                      <input
                        type="text"
                        value={settings.smsGateway}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            smsGateway: e.target.value,
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                        Currency Code Assignment
                      </label>
                      <input
                        type="text"
                        value={settings.currencyCode}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            currencyCode: e.target.value,
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                        Compliance Threshold (Max Strikes)
                      </label>
                      <select
                        value={settings.maxStrikes}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            maxStrikes: e.target.value,
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="3">3 Infraction Strikes Limit</option>
                        <option value="5">5 Infraction Strikes Limit</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded shadow-md transition-all"
                    >
                      Save Updated Configurations
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================= CONSOLE OPERATION LOG OUTFLOW TERMINAL ================= */}
          <div className="bg-black border border-slate-800 rounded-xl p-5 font-mono text-xs shadow-inner mt-8">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />{" "}
                System Log Stream Buffer
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

      {/* ================= POPUP DRAWERS & SIMULATORS (TELEBIRR MODAL SELECTION) ================= */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-16 h-16 bg-emerald-500 text-white font-black text-2xl flex items-center justify-center rounded-full mx-auto mb-4 tracking-tighter">
              tb
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Telebirr Merchant Gateway
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Securing payment channel routing link for invoice reference.
            </p>

            <div className="bg-slate-950 p-4 rounded border border-slate-850 font-mono text-left space-y-2 mb-6 text-xs">
              <div className="flex justify-between">
                <span>Target Unit:</span>
                <span className="text-white font-bold">
                  {selectedInvoice.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tenant:</span>
                <span className="text-white font-bold">
                  {selectedInvoice.tenant}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold">
                <span>Total Due:</span>
                <span className="text-emerald-400">
                  {selectedInvoice.amount.toLocaleString()} ETB
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                disabled={isProcessingPayment}
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 rounded transition-all"
              >
                Cancel
              </button>
              <button
                disabled={isProcessingPayment}
                onClick={executeTelebirrPaymentSimulation}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded transition-all shadow-md flex items-center justify-center gap-1"
              >
                {isProcessingPayment
                  ? "Connecting..."
                  : "Authorize API Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURATOR LAYERS */}
      {showHouseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              Initialize Property Asset Node
            </h3>
            <form onSubmit={handleCreateHouse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Asset Unit ID / Code
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. H-209"
                  value={newHouse.id}
                  onChange={(e) =>
                    setNewHouse({
                      ...newHouse,
                      id: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Property Class
                  </label>
                  <select
                    value={newHouse.type}
                    onChange={(e) =>
                      setNewHouse({ ...newHouse, type: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Studio</option>
                    <option>Commercial Space</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Rental Cost Yield (ETB)
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="35000"
                    value={newHouse.rent}
                    onChange={(e) =>
                      setNewHouse({ ...newHouse, rent: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHouseModal(false)}
                  className="text-xs font-bold text-slate-400 hover:text-white px-3 py-2"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded"
                >
                  Commit Asset Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTenantModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              Register Tenant Route Signature
            </h3>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Legal Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Almaz Kebede"
                  value={newTenant.name}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, name: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Gateway Connection Endpoint (Phone Number)
                </label>
                <input
                  required
                  type="text"
                  placeholder="+251911XXXXXX"
                  value={newTenant.phone}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, phone: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Immediate Unit Assignment Allocation
                </label>
                <select
                  value={newTenant.unit}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, unit: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none font-mono"
                >
                  <option value="">Leave Pool Status Unassigned</option>
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
                  className="text-xs font-bold text-slate-400 hover:text-white px-3 py-2"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded"
                >
                  Commit Signature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
