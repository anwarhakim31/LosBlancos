/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/element/Modal";
import style from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { useState } from "react";

import { ResponseError } from "@/utils/axios/response-error";

import { toast } from "sonner";
import { TypeTransaction } from "@/services/type.module";
import { Controller, useForm } from "react-hook-form";
import SelectOption from "@/components/element/SelectOption";
import { transactionService } from "@/services/transaction/method";

interface PropsType {
  onClose: () => void;
  callback: () => Promise<any>;
  isEditData: TypeTransaction | null;
}

const ModalEditTransaction = ({ onClose, callback, isEditData }: PropsType) => {
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      paymentStatus: isEditData?.paymentStatus || "",
      transactionStatus: isEditData?.transactionStatus || "",
    },
  });

  const onSubmit = async (data: {
    transactionStatus: string;
    paymentStatus: string;
  }) => {
    try {
      setLoading(true);
      const res = await transactionService.editStatus(
        isEditData?.invoice as string,
        data
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        callback();
        onClose();
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
          title="Edit Transaksi Status"
          onClose={loading ? () => {} : onClose}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.modal__content}>
            <div className={style.wrapper}>
              <label htmlFor="paymentStatus">Status Pembayaran</label>
              <Controller
                name="paymentStatus"
                control={control}
                render={({ field }) => (
                  <SelectOption
                    name="paymentStatus"
                    field={field}
                    options={[
                      "tertunda",
                      "dibayar",
                      "dibatalkan",
                      "ditolak",

                      "kadaluwarsa",
                    ]}
                    placeholder="Pilih Status Bayar"
                    id="paymentStatus"
                    style={{ minHeight: "100px" }}
                  />
                )}
              />
            </div>
            <div className={style.wrapper}>
              <label htmlFor="transactionStatus">Status Transaksi</label>
              <Controller
                name="transactionStatus"
                control={control}
                render={({ field }) => (
                  <SelectOption
                    name="transactionStatus"
                    field={field}
                    options={[
                      "tertunda",
                      "diproses",
                      "dikirim",
                      "selesai",
                      "dibatalkan",
                    ]}
                    placeholder="Pilih Status Transaksi"
                    id="paymentStatus"
                    style={{ minHeight: "100px" }}
                  />
                )}
              />
            </div>
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

export default ModalEditTransaction;
