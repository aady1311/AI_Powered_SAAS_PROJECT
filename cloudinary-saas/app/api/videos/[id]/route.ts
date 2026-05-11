import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // NEXT 16 PARAMS FIX
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Video ID missing" },
        { status: 400 }
      );
    }

    await prisma.video.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}