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
import { deleteSlide, saveSlide } from '@/services/slide'

const SlideContent = ({ data }:{data:any}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [judul,setJudul] = useState('');
    const [satuan, setSatuan] = useState('');
    const [kategoriPanganId, setKategoriPanganId] = useState('');
    
    const [showForm, setShowForm] = useState(false);
    const [id,setId] = useState('');
    const [dataKategori,setDataKategori] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [preview,setPreview] = useState('');
    
    const [loading,setLoading] = useState(false);

    const router = useRouter();

    const handleUpload = async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
  
      try {
          const response = await axios.post('/api/upload', formData, {
              headers: {
              'Content-Type': 'multipart/form-data',
              },
          });
          return response.data;
      } catch (error) {
          return null;
      }
  };


    const create = () => {
      setShowForm(!showForm);
      resetForm();
    }

    const save = async () => {

      if(file == null) {
        notifications.show({
            title: 'Informasi',
            message: 'Harap pilih dokumen terlebih dahulu',
            color:'red',
            position: 'top-center',
        });
        return;
      }

      setLoading(true);

      if(file != null) {
        const uploadDok = await handleUpload(file);
        
        if(uploadDok) {

          const saveing = await saveSlide({
            judul: judul,
            fileName: uploadDok.filePath,
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
        }else {
          notifications.show({
              title: 'Informasi',
              message: 'Gagal upload file',
              color:'red',
              position: 'top-center',
          });
          setLoading(false);
          return;
        }

      }else {
        notifications.show({
            title: 'Informasi',
            message: 'Gagal upload',
            color:'red',
            position: 'top-center',
        });
        setLoading(false);
        return;
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
      const del = await deleteSlide({
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

  return (
    <Card className='w-full'>
        <CardHeader>
            <CardTitle>
                <div className='flex flex-row justify-between'>
                    <h1>Form Slider Image</h1>
                    <Button variant={'outline'} size={'sm'} onClick={create}><PlusCircle /></Button>
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent>
          {
            showForm && <div className='flex flex-row gap-2'>
              <div className='flex flex-row w-full gap-4 p-4 border'>
                <div className='flex flex-col gap-2 w-[300px] border p-4'>
                  <TextInput label="Judul Slider" placeholder='Judul Slider' value={judul} onChange={(e)=>setJudul(e.target.value)} />
                    {
                      preview && <ViewFileComponent filePath={preview} title='' />
                    }
                    <FileButton onChange={setFile} accept="image/png,image/jpeg">
                      {(props) => <Button {...props} color='gray'>Pilih Gambar</Button>}
                    </FileButton>
                    {
                      file && <Alert variant="light" color="blue" title="Informasi" icon={<IconInfoCircle />}>
                      File sudah dipilih. Silahkan simpan.
                    </Alert>
                    }
                    
                </div>
                
              </div>
                <Button onClick={save} variant={'default'} disabled={loading}>{ loading ? 'Sedang menyimpan...' : 'Simpan'}</Button>
            </div>
          }

          <section className={`${showForm && 'mt-20' }`}>
            <h1 className='mb-2 font-bold text-slate-600'>Data Slider</h1>
            <Table className='border rounded-md'>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item:any,index:number) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index+1}</TableCell>
                    <TableCell>{item.text}</TableCell>
                    <TableCell>
                      <ViewFileComponent filePath={item.image} title={index.toString()} />
                    </TableCell>
                    <TableCell className="text-right">
                        
                        <ActionIcon variant="transparent" aria-label="delete" onClick={()=>deleteData(item.id)}>
                            <IconTrashFilled style={{ width: '70%', height: '70%' }} stroke={1.5} color='red' />
                        </ActionIcon>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            
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

export default SlideContent