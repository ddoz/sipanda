"use server";
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export async function saveSlide({
  fileName,
  judul
}:{
  judul: string,
  fileName: string,
}) {
  try {
      
      const sa = await prisma.slider.create({
          data: {
                text: judul,
              image: fileName,
          },
      });
      revalidatePath('/get-panel/slider', 'page');
      return {
          status: true
      }
  } catch (error) {
      return {
          status: false,
      }
  }
}


export async function getSlide() {
    const slide = await prisma.slider.findMany();
    return slide;
}

export async function deleteSlide({
  id
}:{id: number}) {
  try {
      const del = await prisma.slider.delete({
          where: {
              id: id
          }
      })
      revalidatePath('/get-panel/slider', 'page');
      return {
          status: true
      }
  } catch (error) {
      return {
          status: false
      }
  }
}