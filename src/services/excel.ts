import * as XLSX from 'xlsx';
import prisma from "@/lib/prisma"

export async function getExcel({bulan, tahun}:{bulan:string, tahun:string}) {
    try {

        const data = await prisma.$transaction([
            prisma.hargaPasar.findMany({
                where: {
                    tanggal: {
                        contains: `${tahun}-${bulan}`
                    }
                },
                orderBy: {
                    tanggal: 'asc',
                },
            }),
        ]);

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data[0]);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });   

        return buf;
        
    } catch (error) {
        
    }
}