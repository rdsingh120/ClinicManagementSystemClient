import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getMyDoctorTestimonials } from "../api/testimonial.api";

const DoctorTestimonialsPage = () => {
  const { user } = useContext(UserContext);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getMyDoctorTestimonials();
        setTestimonials(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const isDoctor =
    user && user.role && user.role.toLowerCase() === "doctor";

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleDateString();
  };

  const renderStars = (rating) => {
    const r = Number(rating) || 0;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={
              i <= r ? "text-yellow-400 text-sm" : "text-gray-300 text-sm"
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              My Testimonials
            </h1>
            <p className="text-sm text-gray-500">
              See what your patients have said about you.
            </p>
          </div>
          {user && (
            <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
              Logged in as: {user.firstName} {user.lastName}
            </span>
          )}
        </div>

        {!isDoctor && (
          <div className="mb-4 rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
            This page is intended for doctors. If you are a patient, please use
            your appointments page.
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

        {!loading && !error && testimonials.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            You don&apos;t have any testimonials yet.
          </div>
        )}

        {!loading && !error && testimonials.length > 0 && (
          <div className="space-y-4">
            {testimonials.map((t) => {
              const patient = t.patientId || t.patient || {};
              const fullName = `${patient.firstName || ""} ${
                patient.lastName || ""
              }`.trim();

              return (
                <div
                  key={t._id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">
                        {fullName || "Anonymous patient"}
                      </span>
                      {patient.email && (
                        <span className="text-xs text-gray-500">
                          ({patient.email})
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {t.comment || "-"}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 min-w-[120px]">
                    {renderStars(t.rating)}
                    <span className="text-xs text-gray-500">
                      {formatDate(t.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorTestimonialsPage;
