"use server";
import prisma from "@/lib/prisma"
import { TipeHarga } from "@prisma/client";
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

export const updateHarga = async ({ panganId, pasarId, date, harga }:{ panganId:number, pasarId:number, date:any, harga:any }) => {
  var tipe:TipeHarga = TipeHarga.STABIL; // default type
  let percentageChange = 0;

  try {
    // Find the existing harga for the given panganId, pasarId, and date
    const existingHarga = await prisma.hargaPasar.findUnique({
      where: {
        panganId_pasarId_tanggal: {
          panganId,
          pasarId,
          tanggal: new Date(date),
        },
      },
    });

    if (existingHarga) {
      const oldHarga = parseFloat(existingHarga.harga.toString());
      const newHarga = parseFloat(harga);

      // Calculate the percentage change and determine if naik, turun, or stabil
      if (newHarga > oldHarga) {
        tipe = TipeHarga.NAIK;
        percentageChange = ((newHarga - oldHarga) / oldHarga) * 100;
      } else if (newHarga < oldHarga) {
        tipe = TipeHarga.TURUN;
        percentageChange = ((oldHarga - newHarga) / oldHarga) * 100;
      } else {
        tipe = TipeHarga.STABIL;
      }
    } else {
      tipe = TipeHarga.NAIK; // If there's no previous price, assume it's a new entry and mark it as "naik"
    }

    // Update or create the new harga in the database
    const updatedHarga = await prisma.hargaPasar.upsert({
      where: {
        panganId_pasarId_tanggal: {
          panganId,
          pasarId,
          tanggal: new Date(date),
        },
      },
      update: {
        harga,
        tipe: `${tipe}`,
        persentase:  `${percentageChange.toFixed(2)}%`
      },
      create: {
        panganId: panganId,
        pasarId: pasarId,
        tanggal: new Date(date),
        harga: harga,
        tipe: `${tipe}`,
        userId: 1
      },
    });

    return {
      status: true
    }
  } catch (error) {
    return {
      status: false
    }
  }
};