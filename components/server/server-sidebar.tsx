import { redirect } from "next/navigation";

import prisma from "@/lib/prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { ChannelType, MemberRole } from "@/lib/utils";

import { ServerHeader } from "./server-header";

interface ServerSidebarProps {
  serverId: string
}

const ServerSidebar: React.FC<ServerSidebarProps> = async ({ serverId }) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect("/")
  }

  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc"
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: "asc"
        }
      }
    }
  })

  const textChannels = server?.channels.filter(channel => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO)

  const members = server?.members.filter(member => member.profileId !== profile.id)

  if (!server) {
    return redirect("/")
  }

  const role = server.members.find(member => member.profileId === profile.id)?.role as MemberRole | undefined

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader
        server={server}
        role={role}
      />
    </div>
  );
}
export default ServerSidebar;
