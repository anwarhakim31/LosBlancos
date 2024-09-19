import Modal from "@/components/element/Modal";
import style from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import FormControlFragment from "@/components/fragments/FormControl";
import { Controller, useForm } from "react-hook-form";
import Dropdown from "@/components/element/Dropdown";
import { TypeUser } from "@/services/type.module";

interface PropsType {
  onclose: () => void;
}

const ModalEdit = ({ onclose }: PropsType) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeUser>({
    defaultValues: { fullname: "", email: "", phone: null, jenisKelamin: "" },
  });

  const onsubmit = (data: TypeUser) => {
    console.log(data);
  };

  return (
    <Modal onClose={onclose}>
      <div role="dialog" className={style.modal}>
        <HeaderModal title="Edit Data User" onClose={onclose} />
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
            <Dropdown />
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
