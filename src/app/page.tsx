// import HorizontalSlider from "@/components/views/home/HorizontalSlider";
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
  const [
    dataCarousel,
    // dataMarquee,
    dataNewProduct,
    dataBestSellProduct,
    dataBanner,
    dataTestimoni,
  ] = await Promise.all([
    fetch(ServerURL + "/master/carousel", { cache: "no-store" }).then((res) =>
      res.json()
    ),
    // fetch(ServerURL + "/master/marquee", { cache: "no-store" }).then((res) =>
    //   res.json()
    // ),

    fetch(ServerURL + "/product?limit=4", { cache: "no-store" }).then((res) =>
      res.json()
    ),
    fetch(ServerURL + "/product/bestseller", {
      cache: "no-store",
    }).then((res) => res.json()),

    fetch(ServerURL + "/master/banner", { cache: "no-store" }).then((res) => {
      if (!res.ok) return { discount: [] };

      return res.json();
    }),
    fetch(ServerURL + "/testi/all", { cache: "no-store" }).then((res) => {
      if (!res.ok) return { testimoni: [] };

      return res.json();
    }),
  ]);

  return (
    <Fragment>
      <main>
        <HomeCarousel data={dataCarousel} />
        {/* {dataMarquee.marquee.display && (
          <HorizontalSlider data={dataMarquee.marquee.image} />
        )} */}
        <ShowProductView
          header={"Produk Terbaru"}
          data={dataNewProduct.products}
        />
        {dataBanner.discount.display && (
          <HomeBannerView image={dataBanner.discount.image} />
        )}
        <ShowProductView
          header={"Produk Terlaris"}
          data={dataBestSellProduct.products}
        />
        <TestimoniView testimoni={dataTestimoni.testimoni} />
        <HomeGaleriView />
        <ChatComponent />
      </main>
    </Fragment>
  );
};

export default Page;
