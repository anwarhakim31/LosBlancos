import Footer from "@/components/layouts/Footer";
import HorizontalSlider from "@/components/views/home/HorizontalSlider";
import Slider from "@/components/views/home/Silders";

import { Fragment } from "react";

const Page = () => {
  return (
    <Fragment>
      <main>
        <Slider />
        <HorizontalSlider />
      </main>
      <Footer />
    </Fragment>
  );
};

export default Page;
