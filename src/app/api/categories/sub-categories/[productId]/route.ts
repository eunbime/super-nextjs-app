import prisma from "@/helpers/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    if (!productId || typeof productId !== "string") {
      console.log("Invalid Product ID");
      throw new Error("Invalid Product ID");
    }

    const subCategories = await prisma.subcategory.findMany({
      where: {
        products: {
          some: {
            id: productId,
          },
        },
      },
    });

    return NextResponse.json(subCategories);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
