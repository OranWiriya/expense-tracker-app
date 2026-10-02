import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";

interface SessionGuardProps {
  children: React.ReactNode;
  userSession: Awaited<ReturnType<typeof auth.api.getSession>>;
}

async function SessionGuard({ children, userSession }: SessionGuardProps) {
  if (!userSession) {
    redirect("/signin");
  }
  return <>{children}</>;
}

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <SessionGuard userSession={sessionData}>
      <div className="min-h-full flex flex-col">
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar header={null} content={[]} footer={null} />
          <SidebarInset className="m-0! mr-2! ">
            <main className="min-h-[calc(100vh-65px)] max-xl:h-full">
              <AppTopbar userData={sessionData?.user} />
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </SessionGuard>
  );
}
