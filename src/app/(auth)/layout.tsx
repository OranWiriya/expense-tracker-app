import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";

async function SessionGuard({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const cookieStore = await cookies();
    cookieStore.delete("better-auth.session_token");
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
  return (
    <SessionGuard>
      <div className="min-h-full flex flex-col">
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar header={null} content={[]} footer={null} />
          <SidebarInset className="m-0! mr-2! ">
            <main className="min-h-[calc(100vh-65px)] max-xl:h-full">
              <AppTopbar />
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </SessionGuard>
  );
}
