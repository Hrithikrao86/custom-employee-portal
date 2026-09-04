require("dotenv").config();

const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaMariaDb({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "employee_portal",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;