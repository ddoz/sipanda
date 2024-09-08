import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest): Promise<NextResponse> {
    const body = await req.json();
    let slug: string | undefined = undefined;
    if('slug' in body) {
        slug = body.slug;
    }

    if(!slug) {
        return new NextResponse('Slug not found', { status: 400 });
    }
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || req.ip;
    if(ip) {
        const buf =  await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
        const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        
        const existingView = await prisma.deduplication.findFirst({
            where: {
                hash: hash,
                slug: slug,
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
        });
        if (!existingView) {
            await prisma.deduplication.create({
                data: {
                    hash: hash,
                    slug: slug,
                },
            });

            await prisma.artikel.updateMany({
                where: { slug: slug },
                data: {
                    counterView: {
                        increment: 1,
                    },
                },
            });

        }
    }
    return new NextResponse(ip, {status: 202})
}