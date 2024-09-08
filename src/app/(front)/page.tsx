import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIPANDA SAI HAGOM",
  description: "Aplikasi Pantau Harga Pangan",
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      {/* <AboutSectionTwo /> */}
    </>
  );
}
