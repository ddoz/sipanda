import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Ambil data pangan
    const panganList = await prisma.pangan.findMany();

    // Ambil rata-rata harga per panganId
    const hargaRataRata = await prisma.hargaPasar.groupBy({
      by: ["panganId"],
      _avg: {
        harga: true,
      },
    });

    // Gabungkan hasilnya
    const result = panganList.map((pangan) => {
      const avgHarga =
        hargaRataRata.find((h) => h.panganId === pangan.id)?._avg.harga || 0;
      return {
        ...pangan,
        rataRataHarga: avgHarga,
      };
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
