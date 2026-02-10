import api from "./client";
import type { User, CreateUserInput } from "../types/user";
import type { Role } from "../types/role";

/**
 * GET /users
 * We return Promise<User[]> to indicate that the resolved value will be an array of User objects. If your backend returns a different structure (like { users: User[] }), you can adjust the return type and the return statement accordingly.
 */
export const getUsers = async (): Promise<User[]> => {
  const res = await api.get("/users");
  return res.data as User[];
};

/**
 * POST /users
 * We use CreateUserInput here because when creating a user, you need to send a password, but the backend should never return a password in a User object. If your backend returns the created user object on creation, you can change the return type to Promise<User> and return res.data as User. Otherwise, if it returns something else (like a success message), you can keep it as Promise<unknown> or adjust it to match the actual response structure.
 */
export const createUser = async (user: CreateUserInput): Promise<unknown> => {
  const res = await api.post("/users", user);
  return res.data;
};

/**
 * PUT /users/:id/role
 * This endpoint is for updating a user's role. We use Role as the type for the role parameter to ensure that only valid roles can be sent. The payload we send is an object with a single property "role". If your backend expects a different structure for role updates, you can adjust the payload accordingly. The return type is Promise<unknown> because we don't know what your backend returns on a successful role update. If it returns the updated user object, you can change this to Promise<User> and return res.data as User.
*/
export const updateUserRole = async (id: string, role: Role): Promise<unknown> => {
  const res = await api.put(`/users/${id}/role`, { role });
  return res.data;
};

/**
 * DELETE /users/:id
 * Delete endpoints often return nothing important, so we return Promise<void>. If your backend returns something useful (like the deleted user), you can change this to Promise<User> and return res.data as User.
 */
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
