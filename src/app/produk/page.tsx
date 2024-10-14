import BreadCrubm from "@/components/element/BreadCrubm";
import Footer from "@/components/layouts/Footer";
import styles from "./product.module.scss";
import { ServerURL } from "@/utils/contant";

import ProductMainView from "@/components/views/AllProduct/MainProduct";

import FilterProductView from "@/components/views/AllProduct/FilterProduct";

const fetchData = async (params: URLSearchParams) => {
  const search = params.get("search") || "";
  const category = params.getAll("category") || [];
  const max = params.get("max");
  const min = params.get("min");

  const paramsQuery = new URLSearchParams();

  paramsQuery.set("search", search);
  paramsQuery.set("limit", "12");
  paramsQuery.set("min", min || "");
  paramsQuery.set("max", max || "");

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
  const { products } = await fetchData(new URLSearchParams(searchParams));

  return (
    <main>
      <section className={styles.container}>
        <BreadCrubm />

        <div className={styles.wrapper}>
          <FilterProductView />
          <div style={{ flex: 1 }}>
            <ProductMainView products={products} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default ProductPage;
