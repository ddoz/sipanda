"use server";
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export async function saveDokumen({
    judul,
    keterangan,
    publish,
    dokumen,
    kategori
}: {
    judul: string,
    keterangan: string,
    publish: boolean,
    dokumen: string,
    kategori: string
}) {

    try {
        
        const sa = await prisma.dokumen.create({
            data: {
                judul: judul,
                keterangan: keterangan,
                isPublish: publish,
                fileDokumen: dokumen,
                kategoriDokumenId: parseInt(kategori),
            }
        })
        
        revalidatePath('/backend/berita', 'page');
        return {
            status: true
        }
    } catch (error) {
        console.log(error);
        return {
            status: false
        }
    }
}

export async function getDokumen(page = 1, limit = 20) {
    const [dokumen, total] = await prisma.$transaction([
        prisma.dokumen.findMany({
            include: {
                kategoriDokumen: true
            },
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.artikel.count()
    ]);

    return { dokumen, total };
}

export async function getDokumenById(id: number){
    try {
        const results = await prisma.dokumen.findFirst({
            where: {
                id: id
            },
            include: {
                kategoriDokumen: true
            }
        });
        if(results) {
            return {
                status: true,
                data: results as any
            }
        } else {
            return {
                status: false,
                data: {}
            }
        }
    }catch(e) {
        console.log(e)
        return {
            status: false,
            data: {}
        }
    } 
}

export async function updateDokumen({
    id,
    judul,
    keterangan,
    publish,
    dokumen,
    kategori
}:{
    id: number,
    judul: string,
    keterangan: string,
    publish: boolean,
    dokumen: string,
    kategori: number
}) {
    try {

       
        const up = await prisma.dokumen.update({
            where: {
                id: id
            },
            data: {
                judul: judul,
                keterangan: keterangan,
                isPublish: publish,
                ...(dokumen && {fileDokumen: dokumen}),
                kategoriDokumenId: kategori,
            }
        })

        revalidatePath('/backend/dokumen', 'page');
        return {
            status: true
        }
        
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function deleteDokumen({id}:{id:string}) {
    try {
        const del = await prisma.dokumen.delete({
            where: {
                id: parseInt(id)
            }
        })

        revalidatePath('/backend/dokumen', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function getDokumenPublishAll(page = 1, limit = 20, judul?:string, kategori?:string) {
    const [dokumen, total] = await prisma.$transaction([
        prisma.dokumen.findMany({
            where: {
                isPublish: true,
                ...(judul && {judul: {
                    contains: judul
                }}),
                ...(kategori && { kategoriDokumenId: parseInt(kategori) }),
            },
            include: {
                kategoriDokumen: true,
            },
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.dokumen.count({
            where: {
                isPublish: true,
                ...(judul && {judul: {
                    contains: judul
                }}),
                ...(kategori && { kategoriDokumenId: parseInt(kategori) }),
            },
        })
    ]);

    return { dokumen, total };
} 
