const express = require("express");
const audit = require("../middleware/auditMiddleware");
const authenticate = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");
const {
  getPeople,
  getCRM,
  getDesk,
  getBooks,
} = require("../controllers/zohoController");

const router = express.Router();

router.get(
  "/people",
  authenticate,
  requirePermission("PEOPLE_ACCESS"),
  audit("VIEW", "Zoho People"),
  getPeople
);



router.get(
  "/crm",
  authenticate,
  requirePermission("CRM_ACCESS"),
  audit("VIEW", "Zoho CRM"),
  getCRM
);

router.get(
  "/desk",
  authenticate,
  requirePermission("DESK_ACCESS"),
  audit("VIEW", "Zoho Desk"),
  getDesk
);

router.get(
  "/books",
  authenticate,
  requirePermission("BOOKS_ACCESS"),
  audit("VIEW", "Zoho Books"),
  getBooks
);

module.exports = router;