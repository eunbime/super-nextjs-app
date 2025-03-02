import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/helpers/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        conversations: {
          some: {
            users: {
              some: {
                id: currentUser.id,
              },
            },
          },
        },
      },
      include: {
        conversations: {
          include: {
            messages: {
              include: {
                sender: true,
                receiver: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
            users: true,
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse("Internal Error", {
        status: 500,
        statusText: error.message,
      });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                id: body.senderId,
              },
            },
          },
          {
            users: {
              some: {
                id: body.receiverId,
              },
            },
          },
        ],
      },
    });

    if (conversation) {
      // 이미 대화가 있을 때
      try {
        const message = await prisma.message.create({
          data: {
            text: body.text,
            image: body.image,
            senderId: body.senderId,
            receiverId: body.receiverId,
            conversationId: conversation.id,
          },
        });
        return NextResponse.json(message);
      } catch (error) {
        return NextResponse.json(error);
      }
    } else {
      // 대화를 처음 시작할 때
      const newConversation = await prisma.conversation.create({
        data: {
          senderId: body.senderId,
          receiverId: body.receiverId,
          users: {
            connect: [
              {
                id: body.senderId,
              },
              {
                id: body.receiverId,
              },
            ],
          },
        },
      });
      return NextResponse.json(newConversation);
    }
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse("Internal Error", {
        status: 500,
        statusText: error.message,
      });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
