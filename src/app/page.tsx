import Footer from "@/components/layouts/Footer";
import HorizontalSlider from "@/components/views/home/HorizontalSlider";
import HomeCarousel from "@/components/views/home/HomeCarousel";

import { Fragment } from "react";
import { ServerURL } from "@/utils/contant";
import ShowProductView from "@/components/views/home/ShowProduct";
import TestimoniView from "@/components/views/home/Testimoni";
import GaleriView from "@/components/views/home/Galeri";

const Page = async () => {
  const [dataCarousel, dataMarquee, dataNewProduct] = await Promise.all([
    fetch(ServerURL + "/master/carousel", { cache: "no-store" }).then((res) =>
      res.json()
    ),
    fetch(ServerURL + "/master/marquee", { cache: "no-store" }).then((res) =>
      res.json()
    ),
    fetch(ServerURL + "/product?limit=4", { cache: "no-store" }).then((res) =>
      res.json()
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
        <ShowProductView
          header={"Produk Terlaris"}
          data={dataNewProduct.products}
        />
        <TestimoniView />
        <GaleriView />
      </main>
      <Footer />
    </Fragment>
  );
};

export default Page;
