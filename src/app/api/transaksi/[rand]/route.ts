import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TipeHarga } from '@prisma/client';

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { tanggal, harga, panganId, pasarId, userId } = body;

    console.log(body);
    // Cari harga dari tanggal sebelumnya
    const previousHarga = await prisma.hargaPasar.findFirst({
      where: {
        panganId: panganId,
        pasarId: pasarId,
        tanggal: {
          lt: tanggal, // Kurang dari tanggal yang sedang diproses
        },
      },
      orderBy: {
        tanggal: 'desc', // Urutkan berdasarkan tanggal, ambil yang terbaru sebelum tanggal yang diproses
      },
    });

    // Hitung persentase perubahan jika harga sebelumnya ditemukan
    
    let tipe: TipeHarga = TipeHarga.STABIL; // default type
    const newHarga = parseFloat(harga);

    let oldHarga = 0;
    let percentageChange = 0;

    if (previousHarga) {
      oldHarga = parseFloat(previousHarga.harga.toString());

      // Bandingkan harga lama dengan harga baru
      if (newHarga > oldHarga) {
        tipe = TipeHarga.NAIK;
        percentageChange = ((newHarga - oldHarga) / oldHarga) * 100;
      } else if (newHarga < oldHarga) {
        tipe = TipeHarga.TURUN;
        percentageChange = ((oldHarga - newHarga) / oldHarga) * 100;
      }
    } else {
      // Jika tidak ada harga sebelumnya, asumsikan ini adalah harga pertama, maka langsung 'NAIK'
      tipe = TipeHarga.NAIK;
      percentageChange = 100; // Anggap kenaikan penuh untuk data baru
    }

    // Cek apakah data untuk tanggal ini sudah ada
    const existingData = await prisma.hargaPasar.findUnique({
      where: {
        panganId_pasarId_tanggal: {
          panganId: panganId,
          pasarId: pasarId,
          tanggal: tanggal,
        },
      },
    });
    console.log(existingData);

    if (existingData) {
      console.log('sinitialized')
      // Jika data sudah ada, lakukan update
      await prisma.hargaPasar.update({
        where: {
          panganId_pasarId_tanggal: {
            panganId: panganId,
            pasarId: pasarId,
            tanggal: tanggal,
          },
        },
        data: {
          harga: newHarga,
          tipe: `${tipe}`,
          persentase: `${percentageChange.toFixed(2)}%`,
        },
      });
    } else {
      // Jika data tidak ada, lakukan create
      await prisma.hargaPasar.create({
        data: {
          panganId: panganId,
          pasarId: pasarId,
          tanggal: tanggal,
          harga: newHarga,
          tipe: `${tipe}`,
          persentase: `${percentageChange.toFixed(2)}%`,
          userId: userId, // Assuming userId is 1, change as needed
        },
      });
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
      
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ status: 'fail', error: e.message }, { status: 500 });
  }
}

