import { Plus, X } from "lucide-react";
import styles from "./box.module.scss";
import Image from "next/image";
import { Fragment, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { imageService } from "@/services/image/method";
import { ResponseError } from "@/utils/axios/response-error";

interface BoxUploadImageProps {
  id: string;
  preview: string;
  progress: number;
  onRemove: (id: string) => void;
  i: number;
}

const BoxUploadImage = ({
  id,
  preview,
  progress,
  onRemove,
  i,
}: BoxUploadImageProps) => {
  return (
    <div
      className={styles.wrapper}
      style={{ display: !preview && progress === 0 ? "none" : "flex" }}
    >
      {i === 0 && (
        <div className={styles.default}>
          <p>Utama</p>
        </div>
      )}
      {!preview && progress > 0 && (
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
      {!preview && progress === 0 && (
        <Image
          src={"/product-background.png"}
          alt="gambar"
          width={100}
          height={100}
          priority
        />
      )}
      {preview && (
        <>
          <button
            type="button"
            className={styles.delete}
            onClick={() => onRemove(id)}
          >
            <X width={24} height={24} />
          </button>
          <Image
            src={preview || "/product-background.png"}
            alt="gambar"
            width={100}
            height={100}
            priority
          />
        </>
      )}
    </div>
  );
};

interface propsType {
  onChange: (updatedBoxes: string[]) => void;
}

const BoxUploadWrapper = ({ onChange }: propsType) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [boxes, setBoxes] = useState<
    { id: string; preview: string; progress: number }[]
  >([]);
  const [lastBoxId, setLastBoxId] = useState<string | null>(null);

  const handleAddBox = () => {
    if (boxes.length < 6) {
      const newBox = { id: uuid(), preview: "", progress: 0 };
      setBoxes((prevBoxes) => [...prevBoxes, newBox]);
      setLastBoxId(newBox.id);
    }
  };

  const handleRemoveBox = (id: string) => {
    const updatedBoxes = boxes.filter((box) => box.id !== id);

    setBoxes(updatedBoxes);
    onChange(updatedBoxes.map((box) => box.preview));
  };

  const handleUpload = async (file: File, id: string) => {
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
        const updateBox = boxes.map((box) =>
          box.id === id ? { ...box, preview: res.data.url, progress: 0 } : box
        );

        setBoxes(updateBox);
        const preview = updateBox.map((box) => box.preview);
        onChange(preview);
      }
    } catch (error) {
      ResponseError(error);
    }
  };

  const handleClick = () => {
    if (!lastBoxId) {
      handleAddBox();
    }
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      if (lastBoxId) {
        handleRemoveBox(lastBoxId);
        setLastBoxId(null);
      }
      return;
    }

    if (lastBoxId) {
      handleUpload(file, lastBoxId);
      setLastBoxId(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  console.log(boxes[5]?.progress);

  return (
    <div className={styles.container}>
      {boxes.map((box, i) => (
        <BoxUploadImage
          key={box.id}
          id={box.id}
          preview={box.preview}
          progress={box.progress}
          onRemove={handleRemoveBox}
          i={i}
        />
      ))}
      {boxes.length >= 6 && boxes[boxes.length - 1].preview && boxes ? null : (
        <Fragment>
          <div
            onClick={handleClick}
            className={styles.wrapper}
            style={{
              display: boxes[5]?.progress > 0 ? "none" : "flex",
            }}
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
        onChange={handleChange}
      />
    </div>
  );
};

export default BoxUploadWrapper;
