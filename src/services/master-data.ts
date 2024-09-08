"use server";
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";


export async function getKategoriArtikel() {
    const katArtikel = await prisma.kategoriArtikel.findMany();
    return katArtikel;
}

export async function saveKategoriArtikel({
    namaKategori
}:{
    namaKategori: string
}) {
    try {
        const save = await prisma.kategoriArtikel.create({
            data: {
                namaKategori: namaKategori
            }
        })

        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }

    } catch (error) {
        return {
            status: false
        }
    }
}

export async function updateKategoriArtikel({
    id,
    namaKategori
}:{
    id: number,
    namaKategori: string
}) {
    try {
        const up = await prisma.kategoriArtikel.update({
            where: {
                id: id
            },
            data: {
                namaKategori: namaKategori
            }
        })
        
        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function deleteKategoriArtikel({
    id
}:{id: number}) {
    try {
        const del = await prisma.kategoriArtikel.delete({
            where: {
                id: id
            }
        })
        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}


export async function getKategoriDokumen() {
    const katDokumen = await prisma.kategoriDokumen.findMany();
    return katDokumen;
}

export async function saveKategoriDokumen({
    namaKategori
}:{
    namaKategori: string
}) {
    try {
        const save = await prisma.kategoriDokumen.create({
            data: {
                namaKategori: namaKategori
            }
        })

        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }

    } catch (error) {
        return {
            status: false
        }
    }
}

export async function updateKategoriDokumen({
    id,
    namaKategori
}:{
    id: number,
    namaKategori: string
}) {
    try {
        const up = await prisma.kategoriDokumen.update({
            where: {
                id: id
            },
            data: {
                namaKategori: namaKategori
            }
        })
        
        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function deleteKategoriDokumen({
    id
}:{id: number}) {
    try {
        const del = await prisma.kategoriDokumen.delete({
            where: {
                id: id
            }
        })
        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function getKategoriPangan() {
    const katDokumen = await prisma.kategoriPangan.findMany();
    return katDokumen;
}

export async function saveKategoriPangan({
    namaKategori
}:{
    namaKategori: string
}) {
    try {
        const save = await prisma.kategoriPangan.create({
            data: {
                nama: namaKategori
            }
        })

        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }

    } catch (error) {
        return {
            status: false
        }
    }
}

export async function updateKategoriPangan({
    id,
    namaKategori
}:{
    id: number,
    namaKategori: string
}) {
    try {
        const up = await prisma.kategoriPangan.update({
            where: {
                id: id
            },
            data: {
                nama: namaKategori
            }
        })
        
        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function deleteKategoriPangan({
    id
}:{id: number}) {
    try {
        const del = await prisma.kategoriPangan.delete({
            where: {
                id: id
            }
        })
        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function getPanganPagination(page = 1, limit = 20) {
    const [pangan, total] = await prisma.$transaction([
        prisma.pangan.findMany({
            include: {
                kategoriPangan: true
            },
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.pangan.count()
    ]);

    return { pangan, total };
}
export async function getPangan() {
    const panganData = await prisma.pangan.findMany();
    return panganData;
}

export async function savePangan({
    nama,
    satuan,
    kategoriPanganId
}:{
    nama: string,
    satuan: string,
    kategoriPanganId: number
}) {
    try {
        const save = await prisma.pangan.create({
            data: {
                namaPangan: nama,
                satuan: satuan,
                kategoriPanganId: kategoriPanganId
            }
        })

        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }

    } catch (error) {
        return {
            status: false
        }
    }
}

export async function updatePangan({
    id,
    nama,
    satuan,
    kategoriPanganId
}:{
    id: number,
    nama: string,
    satuan: string,
    kategoriPanganId: number
}) {
    try {
        const up = await prisma.pangan.update({
            where: {
                id: id
            },
            data: {
                namaPangan: nama,
                satuan: satuan,
                kategoriPanganId: kategoriPanganId
            }
        })
        
        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function deletePangan({
    id
}:{id: number}) {
    try {
        const del = await prisma.pangan.delete({
            where: {
                id: id
            }
        })
        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function getPasar() {
    const pasarData = await prisma.pasar.findMany();
    return pasarData;
}

export async function savePasar({
    nama
}:{
    nama: string
}) {
    try {
        const save = await prisma.pasar.create({
            data: {
                nama: nama
            }
        })

        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }

    } catch (error) {
        return {
            status: false
        }
    }
}

export async function updatePasar({
    id,
    nama
}:{
    id: number,
    nama: string
}) {
    try {
        const up = await prisma.pasar.update({
            where: {
                id: id
            },
            data: {
                nama: nama
            }
        })
        
        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function deletePasar({
    id
}:{id: number}) {
    try {
        const del = await prisma.pasar.delete({
            where: {
                id: id
            }
        })
        revalidatePath('/backend/master-data', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}