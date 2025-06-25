import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(req: Request, res: Response) {
  try {
    // Ganti dengan domain Anda
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.100.57:3000";

    // Capture visitor information
    const headersList = headers();
    const userAgent = headersList.get("user-agent") || "";
    const ipAddress =
      headersList.get("x-forwarded-for") ||
      headersList.get("x-real-ip") ||
      "unknown";
    const referer = headersList.get("referer") || "";
    const url = new URL(req.url);
    const path = url.pathname;

    // Determine device type based on user agent
    const isMobile =
      /mobile|android|iphone|ipod|blackberry|windows phone/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);
    const device = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

    // Log the visit statistics
    await prisma.statistikKunjungan.create({
      data: {
        ipAddress: typeof ipAddress === "string" ? ipAddress : ipAddress[0],
        userAgent,
        path,
        referrer: referer,
        device,
      },
    });

    const pangan = await prisma.slider.findMany({
      orderBy: {
        id: "desc",
      },
    });

    // Tambahkan alamat lengkap untuk kolom image
    const panganWithFullImageUrl = pangan.map((item) => ({
      ...item,
      image: item.image
        ? `${baseUrl}${item.image.replace("uploads/", "api/files/")}`
        : null, // Sesuaikan path 'uploads' dengan direktori Anda
    }));

    return NextResponse.json(panganWithFullImageUrl, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { status: "fail", error: e.message },
      { status: 500 },
    );
  }
}
