import EditProductMainView from "@/components/views/admin/product/EditMainView";
import { TypeProduct } from "@/services/type.module";
import { ServerURL } from "@/utils/contant";
import { redirect } from "next/navigation";

const fetchData = async (id: string) => {
  const res = await fetch(`${ServerURL}/product/` + id, { cache: "no-store" });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data.product;
};

const EditProductPage = async ({ searchParams }: { searchParams: string }) => {
  const searchParamsId = new URLSearchParams(searchParams).get("id");
  if (!searchParamsId) return redirect("/admin/product");
  const product = await fetchData(searchParamsId);

  if (!product) {
    return redirect("/admin/product");
  }

  return <EditProductMainView product={product as TypeProduct} />;
};

export default EditProductPage;
