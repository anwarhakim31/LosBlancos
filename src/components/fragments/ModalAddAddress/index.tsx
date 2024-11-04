import Modal from "@/components/element/Modal";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";

import FormControlSelectSearch from "@/components/fragments/FormControlSelectSearch";

import { Controller, useForm } from "react-hook-form";
import { ongkirService } from "@/services/ongkir/method";
import FormControlFragment from "@/components/fragments/FormControl";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { ResponseError } from "@/utils/axios/response-error";
import { useSession } from "next-auth/react";
import { addressService } from "@/services/address/methods";
import { toast } from "sonner";
import { TypeShippingAddress } from "@/services/type.module";
import { setShippingAddress } from "@/store/slices/chechkoutSlice";
import { getOngkir } from "@/store/slices/ongkirSlice";
import { useAppDispatch } from "@/store/hook";

interface PropsType {
  onClose: () => void;
  setAddress: Dispatch<SetStateAction<TypeShippingAddress[]>>;
  transactionId: string;
}

interface InputShippingType {
  province: { id: string; provinsi: string } | null;
  fullname: string;
  phone: string;
  city: {
    id: string;
    id_provinsi: string;
    kota: string;
  } | null;
  postalCode: string;
  subdistrict: string;
  address: string;
}

const ModalAddAddress: FC<PropsType> = ({
  onClose,
  setAddress,
  transactionId,
}) => {
  const session = useSession();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const {
    control,
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InputShippingType>({
    defaultValues: {
      province: null,
      fullname: "",
      phone: "",
      city: null,
      postalCode: "",
      subdistrict: "",
      address: "",
    },
  });
  const province = watch("province");

  const onSubmit = async (data: InputShippingType) => {
    if (session.status === "authenticated" && session?.data?.user?.name) {
      setLoading(true);
      try {
        const res = await addressService.create({
          userId: session?.data?.user?.id as string,
          province: {
            id: data.province?.id ?? "",
            name: data.province?.provinsi ?? "",
          },
          fullname: data.fullname,
          phone: data.phone,
          city: {
            id: data.city?.id ?? "",
            id_province: data.city?.id_provinsi ?? "",
            name: data.city?.kota ?? "",
          },
          subdistrict: data.subdistrict,
          postalCode: data.postalCode,
          address: data.address,
        });

        if (res.status === 201) {
          onClose();
          toast.success(res.data.message);
          dispatch(setShippingAddress(res.data.address[0]));
          dispatch(
            getOngkir({
              desCity: res.data.address[0].city.name,
              desProvince: res.data.address[0].province.name,
              transactionId: transactionId,
            })
          );
          setAddress(res.data.address);
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setValue("city", null);
  }, [province, setValue]);

  useEffect(() => {
    if (session.status === "authenticated" && session?.data?.user?.name) {
      setValue("fullname", session?.data?.user?.name);
    }
  }, [session.status, setValue, session?.data?.user?.name]);

  return (
    <Modal onClose={loading ? () => {} : onClose}>
      <div onClick={(e) => e.stopPropagation()} className={styles.container}>
        <HeaderModal
          onClose={loading ? () => {} : onClose}
          title={"Tambah Alamat Pengiriman"}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.form}>
            <div className={styles.wrapper}>
              <div style={{ width: "100%", display: "block" }}>
                <Controller
                  control={control}
                  name="fullname"
                  rules={{ required: "Nama Lengkap tidak boleh kosong." }}
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
              </div>
              <div style={{ width: "100%" }}>
                <Controller
                  control={control}
                  name="phone"
                  rules={{ required: "Nomor Telepon tidak boleh kosong." }}
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
            </div>
            <div className={styles.wrapper}>
              <div style={{ width: "100%" }}>
                <Controller
                  control={control}
                  name="province"
                  rules={{ required: "Provinsi tidak boleh kosong." }}
                  render={({ field }) => (
                    <FormControlSelectSearch
                      id="province"
                      label="provinsi"
                      name="provinsi"
                      placeholder="Pilih Provinsi"
                      fetching={() => ongkirService.province()}
                      error={errors}
                      field={field}
                    />
                  )}
                />
              </div>
              <div style={{ width: "100%" }}>
                <Controller
                  control={control}
                  name="city"
                  rules={{ required: "kota/kabupaten tidak boleh kosong." }}
                  render={({ field }) => (
                    <FormControlSelectSearch
                      id="city"
                      name="kota"
                      label="kota/kabupaten"
                      placeholder="Pilih Kota/Kabupaten"
                      fetching={() => {
                        if (province) {
                          return ongkirService.city(province.id);
                        }
                        return Promise.resolve([
                          { id_provinsi: "", id: "", kota: "" },
                        ]);
                      }}
                      error={errors}
                      field={field}
                    />
                  )}
                />
              </div>
            </div>
            <div className={styles.wrapper}>
              <div style={{ width: "100%" }}>
                <Controller
                  control={control}
                  name="subdistrict"
                  rules={{ required: "Kecamatan tidak boleh kosong." }}
                  render={({ field }) => (
                    <FormControlFragment
                      id="subdistrict"
                      name="kecamatan"
                      type="text"
                      placeholder="Masukan kecamatan"
                      error={errors}
                      field={field}
                    />
                  )}
                />
              </div>
              <div style={{ width: "100%" }}>
                <Controller
                  control={control}
                  name="postalCode"
                  rules={{ required: "Kode Pos tidak boleh kosong." }}
                  render={({ field }) => (
                    <FormControlFragment
                      id="postalCode"
                      name="kode pos"
                      type="number"
                      placeholder="Masukan Kode Pos"
                      error={errors}
                      field={field}
                    />
                  )}
                />
              </div>
            </div>
            <div className={styles.input_group}>
              <label htmlFor="adress"> Alamat Lengkap</label>

              <textarea
                id="adress"
                placeholder="Masukan Alamat Lengkap"
                rows={3}
                className={styles.area}
                {...register("address", {
                  required: "Alamat Lengkap tidak boleh kosong.",
                })}
              />
              <small className={styles.error_message}>
                {errors?.address?.message}
              </small>
            </div>
          </div>
          <div className={styles.form__footer}>
            <div style={{ width: "150px", marginRight: "1rem" }}>
              <ButtonSubmit title={"Simpan"} loading={loading} />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalAddAddress;
