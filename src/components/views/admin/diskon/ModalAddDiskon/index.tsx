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
import { diskonService } from "@/services/discount/method";

interface PropsType {
  onClose: () => void;
  callback: () => Promise<any>;
}

const ModalAddDiskon = ({ onClose, callback }: PropsType) => {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
      percent: null,
      info: "",
    },
  });

  const onSubmit = async (data: {
    code: string;
    percent: number | null;
    info: string;
  }) => {
    setLoading(true);
    try {
      const res = await diskonService.add(data);

      if (res.status === 200) {
        toast.success(res.data.message);

        onClose();
        callback();
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
              name="code"
              rules={{ required: "Kode tidak boleh kosong" }}
              render={({ field }) => (
                <FormControlFragment
                  type="text"
                  id="code"
                  field={field}
                  name="kode"
                  placeholder="Masukkan Kode"
                  error={errors}
                />
              )}
            />
            <Controller
              control={control}
              name="percent"
              rules={{ required: "Persentase tidak boleh kosong" }}
              render={({ field }) => (
                <FormControlFragment
                  type="number"
                  id="percent"
                  field={field}
                  name="persen"
                  placeholder="Masukkan Persentase"
                  error={errors}
                />
              )}
            />
            <Controller
              control={control}
              name="info"
              rules={{ required: "Keterangan tidak boleh kosong" }}
              render={({ field }) => (
                <FormControlFragment
                  type="text"
                  id="info"
                  field={field}
                  name="keterangan"
                  placeholder="Masukkan Keterangan"
                  error={errors}
                />
              )}
            />
          </div>
          <div className={style.modal__footer}>
            <div style={{ width: "100px" }}>
              <ButtonSubmit title="Simpan" />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalAddDiskon;
