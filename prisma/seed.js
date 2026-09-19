import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── 1. User types ──────────────────────────────────────────────────────────
  // IDs must match what the auth controller checks:
  //   user_type_id = 1 → Admin
  //   user_type_id = 3 → Staff  (2 = Customer placeholder)
  for (const ut of [
    { id: 1n, user_type: "Admin" },
    { id: 2n, user_type: "Customer" },
    { id: 3n, user_type: "Staff" },
  ]) {
    await prisma.user_types.upsert({
      where: { id: ut.id },
      update: {},
      create: { ...ut, created_at: new Date(), updated_at: new Date() },
    });
  }
  console.log("  ✓ user_types");

  // ── 2. Religions ───────────────────────────────────────────────────────────
  const religionNames = [
    "Hindu",
    "Muslim",
    "Christian",
    "Buddhist",
    "Sikh",
    "Jain",
    "Other",
  ];
  for (const name of religionNames) {
    await prisma.religions.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("  ✓ religions");

  // ── 3. Admin user ──────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin123", 10);
  await prisma.users.upsert({
    where: { email: "admin@viwahaa.com" },
    update: {},
    create: {
      name: "Site Admin",
      email: "admin@viwahaa.com",
      password: adminHash,
      user_type_id: 1n,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  console.log("  ✓ admin  →  admin@viwahaa.com  /  admin123");

  // ── 4. Staff users ─────────────────────────────────────────────────────────
  const staffSeed = [
    { name: "Priya Nair",  email: "priya@viwahaa.com",  tp: "0771234561" },
    { name: "Arun Kumar",  email: "arun@viwahaa.com",   tp: "0771234562" },
  ];
  const staffHash = await bcrypt.hash("staff123", 10);
  for (const s of staffSeed) {
    await prisma.users.upsert({
      where: { email: s.email },
      update: {},
      create: {
        ...s,
        password: staffHash,
        user_type_id: 3n,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }
  console.log("  ✓ staff  →  priya@viwahaa.com / arun@viwahaa.com  /  staff123");

  // ── 5. Test customers ──────────────────────────────────────────────────────
  const userHash = await bcrypt.hash("user123", 10);
  const testCustomers = [
    {
      member_id: "VM001001",
      first_name: "Rahul",
      last_name: "Sharma",
      email: "rahul@test.com",
      gender: "male",
      d_o_b: new Date("1995-06-20"),
      age: "29",
      contact_no: "0771000001",
      whatsapp_no: "0771000001",
      religion: "Hindu",
      cast: "Brahmin",
      occupation: "Software Engineer",
      country_of_resident: "Sri Lanka",
      city_of_resident: "Colombo",
      education: "Bachelor's Degree",
      package_plan: "Basic Plan",
    },
    {
      member_id: "VM001002",
      first_name: "Ananya",
      last_name: "Patel",
      email: "ananya@test.com",
      gender: "female",
      d_o_b: new Date("1997-03-14"),
      age: "27",
      contact_no: "0771000002",
      whatsapp_no: "0771000002",
      religion: "Hindu",
      cast: "Patel",
      occupation: "Doctor",
      country_of_resident: "Sri Lanka",
      city_of_resident: "Kandy",
      education: "MBBS",
      package_plan: "Standard Plan",
    },
    {
      member_id: "VM001003",
      first_name: "Mohamed",
      last_name: "Farouk",
      email: "farouk@test.com",
      gender: "male",
      d_o_b: new Date("1993-11-05"),
      age: "31",
      contact_no: "0771000003",
      religion: "Muslim",
      cast: "Moor",
      occupation: "Business Owner",
      country_of_resident: "Sri Lanka",
      city_of_resident: "Galle",
      education: "Master's Degree",
      package_plan: "Premium Plan",
    },
    {
      member_id: "VM001004",
      first_name: "Fatima",
      last_name: "Nazar",
      email: "fatima@test.com",
      gender: "female",
      d_o_b: new Date("1999-08-22"),
      age: "25",
      contact_no: "0771000004",
      religion: "Muslim",
      cast: "Moor",
      occupation: "Teacher",
      country_of_resident: "United Arab Emirates",
      city_of_resident: "Dubai",
      education: "Bachelor's Degree",
      package_plan: "Basic Plan",
    },
    {
      member_id: "VM001005",
      first_name: "Lakshan",
      last_name: "Fernando",
      email: "lakshan@test.com",
      gender: "male",
      d_o_b: new Date("1991-02-28"),
      age: "33",
      contact_no: "0771000005",
      religion: "Christian",
      cast: "Christian",
      occupation: "Accountant",
      country_of_resident: "Australia",
      city_of_resident: "Melbourne",
      education: "Bachelor's Degree",
      annual_income: "60000",
      package_plan: "Standard Plan",
    },
  ];

  let created = 0;
  for (const c of testCustomers) {
    const exists = await prisma.customers.findFirst({ where: { email: c.email } });
    if (!exists) {
      await prisma.customers.create({
        data: { ...c, password: userHash, created_at: new Date() },
      });
      created++;
    }
  }
  console.log(
    `  ✓ customers  →  ${created} created, ${testCustomers.length - created} already existed  /  password: user123`,
  );

  console.log("\nSeed complete!");
  console.log("──────────────────────────────────────────");
  console.log("  Admin    →  admin@viwahaa.com   /  admin123");
  console.log("  Staff    →  priya@viwahaa.com   /  staff123");
  console.log("  Staff    →  arun@viwahaa.com    /  staff123");
  console.log("  Users    →  rahul/ananya/farouk/fatima/lakshan @test.com  /  user123");
  console.log("──────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
