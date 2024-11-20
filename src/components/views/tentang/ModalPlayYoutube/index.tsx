import React from "react";
import styles from "./modal.module.scss";
import { X } from "lucide-react";
import { useMasterContext } from "@/context/MasterContext";
import { youtubeid } from "@/utils/contant";
import PortalNotification from "@/components/element/PortalNotification";

const ModalPlayYoutube = ({ onClose }: { onClose: () => void }) => {
  const context = useMasterContext();

  return (
    <PortalNotification onClose={onClose}>
      <div className={styles.youtube}>
        <iframe
          width={"100%"}
          height={"100%"}
          src={`https://www.youtube.com/embed/${youtubeid(
            context?.master?.youtube || ""
          )}?autoplay=1&mute=1&loop=1`}
          title="YouTube video player"
          allow="autoplay; encrypted-media"
          allowFullScreen
          frameBorder={"0"}
        ></iframe>
      </div>

      <button className={styles.close}>
        <X />
      </button>
    </PortalNotification>
  );
};

export default ModalPlayYoutube;
