import { useUser } from "@clerk/nextjs";

/**
 * Custom hook to check if the current user is an admin.
 * 
 * @returns {boolean} - Returns true if the user is an admin, false otherwise.
 */
export const useIsAdmin = (): boolean => {
    const { user, isLoaded } = useUser();

    // If user data isn't loaded yet or user isn't authenticated, return false
    if (!isLoaded || !user) {
        return false;
    }

    // Check if user has admin role in public metadata
    // You can adjust this check based on how you store admin status in Clerk
    const isAdmin = user.publicMetadata?.role === "admin";

    return !!isAdmin;
};