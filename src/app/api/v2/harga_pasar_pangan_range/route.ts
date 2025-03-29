import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Pastikan format tanggal valid
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const tanggalAwal =
      body.tanggalAwal && Date.parse(body.tanggalAwal)
        ? new Date(body.tanggalAwal)
        : today;

    const tanggalAkhir =
      body.tanggalAkhir && Date.parse(body.tanggalAkhir)
        ? new Date(body.tanggalAkhir)
        : today;

    // Membentuk kondisi where secara dinamis
    const whereClause: any = {
      tanggal: {
        gte: formatDate(tanggalAwal),
        lte: formatDate(tanggalAkhir),
      },
      ...(body.pasarId && { pasarId: Number(body.pasarId) }),
      ...(body.panganId && { panganId: Number(body.panganId) }),
    };

    const hargaList = await prisma.hargaPasar.findMany({
      where: whereClause,
      include: {
        pasar: true,
        pangan: true,
      },
      orderBy: [{ tanggal: "desc" }, { pasarId: "asc" }],
    });

    return NextResponse.json(hargaList, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { status: "fail", error: e.message },
      { status: 500 },
    );
  }
}
