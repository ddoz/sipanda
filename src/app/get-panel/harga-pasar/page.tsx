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
    awal.setHours(0, 0, 0, 0);
    const akhir = searchParams.akhir ? new Date(searchParams.akhir) : new Date();
    akhir.setHours(23, 59, 59, 999);

    const [pangan,pasar,harga] = await Promise.all([getPangan(), getPasar(), getHargaByTanggalBetween({awal, akhir})]);


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