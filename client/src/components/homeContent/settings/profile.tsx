'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(false);
  const handleToggle = () => setNotifications(!notifications);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      
      {/* Personal Information */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Personal Information</h3>
        <label className="block text-gray-600">Username</label>
        <input type="text" className="w-full p-2 border rounded mt-1" value="janesherin" readOnly />
        
        <label className="block text-gray-600 mt-3">Add new email</label>
        <div className="flex items-center gap-2">
          <input type="email" className="w-full p-2 border rounded" value="janesherin@gmail.com" readOnly />
          <button className="text-green-500 text-xl">+</button>
        </div>
      </div>

      {/* Change Password */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Change Your Password</h3>
        <label className="block text-gray-600">Current Password</label>
        <input type="password" className="w-full p-2 border rounded mt-1" />
        <label className="block text-gray-600 mt-3">New Password</label>
        <input type="password" className="w-full p-2 border rounded mt-1" />
        <div className="mt-3 flex gap-3">
          <button className="px-4 py-2 border rounded">Cancel</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded">Set Password</button>
        </div>
      </div>
      
      {/* Allow Notifications */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-gray-600">Allow Notifications</span>
        <Switch checked={notifications} onCheckedChange={handleToggle} />
      </div>
      
      {/* Save Changes */}
      <button className="w-full py-2 bg-green-600 text-white rounded">Save Changes</button>
      
      {/* Cancel Profile */}
      <div className="mt-8 p-4 border-t">
        <h3 className="text-lg font-medium text-red-600">Cancel Profile</h3>
        <p className="text-gray-600 text-sm mb-3">Once you delete your profile, it will be deactivated immediately, and all associated data will be permanently removed within approximately 30 days. This action is irreversible.</p>
        <button className="px-4 py-2 bg-red-600 text-white rounded">Cancel Profile</button>
      </div>
    </div>
  );
}
