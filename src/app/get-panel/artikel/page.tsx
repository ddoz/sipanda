import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckSquare2Icon, PlusCircle } from 'lucide-react'
import React, { Suspense } from 'react'
import Content from './content'
import { getKategoriArtikel } from '@/services/master-data'
import { getBerita } from '@/services/artikel'

const BeritaPage = async ({
    searchParams
  }: {
    searchParams: { page: string };
  }) => {
    const page = parseInt(searchParams.page) || 1;
    const kategoriBerita = await getKategoriArtikel();
    const limit = 20;
    const { berita, total } = await getBerita(page, limit);

    const totalPages = Math.ceil(total / limit);

  return (
    <div className='flex w-full mt-2'>
        <Content 
            data={berita} 
            kategori={kategoriBerita}
            currentPage={page}
            totalPages={totalPages} 
        />
    </div>
  )
}

export default BeritaPage