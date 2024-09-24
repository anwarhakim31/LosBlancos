import SessionProviderClient from "@/components/layouts/SessionProvider";
import "./../styles/global.scss";
import { Open_Sans } from "next/font/google";
import { getServerSession } from "next-auth";
import Header from "@/components/layouts/Header";

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
        <body className={openSans.className}>
          <Header />
          {children}
        </body>
      </SessionProviderClient>
    </html>
  );
}
