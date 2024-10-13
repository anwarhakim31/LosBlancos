import Input from "@/components/element/Input";
import InputCurrency from "@/components/element/InputCurrency";
import BoxUploadWrapper from "@/components/fragments/BoxUploadImage";
import SelectOptionFetch from "@/components/element/SelectOptionFetch";
import { categoryService } from "@/services/category/method";
import styles from "./detail.module.scss";
import {
  Controller,
  ControllerProps,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { TypeStock } from "@/services/type.module";
import { X } from "lucide-react";

interface formType {
  name: string;
  description: string;
  price: string;
  image: string[];
  category: string[];
  stock: TypeStock[];
  collectionName: string;
  attribute: string;
}

interface propsType {
  setValue: UseFormSetValue<formType>;
  register: UseFormRegister<formType>;
  errors: FieldErrors<formType>;
  getValues: UseFormGetValues<formType>;
  category: string[];
  control: ControllerProps<formType>["control"];
}

const DetailProduct = ({
  setValue,
  register,
  errors,
  getValues,
  category,
  control,
}: propsType) => {
  return (
    <div className={styles.detail}>
      <div className={styles.wrapper}>
        <label
          htmlFor="image"
          style={{ width: "min-content", height: "min-content" }}
        >
          Gambar
        </label>
        <Controller
          control={control}
          name="image"
          rules={{ required: "Gambar tidak boleh kosong" }}
          render={({ field: { onChange, value } }) => (
            <BoxUploadWrapper
              onChange={(updateImage) => onChange(updateImage)}
              value={value}
            />
          )}
        />

        <input type="text" style={{ display: "none" }} id="image" />
      </div>
      {errors && errors.image ? (
        <small>{errors.image?.message}</small>
      ) : (
        <small>Format File: PNG, JPG, JPEG, WEBP & Max. 5 MB</small>
      )}

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
        <Controller
          name="price"
          control={control}
          rules={{ required: "Harga tidak boleh kosong" }}
          render={({ field }) => <InputCurrency id="price" field={field} />}
        />
      </div>
      <small>{errors.price?.message}</small>
      <div className={styles.wrapper}>
        <label htmlFor="category">Kategori</label>
        <div style={{ width: "100%" }}>
          <Controller
            control={control}
            name="category"
            rules={{ required: "Kategori tidak boleh kosong" }}
            render={({ field: { onChange, value } }) => (
              <SelectOptionFetch
                placeholder="Pilih Kategori"
                id="category"
                name="category"
                value={value}
                setValue={(value) => {
                  const category = getValues("category") || [];

                  if (!category.includes(value.name) && value !== "") {
                    category.push(value.name);
                  }

                  onChange(category);
                }}
                fetching={(search = "") => categoryService.get(search)}
              />
            )}
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

      <small>{errors.category?.message}</small>
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
      <small>{errors.description?.message}</small>
    </div>
  );
};

export default DetailProduct;
