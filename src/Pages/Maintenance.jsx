import React from "react";
import { useApp } from "../Context/AppContext";
import { useState } from "react";
import toast from "react-hot-toast";

const categories = [
  "General",
  "Plumbing",
  "Electrical",
  "Security",
  "Carpentry",
  "Housekeeping",
];

const priority = ["High", "Medium", "Low"];

const statuses = ["Pending", "In Progress", "Resolved", "Declined"];

const emptyFormData = {
  issue: "",
  category: "",
  location: "",
  reported: "",
  date: "",
  priority: "",
  status: "",
};

const Maintenance = () => {
  const { state, dispath } = useApp(); // Destruction values from use app function
  const { maintenance, residents } = state;
  const [form, setForm] = useState(emptyFormData);
  const [model, setModel] = useState(false);

  // Find the unique record
  const uniqueUser = residents
    .filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.issue ||
      !form.category ||
      !form.location ||
      !form.reported ||
      !form.priority ||
      !form.members ||
      !form.status
    ) {
      toast.error("Please fill in all required fields!"); // Nice red error popup
      return;
    }
    
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* Header Section - Max width keeps things from floating away */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 sm:text-3xl">
              Maintenance Requests
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage and monitor society members and their unit details.
            </p>
          </div>
          <button
            className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all font-medium text-sm w-fit cursor-pointer"
            onClick={() => setModel(true)}
          >
            + Add Request
          </button>
        </div>
      </div>
      <div className="relative max-w-md w-full pb-3">
        <input
          type="text"
          placeholder="Search By"
          className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-gray-400 transition-all focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 outline-none shadow-sm"
        />

        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3 pb-2 group"
          title="Clear search"
        >
          <div className="rounded-md bg-gray-100 p-1 text-gray-400 hover:bg-zinc-900 hover:text-white transition-all">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </button>
      </div>

      {/* Table Container - Constrained width and better shadowing */}
      <div className="max-w-6xl mx-auto">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-500">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Issue
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-center">
                    Location
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-right">
                    Reported By
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-left">
                    Date
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-right">
                    Priority
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-right">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {maintenance.map((res, index) => (
                  <tr
                    className="hover:bg-gray-50/50 transition-colors"
                    key={res.id + index}
                  >
                    <td className="px-6 py-4">{res.issue}</td>
                    <td className="px-6 py-4">{res.category}</td>
                    <td className="px-6 py-4">{res.location}</td>
                    <td className="px-6 py-4">{res.reported}</td>
                    <td className="px-6 py-4">{res.date}</td>
                    <td className="px-6 py-4">{res.priority}</td>
                    <td className="px-6 py-4">{res.status}</td>
                    <td className="px-6 py-4">Action</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {model && (
        <form onSubmit={handleSubmit}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
              <div className="flex items-center justify-between px-8 py-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Add Maintenance Requests
                </h3>
                <button
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                  onClick={() => setModel(false)}
                >
                  Close
                </button>
              </div>

              <div className="px-8 pb-8">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Issue <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="issue"
                      value={form.issue}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={form.category || ""}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none bg- bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                    >
                      <option value="">- Select -</option>
                      {categories.map((cat, key) => (
                        <option key={key} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="location"
                      type="text"
                      value={form.location}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Reported By <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="reported"
                      value={form.reported}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none bg- bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                    >
                      <option value="">- Select -</option>
                      {uniqueUser.map((u, uKey) => (
                        <option value={u.name} key={uKey}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="priority"
                      value={form.priority}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none bg- bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                    >
                      <option value="">- Select -</option>
                      {priority.map((p, pKey) => (
                        <option value={p} key={pKey}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none bg- bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                    >
                      <option value="">- Select -</option>
                      {statuses.map((st, sKey) => (
                        <option value={st} key={sKey}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-10 flex justify-end gap-4">
                  <button
                    className="rounded-lg border border-gray-300 px-8 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
                    onClick={() => setModel(false)}
                  >
                    Cancel
                  </button>
                  <button className="rounded-lg bg-blue-50 px-8 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-all active:scale-95 cursor-pointer">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Maintenance;
