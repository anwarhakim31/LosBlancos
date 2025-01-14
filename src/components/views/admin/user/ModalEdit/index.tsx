/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/element/Modal";
import style from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import FormControlFragment from "@/components/fragments/FormControl";
import { Controller, useForm } from "react-hook-form";

import { TypeUser } from "@/services/type.module";
import FormControlSelect from "@/components/fragments/FormControlSelect";
import { ResponseError } from "@/utils/axios/response-error";
import { userService } from "@/services/user/method";
import { toast } from "sonner";
import { useState } from "react";

interface PropsType {
  onClose: () => void;
  isEditData: TypeUser | null;
  callback: () => void;
}

const ModalEdit = ({ onClose, isEditData, callback }: PropsType) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<TypeUser>({
    defaultValues: {
      fullname: isEditData?.fullname || "",
      phone: isEditData?.phone || "",
      gender: isEditData?.gender || "",
      password: "",
    },
  });

  const onsubmit = async (data: TypeUser) => {
    setLoading(true);
    try {
      const res = await userService.updateUser(isEditData?._id as string, data);

      if (res.status === 200) {
        onClose();
        toast.success(res.data.message);
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
          title="Edit Data User"
          onClose={loading ? () => {} : onClose}
        />
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className={style.modal__content}>
            <Controller
              name="fullname"
              control={control}
              rules={{
                required: "Nama Lengkap tidak boleh kosong",
                minLength: {
                  value: 6,
                  message: "Nomor Telepon minimal 8 karakter",
                },
              }}
              render={({ field }) => (
                <FormControlFragment
                  type="text"
                  placeholder="Masukkan Nama Lengkap "
                  name="Nama Lengkap "
                  id="fullname"
                  field={field}
                  error={errors}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Nomor Telepon tidak boleh kosong",
                minLength: {
                  value: 8,
                  message: "Nomor Telepon minimal 8 karakter",
                },
              }}
              render={({ field }) => (
                <FormControlFragment
                  type="number"
                  placeholder="Masukan No Telepon"
                  name="Nomor Telepon"
                  id="phone"
                  field={field}
                  error={errors}
                />
              )}
            />
            <Controller
              name="gender"
              control={control}
              rules={{ required: "Nama Lengkap tidak boleh kosong" }}
              render={({ field }) => (
                <FormControlSelect
                  id="gender"
                  name="Jenis Kelamin"
                  field={field}
                  error={errors}
                  placeholder="Pilih Jenis Kelamin"
                  options={["Laki-Laki", "Perempuan"]}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                minLength: {
                  value: 6,
                  message: "Passowrd minimal 6 karakter",
                },
              }}
              render={({ field }) => (
                <FormControlFragment
                  type="text"
                  placeholder="Password"
                  name="Password"
                  id="password"
                  field={field}
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

export default ModalEdit;
