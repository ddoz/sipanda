import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const panganId = searchParams.get("panganId");

    if (!panganId) {
      return NextResponse.json(
        { status: "fail", error: "panganId parameter is required" },
        { status: 400 },
      );
    }

    const hargaList = await prisma.hargaPasar.findMany({
      where: {
        panganId: Number(panganId),
      },
      include: {
        pasar: true,
        pangan: true,
      },
      orderBy: [
        { createdAt: "desc" }, // Urutkan dari tanggal terbaru
        { pasarId: "asc" }, // Urutkan berdasarkan pasar
      ],
      take: 7, // Ambil hanya 7 data terbaru
    });

    const result: Record<
      string,
      Record<string, { tanggal: string; harga: number }[]>
    > = {};

    hargaList.forEach((h) => {
      const panganNama = "data";
      const pasarNama = h.pasar.nama;
      const harga = h.harga;
      const tanggal = h.createdAt.toISOString().split("T")[0]; // Format YYYY-MM-DD

      if (!result[panganNama]) {
        result[panganNama] = {};
      }

      if (!result[panganNama][pasarNama]) {
        result[panganNama][pasarNama] = [];
      }

      result[panganNama][pasarNama].push({ tanggal, harga });
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { status: "fail", error: e.message },
      { status: 500 },
    );
  }
}
