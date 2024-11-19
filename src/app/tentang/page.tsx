"use client";
import BreadCrubm from "@/components/element/BreadCrubm";

import styles from "./tentang.module.scss";
import { useMasterContext } from "@/context/MasterContext";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import ModalPlayYoutube from "./ModalPlayYoutube";
import { youtubeid } from "@/utils/contant";
import ChatComponent from "@/components/element/ChatComponent";

const service = [
  {
    id: 1,
    image: "/service/customer.png",
    title: "Dukungan Pelanggan 24/7",
    desc: "Kepuasan pelanggan addalah nomor 1. Tim dukungan kami siap membantu Anda kapan saja dengan layanan terbaik.",
  },
  {
    id: 2,
    image: "/service/top-seller.png",
    title: "Kualitas Terjamin",
    desc: "Kami hanya menjual produk terbaik dengan kualitas teruji untuk kepuasan Anda.",
  },
  {
    id: 3,
    image: "/service/souvenir.png",
    title: "Produk  Asli",
    desc: "Kami menawarkan produk-produk asli.  Kami tidak menjual produk palsu.",
  },
];

const TentangPage = () => {
  const context = useMasterContext();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <main>
      <div
        className={styles.banner}
        style={{
          backgroundImage: `url(${context?.master.banner || "/banner1.png"})`,
        }}
      ></div>
      <section>
        <div className={styles.container}>
          <BreadCrubm />
          <div className={styles.service}>
            {service.map((item) => (
              <div className={styles.service__item} key={item.id}>
                <figure>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={100}
                    height={100}
                  />
                </figure>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.container}>
            <div className={styles.youtube}>
              <Image
                src={`https://img.youtube.com/vi/${youtubeid(
                  context?.master?.youtube || ""
                )}/maxresdefault.jpg`}
                alt="youtube"
                width={1000}
                height={1000}
                priority
              />
              <button
                type="button"
                aria-label="play"
                onClick={() => setIsOpen(true)}
              >
                <Play />
                <div className={styles.signal}></div>
              </button>
            </div>
            <div className={styles.text}>
              <h2>{context?.master.name}</h2>
              <p>{context?.master.about || ""}</p>
              <Link href="/produk">Belanja Sekarang</Link>
            </div>
          </div>
          {isOpen && <ModalPlayYoutube onClose={() => setIsOpen(false)} />}
        </div>
      </section>
      <ChatComponent />
    </main>
  );
};

export default TentangPage;
