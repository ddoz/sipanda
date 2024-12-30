import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cors from '@/lib/cors';

interface Params {
  params: {
    filename: string;
  }
}

export async function GET(req:Request,res:Response) {
  try {
    const pangan = await prisma.pangan.findMany(
      {
        include: {
          kategoriPangan: true,
          HargaPasar: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          }
        }
      }
    )
    return NextResponse.json(pangan, {status: 200});
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ status: 'fail', error: e.message }, {status: 500});
  }
}
