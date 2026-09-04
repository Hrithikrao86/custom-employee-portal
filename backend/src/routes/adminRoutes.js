const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");

const {
  getUsers,
  createUser,
  updateUserStatus,
  getAuditLogs,
} = require("../controllers/adminController");

const router = express.Router();

router.get(
  "/users",
  authenticate,
  requirePermission("USER_MANAGE"),
  getUsers
);

router.post(
  "/users",
  authenticate,
  requirePermission("USER_MANAGE"),
  createUser
);

router.patch(
  "/users/:id/status",
  authenticate,
  requirePermission("USER_MANAGE"),
  updateUserStatus
);

router.get(
  "/audit-logs",
  authenticate,
  requirePermission("AUDIT_VIEW"),
  getAuditLogs
);

module.exports = router;