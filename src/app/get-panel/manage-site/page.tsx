import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircle } from 'lucide-react'
import React, { Suspense } from 'react'
import Sejarah from './sejarah'
import VisiMisi from './visi-misi'
import StrukturOrganisasi from './struktur-organisasi'
import TugasFungsi from './tugas-fungsi'
import Galeri from './galeri'
import Slider from './slider'
import { getGallery, getSite, getSlider } from '@/services/site'

const ManageSitePage = async () => {

  const [site, galeri, slider] = await Promise.all([getSite(), getGallery(), getSlider()]);


  return (
    <div className='w-full flex mt-2'>
      <Tabs defaultValue="sejarah" orientation='vertical' className='w-full'>
        <TabsList>
          <TabsTrigger value="sejarah">Sejarah</TabsTrigger>
          <TabsTrigger value="visi">Visi Misi</TabsTrigger>
          <TabsTrigger value="hukum">Tugas Fungsi</TabsTrigger>
          <TabsTrigger value="struktur">Struktur Organisasi</TabsTrigger>
          <TabsTrigger value="galeri">Galeri</TabsTrigger>
          <TabsTrigger value="slider">Slider</TabsTrigger>
        </TabsList>
        <Suspense fallback={"Sedang mengambil data..."}>
          <TabsContent value="sejarah">
            {
              site && <Sejarah data={site} />
            }
          </TabsContent>
          <TabsContent value="hukum">
          {
              site && <TugasFungsi data={site} />
          }
          </TabsContent>
          <TabsContent value="visi">
          {
              site && <VisiMisi data={site} />
          }
          </TabsContent>
          <TabsContent value="struktur">
          {
              site && <StrukturOrganisasi data={site} />
          }
          </TabsContent>
          <TabsContent value="galeri">
            {
              galeri && <Galeri data={galeri} />
            }
          </TabsContent>
          <TabsContent value="slider">
            {
              slider && <Slider data={slider} />
            }
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  )
}

export default ManageSitePage