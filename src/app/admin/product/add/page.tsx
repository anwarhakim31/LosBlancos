"use client";
import ButtonBackPage from "@/components/element/ButtonBackPage";
import React, { Fragment, useState } from "react";
import styles from "./add.module.scss";
import HeaderPage from "@/components/element/HeaderPage";
import { Controller, useForm } from "react-hook-form";

import { TypeAttribute, TypeProduct } from "@/services/type.module";
import DetailProduct from "@/components/views/admin/product/DetailProduct";
import SelectOptionFetch from "@/components/element/SelectOptionFetch";
import { attributeService } from "@/services/attribute/method";
import { X } from "lucide-react";
import { collectionSevice } from "@/services/collection/method";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { ResponseError } from "@/utils/axios/response-error";
import { productService } from "@/services/product/method";

const AddProductPage = () => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
    getValues,
    watch,
    handleSubmit,
  } = useForm<TypeProduct>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: [],
      category: [],
      stock: [],
      collection: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const category = watch("category");
  const stocks = watch("stock");
  const [atribut, setAtribut] = useState<TypeAttribute | undefined>(undefined);

  console.log(setLoading);

  const onSubmit = async (data: TypeProduct) => {
    setError("");
    if (!atribut) {
      setError("Atribut tidak boleh kosong");
    }

    try {
      const res = await productService.create(data);

      console.log(res);
    } catch (error) {
      ResponseError(error);
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
              <label htmlFor="collection">Koleksi</label>
              <Controller
                name="collection"
                control={control}
                rules={{ required: "Koleksi harus di pilih" }}
                render={({ field: { onChange } }) => (
                  <SelectOptionFetch
                    placeholder="Pilih Koleksi"
                    id="collection"
                    name="collection"
                    setValue={(value) => {
                      onChange(value);
                    }}
                    fetching={(search = "") =>
                      collectionSevice.getCollection(search)
                    }
                  />
                )}
              />
            </div>
            <small>{errors.collection?.message}</small>
            <div className={styles.wrapper}>
              <label htmlFor="attribute">Atribut </label>
              <SelectOptionFetch
                placeholder="Pilih atribut"
                id="attribute"
                name="attribute"
                fetching={(search = "") =>
                  attributeService.getAttribute(search)
                }
                setValue={(value) => {
                  setError("");
                  if (value.value) {
                    return setAtribut(value);
                  } else {
                    return setAtribut(value);
                  }
                }}
              />
            </div>
            <small>{error}</small>
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
