"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircleIcon, CheckSquare2Icon, FileIcon, PlusCircle, SaveAllIcon, SaveIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { revalidatePath } from 'next/cache'
import { ActionIcon, Alert, Button, ButtonGroup, FileButton, Input, Modal, Select, Textarea, TextInput } from '@mantine/core'
import { IconChevronLeft, IconChevronRight, IconFile, IconFilter, IconInfoCircle, IconPencil, IconSend, IconTrashFilled } from '@tabler/icons-react'
import axios from 'axios'
import { notifications } from '@mantine/notifications'
import slugify from 'slugify';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { DatePicker, DatePickerInput } from '@mantine/dates';
import { formatPrice, getFormattedDate, getFormattedDateOnly, getFormattedDateShort, getFormattedDateTime } from '@/lib/utils'
import { updateHarga } from '@/services/harga-pasar';

const HargaPasar = ({ data, pangan, pasar, awal, akhir }:{data:any[],pangan:any[],pasar:any[], awal:any, akhir:any}) => {
    const [value, setValue] = useState<[Date | null, Date | null]>([awal, akhir]);

    const [inputValues, setInputValues] = useState({});

    const handleInputChange = (panganId, pasarId, dateKey, value) => {
      setInputValues((prevInputs) => ({
        ...prevInputs,
        [`${panganId}-${pasarId}-${dateKey}`]: value,
      }));
    };
   
    const router = useRouter();

    const hargaMap = new Map();
    data.forEach(({ pasarId, panganId, tanggal, harga, tipe }) => {
        const dateKey = getFormattedDateShort(new Date(tanggal).toISOString()); // Format tanggal YYYY-MM-DD
        if (!hargaMap.has(panganId)) {
            hargaMap.set(panganId, new Map());
        }
        if (!hargaMap.get(panganId).has(pasarId)) {
            hargaMap.get(panganId).set(pasarId, {});
        }
        hargaMap.get(panganId).get(pasarId)[dateKey] = { harga, tipe }; // Simpan harga dan tipe
    });

    const generateDateArray = (startDate: Date, endDate: Date) => {
      const dates = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
  };

  const dateArray = generateDateArray(awal, akhir);

  const handleFilter = () => {
    if (value[0] && value[1]) {
      const diffDays = Math.ceil((value[1].getTime() - value[0].getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 7) {
          notifications.show({
              title: 'Peringatan',
              message: 'Range tanggal tidak boleh lebih dari 7 hari.',
              color: 'red'
          });
          return;
      }
      
      const params = new URLSearchParams();
      params.set('awal', value[0].toISOString());
      params.set('akhir', value[1].toISOString());
      router.push(`/get-panel/harga-pasar?${params.toString()}`);
    }
};

const SetInfoTipe = (tipe:string) => {
  switch (tipe) {
    case 'STABIL':
      return <div className='px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded'>{tipe}</div>;
    case 'TURUN':
      return <div className='px-2 py-1 text-xs text-red-800 bg-red-100 rounded'>{tipe}</div>;
    default:
      return '-';
  }
}

const handleUpdateHarga = async () => {
  try {
    const response = await updateHarga({
      inputValues: inputValues
    });

    if(response.status) {
      notifications.show({
        title: 'Berhasil',
        message: 'Harga berhasil diupdate.',
        color:'green'
      });
    }else {
      notifications.show({
        title: 'Gagal',
        message: 'Gagal mengupdate harga.',
        color:'red'
      });
    }
  } catch (error) {
    notifications.show({
      title: 'Gagal',
      message: 'Gagal mengupdate harga.',
      color:'red'
    });
  }
};

  return (
    <Card className='w-full'>
        <CardHeader>
            <CardTitle>
                <div className='flex flex-row justify-between'>
                    <h1>Form Harga Pasar</h1>
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-row gap-2 max-w-[500px] items-center'>
            <DatePickerInput
              type="range"
              placeholder="Pilih Range Tanggal"
              value={value}
              onChange={setValue}
            />
            <ActionIcon variant="default" aria-label="show" onClick={handleFilter}>
                <IconFilter style={{ width: '70%', height: '70%' }} stroke={1.5} color='red' />
            </ActionIcon>
          </div>

          <section className={`mt-10`}>
           <div className='flex flex-row justify-between mb-5'>
            <h1 className='mb-4 font-bold text-slate-600'>Data Harga Pangan Pasar</h1>
           </div>
            <Table className='border-2 border-black rounded'>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Pangan</TableHead>
                  <TableHead>Pasar</TableHead>
                  {dateArray.map((date, index) => (
                    <TableHead key={index} className='text-center'>{getFormattedDateShort(date.toISOString())}</TableHead>
                  ))}
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='border-2 border-black'>
                {pangan.map((panganItem, panganIndex) => (
                  pasar.map((pasarItem, pasarIndex) => (
                    <TableRow key={`${panganIndex}-${pasarIndex}`} className='border-b-2 border-black'>
                      {pasarIndex === 0 && (
                        <>
                          <TableCell rowSpan={pasar.length} className="w-[100px] text-start">
                            {panganIndex + 1}
                          </TableCell>
                          <TableCell rowSpan={pasar.length}>
                            {panganItem.namaPangan}
                          </TableCell>
                        </>
                      )}
                      <TableCell>{pasarItem.nama}</TableCell>
                      {dateArray.map((date, dateIndex) => {
                          const dateKey = getFormattedDateShort(date.toISOString());
                          const todayDate = getFormattedDateShort(new Date().toISOString());
                          const { harga, tipe } = hargaMap.get(panganItem.id)?.get(pasarItem.id)?.[dateKey] || { harga: '0', tipe: '-' };
                          return (
                              <TableCell key={dateIndex}>
                                  <div className='flex flex-col items-center gap-1'>
                                      {(todayDate == dateKey) && <TextInput placeholder='Input Harga' onChange={(e) => handleInputChange(panganItem.id, pasarItem.id, dateKey, e.target.value)} />}
                                      <h1 className='font-bold text-md'>{formatPrice(harga.toString())}</h1>
                                      {SetInfoTipe(tipe)}
                                  </div>
                              </TableCell>
                          );
                      })}
                      {pasarIndex === 0 && (
                        <TableCell rowSpan={pasar.length} className="text-right">
                          <Button leftSection={<IconSend /> } size='sm' variant='filled' className='bg-blue-500' onClick={() => {
                            
                                handleUpdateHarga();
                          }}>Update Harga</Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ))}
              </TableBody>
            </Table>

          </section>

        </CardContent>
    </Card>
  )
}

export default HargaPasar