import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'


export const getRole = async (requiredRole: Roles) => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata?.role === requiredRole;
};


/**
 * Checks if the current user has the 'admin' role.
 * @returns {Promise<boolean>} True if the user is an admin, false otherwise.
 */
export const checkIsAdmin = async () => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata?.role === 'admin';
}
