import Footer from "@/components/layouts/Footer";
import DetailProductView from "@/components/views/DetailProduct/DetailViewMain";
import { ServerURL } from "@/utils/contant";

import React, { Fragment } from "react";

const getProduct = async (id: string) => {
  const res = await fetch(ServerURL + "/product/" + id, { cache: "no-store" });
  return res.json();
};

const DetailProduct = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const data = await getProduct(id);

  console.log(data.product.stock);

  return (
    <Fragment>
      <main>
        <DetailProductView product={data.product} />
      </main>
      <Footer />
    </Fragment>
  );
};

export default DetailProduct;
