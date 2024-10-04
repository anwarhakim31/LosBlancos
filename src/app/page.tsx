import Footer from "@/components/layouts/Footer";
import HorizontalSlider from "@/components/views/home/HorizontalSlider";
import HomeCarousel from "@/components/views/home/HomeCarousel";

import { Fragment } from "react";
import { ServerURL } from "@/utils/contant";

const Page = async () => {
  const [dataCarousel, dataMarquee] = await Promise.all([
    fetch(ServerURL + "/master/carousel").then((res) => res.json()),
    fetch(ServerURL + "/master/marquee").then((res) => res.json()),
  ]);

  return (
    <Fragment>
      <main>
        <HomeCarousel data={dataCarousel} />
        {dataMarquee.marquee.display && (
          <HorizontalSlider data={dataMarquee.marquee.image} />
        )}
      </main>
      <Footer />
    </Fragment>
  );
};

export default Page;
