import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Ambil data pangan
    const panganList = await prisma.pangan.findMany();

    // Dapatkan tanggal 7 hari lalu dalam format YYYY-MM-DD
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    // Format ke string 'YYYY-MM-DD'
    const pad = (n: number) => n.toString().padStart(2, "0");
    const sevenDaysAgoStr = `${sevenDaysAgo.getFullYear()}-${pad(sevenDaysAgo.getMonth() + 1)}-${pad(sevenDaysAgo.getDate())}`;

    // Ambil harga pasar dengan filter tanggal (string comparison)
    const hargaPasarList = await prisma.hargaPasar.findMany({
      // where: {
      //   tanggal: {
      //     gte: sevenDaysAgoStr, // dibandingkan sebagai string
      //   },
      // },
      select: {
        panganId: true,
        harga: true,
      },
      orderBy: {
        tanggal: "desc",
      },
      take: 7,
    });

    // Gabungkan hasilnya dengan perhitungan modus
    const result = panganList.map((pangan) => {
      const hargaList = hargaPasarList
        .filter((h) => h.panganId === pangan.id)
        .map((h) => h.harga);

      const freqMap = new Map<number, number>();
      hargaList.forEach((harga) => {
        freqMap.set(harga, (freqMap.get(harga) || 0) + 1);
      });

      let modus = 0;
      let maxFreq = 0;
      for (const [harga, freq] of freqMap.entries()) {
        if (freq > maxFreq) {
          modus = harga;
          maxFreq = freq;
        }
      }

      return {
        ...pangan,
        rataRataHarga: modus,
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
