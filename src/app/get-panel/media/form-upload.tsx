"use client"
import React, { useState } from 'react'
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE, MIME_TYPES } from '@mantine/dropzone';
import { Group, Image, Loader, SimpleGrid, Text, rem } from '@mantine/core';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { FileIcon, SaveAllIcon } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { InputMedia, saveMedia } from '@/services/media';

const FormUpload = () => {

    const [files, setFiles] = useState<FileWithPath[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
    });

    
    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
            return response.data;
        } catch (error) {
            return null;
        }
    };

    const saveAllMedia = async () => {
        if (files.length > 0) {
            setLoading(true);
    
            // Use Promise.all to wait for all uploads to complete
            const uploadPromises = files.map(async (file) => {
                const upload = await handleUpload(file);
                if (upload) {
                    return {
                        fileName: upload.filePath,
                        fileType: file.type,
                    };
                } else {
                    return null;
                }
            });
    
            // Wait for all promises to resolve
            const dataToSave = await Promise.all(uploadPromises);
            
            // Filter out any null values from failed uploads
            const validDataToSave = dataToSave.filter((data) => data !== null) as InputMedia[];

            if (validDataToSave.length > 0) {
                const uploads = await saveMedia({
                    file: validDataToSave,
                });
    
                if (uploads.status) {
                    notifications.show({
                        title: 'Sukses',
                        message: 'Berhasil menyimpan media.',
                        color: 'green',
                    });
                } else {
                    notifications.show({
                        title: 'Gagal',
                        message: 'Gagal menyimpan media.',
                        color: 'red',
                    });
                }
            } else {
                notifications.show({
                    title: 'Gagal',
                    message: 'Tidak ada media yang berhasil diunggah.',
                    color: 'red',
                });
            }
            setFiles([])
            setLoading(false);
        } else {
            notifications.show({
                title: 'Informasi',
                message: 'Silahkan pilih media terlebih dahulu. (JPG, PNG, PDF)',
                color: 'red',
            });
            setFiles([]);
            setLoading(false);
        }
    };

  return (
    <>
        <div className="ml-auto flex items-center gap-2">
          
          <Button size="sm" className="h-8 gap-1" onClick={saveAllMedia} disabled={loading}>
            <SaveAllIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Save {files.length > 0 ? files.length : ''} Media
            </span>
            { loading ? <Loader /> : ''}
          </Button>
        </div>
        <Dropzone
            onDrop={setFiles}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={5 * 1024 ** 2}
            accept={[MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.pdf]}
            >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                    <IconUpload
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconPhoto
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                        stroke={1.5}
                    />
                </Dropzone.Idle>

                <div>
                <Text size="xl" inline>
                    Drag files here or click to select files
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                    Attach as many files as you like, each file should not exceed 5mb
                </Text>
                </div>
            </Group>
        </Dropzone>

        <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? 'xl' : 0}>
            {previews}
        </SimpleGrid>
    </>
  )
}

export default FormUpload