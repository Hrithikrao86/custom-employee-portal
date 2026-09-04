const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        userRoles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });



    const formattedUsers = users.map((user) => ({
      ...user,
      roles: user.userRoles.map((item) => item.role.name),
      userRoles: undefined,
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, roleName } = req.body;

    if (!name || !email || !password || !roleName) {
      return res.status(400).json({
        message: "name, email, password and roleName are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        userRoles: {
          create: {
            roleId: role.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create user",
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { isActive } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    res.json({
      message: "User status updated",
      user: {
        id: user.id,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update user status",
    });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch audit logs",
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUserStatus,
  getAuditLogs,
};