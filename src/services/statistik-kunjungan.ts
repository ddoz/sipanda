"use server";
import prisma from "@/lib/prisma";

export async function getStatistikKunjungan({
  page = 1,
  limit = 10,
  startDate,
  endDate,
}: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  try {
    // Build where clause for date filtering with proper UTC handling
    const whereClause: any = {};
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        // Set the start date to the beginning of the day in UTC
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        whereClause.createdAt.gte = start;
      }
      if (endDate) {
        // Set the end date to the end of the day in UTC
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        whereClause.createdAt.lte = end;
      }
    }

    // Get paginated data
    const data = await prisma.statistikKunjungan.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // Get total count
    const total = await prisma.statistikKunjungan.count({
      where: whereClause,
    });

    // For raw queries, we need to format dates properly for SQL
    let whereCondition = "";
    if (startDate || endDate) {
      whereCondition = "WHERE ";

      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        whereCondition += `createdAt >= '${start
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}'`;
      }

      if (startDate && endDate) {
        whereCondition += " AND ";
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        whereCondition += `createdAt <= '${end
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}'`;
      }
    }

    // Get device statistics with formatted date conditions
    const deviceStatsQuery = `
      SELECT device, COUNT(*) as count
      FROM statistik_kunjungan
      ${whereCondition}
      GROUP BY device
    `;
    const deviceStats = await prisma.$queryRawUnsafe(deviceStatsQuery);

    // Get path statistics with formatted date conditions
    const pathStatsQuery = `
      SELECT path, COUNT(*) as count
      FROM statistik_kunjungan
      ${whereCondition}
      GROUP BY path
      ORDER BY count DESC
      LIMIT 5
    `;
    const pathStats = await prisma.$queryRawUnsafe(pathStatsQuery);

    // Get date statistics with formatted date conditions
    const dateStatsQuery = `
      SELECT DATE(createdAt) as date, COUNT(*) as count
      FROM statistik_kunjungan
      ${whereCondition}
      GROUP BY DATE(createdAt)
      ORDER BY date
    `;
    const dateStats = await prisma.$queryRawUnsafe(dateStatsQuery);

    // Process the data for the frontend
    const processedDeviceStats: Record<string, number> = {};
    (deviceStats as any[]).forEach((item) => {
      processedDeviceStats[item.device || "Unknown"] = Number(item.count);
    });

    const processedPathStats: Record<string, number> = {};
    (pathStats as any[]).forEach((item) => {
      processedPathStats[item.path || "/"] = Number(item.count);
    });

    const processedDateStats: Record<string, number> = {};
    (dateStats as any[]).forEach((item) => {
      // Format date as YYYY-MM-DD
      processedDateStats[item.date.toISOString().split("T")[0] || item.date] =
        Number(item.count);
    });

    return {
      data,
      total,
      deviceStats: processedDeviceStats,
      pathStats: processedPathStats,
      dateStats: processedDateStats,
    };
  } catch (error) {
    console.error("Error fetching statistik kunjungan:", error);
    return {
      data: [],
      total: 0,
      deviceStats: {},
      pathStats: {},
      dateStats: {},
    };
  }
}
