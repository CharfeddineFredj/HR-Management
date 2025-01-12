/* eslint-disable prettier/prettier */
const RoleGuard = (requiredRoles, userRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) {return true;} // No roles required
    if (!userRoles || userRoles.length === 0) {return false;} // No user roles found

    return requiredRoles.some(role => userRoles.includes(role));
  };

  export default RoleGuard;
