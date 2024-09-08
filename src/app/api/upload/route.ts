import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'node:fs/promises';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file uploaded');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Generate a random filename with the original file extension
    const extension = file.name.split('.').pop();
    const randomFileName = `${randomUUID()}.${extension}`;
    
    // Save the file with the new random name
    await fs.writeFile(`./public/uploads/${randomFileName}`, buffer);

    revalidatePath('/');

    return NextResponse.json({ status: 'success', filePath: `/uploads/${randomFileName}` });
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ status: 'fail', error: e.message });
  }
}
