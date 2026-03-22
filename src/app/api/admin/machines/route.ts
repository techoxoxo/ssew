import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllMachines, createMachine } from "@/lib/machines-db";

type CreateBody = {
  name?: unknown;
  hindiName?: unknown;
  heads?: unknown;
  quantity?: unknown;
  imageUrl?: unknown;
  specifications?: unknown;
  order?: unknown;
};

export async function GET() {
  try {
    const machines = await getAllMachines();
    return NextResponse.json(
      { machines },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch machines" },
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
    const { name, hindiName, heads, quantity, imageUrl, specifications, order } = body;

    if (!name || !hindiName || typeof heads !== "number" || !imageUrl) {
      return NextResponse.json(
        { message: "Missing required fields: name, hindiName, heads, imageUrl" },
        { status: 400 },
      );
    }

    const machineOrder = typeof order === "number" ? order : 999;
    const specs = Array.isArray(specifications) ? specifications : [];

    const id = await createMachine({
      name: String(name),
      hindiName: String(hindiName),
      heads: Number(heads),
      quantity: typeof quantity === "number" ? quantity : 1,
      imageUrl: String(imageUrl),
      specifications: specs.map((s: unknown) => String(s)),
      order: machineOrder,
    });

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create machine" },
      { status: 500 },
    );
  }
}
