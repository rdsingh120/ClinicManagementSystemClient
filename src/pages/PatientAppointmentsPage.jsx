import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getMyPastAppointments } from "../api/appointment.api";

const PatientAppointmentsPage = () => {
  const { user } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getMyPastAppointments();
        setAppointments(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const isPatient = user && user.role && user.role.toLowerCase() === "patient";

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
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              My Appointment History
            </h1>
            <p className="text-sm text-gray-500">
              View your previous visits and consultations.
            </p>
          </div>
          
        </div>

        {!isPatient && (
          <div className="mb-4 rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
            This page is intended for patients. If you are a doctor, please use
            the doctor schedule page.
          </div>
        )}

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
            You don&apos;t have any previous appointments yet.
          </div>
        )}

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
                    Doctor
                  </th>
                  <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
                    Status
                  </th>
                  <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appt) => {
                  const doctor = appt.doctorId || {};
                  const fullName = `${doctor.firstName || ""} ${
                    doctor.lastName || ""
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
                        <div className="font-medium text-gray-800">
                          {fullName || "-"}
                        </div>
                        {doctor.email && (
                          <div className="text-xs text-gray-500">
                            {doctor.email}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 align-top">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                          ${
                            appt.status === "completed"
                              ? "bg-green-100 text-green-700"
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointmentsPage;
