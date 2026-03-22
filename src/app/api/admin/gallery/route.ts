import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllGalleryItems, createGalleryItem, reorderGalleryItems } from "@/lib/gallery-db";

type CreateBody = {
  name?: unknown;
  hindiName?: unknown;
  description?: unknown;
  imageUrl?: unknown;
  label?: unknown;
  order?: unknown;
};

type ReorderItem = {
  id: string;
  order: number;
};

type ReorderBody = {
  items?: unknown;
};

export async function GET() {
  try {
    const items = await getAllGalleryItems();
    return NextResponse.json(
      { items },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/admin/gallery failed:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch gallery";
    return NextResponse.json(
      { message, code: "GALLERY_FETCH_FAILED" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreateBody;
    const { name, hindiName, description, imageUrl, label, order } = body;

    if (!name || !hindiName || !description || !imageUrl) {
      return NextResponse.json(
        { message: "Missing required fields: name, hindiName, description, imageUrl" },
        { status: 400 },
      );
    }

    const itemOrder = typeof order === "number" ? order : 999;

    const id = await createGalleryItem({
      name: String(name),
      hindiName: String(hindiName),
      description: String(description),
      imageUrl: String(imageUrl),
      label: typeof label === "string" ? label : undefined,
      order: itemOrder,
    });

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create gallery item" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as ReorderBody;
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json({ message: "Invalid items array" }, { status: 400 });
    }

    await reorderGalleryItems(
      items.map((item: ReorderItem) => ({
        id: String(item.id),
        order: Number(item.order),
      })),
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to reorder items" },
      { status: 500 },
    );
  }
}
