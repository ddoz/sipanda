"use client"
import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHandClick, IconHandFinger, IconSearch } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const ViewFileComponent = ({filePath,title}:{filePath:string,title:string}) => {
    const [opened, { open, close }] = useDisclosure(false);
  return (
    <div className='w-full h-full'>
      {
          filePath.endsWith('.pdf') ? <div className='w-full h-full'><iframe width={"100%"} height={'100%'} src={filePath.replace("uploads/","api/files/")} /></div> : filePath.endsWith('.docx') ? <iframe width={"100%"} height={"100%"} src={filePath.replace("uploads/","api/files/")} className='text-blue-500 font-bold underline text-center'>Lihat File</iframe> : <Image src={filePath.replace("uploads/","api/files/")} width={400} height={150} alt='file upload' />
      }
    </div>
  )
}

export default ViewFileComponent