import SessionProviderClient from "./sessionProvider";
import "./../styles/global.scss";
import { Inter_Tight } from "next/font/google";

import Header from "@/components/layouts/Header";
import StoreProvider from "./storeProvider";
import { Toaster } from "sonner";
import { ServerURL } from "@/utils/contant";
import React from "react";
import MasterProvider from "@/context/MasterContext";
import { CheckIcon } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Footer from "@/components/layouts/Footer";
import ChatComponent from "@/components/element/ChatComponent";

const inter = Inter_Tight({
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
  const session = await getServerSession(authOptions);
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
              <Footer collection={collection.collection} />
              <Toaster
                position="top-center"
                richColors
                toastOptions={{
                  duration: 1000,
                  style: {
                    background: "white",
                    border: "1px solid #f5f5f5",
                  },
                  classNames: {
                    info: "danger-info",
                  },
                }}
                icons={{
                  info: <CheckIcon />,
                }}
              />
              <ChatComponent />
              <div id="modal-root"></div>
              <div id="portal-notif-root"></div>
            </MasterProvider>
          </StoreProvider>
        </SessionProviderClient>
      </body>
    </html>
  );
}
