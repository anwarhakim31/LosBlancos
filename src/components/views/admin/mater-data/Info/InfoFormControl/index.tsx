import { TypeMaster } from "@/services/type.module";
import {
  BookA,
  Check,
  Edit2,
  Facebook,
  Globe,
  Instagram,
  LinkIcon,
  Mail,
  MapPin,
  NotepadText,
  Phone,
  Twitter,
} from "lucide-react";
import React, { useState } from "react";
import styles from "./form.module.scss";
import { toast } from "sonner";
import { ResponseError } from "@/utils/axios/response-error";
import { masterService } from "@/services/master/method";

function Icon(name: string) {
  switch (name) {
    case "website":
      return <Globe />;
    case "instagram":
      return <Instagram />;
    case "twitter":
      return <Twitter />;
    case "facebook":
      return <Facebook />;
    case "email":
      return <Mail />;
    case "phone":
      return <Phone />;
    case "googleMap":
      return <MapPin />;
    case "description":
      return <NotepadText />;
    case "youtube":
      return <LinkIcon />;
    default:
      return <Globe />;
  }
}

const InfoFormControl = ({
  formData,
  setFormData,
  setLoading,
  loading,
  name,
}: {
  formData: TypeMaster;
  setFormData: React.Dispatch<React.SetStateAction<TypeMaster>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  name: string;
}) => {
  const [edit, setEdit] = useState("");

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

  if (name === "about") {
    return (
      <div className={styles.item} style={{ alignItems: "flex-start" }}>
        <div title="about">
          <BookA />
        </div>
        <textarea
          className={edit === name ? styles.active : styles.none}
          value={formData.about}
          disabled={loading}
          readOnly={loading}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              about: e.target.value,
            }));
          }}
        />
        <button
          disabled={loading}
          type="button"
          aria-label="edit about"
          className={edit === name ? styles.active : styles.none}
          style={{ marginTop: "10px" }}
          onClick={() => {
            if (edit === name) {
              handleEdit();
            } else {
              setEdit("about");
            }
          }}
        >
          {edit === name ? <Check /> : <Edit2 />}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.item}>
      <div title={name}>{Icon(name)}</div>

      <input
        className={edit === name ? styles.active : styles.none}
        type={name === "phone" ? "number" : "text"}
        placeholder=""
        name={name}
        value={
          name === "email" ||
          name === "phone" ||
          name === "googleMap" ||
          name === "description" ||
          name === "youtube"
            ? formData[name] || ""
            : formData.media?.find((media) => media.name === name)?.url || ""
        }
        id={name}
        disabled={loading}
        readOnly={loading}
        onChange={(e) => {
          if (
            name === "email" ||
            name === "phone" ||
            name === "googleMap" ||
            name === "description" ||
            name === "youtube"
          ) {
            setFormData({
              ...formData,
              [name]: e.target.value,
            });
          } else {
            setFormData({
              ...formData,
              media: formData?.media?.map((media) => {
                if (media.name === name) {
                  return {
                    ...media,
                    url: e.target.value,
                  };
                }
                return media;
              }),
            });
          }
        }}
      />
      <button
        disabled={loading}
        type="button"
        aria-label="edit media"
        className={edit === name ? styles.active : styles.none}
        onClick={() => {
          if (edit === name) {
            handleEdit();
          } else {
            setEdit(name);
          }
        }}
      >
        {edit === name ? <Check /> : <Edit2 />}
      </button>
    </div>
  );
};

export default InfoFormControl;
