// src/pages/DoctorAppointmentsPage.jsx
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getMyDoctorSchedule } from "../api/appointment.api";

const DoctorAppointmentsPage = () => {
  const { user } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const profile = selectedPatient?.patientProfile || {};

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyDoctorSchedule();
        setAppointments(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const isDoctor =
    user && user.role && user.role.toLowerCase() === "doctor";

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleDateString();
  };

  const formatTime = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              My Scheduled Appointments
            </h1>
            <p className="text-sm text-gray-500">
              View all upcoming consultations assigned to you.
            </p>
          </div>
        </div>

        {/* Role warning */}
        {!isDoctor && (
          <div className="mb-4 rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
            This page is intended for doctors. If you are a patient, please use
            the My Appointments page.
          </div>
        )}

        {/* Loading / error / empty states */}
        {loading && (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            You don&apos;t have any upcoming appointments.
          </div>
        )}

        {/* Appointments table */}
        {!loading && !error && appointments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
                    Date
                  </th>
                  <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
                    Time
                  </th>
                  <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
                    Patient
                  </th>
                  <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
                    Status
                  </th>
                  <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
                    Notes
                  </th>
                  <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
                    Confirmation Code
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appt) => {
                  const patient = appt.patientId || {};
                  const fullName = `${patient.firstName || ""} ${
                    patient.lastName || ""
                  }`.trim();

                  return (
                    <tr key={appt._id}>
                      <td className="px-4 py-2 align-top">
                        {formatDate(appt.startTime)}
                      </td>
                      <td className="px-4 py-2 align-top">
                        {formatTime(appt.startTime)} –{" "}
                        {formatTime(appt.endTime)}
                      </td>
                      <td className="px-4 py-2 align-top">
                        <button
                          type="button"
                          onClick={() => setSelectedPatient(patient)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {fullName || "-"}
                        </button>
                        {patient.email && (
                          <div className="text-xs text-gray-500">
                            {patient.email}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 align-top">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                          ${
                            appt.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : appt.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : appt.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 align-top text-gray-700">
                        {appt.notes || "-"}
                      </td>
                      <td className="px-4 py-2 align-top text-gray-700 text-xs">
                        {appt.confirmationCode || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Patient profile modal */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Patient Profile
                </h3>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Left */}
                <div className="md:w-1/3 flex flex-col items-center border-r md:border-r border-gray-200 pr-0 md:pr-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <span className="text-3xl text-gray-500">
                      {selectedPatient.firstName?.[0]?.toUpperCase() ??
                        selectedPatient.lastName?.[0]?.toUpperCase() ??
                        "P"}
                    </span>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-lg font-semibold text-gray-800">
                      {selectedPatient.firstName}{" "}
                      {selectedPatient.lastName}
                    </div>
                    {selectedPatient.email && (
                      <div className="text-sm text-gray-600">
                        {selectedPatient.email}
                      </div>
                    )}
                    {profile.phone && (
                      <div className="text-sm text-gray-600">
                        {profile.phone}
                      </div>
                    )}
                    {profile.address && (
                      <div className="text-sm text-gray-600">
                        {profile.address}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
                  {profile.sex && (
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wide">
                        Sex
                      </div>
                      <div className="text-gray-800">
                        {profile.sex}
                      </div>
                    </div>
                  )}

                  {profile.dob && (
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wide">
                        Date of Birth
                      </div>
                      <div className="text-gray-800">
                        {new Date(profile.dob).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {profile.bloodGroup && (
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wide">
                        Blood Group
                      </div>
                      <div className="text-gray-800">
                        {profile.bloodGroup}
                      </div>
                    </div>
                  )}

                  {profile.healthCardNumber && (
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wide">
                        Health Card Number
                      </div>
                      <div className="text-gray-800">
                        {profile.healthCardNumber}
                      </div>
                    </div>
                  )}

                  {profile.isOrganDonor !== undefined && (
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wide">
                        Organ Donor
                      </div>
                      <div className="text-gray-800">
                        {profile.isOrganDonor ? "Yes" : "No"}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="px-4 py-2 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
