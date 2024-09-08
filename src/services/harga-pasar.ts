"use server";
import prisma from "@/lib/prisma"
import { toZonedTime, format } from 'date-fns-tz';

const convertToUTC = (date, timeZone) => {
  return toZonedTime(date, timeZone);
};

export async function getHargaByTanggalBetween({
  awal,
  akhir
}:{
  awal: Date,
  akhir: Date
}) {
  try {
    const timeZone = 'Asia/Jakarta';
    const utcAwal = convertToUTC(new Date(awal), timeZone);
    const utcAkhir = convertToUTC(new Date(akhir), timeZone);

    const hargas = await prisma.hargaPasar.findMany({
      where: {
        tanggal: {
          gte: utcAwal,
          lte: utcAkhir
        }
      },
    })

    return hargas;


  } catch (error) {
    return []
  }
}