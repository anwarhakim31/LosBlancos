import { Star } from "lucide-react";
import Image from "next/image";
import React, { Fragment } from "react";
import halfstar from "@/assets/halfstar.png";
import styles from "./star.module.scss";

const StarComp = ({
  item,
  name,
}: {
  item: {
    averageRating?: number;
    sold?: number;
    rating?: number;
  };
  name: string;
}) => {
  const itemWithRating = name === "product" ? item.averageRating : item.rating;

  return (
    <div className={styles.rating}>
      {Array.from({ length: 5 }).map((_, index) => {
        const isFullStar = itemWithRating && itemWithRating >= index + 1;
        const isHalfStar =
          itemWithRating &&
          itemWithRating >= index + 0.5 &&
          itemWithRating < index + 1;

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
      {name === "product" && <p>| {item.sold} Terjual </p>}
    </div>
  );
};

export default StarComp;
