import Footer from "@/components/layouts/Footer";
import HorizontalSlider from "@/components/views/home/HorizontalSlider";
import HomeCarousel from "@/components/views/home/HomeCarousel";

import { Fragment } from "react";

const Page = () => {
  return (
    <Fragment>
      <main>
        <HomeCarousel />
        <HorizontalSlider />
      </main>
      <Footer />
    </Fragment>
  );
};

export default Page;
