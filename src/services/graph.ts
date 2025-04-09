"use server";
import prisma from "@/lib/prisma";

export async function getGrafikTanggal({
  id,
  tanggal,
}: {
  id: string;
  tanggal: string;
}) {
  const pangan = await prisma.pangan.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  if (!pangan) {
    return {
      status: "fail",
      error: "Pangan tidak ditemukan",
    };
  }

  const pasar = await prisma.pasar.findMany();

  let hargaPerPasar: any[] = [];
  for (const val of pasar) {
    const getHarga = await prisma.hargaPasar.findFirst({
      where: {
        panganId: pangan.id,
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

  return output;
}

export async function getHargaTerkini() {
  const data = await prisma.kategoriPangan.findMany({
    include: {
      Pangan: {
        include: {
          HargaPasar: {
            orderBy: {
              tanggal: "desc",
            },
          },
        },
      },
    },
  });

  // Filter harga terkini per pasarId di setiap pangan
  const result = data.map((kategori) => ({
    ...kategori,
    Pangan: kategori.Pangan.map((pangan) => ({
      ...pangan,
      HargaPasar: pangan.HargaPasar.reduce((acc: any[], current) => {
        const existing = acc.find((item) => item.pasarId === current.pasarId);
        if (!existing) {
          acc.push(current);
        }
        return acc;
      }, []),
    })),
  }));

  return result;
}
