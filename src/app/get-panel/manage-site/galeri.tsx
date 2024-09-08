"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ActionIcon, Alert, FileButton, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHttpDelete, IconInfoCircle, IconTrashFilled } from '@tabler/icons-react'
import { CheckSquare2Icon, PlusCircleIcon, TrashIcon } from 'lucide-react'
import React, { useState } from 'react'
import MediaList from '../media/media-list';
import { notifications } from '@mantine/notifications';
import { saveGallery, deleteGallery } from '@/services/site';
import ViewFileComponent from '@/components/view-file';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

const Galeri = ({data}:{data:any}) => {
    const [file,setFile] = useState('');
    const [choosen,setChoosen] = useState('');
    const [opened, { open, close }] = useDisclosure(false);
    const [showForm, setShowForm] = useState(false);
    const [judul, setJudul] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [idGaleri, setIdGaleri] = useState('');

    
    const handlePilihGambar = (file:string) => {
        setFile(file);
        setChoosen('Gambar sudah dipilih. Silahkan Simpan.');
        close();
    }

    const save = async () => {
       
        if(judul == '') {
            notifications.show({
                title: 'Informasi',
                message: 'Harap isi judul gambar terlebih dahulu',
                color:'red',
                position: 'top-center',
            });
            return;
        }

        if(file.length == 0) {
            notifications.show({
                title: 'Informasi',
                message: 'Harap pilih gambar terlebih dahulu',
                color:'red',
                position: 'top-center',
            });
            return;
        }

        setLoading(true);

        const saveing = await saveGallery({
            title: judul,
            file: file
        })
        if(saveing.status) {
            notifications.show({
                title: 'Informasi',
                message: 'Berhasil menyimpan gambar',
                color: 'green',
                position: 'top-center',
            });
            setChoosen('');
            setShowForm(false);
            setLoading(false);
        }else {
            notifications.show({
                title: 'Informasi',
                message: 'Gagal menyimpan gambar',
                color:'red',
                position: 'top-center',
            });
            setLoading(false);
        }
    }

    const deleteGaleri = (id:any) => {
        setOpenDialog(!openDialog)
        setIdGaleri(id);
    }

    const confirmDelete = async () => {
        const del = await deleteGallery({
            id: parseInt(idGaleri)
        });
        if(del.status) {
            notifications.show({
                title: 'Informasi',
                message: 'Berhasil menghapus data',
                color: 'green',
                position: 'top-center',
            });
            setOpenDialog(false);
        }else {
            notifications.show({
                title: 'Informasi',
                message: 'Gagal menghapus data',
                color:'red',
                position: 'top-center',
            });
            setOpenDialog(false);
        }
    }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
            <div className='flex flex-row justify-between'>
                <h1>Galeri</h1>
                <Button variant={'outline'} size={'sm'} onClick={()=>setShowForm(!showForm)}><PlusCircleIcon /></Button>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {
            showForm && <section className='w-[300px] gap-2 flex flex-col border p-2 rounded-md transition-all duration-500'>
                <Input placeholder='Judul Gambar' onChange={(e)=>setJudul(e.target.value)} />
                <div className="w-full max-w-sm items-center gap-1.5">
                    <Button onClick={open} variant={'secondary'}>Pilih Gambar</Button>
                </div>
                {
                    choosen && <Alert variant="light" color="blue" title="Informasi" icon={<IconInfoCircle />}>
                    {choosen}
                    </Alert>
                }
                <Button onClick={save} variant={'default'} disabled={loading}>{ loading ? 'Sedang menyimpan...' : 'Simpan'}</Button>
            </section>
        }

        {
            data && <section className='mt-5'>
                <div className='flex flex-row flex-wrap gap-2'>
                    {
                        data.map((item:any, index:number) => (
                            <div key={index} className='w-[200px] h-[200px] overflow-hidden border border-gray-300 rounded-md relative'>
                                <div  className='absolute top-1 right-1'>
                                    <ActionIcon variant="transparent" aria-label="delete" onClick={()=>deleteGaleri(item.id)}>
                                        <IconTrashFilled style={{ width: '70%', height: '70%' }} stroke={1.5} color='red' />
                                    </ActionIcon>
                                </div>
                               <ViewFileComponent filePath={item.file} title='' />
                                <span className='absolute bottom-0 w-full text-center bg-slate-600 opacity-50 p-2 text-white'>
                                    {item.title}
                                </span>
                            </div>
                        ))
                    }
                </div>
            </section>
        }
        

        <Modal opened={opened} onClose={close} title="Media Library" size={'80%'}>
            <MediaList select={true} onSelect={handlePilihGambar} />
        </Modal>

        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Hapus Data ini?</AlertDialogTitle>
                <AlertDialogDescription>
                    Data akan dihapus data sistem, dan tidak dapat dikembalikan lagi.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>Ya</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default Galeri