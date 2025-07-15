import { AuthPermissions } from '@Shared/constants/auth.permissions.constant';
import { AuthRoles } from '@Shared/constants/auth.roles.constant';

export interface InternalUserInformation {
  id: string;
  name: string;
  email: string;
  role: AuthRoles;
  permissions?: Array<AuthPermissions>;
  // timezone?: string;
  // locale?: string;
  token?: string;
}
