import Modal from "@/components/element/Modal";

import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";

import { useState } from "react";

import ButtonSubmit from "@/components/element/ButtonSubmit";
import { useSession } from "next-auth/react";
import { ResponseError } from "@/utils/axios/response-error";

import { toast } from "sonner";
import { testimoniService } from "@/services/testi/method";
import { usePathname } from "next/navigation";

const ModalFeedback = ({ onClose }: { onClose: () => void }) => {
  const session = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [comment, setComment] = useState<string>("");
  const pathname = usePathname();

  const id = pathname?.split("/")[2];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session.data?.user) {
      return;
    }

    if (!comment) {
      setError("Komentar tidak boleh kosong");
    }

    if (comment) {
      setLoading(true);
      try {
        const res = await testimoniService.create({
          name: session?.data?.user?.name as string,
          image: session?.data.user.image as string,
          comment,
          transactionId: id,
        });

        if (res.status === 201) {
          toast.success(res.data.message);
          onClose();
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <HeaderModal onClose={onClose} title={"Umpan Balik"} />
        <form onSubmit={handleSubmit}>
          <div className={styles.content}>
            <div className={styles.comment}>
              <label htmlFor="comment">
                Bagaimana pengalaman Anda berbelanja di toko kami?
              </label>
              <textarea
                onChange={(e) => setComment(e.target.value)}
                name="comment"
                id="comment"
              ></textarea>
              {!comment && error && <span>{error}</span>}
            </div>
            <p>
              Dengan mengirimkan Umpan Balik ini, Anda menyetujui bahwa ulasan
              Anda dapat digunakan di situs web kami sesuai dengan kebijakan
              privasi kami
            </p>
          </div>

          <div className={styles.footer}>
            <div style={{ width: "150px" }}>
              <ButtonSubmit title="Kirim" loading={loading} />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalFeedback;
