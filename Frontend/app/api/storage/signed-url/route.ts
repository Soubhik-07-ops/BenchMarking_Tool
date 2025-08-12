// File: /app/api/storage/signed-url/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const { fileName } = await request.json();
        if (!fileName) {
            return NextResponse.json({ error: 'fileName is required.' }, { status: 400 });
        }

        const supabase = createRouteHandlerClient({ cookies });

        // Get the currently logged-in user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
        }

        // Create a unique path for the file.
        // The path starts with the user's ID to enforce the security policy.
        const filePath = `${user.id}/${uuidv4()}-${fileName}`;

        // Generate a signed URL that allows uploading to this specific path.
        // The URL is valid for 60 seconds by default.
        const { data, error } = await supabase.storage
            .from('benchmarks')
            .createSignedUploadUrl(filePath);

        if (error) {
            throw error;
        }

        // Return the URL and the path. The frontend will use the URL to upload,
        // and the path to tell our benchmark API where the file is.
        return NextResponse.json({ signedUrl: data.signedUrl, path: data.path });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}