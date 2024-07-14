import { redirect } from "next/navigation"

import { currentProfile } from "@/lib/current-profile"
import { NavigationAction } from "./navigation-action"
import prisma from "@/lib/prisma/client"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export const NavigationSidebar = async () => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect("/")
  }

  const servers = await prisma.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1f22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id}>
            {server.name}
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}