// app/dashboard/settings/page.tsx
"use client";
import { useState } from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Enhanced settings data with more options
const initialSettings = {
  general: {
    language: 'English',
    timezone: 'UTC',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    theme: 'Light', // Added theme option
    defaultView: 'Dashboard', // Added default landing page
    decimalPlaces: 2, // Added precision control
  },
  trading: { // Added trading preferences
    defaultOrderType: 'Market',
    orderConfirmation: true,
    slippageTolerance: 0.5, // Percentage
    autoRefreshInterval: 30, // Seconds
  },
  notifications: {
    email: {
      tradeConfirmations: true,
      accountActivity: true,
      marketUpdates: false,
      promotions: true,
      marginCalls: true, // Added
      complianceAlerts: false, // Added
    },
    push: {
      priceAlerts: true,
      orderUpdates: true,
      news: false,
      volatilityAlerts: true, // Added
      systemUpdates: false, // Added
    },
    sms: { // Added SMS notifications
      criticalAlerts: false,
      twoFactorAuth: false,
    },
  },
  security: {
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30, // minutes
    trustedDevices: true, // Added
    biometricAuth: false, // Added
    ipWhitelisting: [] as string[], // Added
  },
  compliance: { // Added compliance settings
    taxReporting: 'US',
    riskLevel: 'Moderate',
    investorType: 'Retail',
    autoComplianceCheck: true,
  },
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState('General');
  const [settings, setSettings] = useState(initialSettings);
  const [newPassword, setNewPassword] = useState({ current: '', new: '', confirm: '' });
  const [newIp, setNewIp] = useState('');

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings({
      ...settings,
      general: { ...settings.general, [e.target.name]: e.target.value },
    });
  };

  const handleTradingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSettings({
      ...settings,
      trading: {
        ...settings.trading,
        [name]: type === 'checkbox' ? checked : name === 'slippageTolerance' ? Number(value) : value,
      },
    });
  };

  const handleNotificationChange = (type: 'email' | 'push' | 'sms', key: string) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: {
          ...settings.notifications[type],
          [key]: !settings.notifications[type][key as keyof typeof settings.notifications[typeof type]],
        },
      },
    });
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [name]: type === 'checkbox' ? checked : Number(value),
      },
    });
  };

  const handleComplianceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSettings({
      ...settings,
      compliance: {
        ...settings.compliance,
        [name]: type === 'checkbox' ? checked : value,
      },
    });
  };

  const handleAddIp = () => {
    if (newIp && !settings.security.ipWhitelisting.includes(newIp)) {
      setSettings({
        ...settings,
        security: {
          ...settings.security,
          ipWhitelisting: [...settings.security.ipWhitelisting, newIp],
        },
      });
      setNewIp('');
    }
  };

  const handleRemoveIp = (ip: string) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        ipWhitelisting: settings.security.ipWhitelisting.filter(i => i !== ip),
      },
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword({ ...newPassword, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent, section: keyof typeof initialSettings | 'password') => {
    e.preventDefault();
    if (section === 'password') {
      if (newPassword.new !== newPassword.confirm) {
        alert('New passwords do not match');
        return;
      }
      if (newPassword.new.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
      }
      console.log('Password update:', newPassword);
      setNewPassword({ current: '', new: '', confirm: '' });
    } else {
      console.log(`${section} settings updated:`, settings[section]);
    }
    // In a real app, this would make an API call
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Settings</title>
        <meta name="description" content="Customize your account settings" />
      </Head>

      <Header />

      <main className="flex-grow pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-600">Manage your account preferences, security, and compliance</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-6 overflow-x-auto">
                {['General', 'Trading', 'Notifications', 'Security', 'Compliance'].map((tab) => (
                  <button
                    key={tab}
                    className={`py-2 px-1 text-sm font-medium whitespace-nowrap ${
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

            {/* General Settings */}
            {activeTab === 'General' && (
              <form onSubmit={(e) => handleSubmit(e, 'general')} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <select
                      name="language"
                      value={settings.general.language}
                      onChange={handleGeneralChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timezone</label>
                    <select
                      name="timezone"
                      value={settings.general.timezone}
                      onChange={handleGeneralChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>UTC</option>
                      <option>EST</option>
                      <option>PST</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select
                      name="currency"
                      value={settings.general.currency}
                      onChange={handleGeneralChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Format</label>
                    <select
                      name="dateFormat"
                      value={settings.general.dateFormat}
                      onChange={handleGeneralChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Theme</label>
                    <select
                      name="theme"
                      value={settings.general.theme}
                      onChange={handleGeneralChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Default View</label>
                    <select
                      name="defaultView"
                      value={settings.general.defaultView}
                      onChange={handleGeneralChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>Dashboard</option>
                      <option>Watchlist</option>
                      <option>Orders</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Decimal Places</label>
                    <select
                      name="decimalPlaces"
                      value={settings.general.decimalPlaces}
                      onChange={handleGeneralChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Save General Settings
                  </button>
                </div>
              </form>
            )}

            {/* Trading Settings */}
            {activeTab === 'Trading' && (
              <form onSubmit={(e) => handleSubmit(e, 'trading')} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Default Order Type</label>
                    <select
                      name="defaultOrderType"
                      value={settings.trading.defaultOrderType}
                      onChange={handleTradingChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>Market</option>
                      <option>Limit</option>
                      <option>Stop</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="orderConfirmation"
                      id="orderConfirmation"
                      checked={settings.trading.orderConfirmation}
                      onChange={handleTradingChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="orderConfirmation" className="text-sm text-gray-700">
                      Require Order Confirmation
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Slippage Tolerance (%)</label>
                    <input
                      type="number"
                      name="slippageTolerance"
                      value={settings.trading.slippageTolerance}
                      onChange={handleTradingChange}
                      step="0.1"
                      min="0"
                      max="5"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Auto-Refresh Interval (seconds)</label>
                    <select
                      name="autoRefreshInterval"
                      value={settings.trading.autoRefreshInterval}
                      onChange={handleTradingChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>15</option>
                      <option>30</option>
                      <option>60</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Save Trading Settings
                  </button>
                </div>
              </form>
            )}

            {/* Notification Settings */}
            {activeTab === 'Notifications' && (
              <form onSubmit={(e) => handleSubmit(e, 'notifications')} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                    {Object.entries(settings.notifications.email).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`email-${key}`}
                          checked={value}
                          onChange={() => handleNotificationChange('email', key)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`email-${key}`} className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
                    {Object.entries(settings.notifications.push).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`push-${key}`}
                          checked={value}
                          onChange={() => handleNotificationChange('push', key)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`push-${key}`} className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Notifications</h3>
                    {Object.entries(settings.notifications.sms).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`sms-${key}`}
                          checked={value}
                          onChange={() => handleNotificationChange('sms', key)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`sms-${key}`} className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Save Notification Settings
                  </button>
                </div>
              </form>
            )}

            {/* Security Settings */}
            {activeTab === 'Security' && (
              <div className="space-y-6">
                <form onSubmit={(e) => handleSubmit(e, 'security')} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        id="twoFactorAuth"
                        checked={settings.security.twoFactorAuth}
                        onChange={handleSecurityChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="twoFactorAuth" className="text-sm text-gray-700">
                        Enable Two-Factor Authentication
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="loginAlerts"
                        id="loginAlerts"
                        checked={settings.security.loginAlerts}
                        onChange={handleSecurityChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="loginAlerts" className="text-sm text-gray-700">
                        Send Login Alerts
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="trustedDevices"
                        id="trustedDevices"
                        checked={settings.security.trustedDevices}
                        onChange={handleSecurityChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="trustedDevices" className="text-sm text-gray-700">
                        Remember Trusted Devices
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="biometricAuth"
                        id="biometricAuth"
                        checked={settings.security.biometricAuth}
                        onChange={handleSecurityChange}
                        className="h-4 w-4 text-blue-6
00 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="biometricAuth" className="text-sm text-gray-700">
                        Enable Biometric Authentication
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                      <select
                        name="sessionTimeout"
                        value={settings.security.sessionTimeout}
                        onChange={handleSecurityChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value={15}>15</option>
                        <option value={30}>30</option>
                        <option value={60}>60</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">IP Whitelisting</label>
                      <div className="mt-1 flex gap-2">
                        <input
                          type="text"
                          value={newIp}
                          onChange={(e) => setNewIp(e.target.value)}
                          placeholder="e.g., 192.168.1.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <button
                          type="button"
                          onClick={handleAddIp}
                          className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="mt-2 space-y-1">
                        {settings.security.ipWhitelisting.map((ip) => (
                          <div key={ip} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <span className="text-sm text-gray-700">{ip}</span>
                            <button
                              onClick={() => handleRemoveIp(ip)}
                              className="text-red-600 hover:underline text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Save Security Settings
                    </button>
                  </div>
                </form>

                <form onSubmit={(e) => handleSubmit(e, 'password')} className="space-y-6 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Password</label>
                      <input
                        type="password"
                        name="current"
                        value={newPassword.current}
                        onChange={handlePasswordChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                          type="password"
                          name="new"
                          value={newPassword.new}
                          onChange={handlePasswordChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirm"
                          value={newPassword.confirm}
                          onChange={handlePasswordChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Compliance Settings */}
            {activeTab === 'Compliance' && (
              <div className="space-y-6">
                <form onSubmit={(e) => handleSubmit(e, 'compliance')} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tax Reporting Jurisdiction</label>
                      <select
                        name="taxReporting"
                        value={settings.compliance.taxReporting}
                        onChange={handleComplianceChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option>US</option>
                        <option>EU</option>
                        <option>UK</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Risk Level</label>
                      <select
                        name="riskLevel"
                        value={settings.compliance.riskLevel}
                        onChange={handleComplianceChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option>Low</option>
                        <option>Moderate</option>
                        <option>High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Investor Type</label>
                      <select
                        name="investorType"
                        value={settings.compliance.investorType}
                        onChange={handleComplianceChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option>Retail</option>
                        <option>Professional</option>
                        <option>Institutional</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="autoComplianceCheck"
                        id="autoComplianceCheck"
                        checked={settings.compliance.autoComplianceCheck}
                        onChange={handleComplianceChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="autoComplianceCheck" className="text-sm text-gray-700">
                        Enable Auto-Compliance Checks
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Save Compliance Settings
                    </button>
                  </div>
                </form>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Standard Updates</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900">MiFID II Compliance (Updated Mar 1, 2025)</h4>
                      <p className="text-sm text-gray-600">
                        Enhanced transaction reporting requirements implemented. Your account is now fully compliant with MiFID II regulations.
                      </p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900">SEC Rule 606 (Updated Feb 15, 2025)</h4>
                      <p className="text-sm text-gray-600">
                        Updated order routing disclosure requirements. Quarterly reports now available in your account documents.
                      </p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900">GDPR Compliance (Updated Jan 10, 2025)</h4>
                      <p className="text-sm text-gray-600">
                        Strengthened data protection measures implemented per EU regulations. Review our updated privacy policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}