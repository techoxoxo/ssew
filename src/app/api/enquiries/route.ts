import { NextResponse } from "next/server";
import getMongoClientPromise from "@/lib/mongodb";

type EnquiryBody = {
  name?: unknown;
  businessName?: unknown;
  phone?: unknown;
  fabricType?: unknown;
  designStyle?: unknown;
  quantityRequired?: unknown;
};

const sanitize = (value: string) => value.trim().replace(/\s+/g, " ");

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EnquiryBody;

    const payload = {
      name: typeof body.name === "string" ? sanitize(body.name) : "",
      businessName:
        typeof body.businessName === "string" ? sanitize(body.businessName) : "",
      phone: typeof body.phone === "string" ? sanitize(body.phone) : "",
      fabricType:
        typeof body.fabricType === "string" ? sanitize(body.fabricType) : "",
      designStyle:
        typeof body.designStyle === "string" ? sanitize(body.designStyle) : "",
      quantityRequired:
        typeof body.quantityRequired === "string"
          ? sanitize(body.quantityRequired)
          : "",
    };

    if (!payload.phone) {
      return NextResponse.json(
        { message: "Phone / WhatsApp number is required." },
        { status: 400 },
      );
    }

    if (!/^[+]?\d[\d\s-]{7,15}$/.test(payload.phone)) {
      return NextResponse.json(
        { message: "Please enter a valid phone number." },
        { status: 400 },
      );
    }

    const client = await getMongoClientPromise();
    const db = client.db(process.env.MONGODB_DB || "ssew");

    await db.collection("enquiries").insertOne({
      ...payload,
      createdAt: new Date(),
      source: "website",
      status: "new",
    });

    return NextResponse.json(
      { message: "Enquiry submitted successfully." },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to submit enquiry." },
      { status: 500 },
    );
  }
}
