import ChatComponent from "@/components/element/ChatComponent";
import DetailProductView from "@/components/views/DetailProduct/DetailViewMain";
import { ServerURL } from "@/utils/contant";
import { redirect } from "next/navigation";

import React, { Fragment } from "react";

const getProduct = async (id: string) => {
  const res = await fetch(ServerURL + "/product/" + id, { cache: "no-store" });
  return res.json();
};

const getReview = async (id: string, searchParams: URLSearchParams) => {
  const page = searchParams.get("page") || "1";

  const res = await fetch(
    ServerURL + `/review/product?productId=${id}&page=${page}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  const dataProduct = await getProduct(params.id);

  if (!dataProduct.product) {
    return {
      title: "Produk tidak ditemukan",
      description: "Halaman produk tidak ditemukan.",
      openGraph: {
        title: "Produk tidak ditemukan",
        description: "Halaman produk tidak ditemukan.",
        type: "website",
        locale: "id_ID",
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/produk`,
        siteName: "E-commerce",
        images: [],
      },
      twitter: {
        card: "summary_large_image",
        title: "Produk tidak ditemukan",
        description: "Halaman produk tidak ditemukan.",
        images: [],
      },
    };
  }

  return {
    title: `${dataProduct.product.name} - Beli sekarang dengan harga terbaik`,
    description: `${dataProduct.product.description}`,
    openGraph: {
      title: `${dataProduct.product.name}`,
      description: `${dataProduct.product.description}`,
      type: "website",
      locale: "id_ID",
      url: `${
        process.env.NEXT_PUBLIC_DOMAIN
      }/${dataProduct.product.collectionName.name.replace(/\s/g, "-")}/${
        dataProduct.product._id
      }`,
      siteName: dataProduct.product.name,
      images: dataProduct.product.image,
    },
    twitter: {
      card: "summary_large_image",
      title: `${dataProduct.product.name}`,
      description: `${dataProduct.product.description}`,
      images: [dataProduct.product.image[0]],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

const DetailProduct = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: string;
}) => {
  const { id } = params;

  const dataProduct = await getProduct(id);

  if (!dataProduct.product) {
    redirect("/produk");
  }

  const dataReview = await getReview(id, new URLSearchParams(searchParams));

  return (
    <Fragment>
      <main>
        <DetailProductView
          product={dataProduct.product}
          reviews={dataReview.reviews}
          pagination={
            dataReview.pagination || {
              totalPage: 0,
              total: 0,
              page: 1,
              limit: 8,
            }
          }
          ratingsSummary={dataReview.ratingsSummary}
        />
      </main>
      <ChatComponent />
    </Fragment>
  );
};

export default DetailProduct;
