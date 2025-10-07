"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, XCircle, UploadCloud, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const initialUser = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  accountNumber: "ACCT-123456",
  joinDate: "Jan 15, 2023",
  accountType: "Individual",
  kycStatus: "Pending", // "Pending" | "Verified" | "Not Submitted"
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"Profile" | "KYC">("Profile");
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(initialUser);
  const [kyc, setKyc] = useState({
    idType: "",
    idNumber: "",
    idFront: null as File | null,
    idBack: null as File | null,
    proofOfAddress: null as File | null,
  });

  const router = useRouter();

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.clear();
    router.push("/auth/login");
  };

  const kycBadge = {
    Verified: {
      text: "Verified",
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle size={14} />,
    },
    Pending: {
      text: "Pending",
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock size={14} />,
    },
    "Not Submitted": {
      text: "Not Submitted",
      color: "bg-red-100 text-red-700",
      icon: <XCircle size={14} />,
    },
  }[profile.kycStatus];

  // ✅ Handle Profile Change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  // ✅ Handle Save Profile
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditMode(false);
    console.log("Profile updated:", profile);
  };

  // ✅ Handle KYC Input
  const handleKycChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, files, value } = e.target as HTMLInputElement;
    setKyc({ ...kyc, [name]: files ? files[0] : value });
  };

  // ✅ Handle KYC Submit
  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("KYC submitted:", kyc);
    setProfile({ ...profile, kycStatus: "Pending" });
  };

  return (
    <div className="flex flex-col w-full bg-gray-50">
      <Header />

      <main className="flex-grow px-4 md:px-8 py-8 max-w-5xl mx-auto">
        {/* Profile Overview */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-2xl font-semibold">
              {profile.fullName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {profile.fullName}
              </h1>
              <p className="text-gray-600 text-sm">{profile.email}</p>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                kycBadge?.color ?? "bg-gray-200 text-gray-700"
              }`}
            >
              {kycBadge?.icon ?? <Clock size={14} />}
              {kycBadge?.text ?? "Unknown"}
            </span>

            {!editMode && (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>

                {/* ✅ Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
                >
                  <LogOut size={20} />
                  
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="border-b border-gray-200 flex">
            {["Profile", "KYC"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab as "Profile" | "KYC")}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "Profile" ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {editMode ? (
                    <form
                      onSubmit={handleProfileSubmit}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {["fullName", "email", "phone"].map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {field}
                          </label>
                          <input
                            type={field === "email" ? "email" : "text"}
                            name={field}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            value={(profile as any)[field]}
                            onChange={handleProfileChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                            required
                          />
                        </div>
                      ))}
                      <div className="md:col-span-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries({
                        "Full Name": profile.fullName,
                        Email: profile.email,
                        Phone: profile.phone,
                        "Account Number": profile.accountNumber,
                        "Join Date": profile.joinDate,
                        "Account Type": profile.accountType,
                      }).map(([label, value]) => (
                        <div key={label}>
                          <p className="text-sm text-gray-500">{label}</p>
                          <p className="text-gray-900 font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="kyc"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {profile.kycStatus === "Verified" ? (
                    <div className="flex flex-col items-center py-8">
                      <CheckCircle size={48} className="text-green-600 mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        KYC Verified
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Your identity is verified successfully.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleKycSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Identification Type
                        </label>
                        <select
                          name="idType"
                          value={kyc.idType}
                          onChange={handleKycChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                          required
                        >
                          <option value="">Select ID Type</option>
                          <option>Passport</option>
                          <option>Driver&#39;s License</option>
                          <option>National ID</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          ID Number
                        </label>
                        <input
                          type="text"
                          name="idNumber"
                          value={kyc.idNumber}
                          onChange={handleKycChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                          required
                        />
                      </div>

                      {["idFront", "idBack", "proofOfAddress"].map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {field.replace(/([A-Z])/g, " $1")}
                          </label>
                          <label className="mt-2 flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                            <UploadCloud className="text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">
                              {kyc[field as keyof typeof kyc]
                                ? (kyc[field as keyof typeof kyc] as File).name
                                : "Upload File"}
                            </span>
                            <input
                              type="file"
                              name={field}
                              onChange={handleKycChange}
                              accept="image/*,.pdf"
                              className="hidden"
                              required
                            />
                          </label>
                        </div>
                      ))}

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                          disabled={profile.kycStatus === "Pending"}
                        >
                          {profile.kycStatus === "Pending"
                            ? "Under Review"
                            : "Submit KYC"}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
