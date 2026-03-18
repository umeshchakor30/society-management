import React from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaBuildingCircleArrowRight } from "react-icons/fa6";
import { GrVmMaintenance } from "react-icons/gr";
import { FaMoneyBills } from "react-icons/fa6";
import { GrAnnounce } from "react-icons/gr";
import { useApp } from "../Context/AppContext";

const Sidebar = () => {
  const NavItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      iconLi: (
        <>
          <AiOutlineDashboard />
          <span>Dashboard</span>
        </>
      ),
    },

    {
      key: "residents",
      label: "Residents",
      iconLi: (
        <>
          <FaBuildingCircleArrowRight />
          <span>Residents</span>
        </>
      ),
    },
    {
      key: "maintenance",
      label: "Maintenance",
      iconLi: (
        <>
          <GrVmMaintenance />
          <span>Maintenance Requests</span>
        </>
      ),
    },
    {
      key: "bills",
      label: "Bills & Payments",
      iconLi: (
        <>
          <FaMoneyBills />
          <span>Bills & Payments</span>
        </>
      ),
    },
    {
      key: "annoucements",
      label: "Aannoucements",
      iconLi: (
        <>
          <GrAnnounce />
          <span>Announcements</span>
        </>
      ),
    },
  ];

  const { dispatch } = useApp();
  return (
    <nav className="bg-[#f7f7f8] h-screen fixed top-0 left-0 min-w-[250px] py-6 px-4">
      <div className="relative text-shadow-amber-300 text-shadow-md text-2xl text-amber-700 dark:amber-700 font-bold ">
        Gajanan Apartment
      </div>
      <div className="overflow-auto py-6 h-full mt-4">
        <ul className="space-y-2">
          {NavItems.map((menus, index) => {
            return (
              <li key={index}>
                <a
                  href="#"
                  className="text-slate-800 font-medium hover:text-slate-900 hover:bg-gray-200 text-[15px] flex items-center rounded px-4 py-2 transition-all p-2 space-x-2"
                  onClick={() => {
                    dispatch({ type: "SET_LAYOUT", payload: menus.key });
                  }}
                >
                  {menus.iconLi}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
