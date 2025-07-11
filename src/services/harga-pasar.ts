"use server";
import prisma from "@/lib/prisma";
import { TipeHarga } from "@prisma/client";
import { toZonedTime, format } from "date-fns-tz";
import { revalidatePath } from "next/cache";

const convertToUTC = (date, timeZone) => {
  return toZonedTime(date, timeZone);
};

export async function getHargaByTanggalBetween({
  awal,
  akhir,
  panganId,
}: {
  awal: string;
  akhir: string;
  panganId: string;
}) {
  try {
    const awalAdjusted = awal;

    const akhirAdjusted = akhir;

    const hargas = await prisma.hargaPasar.findMany({
      where: {
        tanggal: {
          gte: awalAdjusted,
          lte: akhirAdjusted,
        },
        ...(panganId && { panganId: parseInt(panganId) }),
      },
    });

    return hargas;
  } catch (error) {
    return [];
  }
}

const convertToUTC2 = (date: Date) => {
  return new Date(date.toISOString().split("T")[0]); // Mengambil bagian tanggal dari ISO string
};

export const updateHarga = async ({ inputValues }: { inputValues: any }) => {
  const promises: any[] = []; // Array untuk menampung semua promises

  try {
    // Looping object
    for (const key in inputValues) {
      if (inputValues.hasOwnProperty(key)) {
        // Extract data key
        let extractor = key.split("-");
        const panganId = parseInt(extractor[0]);
        const pasarId = parseInt(extractor[1]);
        const tanggalBelumFix = extractor[2];
        const inputDate = tanggalBelumFix; // Input format DD/MM/YYYY
        const [day, month, year] = inputDate.split("/"); // Pisahkan input dengan format "dd/mm/yyyy"

        // Tambahkan '0' jika day atau month kurang dari 10
        const formattedDay = day.padStart(2, "0");
        const formattedMonth = month.padStart(2, "0");

        // Gabungkan ke dalam format yyyy-mm-dd
        const tanggal = `${year}-${formattedMonth}-${formattedDay}`;

        // Tambahkan promise ke dalam array
        promises.push(
          (async () => {
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
                tanggal: "desc", // Urutkan berdasarkan tanggal, ambil yang terbaru sebelum tanggal yang diproses
              },
            });

            // Hitung persentase perubahan jika harga sebelumnya ditemukan

            let tipe: TipeHarga = TipeHarga.STABIL; // default type
            const newHarga = parseFloat(inputValues[key]);

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
              console.log("sinitialized");
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
                  userId: 1, // Assuming userId is 1, change as needed
                },
              });
            }
          })(),
        );
      }
    }

    // Jalankan semua promises secara paralel
    await Promise.all(promises);
    revalidatePath(`/get-panel/harga-pasar`, "page");
    return {
      status: true,
    };
  } catch (error) {
    console.error("Error updating harga:", error);
    return {
      status: false,
      message: "Error occurred while updating harga.",
    };
  }
};
