import { TypeProduct } from "@/services/type.module";
import { Star } from "lucide-react";
import Image from "next/image";
import React, { Fragment } from "react";
import halfstar from "@/assets/halfstar.png";
import styles from "./star.module.scss";

const StarComp = ({ item }: { item: TypeProduct }) => {
  return (
    <div className={styles.rating}>
      {Array.from({ length: 5 }).map((_, index) => {
        const isFullStar =
          item.averageRating && item.averageRating >= index + 1;
        const isHalfStar =
          item.averageRating &&
          item.averageRating >= index + 0.5 &&
          item.averageRating < index + 1;

        return (
          <Fragment key={index}>
            {isFullStar ? (
              <Star className={styles.active} />
            ) : isHalfStar ? (
              <Image
                src={halfstar}
                alt="star"
                width={12}
                height={12}
                priority
              />
            ) : (
              <Star />
            )}
          </Fragment>
        );
      })}
      <p>| {item.sold} Terjual </p>
    </div>
  );
};

export default StarComp;
