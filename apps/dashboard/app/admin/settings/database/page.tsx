"use client";

import { useState } from "react";
import { Database, Download, Upload, Trash2, RefreshCw, CheckCircle, AlertCircle, HardDrive, Activity, Settings, Clock, BarChart3, Eye, Pause } from "lucide-react";

interface DatabaseInfo {
  type: string;
  version: string;
  size: string;
  tables: number;
  connections: number;
  uptime: string;
  lastBackup: string;
  status: 'healthy' | 'warning' | 'error';
}

interface TableInfo {
  name: string;
  rows: number;
  size: string;
  lastModified: string;
  status: 'active' | 'archived' | 'corrupted';
}

interface BackupInfo {
  id: string;
  filename: string;
  size: string;
  createdAt: string;
  type: 'manual' | 'automated' | 'scheduled';
  status: 'completed' | 'failed' | 'in_progress';
}

const mockDatabaseInfo: DatabaseInfo = {
  type: "PostgreSQL",
  version: "15.4",
  size: "2.4 GB",
  tables: 24,
  connections: 8,
  uptime: "15 days, 7 hours",
  lastBackup: "2024-01-20 02:00:00",
  status: 'healthy'
};

const mockTables: TableInfo[] = [
  { name: "users", rows: 1247, size: "156 KB", lastModified: "2024-01-20 15:30:00", status: 'active' },
  { name: "posts", rows: 892, size: "2.1 MB", lastModified: "2024-01-20 15:25:00", status: 'active' },
  { name: "comments", rows: 3456, size: "1.8 MB", lastModified: "2024-01-20 15:20:00", status: 'active' },
  { name: "tags", rows: 156, size: "45 KB", lastModified: "2024-01-20 15:15:00", status: 'active' },
  { name: "media", rows: 234, size: "156 KB", lastModified: "2024-01-20 15:10:00", status: 'active' },
  { name: "sessions", rows: 89, size: "23 KB", lastModified: "2024-01-20 15:05:00", status: 'active' },
  { name: "logs", rows: 15678, size: "45 MB", lastModified: "2024-01-20 15:00:00", status: 'active' },
  { name: "archived_posts", rows: 234, size: "890 KB", lastModified: "2024-01-19 23:00:00", status: 'archived' }
];

const mockBackups: BackupInfo[] = [
  { id: "1", filename: "backup_2024_01_20_020000.sql", size: "45.2 MB", createdAt: "2024-01-20 02:00:00", type: 'automated', status: 'completed' },
  { id: "2", filename: "backup_2024_01_19_020000.sql", size: "44.8 MB", createdAt: "2024-01-19 02:00:00", type: 'automated', status: 'completed' },
  { id: "3", filename: "backup_2024_01_18_020000.sql", size: "44.5 MB", createdAt: "2024-01-18 02:00:00", type: 'automated', status: 'completed' },
  { id: "4", filename: "manual_backup_2024_01_17.sql", size: "44.2 MB", createdAt: "2024-01-17 16:30:00", type: 'manual', status: 'completed' },
  { id: "5", filename: "backup_2024_01_16_020000.sql", size: "43.9 MB", createdAt: "2024-01-16 02:00:00", type: 'automated', status: 'completed' }
];

export default function DatabasePage() {
  const [databaseInfo, setDatabaseInfo] = useState<DatabaseInfo>(mockDatabaseInfo);
  const [tables, setTables] = useState<TableInfo[]>(mockTables);
  const [backups, setBackups] = useState<BackupInfo[]>(mockBackups);
  const [activeTab, setActiveTab] = useState('overview');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [operationResult, setOperationResult] = useState<{ success: boolean; message: string } | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'archived': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'corrupted': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'archived': return <Database className="w-4 h-4" />;
      case 'corrupted': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <RefreshCw className="w-4 h-4 animate-spin" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'manual': return <HardDrive className="w-4 h-4" />;
      case 'automated': return <Settings className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const optimizeDatabase = async () => {
    setIsOptimizing(true);
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setOperationResult({
      success: true,
      message: "Database optimization completed successfully! Performance improved by 15%."
    });
    setIsOptimizing(false);
    setTimeout(() => setOperationResult(null), 5000);
  };

  const createBackup = async () => {
    setBackupInProgress(true);
    const newBackup: BackupInfo = {
      id: Date.now().toString(),
      filename: `manual_backup_${new Date().toISOString().split('T')[0]}.sql`,
      size: "0 MB",
      createdAt: new Date().toLocaleString(),
      type: 'manual',
      status: 'in_progress'
    };
    
    setBackups(prev => [newBackup, ...prev]);
    
    // Simulate backup process
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    setBackups(prev => prev.map(backup => 
      backup.id === newBackup.id 
        ? { ...backup, status: 'completed', size: '45.2 MB' }
        : backup
    ));
    
    setBackupInProgress(false);
    setOperationResult({
      success: true,
      message: "Database backup created successfully!"
    });
    setTimeout(() => setOperationResult(null), 5000);
  };

  const deleteBackup = (id: string) => {
    setBackups(prev => prev.filter(backup => backup.id !== id));
    setOperationResult({
      success: true,
      message: "Backup deleted successfully!"
    });
    setTimeout(() => setOperationResult(null), 3000);
  };

  const downloadBackup = (backup: BackupInfo) => {
    // In a real app, this would trigger a download
    setOperationResult({
      success: true,
      message: `Downloading ${backup.filename}...`
    });
    setTimeout(() => setOperationResult(null), 3000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tables', label: 'Tables', icon: Database },
    { id: 'backups', label: 'Backups', icon: HardDrive },
    { id: 'maintenance', label: 'Maintenance', icon: Settings }
  ];

  const totalSize = tables.reduce((acc, table) => {
    const size = parseFloat(table.size.replace(/[^\d.]/g, ''));
    return acc + size;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Database</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your database and perform maintenance operations
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={createBackup}
            disabled={backupInProgress}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            {backupInProgress ? 'Creating...' : 'Create Backup'}
          </button>
          <button
            onClick={optimizeDatabase}
            disabled={isOptimizing}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
            {isOptimizing ? 'Optimizing...' : 'Optimize'}
          </button>
        </div>
      </div>

      {/* Operation Result Alert */}
      {operationResult && (
        <div className={`p-4 rounded-lg border ${
          operationResult.success 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center">
            {operationResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            )}
            <span className={`text-sm font-medium ${
              operationResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
            }`}>
              {operationResult.message}
            </span>
          </div>
        </div>
      )}

      {/* Database Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Database className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Database Type</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{databaseInfo.type}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <HardDrive className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Size</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{databaseInfo.size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Connections</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{databaseInfo.connections}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Uptime</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{databaseInfo.uptime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Database Health Status */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Database Health</h2>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(databaseInfo.status)}`}>
            {getStatusIcon(databaseInfo.status)}
            <span className="ml-1 capitalize">{databaseInfo.status}</span>
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">System Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Version:</span>
                <span className="text-slate-700 dark:text-slate-300">{databaseInfo.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Tables:</span>
                <span className="text-slate-700 dark:text-slate-300">{databaseInfo.tables}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Last Backup:</span>
                <span className="text-slate-700 dark:text-slate-300">{databaseInfo.lastBackup}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Performance Metrics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Query Response:</span>
                <span className="text-green-600 dark:text-green-400">Excellent</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Index Usage:</span>
                <span className="text-green-600 dark:text-green-400">Optimal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Cache Hit Rate:</span>
                <span className="text-green-600 dark:text-green-400">95.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Database Overview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-slate-700 dark:text-slate-300 mb-3">Storage Usage</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600 dark:text-slate-400">Tables</span>
                          <span className="text-slate-700 dark:text-slate-300">{totalSize.toFixed(1)} MB</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                          <div className="bg-slate-600 dark:bg-slate-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600 dark:text-slate-400">Indexes</span>
                          <span className="text-slate-700 dark:text-slate-300">156 MB</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                          <div className="bg-slate-600 dark:bg-slate-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600 dark:text-slate-400">Logs</span>
                          <span className="text-slate-700 dark:text-slate-300">45 MB</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                          <div className="bg-slate-600 dark:bg-slate-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-slate-700 dark:text-slate-300 mb-3">Recent Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Last Query:</span>
                        <span className="text-slate-700 dark:text-slate-300">2 min ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Active Queries:</span>
                        <span className="text-slate-700 dark:text-slate-300">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Slow Queries:</span>
                        <span className="text-slate-700 dark:text-slate-300">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Failed Queries:</span>
                        <span className="text-slate-700 dark:text-slate-300">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tables Tab */}
          {activeTab === 'tables' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Database Tables</h3>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Total: {tables.length} tables • {totalSize.toFixed(1)} MB
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Table Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Rows
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Last Modified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {tables.map((table) => (
                      <tr key={table.name} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                          {table.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                          {table.rows.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                          {table.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                          {table.lastModified}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
                            {getStatusIcon(table.status)}
                            <span className="ml-1 capitalize">{table.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 mr-3">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                            <Settings className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Backups Tab */}
          {activeTab === 'backups' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Database Backups</h3>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Total: {backups.length} backups
                </div>
              </div>
              
              <div className="space-y-4">
                {backups.map((backup) => (
                  <div key={backup.id} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(backup.type)}
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                            {backup.type}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {backup.filename}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {backup.size}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {backup.createdAt}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                          {getStatusIcon(backup.status)}
                          <span className="ml-1 capitalize">{backup.status}</span>
                        </span>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => downloadBackup(backup)}
                            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteBackup(backup.id)}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Database Maintenance</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
                    <h4 className="text-md font-medium text-slate-700 dark:text-slate-300 mb-4">Optimization</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Optimize database performance by analyzing and updating statistics
                        </p>
                        <button
                          onClick={optimizeDatabase}
                          disabled={isOptimizing}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          <RefreshCw className={`w-4 h-4 inline mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
                          {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
                    <h4 className="text-md font-medium text-slate-700 dark:text-slate-300 mb-4">Backup Management</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Create a manual backup of your database
                        </p>
                        <button
                          onClick={createBackup}
                          disabled={backupInProgress}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          <Download className="w-4 h-4 inline mr-2" />
                          {backupInProgress ? 'Creating...' : 'Create Backup'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                  </button>
                  
                  {showAdvanced && (
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                      <h4 className="text-md font-medium text-slate-700 dark:text-slate-300 mb-4">Advanced Operations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                          <Pause className="w-4 h-4 inline mr-2" />
                          Pause Database
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          <Trash2 className="w-4 h-4 inline mr-2" />
                          Clear Logs
                        </button>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                          <Settings className="w-4 h-4 inline mr-2" />
                          Reset Settings
                        </button>
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          <Upload className="w-4 h-4 inline mr-2" />
                          Import Data
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

