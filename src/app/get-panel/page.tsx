import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function BackendPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  // const { products, newOffset, totalProducts } = await getProducts(
  //   search,
  //   Number(offset)
  // );

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Home</TabsTrigger>
        </TabsList>
        {/* <div className="flex items-center gap-2 ml-auto">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </div> */}
      </div>
      <TabsContent value="all">
        <h1 className='text-xl uppercase text-slate-500'>Selamat Datang</h1>
        <h1 className='text-4xl uppercase text-slate-800'>Aplikasi SIPANDA SAI HAGOM</h1>
        <h1 className='text-2xl uppercase'>Dinas Pangan Kota Bandar Lampung</h1>
      </TabsContent>
    </Tabs>
  );
}
