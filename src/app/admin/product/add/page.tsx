"use client";
import ButtonBackPage from "@/components/element/ButtonBackPage";
import React, { Fragment, useState } from "react";
import styles from "./add.module.scss";
import HeaderPage from "@/components/element/HeaderPage";
import { useForm } from "react-hook-form";

import { TypeProduct } from "@/services/type.module";
import DetailProduct from "@/components/views/admin/product/DetailProduct";
import SelectOptionFetch from "@/components/element/SelectOptionFetch";
import { attributeService } from "@/services/attribute/method";
import { X } from "lucide-react";

const AddProductPage = () => {
  const {
    register,
    setValue,
    formState: { errors },
    getValues,
    watch,
  } = useForm<TypeProduct>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: [],
      category: [],
      collection: "",
    },
  });
  const category = watch("category");
  const [atribut, setAtribut] = useState<string[]>([]);

  return (
    <Fragment>
      <ButtonBackPage />
      <div className={styles.container}>
        <HeaderPage
          title="Tambah Produk"
          description="Masukan data-data product yang ingin di tambahkan ke form di bawah ini"
        />
        <form action="" className={styles.form}>
          <DetailProduct
            setValue={setValue}
            register={register}
            errors={errors}
            getValues={getValues}
            category={category}
          />
          <div className={styles.stock}>
            <div className={styles.wrapper}>
              <label htmlFor="attribute">Atribut </label>
              <SelectOptionFetch
                placeholder="Pilih atribut"
                id="attribute"
                name="atribut"
                fetching={(search = "") =>
                  attributeService.getAttribute(search)
                }
                setValue={(value) => {
                  if (value && value !== "") {
                    return setAtribut(value.value);
                  } else {
                    return setAtribut(value);
                  }
                }}
              />
            </div>
            <small></small>
            {atribut.length > 0 && (
              <div className={styles.wrapper}>
                <label htmlFor="stok">Stok </label>
                <div className={styles.list}>
                  {atribut.length > 0 &&
                    atribut.map((v, i) => (
                      <div className={styles.input} key={i}>
                        <p className={styles.info}>{v}</p>
                        <input
                          type="number"
                          id="id"
                          className={styles.text}
                          placeholder="0"
                          min={0}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setAtribut(atribut.filter((a) => a !== v))
                          }
                        >
                          <X />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default AddProductPage;
