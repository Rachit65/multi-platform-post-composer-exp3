import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUsersList,
  adminToggleUserStatusAsync,
  adminChangeUserRoleAsync,
  refreshUsersList,
  selectCurrentUser,
} from '../features/auth/authSlice';
import {
  Users,
  ShieldCheck,
  UserCheck,
  Crown,
} from 'lucide-react';

export default function AdminPanel() {
  const dispatch = useDispatch();
  const users = useSelector(selectUsersList);
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(refreshUsersList());
  }, [dispatch]);

  const handleToggleStatus = (userId) => {
    if (userId === currentUser?.sub) {
      alert('You cannot suspend your own active admin account.');
      return;
    }
    dispatch(adminToggleUserStatusAsync({ userId }));
  };

  const handleToggleRole = (userId, currentRole) => {
    if (userId === currentUser?.sub) {
      alert('You cannot change your own role.');
      return;
    }
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    dispatch(adminChangeUserRoleAsync({ userId, newRole }));
  };

  return (
    <div className="admin-panel-card">
      <div className="admin-panel-header">
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-amber-500" />
          <div>
            <h3>Admin User & Security Management</h3>
            <p className="admin-subtitle">
              Role-Based Access Control (RBAC) & Token Permissions Registry
            </p>
          </div>
        </div>
        <div className="admin-stats-pills">
          <span className="stat-pill">
            <Users className="w-3.5 h-3.5" /> Total Users: {users.length}
          </span>
          <span className="stat-pill admin-pill">
            <ShieldCheck className="w-3.5 h-3.5" /> Admins: {users.filter((u) => u.role === 'admin').length}
          </span>
        </div>
      </div>

      <div className="admin-users-table-wrap">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Assigned Role</th>
              <th>Status</th>
              <th>JWT Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === currentUser?.sub;
              return (
                <tr key={u.id} className={u.status === 'suspended' ? 'row-suspended' : ''}>
                  <td>
                    <div className="user-cell-info">
                      <img src={u.avatar} alt={u.name} className="user-avatar-sm" />
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-1">
                          {u.name} {isSelf && <span className="self-tag">(You)</span>}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-xs">{u.email}</span>
                  </td>
                  <td>
                    <span className={`role-badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {u.role === 'admin' ? <ShieldCheck className="w-3 h-3 mr-1" /> : <UserCheck className="w-3 h-3 mr-1" />}
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`status-dot-badge ${u.status === 'active' ? 'status-active' : 'status-suspended'}`}>
                      <span className="dot"></span>
                      {u.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td>
                    <div className="permissions-tags">
                      {u.permissions?.map((p) => (
                        <span key={p} className="perm-tag">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="admin-action-btns">
                      <button
                        onClick={() => handleToggleRole(u.id, u.role)}
                        disabled={isSelf}
                        className="btn-table-action btn-role-toggle"
                        title="Toggle Admin / User Role"
                      >
                        {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      </button>

                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        disabled={isSelf}
                        className={`btn-table-action ${u.status === 'active' ? 'btn-suspend' : 'btn-activate'}`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
