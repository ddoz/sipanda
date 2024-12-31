import ScrollUp from "@/components/Common/ScrollUp";
import SectionTitle from "@/components/Common/SectionTitle";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import TablePangan from "@/components/TablePangan";
import { getHargaTerkini } from "@/services/graph";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "SIPANDA SAI HAGOM",
  description: "Aplikasi Pantau Harga Pangan",
  // other metadata
};

export const revalidate = 30;

export default async function Home({searchParams}:{searchParams: {id?: string,tanggal?: string}}) {
  const id = searchParams?.id || "1";

  // Jika tanggal tidak ada, gunakan tanggal hari ini dalam format yyyy-MM-dd
  const today = new Date();
  const defaultTanggal = today.toISOString().split("T")[0];
  const tanggal = searchParams?.tanggal || defaultTanggal;

  const table = await getHargaTerkini();
  return (
    <>
      <ScrollUp />
      <Hero />
      <div className="container mt-10">
        <SectionTitle 
          title="Tabel dan Grafik Pangan"
          paragraph="Pantau harga pangan terkini"
        />
        <Suspense fallback={"Loading..."}>
          <h1 className="text-xl font-bold text-center">Tabel Harga Terkini</h1>
          <TablePangan data={table} />
        </Suspense>
      </div>
      <Features id={id} tanggal={tanggal} />
    </>
  );
}
