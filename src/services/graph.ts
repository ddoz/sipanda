"use server";
import prisma from '@/lib/prisma';

export async function getGrafikTanggal({id,tanggal}:{id:string,tanggal:string}) {
  const pangan = await prisma.pangan.findFirst(
    {
      where:{
        id: parseInt(id),
      },
    }
  )

  const pasar = await prisma.pasar.findMany();

  let hargaPerPasar = [];
  for (const val of pasar) {
    const getHarga = await prisma.hargaPasar.findFirst({
      where: {
        panganId: pangan.id,
        pasarId: val.id,
        tanggal: tanggal
      },
      orderBy: {
        tanggal: 'desc',
      },
      take: 1,
    });

    let dataToPush = {
      pasar: val.nama,
      harga: getHarga?.harga ?? '0',
      tanggal: tanggal,
    };

    hargaPerPasar.push(dataToPush);
  }

  const output = {
    pangan,
    hargaPerPasar,
  }

  return output;
}