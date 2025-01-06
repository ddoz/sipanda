"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircleIcon, CheckSquare2Icon, FileIcon, PlusCircle, SaveAllIcon, SaveIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { revalidatePath } from 'next/cache'
import { ActionIcon, Alert, ButtonGroup, FileButton, Input, Modal, Select, Textarea, TextInput } from '@mantine/core'
import { IconChevronLeft, IconChevronRight, IconFile, IconInfoCircle, IconPencil, IconTrashFilled } from '@tabler/icons-react'
import axios from 'axios'
import { notifications } from '@mantine/notifications'
import slugify from 'slugify';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import ViewFileComponent from '@/components/view-file'
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
import { useDisclosure } from '@mantine/hooks'
import { deleteDokumen, saveDokumen, updateDokumen } from '@/services/dokumen'
import { getFormattedDateTime } from '@/lib/utils'
import { deletePangan, savePangan, updatePangan } from '@/services/master-data'

const Peraturan = ({ data, kategori, currentPage, totalPages }:{data:any,kategori:any[],currentPage:any,totalPages:any}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [judul,setJudul] = useState('');
    const [satuan, setSatuan] = useState('');
    const [kategoriPanganId, setKategoriPanganId] = useState('');
    
    const [showForm, setShowForm] = useState(false);
    const [id,setId] = useState('');
    const [dataKategori,setDataKategori] = useState<any[]>([]);
    
    const [loading,setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
      let wrapperData:any[] = [];
      setDataKategori([]);
      if(kategori) {
          kategori.map((val:any) => {
            wrapperData.push({
                label: `${val.nama}`,
                value: val.id.toString()
            })
          })
      }
    setDataKategori(wrapperData);
  },[kategori])

    const create = () => {
      setShowForm(!showForm);
      resetForm();
    }

    const save = async () => {

      if(judul == '') {
        notifications.show({
            title: 'Informasi',
            message: 'Harap isi judul terlebih dahulu',
            color:'red',
            position: 'top-center',
        });
        return;
      }

      if(satuan == '') {
        notifications.show({
            title: 'Informasi',
            message: 'Harap pilih satuan terlebih dahulu',
            color:'red',
            position: 'top-center',
        });
        return;
      }

      if(kategoriPanganId == '') {
        notifications.show({
            title: 'Informasi',
            message: 'Harap pilih kategori terlebih dahulu',
            color:'red',
            position: 'top-center',
        });
        return;
      }

      if(id!='') {
        setLoading(true)


        const updateing = await updatePangan({
          id: parseInt(id),
          nama: judul,
          satuan: satuan,
          kategoriPanganId: parseInt(kategoriPanganId),
        })
        if(updateing.status) {
          notifications.show({
              title: 'Informasi',
              message: 'Berhasil mengubah data',
              color: 'green',
              position: 'top-center',
          });
          resetForm();
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
        return;
      }

      setLoading(true)

      const saveing = await savePangan({
        nama: judul,
        satuan: satuan,
        kategoriPanganId: parseInt(kategoriPanganId),
      })
      if(saveing.status) {
        notifications.show({
            title: 'Informasi',
            message: 'Berhasil menyimpan data',
            color: 'green',
            position: 'top-center',
        });
        resetForm();
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

    const resetForm = () => {
      setJudul('');
      setId('');
      setSatuan('');
      setKategoriPanganId('');
    }

    const deleteData = (id:any) => {
      setOpenDialog(!openDialog)
      setId(id);
  }

  const confirmDelete = async () => {
      const del = await deletePangan({
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

    const updateData = (item:any) => {
      setId(item.id.toString());
      setJudul(item.namaPangan);
      setKategoriPanganId(item.kategoriPanganId.toString());
      setSatuan(item.satuan);
      setShowForm(true);
    }

    const handlePageChange = (page:any) => {
      if (page >= 1 && page <= totalPages) {
        router.push(`/get-panel/pangan?page=${page}`);
      }
    };

    const [fileModal,setFileModal] = useState('');
    const showFile = (url:string) => {
      setFileModal(url);
      open();
    }

  return (
    <Card className='w-full'>
        <CardHeader>
            <CardTitle>
                <div className='flex flex-row justify-between'>
                    <h1>Form Pangan</h1>
                    <Button variant={'outline'} className='rounded' size={'sm'} onClick={create}><PlusCircle /></Button>
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent>
          {
            showForm && <div className='flex flex-row gap-2'>
              <div className='flex flex-row w-full gap-4 p-4 border'>
                <div className='w-full'>
                  <TextInput value={judul} onChange={(e)=>setJudul(e.target.value)} placeholder='Judul' label="Judul" />
                 
                  <Select label="Satuan" data={['Kg','Liter']} defaultValue={satuan} value={satuan}
                      onChange={(_value, option) => setSatuan(_value!)}/>
                  <Select 
                      label="Pilih Kategori"
                      placeholder="Pilih"
                      data={dataKategori}
                      searchable
                      onChange={(_value, option) => setKategoriPanganId(_value!)}
                      defaultValue={kategoriPanganId}
                      value={kategoriPanganId}
                  />
                 

                </div>
                
                
              </div>
                <Button onClick={save} className='text-white rounded bg-slate-700 hover:bg-slate-800' disabled={loading}>{ loading ? 'Sedang menyimpan...' : 'Simpan'}</Button>
            </div>
          }

          <section className={`${showForm && 'mt-20' }`}>
            <h1 className='font-bold text-slate-600'>Data Pangan</h1>
            <Table className='border rounded-md'>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item:any,index:number) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index+1}</TableCell>
                    <TableCell>{item.namaPangan}</TableCell>
                    <TableCell>{item.kategoriPangan.nama}</TableCell>
                    <TableCell>{item.satuan}</TableCell>
                    <TableCell>{getFormattedDateTime(item.createdAt.toISOString())}</TableCell>
                    <TableCell className="text-right">
                        <ActionIcon variant="transparent" aria-label="delete" onClick={()=>deleteData(item.id)}>
                            <IconTrashFilled style={{ width: '70%', height: '70%' }} stroke={1.5} color='red' />
                        </ActionIcon>
                        <ActionIcon variant="transparent" aria-label="update" onClick={()=>updateData(item)}>
                            <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} color='gray' />
                        </ActionIcon>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
            
            <ButtonGroup>
              <Button size={'icon'}  disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                <IconChevronLeft />
              </Button>
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? 'secondary' : 'outline'}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
              <Button size={'icon'} disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                <IconChevronRight />
              </Button>
            </ButtonGroup>
          </div>
          </section>

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

export default Peraturan