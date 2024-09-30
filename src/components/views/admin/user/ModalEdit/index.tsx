import Modal from "@/components/element/Modal";
import style from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import FormControlFragment from "@/components/fragments/FormControl";
import { Controller, useForm } from "react-hook-form";

import { TypeUser } from "@/services/type.module";
import FormControlSelect from "@/components/fragments/FormControlSelect";

interface PropsType {
  onClose: () => void;
  isEditData: TypeUser | null;
}

const ModalEdit = ({ onClose, isEditData }: PropsType) => {
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<TypeUser>({
    defaultValues: {
      fullname: isEditData?.fullname || "",
      phone: isEditData?.phone || "",
      jenisKelamin: isEditData?.jenisKelamin || "",
    },
  });

  const onsubmit = (data: TypeUser) => {
    console.log(data);
  };

  return (
    <Modal onClose={onClose}>
      <div
        role="dialog"
        className={style.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <HeaderModal title="Edit Data User" onClose={onClose} />
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className={style.modal__content}>
            <Controller
              name="fullname"
              control={control}
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
              name="jenisKelamin"
              control={control}
              render={({ field }) => (
                <FormControlSelect
                  id="jenisKelamin"
                  name="Jenis Kelamin"
                  field={field}
                  error={errors}
                  placeholder="Pilih Jenis Kelamin"
                  options={["Laki-Laki", "Perempuan"]}
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
