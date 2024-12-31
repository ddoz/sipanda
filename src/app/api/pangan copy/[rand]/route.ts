import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, res: Response) {
  try {
    const pangan = await prisma.pangan.findMany();

    return NextResponse.json(pangan, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ status: 'fail', error: e.message }, { status: 500 });
  }
}
