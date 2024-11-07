import BreadCrubm from "@/components/element/BreadCrubm";

import styles from "./product.module.scss";
import { ServerURL } from "@/utils/contant";

import ProductMainView from "@/components/views/AllProduct/MainProduct";

import FilterProductView from "@/components/views/AllProduct/FilterProduct";

const fetchData = async (params: URLSearchParams) => {
  const search = params.get("search") || "";
  const category = params.getAll("category") || [];
  const max = params.get("max");
  const min = params.get("min");
  const collection = params.get("collection");
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
    return console.log("gagal");
  }

  return res.json();
};

const ProductPage = async ({ searchParams }: { searchParams: string }) => {
  const { products, pagination } = await fetchData(
    new URLSearchParams(searchParams)
  );

  return (
    <main>
      <section className={styles.container}>
        <BreadCrubm />

        <div className={styles.wrapper}>
          <div className={styles.filter}>
            <FilterProductView />
          </div>

          <ProductMainView products={products} pagination={pagination} />
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
