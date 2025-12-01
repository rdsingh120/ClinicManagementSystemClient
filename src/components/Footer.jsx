import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (() => {
    const { user } = useContext(UserContext);
    return (
      <footer className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-blue-100 mt-10 pt-14 pb-8 px-6 border-t border-blue-500/40">
        {/* Top Footer */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-black text-white mb-3">ClinicMS</h2>
            <p className="text-blue-200 leading-relaxed text-sm">
              A modern clinic management system that simplifies scheduling, patient management, and
              doctor workflows.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/find-a-doctor" className="hover:text-white transition">
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link to="/dashboard/book-appointment" className="hover:text-white transition">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* For Doctors */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">
              {user?.role === "DOCTOR" ? "For Doctors" : "For Patients"}
            </h3>
            {user?.role === "DOCTOR" ? (
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/dashboard/doctor-profile" className="hover:text-white transition">
                    Doctor Profile
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/manage-availability" className="hover:text-white transition">
                    Manage Availability
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/doctor-appointments" className="hover:text-white transition">
                    Appointments
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/dashboard" className="hover:text-white transition">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/patient-appointments"
                    className="hover:text-white transition"
                  >
                    My Appointments
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/find-a-doctor" className="hover:text-white transition">
                    Find a Doctor
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">Contact Us</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>Email: support@clinicms.com</li>
              <li>Phone: +1 (800) 123‑4567</li>
              <li>Address: Toronto, Canada</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto border-t border-blue-400/30 mt-12 pt-6 text-center">
          <p className="text-blue-200 text-sm">
            © {new Date().getFullYear()} ClinicMS — All rights reserved.
          </p>
          <p className="text-blue-300 text-xs mt-1">Built with ❤️ for healthcare professionals</p>
          {/* Social Icons */}
          <div className="mt-10 flex justify-center gap-6">
            <a
              target="_blank"
              href="https://facebook.com"
              className="text-blue-200 hover:text-white text-2xl transition"
            >
              <FaFacebook />
            </a>
            <a
              target="_blank"
              href="https://twitter.com"
              className="text-blue-200 hover:text-white text-2xl transition"
            >
              <FaTwitter />
            </a>
            <a
              target="_blank"
              href="https://instagram.com"
              className="text-blue-200 hover:text-white text-2xl transition"
            >
              <FaInstagram />
            </a>
            <a
              target="_blank"
              href="https://linkedin.com"
              className="text-blue-200 hover:text-white text-2xl transition"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </footer>
    );
  })();
};

export default Footer;
