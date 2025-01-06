"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ActionIcon } from '@mantine/core';
import { IconPencil, IconTrashFilled } from '@tabler/icons-react'
import { PlusCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import { notifications } from '@mantine/notifications';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { deleteKategoriPangan, saveKategoriPangan, updateKategoriPangan } from '@/services/master-data';

const KategoriPangan = ({data}:{data:any}) => {
    const [showForm, setShowForm] = useState(false);
    const [judul, setJudul] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [id, setId] = useState('');

    
    const save = async () => {
        if(judul == '') {
            notifications.show({
                title: 'Informasi',
                message: 'Harap isi nama kategori terlebih dahulu',
                color:'red',
                position: 'top-center',
            });
            return;
        }
        
        if(id!= '') {
            confirmUpdate();
            return;
        }
        
        setLoading(true);

        const saveing = await saveKategoriPangan({
            namaKategori: judul
        })
        if(saveing.status) {
            notifications.show({
                title: 'Informasi',
                message: 'Berhasil menyimpan data',
                color: 'green',
                position: 'top-center',
            });
            setShowForm(false);
            setLoading(false);
        }else {
            notifications.show({
                title: 'Informasi',
                message: 'Gagal menyimpan data',
                color:'red',
                position: 'top-center',
            });
            setLoading(false);
        }
    }

    const updateData = (item:any) => {
        setId(item.id);
        setShowForm(true);
        setJudul(item.nama);
    }

    const confirmUpdate = async () =>{
        setLoading(true);
        const update = await updateKategoriPangan({
            id: parseInt(id),
            namaKategori: judul
        });
        if(update.status) {
            notifications.show({
                title: 'Informasi',
                message: 'Berhasil mengubah data',
                color: 'green',
                position: 'top-center',
            });
            setId("");
            setShowForm(false);
            setLoading(false);
        }else {
            notifications.show({
                title: 'Informasi',
                message: 'Gagal mengubah data',
                color:'red',
                position: 'top-center',
            });
            setLoading(false);
        }
    }

    const deleteData = (id:any) => {
        setOpenDialog(!openDialog)
        setId(id);
    }

    const confirmDelete = async () => {
        const del = await deleteKategoriPangan({
            id: parseInt(id)
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

    const create = () => {
        setShowForm(true);
        setJudul('');
        setId('');
    }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
            <div className='flex flex-row justify-between'>
                <h1>Kategori Pangan</h1>
                <Button variant={'outline'} size={'sm'} onClick={()=>create()}><PlusCircleIcon /></Button>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {
            showForm && <section className='w-[300px] gap-2 flex flex-col border p-2 rounded-md transition-all duration-500'>
                <Input placeholder='Nama Kategori' onChange={(e)=>setJudul(e.target.value)} value={judul} />
                <Button className='text-white rounded bg-slate-700 hover:bg-slate-800' onClick={save} variant={'default'} disabled={loading}>{ loading ? 'Sedang menyimpan...' : 'Simpan'}</Button>
            </section>
        }

        {
            data && <section className='mt-5'>
                <div className='flex flex-row flex-wrap gap-2'>
                    {
                        data.map((item:any, index:number) => (
                            <div key={index} className='w-[250px] px-2 py-1 overflow-hidden border border-gray-300 rounded-md bg-gray-50'>
                                <div className='text-center'>
                                    <span className='text-sm text-slate-600'>Kategori</span>
                                    <h1 className='text-lg font-bold'>{item.nama}</h1>
                                </div>
                                <div className=''>
                                    <ActionIcon variant="transparent" aria-label="delete" onClick={()=>deleteData(item.id)}>
                                        <IconTrashFilled style={{ width: '70%', height: '70%' }} stroke={1.5} color='red' />
                                    </ActionIcon>
                                    <ActionIcon variant="transparent" aria-label="update" onClick={()=>updateData(item)}>
                                        <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} color='gray' />
                                    </ActionIcon>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
        }
        
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

export default KategoriPangan