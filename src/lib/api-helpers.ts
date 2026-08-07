/**
 * Strip sensitive fields from user objects before sending to client.
 * Removes senha (password hash) and other internal fields.
 */
export function stripSensitive(user: Record<string, unknown>) {
  if (!user) return user;
  const { senha: _, ...safe } = user;
  return safe;
}

/**
 * Strip sensitive fields from an array of user objects.
 */
export function stripSensitiveMany(users: Record<string, unknown>[]) {
  return users.map(stripSensitive);
}

/**
 * Check if the request has a valid session. Returns the session or null.
 * Use this to protect API routes that require authentication.
 */
export async function requireAuth() {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user) return null;
  return session;
}

/**
 * Check if the request has ADMIN role. Returns session or null.
 */
export async function requireAdmin() {
  const session = await requireAuth();
  if (!session) return null;
  if ((session.user as any).role !== "ADMIN") return null;
  return session;
}
