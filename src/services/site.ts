"use server";
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export async function getSite() {
    const site = await prisma.site.findFirst({
        where: {
            id: 1,
        },
    });
    console.log(site);
    return site;
}

export async function saveSite({
    sejarah,
    visiMisi,
    tugasDanFungsi,
    strukturOrganisasi,
 
}:{
    sejarah?: string,
    visiMisi?: string,
    tugasDanFungsi?: string,
    strukturOrganisasi?: string,
}) {
    try {
        const upsert = await prisma.site.upsert({
            where: {
              id: 1,
            },
            update: {
                ...(sejarah && { sejarah: sejarah }) ,
                ...(visiMisi && { visiMisi: visiMisi }) ,
                ...(tugasDanFungsi && { tugasDanFungsi: tugasDanFungsi }) ,
                ...(strukturOrganisasi && { strukturOrganisasi: strukturOrganisasi }) ,
            },
            create: {
                ...(sejarah && { sejarah: sejarah }) ,
                ...(visiMisi && { visiMisi: visiMisi }) ,
                ...(tugasDanFungsi && { tugasDanFungsi: tugasDanFungsi }) ,
                ...(strukturOrganisasi && { strukturOrganisasi: strukturOrganisasi }) ,
            },
        })
        revalidatePath('/backend/manage-site', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
    
}

export async function getGallery() {
    const gallery = await prisma.gallery.findMany({
        where: {
            type: 'IMAGE'
        }
    });
    return gallery;
}

export async function getSlider() {
    const gallery = await prisma.slider.findMany();
    return gallery;
}

export async function saveGallery({
    title,
    file
}:{
    title: string,
    file: string
}) {
    try {
        const gallery = await prisma.gallery.create({
            data: {
                title: title,
                file: file,
                type: 'IMAGE'
            }
        })
        revalidatePath('/backend/manage-site', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function deleteGallery({
    id
}:{id: number}) {
    try {
        const del = await prisma.gallery.delete({
            where: {
                id: id
            }
        })
        revalidatePath('/backend/manage-site', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function saveSliders({
    title,
    file
}:{
    title: string,
    file: string
}) {
    try {
        const gallery = await prisma.slider.create({
            data: {
                text: title,
                image: file
            }
        })
        revalidatePath('/backend/manage-site', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export async function deleteSliders({
    id
}:{id: number}) {
    try {
        const del = await prisma.slider.delete({
            where: {
                id: id
            }
        })
        revalidatePath('/backend/manage-site', 'page');
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false
        }
    }
}