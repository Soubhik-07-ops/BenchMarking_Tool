// File: /app/api/report/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    const pdfPath = path.join('/tmp', 'metrics_output.pdf');
    try {
        const fileBuffer = await fs.readFile(pdfPath);
        const headers = new Headers();
        headers.append('Content-Type', 'application/pdf');
        headers.append('Content-Disposition', 'attachment; filename="metrics_output.pdf"');

        return new NextResponse(fileBuffer, { headers });
    } catch (error) {
        return NextResponse.json({ error: 'PDF report not found.' }, { status: 404 });
    }
}