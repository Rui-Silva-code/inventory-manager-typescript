import { useEffect, useMemo, useState } from "react";
import {
  getUsers,
  updateUserRole,
  deleteUser,
  createUser
} from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import Modal from "../common/Modal";

import type { User, CreateUserInput } from "../../types/user";
import type { Role } from "../../types/role";

/**
 * Props for this component.
 * - onClose is a function with no args that closes the modal.
 */
type AdminUsersPanelProps = {
  onClose: () => void;
};

export default function AdminUsersPanel({ onClose }: AdminUsersPanelProps) {
  const { user: currentUser } = useAuth();

  /* =========================
     DATA
     =========================
     We tell TypeScript: users is ALWAYS an array of User objects.
  */
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");

  /* =========================
     ROLE EDIT STATE
     =========================
     editingId is either a user id (string) or null (when not editing).
     editRole is a Role.
  */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<Role>("viewer");

  /* =========================
     CREATE USER FORM
     =========================
     We reuse CreateUserInput type so our form matches what createUser expects.
  */
  const [form, setForm] = useState<CreateUserInput>({
    email: "",
    password: "",
    role: "viewer"
  });

  useEffect(() => {
    void loadUsers();
  }, []);

  async function loadUsers(): Promise<void> {
    const data = await getUsers();
    setUsers(data);
  }

  /* =========================
     CREATE USER
     =========================
     Type the event so TypeScript knows e.preventDefault exists.
  */
  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    await createUser(form);
    setForm({ email: "", password: "", role: "viewer" });
    await loadUsers();
  }

  /* =========================
     ROLE EDIT FLOW
     ========================= */
  function startEditRole(user: User): void {
    setEditingId(user.id);
    setEditRole(user.role);
  }

  function cancelEditRole(): void {
    setEditingId(null);
    setEditRole("viewer");
  }

  async function saveEditRole(user: User): Promise<void> {
    await updateUserRole(user.id, editRole);
    cancelEditRole();
    await loadUsers();
  }

  /* =========================
     DELETE USER
     ========================= */
  async function handleDelete(user: User): Promise<void> {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await deleteUser(user.id);
    await loadUsers();
  }

  /* =========================
     HELPERS
     ========================= */
  const adminCount = users.filter((u) => u.role === "admin").length;

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => u.email.toLowerCase().includes(q));
  }, [users, search]);

  function roleBadge(role: Role) {
    return <span className={`role-badge role-${role}`}>{role}</span>;
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <Modal title="Users" onClose={onClose} isOpen>
      {/* =========================
         CREATE USER
         ========================= */}
      <div className="users-create">
        <h4 className="users-section-title">Create User</h4>

        <form className="users-form-vertical" onSubmit={handleCreateUser}>
          <label>
            Email
            <input
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </label>

          <label>
            Role
            <select
              value={form.role}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, role: e.target.value as Role }))
              }
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <button type="submit">Create User</button>
        </form>
      </div>

      <hr className="users-divider" />

      {/* =========================
         USERS LIST
         ========================= */}
      <div>
        <h4 className="users-section-title">Users</h4>

        <input
          className="users-search"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Created</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => {
              const isSelf = u.id === currentUser.id;
              const isLastAdmin = u.role === "admin" && adminCount === 1;
              const isEditing = editingId === u.id;

              return (
                <tr key={u.id}>
                  <td>{u.email}</td>

                  <td>
                    {isEditing ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as Role)}
                        disabled={isSelf}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      roleBadge(u.role)
                    )}
                  </td>

                  <td>{new Date(u.created_at).toLocaleString()}</td>

                  <td className="actions-cell">
                    {isEditing ? (
                      <>
                        <button onClick={() => void saveEditRole(u)} disabled={isSelf}>
                          Save
                        </button>
                        <button onClick={cancelEditRole}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditRole(u)}>Edit</button>
                        <button
                          disabled={isSelf || isLastAdmin}
                          onClick={() => void handleDelete(u)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
