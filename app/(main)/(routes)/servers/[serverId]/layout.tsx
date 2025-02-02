import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/prisma/client";

import ServerSidebar from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
  children,
  params
}: {
  children: React.ReactNode,
  params: { serverId: string }
}) => {
  const profile = await currentProfile()

  if (!profile) {
    auth().redirectToSignIn()
  }

  const server = await prisma.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile?.id
        }
      }
    }
  })

  if (!server) {
    return redirect("/")
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">
        {children}
      </main>
    </div>
  );
}

export default ServerIdLayout;