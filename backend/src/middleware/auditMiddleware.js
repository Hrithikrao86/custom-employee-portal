const prisma = require("../config/prisma");

const audit = (action, resource) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        await prisma.auditLog.create({
          data: {
            userId: req.user.userId,
            action,
            resource,
            ipAddress: req.ip,
          },
        });
      }
    } catch (error) {
      console.error("Audit log error:", error.message);
    }

    next();
  };
};

module.exports = audit;