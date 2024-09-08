"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircleIcon, CheckSquare2Icon, PlusCircle, SaveAllIcon, SaveIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { revalidatePath } from 'next/cache'
import { ActionIcon, Alert, ButtonGroup, FileButton, Input, PasswordInput, Select, TextInput } from '@mantine/core'
import { IconChevronLeft, IconChevronRight, IconInfoCircle, IconPencil, IconTrashFilled } from '@tabler/icons-react'
import axios from 'axios'
import { notifications } from '@mantine/notifications'
import slugify from 'slugify';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { deleteUser, saveUser } from '@/services/user'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { getFormattedDateTime } from '@/lib/utils'

const Content = ({ data, currentPage, totalPages }:{data:any,currentPage:any,totalPages:any}) => {
    const [openDialog, setOpenDialog] = useState(false);
    
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [id,setId] = useState('');
    const [loading,setLoading] = useState(false);

    const router = useRouter();

    const create = () => {
      setShowForm(!showForm);
      resetForm();
    }

    const save = async () => {

      if(name == '') {
        notifications.show({
            title: 'Informasi',
            message: 'Harap isi nama terlebih dahulu',
            color:'red',
            position: 'top-center',
        });
        return;
      }

      if(email == '') {
        notifications.show({
            title: 'Informasi',
            message: 'Harap isi email terlebih dahulu',
            color:'red',
            position: 'top-center',
        });
        return;
      }

      if(password == '') {
        notifications.show({
            title: 'Informasi',
            message: 'Harap isi password terlebih dahulu',
            color:'red',
            position: 'top-center',
        });
        return;
      }

      setLoading(true)

          const saveing = await saveUser({
            name,
            email,
            password
          })
          if(saveing) {
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
        
      
        return;
    }

    const resetForm = () => {
      setName('');
      setEmail('');
      setPassword('');
      setId('');
    }

    const deleteData = (id:any) => {
      setOpenDialog(!openDialog)
      setId(id);
  }

  const confirmDelete = async () => {
      const del = await deleteUser({
          id: parseInt(id)
      });
      if(del) {
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


    const handlePageChange = (page:any) => {
      if (page >= 1 && page <= totalPages) {
        router.push(`/backend/user?page=${page}`);
      }
    };

  return (
    <Card className='w-full'>
        <CardHeader>
            <CardTitle>
                <div className='flex flex-row justify-between'>
                    <h1>Form User</h1>
                    <Button variant={'outline'} size={'sm'} onClick={create}><PlusCircle /></Button>
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent>
          {
            showForm && <div className='flex flex-col gap-2'>
                <TextInput value={name} onChange={(e)=>setName(e.target.value)} placeholder='Masukkan Nama' label="Nama" />
                <TextInput type='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Masukkan Email' label="Email" />
                <PasswordInput
                  label="Password"
                  description="Masukkan Password"
                  placeholder="Masukkan Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
              <div className='border p-4 flex flex-col gap-2 w-[400px]'>
                <Button onClick={save} variant={'default'} disabled={loading}>{ loading ? 'Sedang menyimpan...' : 'Simpan'}</Button>
              </div>
            </div>
          }

          <section className={`${showForm && 'mt-20' }`}>
            <h1 className='text-slate-600 font-bold'>Data User</h1>
            <Table className='border rounded-md'>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item:any,index:number) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index+1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{getFormattedDateTime(item.createdAt.toString())}</TableCell>
                    <TableCell className="text-right">
                      {
                        item.id != 1 && <ActionIcon variant="transparent" aria-label="delete" onClick={()=>deleteData(item.id)}>
                        <IconTrashFilled style={{ width: '70%', height: '70%' }} stroke={1.5} color='red' />
                    </ActionIcon>
                      }
                        
              
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
              
        </CardContent>
    </Card>
  )
}

export default Content