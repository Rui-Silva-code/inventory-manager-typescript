/**
 * Role is a "union type": it restricts values to a fixed set of strings.
 *
 * Why it's useful:
 * - Prevents typos like "admn"
 * - Gives autocomplete for valid roles
 * - Matches your backend role strings exactly
 */
export type Role = "viewer" | "editor" | "admin";
