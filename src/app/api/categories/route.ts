import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
