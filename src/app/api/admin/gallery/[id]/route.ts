import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getGalleryItemById, updateGalleryItem, deleteGalleryItem } from "@/lib/gallery-db";

type UpdateBody = {
  name?: unknown;
  hindiName?: unknown;
  description?: unknown;
  imageUrl?: unknown;
  label?: unknown;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const item = await getGalleryItemById(id);

    if (!item) {
      return NextResponse.json({ message: "Gallery item not found" }, { status: 404 });
    }

    return NextResponse.json({ item }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch gallery item" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as UpdateBody;

    const updated = await updateGalleryItem(id, {
      name: typeof body.name === "string" ? body.name : undefined,
      hindiName: typeof body.hindiName === "string" ? body.hindiName : undefined,
      description: typeof body.description === "string" ? body.description : undefined,
      imageUrl: typeof body.imageUrl === "string" ? body.imageUrl : undefined,
      label: typeof body.label === "string" ? body.label : undefined,
    });

    if (!updated) {
      return NextResponse.json({ message: "Gallery item not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to update gallery item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteGalleryItem(id);

    if (!deleted) {
      return NextResponse.json({ message: "Gallery item not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to delete gallery item" },
      { status: 500 },
    );
  }
}
