import SessionProviderClient from "./sessionProvider";
import "./../styles/global.scss";
import { Open_Sans } from "next/font/google";
import { getServerSession } from "next-auth";
import Header from "@/components/layouts/Header";
import StoreProvider from "./storeProvider";
import { Toaster } from "sonner";
import { ServerURL } from "@/utils/contant";
import React from "react";

import MasterProvider from "@/context/MasterContext";

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

  const res = await fetch(ServerURL + "/master/main", { cache: "no-store" });
  const data = await res.json();

  return (
    <html lang="en">
      <SessionProviderClient session={session}>
        <StoreProvider>
          <body className={openSans.className}>
            <MasterProvider data={data.master}>
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
              <div id="modal-root"></div>
            </MasterProvider>
          </body>
        </StoreProvider>
      </SessionProviderClient>
    </html>
  );
}
