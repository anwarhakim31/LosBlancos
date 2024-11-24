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

import SocketProvider from "@/context/SocketContext";
import { Metadata } from "next";

const inter = Inter_Tight({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const getMaster = async () => {
  try {
    const res = await fetch(ServerURL + "/master/main", { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to fetch master data");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { master: {}, description: "" };
  }
};

const getCollection = async () => {
  try {
    const res = await fetch(ServerURL + "/collection", { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to fetch collection");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { collection: [] };
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getMaster();

  return {
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_DOMAIN}/`),
    title: {
      default: ` ${data.master.name}`,
      template: `%s | ${data.master.name}`,
    },
    icons: {
      icon: "/favicon.ico",
    },
    description: data.description || "",
    openGraph: {
      title: data.master.name || "",
      description: data.master.description || "",
      type: "website",
      locale: "id_ID",
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/`,
      siteName: data.master.name,
      images: [data.master.logo],
    },
  };
}

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
            <SocketProvider>
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

                <div id="modal-root"></div>
                <div id="portal-notif-root"></div>
              </MasterProvider>
            </SocketProvider>
          </StoreProvider>
        </SessionProviderClient>
      </body>
    </html>
  );
}
