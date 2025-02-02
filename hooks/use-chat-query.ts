import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string,
  apiUrl: string,
  paramKey: "channelId" | "conversationId"
  paramValue: string
}

export const useQueryChat = ({
  apiUrl,
  paramKey,
  paramValue,
  queryKey
}: ChatQueryProps) => {
  const { isConnected } = useSocket()

  const fetchMessages = async (pageParam: any = undefined) => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam,
        [paramKey]: paramValue
      }
    }, { skipNull: true })
    
    const res = await fetch(url)
    
    return res.json()
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({ 
    queryKey: [queryKey], 
    queryFn: ({ pageParam }) => fetchMessages(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000
  })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  }
}