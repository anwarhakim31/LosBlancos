import Footer from "@/components/layouts/Footer";
import DetailProductView from "@/components/views/DetailProduct/DetailView";
import React from "react";

const DetailProduct = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  console.log(id);

  return (
    <main>
      <DetailProductView />
      <Footer />
    </main>
  );
};

export default DetailProduct;
