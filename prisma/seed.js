import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ---------- USERS ----------
  const userOwner1 = await prisma.user.create({
    data: {
      email: "alice.owner@example.com",
      passwordHash: "hashedpassword1",
      userRole: "owner",
      owner: {
        create: {
          name: "Alice Martin",
          phone: "+330123456789",
          address: "12 rue de Paris, Paris",
        },
      },
    },
    include: { owner: true },
  });

  const userOwner2 = await prisma.user.create({
    data: {
      email: "john.owner@example.com",
      passwordHash: "hashedpassword2",
      userRole: "owner",
      owner: {
        create: {
          name: "John Doe",
          phone: "+33022334455",
          address: "45 avenue de Lyon, Lyon",
        },
      },
    },
    include: { owner: true },
  });

  const userVet1 = await prisma.user.create({
    data: {
      email: "bob.vet@example.com",
      passwordHash: "hashedpassword3",
      userRole: "veterinarian",
      veterinarian: { create: { name: "Dr Bob", phone: "+330987654321" } },
    },
    include: { veterinarian: true },
  });

  const userVet2 = await prisma.user.create({
    data: {
      email: "clara.vet@example.com",
      passwordHash: "hashedpassword4",
      userRole: "veterinarian",
      veterinarian: { create: { name: "Dr Clara", phone: "+33011223344" } },
    },
    include: { veterinarian: true },
  });

  // ---------- ANIMALS ----------
  const animal1 = await prisma.animal.create({
    data: {
      name: "Rex",
      species: "Dog",
      breed: "Golden Retriever",
      dateOfBirth: new Date("2020-01-01"),
      weight: 25,
      gender: "M",
      ownerId: userOwner1.owner.ownerId,
    },
  });

  const animal2 = await prisma.animal.create({
    data: {
      name: "Milo",
      species: "Cat",
      breed: "Siamese",
      dateOfBirth: new Date("2021-03-10"),
      weight: 5,
      gender: "M",
      ownerId: userOwner2.owner.ownerId,
    },
  });

  const animal3 = await prisma.animal.create({
    data: {
      name: "Luna",
      species: "Dog",
      breed: "Labrador",
      dateOfBirth: new Date("2019-07-22"),
      weight: 28,
      gender: "F",
      ownerId: userOwner1.owner.ownerId,
    },
  });

  // ---------- VACCINES ----------
  const vaccine1 = await prisma.vaccine.create({
    data: {
      name: "Rabies",
      vaccineStatus: "administered",
      reminderDelays: [365],
      animalId: animal1.animalId,
      veterinarianId: userVet1.veterinarian.veterinarianId,
      administrationDate: new Date("2023-01-15"),
    },
  });

  const vaccine2 = await prisma.vaccine.create({
    data: {
      name: "Distemper",
      vaccineStatus: "pending",
      reminderDelays: [30, 60],
      animalId: animal2.animalId,
      veterinarianId: userVet2.veterinarian.veterinarianId,
    },
  });

  const vaccine3 = await prisma.vaccine.create({
    data: {
      name: "Parvovirus",
      vaccineStatus: "administered",
      reminderDelays: [180],
      animalId: animal3.animalId,
      veterinarianId: userVet1.veterinarian.veterinarianId,
      administrationDate: new Date("2023-05-10"),
    },
  });

  // ---------- VISITS ----------
  await prisma.visit.create({
    data: {
      date: new Date("2023-08-15T10:00:00"),
      reason: "Annual check-up",
      visitStatus: "completed",
      animalId: animal1.animalId,
      veterinarianId: userVet1.veterinarian.veterinarianId,
      observation: "Healthy",
    },
  });

  await prisma.visit.create({
    data: {
      date: new Date("2023-09-01T14:00:00"),
      reason: "Vaccination",
      visitStatus: "scheduled",
      animalId: animal2.animalId,
      veterinarianId: userVet2.veterinarian.veterinarianId,
    },
  });

  await prisma.visit.create({
    data: {
      date: new Date("2023-06-20T09:00:00"),
      reason: "Skin allergy",
      visitStatus: "completed",
      animalId: animal3.animalId,
      veterinarianId: userVet1.veterinarian.veterinarianId,
      observation: "Prescribed medication",
    },
  });

  console.log("Seed finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
