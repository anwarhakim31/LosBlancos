import React, { useState } from "react";
import {
  Check,
  Edit2,
  Facebook,
  Globe,
  Instagram,
  Twitter,
} from "lucide-react";

import styles from "./media.module.scss";
import { TypeMaster } from "@/services/type.module";

const MediaComponentView = ({
  formData,
  setFormData,
}: {
  formData: TypeMaster;
  setFormData: React.Dispatch<React.SetStateAction<TypeMaster>>;
}) => {
  const [edit, setEdit] = useState("");

  return (
    <>
      <div className={styles.content__list__item}>
        <Globe />
        <input
          className={edit === "website" ? styles.active : styles.none}
          type="text"
          placeholder=""
          name="website"
          value={
            formData.media?.find((media) => media.name === "website")?.url || ""
          }
          id="website"
          disabled={edit !== "website"}
          readOnly={edit !== "website"}
        />
        <button
          type="button"
          aria-label="edit media"
          onClick={() => {
            setEdit("website");
          }}
        >
          <Edit2 />
        </button>
      </div>
      <div className={styles.content__list__item}>
        <Instagram />
        <input
          className={edit === "instagram" ? styles.active : styles.none}
          type="text"
          placeholder=""
          name="instagram"
          id="instagram"
          disabled={edit !== "instagram"}
          readOnly={edit !== "instagram"}
          onChange={(e) => {
            console.log(e.target.value);
            setFormData({
              ...formData,
              media: formData?.media?.map((media) => {
                if (media.name === "instagram") {
                  return {
                    ...media,
                    url: e.target.value,
                  };
                }
                return media;
              }),
            });
          }}
          value={
            formData?.media?.find((media) => media.name === "instagram")?.url ||
            ""
          }
        />
        <button
          type="button"
          aria-label="edit media"
          onClick={() => {
            setEdit("instagram");
          }}
        >
          {edit === "instagram" ? <Check /> : <Edit2 />}
        </button>
      </div>
      <div className={styles.content__list__item}>
        <Twitter />
        <input
          className={edit === "twitter" ? styles.active : styles.none}
          type="text"
          placeholder=""
          name="Twitter"
          id="Twitter"
          disabled={edit !== "twitter"}
          readOnly={edit !== "twitter"}
        />
        <button
          type="button"
          aria-label="edit media"
          onClick={() => {
            setEdit("twitter");
          }}
        >
          <Edit2 />
        </button>
      </div>
      <div className={styles.content__list__item}>
        <Facebook />
        <input
          className={edit === "facebook" ? styles.active : styles.none}
          type="text"
          placeholder=""
          name="Facebook"
          id="Facebook"
          disabled={edit !== "facebook"}
          readOnly={edit !== "facebook"}
        />
        <button
          type="button"
          aria-label="edit media"
          onClick={() => {
            setEdit("facebook");
          }}
        >
          <Edit2 />
        </button>
      </div>
    </>
  );
};

export default MediaComponentView;
