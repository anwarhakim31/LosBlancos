import Footer from "@/components/layouts/Footer";
import Caraousal from "@/components/views/home/Carousal";
import Slider from "@/components/views/home/Silders";

import { Fragment } from "react";

const Page = () => {
  return (
    <Fragment>
      <main>
        <Slider />
        <Caraousal />
      </main>
      <Footer />
    </Fragment>
  );
};

export default Page;
