import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, res: Response) {
  try {
    const site = await prisma.site.findFirst();

    return NextResponse.json(site, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ status: 'fail', error: e.message }, { status: 500 });
  }
}
