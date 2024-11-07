"use client";
import styles from "./footer.module.scss";
import Image from "next/image";

import Link from "next/link";

import ButtonScroll from "@/components/views/footer/ButtonScroll";
import {
  Facebook,
  Globe,
  Instagram,
  LocateFixed,
  Mail,
  Phone,
  Twitter,
} from "lucide-react";
import { useMasterContext } from "@/context/MasterContext";
import { usePathname } from "next/navigation";
import { TypeCollection } from "@/services/type.module";

export interface SocialLink {
  type: "website" | "facebook" | "instagram" | "twitter";
  link: string;
}

export interface FooterDetail {
  logo?: string;
  name?: string;
  description: string;
  sosial?: SocialLink[];
}

export interface MenuItem {
  title: string;
  link: string;
}

export interface Informasi {
  title: string;
  link: string;
}

export interface FootersData {
  detail: FooterDetail[];

  pembayaran: string[];
  informasi: Informasi[];
}

const footers: FootersData = {
  detail: [
    {
      logo: "/logo.svg",
      name: "",
      description:
        "Tunjukkan dukungan Anda untuk Real Madrid dengan bangga dan bergaya dengan kaos eksklusif ini. Tambahkan ke keranjang belanja Anda sekarang dan jadilah bagian dari komunitas penggemar yang bersemangat!",
      sosial: [
        {
          type: "website",
          link: "https://losblancos.com/",
        },
        {
          type: "facebook",
          link: "https://www.facebook.com/losblancos/",
        },
        {
          type: "instagram",
          link: "https://www.instagram.com/losblancos/",
        },
      ],
    },
  ],
  pembayaran: [
    "/payment/bca.png",
    "/payment/bni.png",
    "/payment/bri.png",
    "/payment/mandiri.png",
    "/payment/gopay.png",
    "/payment/spay.png",
    "/payment/alfamart.png",
    "/payment/indomaret.png",
    "/payment/QRIS.png",
  ],
  informasi: [
    {
      title:
        "Jl.Bulak Timur, No. 23, Cikar, Cipayung, Taman Jaya, Kota Depok, Jawa Barat 16418",
      link: "https://www.google.com/maps/place/Kec.+Cipayung,+Kota+Depok,+Jawa+Barat/@-6.4325274,106.7825288,16z/data=!3m1!4b1!4m6!3m5!1s0x2e69e99a875b16eb:0x91bd5deac4a9f2cf!8m2!3d-6.4197444!4d106.796065!16s%2Fg%2F120rrg2g?entry=ttu&g_ep=EgoyMDI0MDkxMS4wIKXMDSoASAFQAw%3D%3D",
    },
    {
      title: "(+62) 813106352543",
      link: "https://wa.me/62813106352543",
    },
    {
      title: "admin@losblancos.com",
      link: "mailto:admin@losblancos.com",
    },
  ],
};

const Footer = ({ collection }: { collection: TypeCollection[] }) => {
  const pathname = usePathname();
  const context = useMasterContext();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <ButtonScroll />
      <div className={styles.footer__container}>
        {footers.detail.map((footer, i) => (
          <div key={i} className={styles.footer__detail}>
            <div className={styles.footer__detail__mark}>
              {context?.master.logo && (
                <div className={styles.footer__detail__mark__logo}>
                  <Image
                    src={context?.master.logo || "../default.svg"}
                    alt="logo"
                    width={100}
                    height={100}
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
              )}

              {context?.master.displayName && (
                <h3 className={styles.footer__detail__mark__name}>
                  {context?.master.name}
                </h3>
              )}
            </div>
            <p className={styles.footer__detail__description}>
              {footer.description}
            </p>
            <div className={styles.footer__detail__social}>
              {footer.sosial?.map((social, i) => (
                <Link
                  href={social.link}
                  key={i}
                  target="__blank"
                  className={styles.footer__detail__social__item}
                >
                  {social.type === "website" && (
                    <Globe width={16} height={16} />
                  )}
                  {social.type === "instagram" && (
                    <Instagram width={16} height={16} />
                  )}
                  {social.type === "facebook" && (
                    <Facebook width={16} height={16} className={styles.fb} />
                  )}
                  {social.type === "twitter" && (
                    <Twitter width={16} height={16} />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className={styles.footer__menu}>
          <h3 className={styles.footer__title}>Menu</h3>
          <div className={styles.footer__menu__list}>
            <Link href={`/produk}`} className={styles.footer__menu__list__item}>
              Semua produk
            </Link>
            {collection.map((item: TypeCollection) => (
              <Link
                href={`/product/${item.slug}`}
                className={styles.footer__menu__list__item}
                key={item._id}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.footer__payment}>
          <h3 className={styles.footer__title}>Pembayaran</h3>
          <div className={styles.footer__payment__wrapper}>
            {footers.pembayaran.map((payment, i) => (
              <div className={styles.footer__payment__wrapper__item} key={i}>
                <Image
                  src={payment}
                  alt={payment}
                  width={50}
                  height={50}
                  priority
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.footer__info}>
          <h3 className={styles.footer__title}>Informasi</h3>
          <div className={styles.footer__info__wrapper}>
            {footers.informasi.map((info, i) => (
              <Link
                href={info.link}
                target="__blank"
                key={i}
                className={styles.footer__info__wrapper__item}
              >
                <div
                  className={`${styles.footer__info__wrapper__item__icon}  ${
                    i === 0 ? styles.marginButtom : ""
                  } }`}
                >
                  {i === 0 ? <LocateFixed width={16} height={16} /> : null}
                  {i === 1 ? (
                    <Phone width={16} height={16} fill="white" />
                  ) : null}
                  {i === 2 ? <Mail width={16} height={16} /> : null}
                </div>
                <p>{info && info.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
