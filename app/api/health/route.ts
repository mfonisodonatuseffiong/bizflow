import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const businesses = await prisma.business.count();
    return Response.json({ status: "ok", businesses });
  } catch (error) {
    console.error(error);
    return Response.json(
      { status: "error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}