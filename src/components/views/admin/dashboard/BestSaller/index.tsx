import { ArrowsUpFromLine } from "lucide-react";
import React from "react";
import styles from "./best.module.scss";
import Image from "next/image";
import { useSocket } from "@/context/SocketContext";
import StarComp from "@/components/element/Star";

const BestSellerView = () => {
  const socket = useSocket();

  return (
    <div className={`${styles.bestsaller} ${styles.top}`}>
      <div className={styles.titlechart}>
        <ArrowsUpFromLine />
        <h3>Produk Terlaris</h3>
      </div>
      {socket?.bestSeller &&
        socket?.bestSeller?.length > 0 &&
        socket.bestSeller.map((item, index) => (
          <div className={styles.bestsaller__list} key={index}>
            <figure>
              <Image
                src={item?.image[0]}
                alt={item?.name}
                width={500}
                height={500}
              />
            </figure>
            <div>
              <h3>{item?.name}</h3>
              <p>{item?.sold || 0}</p>
              <StarComp item={{ rating: item?.averageRating }} name="" />
            </div>
          </div>
        ))}
    </div>
  );
};

export default BestSellerView;
