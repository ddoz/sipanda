import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIPANDA SAI HAGOM",
  description: "Aplikasi Pantau Harga Pangan",
  // other metadata
};

export default function Home({searchParams}:{searchParams: {id?: string,tanggal?: string}}) {
  const id = searchParams?.id || "1";

  // Jika tanggal tidak ada, gunakan tanggal hari ini dalam format yyyy-MM-dd
  const today = new Date();
  const defaultTanggal = today.toISOString().split("T")[0];
  const tanggal = searchParams?.tanggal || defaultTanggal;

  return (
    <>
      <ScrollUp />
      <Hero />
      <Features id={id} tanggal={tanggal} />
      {/* <AboutSectionTwo /> */}
    </>
  );
}
