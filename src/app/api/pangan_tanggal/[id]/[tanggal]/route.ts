import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cors from "@/lib/cors";
import { getFormattedDate } from "@/lib/utils";

interface Params {
  params: {
    id: string;
    tanggal: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id, tanggal } = params;
    const pangan = await prisma.pangan.findFirst({
      where: {
        id: parseInt(params.id.toString()),
      },
    });

    const pasar = await prisma.pasar.findMany();

    let hargaPerPasar: any[] = [];
    for (const val of pasar) {
      const getHarga = await prisma.hargaPasar.findFirst({
        where: {
          panganId: pangan?.id,
          pasarId: val.id,
          tanggal: tanggal,
        },
        orderBy: {
          tanggal: "desc",
        },
        take: 1,
      });

      let dataToPush: any = {
        pasar: val.nama,
        harga: getHarga?.harga ?? "0",
        tanggal: tanggal,
      };

      hargaPerPasar.push(dataToPush);
    }

    const output = {
      pangan,
      hargaPerPasar,
    };

    return NextResponse.json(output, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { status: "fail", error: e.message },
      { status: 500 },
    );
  }
}
