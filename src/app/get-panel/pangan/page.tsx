import React, { Suspense } from 'react'
import Content from './content'
import {  getKategoriPangan, getPanganPagination } from '@/services/master-data'

const DokumenPage = async ({
    searchParams
  }: {
    searchParams: { page: string };
  }) => {
    const page = parseInt(searchParams.page) || 1;
    const limit = 20;
    const [kategoriPangan, { pangan, total }] = await Promise.all([getKategoriPangan(), getPanganPagination(page, limit)]);

    const totalPages = Math.ceil(total / limit);

  return (
    <div className='flex w-full mt-2'>
        <Content 
            data={pangan} 
            kategori={kategoriPangan}
            currentPage={page}
            totalPages={totalPages} 
        />
    </div>
  )
}

export default DokumenPage