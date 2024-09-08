import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';

interface Params {
  params: {
    filename: string;
  }
}

export async function GET(request:Request, {params} : Params) {
  try {
    const { filename } = params;
    const filePath = path.join(process.cwd(), 'public/uploads', filename);
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';

    switch (ext) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
        contentType = 'image/jpeg';
        break;
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      default:
        contentType = 'application/octet-stream';
    }
    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ status: 'fail', error: e.message });
  }
}
