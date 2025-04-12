import { checkAuth } from "@/lib/auth/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "@/trpc/react";
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();

  const cookieStore = await cookies();
  return (
    <main>
      <ClerkProvider>
        <TRPCReactProvider cookies={cookieStore.toString()}>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 md:p-8 pt-2 p-8 overflow-y-auto">
              <Navbar />
              {children}
            </main>
          </div>
        </TRPCReactProvider>
      </ClerkProvider>

      <Toaster richColors />
    </main>
  );
}
