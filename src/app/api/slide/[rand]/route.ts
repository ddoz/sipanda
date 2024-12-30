import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, res: Response) {
  try {
    // Ganti dengan domain Anda
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.100.57:3000';

    const pangan = await prisma.slider.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    // Tambahkan alamat lengkap untuk kolom image
    const panganWithFullImageUrl = pangan.map(item => ({
      ...item,
      image: item.image ? `${baseUrl}${item.image.replace("uploads/","api/files/")}` : null, // Sesuaikan path 'uploads' dengan direktori Anda
    }));

    return NextResponse.json(panganWithFullImageUrl, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ status: 'fail', error: e.message }, { status: 500 });
  }
}
