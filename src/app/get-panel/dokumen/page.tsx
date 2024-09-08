import React, { Suspense } from 'react'
import Content from './content'
import { getKategoriDokumen } from '@/services/master-data'
import { getDokumen } from '../../../services/dokumen';

const DokumenPage = async ({
    searchParams
  }: {
    searchParams: { page: string };
  }) => {
    const page = parseInt(searchParams.page) || 1;
    const kategoriDokumen = await getKategoriDokumen();
    const limit = 20;
    const { dokumen, total } = await getDokumen(page, limit);

    const totalPages = Math.ceil(total / limit);

  return (
    <div className='w-full flex mt-2'>
        <Content 
            data={dokumen} 
            kategori={kategoriDokumen}
            currentPage={page}
            totalPages={totalPages} 
        />
    </div>
  )
}

export default DokumenPage