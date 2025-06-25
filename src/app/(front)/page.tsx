import ScrollUp from "@/components/Common/ScrollUp";
import SectionTitle from "@/components/Common/SectionTitle";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import TablePangan from "@/components/TablePangan";
import { getHargaTerkini } from "@/services/graph";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "SIPANDA SAI HAGOM",
  description: "Aplikasi Pantau Harga Pangan",
  // other metadata
};

export const revalidate = 30;

export default async function Home({
  searchParams,
}: {
  searchParams: { id?: string; tanggal?: string };
}) {
  const id = searchParams?.id || "1";

  // Jika tanggal tidak ada, gunakan tanggal hari ini dalam format yyyy-MM-dd
  const today = new Date();
  const defaultTanggal = today.toISOString().split("T")[0];
  const tanggal = searchParams?.tanggal || defaultTanggal;

  // Capture visitor information
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const ipAddress =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "unknown";
  const referer = headersList.get("referer") || "";

  // Determine device type based on user agent
  const isMobile = /mobile|android|iphone|ipod|blackberry|windows phone/i.test(
    userAgent,
  );
  const isTablet = /tablet|ipad/i.test(userAgent);
  const device = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  // Log the visit statistics
  try {
    await prisma.statistikKunjungan.create({
      data: {
        ipAddress:
          typeof ipAddress === "string"
            ? ipAddress
            : (ipAddress as string).split(",")[0],
        userAgent,
        path: "/",
        referrer: referer,
        device,
      },
    });
  } catch (error) {
    console.error("Failed to log visit statistics:", error);
  }

  const table = await getHargaTerkini();
  return (
    <>
      <ScrollUp />
      <Hero />
      <div className="container mt-10">
        <SectionTitle
          title="Tabel dan Grafik Pangan"
          paragraph="Pantau harga pangan terkini"
        />
        <Suspense fallback={"Loading..."}>
          <h1 className="text-center text-xl font-bold">Tabel Harga Terkini</h1>
          <TablePangan data={table} />
        </Suspense>
      </div>
      <Features id={id} tanggal={tanggal} />
    </>
  );
}
