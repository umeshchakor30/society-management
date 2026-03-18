import React, { useState, useCallback } from "react";
import { BsLayoutThreeColumns } from "react-icons/bs";
import { initialResidents } from "../Data/SocietyData";
import { useApp } from "../Context/AppContext";
import { MdOutlineEmail } from "react-icons/md";
import { CiMobile1 } from "react-icons/ci";
import toast from "react-hot-toast";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const emptyFormData = {
  name: "",
  flat: "",
  block: "A",
  type: "Owner",
  phone: "",
  email: "",
  members: "",
  status: "Active",
};

// Validates common email formats (e.g., user@domain.com)
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validates Indian mobile numbers (10 digits starting with 6-9)
const validatePhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};

// For searching we are using the debounce function
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const Residents = () => {
  const { state, dispatch } = useApp();
  const { residents } = state;
  const [model, setModel] = useState(false);
  const [form, setForm] = useState(emptyFormData);
  const [isSubmitting, isSetSubmittig] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [editResident, setEditResident] = useState(null);
  const [deleteResident, setDeleteResident] = useState();

  const handlePopup = (action) => {
    setModel(action);
    setEditResident(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.flat ||
      !form.block ||
      !form.phone ||
      !form.email ||
      !form.members ||
      !form.status
    ) {
      toast.error("Please fill in all required fields!"); // Nice red error popup
      return;
    }

    // 2. Email Format Validation
    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    // 3. Phone Number Validation (10 Digits)
    if (!validatePhone(form.phone)) {
      toast.error("Please enter a valid 10-digit phone number!");
      return;
    }

    isSetSubmittig(true);
    const loadingToast = toast.loading(
      editResident ? "Updating resident..." : "Adding resident...",
    );
    try {
      let url = "http://localhost:5000/residents";
      let method = "POST";

      if (editResident) {
        url = `${url}/${editResident}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        if (editResident) {
          dispatch({
            type: "UPDATE_RESIDENTIAL",
            payload: { ...form, id: editResident },
          });
        } else {
          const newData = await response.json();
          dispatch({ type: "ADD_RESIDENTIAL", payload: newData });
        }
        toast.dismiss(loadingToast);

        toast.success(
          editResident
            ? "Resident updated successfully!"
            : "Resident added successfully!",
        );

        setTimeout(() => {
          setForm(emptyFormData);
          setModel(false);
        }, 5000);
      }
    } catch (error) {
      toast.error("Something went wrong!", { id: loadingToast });
    } finally {
      isSetSubmittig(false);
    }
  };

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

  // Filer in json array
  const filterResidensts = residents.filter((res) => {
    const search = searchTerm.toLowerCase();
    return (
      res.name?.toLowerCase().includes(search) ||
      res.flat?.toLowerCase().includes(search) ||
      res.phone?.toLowerCase().includes(search)
    );
  });

  const clearSearch = () => {
    setSearchTerm("");
    debounceSearch("");
    setInputValue("");
  };

  const handleEdit = (res) => {
    //console.log("res ==>> ", res.id);
    setEditResident(res.id);
    setForm({ ...res });
    setModel(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this resident?"))
      return;

    const loadingToast = toast.loading("Deleting resident...");

    try {
      const response = await fetch(`http://localhost:5000/residents/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch({ type: "DELETE_RESIDENTIAL", payload: id });
        toast.success("Resident removed successfully!", { id: loadingToast });
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
              Residents
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage and monitor society members and their unit details.
            </p>
          </div>
          <button
            className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all font-medium text-sm w-fit cursor-pointer"
            onClick={() => handlePopup(true)}
          >
            + Add New Member
          </button>
        </div>
      </div>
      <div className="relative max-w-md w-full pb-3">
        <input
          type="text"
          placeholder="Search by name, flat, or phone..."
          className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-gray-400 transition-all focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 outline-none shadow-sm"
          value={inputValue}
          onChange={handleSearchChange} // Connect your filter logic here
        />

        {inputValue && (
          <button
            onClick={clearSearch}
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
        )}
      </div>

      {/* Table Container - Constrained width and better shadowing */}
      <div className="max-w-6xl mx-auto">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-500">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Resident
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Flat Details
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-center">
                    Family
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
                {filterResidensts.map((res, index) => (
                  <tr
                    className="hover:bg-gray-50/50 transition-colors"
                    key={res.id + index}
                  >
                    {/* 1. Full Name & Contact */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-base leading-none">
                        {res.name}
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <CiMobile1
                            className="shrink-0 text-gray-400 mr-1.5"
                            size={14}
                          />
                          {res.phone}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MdOutlineEmail
                            className="shrink-0 text-gray-400 mr-1.5"
                            size={14}
                          />
                          {res.email}
                        </div>
                      </div>
                    </td>

                    {/* 2. Unit Details with Badges */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">
                        {res.flat}
                      </div>
                      <div className="mt-1.5 flex gap-1.5">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          Block {res.block}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${
                            res.type === "Owner"
                              ? "bg-purple-50 text-purple-700 ring-purple-700/10"
                              : "bg-orange-50 text-orange-700 ring-orange-700/10"
                          }`}
                        >
                          {res.type}
                        </span>
                      </div>
                    </td>

                    {/* 3. Family Members - Centered */}
                    <td className="px-6 py-4 text-center font-medium text-gray-700">
                      <span className="bg-gray-100 px-2.5 py-1 rounded-lg text-xs">
                        {res.members} Members
                      </span>
                    </td>

                    {/* 4. Status - Right Aligned */}
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          res.status.toLowerCase() === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${res.status.toLowerCase() === "active" ? "bg-green-600" : "bg-red-600"}`}
                        ></span>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        {/* Edit Button */}
                        <button
                          title="Edit Resident"
                          className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 cursor-pointer shadow-sm"
                          onClick={() => handleEdit(res)}
                        >
                          <FaUserEdit size={18} />
                        </button>

                        {/* Delete Button */}
                        <button
                          title="Delete Resident"
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 cursor-pointer shadow-sm"
                          onClick={() => handleDelete(res.id)} // Assuming you have a delete handler
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filterResidensts.length === 0 && (
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
                  {editResident ? "Edit Resident" : "Add Resident"}
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
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      value={form.name}
                      required
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Flat Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="flat"
                      placeholder="e.g. A-101"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                      value={form.flat}
                      required
                      onChange={(e) =>
                        setForm({ ...form, flat: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Block <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="block"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none bg- bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                      required
                      value={form.block || ""}
                      onChange={(e) =>
                        setForm({ ...form, block: e.target.value })
                      }
                    >
                      <option value="">- Select -</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none bg- bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                      value={form.type || ""}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                    >
                      <option value="">- Select -</option>
                      <option value="Tenant">Tenant</option>
                      <option value="Owner">Owner</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      type="text"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Family Members <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="members"
                      type="text"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      required
                      maxLength={2}
                      value={form.members}
                      onChange={(e) =>
                        setForm({ ...form, members: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none bg- bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                      value={form.status || ""}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="">- Select -</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-10 flex justify-end gap-4">
                  <button
                    className="rounded-lg border border-gray-300 px-8 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
                    required
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
                      : editResident
                        ? "Edit Resident"
                        : "Add Resident"}
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

export default Residents;
