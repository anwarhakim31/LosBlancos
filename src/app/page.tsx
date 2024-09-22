import Footer from "@/components/layouts/Footer";
import Slider from "@/components/views/home/Silders";

import { Fragment } from "react";

const Page = () => {
  return (
    <Fragment>
      <main>
        <Slider />
      </main>
      <Footer />
    </Fragment>
  );
};

export default Page;
