"use client";

import styles from "./info.module.scss";
import React, { useEffect, useState } from "react";

import { useMasterContext } from "@/context/MasterContext";
import { TypeMaster } from "@/services/type.module";
import { List } from "lucide-react";

import InfoFormControl from "./InfoFormControl";
import FormControlSelectSearch from "@/components/fragments/FormControlSelectSearch";
import { ongkirService } from "@/services/ongkir/method";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import FormControlFragment from "@/components/fragments/FormControl";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { ResponseError } from "@/utils/axios/response-error";
import { masterService } from "@/services/master/method";
import { toast } from "sonner";

const ArrMedia = ["website", "instagram", "facebook", "twitter"];
const ArrContact = ["phone", "email", "googleMap"];

const InfoView = () => {
  const context = useMasterContext();
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    province: { provinsi: string } | string;
    city: { kota: string } | string;
    subdistrict: string;
    postalCode: string;
    street: string;
  }>({
    defaultValues: {
      province: context?.master?.address?.province || "",
      city: context?.master?.address?.city || "",
      subdistrict: context?.master?.address?.subdistrict || "",
      postalCode: context?.master?.address?.postalCode || "",
      street: context?.master?.address?.street || "",
    },
  });
  const [formData, setFormData] = useState<TypeMaster>({
    media: [],
    email: "",
    phone: "",
    googleMap: "",
  });
  const [loading, setLoading] = useState(false);
  const province = watch("province");

  useEffect(() => {
    if (context?.master) {
      setFormData((prev) => ({
        ...prev,
        media: context?.master?.media,
        email: context?.master?.email,
        phone: context?.master?.phone,
      }));
    }
  }, [context?.master]);

  const onSubmit: SubmitHandler<{
    province: { provinsi: string } | string;
    city: { kota: string } | string;
    subdistrict: string;
    postalCode: string;
    street: string;
  }> = async (data) => {
    const address = {
      province:
        typeof data.province === "string"
          ? data.province
          : data.province?.provinsi,
      city: typeof data.city === "string" ? data.city : data.city?.kota,
      subdistrict: data.subdistrict,
      postalCode: data.postalCode,
      street: data.street,
    };

    try {
      setLoading(true);
      const res = await masterService.editMain({ address });

      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__box}>
          <div className={styles.header__title}>
            <List width={20} height={20} />
            <h5>Informasi</h5>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.content__list}>
          <h5>Media</h5>
          {ArrMedia.map((item) => (
            <InfoFormControl
              key={item}
              formData={formData}
              setFormData={setFormData}
              setLoading={setLoading}
              name={item}
              loading={loading}
            />
          ))}
        </div>
        <div className={styles.content__list}>
          <h5>Kontak</h5>
          {ArrContact.map((item) => (
            <InfoFormControl
              key={item}
              formData={formData}
              setFormData={setFormData}
              setLoading={setLoading}
              name={item}
              loading={loading}
            />
          ))}
        </div>
        <div className={styles.content__list}>
          <h5>Alamat</h5>
          <Controller
            control={control}
            name="province"
            rules={{ required: "Provinsi tidak boleh kosong" }}
            render={({ field }) => (
              <FormControlSelectSearch
                field={field}
                name="provinsi"
                id="province"
                fetching={() => ongkirService.province()}
                placeholder="Pilih Provinsi"
                label="Provinsi"
                error={errors}
              />
            )}
          />
          <Controller
            control={control}
            name="city"
            rules={{ required: "Kota tidak boleh kosong" }}
            render={({ field }) => (
              <FormControlSelectSearch
                field={field}
                name="kota"
                id="city"
                fetching={() => {
                  if (
                    province &&
                    typeof province === "object" &&
                    "id" in province
                  ) {
                    const provinceWithId = province as { id: string };
                    return ongkirService.city(provinceWithId.id);
                  }
                  return Promise.resolve([
                    { id_provinsi: "", id: "", kota: "" },
                  ]);
                }}
                placeholder="Pilih Kota"
                label="Kota"
                error={errors}
              />
            )}
          />
          <Controller
            control={control}
            name="subdistrict"
            render={({ field }) => (
              <FormControlFragment
                field={field}
                name="kecamatan"
                id="subdistrict"
                type="string"
                placeholder="Masukkan Kecamatan"
                error={errors}
              />
            )}
          />
          <Controller
            control={control}
            name="postalCode"
            render={({ field }) => (
              <FormControlFragment
                field={field}
                name="kode pos"
                id="postalCode"
                type="string"
                placeholder="Masukkan Kode Pos"
                error={errors}
              />
            )}
          />
          <Controller
            control={control}
            name="street"
            render={({ field }) => (
              <FormControlFragment
                field={field}
                name="Jalan"
                id="street"
                type="string"
                placeholder="Masukkan Jalan"
                error={errors}
              />
            )}
          />
          <ButtonSubmit loading={loading} title="Simpan" />
        </div>
      </div>
    </form>
  );
};

export default InfoView;
