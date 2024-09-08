"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircleIcon, CheckSquare2Icon, SaveAllIcon, SaveIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { ISite } from '@/interfaces/site-interface';
import { saveSite } from '@/services/site';
import { revalidatePath } from 'next/cache';

const VisiMisi = ({data}:{data:ISite}) => {
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);
    const [visi,setVisi] = useState('');

    const onChangeVisi = (e:any) => {
      setVisi(e);
    }

    useEffect(()=>{
      if(data) {
        setVisi(data.visiMisi!);
      }
    },[])

    const save = async () => {
        await saveSite({
          visiMisi: visi
        });
    }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
            <div className='flex flex-row justify-between'>
                <h1>Visi Misi</h1>
                <Button variant={'outline'} size={'sm'} onClick={()=>save()}><CheckSquare2Icon /></Button>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReactQuill
            theme="snow"
            value={visi}
            onChange={onChangeVisi}
        />
      </CardContent>
    </Card>
  )
}

export default VisiMisi