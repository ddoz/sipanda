"use client";
import { getPasar } from "@/services/master-data";
import { ArrowDownCircle, ArrowUpCircle, CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

// Fungsi untuk memformat angka menjadi format Rupiah
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(angka);
};

const TablePangan = ({ data }: { data: any[] }) => {
  const [pasar, setPasar] = useState<any[]>([]);

  useEffect(() => {
    const callPasar = async () => {
      const da = await getPasar();
      setPasar(da);
    };
    callPasar();
  }, []);

  // Fungsi untuk menghitung rata-rata harga
  const calculateAverage = (hargaList: number[]) => {
    const validPrices = hargaList.filter((harga) => harga !== null && harga !== undefined);
    if (validPrices.length === 0) return "-";
    const total = validPrices.reduce((acc, curr) => acc + curr, 0);
    return formatRupiah(total / validPrices.length);
  };

  return (
    <div className="w-full p-4 overflow-x-auto rounded">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
          <tr>
            <th scope="col" className="px-4 py-2">No</th>
            <th scope="col" className="px-4 py-2">Nama</th>
            <th scope="col" className="px-4 py-2">Satuan</th>
            {pasar.map((pas, i) => (
              <th key={i} scope="col" className="px-4 py-2">{pas.nama}</th>
            ))}
            <th scope="col" className="px-4 py-2">Rata-Rata</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={index}>
              {/* Baris Utama */}
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.nama}</td>
                <td className="px-4 py-2"></td>
                {pasar.map((pas, i) => (
                  <td key={i} className="px-4 py-2"></td>
                ))}
                <td className="px-4 py-2"></td>
              </tr>

              {/* Baris Detail */}
              {item.Pangan.map((pangan, i) => {
                const hargaList: number[] = pasar.map((p) => {
                  const hargaPasar = pangan.HargaPasar?.find((h) => h.pasarId === p.id);
                  return hargaPasar?.harga ?? null;
                });

                return (
                  <tr key={i}>
                    <td className="hidden px-4 py-2"></td>
                    <td className="px-4 py-2"></td>
                    <td className="px-4 py-2">{pangan.namaPangan}</td>
                    <td className="px-4 py-2">{pangan.satuan}</td>
                    {pasar.map((p, j) => {
                      const hargaPasar = pangan.HargaPasar?.find((h) => h.pasarId === p.id);
                      return (
                        <td key={j} className="px-4 py-2">
                          <div className="flex flex-row items-center gap-2">
                            {hargaPasar ? formatRupiah(hargaPasar.harga) : "-"}
                            {hargaPasar && (
                              <span>
                                {hargaPasar.tipe === "NAIK" ? (
                                  <ArrowUpCircle className="text-red-500" />
                                ) : hargaPasar.tipe === "TURUN" ? (
                                  <ArrowDownCircle className="text-gray-500" />
                                ) : (
                                  <CheckCircle className="text-green-500" />
                                )}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    {/* Kolom Rata-Rata */}
                    <td className="px-4 py-2">{calculateAverage(hargaList)}</td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePangan;
