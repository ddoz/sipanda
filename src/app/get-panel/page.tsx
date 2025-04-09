import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterChart from "@/components/Chart/FilterChart";
import PanganChart from "@/components/Chart/PanganChart";
import { getGrafikTanggal } from "@/services/graph";
import { Suspense } from "react";

export default async function BackendPage({
  searchParams,
}: {
  searchParams: { id: string; tanggal: string };
}) {
  const id = searchParams.id ?? "1";
  const today = new Date();
  const defaultTanggal = today.toISOString().split("T")[0];
  const tanggal = searchParams?.tanggal || defaultTanggal;

  const data: any = await getGrafikTanggal({ id: id, tanggal: tanggal });

  return (
    <div className="mt-4 w-full">
      <h1 className="text-xl uppercase text-slate-500">Selamat Datang</h1>
      <h1 className="text-4xl uppercase text-slate-800">
        Aplikasi SIPANDA SAI HAGOM
      </h1>
      <h1 className="text-2xl uppercase">Dinas Pangan Kota Bandar Lampung</h1>

      <div className="mt-4 flex flex-col gap-4">
        <FilterChart />

        <Suspense fallback={"Loading..."}>
          {data && data.pangan && (
            <PanganChart
              data={data.hargaPerPasar}
              tanggal={tanggal}
              pangan={data.pangan.namaPangan}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}
