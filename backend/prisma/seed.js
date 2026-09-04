const bcrypt = require("bcryptjs");
const prisma = require("../src/config/prisma");

async function main() {
  // Create roles
  const roles = ["Admin", "HR", "Sales", "Support", "Finance"];

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Create permissions
  const permissions = [
    "PEOPLE_ACCESS",
    "CRM_ACCESS",
    "DESK_ACCESS",
    "BOOKS_ACCESS",
    "USER_MANAGE",
    "ROLE_MANAGE",
    "AUDIT_VIEW",
  ];

  for (const name of permissions) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Get roles
  const admin = await prisma.role.findUnique({
    where: { name: "Admin" },
  });

  const hr = await prisma.role.findUnique({
    where: { name: "HR" },
  });

  const sales = await prisma.role.findUnique({
    where: { name: "Sales" },
  });

  const support = await prisma.role.findUnique({
    where: { name: "Support" },
  });

  const finance = await prisma.role.findUnique({
    where: { name: "Finance" },
  });

  // Get permissions
  const allPermissions = await prisma.permission.findMany();

  // Admin gets everything
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: admin.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: admin.id,
        permissionId: permission.id,
      },
    });
  }

  // Department permissions
  const departmentPermissions = {
    HR: ["PEOPLE_ACCESS"],
    Sales: ["CRM_ACCESS"],
    Support: ["DESK_ACCESS"],
    Finance: ["BOOKS_ACCESS"],
  };

  for (const [roleName, permissionNames] of Object.entries(
    departmentPermissions
  )) {
    const role = {
      HR: hr,
      Sales: sales,
      Support: support,
      Finance: finance,
    }[roleName];

    for (const permissionName of permissionNames) {
      const permission = allPermissions.find(
        (p) => p.name === permissionName
      );

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  // Assign Admin role to our existing admin user
    // Create demo users
  const demoUsers = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "Admin@123",
      role: admin,
    },
    {
      name: "HR User",
      email: "hr@example.com",
      password: "HR@123",
      role: hr,
    },
    {
      name: "Sales User",
      email: "sales@example.com",
      password: "Sales@123",
      role: sales,
    },
    {
      name: "Support User",
      email: "support@example.com",
      password: "Support@123",
      role: support,
    },
    {
      name: "Finance User",
      email: "finance@example.com",
      password: "Finance@123",
      role: finance,
    },
  ];

  for (const demoUser of demoUsers) {
    const passwordHash = await bcrypt.hash(demoUser.password, 10);

    const user = await prisma.user.upsert({
      where: {
        email: demoUser.email,
      },
      update: {
        name: demoUser.name,
        passwordHash,
        isActive: true,
      },
      create: {
        name: demoUser.name,
        email: demoUser.email,
        passwordHash,
        isActive: true,
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: demoUser.role.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: demoUser.role.id,
      },
    });
  }

  console.log("RBAC seed completed successfully.");
    console.log("Demo users created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });