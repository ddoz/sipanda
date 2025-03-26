import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nilai, saran } = body;

    if (!nilai) {
      return NextResponse.json(
        { message: "Nilai is required" },
        { status: 400 },
      );
    }

    const newKritikSaran = await prisma.kritikSaran.create({
      data: {
        nilai,
        saran,
      },
    });

    return NextResponse.json(newKritikSaran, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create Kritik Saran", error },
      { status: 500 },
    );
  }
}
