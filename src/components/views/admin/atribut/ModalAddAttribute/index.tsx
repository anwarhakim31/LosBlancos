/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/element/Modal";
import style from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { FormEvent, useEffect, useState } from "react";
import FormControlFragment from "@/components/fragments/FormControl";
import { Plus, X } from "lucide-react";
import { ResponseError } from "@/utils/axios/response-error";
import { attributeService } from "@/services/attribute/method";
import { toast } from "sonner";

interface PropsType {
  onClose: () => void;
  callback: () => Promise<any>;
}

const validation = (setError: any, error: any, formData: any) => {
  let status;

  if (formData.name === "") {
    setError({ ...error, name: "Nama atribut Tidak boleh kosong" });
    status = false;
  } else if (formData.value.some((value: string) => value === "")) {
    setError({
      ...error,
      value: "Value artibut tidak boleh kosong",
    });
    status = false;
  } else {
    setError({ ...error, name: "", value: "" });
    status = true;
  }

  return status;
};

const ModalAddAttribute = ({ onClose, callback }: PropsType) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ name: "", value: "" });
  const [formData, setFormData] = useState({
    name: "",
    value: [""],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(formData.value.some((value) => value === ""));

    const valid = validation(setError, error, formData);

    if (valid) {
      setLoading(true);
      try {
        const res = await attributeService.postAtribute(formData);

        if (res.status === 200) {
          toast.success(res.data.message);
          setFormData({
            name: "",
            value: [""],
          });
          onClose();
          callback();
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (formData.value.some((value) => value !== "")) {
      setError({ ...error, value: "" });
    }

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
            <div className={style.value}>
              <label htmlFor="nilai" className={style.value__label}>
                Nilai
              </label>
              {error.value && (
                <small className={style.value__error}>{error.value}</small>
              )}
              <button
                disabled={formData.value.length >= 10 || loading}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, value: [...formData.value, ""] })
                }
              >
                <Plus />
              </button>
            </div>
            <div className={style.wrapper}>
              {formData.value.map((val, index) => (
                <div className={style.wrapper__input} key={index}>
                  <input
                    type="text"
                    id={index.toString()}
                    name={index.toString()}
                    value={val}
                    autoComplete="off"
                    placeholder="Masukan Nilai Atribut"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        value: prev.value.map((val, i) =>
                          i === index ? e.target.value : val
                        ),
                      }))
                    }
                  />
                  <button
                    type="button"
                    className={style.wrapper__input__close}
                    disabled={formData.value.length <= 1 || loading}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        value: prev.value.filter((_, i) => i !== index),
                      }));
                    }}
                  >
                    <X />
                  </button>
                </div>
              ))}
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

export default ModalAddAttribute;
