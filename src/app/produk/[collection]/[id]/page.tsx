import Footer from "@/components/layouts/Footer";
import DetailProductView from "@/components/views/DetailProduct/DetailViewMain";
import { ServerURL } from "@/utils/contant";
import React from "react";

const getProduct = async (id: string) => {
  const res = await fetch(ServerURL + "/product/" + id, {
    next: { revalidate: 10 },
  });
  return await res.json();
};

const DetailProduct = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const data = await getProduct(id);

  console.log(data);

  return (
    <main>
      <DetailProductView product={data.product} />
      <Footer />
    </main>
  );
};

export default DetailProduct;
