// src/pages/PatientAppointmentsPage.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  getMyPastAppointments,
  cancelAppointment,
  rescheduleAppointment,
} from "../api/appointment.api";
import { toast } from "react-toastify";

const PatientAppointmentsPage = () => {
  const { user } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newDateTime, setNewDateTime] = useState("");

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

  const isPatient =
    user && user.role && user.role.toLowerCase() === "patient";

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

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const now = new Date();
    const upcoming = [];
    const past = [];

    (appointments || []).forEach((appt) => {
      const start = new Date(appt.startTime);

      if (appt.status === "cancelled" || start < now) {
        past.push(appt);
      } else {
        upcoming.push(appt);
      }
    });

    return {
      upcomingAppointments: upcoming,
      pastAppointments: past,
    };
  }, [appointments]);

  const handleCancel = async (appt) => {
    const ok = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!ok) return;

    try {
      await cancelAppointment(appt._id, "Cancelled by patient");
      toast.success("Appointment cancelled.");

      setAppointments((prev) =>
        prev.map((item) =>
          item._id === appt._id
            ? {
                ...item,
                status: "cancelled",
                cancellationReason: "Cancelled by patient",
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to cancel appointment");
    }
  };

  const openRescheduleModal = (appt) => {
    setRescheduleTarget(appt);
    const d = new Date(appt.startTime);
    const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setNewDateTime(isoLocal);
  };

  const closeRescheduleModal = () => {
    setRescheduleTarget(null);
    setNewDateTime("");
  };

  const handleRescheduleSave = async () => {
    if (!rescheduleTarget || !newDateTime) return;

    try {
      const start = new Date(newDateTime);
      const end = new Date(start.getTime() + 30 * 60 * 1000);

      await rescheduleAppointment(rescheduleTarget._id, {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });

      toast.success("Appointment rescheduled.");

      setAppointments((prev) =>
        prev.map((item) =>
          item._id === rescheduleTarget._id
            ? {
                ...item,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
              }
            : item
        )
      );

      closeRescheduleModal();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to reschedule appointment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              My Appointments
            </h1>
            <p className="text-sm text-gray-500">
              View and manage your upcoming and previous appointments.
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

        {/* Upcoming */}
        {!loading && !error && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Upcoming Appointments
            </h2>

            {upcomingAppointments.length === 0 ? (
              <div className="text-sm text-gray-500 mb-6">
                You don&apos;t have any upcoming appointments.
              </div>
            ) : (
              <div className="mb-6 overflow-x-auto">
                <table className="min-w-full table-fixed border border-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b text-left text-gray-700 font-medium w-1/6">
                          Date
                        </th>
                        <th className="px-4 py-2 border-b text-left text-gray-700 font-medium w-1/6">
                          Time
                        </th>
                        {/* alignment */}
                        <th className="px-4 py-2 border-b text-left text-gray-700 font-medium w-1/4">
                          Doctor
                        </th>
                        <th className="px-4 py-2 border-b text-left text-gray-700 font-medium w-1/6">
                          Status
                        </th>
                        {/* alignment */}
                        <th className="px-4 py-2 border-b text-left text-gray-700 font-medium w-1/4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {upcomingAppointments.map((appt) => {
                        const doctor = appt.doctorId || {};
                        const fullName = `${doctor.firstName || ""} ${
                          doctor.lastName || ""
                        }`.trim();
                      
                        return (
                          <tr key={appt._id}>
                            <td className="px-4 py-2 align-top w-1/6">
                              {formatDate(appt.startTime)}
                            </td>
                            <td className="px-4 py-2 align-top w-1/6">
                              {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
                            </td>
                            <td className="px-4 py-2 align-top w-1/4">
                              <div className="font-medium text-gray-800">
                                {fullName || "-"}
                              </div>
                              {doctor.email && (
                                <div className="text-xs text-gray-500">
                                  {doctor.email}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-2 align-top w-1/6">
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
                            <td className="px-4 py-2 align-top w-1/4 whitespace-nowrap">
                              <button
                                onClick={() => handleCancel(appt)}
                                className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 mr-2"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => openRescheduleModal(appt)}
                                className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                              >
                                Reschedule
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                </table>

              </div>
            )}

            {/* Past */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Past Appointments
            </h2>

            {pastAppointments.length === 0 ? (
              <div className="text-sm text-gray-500">
                You don&apos;t have any past appointments yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-fixed border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border-b text-left text-gray-700 font-medium w-1/6">
                        Date
                      </th>
                      <th className="px-4 py-2 border-b text-left text-gray-700 font-medium w-1/6">
                        Time
                      </th>
                      <th className="px-4 py-2 border-b text-left text-gray-700 font-medium w-1/4">
                        Doctor
                      </th>
                      <th className="px-4 py-2 border-b text-left text-gray-700 font-medium w-1/6">
                        Status
                      </th>
                      {/* alignment */}
                      <th className="px-4 py-2 border-b text-left text-gray-700 font-medium w-1/4">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pastAppointments.map((appt) => {
                      const doctor = appt.doctorId || {};
                      const fullName = `${doctor.firstName || ""} ${
                        doctor.lastName || ""
                      }`.trim();
                    
                      return (
                        <tr key={appt._id}>
                          <td className="px-4 py-2 align-top w-1/6">
                            {formatDate(appt.startTime)}
                          </td>
                          <td className="px-4 py-2 align-top w-1/6">
                            {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
                          </td>
                          <td className="px-4 py-2 align-top w-1/4">
                            <div className="font-medium text-gray-800">
                              {fullName || "-"}
                            </div>
                            {doctor.email && (
                              <div className="text-xs text-gray-500">
                                {doctor.email}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2 align-top w-1/6">
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
                          <td className="px-4 py-2 align-top w-1/4 text-gray-700">
                            {appt.notes || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

              </div>
            )}
          </>
        )}

        {/* Reschedule modal */}
        {rescheduleTarget && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Reschedule Appointment
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select a new date and time for your appointment.
              </p>

              <label className="block text-sm text-gray-700 mb-2">
                New Date &amp; Time
              </label>
              <input
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeRescheduleModal}
                  className="px-3 py-1.5 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleSave}
                  className="px-3 py-1.5 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointmentsPage;
