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

    // Ambil semua pasar yang memiliki data harga terkait panganId tertentu
    const pasarList = await prisma.pasar.findMany({
      select: { id: true, nama: true },
    });

    const result: Record<
      string,
      Record<string, { tanggal: string; harga: number }[]>
    > = {};

    for (const pasar of pasarList) {
      const hargaList = await prisma.hargaPasar.findMany({
        where: {
          panganId: Number(panganId),
          pasarId: pasar.id,
        },
        orderBy: {
          tanggal: "desc", // Urutkan dari tanggal terbaru
        },
        take: 7, // Ambil 7 data terakhir per pasar
      });

      if (hargaList.length > 0) {
        const panganNama = "data";
        if (!result[panganNama]) result[panganNama] = {};
        result[panganNama][pasar.nama] = hargaList.map((h) => ({
          tanggal: h.tanggal,
          harga: h.harga,
        }));
      }
    }

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { status: "fail", error: e.message },
      { status: 500 },
    );
  }
}
