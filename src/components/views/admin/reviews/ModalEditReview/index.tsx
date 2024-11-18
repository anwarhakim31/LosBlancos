import Modal from "@/components/element/Modal";
import style from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { useState } from "react";
import FormControlFragment from "@/components/fragments/FormControl";
import { ResponseError } from "@/utils/axios/response-error";

import { toast } from "sonner";

import { Controller, useForm } from "react-hook-form";

import { TypeReview } from "@/services/type.module";
import { reviewService } from "@/services/review/method";

interface PropsType {
  onClose: () => void;
  callback: () => Promise<void>;
  isEditData: TypeReview | null;
}

const ModalEditReview = ({ onClose, callback, isEditData }: PropsType) => {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      comment: isEditData?.comment || null,
    },
  });

  const onSubmit = async (data: { comment: string | null }) => {
    if (data.comment === null) {
      return;
    }

    setLoading(true);
    try {
      const res = await reviewService.updateOne(isEditData?._id as string, {
        comment: data.comment,
      });

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
          title="Edit Ulasan"
          onClose={loading ? () => {} : onClose}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.modal__content}>
            <Controller
              control={control}
              name="comment"
              rules={{ required: "Komentar tidak boleh kosong" }}
              render={({ field }) => (
                <FormControlFragment
                  type="text"
                  id="comment"
                  field={field}
                  name="Komentar"
                  placeholder="Masukkan Komentar"
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

export default ModalEditReview;
