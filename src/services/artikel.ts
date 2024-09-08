"use server";
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export async function saveBerita({
    judul,
    isi,
    publish,
    thumbnail,
    kategori
}: {
    judul: string,
    isi: string,
    publish: boolean,
    thumbnail: string,
    kategori: string
}) {

    try {
        
        const sa = await prisma.artikel.create({
            data: {
                judul: judul,
                isi: isi,
                isPublish: publish,
                thumbnail: thumbnail,
                slug: generateSlug(judul),
                kategoriArtikelId: parseInt(kategori),
                userId: 1
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

export async function getBerita(page = 1, limit = 20) {
    const [berita, total] = await prisma.$transaction([
        prisma.artikel.findMany({
            include: {
                kategoriArtikel: true
            },
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.artikel.count({
            where: {
                isPublish: true
            }
        })
    ]);

    return { berita, total };
}

export async function updateBerita({
    id,
    judul,
    isi,
    publish,
    thumbnail,
    kategori
}:{
    id: number,
    judul: string,
    isi: string,
    publish: boolean,
    thumbnail: string,
    kategori: string
}) {
    try {

       
        const up = await prisma.artikel.update({
            where: {
                id: id
            },
            data: {
                judul: judul,
                isi: isi,
                isPublish: publish,
                ...(thumbnail && {thumbnail: thumbnail}),
                slug: generateSlug(judul),
                kategoriArtikelId: parseInt(kategori),
                userId: 1
            }
        })

        revalidatePath('/backend/berita', 'page');
        return {
            status: true
        }
        
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function deleteBerita({id}:{id:string}) {
    try {
        const del = await prisma.artikel.delete({
            where: {
                id: parseInt(id)
            }
        })

        revalidatePath('/backend/berita', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function getBeritaPublishAll(page = 1, limit = 20, judul?:string, kategori?:string, type?: string) {
    if(type=='artikel') {
        kategori = "2";
    }
    const [berita, total] = await prisma.$transaction([
        prisma.artikel.findMany({
            where: {
                isPublish: true,
                ...(judul && {judul: {
                    contains: judul
                }}),
                ...(kategori && { kategoriArtikelId: parseInt(kategori) }),
            },
            include: {
                kategoriArtikel: true,
            },
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.artikel.count({
            where: {
                isPublish: true,
                ...(judul && {judul: {
                    contains: judul
                }}),
                ...(kategori && { kategoriBeritaId: parseInt(kategori) }),
            },
        })
    ]);

    return { berita, total };
} 

export async function getBeritaBySlug(slug: string) {
    return await prisma.artikel.findFirst({
        where: {
            slug: slug
        },
        include: {
            kategoriArtikel: true
        }
    });
}

export const countBeritaArtikel = async function() {
    return await prisma.artikel.count({
        where: {
            isPublish: true,
            kategoriArtikelId: 2
        }
    });
}

const generateSlug = (text:string) => {
    var slug = slugify(text, {
      replacement: '-',  // Karakter pengganti untuk spasi
      lower: true,       // Mengonversi slug menjadi huruf kecil
      remove: /[*+~.()'"!:@]/g, // Menghilangkan karakter khusus
    });
    return `${slug}${Math.floor(1000 + Math.random() * 9000)}`;
}