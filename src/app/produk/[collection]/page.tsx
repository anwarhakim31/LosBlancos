import BreadCrubm from "@/components/element/BreadCrubm";

import styles from "./collcection.module.scss";
import { formatCollectionName, ServerURL } from "@/utils/contant";

import ProductMainView from "@/components/views/AllProduct/MainProduct";

import FilterProductView from "@/components/views/AllProduct/FilterProduct";
import { Fragment } from "react";
import ChatComponent from "@/components/element/ChatComponent";

export async function generateMetadata({
  params,
}: {
  params: { collection: string };
}) {
  return {
    title: `Koleksi Produk ${formatCollectionName(
      params.collection.replace("-", " ")
    )} `,
    description: `Koleksi produk ${formatCollectionName(
      params.collection.replace("-", " ")
    )}`,
    openGraph: {
      title: `Koleksi Produk ${formatCollectionName(
        params.collection.replace("-", " ")
      )}`,
      description: `Koleksi produk ${formatCollectionName(
        params.collection.replace("-", " ")
      )}`,
      type: "website",
      locale: "id_ID",
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/produk/${formatCollectionName(
        params.collection.replace("-", " ")
      )}`,
    },
  };
}

const fetchData = async (collection: string, params: URLSearchParams) => {
  const search = params.get("search") || "";
  const category = params.getAll("category") || [];
  const max = params.get("max");
  const min = params.get("min");

  const page = params.get("page") || "1";

  const paramsQuery = new URLSearchParams();

  paramsQuery.set("search", search);
  paramsQuery.set("limit", "12");
  paramsQuery.set("min", min || "");
  paramsQuery.set("max", max || "");
  paramsQuery.set("collection", collection || "");
  paramsQuery.set("page", page);

  category.forEach((item) => {
    paramsQuery.set("category", item);
  });

  const res = await fetch(
    ServerURL + "/product?" + paramsQuery.toString() + "",
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return { products: [], pagination: {} };
  }

  const data = await res.json();

  return data;
};

const getBanner = async (slug: string) => {
  const res = await fetch(ServerURL + "/collection/banner?slug=" + slug, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { products: [], pagination: {} };
  }

  return res.json();
};

const CollectionProductPage = async ({
  params,
  searchParams,
}: {
  params: { collection: string };
  searchParams: string;
}) => {
  const collection = params.collection;
  const data = await getBanner(collection);
  const { products, pagination } = await fetchData(
    collection,
    new URLSearchParams(searchParams)
  );

  return (
    <Fragment>
      <main>
        <div
          className={styles.banner}
          style={{
            backgroundImage: `url(${data.banner || "/collection1.png"}) `,
          }}
        ></div>
        <section className={styles.container}>
          <BreadCrubm />

          <div className={styles.wrapper}>
            <div className={styles.filter}>
              <FilterProductView />
            </div>

            <ProductMainView
              products={products || []}
              pagination={pagination}
            />
          </div>
        </section>
      </main>
      <ChatComponent />
    </Fragment>
  );
};

export default CollectionProductPage;
