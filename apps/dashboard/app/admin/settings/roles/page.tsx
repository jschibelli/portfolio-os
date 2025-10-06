"use client";

import { useState } from "react";
import { Shield, Plus, Edit, Trash2, Search, Users, Key } from "lucide-react";

interface RoleData {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockRoles: RoleData[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    permissions: ["read", "write", "delete", "admin", "users", "settings", "analytics"],
    userCount: 2,
    isSystem: true,
    createdAt: "2023-01-01",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Content Editor",
    description: "Can create, edit, and publish content",
    permissions: ["read", "write", "publish"],
    userCount: 5,
    isSystem: false,
    createdAt: "2023-02-15",
    updatedAt: "2024-01-10"
  },
  {
    id: "3",
    name: "Author",
    description: "Can create and edit their own content",
    permissions: ["read", "write"],
    userCount: 8,
    isSystem: false,
    createdAt: "2023-03-20",
    updatedAt: "2024-01-08"
  },
  {
    id: "4",
    name: "Viewer",
    description: "Read-only access to published content",
    permissions: ["read"],
    userCount: 15,
    isSystem: false,
    createdAt: "2023-04-10",
    updatedAt: "2024-01-05"
  }
];

const availablePermissions = [
  { key: "read", label: "Read Content", description: "View articles, pages, and media" },
  { key: "write", label: "Write Content", description: "Create and edit content" },
  { key: "publish", label: "Publish Content", description: "Publish and schedule content" },
  { key: "delete", label: "Delete Content", description: "Remove content and media" },
  { key: "users", label: "Manage Users", description: "Create, edit, and delete users" },
  { key: "roles", label: "Manage Roles", description: "Create, edit, and delete roles" },
  { key: "settings", label: "System Settings", description: "Modify system configuration" },
  { key: "analytics", label: "View Analytics", description: "Access analytics and reports" },
  { key: "media", label: "Manage Media", description: "Upload and manage media files" },
  { key: "comments", label: "Moderate Comments", description: "Approve and delete comments" }
];

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleData[]>(mockRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getPermissionColor = (permission: string) => {
    const permissionData = availablePermissions.find(p => p.key === permission);
    if (!permissionData) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    
    switch (permission) {
      case 'read': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'write': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'publish': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'delete': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'users': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'settings': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'analytics': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleCreateRole = (roleData: Omit<RoleData, 'id' | 'createdAt' | 'updatedAt' | 'userCount'>) => {
    const newRole: RoleData = {
      ...roleData,
      id: Date.now().toString(),
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setRoles([...roles, newRole]);
    setShowCreateModal(false);
  };

  const handleUpdateRole = (id: string, roleData: Partial<RoleData>) => {
    setRoles(roles.map(role => 
      role.id === id 
        ? { ...role, ...roleData, updatedAt: new Date().toISOString().split('T')[0] }
        : role
    ));
    setEditingRole(null);
  };

  const handleDeleteRole = (id: string) => {
    const role = roles.find(r => r.id === id);
    if (role?.isSystem) {
      alert("System roles cannot be deleted.");
      return;
    }
    
    if (role?.userCount && role.userCount > 0) {
      alert("Cannot delete role with assigned users. Please reassign users first.");
      return;
    }
    
    if (confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
      setRoles(roles.filter(role => role.id !== id));
    }
  };

  const totalUsers = roles.reduce((acc, role) => acc + role.userCount, 0);
  const customRoles = roles.filter(role => !role.isSystem);
  const systemRoles = roles.filter(role => role.isSystem);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Role Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage user roles and permissions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Roles</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{roles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Custom Roles</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{customRoles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">System Roles</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{systemRoles.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Shield className={`w-6 h-6 ${role.isSystem ? 'text-blue-500' : 'text-slate-500'}`} />
                  <div className="ml-2">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                      {role.name}
                    </h3>
                    {role.isSystem && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        System Role
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingRole(role)}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {!role.isSystem && (
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {role.description}
              </p>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                  <span>Users: {role.userCount}</span>
                  <span>Updated: {role.updatedAt}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Permissions:</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission) => (
                    <span
                      key={permission}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPermissionColor(permission)}`}
                    >
                      {availablePermissions.find(p => p.key === permission)?.label || permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingRole) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const roleData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                permissions: (formData.get('permissions') as string).split(',').map(p => p.trim()).filter(p => p),
                isSystem: editingRole?.isSystem || false
              };
              
              if (editingRole) {
                handleUpdateRole(editingRole.id, roleData);
              } else {
                handleCreateRole(roleData);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Role Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingRole?.name || ''}
                    required
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingRole?.description || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Permissions
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                    {availablePermissions.map((permission) => (
                      <label key={permission.key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="permissions"
                          value={permission.key}
                          defaultChecked={editingRole?.permissions.includes(permission.key)}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {permission.label}
                          </span>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {permission.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Selected permissions will be applied to this role
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingRole(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-slate-100 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  {editingRole ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

