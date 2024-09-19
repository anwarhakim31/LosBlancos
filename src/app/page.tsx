import Footer from "@/components/layouts/Footer";
import Product from "@/components/views/home/Product";
import { Fragment } from "react";

const Page = () => {
  return (
    <Fragment>
      <main>
        <Product />
      </main>
      <Footer />
    </Fragment>
  );
};

export default Page;
