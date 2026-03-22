import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getR2Bucket, getR2Client, getR2PublicUrl } from "@/lib/r2";

export const runtime = "nodejs";

function sanitizeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Image file is required." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Only image uploads are allowed." }, { status: 400 });
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { message: "Image must be 5MB or smaller." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `blogs/${Date.now()}-${sanitizeFilename(file.name)}`;

    const client = getR2Client();
    await client.send(
      new PutObjectCommand({
        Bucket: getR2Bucket(),
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    return NextResponse.json({ key, url: getR2PublicUrl(key) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to upload image.",
      },
      { status: 500 },
    );
  }
}
