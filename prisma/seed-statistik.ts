import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/id_ID";

const prisma = new PrismaClient();

// Common paths that might be visited
const paths = ["/"];

// Common referrers
const referrers = [
  "https://google.com",
  null, // Direct traffic
  null,
  null, // More direct traffic (more common)
];

// Devices
const devices = ["mobile", "desktop", "tablet"];
// Weight distribution: 60% mobile, 30% desktop, 10% tablet
const deviceWeights = [0.6, 0.3, 0.1];

async function main() {
  console.log("Starting to seed statistik kunjungan data...");

  // Start date: April 6, 2024
  const startDate = new Date("2024-04-06T00:00:00Z");
  const endDate = new Date(); // Current date

  // Generate 1307 random entries
  const totalEntries = 1307;
  const data: Array<{
    tanggal: Date;
    ipAddress: string;
    userAgent: string;
    path: string;
    referrer: string | null;
    device: string;
    createdAt: Date;
    updatedAt: Date;
  }> = [];

  for (let i = 0; i < totalEntries; i++) {
    // Generate a random date between start date and end date
    const randomDate = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime()),
    );

    // Generate a random IP address
    const ipAddress = faker.internet.ip();

    // Generate a random user agent (browser)
    const userAgent = faker.internet.userAgent();

    // Select a random path
    const path = paths[Math.floor(Math.random() * paths.length)];

    // Select a random referrer
    const referrer = referrers[Math.floor(Math.random() * referrers.length)];

    // Select a device type based on weighted distribution
    const deviceRandom = Math.random();
    let deviceIndex = 0;
    let cumulativeWeight = 0;

    for (let j = 0; j < deviceWeights.length; j++) {
      cumulativeWeight += deviceWeights[j];
      if (deviceRandom < cumulativeWeight) {
        deviceIndex = j;
        break;
      }
    }

    const device = devices[deviceIndex];

    // Create the statistik kunjungan entry
    data.push({
      tanggal: randomDate,
      ipAddress,
      userAgent,
      path,
      referrer,
      device,
      createdAt: randomDate,
      updatedAt: randomDate,
    });

    // Log progress every 100 entries
    if ((i + 1) % 100 === 0) {
      console.log(`Generated ${i + 1} entries...`);
    }
  }

  // Insert data in batches to avoid memory issues
  const batchSize = 100;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await prisma.statistikKunjungan.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(
      `Inserted entries ${i + 1} to ${Math.min(i + batchSize, data.length)}`,
    );
  }

  console.log(`Seeded ${totalEntries} statistik kunjungan entries!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
