import { TypeMaster } from "@/services/type.module";
import {
  Edit2,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
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
  return (
    <div className={styles.item}>
      {Icon(name)}
      <input
        className={edit === name ? styles.active : styles.none}
        type="text"
        placeholder=""
        name={name}
        value={
          name === "email" || name === "phone"
            ? formData[name] || ""
            : formData.media?.find((media) => media.name === name)?.url || ""
        }
        id={name}
        disabled={edit !== name}
        readOnly={edit !== name}
        onChange={(e) => {
          if (name === "email" || name === "phone") {
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
        <Edit2 />
      </button>
    </div>
  );
};

export default InfoFormControl;
