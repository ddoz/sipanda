import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const apiKey = req.headers.get('Authorization');

    // Verifikasi token (API key)
    if (apiKey !== `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        // Mengambil data JSON dari request body
        const { bulan, tahun } = await req.json();

        if (!bulan || !tahun) {
            return NextResponse.json(
                { message: 'Bulan dan Tahun harus disertakan.' },
                { status: 400 }
            );
        }

        // Ambil data dari database menggunakan prisma
        const data = await prisma.hargaPasar.findMany({
            where: {
                tanggal: {
                    contains: `${tahun}-${bulan}`,
                },
            },
            orderBy: {
                tanggal: 'asc',
            },
            select: {
                tanggal: true,
                pangan: {
                    select: {
                        namaPangan: true,
                    }
                },
                pasar: {
                    select: {
                        nama: true
                    }
                },
                harga: true
            }
        });

        // Tambahkan nomor urut dan ubah header kolom
        const formattedData = data.map((item, index) => ({
            No: index + 1, // Tambahkan nomor urut
            Tanggal: item.tanggal,
            'Nama Pangan': item.pangan.namaPangan,
            'Nama Pasar': item.pasar.nama,
            Harga: item.harga
        }));

        // Buat file Excel menggunakan data yang telah diformat
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Kirim file Excel sebagai response
        return new NextResponse(buf, {
            status: 200,
            headers: {
                'Content-Disposition': `attachment; filename=harga-pasar-${tahun}-${bulan}.xlsx`,
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });
    } catch (error) {
        console.error("Error generating Excel file:", error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat mengunduh file.' },
            { status: 500 }
        );
    }
}

