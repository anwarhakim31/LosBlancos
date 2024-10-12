/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/element/Modal";
import style from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import UploadImage from "@/components/fragments/UploadImage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { masterService } from "@/services/master/method";
import { toast } from "sonner";

interface PropsType {
  onClose: () => void;
  isEditData: string | null;
  callback: () => void;
}

const ModalEditBanner = ({ onClose, isEditData, callback }: PropsType) => {
  const [loading, setLoading] = useState(false);
  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      image: isEditData || "",
    },
  });

  const onSubmit = async (data: { image: string }) => {
    setLoading(true);
    try {
      const res = await masterService.editBanner(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        callback();
        onClose();
      }
    } catch (error) {
      reportError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div
        role="dialog"
        className={style.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <HeaderModal title="Edit Banner" onClose={onClose} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.modal__content}>
            <UploadImage
              setLoading={setLoading}
              loading={loading}
              setValue={setValue}
              register={register}
              image={isEditData || ""}
            />{" "}
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

export default ModalEditBanner;
