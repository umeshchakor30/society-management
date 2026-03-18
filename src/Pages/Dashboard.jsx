import React from "react";
import { FaUsers, FaUserCheck, FaBuilding, FaUserClock } from "react-icons/fa";
import { useApp } from "../Context/AppContext";

const Dashboard = () => {
  const { state, dispatch } = useApp();
  const { residents } = state;

  // Logic to calculate stats from your 'residents' state
  const totalMembers = residents.length;
  const activeMembers = residents.filter((r) => r.status === "Active").length;
  const inactiveMembers = residents.filter(
    (r) => r.status === "Inactive",
  ).length;
  const owners = residents.filter((r) => r.type === "Owner").length;
  const tenants = residents.filter((r) => r.type === "Tenant").length;

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
      label: "Inactive/Pending",
      value: inactiveMembers,
      icon: <FaUserClock />,
      color: "bg-rose-600",
      text: "text-rose-600",
      bg: "bg-rose-50",
      //width: total > 0 ? `${(inactive / total) * 100}%` : "0%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
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
  );
};

export default Dashboard;
