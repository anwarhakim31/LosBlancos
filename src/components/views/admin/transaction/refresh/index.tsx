import React from "react";
import { RotateCcw } from "lucide-react";
import styles from "./refresh.module.scss";
import { useRouter, useSearchParams } from "next/navigation";

const ResfreshComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  if (
    searchParams.get("status-payment") ||
    searchParams.get("status-transaction") ||
    searchParams.get("date") ||
    searchParams.get("sort")
  )
    return (
      <button
        className={styles.refresh}
        type="button"
        aria-label="refresh"
        onClick={() => {
          const query = new URLSearchParams(searchParams);
          query.delete("status-payment");
          query.delete("status-transaction");
          query.delete("date");
          query.delete("sort");
          router.replace(`?${query.toString()}`);
        }}
      >
        <RotateCcw width={20} height={20} />
      </button>
    );

  return null;
};

export default ResfreshComponent;
