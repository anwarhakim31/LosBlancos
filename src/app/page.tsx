import HorizontalSlider from "@/components/views/home/HorizontalSlider";
import HomeCarousel from "@/components/views/home/HomeCarousel";

import { Fragment } from "react";
import { ServerURL } from "@/utils/contant";
import ShowProductView from "@/components/views/home/ShowProduct";
import TestimoniView from "@/components/views/home/Testimoni";
import HomeGaleriView from "@/components/views/home/HomeGaleri";

import dynamic from "next/dynamic";

const ChatComponent = dynamic(
  () => import("@/components/element/ChatComponent"),
  { ssr: false }
);
const HomeBannerView = dynamic(
  () => import("@/components/views/home/HomeBanner"),
  { ssr: false }
);

const Page = async () => {
  const { carousel, marquee, newProduct, bestProduct, testimoni, banner } =
    await fetch(ServerURL + "/home", { cache: "no-cache" }).then((res) =>
      res.json()
    );

  return (
    <Fragment>
      <main>
        <HomeCarousel data={carousel} />
        {marquee.display && <HorizontalSlider data={marquee.image} />}
        <ShowProductView header={"Produk Terbaru"} data={newProduct} />
        {banner.display && <HomeBannerView image={banner.image} />}
        <ShowProductView header={"Produk Terlaris"} data={bestProduct} />
        <TestimoniView testimoni={testimoni} />
        <HomeGaleriView />
        <ChatComponent />
      </main>
    </Fragment>
  );
};

export default Page;
