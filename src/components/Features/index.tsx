import { getGrafikTanggal } from "@/services/graph";
import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";
import FilterChart from "../Chart/FilterChart";
import PanganChart from "../Chart/PanganChart";

const Features = async ({id,tanggal}:{id: string,tanggal: string}) => {
  const data = await getGrafikTanggal({id:id,tanggal: tanggal});
  
  return (
    <>
      <section id="features" className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="Fitur Utama"
            paragraph="Aplikasi ini menyajikan data harga pangan terkini."
            center
          />

          <FilterChart />

          <PanganChart data={data.hargaPerPasar} pangan={data.pangan.namaPangan} tanggal={tanggal} />

          <div className="grid grid-cols-1 mt-10 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
