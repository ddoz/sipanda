import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Tetapkan default value
    const pasarId = Number(body.pasarId) || 1;
    const panganId = Number(body.panganId) || 1;

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

    const hargaList = await prisma.hargaPasar.findMany({
      where: {
        panganId: panganId,
        pasarId: pasarId,
        tanggal: {
          gte: formatDate(tanggalAwal),
          lte: formatDate(tanggalAkhir),
        },
      },
      include: {
        pasar: true,
        pangan: true,
      },
      orderBy: [{ createdAt: "desc" }, { pasarId: "asc" }],
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
