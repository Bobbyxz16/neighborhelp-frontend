import React, { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import Input from '../../../components/ui/ui-components/Input';
import Select from '../../../components/ui/ui-components/Select';
import api from '../../../api/axios';
import { API_ENDPOINTS } from '../../../utils/constants';
import CreateUserForm from './CreateUserForm';

const UserManagementSection = ({ initialAction }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Pagination State
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0
  });

  // Role Update State
  const [editingRoleUser, setEditingRoleUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(false);

  useEffect(() => {
    if (initialAction?.action === 'create') {
      setShowCreateForm(true);
    }
  }, [initialAction]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = {
        page: pagination.page,
        size: pagination.size,
      };

      if (searchTerm) params.search = searchTerm;
      if (filterType !== 'all') params.type = filterType.toUpperCase();

      // Map status filter to API params
      if (filterStatus === 'active') params.enabled = true;
      if (filterStatus === 'suspended') params.enabled = false;

      const { data } = await api.get(API_ENDPOINTS.USERS.LIST, { params });

      setUsers(data.content || []);
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        number: data.number
      }));

    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load users when filters or pagination change
  useEffect(() => {
    loadUsers();
  }, [pagination.page, pagination.size, filterStatus, filterType, searchTerm]);

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleBulkAction = async (action) => {
    const message = `${action} ${selectedUsers.length} selected users?`;
    if (!confirm(message)) return;

    try {
      setLoading(true);
      for (const userId of selectedUsers) {
        const user = users.find(u => u.id === userId);
        if (!user) continue;

        const identifier = user.username || user.identifier || user.id;

        if (action === 'delete' || action === 'suspend') {
          await api.delete(API_ENDPOINTS.USERS.DELETE(identifier));
        } else if (action === 'activate') {
          await api.patch(API_ENDPOINTS.USERS.UPDATE_STATUS(identifier), { status: 'ACTIVE', enabled: true });
        }
      }

      alert(`Bulk ${action} completed successfully`);
      setSelectedUsers([]);
      loadUsers();
    } catch (error) {
      console.error(`Error performing bulk ${action}: `, error);
      alert(`Failed to perform bulk ${action}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (user, action) => {
    const message = `${action} user ${user.firstName} ${user.lastName}?`;
    if (!confirm(message)) return;

    try {
      setLoading(true);
      const identifier = user.username || user.identifier || user.id;

      if (action === 'delete' || action === 'suspend') {
        await api.delete(API_ENDPOINTS.USERS.DELETE(identifier));
      } else if (action === 'activate') {
        await api.patch(API_ENDPOINTS.USERS.UPDATE_STATUS(identifier), { status: 'ACTIVE', enabled: true });
      }

      alert(`User ${action} completed`);
      loadUsers();
    } catch (error) {
      console.error(`Error performing ${action}: `, error);
      alert(`Failed to ${action} user`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRoleUser || !newRole) return;

    try {
      setRoleUpdateLoading(true);
      const identifier = editingRoleUser.username || editingRoleUser.identifier || editingRoleUser.id;

      await api.patch(API_ENDPOINTS.USERS.UPDATE_ROLE(identifier), {
        role: newRole
      });

      // Update local state
      setUsers(prev => prev.map(u =>
        u.id === editingRoleUser.id ? { ...u, role: newRole } : u
      ));

      setEditingRoleUser(null);
      alert('User role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      alert(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setRoleUpdateLoading(false);
    }
  };

  const openRoleUpdateModal = (user) => {
    setEditingRoleUser(user);
    setNewRole(user.role || 'USER');
  };

  const getStatusColor = (user) => {
    if (user.deleted) return 'text-red-600 bg-red-100';
    if (!user.enabled) return 'text-gray-600 bg-gray-100';
    if (user.verified) return 'text-green-600 bg-green-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getUserStatusLabel = (user) => {
    if (user.deleted) return 'Deleted';
    if (!user.enabled) return 'Suspended';
    if (user.verified) return 'Active';
    return 'Pending';
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'MODERATOR':
        return 'text-purple-600 bg-purple-100 border-purple-200';
      default:
        return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  if (loading && !users.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <CreateUserForm
        onCancel={() => setShowCreateForm(false)}
        onSuccess={() => {
          setShowCreateForm(false);
          loadUsers();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">User Management</h2>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
            iconName="Search"
          />

          <Select 
            value={filterStatus} 
            onChange={(value) => {
              setFilterStatus(value);
              setPagination(prev => ({ ...prev, page: 0 }));
            }}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'suspended', label: 'Suspended' }
            ]}
          />

          <Select 
            value={filterType} 
            onChange={(value) => {
              setFilterType(value);
              setPagination(prev => ({ ...prev, page: 0 }));
            }}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'user', label: 'Users' },
              { value: 'provider', label: 'Providers' }
            ]}
          />

          <Button
            iconName="UserPlus"
            iconPosition="left"
            onClick={() => setShowCreateForm(true)}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-accent border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-accent-foreground">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('activate')}
              >
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('suspend')}
              >
                Suspend
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('delete')}
              >
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUsers([])}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={users.length > 0 && selectedUsers.length === users.length}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Join Date</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-border hover:bg-accent/50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} className="text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">
                            {user.firstName} {user.lastName}
                            {user.organizationName && ` (${user.organizationName})`}
                          </span>
                          {user.verified && (
                            <Icon name="CheckCircle" size={14} className="text-green-600" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-muted-foreground text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded border text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role || 'USER'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user)}`}>
                      {getUserStatusLabel(user)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground capitalize">{user.type?.toLowerCase()}</span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openRoleUpdateModal(user)}
                        title="Change Role"
                      >
                        <Icon name="Shield" size={16} />
                      </Button>

                      {!user.enabled ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUserAction(user, 'activate')}
                          title="Activate User"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Icon name="Check" size={16} />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUserAction(user, 'suspend')}
                          title="Suspend User"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Icon name="Ban" size={16} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Showing {users.length} of {pagination.totalElements} users
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 0}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages - 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center py-8">
            <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No users found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Role Update Modal */}
      {editingRoleUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md border border-border shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Update User Role</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Changing role for <span className="font-medium text-foreground">{editingRoleUser.username}</span>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select New Role</label>
              <select
                className="w-full p-2 rounded-md border border-input bg-background"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="USER">USER</option>
                <option value="MODERATOR">MODERATOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setEditingRoleUser(null)}
                disabled={roleUpdateLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateRole}
                disabled={roleUpdateLoading}
              >
                {roleUpdateLoading ? 'Updating...' : 'Update Role'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementSection;