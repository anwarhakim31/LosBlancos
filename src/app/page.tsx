import HorizontalSlider from "@/components/views/home/HorizontalSlider";
import HomeCarousel from "@/components/views/home/HomeCarousel";

import { Fragment } from "react";
import { ServerURL } from "@/utils/contant";
import ShowProductView from "@/components/views/home/ShowProduct";
import TestimoniView from "@/components/views/home/Testimoni";
import HomeGaleriView from "@/components/views/home/HomeGaleri";
import HomeBannerView from "@/components/views/home/HomeBanner";

const Page = async () => {
  const [
    dataCarousel,
    dataMarquee,
    dataNewProduct,
    dataBestSellProduct,
    dataGaleri,
    dataBanner,
  ] = await Promise.all([
    fetch(ServerURL + "/master/carousel", { next: { revalidate: 10 } }).then(
      (res) => res.json()
    ),
    fetch(ServerURL + "/master/marquee", { next: { revalidate: 10 } }).then(
      (res) => res.json()
    ),

    fetch(ServerURL + "/product?limit=4", { cache: "no-store" }).then((res) =>
      res.json()
    ),
    fetch(ServerURL + "/product?limit=4&sold=asc", {
      cache: "no-store",
    }).then((res) => res.json()),
    fetch(ServerURL + "/master/galeri", { next: { revalidate: 10 } }).then(
      (res) => res.json()
    ),
    fetch(ServerURL + "/master/banner", { next: { revalidate: 10 } }).then(
      (res) => res.json()
    ),
  ]);

  return (
    <Fragment>
      <main>
        <HomeCarousel data={dataCarousel} />
        {dataMarquee.marquee.display && (
          <HorizontalSlider data={dataMarquee.marquee.image} />
        )}
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
        <TestimoniView />
        <HomeGaleriView data={dataGaleri.galeri.image} />
      </main>
    </Fragment>
  );
};

export default Page;
