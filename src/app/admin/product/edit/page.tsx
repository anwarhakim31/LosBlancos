"use client";
import ButtonBackPage from "@/components/element/ButtonBackPage";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./edit.module.scss";
import HeaderPage from "@/components/element/HeaderPage";
import { Controller, useForm } from "react-hook-form";

import { TypeAttribute, TypeStock } from "@/services/type.module";
import DetailProduct from "@/components/views/admin/product/DetailProduct";
import SelectOptionFetch from "@/components/element/SelectOptionFetch";
import { attributeService } from "@/services/attribute/method";
import { X } from "lucide-react";
import { collectionSevice } from "@/services/collection/method";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { ResponseError } from "@/utils/axios/response-error";
import { productService } from "@/services/product/method";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hook";
import { inputProductType } from "@/utils/InputTypes.module";
import InputWeight from "@/components/element/InputWeight";

const AddProductPage = () => {
  const router = useRouter();
  const {
    control,
    register,
    setValue,
    formState: { errors },
    getValues,
    watch,
    handleSubmit,
    reset,
  } = useForm<inputProductType>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: [],
      category: [],
      stock: [],
      collectionName: "",
      attribute: "",
      weight: "",
    },
  });
  const dataEdit = useAppSelector((state) => state.action.editProduct);
  const params = useSearchParams();
  const id = params.get("id");
  const [loading, setLoading] = useState(false);
  const category = watch("category");
  const stocks = watch("stock");
  const [atribut, setAtribut] = useState<TypeAttribute | undefined>(undefined);

  useEffect(() => {
    if (dataEdit) {
      setValue("name", dataEdit?.name);
      setValue("description", dataEdit?.description);
      setValue("price", dataEdit?.price.toString());
      setValue("image", dataEdit?.image);
      setValue("category", dataEdit?.category);
      setValue("collectionName", dataEdit?.collectionName?.name);
      setValue("attribute", dataEdit?.attribute || "");
      if (dataEdit.stock) {
        const toAtribute =
          dataEdit.stock.map((item: TypeStock) => item.value) || [];

        setAtribut({ name: dataEdit?.attribute, value: toAtribute });
      }
      setValue("stock", dataEdit.stock || []);
      setValue("weight", dataEdit?.weight?.toString());
    } else {
      router.push("/admin/product");
    }
  }, [dataEdit, id, router, setValue]);

  const onSubmit = async (data: inputProductType) => {
    setLoading(true);

    try {
      const res = await productService.edit(data, id as string);

      if (res.status === 200) {
        router.push("/admin/product");
        toast.success(res.data.message);
        reset();
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <ButtonBackPage />
      <div className={styles.container}>
        <HeaderPage
          title="Tambah Produk"
          description="Masukan data-data product yang ingin di tambahkan ke form di bawah ini"
        />
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <DetailProduct
            setValue={setValue}
            register={register}
            errors={errors}
            control={control}
            getValues={getValues}
            category={category}
          />
          <div className={styles.stock}>
            <div className={styles.wrapper}>
              <label htmlFor="collectionName">Koleksi</label>
              <Controller
                name="collectionName"
                control={control}
                rules={{ required: "Koleksi tidak bolek kosong" }}
                render={({ field: { onChange, value } }) => (
                  <SelectOptionFetch
                    placeholder="Pilih Koleksi"
                    id="collection"
                    name="collection"
                    value={value}
                    setValue={(value) => {
                      onChange(value.name);
                    }}
                    fetching={(search = "") =>
                      collectionSevice.getCollection(search)
                    }
                  />
                )}
              />
            </div>
            <small>{errors.collectionName?.message}</small>
            <div className={styles.wrapper}>
              <label htmlFor="weight">Berat</label>
              <Controller
                name="weight"
                control={control}
                rules={{ required: "Berat tidak bolek kosong" }}
                render={({ field }) => (
                  <InputWeight id="weight" field={field} />
                )}
              />
            </div>
            <small>{errors.weight?.message}</small>
            <div className={styles.wrapper}>
              <label htmlFor="attribute">Atribut </label>
              <Controller
                control={control}
                name="attribute"
                rules={{ required: "Atribut tidak boleh kosong" }}
                render={({ field: { onChange, value } }) => (
                  <SelectOptionFetch
                    placeholder="Pilih atribut"
                    id="attribute"
                    value={value}
                    name="attribute"
                    fetching={(search = "") =>
                      attributeService.getAttribute(search)
                    }
                    setValue={(value) => {
                      if (value.value) {
                        onChange(value.name);
                        return setAtribut(value);
                      } else {
                        onChange("");
                        return setAtribut(value);
                      }
                    }}
                  />
                )}
              />
            </div>
            <small>{errors.attribute?.message}</small>
            {atribut && atribut.value && atribut?.value?.length > 0 && (
              <Fragment>
                <div className={styles.wrapper}>
                  <span>Stok </span>
                  <div className={styles.list}>
                    {atribut?.value &&
                      atribut.value.length > 0 &&
                      atribut.value.map((v, i) => (
                        <div className={styles.input} key={i}>
                          <p className={styles.info}>{v}</p>
                          <input
                            type="number"
                            id={v}
                            className={styles.text}
                            placeholder="0"
                            min={0}
                            value={
                              stocks?.find((item) => item.value === v)?.stock ||
                              ""
                            }
                            onChange={(e) => {
                              const stock = getValues("stock");

                              if (!stock?.some((item) => item.value === v)) {
                                return setValue("stock", [
                                  ...stock,
                                  {
                                    attribute: atribut.name || "",
                                    value: v,
                                    stock: Number(e.target.value),
                                  },
                                ]);
                              }
                              const newValue = stock?.map((item) =>
                                item.value === v
                                  ? { ...item, stock: Number(e.target.value) }
                                  : item
                              );
                              setValue("stock", newValue);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const stock = getValues("stock");

                              setAtribut((prev) => ({
                                ...prev,
                                value: prev?.value?.filter(
                                  (item) => item !== v
                                ),
                              }));

                              if (stock?.some((item) => item.value === v)) {
                                const newValue = stock?.filter(
                                  (item) => item.value !== v
                                );
                                setValue("stock", newValue);
                              }
                            }}
                          >
                            <X />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </Fragment>
            )}
          </div>
          <ButtonSubmit title="Simpan" loading={loading} />
        </form>
      </div>
    </Fragment>
  );
};

export default AddProductPage;
