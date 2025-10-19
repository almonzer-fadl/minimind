"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  User, 
  Palette, 
  Bell, 
  Shield, 
  Database,
  Trash2,
  Download,
  Upload,
  Settings as SettingsIcon
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { email: string; name?: string } | null;
}

export function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'privacy' | 'data'>('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
    },
    appearance: {
      theme: 'system',
      compactMode: false,
      sidebarCollapsed: false,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      taskReminders: true,
      weeklyDigest: false,
    },
    privacy: {
      dataSharing: false,
      analytics: false,
      crashReports: true,
    },
    data: {
      autoBackup: true,
      backupFrequency: 'weekly',
    }
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    // Show success message
    alert('Settings saved successfully!');
  };

  const exportData = () => {
    const data = {
      boards: JSON.parse(localStorage.getItem('boards') || '[]'),
      tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
      notes: JSON.parse(localStorage.getItem('notes') || '[]'),
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minimind-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.boards) localStorage.setItem('boards', JSON.stringify(data.boards));
            if (data.tasks) localStorage.setItem('tasks', JSON.stringify(data.tasks));
            if (data.notes) localStorage.setItem('notes', JSON.stringify(data.notes));
            if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
            alert('Data imported successfully! Please refresh the page.');
    } catch {
      alert('Error importing data. Please check the file format.');
    }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('boards');
      localStorage.removeItem('tasks');
      localStorage.removeItem('notes');
      localStorage.removeItem('appSettings');
      alert('All data cleared. Please refresh the page.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: Database },
  ] as const;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal information and account details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Display Name
                        </label>
                        <Input
                          value={settings.profile.name}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            profile: { ...prev.profile, name: e.target.value }
                          }))}
                          placeholder="Enter your display name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <Input
                          value={settings.profile.email}
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Email cannot be changed
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Theme & Display</CardTitle>
                      <CardDescription>
                        Customize the appearance of your workspace
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <select
                          value={settings.appearance.theme}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            appearance: { ...prev.appearance, theme: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Compact Mode
                          </label>
                          <p className="text-xs text-gray-500">Reduce spacing and padding</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.appearance.compactMode}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            appearance: { ...prev.appearance, compactMode: e.target.checked }
                          }))}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Collapsed Sidebar
                          </label>
                          <p className="text-xs text-gray-500">Start with sidebar collapsed</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.appearance.sidebarCollapsed}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            appearance: { ...prev.appearance, sidebarCollapsed: e.target.checked }
                          }))}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>
                        Control how and when you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Email Notifications
                          </label>
                          <p className="text-xs text-gray-500">Receive notifications via email</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, emailNotifications: e.target.checked }
                          }))}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Push Notifications
                          </label>
                          <p className="text-xs text-gray-500">Receive browser push notifications</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.pushNotifications}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, pushNotifications: e.target.checked }
                          }))}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Task Reminders
                          </label>
                          <p className="text-xs text-gray-500">Get reminded about upcoming tasks</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.taskReminders}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, taskReminders: e.target.checked }
                          }))}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Weekly Digest
                          </label>
                          <p className="text-xs text-gray-500">Receive weekly summary emails</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.weeklyDigest}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, weeklyDigest: e.target.checked }
                          }))}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy & Security</CardTitle>
                      <CardDescription>
                        Control your data privacy and security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Data Sharing
                          </label>
                          <p className="text-xs text-gray-500">Allow anonymous usage data sharing</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.privacy.dataSharing}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            privacy: { ...prev.privacy, dataSharing: e.target.checked }
                          }))}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Analytics
                          </label>
                          <p className="text-xs text-gray-500">Help improve the app with analytics</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.privacy.analytics}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            privacy: { ...prev.privacy, analytics: e.target.checked }
                          }))}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Crash Reports
                          </label>
                          <p className="text-xs text-gray-500">Send crash reports to help fix bugs</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.privacy.crashReports}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            privacy: { ...prev.privacy, crashReports: e.target.checked }
                          }))}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Backup & Data</CardTitle>
                      <CardDescription>
                        Manage your data backup and export options
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Auto Backup
                          </label>
                          <p className="text-xs text-gray-500">Automatically backup your data</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.data.autoBackup}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            data: { ...prev.data, autoBackup: e.target.checked }
                          }))}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Backup Frequency
                        </label>
                        <select
                          value={settings.data.backupFrequency}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            data: { ...prev.data, backupFrequency: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <Button onClick={exportData} className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Export All Data
                        </Button>
                        <Button onClick={importData} variant="outline" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Import Data
                        </Button>
                        <Button onClick={clearAllData} variant="destructive" className="w-full">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={saveSettings}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
