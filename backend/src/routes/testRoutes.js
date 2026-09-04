const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");

const router = express.Router();

router.get(
  "/admin",
  authenticate,
  requirePermission("USER_MANAGE"),
  (req, res) => {
    res.json({
      message: "You have Admin permission!",
      user: req.user,
    });
  }
);

module.exports = router;