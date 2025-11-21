import { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";
import { getDoctors } from "../api/doctor.api";

const DoctorCardSection = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getDoctors();

      console.log("Doctor API response:", res);

      if (res?.success && Array.isArray(res.doctors)) {
        setDoctors(res.doctors.slice(0, 3)); // Top 3
      }
    })();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {doctors.map((doc) => (
        <DoctorCard key={doc._id} doc={doc} />
      ))}
    </div>
  );
};

export default DoctorCardSection;