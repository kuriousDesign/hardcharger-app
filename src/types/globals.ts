import { Roles } from "./enums";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}

export interface Hometown {
  city: string;
  region: string;
}

export { Roles };

export type HandlerOptions = {
  isRoleProtected?: boolean;
  role?: Roles;
};