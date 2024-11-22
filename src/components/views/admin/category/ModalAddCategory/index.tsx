/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/element/Modal";
import style from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { FormEvent, useEffect, useState } from "react";
import FormControlFragment from "@/components/fragments/FormControl";
import { ResponseError } from "@/utils/axios/response-error";
import { categoryService } from "@/services/category/method";
import { toast } from "sonner";

interface PropsType {
  onClose: () => void;
  callback: () => Promise<any>;
}

const ModalAddCategory = ({ onClose, callback }: PropsType) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ name: "" });
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await categoryService.add(formData);

      if (res.status === 201) {
        toast.success(res.data.message);
        setFormData({
          name: "",
        });
        onClose();
        callback();
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.name !== "") {
      setError({ ...error, name: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, setError]);

  return (
    <Modal onClose={loading ? () => {} : onClose}>
      <div
        role="dialog"
        className={style.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <HeaderModal
          title="Tambah Kategori"
          onClose={loading ? () => {} : onClose}
        />
        <form onSubmit={handleSubmit}>
          <div className={style.modal__content}>
            <FormControlFragment
              type="text"
              placeholder="Masukan Nama Atribut"
              name="nama"
              id="name"
              field={{
                value: formData.name,
                onChange: (e: FormEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    name: (e.target as HTMLInputElement).value,
                  }),
              }}
              error={{
                name: {
                  message: error.name,
                },
              }}
            />
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

export default ModalAddCategory;
