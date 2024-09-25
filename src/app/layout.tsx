import SessionProviderClient from "./sessionProvider";
import "./../styles/global.scss";
import { Open_Sans } from "next/font/google";
import { getServerSession } from "next-auth";
import Header from "@/components/layouts/Header";
import StoreProvider from "./storeProvider";
import { Toaster } from "sonner";

const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <SessionProviderClient session={session}>
        <StoreProvider>
          <body className={openSans.className}>
            <Header />
            {children}
            <Toaster
              position="top-center"
              richColors
              toastOptions={{
                style: {
                  background: "white",
                  border: "1px solid #f5f5f5",
                },
              }}
            />
          </body>
        </StoreProvider>
      </SessionProviderClient>
    </html>
  );
}
