"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ViewFileComponent from '@/components/view-file'
import { IMedia } from '@/interfaces/media-interface'
import { getMedia } from '@/services/media'
import { Button } from '@mantine/core'
import React, { Suspense, useEffect, useState } from 'react'

const MediaList = ({select = false, data, onSelect}:{select?:boolean, data?:IMedia[], onSelect?:(val:string)=>void}) => {
    const [mediaList, setMediaList] = useState<IMedia[]>([])
    useEffect(()=>{
        if(!data) {
            const callApi = async () => {
                const response = await getMedia({fileType:''})
                if(response.status && response.data){
                    setMediaList(response.data)
                }
            }
            callApi();
        }else {
            setMediaList(data)
        }
    },[data])
    const pilihGambar = (val:string) => {
        if(onSelect) {
            onSelect(val);
        }
    }
  return (
    <>
        <div className='flex flex-row justify-between'>
            {
                select && <h1 className='text-slate-600'>Pilih Gambar</h1>
            }
        </div>

        <div className='flex flex-row flex-wrap gap-2 mt-5'>
            {
                mediaList && mediaList.map((media,index) => {
                    return <div onClick={()=>pilihGambar(media.fileName)} key={index} className='w-[200px] h-[200px] bg-white p-1 rounded-md shadow'><ViewFileComponent filePath={media.fileName} title='' /></div>
                })
            }
        </div>
    </>
  )
}

export default MediaList