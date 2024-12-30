import React, { Suspense } from 'react'
import Content from './content'
import { getPangan, getPasar } from '@/services/master-data'
import { getHargaByTanggalBetween } from '@/services/harga-pasar';

const HargaPage = async ({
    searchParams
  }: {
    searchParams: { page: string, awal: string, akhir };
  }) => {
    const awal = searchParams.awal ? new Date(searchParams.awal) : new Date();
    const akhir = searchParams.akhir ? new Date(searchParams.akhir) : new Date();
    const formatter = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    
    const formatDate = (date: Date) => {
      const parts = formatter.formatToParts(date);
      const year = parts.find((p) => p.type === "year")?.value;
      const month = parts.find((p) => p.type === "month")?.value;
      const day = parts.find((p) => p.type === "day")?.value;
      return `${year}-${month}-${day}`;
    };
    
    const awalFormatted = formatDate(awal);
    const akhirFormatted = formatDate(akhir);

    const [pangan,pasar,harga] = await Promise.all([getPangan(), getPasar(), getHargaByTanggalBetween({awal:awalFormatted, akhir:akhirFormatted})]);


  return (
    <div className='flex w-full mt-2'>
        <Content 
            data={harga} 
            pangan={pangan}
            pasar={pasar}
            awal={awal}
            akhir={akhir}
        />
    </div>
  )
}

export default HargaPage