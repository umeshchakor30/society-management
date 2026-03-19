import React from "react";
import { FaUsers, FaUserCheck, FaBuilding, FaUserClock } from "react-icons/fa";
import { useApp } from "../Context/AppContext";
import { GrVmMaintenance } from "react-icons/gr";
import { PiBatteryHigh } from "react-icons/pi";
import { PiBatteryMedium } from "react-icons/pi";
import { TiBatteryLow } from "react-icons/ti";
import { MdApartment } from "react-icons/md";

const Dashboard = () => {
  const { state, dispatch } = useApp();
  const { residents, maintenance } = state;

  // Logic to calculate stats from your 'residents' state
  const totalMembers = residents.length;
  const activeMembers = residents.filter((r) => r.status === "Active").length;
  const inactiveMembers = residents.filter(
    (r) => r.status === "Inactive",
  ).length;
  const owners = residents.filter((r) => r.type === "Owner").length;
  const tenants = residents.filter((r) => r.type === "Tenant").length;

  // Logic to calculate the maintenance states
  const totalMaintenance = maintenance.length;
  const highPriority = maintenance.filter((m) => m.priority === "High").length;
  const mediumPriority = maintenance.filter(
    (m) => m.priority === "Medium",
  ).length;
  const lowPriority = maintenance.filter((m) => m.priority === "Medium").length;

  const stats = [
    {
      label: "Total Members",
      value: totalMembers,
      icon: <FaUsers />,
      color: "bg-blue-600",
      text: "text-blue-600",
      bg: "bg-blue-50",
      width: "100%",
    },
    {
      label: "Active Residents",
      value: activeMembers,
      icon: <FaUserCheck />,
      color: "bg-emerald-600",
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      // width: total > 0 ? `${(active / total) * 100}%` : "0%",
    },
    {
      label: "Property Owners",
      value: owners,
      icon: <FaBuilding />,
      color: "bg-orange-600",
      text: "text-orange-600",
      bg: "bg-orange-50",
      // width: total > 0 ? `${(owners / total) * 100}%` : "0%",
    },
    {
      label: "Tenants",
      value: tenants,
      icon: <FaUserClock />,
      color: "bg-rose-600",
      text: "text-rose-600",
      bg: "bg-rose-50",
      //width: total > 0 ? `${(inactive / total) * 100}%` : "0%",
    },
  ];

  // Maintenance Stats
  const mainenanceStats = [
    {
      label: "Total Request",
      value: totalMaintenance,
      icon: <GrVmMaintenance />,
      color: "bg-blue-600",
      text: "text-blue-600",
      bg: "bg-blue-50",
      width: "100%",
    },
    {
      label: "High Priority",
      value: highPriority,
      icon: <PiBatteryHigh />,
      color: "bg-rose-60",
      text: "text-rose-600",
      bg: "bg-rose-50",
      // width: total > 0 ? `${(active / total) * 100}%` : "0%",
    },
    {
      label: "Medium Priority",
      value: mediumPriority,
      icon: <PiBatteryMedium />,
      color: "bg-orange-600",
      text: "text-orange-600",
      bg: "bg-orange-50",
      // width: total > 0 ? `${(owners / total) * 100}%` : "0%",
    },
    {
      label: "Low Priority",
      value: lowPriority,
      icon: <TiBatteryLow />,
      color: "bg-rose-600",
      text: "text-rose-600",
      bg: "bg-rose-50",
      //width: total > 0 ? `${(inactive / total) * 100}%` : "0%",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 sm:text-3xl">
              Residents
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.text} text-xl`}>
                {stat.icon}
              </div>
            </div>
            {/* Progress bar for visual flavor */}
            <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              {/* <div className={`${stat.color} h-full w-2/3 opacity-80`} /> */}
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto mb-8 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 sm:text-3xl">
              Maintenance Requests
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8">
          {mainenanceStats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div
                  className={`p-3 rounded-xl ${stat.bg} ${stat.text} text-xl`}
                >
                  {stat.icon}
                </div>
              </div>
              {/* Progress bar for visual flavor */}
              <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                {/* <div className={`${stat.color} h-full w-2/3 opacity-80`} /> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 sm:text-3xl">
              Bills & Payments
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
