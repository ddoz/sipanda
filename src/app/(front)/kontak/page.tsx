import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sipanda - Dinas Pangan Bandar Lampung",
  description: "Sipanda - Dinas Pangan Bandar Lampung",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Kontak"
        description="Kontak Dinas Pangan Kota Bandar Lampung."
      />
      <Contact />
    </>
  );
};

export default AboutPage;
