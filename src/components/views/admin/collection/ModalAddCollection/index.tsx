/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/element/Modal";
import style from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { useState } from "react";
import FormControlFragment from "@/components/fragments/FormControl";
import { ResponseError } from "@/utils/axios/response-error";

import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";

import { TypeCollection } from "@/services/type.module";
import { collectionSevice } from "@/services/collection/method";
import UploadImage from "@/components/fragments/UploadImage";

interface PropsType {
  onClose: () => void;
  callback: () => Promise<any>;
}

const ModalAddCollection = ({ onClose, callback }: PropsType) => {
  const {
    handleSubmit,
    control,
    reset,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", image: "", description: "" },
  });

  const image = watch("image");

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: TypeCollection) => {
    setLoading(true);

    try {
      const res = await collectionSevice.addCollection(data);

      if (res.status === 201) {
        toast.success(res.data.message);
        onClose();
        callback();
        reset();
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={loading ? () => {} : onClose}>
      <div
        role="dialog"
        className={style.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <HeaderModal
          title="Tambah Diskon"
          onClose={loading ? () => {} : onClose}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.modal__content}>
            <Controller
              control={control}
              name="name"
              rules={{
                required: "Nama tidak boleh kosong",
                maxLength: { value: 32, message: "Maksimal 32 karakter" },
              }}
              render={({ field }) => (
                <FormControlFragment
                  id="nama"
                  type="text"
                  placeholder="Masukkan Nama koleksi"
                  field={field}
                  name="nama"
                  error={errors}
                />
              )}
            />
            <div className={`${style.input_group} `}>
              <label htmlFor="image" onClick={(e) => e.preventDefault()}>
                Gambar
              </label>
              <UploadImage
                setLoading={setLoading}
                loading={loading}
                register={register}
                image={image}
                setValue={setValue}
              />
            </div>
            <small className={style.error_message}>
              {errors.image && errors.image.message}
            </small>
            <div className={`${style.input_group} `}>
              <label htmlFor="image" onClick={(e) => e.preventDefault()}>
                Deskripsi
              </label>
              <textarea
                placeholder="Masukkan deskripsi kategori"
                id="description"
                {...register("description", {
                  required: "Deksripsi tidak boleh kosong",
                  maxLength: { value: 555, message: "Maksimal 555 karakter" },
                })}
                className={style.textarea}
                cols={30}
                rows={10}
              />
            </div>
            <small className={style.error_message}>
              {errors.description && errors.description.message}
            </small>
          </div>

          <div className={style.modal__footer}>
            <div style={{ width: "100px" }}>
              <ButtonSubmit title="Simpan" loading={loading} />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalAddCollection;
