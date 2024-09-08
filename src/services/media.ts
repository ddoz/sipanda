"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export interface InputMedia {
    fileName: string
    fileType: string
}

export async function getMedia({fileType}:{fileType:string}) {
    try {
        const media = await prisma.media.findMany();

        return {
            status: true,
            message: "Media fetched successfully",
            data: media
        }

    } catch (e) {
        return {
            status: false,
            message: "An error occurred while fetching media",
            data: null
        }
    }
}

export async function saveMedia({file}:{file:InputMedia[]}) {
    try {
        const save = await prisma.media.createMany({
            data: file
        });

        revalidatePath('/backend/media');
        return {
            status: true,
            message: "Media saved successfully",
        }

    }catch (e:any) {
        return {
            status: false,
            message: "An error occurred while saving media"
        }
    }

}