"use client";

import { useState } from "react";
import { Mail, Save, RotateCcw, TestTube, CheckCircle, AlertCircle, Server, Shield, Send, Settings, Eye, EyeOff } from "lucide-react";

interface EmailSettings {
  smtp: {
    host: string;
    port: number;
    username: string;
    password: string;
    encryption: 'tls' | 'ssl' | 'none';
    fromEmail: string;
    fromName: string;
  };
  delivery: {
    retryAttempts: number;
    retryDelay: number;
    maxQueueSize: number;
    timeout: number;
  };
  security: {
    requireAuth: boolean;
    verifySSL: boolean;
    allowInsecure: boolean;
  };
  notifications: {
    adminEmails: string[];
    systemAlerts: boolean;
    deliveryReports: boolean;
    bounceHandling: boolean;
  };
  templates: {
    welcomeEmail: string;
    passwordReset: string;
    newsletter: string;
    systemAlert: string;
  };
}

const defaultSettings: EmailSettings = {
  smtp: {
    host: "smtp.gmail.com",
    port: 587,
    username: "noreply@yourblog.com",
    password: "",
    encryption: "tls",
    fromEmail: "noreply@yourblog.com",
    fromName: "Your Blog"
  },
  delivery: {
    retryAttempts: 3,
    retryDelay: 300,
    maxQueueSize: 1000,
    timeout: 30
  },
  security: {
    requireAuth: true,
    verifySSL: true,
    allowInsecure: false
  },
  notifications: {
    adminEmails: ["admin@yourblog.com"],
    systemAlerts: true,
    deliveryReports: true,
    bounceHandling: true
  },
  templates: {
    welcomeEmail: "Welcome to our blog! We're excited to have you on board.",
    passwordReset: "Click the link below to reset your password: {resetLink}",
    newsletter: "Here's your weekly newsletter with the latest updates.",
    systemAlert: "System Alert: {message} - Please check the admin panel."
  }
};

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<EmailSettings>(defaultSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
    setTestResult({ success: true, message: "Settings saved successfully!" });
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setIsEditing(false);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    // Simulate testing connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.3; // 70% success rate for demo
    setTestResult({
      success,
      message: success 
        ? "Connection test successful! SMTP server is reachable."
        : "Connection test failed. Please check your SMTP settings."
    });
    setIsTesting(false);
  };

  const addAdminEmail = () => {
    if (newAdminEmail && !settings.notifications.adminEmails.includes(newAdminEmail)) {
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          adminEmails: [...prev.notifications.adminEmails, newAdminEmail]
        }
      }));
      setNewAdminEmail("");
    }
  };

  const removeAdminEmail = (email: string) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        adminEmails: prev.notifications.adminEmails.filter(e => e !== email)
      }
    }));
  };

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.');
    setSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Email Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Configure SMTP settings and email delivery options
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Settings
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Test Result Alert */}
      {testResult && (
        <div className={`p-4 rounded-lg border ${
          testResult.success 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center">
            {testResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            )}
            <span className={`text-sm font-medium ${
              testResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
            }`}>
              {testResult.message}
            </span>
          </div>
        </div>
      )}

      {/* SMTP Configuration */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
            <Server className="w-5 h-5 mr-2" />
            SMTP Configuration
          </h2>
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <TestTube className="w-4 h-4 mr-2" />
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.smtp.host}
              onChange={(e) => updateSetting('smtp.host', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Port
            </label>
            <input
              type="number"
              value={settings.smtp.port}
              onChange={(e) => updateSetting('smtp.port', parseInt(e.target.value))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={settings.smtp.username}
              onChange={(e) => updateSetting('smtp.username', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={settings.smtp.password}
                onChange={(e) => updateSetting('smtp.password', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 pr-10 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Encryption
            </label>
            <select
              value={settings.smtp.encryption}
              onChange={(e) => updateSetting('smtp.encryption', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="tls">TLS</option>
              <option value="ssl">SSL</option>
              <option value="none">None</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              From Email
            </label>
            <input
              type="email"
              value={settings.smtp.fromEmail}
              onChange={(e) => updateSetting('smtp.fromEmail', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              From Name
            </label>
            <input
              type="text"
              value={settings.smtp.fromName}
              onChange={(e) => updateSetting('smtp.fromName', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
          <Send className="w-5 h-5 mr-2" />
          Delivery Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Retry Attempts
            </label>
            <input
              type="number"
              value={settings.delivery.retryAttempts}
              onChange={(e) => updateSetting('delivery.retryAttempts', parseInt(e.target.value))}
              disabled={!isEditing}
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Retry Delay (seconds)
            </label>
            <input
              type="number"
              value={settings.delivery.retryDelay}
              onChange={(e) => updateSetting('delivery.retryDelay', parseInt(e.target.value))}
              disabled={!isEditing}
              min="60"
              max="3600"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Max Queue Size
            </label>
            <input
              type="number"
              value={settings.delivery.maxQueueSize}
              onChange={(e) => updateSetting('delivery.maxQueueSize', parseInt(e.target.value))}
              disabled={!isEditing}
              min="100"
              max="10000"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Timeout (seconds)
            </label>
            <input
              type="number"
              value={settings.delivery.timeout}
              onChange={(e) => updateSetting('delivery.timeout', parseInt(e.target.value))}
              disabled={!isEditing}
              min="10"
              max="120"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security Settings
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Require Authentication</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Require SMTP authentication for sending emails</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.requireAuth}
                onChange={(e) => updateSetting('security.requireAuth', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stone-300 dark:peer-focus:ring-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-slate-100"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Verify SSL Certificate</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Verify SSL certificates for secure connections</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.verifySSL}
                onChange={(e) => updateSetting('security.verifySSL', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stone-300 dark:peer-focus:ring-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-slate-100"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Allow Insecure Connections</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Allow connections without encryption (not recommended)</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.allowInsecure}
                onChange={(e) => updateSetting('security.allowInsecure', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stone-300 dark:peer-focus:ring-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-slate-100"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Notification Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Admin Email Addresses
            </label>
            <div className="space-y-2">
              {settings.notifications.adminEmails.map((email, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const newEmails = [...settings.notifications.adminEmails];
                      newEmails[index] = e.target.value;
                      updateSetting('notifications.adminEmails', newEmails);
                    }}
                    disabled={!isEditing}
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                  {isEditing && (
                    <button
                      onClick={() => removeAdminEmail(email)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="Enter new admin email"
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                  <button
                    onClick={addAdminEmail}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">System Alerts</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Send email alerts for system issues</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.systemAlerts}
                  onChange={(e) => updateSetting('notifications.systemAlerts', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stone-300 dark:peer-focus:ring-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-slate-100"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Delivery Reports</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Send delivery status reports</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.deliveryReports}
                  onChange={(e) => updateSetting('notifications.deliveryReports', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stone-300 dark:peer-focus:ring-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-slate-100"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Bounce Handling</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Automatically handle bounced emails</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.bounceHandling}
                  onChange={(e) => updateSetting('notifications.bounceHandling', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stone-300 dark:peer-focus:ring-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-slate-100"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Email Templates</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Welcome Email Template
            </label>
            <textarea
              value={settings.templates.welcomeEmail}
              onChange={(e) => updateSetting('templates.welcomeEmail', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Password Reset Template
            </label>
            <textarea
              value={settings.templates.passwordReset}
              onChange={(e) => updateSetting('templates.passwordReset', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Use {'{resetLink}'} placeholder for the reset link
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Newsletter Template
            </label>
            <textarea
              value={settings.templates.newsletter}
              onChange={(e) => updateSetting('templates.newsletter', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              System Alert Template
            </label>
            <textarea
              value={settings.templates.systemAlert}
              onChange={(e) => updateSetting('templates.systemAlert', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Use {'{message}'} placeholder for the alert message
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

