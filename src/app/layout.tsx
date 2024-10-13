import SessionProviderClient from "./sessionProvider";
import "./../styles/global.scss";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import Header from "@/components/layouts/Header";
import StoreProvider from "./storeProvider";
import { Toaster } from "sonner";
import { ServerURL } from "@/utils/contant";
import React from "react";
import MasterProvider from "@/context/MasterContext";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const getMaster = async () => {
  const res = await fetch(ServerURL + "/master/main", { cache: "no-cache" });
  return await res.json();
};

const getCollection = async () => {
  const res = await fetch(ServerURL + "/collection", {
    cache: "no-cache",
  });
  return await res.json();
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const master = await getMaster();
  const collection = await getCollection();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderClient session={session}>
          <StoreProvider>
            <MasterProvider data={master.master}>
              <Header collection={collection.collection} />
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
          </StoreProvider>
        </SessionProviderClient>
      </body>
    </html>
  );
}
