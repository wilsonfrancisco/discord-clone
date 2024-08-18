import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { currentProfile } from "@/lib/current-profile"
import prisma from "@/lib/prisma/client"

import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChannelType } from "@prisma/client"
import { MediaRoom } from "@/components/media-room"

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
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom
          chatId={channel.id}
          video={false}
          audio={true}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom
          chatId={channel.id}
          video={true}
          audio={true}
        />
      )}
    </div>
  )
}