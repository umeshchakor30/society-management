import React from "react";
import { useApp } from "../Context/AppContext";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { GrHostMaintenance } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { debounce } from "../Utils/helpers";

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
  priority: "",
  status: "",
};

const Maintenance = () => {
  const { state, dispatch } = useApp(); // Destruction values from use app function
  const { maintenance, residents } = state;
  const [form, setForm] = useState(emptyFormData);
  const [model, setModel] = useState(false);
  const [editMaintenance, setEditMaintenance] = useState("");
  const [isSubmitting, isSetSubmittig] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Find the unique record
  const uniqueUser = residents
    .filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.issue ||
      !form.category ||
      !form.location ||
      !form.reported ||
      !form.priority ||
      !form.status
    ) {
      toast.error("Please fill in all required fields!"); // Nice red error popup
      return;
    }

    isSetSubmittig(true);
    const loadingToast = toast.loading(
      editMaintenance
        ? "Updating maintenance request..."
        : "Adding maintenance request...",
    );

    try {
      let url = "http://localhost:5000/maintenance";
      let method = "POST";

      if (editMaintenance) {
        url = `${url}/${editMaintenance}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        if (editMaintenance) {
          dispatch({
            type: "UPDATE_MAINTENANCE",
            payload: { ...form, id: editMaintenance },
          });
        } else {
          const newData = await response.json();
          const date = new Date().toISOString().split("T")[0];
          newData.date = date;
          dispatch({ type: "ADD_MAINTENANCE", payload: newData });
        }
        toast.dismiss(loadingToast);

        toast.success(
          editMaintenance
            ? "Maintenance request updated successfully!"
            : "Maintenance request added successfully!",
        );

        setTimeout(() => {
          setForm(emptyFormData);
          setModel(false);
        }, 8000);
      }
    } catch (error) {
      toast.error("Something went wrong!", { error });
    } finally {
      isSetSubmittig(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    debounceSearch("");
    setInputValue("");
  };

  const handleEdit = (res) => {
    setForm({ ...res });
    setModel(true);
    setEditMaintenance(res.id);
  };

  // Filer in json array
  const filterMaintenance = maintenance.filter((res) => {
    const search = searchTerm.toLowerCase();
    return (
      res.issue?.toLowerCase().includes(search) ||
      res.category?.toLowerCase().includes(search) ||
      res.location?.toLowerCase().includes(search) ||
      res.reported?.toLowerCase().includes(search) ||
      res.priority?.toLowerCase().includes(search) ||
      res.status?.toLowerCase().includes(search)
    );
  });

  const debounceSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 500),
    [],
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debounceSearch(value);
    setInputValue(value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this request?"))
      return;

    const loadingToast = toast.loading("Deleting request...");

    try {
      const response = await fetch(`http://localhost:5000/maintenance/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch({ type: "DELETE_MAINTENANCE", payload: id });
        toast.success("Maintenance Request removed successfully!", {
          id: loadingToast,
        });
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Could not delete from server", { id: loadingToast });
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
          value={inputValue}
          className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-gray-400 transition-all focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 outline-none shadow-sm"
          onChange={handleSearchChange}
        />

        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3 pb-2 group"
          title="Clear search"
          onClick={clearSearch}
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
                  <th className="px-6 py-4 font-semibold text-gray-900 text-left">
                    Reported By
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-left">
                    Date
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-left">
                    Priority
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-left">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filterMaintenance.map((res, index) => (
                  <tr
                    className="hover:bg-gray-50/80 transition-colors group"
                    key={res.id || index}
                  >
                    {/* Issue details with bold title */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm">
                          {res.issue}
                        </span>
                        <span className="text-xs text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-full mt-1 font-medium">
                          {res.category}
                        </span>
                      </div>
                    </td>

                    {/* Reported info with icons or subtle text */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">
                          {res.reported}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                          {res.location}
                        </p>
                      </div>
                    </td>

                    {/* Formatted Date */}
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {res.date}
                    </td>

                    {/* Priority Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          res.priority === "High"
                            ? "bg-rose-50 text-rose-600 border-rose-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {res.priority}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          res.status === "Open"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${res.status === "Open" ? "bg-blue-600 animate-pulse" : "bg-emerald-600"}`}
                        ></span>
                        {res.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          title="Edit Maintenance"
                          className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 cursor-pointer shadow-sm"
                          onClick={() => handleEdit(res)}
                        >
                          <GrHostMaintenance size={18} />
                        </button>
                        <button
                          title="Delete Maintenance"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          onClick={() => handleDelete(res.id)}
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filterMaintenance.length === 0 && (
              <h3 className="text-lg text-gray-900 text-center pt-2 pb-2">
                No residents found
              </h3>
            )}
          </div>
        </div>
      </div>

      {model && (
        <form onSubmit={handleSubmit}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
              <div className="flex items-center justify-between px-8 py-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editMaintenance
                    ? "Edit Maintenance Requests"
                    : "Add Maintenance Requests"}
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
                      onChange={(e) =>
                        setForm({ ...form, issue: e.target.value })
                      }
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
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
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
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
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
                      onChange={(e) =>
                        setForm({ ...form, reported: e.target.value })
                      }
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
                      onChange={(e) =>
                        setForm({ ...form, priority: e.target.value })
                      }
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
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
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
                    {isSubmitting && (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    )}
                    {isSubmitting
                      ? "Processing..."
                      : editMaintenance
                        ? "Edit Maintenance"
                        : "Add Maintenance"}
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
