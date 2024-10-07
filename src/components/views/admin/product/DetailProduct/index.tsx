import Input from "@/components/element/Input";
import InputCurrency from "@/components/element/InputCurrency";
import BoxUploadWrapper from "@/components/fragments/BoxUploadImage";
import SelectOptionFetch from "@/components/element/SelectOptionFetch";
import { categoryService } from "@/services/category/method";

import { collectionSevice } from "@/services/collection/method";
import styles from "./detail.module.scss";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { TypeProduct } from "@/services/type.module";
import { X } from "lucide-react";

interface propsType {
  setValue: UseFormSetValue<TypeProduct>;
  register: UseFormRegister<TypeProduct>;
  errors: FieldErrors<TypeProduct>;
  getValues: UseFormGetValues<TypeProduct>;
  category: string[];
}

const DetailProduct = ({
  setValue,
  register,
  errors,
  getValues,
  category,
}: propsType) => {
  const handleUpload = (updatedImages: string[]) => {
    setValue("image", updatedImages);
  };

  console.log(category);

  return (
    <div className={styles.detail}>
      <div className={styles.wrapper}>
        <label htmlFor="image">Gambar</label>

        <BoxUploadWrapper
          onChange={(updateImage) => handleUpload(updateImage)}
        />
        <input type="text" style={{ display: "none" }} id="image" />
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
      <small>{errors && errors.name?.message}</small>
      <div className={styles.wrapper}>
        <label htmlFor="price">Harga</label>
        <InputCurrency
          id="price"
          field={{
            ...register("price", {
              required: "Harga tidak boleh kosong",
            }),
          }}
        />
      </div>
      <small>{errors.price?.message}</small>
      <div className={styles.wrapper}>
        <label htmlFor="category">Kategori</label>
        <div style={{ width: "100%" }}>
          <SelectOptionFetch
            placeholder="Pilih Kategori"
            id="category"
            name="category"
            setValue={(value) => {
              const category = getValues("category") || [];

              console.log(value);

              if (!category.includes(value.name) && value !== "") {
                category.push(value.name);
              }

              setValue("category", category);
            }}
            fetching={(search = "") => categoryService.get(search)}
          />
          <div className={styles.category}>
            {category &&
              category.map((category) => (
                <div key={category}>
                  <p>{category}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setValue(
                        "category",
                        getValues("category").filter((c) => c !== category)
                      )
                    }
                  >
                    <X />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      <small>{errors.price?.message}</small>
      <div className={styles.wrapper}>
        <label htmlFor="collection">Koleksi</label>
        <SelectOptionFetch
          placeholder="Pilih Koleksi"
          id="collection"
          name="koleksi"
          setValue={(value) => {
            setValue("collection", value);
          }}
          fetching={(search = "") => collectionSevice.getCollection(search)}
        />
      </div>
      <small>{errors.price?.message}</small>
      <div className={styles.wrapper}>
        <label htmlFor="description">Deskripsi</label>
        <textarea
          className={styles.textarea}
          id="description"
          {...register("description", {
            required: "Deskripsi tidak boleh kosong",
          })}
          placeholder="Masukan Deskripsi"
        ></textarea>
      </div>
      <small>{errors.price?.message}</small>
    </div>
  );
};

export default DetailProduct;
