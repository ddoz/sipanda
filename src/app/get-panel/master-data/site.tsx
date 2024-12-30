"use client";

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { saveSite } from '@/services/site';
import { Textarea } from '@mantine/core'
import { notifications } from '@mantine/notifications';
import { PlusCircleIcon } from 'lucide-react'
import React, { useState } from 'react'

const SitePage = ({data}:{data:any}) => {
  const [loading, setLoading] = useState(false);
  const [judul, setJudul] = useState("");

  const save = async () => {
    setLoading(true);
    const updateData = await saveSite({
      sejarah: judul
    })

    if(updateData.status) {
      notifications.show({
        title: 'Informasi',
        message: 'Berhasil menyimpan data',
        color: 'green',
        position: 'top-center',
      });
    }else {
      notifications.show({
        title: 'Informasi',
        message: 'Gagal menyimpan data',
        color:'red',
        position: 'top-center',
      });
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
            <div className='flex flex-row justify-between'>
                <h1>Tentang Aplikasi</h1>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <section className='w-[500px] gap-2 flex flex-col border p-2 rounded-md transition-all duration-500'>
            <Textarea size='xl' defaultValue={data.sejarah} placeholder='Tentang Aplikasi' onChange={(e)=>setJudul(e.target.value)} value={judul} />
            <Button onClick={save} variant={'default'} disabled={loading}>{ loading ? 'Sedang menyimpan...' : 'Simpan'}</Button>
        </section>
      </CardContent>
    </Card>
  )
}

export default SitePage