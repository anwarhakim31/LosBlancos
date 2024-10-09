import { Plus, X } from "lucide-react";
import styles from "./box.module.scss";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { imageService } from "@/services/image/method";
import { ResponseError } from "@/utils/axios/response-error";
import { ALLOW_IMAGE_TYPE } from "@/utils/AllowImageType";
import { toast } from "sonner";

interface BoxUploadImageProps {
  id: string;
  preview: string;
  progress: number;
  onRemove: (id: string, preview: string) => void;
}

const BoxUploadImage = ({
  id,
  preview,
  progress,
  onRemove,
}: BoxUploadImageProps) => {
  return (
    <div
      className={styles.wrapper}
      // style={{ display: preview || progress > 0 ? "flex" : "none" }}
    >
      <button
        type="button"
        className={styles.delete}
        onClick={() => onRemove(id, preview)}
      >
        <X width={24} height={24} />
      </button>
      {preview ? (
        <Image src={preview} alt="gambar" width={100} height={100} priority />
      ) : (
        <div className={styles.progress}>
          <p>Mengunggah</p>
          <div className={styles.progress__track}>
            <div
              className={styles.progress__bar}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

interface PropsType {
  onChange: (updatedBoxes: string[]) => void;
  value: string[];
}

const BoxUploadWrapper = ({ onChange, value }: PropsType) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [boxes, setBoxes] = useState<
    { id: string; preview: string; progress: number }[]
  >([]);

  useEffect(() => {
    if (value.length > 0 && boxes.length === 0) {
      setBoxes(value.map((preview) => ({ id: uuid(), preview, progress: 0 })));
    }
  }, [value, boxes]);

  const handleRemoveBox = async (id: string, preview: string) => {
    const updatedBoxes = boxes.filter((box) => box.id !== id);
    setBoxes(updatedBoxes);
    onChange(updatedBoxes.map((box) => box.preview));
    await imageService.delete(preview);
  };

  const handleUpload = async (file: File, id: string) => {
    if (!ALLOW_IMAGE_TYPE.includes(file.type)) {
      return toast.error("Format file tidak didukung");
    }

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Ukuran file terlalu besar");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUD_PRESET!);
    const originalFileName = `${uuid()}/${file.name.split(".")[0]}`;
    formData.append("public_id", originalFileName);

    try {
      const res = await imageService.upload(formData, (percentage) => {
        setBoxes((prevBoxes) =>
          prevBoxes.map((box) =>
            box.id === id ? { ...box, progress: percentage } : box
          )
        );
      });

      if (res.status === 200) {
        setBoxes((prevBoxes) => {
          const updatedBoxes = prevBoxes.map((box) =>
            box.id === id ? { ...box, preview: res.data.url, progress: 0 } : box
          );

          onChange(updatedBoxes.map((box) => box.preview));

          return updatedBoxes;
        });
      }
    } catch (error) {
      ResponseError(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const currentUploadCount = boxes.length;

    if (currentUploadCount + files.length > 6) {
      toast.error("Maksimum upload 6 gambar. Silakan pilih lagi.");
      return;
    }
    Array.from(files).forEach((file) => {
      const newBoxId = uuid();

      setBoxes((prevBoxes) => [
        ...prevBoxes,
        { id: newBoxId, preview: "", progress: 0 },
      ]);

      handleUpload(file, newBoxId);
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={styles.container}>
      {boxes.map((box) => (
        <BoxUploadImage
          key={box.id}
          id={box.id}
          preview={box.preview}
          progress={box.progress}
          onRemove={handleRemoveBox}
        />
      ))}
      {boxes.length < 6 && (
        <Fragment>
          <div
            onClick={() => inputRef.current?.click()}
            className={styles.wrapper}
          >
            <div className={styles.upload}>
              <button type="button">
                <Plus width={24} height={24} />
              </button>
            </div>
          </div>
        </Fragment>
      )}
      <input
        ref={inputRef}
        type="file"
        id="image"
        hidden
        accept="image/*"
        multiple
        onChange={handleChange}
      />
    </div>
  );
};

export default BoxUploadWrapper;
