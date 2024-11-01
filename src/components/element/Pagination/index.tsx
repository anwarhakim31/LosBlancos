import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./page.module.scss";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const Pagination = ({
  pagination,
}: {
  pagination: { totalPage: number; total: number; page: number; limit: number };
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || 1);

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pagination__btn}
        disabled={page === 1}
        type="button"
        aria-label="previous"
        onClick={() => {
          const query = new URLSearchParams(searchParams);

          const value = page - 1;
          if (value === 1) query.delete("page");
          else if (page > 1) query.set("page", value.toString());

          router.replace(`${pathname}?${query.toString()}`);
        }}
      >
        <ChevronLeft />
      </button>
      <span>{page}</span>
      <button
        className={styles.pagination__btn}
        disabled={page === pagination.totalPage}
        type="button"
        aria-label="next"
        onClick={() => {
          const query = new URLSearchParams(searchParams);

          query.set("page", (page + 1).toString());
          router.replace(`${pathname}?${query.toString()}`);
        }}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
