"use client";
import ButtonBackPage from "@/components/element/ButtonBackPage";
import React, { Fragment } from "react";
import styles from "./add.module.scss";
import HeaderPage from "@/components/element/HeaderPage";
import { useForm } from "react-hook-form";

import Input from "@/components/element/Input";
import InputCurrency from "@/components/element/InputCurrency";
import BoxUploadWrapper from "@/components/fragments/BoxUploadImage";

const AddProductPage = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<{
    name: string;
    description: string;
    price: string;
    gambar: string[];
    category: string[];
  }>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      gambar: [],
      category: [],
    },
  });

  const handleUpload = (updatedImages: string[]) => {
    setValue("gambar", updatedImages);
  };

  return (
    <Fragment>
      <ButtonBackPage />
      <div className={styles.container}>
        <HeaderPage
          title="Tambah Produk"
          description="Masukan data-data product yang ingin di tambahkan ke form di bawah ini"
        />
        <form action="" className={styles.form}>
          <div className={styles.wrapper}>
            <label htmlFor="gambar">Gambar</label>

            <BoxUploadWrapper
              onChange={(updateImage) => handleUpload(updateImage)}
            />
            <input type="text" style={{ display: "none" }} id="gambar" />
          </div>
          <small></small>
          <div className={styles.wrapper}>
            <label htmlFor="name">Nama Produk</label>
            <Input
              placeholder="Masukan Nama Produk"
              type="text"
              id="name"
              field={{
                ...register("name", {
                  required: "Nama produk tidak boleh kosong",
                }),
              }}
            />
          </div>
          <small>{errors.name?.message}</small>
          <div className={styles.wrapper}>
            <label htmlFor="price">Harga</label>
            <InputCurrency
              id="price"
              field={{
                ...register("price", { required: "Harga tidak boleh kosong" }),
              }}
            />
          </div>
          <small>{errors.price?.message}</small>
        </form>
      </div>
    </Fragment>
  );
};

export default AddProductPage;
