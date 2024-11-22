import Modal from "@/components/element/Modal";
import { itemTypeTransaction, TypeReview } from "@/services/type.module";
import styles from "./review.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import Image from "next/image";
import { useState } from "react";
import { Star } from "lucide-react";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { useSession } from "next-auth/react";
import { ResponseError } from "@/utils/axios/response-error";
import { reviewService } from "@/services/review/method";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

function titleRating(rating: number) {
  switch (rating) {
    case 1:
      return "Sangat Buruk!";
    case 2:
      return "Buruk!";
    case 3:
      return "Cukup!";
    case 4:
      return "Bagus!";
    case 5:
      return "Sangat Bagus!";
    default:
      return "";
  }
}

const ModalReview = ({
  onClose,
  data,
  handleAddReview,
}: {
  onClose: () => void;
  data: itemTypeTransaction | null;
  handleAddReview: (item: TypeReview) => void;
}) => {
  const session = useSession();
  const [error, setError] = useState({ rating: "", comment: "" });
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const pathname = usePathname();

  const id = pathname.split("/")[2];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session.data?.user) {
      return;
    }

    if (!rating) {
      setError((prev) => ({ ...prev, rating: "Rating tidak boleh kosong" }));
    }

    if (!comment) {
      setError((prev) => ({ ...prev, comment: "Komentar tidak boleh kosong" }));
    }

    if (rating && comment) {
      setLoading(true);
      try {
        const res = await reviewService.create({
          transactionId: id as string,
          itemId: data?._id as string,
          product: data?.productId?._id as string,
          comment,
          rating,
          user: session.data?.user?.id as string,
        });

        if (res.status === 201) {
          toast.success("Berhasil membuat ulasan");
          handleAddReview(res.data.review);
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
        <HeaderModal onClose={onClose} title={"Ulasan Produk"} />
        <form onSubmit={handleSubmit}>
          <div className={styles.content}>
            <div className={styles.item}>
              <div className={styles.item__image}>
                <Image
                  src={data?.productId?.image[0] || "/default.png"}
                  alt={data?.productId?.name || "image"}
                  width={80}
                  height={80}
                  priority
                />
              </div>
              <div className={styles.item__detail}>
                <h3>{data?.productId?.name}</h3>
                <p>
                  {data?.atribute} {data?.atributeValue}
                </p>
              </div>
            </div>
            <div className={styles.rating}>
              <h3>Bagaimana Barangnya</h3>

              <div className={styles.rating__wrapper}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setRating(index + 1)}
                    type="button"
                  >
                    <Star
                      className={rating && rating > index ? styles.active : ""}
                    />
                  </button>
                ))}
              </div>

              <p>
                {titleRating(rating as number)}
                {rating === 0 && error.rating && <span>{error.rating}</span>}
              </p>
            </div>
            <div className={styles.comment}>
              <label htmlFor="comment">Apa Komentar Anda?</label>
              <textarea
                onChange={(e) => setComment(e.target.value)}
                name="comment"
                id="comment"
              ></textarea>
              {!comment && error.comment && <span>{error.comment}</span>}
            </div>
          </div>

          <div className={styles.footer}>
            <div style={{ width: "150px" }}>
              <ButtonSubmit title="Kirim Ulasan" loading={loading} />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalReview;
