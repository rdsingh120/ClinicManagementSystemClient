import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../api/user.api";
import { UserContext } from "../context/UserContext";

const UpdateProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    healthCardNumber: "",
    dob: "",
    sex: "",
    bloodGroup: "",
    isOrganDonor: false,
  });

  useEffect(() => {
    if (user) {
      const patientProfile = user.patientProfile || {};
      setInput({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: patientProfile.phone || "",
        address: patientProfile.address || "",
        healthCardNumber: patientProfile.healthCardNumber || "",
        dob: patientProfile.dob?.split("T")[0] || "",
        sex: patientProfile.sex || "",
        bloodGroup: patientProfile.bloodGroup || "",
        isOrganDonor: patientProfile.isOrganDonor || false,
      });
    }
  }, [user]);

  const handleInputState = (e) => {
    const { name, value, type, checked } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const { success, message, updatedUser } = await updateUser(input, user._id);

    if (success) {
      setUser({ ...updatedUser });
      toast.success(message);
      navigate("profile");
    } else toast.error(message);
  };

  return (
    <div className="bg-gray-50 flex-1 p-6 overflow-y-auto rounded-tl-2xl">
      <form
        className="max-w-3xl mx-auto bg-white shadow rounded-xl p-8 space-y-6"
        onSubmit={handleUpdateProfile}
      >
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-4">
          Update Your Profile
        </h1>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={input.firstName}
            onChange={handleInputState}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={input.lastName}
            onChange={handleInputState}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={input.email}
            onChange={handleInputState}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          <input
            type="text"
            placeholder="Phone Number"
            name="phone"
            value={input.phone}
            onChange={handleInputState}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        <input
          type="text"
          placeholder="Address"
          name="address"
          value={input.address}
          onChange={handleInputState}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />

        <input
          type="text"
          placeholder="Health Card Number"
          name="healthCardNumber"
          value={input.healthCardNumber}
          onChange={handleInputState}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="date"
            name="dob"
            value={input.dob}
            onChange={handleInputState}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />

          <select
            name="sex"
            value={input.sex}
            onChange={handleInputState}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="" disabled hidden>
              Sex
            </option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <select
          name="bloodGroup"
          value={input.bloodGroup}
          onChange={handleInputState}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        >
          <option value="" disabled hidden>
            Blood Group
          </option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <div className="flex items-center gap-3">
          <label className="text-gray-700 text-sm">
            In the event of my death, I consent to donate my organs
          </label>
          <input
            type="checkbox"
            checked={input.isOrganDonor}
            onChange={handleInputState}
            name="isOrganDonor"
            className="h-5 w-5"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
