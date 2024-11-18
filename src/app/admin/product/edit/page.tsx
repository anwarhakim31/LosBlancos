import EditProductMainView from "@/components/views/admin/product/EditMainView";
import { TypeProduct } from "@/services/type.module";
import { ServerURL } from "@/utils/contant";
import { redirect } from "next/navigation";

const fetchData = async (id: string) => {
  const res = await fetch(`${ServerURL}/product/` + id, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data.product;
};

const EditProductPage = async ({ searchParams }: { searchParams: string }) => {
  const searchParamsId = new URLSearchParams(searchParams).get("id");
  if (!searchParamsId) return redirect("/admin/product");
  const product = await fetchData(searchParamsId);
  console.log(product);

  if (!product) {
    return redirect("/not-found");
  }

  return <EditProductMainView product={product as TypeProduct} />;
};

export default EditProductPage;
