"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare2Icon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { ISite } from '@/interfaces/site-interface';
import { saveSite } from '@/services/site';
import { revalidatePath } from 'next/cache';

const TugasFungsi = ({data}:{data:ISite}) => {
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);
    const [tugas,setTugas] = useState('');

    const onChangeTugas = (e:any) => {
      setTugas(e);
    }
    
    useEffect(()=>{
      if(data) {
        setTugas(data.tugasDanFungsi!);
      }
    },[])

    const save = async () => {
        await saveSite({
          tugasDanFungsi: tugas
        });
    }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
            <div className='flex flex-row justify-between'>
                <h1>Tugas dan Fungsi</h1>
                <Button variant={'outline'} size={'sm'} onClick={()=>save()}><CheckSquare2Icon /></Button>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReactQuill
              theme="snow"
              value={tugas}
              onChange={onChangeTugas}
        />
      </CardContent>
    </Card>
  )
}

export default TugasFungsi