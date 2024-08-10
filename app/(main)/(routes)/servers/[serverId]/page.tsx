import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma/client";
import { currentProfile } from "@/lib/current-profile";

interface ServerIdPageProps {
  params: { serverId: string }
}

const ServerIdPage: React.FC<ServerIdPageProps> = async ({ params }) => {
  const profile = await currentProfile()

  if (!profile) return auth().redirectToSignIn()

  const server = await prisma.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  })

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== "general") {
    return null
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`)
}

export default ServerIdPage;