import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getMachineById, updateMachine, deleteMachine } from "@/lib/machines-db";

type UpdateBody = {
  name?: unknown;
  hindiName?: unknown;
  heads?: unknown;
  quantity?: unknown;
  imageUrl?: unknown;
  specifications?: unknown;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const machine = await getMachineById(id);

    if (!machine) {
      return NextResponse.json({ message: "Machine not found" }, { status: 404 });
    }

    return NextResponse.json({ machine }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch machine" },
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

    const updates: Partial<{
      name: string;
      hindiName: string;
      heads: number;
      quantity: number;
      imageUrl: string;
      specifications: string[];
    }> = {};

    if (typeof body.name === "string") updates.name = body.name;
    if (typeof body.hindiName === "string") updates.hindiName = body.hindiName;
    if (typeof body.heads === "number") updates.heads = body.heads;
    if (typeof body.quantity === "number") updates.quantity = body.quantity;
    if (typeof body.imageUrl === "string") updates.imageUrl = body.imageUrl;
    if (Array.isArray(body.specifications))
      updates.specifications = body.specifications.map((s: unknown) => String(s));

    const updated = await updateMachine(id, updates);

    if (!updated) {
      return NextResponse.json({ message: "Machine not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to update machine" },
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
    const deleted = await deleteMachine(id);

    if (!deleted) {
      return NextResponse.json({ message: "Machine not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to delete machine" },
      { status: 500 },
    );
  }
}
