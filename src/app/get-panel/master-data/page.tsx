import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getKategoriPangan, getPasar } from '@/services/master-data';

import KategoriPangan from './kategori-pangan';
import Pasar from './pasar';

export default async function MasteDataPage() {
  const [dataKategoriPangan, dataPasar] = await Promise.all([getKategoriPangan(), getPasar()]);

  return (
    <div className='flex w-full mt-2'>
      <Tabs defaultValue="kategoripangan" orientation='vertical' className='w-full'>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="kategoripangan">Kategori Pangan</TabsTrigger>
            <TabsTrigger value="pasar">Pasar</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="kategoripangan">
          {
            dataKategoriPangan && <KategoriPangan data={dataKategoriPangan} />
          }
        </TabsContent>
        <TabsContent value="pasar">
          {
            dataPasar && <Pasar data={dataPasar} />
          }
        </TabsContent>
      </Tabs>
    </div>
  );
}
