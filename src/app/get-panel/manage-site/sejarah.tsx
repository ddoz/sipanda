"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircleIcon, CheckSquare2Icon, SaveAllIcon, SaveIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { saveSite } from '@/services/site'
import { ISite } from '@/interfaces/site-interface'
import { revalidatePath } from 'next/cache'

const Sejarah = ({data}:{data:ISite}) => {
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);
    const [sejarah,setSejarah] = useState('');

    const onChangeSejarah = (e:any) => {
      setSejarah(e);
    }

    useEffect(()=>{
      if(data) {
        setSejarah(data.sejarah!);
      }
    },[])

    const save = async () => {
        await saveSite({
          sejarah: sejarah
        });
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
            <div className='flex flex-row justify-between'>
                <h1>Sejarah</h1>
                <Button variant={'outline'} size={'sm'} onClick={()=>save()}><CheckSquare2Icon /></Button>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
            <ReactQuill
                theme="snow"
                value={sejarah}
                onChange={onChangeSejarah}
            />
      </CardContent>
    </Card>
  )
}

export default Sejarah