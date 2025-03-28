// app/dashboard/profile/page.tsx
"use client";
import { useState } from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Sample user data
const userData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  accountNumber: "ACCT-123456",
  joinDate: "Jan 15, 2023",
  accountType: "Individual",
  kycStatus: "Pending", // Can be "Pending", "Verified", or "Not Submitted"
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState(userData);
  const [kycData, setKycData] = useState({
    idType: '',
    idNumber: '',
    idFront: null as File | null,
    idBack: null as File | null,
    proofOfAddress: null as File | null,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleKycChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setKycData({ ...kycData, [name]: files[0] });
    } else {
      setKycData({ ...kycData, [name]: value });
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to update profile
    console.log('Profile updated:', profileData);
    setEditMode(false);
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to submit KYC
    console.log('KYC submitted:', kycData);
    setProfileData({ ...profileData, kycStatus: 'Pending' });
    setKycData({ idType: '', idNumber: '', idFront: null, idBack: null, proofOfAddress: null });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Profile Management</title>
        <meta name="description" content="Manage your account profile and verification" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{profileData.fullName}</h1>
                <p className="text-sm text-gray-600">{profileData.email}</p>
              </div>
              <div className="flex space-x-2">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  profileData.kycStatus === 'Verified' ? 'bg-green-100 text-green-800' :
                  profileData.kycStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  KYC: {profileData.kycStatus}
                </span>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-6">
                {['Profile', 'KYC Verification'].map((tab) => (
                  <button
                    key={tab}
                    className={`py-2 px-1 text-sm font-medium ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Profile Tab */}
            {activeTab === 'Profile' && (
              <div>
                {editMode ? (
                  <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-gray-900">{profileData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{profileData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">{profileData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Number</p>
                      <p className="text-gray-900">{profileData.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Join Date</p>
                      <p className="text-gray-900">{profileData.joinDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Type</p>
                      <p className="text-gray-900">{profileData.accountType}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* KYC Verification Tab */}
            {activeTab === 'KYC Verification' && (
              <div>
                {profileData.kycStatus === 'Verified' ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <span className="text-2xl text-green-600">✓</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">KYC Verified</h3>
                    <p className="text-gray-600">Your identity has been successfully verified.</p>
                  </div>
                ) : (
                  <form onSubmit={handleKycSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Identification Type</label>
                      <select
                        name="idType"
                        value={kycData.idType}
                        onChange={handleKycChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="">Select ID Type</option>
                        <option value="Passport">Passport</option>
                        <option value="Driver's License">Driver's License</option>
                        <option value="National ID">National ID</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID Number</label>
                      <input
                        type="text"
                        name="idNumber"
                        value={kycData.idNumber}
                        onChange={handleKycChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID Front</label>
                      <input
                        type="file"
                        name="idFront"
                        onChange={handleKycChange}
                        accept="image/*,.pdf"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                      {kycData.idFront && <p className="text-sm text-gray-600 mt-1">{kycData.idFront.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID Back</label>
                      <input
                        type="file"
                        name="idBack"
                        onChange={handleKycChange}
                        accept="image/*,.pdf"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                      {kycData.idBack && <p className="text-sm text-gray-600 mt-1">{kycData.idBack.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Proof of Address</label>
                      <input
                        type="file"
                        name="proofOfAddress"
                        onChange={handleKycChange}
                        accept="image/*,.pdf"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                      {kycData.proofOfAddress && <p className="text-sm text-gray-600 mt-1">{kycData.proofOfAddress.name}</p>}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                        disabled={profileData.kycStatus === 'Pending'}
                      >
                        {profileData.kycStatus === 'Pending' ? 'Under Review' : 'Submit KYC'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}