const prisma = require("../config/prisma");

const requirePermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const permissions = user.userRoles.flatMap((userRole) =>
        userRole.role.permissions.map(
          (rolePermission) => rolePermission.permission.name
        )
      );

      if (!permissions.includes(permissionName)) {
        return res.status(403).json({
          message: "Access denied",
          requiredPermission: permissionName,
        });
      }

      next();
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Permission check failed",
      });
    }
  };
};

module.exports = requirePermission;