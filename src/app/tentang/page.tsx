import TentangMainView from "@/components/views/tentang/TentangMainView";
import { ServerURL } from "@/utils/contant";
import { Metadata } from "next";

const getMaster = async () => {
  const res = await fetch(ServerURL + "/master/main", { cache: "no-cache" });
  return await res.json();
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getMaster();

  return {
    title: `Tentang Kami`,
    description: `${data.master.about}`,
    openGraph: {
      title: `Tentang`,
      description: `${data.master.about}`,
      type: "website",
      locale: "id_ID",
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/tentang`,
    },
  };
}
const TentangPage = () => {
  return <TentangMainView />;
};

export default TentangPage;
