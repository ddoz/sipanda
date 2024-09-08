"use server";
import prisma from "@/lib/prisma"
import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";

export async function getUser(page = 1, limit = 20) {
    const [berita, total] = await prisma.$transaction([
        prisma.user.findMany({
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.user.count()
    ]);

    return { berita, total };
}

export async function saveUser({
    name,
    email,
    password
}:{
    name: string,
    email: string,
    password: string
}){
    const sa = await prisma.user.create({
        data: {
            name,
            email,
            password: await hash(password, 10),
            level: 'admin'
        },
    });
    return sa;
}

export async function deleteUser({
    id
}:{
    id: number
}) {
    await prisma.user.delete({
        where: {
            id: id
        }
    });
    revalidatePath('/backend/users', 'page');
    return true;
}
