"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircleIcon, CheckSquare2Icon, SaveAllIcon, SaveIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ISite } from '@/interfaces/site-interface'
import axios from 'axios'
import { useDisclosure } from '@mantine/hooks'
import { Alert, Modal } from '@mantine/core'
import MediaList from '../media/media-list'
import { IconInfoCircle } from '@tabler/icons-react'
import { saveSite } from '@/services/site'
import { notifications } from '@mantine/notifications'
import ViewFileComponent from '@/components/view-file'

const StrukturOrganisasi = ({data}:{data:ISite}) => {
    const [file,setFile] = useState('');
    const [struktur,setStruktur] = useState('');
    const [choosen,setChoosen] = useState('');
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(()=>{
      if(data) {
        setStruktur(data.strukturOrganisasi!);
      }
    },[])

    const handlePilihGambar = (file:string) => {
      setFile(file);
      setChoosen('Gambar sudah dipilih. Silahkan Simpan.');
      close();
    }

    const save = async () => {
      const store = await saveSite({
        strukturOrganisasi: file
      });

      if(store.status) {
        setChoosen('');
        notifications.show({
          title: 'Sukses',
          message: 'Berhasil menyimpan data.',
          color: 'green',
       });
      }else {
        notifications.show({
          title: 'Gagal',
          message: 'Gagal menyimpan data.',
          color:'red',
        });
      }
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
            <div className='flex flex-row justify-between'>
                <h1>Struktur Organisasi</h1>
                <Button variant={'outline'} size={'sm'} onClick={save}><CheckSquare2Icon /></Button>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Button onClick={open}>Pilih Gambar</Button>
      </div>
      {
        choosen && <Alert className='mt-5' variant="light" color="blue" title="Informasi" icon={<IconInfoCircle />}>
        {choosen}
      </Alert>
      }

      {
        struktur && <div className='mt-5'><ViewFileComponent filePath={struktur} title='Struktur Organisasi' /></div>
      }

      <Modal opened={opened} onClose={close} title="Media Library" size={'80%'}>
        <MediaList select={true} onSelect={handlePilihGambar} />
      </Modal>
      </CardContent>
    </Card>
  )
}

export default StrukturOrganisasi