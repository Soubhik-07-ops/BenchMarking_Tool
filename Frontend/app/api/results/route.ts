// File: /app/api/results/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    const resultsPath = path.join('/tmp', 'metrics_output.json');
    try {
        const data = await fs.readFile(resultsPath, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Results not found or are still processing.' }, { status: 404 });
    }
}