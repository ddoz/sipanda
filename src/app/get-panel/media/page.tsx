import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckSquare2Icon, File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import MediaContentPage from './media';
import { getMedia } from '@/services/media';
import { Suspense } from 'react';

export default async function MediaPage() {

  const mediaData = await getMedia({fileType:''})
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
            <div className='flex flex-row justify-between'>
                <h1>Media Library</h1>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={'Loading data'}>
          {mediaData && mediaData.data && <MediaContentPage select={false} data={mediaData.data} />}
        </Suspense>
      </CardContent>
    </Card>
  );
}
