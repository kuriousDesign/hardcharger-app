'use server';

import { auth } from '@/auth';
import { checkIsAdminByEmail, checkIsAdminByRole } from '@/lib/utils';
import { getCurrentPlayer } from './getActions';
import { Roles } from '@/types/enums';



/**
 * Checks if the current user has the 'admin' role.
 * @returns {Promise<boolean>} True if the user is an admin, false otherwise.
 */
export const getIsAdmin = async (): Promise<boolean> => {
  const player = await getCurrentPlayer();

  if (!player)
    return false; // No user is logged in

  return checkIsAdminByRole(player.role as Roles);
}

/**
 * Checks if the current user emaail is listed as an admin.
 * @returns {Promise<boolean>} True if the user is an admin, false otherwise.
 */
export const getIsAdminByUserEmail = async (): Promise<boolean> => {
  const session = await auth();
  const email = session?.user?.email;

  //if user email is one of the listOfAdminEmails, then return true

  if (!email)
    return false; // No user is logged in

  return checkIsAdminByEmail(email);
}