import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string }}
) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!params.serverId) {
      return new NextResponse("Missing Server ID", { status: 400 })
    }

    const server = await prisma.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id
        },
        members: {
          some: {
            profileId: profile.id
          }
        }
      },
      data: {
         members: {
          deleteMany: {
            profileId: profile.id
          }
         }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("[SERVER_ID_LEAVE_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}