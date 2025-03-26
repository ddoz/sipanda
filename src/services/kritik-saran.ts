"use server";
import prisma from "@/lib/prisma";

export async function getKritikSaran() {
  const data = await prisma.kritikSaran.findMany();
  return data;
}

export async function getPaginatedKritikSaran(page: number, limit: number) {
  const data = await prisma.kritikSaran.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  const total = await prisma.kritikSaran.count();
  return { data, total };
}
