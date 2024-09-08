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

const Peraturan = ({ data, kategori, currentPage, totalPages }:{data:any,kategori:any[],currentPage:any,totalPages:any}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [file, setFile] = useState<File | null>(null);
    const [judul,setJudul] = useState('');
    const [keterangan,setKeterangan] = useState('');
    
    const [showForm, setShowForm] = useState(false);
    const [id,setId] = useState('');
    const [dataKategori,setDataKategori] = useState<any[]>([]);
    
    const [kategoriId,setKategoriId] = useState('');
    
    const [publish,setPublish] = useState('');
    
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

    useEffect(() => {
      let wrapperData:any[] = [];
      setDataKategori([]);
      if(kategori) {
          kategori.map((val:any) => {
            wrapperData.push({
                label: `${val.namaKategori}`,
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

      if(publish == '') {
        notifications.show({
            title: 'Informasi',
            message: 'Harap pilih status publikasi terlebih dahulu',
            color:'red',
            position: 'top-center',
        });
        return;
      }

      if(kategoriId == '') {
        notifications.show({
            title: 'Informasi',
            message: 'Harap pilih kategori berita terlebih dahulu',
            color:'red',
            position: 'top-center',
        });
        return;
      }

      if(id!='') {
        setLoading(true)
        
        let filePathEdit = '';
        if(file != null) {
          const upload = await handleUpload(file);
          if(upload) {
            filePathEdit = upload.filePath;
          } else {
            notifications.show({
              title: 'Informasi',
              message: 'Gagal upload file',
              color:'red',
              position: 'top-center',
            });
            return;
          }
        }


        const updateing = await updateDokumen({
          id: parseInt(id),
          judul: judul,
          keterangan: keterangan,
          publish: publish == 'PUBLISH' ? true : false,
          dokumen: filePathEdit,
          kategori: parseInt(kategoriId),
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

      if(file == null) {
        notifications.show({
            title: 'Informasi',
            message: 'Harap pilih dokumen terlebih dahulu',
            color:'red',
            position: 'top-center',
        });
        return;
      }


      setLoading(true)

      if(file != null) {
        const uploadDok = await handleUpload(file);
        if(uploadDok) {

          const saveing = await saveDokumen({
            judul: judul,
            keterangan: keterangan,
            publish: publish == 'PUBLISH' ? true : false,
            dokumen: uploadDok.filePath,
            kategori: kategoriId,
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
          return;
        }

      }else {
        notifications.show({
            title: 'Informasi',
            message: 'Harap upload thumbnail berita terlebih dahulu',
            color:'red',
            position: 'top-center',
        });
        return;
      }

    }

    const resetForm = () => {
      setJudul('');
      setId('');
      setFile(null);
      setPublish('');
      setKategoriId('');
      setKeterangan('');
    }

    const deleteData = (id:any) => {
      setOpenDialog(!openDialog)
      setId(id);
  }

  const confirmDelete = async () => {
      const del = await deleteDokumen({
          id: id
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
      setJudul(item.judul);
      setKategoriId(item.kategoriDokumenId.toString());
      setPublish(item.isPublish ? 'PUBLISH' : 'UNPUBLISH');
      setKeterangan(item.keterangan);
      setShowForm(true);
    }

    const handlePageChange = (page:any) => {
      if (page >= 1 && page <= totalPages) {
        router.push(`/backend/dokumen?page=${page}`);
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
                    <h1>Form Dokumen</h1>
                    <Button variant={'outline'} size={'sm'} onClick={create}><PlusCircle /></Button>
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent>
          {
            showForm && <div className='flex flex-row gap-2'>
              <div className='border p-4 flex flex-row gap-4 w-full'>
                <div className='w-full'>
                  <TextInput value={judul} onChange={(e)=>setJudul(e.target.value)} placeholder='Judul' label="Judul" />
                  <Textarea value={keterangan} onChange={(e)=>setKeterangan(e.target.value)} placeholder='Keterangan' label="Keterangan" />
                 
                  <Select label="Publih/Unpublish" data={['PUBLISH','UNPUBLISH']} defaultValue={publish} 
                      onChange={(_value, option) => setPublish(_value!)}/>
                  <Select 
                      label="Pilih Kategori"
                      placeholder="Pilih"
                      data={dataKategori}
                      searchable
                      onChange={(_value, option) => setKategoriId(_value!)}
                      defaultValue={kategoriId}
                  />
                 

                </div>
                <div className='flex flex-col gap-2 w-[300px] border p-4'>
                    <FileButton onChange={setFile} accept="application/pdf">
                      {(props) => <Button {...props} color='gray'>Pilih Dokumen</Button>}
                    </FileButton>
                    {
                      file && <Alert variant="light" color="blue" title="Informasi" icon={<IconInfoCircle />}>
                      File Dokumen sudah dipilih. Silahkan simpan.
                    </Alert>
                    }
                </div>
                
                
              </div>
                <Button onClick={save} variant={'default'} disabled={loading}>{ loading ? 'Sedang menyimpan...' : 'Simpan'}</Button>
            </div>
          }

          <section className={`${showForm && 'mt-20' }`}>
            <h1 className='text-slate-600 font-bold'>Data Dokumen</h1>
            <Table className='border rounded-md'>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Dokumen</TableHead>
                  <TableHead>Publish</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item:any,index:number) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index+1}</TableCell>
                    <TableCell>{item.judul}</TableCell>
                    <TableCell>
                        <ActionIcon variant="transparent" aria-label="show" onClick={()=>showFile(item.fileDokumen)}>
                            <IconFile style={{ width: '70%', height: '70%' }} stroke={1.5} color='red' />
                        </ActionIcon>
                    </TableCell>
                    <TableCell>{item.isPublish ? 'PUBLISH' : 'UNPUBLISH'}</TableCell>
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

            <div className="flex justify-between items-center mt-4">
            
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

        <Modal
          opened={opened}
          onClose={close}
          title="Preview Dokumen"
          fullScreen
          radius={0}
          transitionProps={{ transition: 'fade', duration: 200 }}
        >
         <div className='w-full h-[800px]'>
          <ViewFileComponent filePath={fileModal} title='' />
         </div>
        </Modal>
              
        </CardContent>
    </Card>
  )
}

export default Peraturan