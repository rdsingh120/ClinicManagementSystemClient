// src/api/appointment.api.js

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const getAuthHeaders = () => {
    
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const getMyDoctorSchedule = async () => {
  const res = await fetch(`${API_BASE}/appointments/my-schedule`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    throw new Error(data?.message || "Failed to load doctor schedule");
  }

  // backend: { success, count, data: [...] }
  return data.data || [];
};

export const getMyPastAppointments = async () => {
  const res = await fetch(`${API_BASE}/appointments/my-past`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    throw new Error(data?.message || "Failed to load appointment history");
  }

  return data.data || [];
};
export const cancelAppointment = async (appointmentId, reason) => {
  const res = await fetch(`${API_BASE}/appointments/${appointmentId}/cancel`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ reason }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    throw new Error(data?.message || "Failed to cancel appointment");
  }

  return data;
};

export const rescheduleAppointment = async (appointmentId, payload) => {
  const res = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    throw new Error(data?.message || "Failed to reschedule appointment");
  }

  return data;
};