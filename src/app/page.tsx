import Footer from "@/components/layouts/Footer";
import HorizontalSlider from "@/components/views/home/HorizontalSlider";
import HomeCarousel from "@/components/views/home/HomeCarousel";

import { Fragment } from "react";
import { ServerURL } from "@/utils/contant";

const fetchCarouselData = async () => {
  const res = await fetch(ServerURL + "/master/carousel");
  if (!res.ok) {
    throw new Error("Failed to fetch carousel data");
  }
  return res.json();
};

const Page = async () => {
  let data;

  try {
    data = await fetchCarouselData();
  } catch (error) {
    console.error("Error fetching carousel data:", error);

    data = [];
  }

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
