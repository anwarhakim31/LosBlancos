import Modal from "@/components/element/Modal";
import React, { FC } from "react";
import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";

import FormControlSelectSearch from "@/components/fragments/FormControlSelectSearch";

import { Controller, useForm } from "react-hook-form";
import { ongkirService } from "@/services/ongkir/method";
import FormControlFragment from "@/components/fragments/FormControl";

interface PropsType {
  onClose: () => void;
}

const ModalAddShipping: FC<PropsType> = ({ onClose }) => {
  const {
    control,

    formState: { errors },
  } = useForm({
    defaultValues: { province: "", fullname: "", phone: "" },
  });

  return (
    <Modal onClose={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={styles.container}>
        <HeaderModal onClose={onClose} title={"Tambah Alamat Pengiriman"} />

        <form action="" className={styles.form}>
          <div className={styles.wrapper}>
            <Controller
              control={control}
              name="fullname"
              render={({ field }) => (
                <FormControlFragment
                  id="fullname"
                  name="fullname"
                  type="text"
                  placeholder="Masukan Nama Lengkap"
                  error={errors}
                  field={field}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <FormControlFragment
                  id="phone"
                  name="phone"
                  type="number"
                  placeholder="Masukan Nomor Telepon"
                  error={errors}
                  field={field}
                />
              )}
            />
          </div>
          <div className={styles.wrapper}>
            <Controller
              control={control}
              name="province"
              rules={{ required: "Provinsi tidak boleh kosong." }}
              render={({ field }) => (
                <FormControlSelectSearch
                  id="province"
                  name="province"
                  placeholder="Pilih Provinsi"
                  fetching={() => ongkirService.province()}
                  error={errors}
                  field={field}
                />
              )}
            />
            <Controller
              control={control}
              name="province"
              rules={{ required: "Provinsi tidak boleh kosong." }}
              render={({ field }) => (
                <FormControlSelectSearch
                  id="province"
                  name="province"
                  placeholder="Pilih Provinsi"
                  fetching={() => ongkirService.province()}
                  error={errors}
                  field={field}
                />
              )}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalAddShipping;
