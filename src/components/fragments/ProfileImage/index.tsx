import { Dispatch, Fragment, SetStateAction, useRef, useState } from "react";
import styles from "./profile.module.scss";
import ImageFormat from "@/components/element/ImageFormat";

import { ALLOW_IMAGE_TYPE } from "@/utils/AllowImageType";

import ErrorBadge from "@/components/element/ErrorBadge";
import { Plus, X } from "lucide-react";

import Image from "next/image";
import { imageService } from "@/services/image/method";
import { v4 as uuidv4 } from "uuid";

const ProfileImageView = ({
  imageValue,
  setLoading,
  setValue,
  loading,
}: {
  imageValue: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setValue: (image: string) => void;
  loading: boolean;
}) => {
  const [hover, setHover] = useState(false);
  const [errorImage, setErrorImage] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!ALLOW_IMAGE_TYPE.includes(file?.type || "")) {
      return setErrorImage("Format file tidak didukung");
    }

    if (file && file?.size > 5 * 1024 * 1024) {
      return setErrorImage("Ukuran file terlalu besar");
    }

    if (file) {
      setErrorImage("");
      setHover(true);
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUD_PRESET!);

      const originalFileName = `${uuidv4()}/${file.name.split(".")[0]}`;
      formData.append("public_id", originalFileName);

      try {
        const res = await imageService.upload(formData, (progress) => {
          setProgress(progress);
        });

        if (res.status === 200) {
          setValue(res.data.url);
        }
      } catch (error) {
        reportError(error);
      } finally {
        e.target.value = "";
        setLoading(false);
        setProgress(null);
        setHover(false);
      }
    }
  };

  const handleImageClick = async () => {
    if (!imageValue && !loading) {
      inputRef.current?.click();
    } else if (imageValue && !loading) {
      setValue("");

      try {
        await imageService.delete(imageValue);
      } catch (error) {
        reportError(error);
      }
    }
  };

  return (
    <Fragment>
      <div
        className={styles.wrapper}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {progress !== null && progress >= 0 && (
          <div className={styles.overlay}>
            <p className={styles.progress}>{progress}%</p>
          </div>
        )}
        {hover && !loading && (
          <div className={styles.overlay} onClick={handleImageClick}>
            {imageValue && <X />}
            {!imageValue && progress === null && <Plus />}
          </div>
        )}

        <Image
          src={imageValue.replace("s96-c", "s512-c") || "/profile.png"}
          alt="user image"
          width={100}
          height={100}
          priority
        />
        <input
          type="file"
          style={{ display: "none" }}
          accept="image/*"
          ref={inputRef}
          onChange={handleInputChange}
        />
      </div>
      <small className={styles.info}> Ukuran File Maksimal 5 MB</small>
      <ImageFormat />
      <div style={{ width: "200px" }}>
        <ErrorBadge isError={errorImage} />
      </div>
    </Fragment>
  );
};

export default ProfileImageView;
