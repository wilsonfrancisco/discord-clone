import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { currentProfile } from "@/lib/current-profile"
import prisma from "@/lib/prisma/client"

import { ChatHeader } from "@/components/chat/chat-header"

interface ChannelIdPageProps {
  params: { channelId: string, serverId: string }
}

export default async function ChannelIdPage({
  params
}: ChannelIdPageProps) {
  const profile = await currentProfile()

  if (!profile) return auth().redirectToSignIn()

  const channel = await prisma.channel.findUnique({
    where: {
      id: params.channelId
    }
  })

  const member = await prisma.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    }
  })

  if (!channel || !member) {
    redirect(`/`)
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
    </div>
  )
}