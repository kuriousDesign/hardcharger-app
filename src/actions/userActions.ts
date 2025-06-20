'use server';


import { auth } from '@/auth';
import { checkIsAdmin } from '@/lib/utils';



/**
 * Checks if the current user has the 'admin' role.
 * @returns {Promise<boolean>} True if the user is an admin, false otherwise.
 */
export const getIsAdmin = async (): Promise<boolean> => {
  const session = await auth();
  const email = session?.user?.email;

  //if user email is one of the listOfAdminEmails, then return true

  if (!email)
    return false; // No user is logged in

  return checkIsAdmin(email);
}
