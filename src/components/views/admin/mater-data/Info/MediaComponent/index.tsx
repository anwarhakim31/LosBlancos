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
import { ResponseError } from "@/utils/axios/response-error";
import { masterService } from "@/services/master/method";
import { toast } from "sonner";
import { useMasterContext } from "@/context/MasterContext";

function icon(name: string) {
  switch (name) {
    case "facebook":
      return <Facebook />;
    case "instagram":
      return <Instagram />;
    case "twitter":
      return <Twitter />;
    case "website":
      return <Globe />;
    default:
      return <Globe />;
  }
}

const MediaComponentView = ({
  formData,
  setFormData,
  setLoading,
  loading,
}: {
  formData: TypeMaster;
  setFormData: React.Dispatch<React.SetStateAction<TypeMaster>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) => {
  const context = useMasterContext();
  const [edit, setEdit] = useState("");

  console.log(loading);

  const handleEdit = async () => {
    setLoading(true);
    try {
      const res = await masterService.editMain(formData);

      if (res.status === 200) {
        toast.success(res.data.message);
        setFormData(res.data.data);
        setEdit("");
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {context?.master?.media?.map((media) => (
        <div className={styles.item} key={media.name}>
          {icon(media.name)}
          <input
            className={edit === media.name ? styles.active : styles.none}
            type="text"
            placeholder=""
            name={media.name}
            value={
              formData.media?.find((medias) => medias.name === media.name)
                ?.url || ""
            }
            id={media.name}
            disabled={edit !== media.name}
            readOnly={edit !== media.name}
            onChange={(e) => {
              setFormData({
                ...formData,
                media: formData?.media?.map((medias) => {
                  if (medias.name === media.name) {
                    return {
                      ...media,
                      url: e.target.value,
                    };
                  }
                  return media;
                }),
              });
            }}
          />
          <button
            type="button"
            aria-label="edit media"
            className={edit === media.name ? styles.active : styles.none}
            onClick={() => {
              if (edit === media.name) {
                handleEdit();
              } else {
                setEdit(media.name);
              }
            }}
          >
            {edit === "instagram" ? <Check /> : <Edit2 />}
          </button>
        </div>
      ))}
      {/* <div className={styles.item}>
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
          onChange={(e) => {
            setFormData({
              ...formData,
              media: formData?.media?.map((media) => {
                if (media.name === "website") {
                  return {
                    ...media,
                    url: e.target.value,
                  };
                }
                return media;
              }),
            });
          }}
        />
        <button
          type="button"
          aria-label="edit media"
          className={edit === "website" ? styles.active : styles.none}
          onClick={() => {
            if (edit === "website") {
              handleEdit();
            } else {
              setEdit("website");
            }
          }}
        >
          <Edit2 />
        </button>
      </div>
      <div className={styles.item}>
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
          className={edit === "instagram" ? styles.active : styles.none}
          type="button"
          aria-label="edit media"
          onClick={() => {
            if (edit === "instagram") {
              handleEdit();
            } else {
              setEdit("instagram");
            }
          }}
        >
          {edit === "instagram" ? <Check /> : <Edit2 />}
        </button>
      </div>
      <div className={styles.item}>
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
          className={edit === "twitter" ? styles.active : styles.none}
          type="button"
          aria-label="edit media"
          onClick={() => {
            setEdit("twitter");
          }}
        >
          <Edit2 />
        </button>
      </div>
      <div className={styles.item}>
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
          className={edit === "facebook" ? styles.active : styles.none}
          type="button"
          aria-label="edit media"
          onClick={() => {
            setEdit("facebook");
          }}
        >
          <Edit2 />
        </button>
      </div> */}
    </>
  );
};

export default MediaComponentView;
