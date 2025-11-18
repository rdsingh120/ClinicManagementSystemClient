import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import HomeNavbar from "../components/HomeNavbar";
import DoctorCardSection from "../components/DoctorCardSection";

const HomePage = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      <HomeNavbar />

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex items-center gap-16">
          
          {/* LEFT — Text */}
          <div className="flex-1">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
              <p className="text-xs font-semibold tracking-wider text-blue-700 uppercase">
                ✨ Everything You Need To
              </p>
            </div>

            <h1 className="text-6xl font-black text-gray-900 leading-tight mb-6">
              Manage your clinic
              <br />
              operations with
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ClinicMS
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed">
              Simplify appointment scheduling, manage availability, and provide amazing patient care — all from one modern, intuitive dashboard.
            </p>

            {/* CONDITIONAL BUTTON */}
            {!user ? (
              <Link
                to="/signup"
                className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 text-lg font-semibold"
              >
                Register Now →
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 text-lg font-semibold"
              >
                Go to Dashboard →
              </Link>
            )}

            <div className="mt-12 flex items-center gap-8">
              <div>
                <p className="text-3xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-600">Active Clinics</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <p className="text-3xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-600">Appointments</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <p className="text-3xl font-bold text-gray-900">98%</p>
                <p className="text-sm text-gray-600">Satisfaction</p>
              </div>
            </div>
          </div>

          {/* RIGHT — Image */}
          <div className="flex-1 relative">
            <div className="absolute -top-8 -left-8 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-30"></div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?_gl=1*wtw8ct*_ga*MTAxMTE4MDAwMC4xNzYzNDk1MDk2*_ga_8JE65Q40S6*czE3NjM0OTUwOTUkbzEkZzEkdDE3NjM0OTUxMzEkajI0JGwwJGgw"
                alt="Clinic Illustration"
                className="rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 border-8 border-white"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Verified</p>
                    <p className="text-sm text-gray-600">Healthcare Platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Everything Your Clinic Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your healthcare operations
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                📅
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Appointment Scheduling</h3>
              <p className="text-gray-700 leading-relaxed">
                Patients can book and manage appointments effortlessly with our intuitive booking system.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                👨‍⚕️
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Doctor Profiles</h3>
              <p className="text-gray-700 leading-relaxed">
                Doctors can update availability and manage their personal dashboards with ease.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                📝
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Easy Patient Management</h3>
              <p className="text-gray-700 leading-relaxed">
                Track appointments, history, and patient details all in one centralized place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TOP DOCTORS SECTION */}
      <section className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Meet Our Doctors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Highly rated specialists providing the best care
            </p>
          </div>

          <DoctorCardSection />
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-black text-white mb-8">Why Choose ClinicMS?</h2>

          <p className="text-white text-xl max-w-3xl mx-auto mb-8 leading-relaxed opacity-90">
            We designed our system with simplicity and performance in mind — perfect for clinics, specialists, and healthcare professionals who demand the best.
          </p>

          <p className="text-white text-lg max-w-3xl mx-auto opacity-80 leading-relaxed">
            Whether you're booking appointments or managing availability, ClinicMS keeps everything fast, organized, and intuitive. Experience the future of healthcare management.
          </p>

          <div className="mt-12 flex justify-center gap-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-4">
              <p className="text-white font-semibold">🚀 Lightning Fast</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-4">
              <p className="text-white font-semibold">🔒 Secure & Private</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-4">
              <p className="text-white font-semibold">💡 Easy to Use</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-8 text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} ClinicMS — All rights reserved.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Built with ❤️ for healthcare professionals
        </p>
      </footer>
    </div>
  );
};

export default HomePage;