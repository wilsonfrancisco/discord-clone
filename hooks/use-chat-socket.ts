import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useSocket } from "@/components/providers/socket-provider"

import { Message, Member, Profile } from "@prisma/client"

type ChatSocketProps = {
  addKey: string
  updateKey: string
  queryKey: string
}

type messageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  }
}

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey
}: ChatSocketProps) => {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) return

    socket.on(updateKey, (message: messageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.lenght === 0) {
          return oldData
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: messageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message
              }

              return item
            })
          }
        })

        return {
          ...oldData,
          pages: newData
        }
      })
    })

    socket.on(addKey, (message: messageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.lenght === 0) {
          return {
            pages: [{
              items: [message]
            }]
          }
        }

        const newData = [...oldData.pages]

        newData[0] = {
          ...newData[0],
          items: [
            message,
            ...newData[0].items
          ]
        }

        return {
          ...oldData,
          pages: newData
        }
      })
    })

    return () => {
      socket.off(addKey)
      socket.off(updateKey)
    }
  }, [addKey, queryClient, queryKey, socket, updateKey])
}