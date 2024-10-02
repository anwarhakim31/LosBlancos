import Footer from "@/components/layouts/Footer";
import HorizontalSlider from "@/components/views/home/HorizontalSlider";
import HomeCarousel from "@/components/views/home/HomeCarousel";

import { Fragment } from "react";

const fetchCarouselData = async () => {
  const res = await fetch("http://localhost:3000/api/master/carousel", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch carousel data");
  }
  return res.json();
};

const Page = async () => {
  const data = await fetchCarouselData();

  return (
    <Fragment>
      <main>
        <HomeCarousel data={data} />
        <HorizontalSlider />
      </main>
      <Footer />
    </Fragment>
  );
};

export default Page;
