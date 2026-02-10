import type { Role } from "./role";

/**
 * `interface` describes the shape of an object.
 * We use it for User because it's a structured entity used in many places.
 */
export interface User {
  id: string;
  email: string;
  role: Role;

  /**
   * Your UI does: new Date(u.created_at).toLocaleString()
   * You confirmed this is an ISO string coming from the backend.
   */
  created_at: string;
}

/**
 * This is the shape of the payload you SEND when creating a user.
 * It's separate from `User` on purpose:
 * - The backend should never return a password
 * - We don’t want passwords to ever exist inside a `User` type
 */
export interface CreateUserInput {
  email: string;
  password: string;
  role: Role;
}
