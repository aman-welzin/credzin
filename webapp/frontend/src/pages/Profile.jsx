import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProfileField = ({ label, value }) => (
  <div>
    <span className="font-semibold">{label}:</span>{" "}
    <span className="text-gray-700">{value}</span>
  </div>
);

const ageOptions = ["18-24", "25-34", "35-44", "45-54", "55+"];
const salaryOptions = ["0-10000", "10000-25000", "25000-50000", "50000-100000", "100000+"];
const expenseOptions = ["0-5000", "5000-15000", "15000-30000", "30000+"];

const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const cards = useSelector((state) => state.cart.cart);

  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
        console.log("This is the reduz user: ",user);
      setEditUser(user);
    }
  }, [user]);

  const handleEdit = () => {
    setEditUser(user);
    setEditMode(true);
  };

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: Replace with your PATCH/PUT API call and dispatch update
    setTimeout(() => {
      // Simulate successful save
      setEditMode(false);
      setSaving(false);
    }, 1000);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditUser(user);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
      <div className="space-y-4">
        <ProfileField
          label="First Name"
          value={
            editMode ? (
              <input
                name="firstName"
                value={editUser.firstName || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              user.firstName
            )
          }
        />
        <ProfileField
          label="Last Name"
          value={
            editMode ? (
              <input
                name="lastName"
                value={editUser.lastName || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              user.lastName
            )
          }
        />
        <ProfileField
          label="Email"
          value={
            editMode ? (
              <input
                name="email"
                value={editUser.email || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              user.email
            )
          }
        />
        <ProfileField
          label="Contact"
          value={
            editMode ? (
              <input
                name="contact"
                value={editUser.contact || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
                placeholder="Enter contact number"
              />
            ) : (
              user.contact || <span className="text-gray-400">N/A</span>
            )
          }
        />
        <ProfileField
          label="Age Range"
          value={
            editMode ? (
              <select
                name="ageRange"
                value={editUser.ageRange || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="">Select Age Range</option>
                {ageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              user.ageRange || <span className="text-gray-400">N/A</span>
            )
          }
        />
        <ProfileField
          label="Salary Range"
          value={
            editMode ? (
              <select
                name="salaryRange"
                value={editUser.salaryRange || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="">Select Salary Range</option>
                {salaryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              user.salaryRange || <span className="text-gray-400">N/A</span>
            )
          }
        />
        <ProfileField
          label="Expense Range"
          value={
            editMode ? (
              <select
                name="expenseRange"
                value={editUser.expenseRange || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="">Select Expense Range</option>
                {expenseOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              user.expenseRange || <span className="text-gray-400">N/A</span>
            )
          }
        />
        <ProfileField
          label="Google ID"
          value={user.googleId || <span className="text-gray-400">N/A</span>}
        />
        <ProfileField
          label="Token"
          value={
            user.token
              ? user.token.slice(0, 20) + "..."
              : <span className="text-gray-400">N/A</span>
          }
        />

        <div>
          <span className="font-semibold">Credit Cards Added:</span>
          {cards && cards.length > 0 ? (
            <ul className="list-disc ml-6 mt-1">
              {cards.map((card) => (
                <li key={card._id}>
                  Bank: <span className="font-medium">{card.bank_name}</span>, Name:{" "}
                  <span className="font-medium">{card.card_name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="ml-2 text-gray-400">None</span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        {!editMode ? (
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
