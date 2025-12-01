import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const Profile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 rounded-tl-2xl overflow-hidden">
      <div className="h-full overflow-y-auto overflow-x-hidden bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow p-6 mb-6 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="w-full md:w-56 lg:w-64 shrink-0 md:self-start">
              <div className="w-full max-w-[256px] rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
                <img
                  src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                  alt="Profile"
                  className="block w-full h-[340px] object-cover select-none"
                  draggable={false}
                />
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                <div className="sm:w-60 text-gray-600">Full Name</div>
                <div className="flex-1 text-lg font-medium">
                  {user?.firstName} {user?.lastName}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                <div className="sm:w-60 text-gray-600">Email</div>
                <div className="flex-1">{user?.email}</div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                <div className="sm:w-60 text-gray-600">Phone</div>
                <div className="flex-1">{user?.patientProfile?.phone}</div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                <div className="sm:w-60 text-gray-600">Address</div>
                <div className="flex-1">{user?.patientProfile?.address}</div>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate("update-profile");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white mt-4"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6 overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">Personal Details</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-gray-500">Sex</div>
              <div className="text-lg">{user?.patientProfile?.sex}</div>
            </div>

            <div>
              <div className="text-gray-500">Date of Birth</div>
              <div className="text-lg">{user?.patientProfile?.dob?.split("T")[0]}</div>
            </div>

            <div>
              <div className="text-gray-500">Blood Group</div>
              <div className="text-lg">{user?.patientProfile?.bloodGroup}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6 overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-gray-500">Status</div>
              <div className="text-lg">{user?.isProfileActive ? "Active" : "Inactive"}</div>
            </div>

            <div>
              <div className="text-gray-500">Organ Donor</div>
              <div className="text-lg">{user?.patientProfile?.isOrganDonor ? "Yes" : "No"}</div>
            </div>

            <div>
              <div className="text-gray-500">Health Card Number</div>
              <div className="text-lg">{user?.patientProfile?.healthCardNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
