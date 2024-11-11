"use client";
import styles from "./footer.module.scss";
import Image from "next/image";

import Link from "next/link";

import ButtonScroll from "@/components/views/footer/ButtonScroll";
import {
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
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

const Footer = ({ collection }: { collection: TypeCollection[] }) => {
  const pathname = usePathname();
  const context = useMasterContext();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const footers: FootersData = {
    detail: [
      {
        description:
          "Tunjukkan dukungan Anda untuk Real Madrid dengan bangga dan bergaya dengan kaos eksklusif ini. Tambahkan ke keranjang belanja Anda sekarang dan jadilah bagian dari komunitas penggemar yang bersemangat!",
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
        title: `${context?.master.address?.street} ${
          context?.master.address?.street ? "," : ""
        } ${context?.master.address?.subdistrict} ${
          context?.master.address?.subdistrict ? "," : ""
        } ${context?.master.address?.city}, ${
          context?.master.address?.province
        } ${context?.master.address?.postalCode || ""}`,
        link: `${
          context?.master.googleMap ||
          `https://maps.app.goo.gl/kYfCbTnWeNeTR3qE7`
        }`,
      },
      {
        title: `(+62) ${
          context?.master.phone?.startsWith("0")
            ? context?.master.phone?.slice(1)
            : context?.master.phone?.startsWith("62")
            ? context?.master.phone?.slice(2)
            : context?.master.phone
        }`,
        link: `https://wa.me/${
          context?.master.phone?.startsWith("0")
            ? `62${context?.master.phone?.slice(1)}`
            : context?.master.phone?.startsWith("62")
            ? context?.master.phone
            : context?.master.phone
        }?text=Halo%20admin,%20saya%20butuh%20bantuan.`,
      },
      {
        title: context?.master.email || "mail@example.com",
        link: `mailto:${context?.master.email || "mail@example.com"}`,
      },
    ],
  };

  return (
    <footer className={styles.footer}>
      <ButtonScroll />
      <div className={styles.footer__container}>
        <div className={styles.footer__detail}>
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
          {context?.master.description && (
            <p className={styles.footer__detail__description}>
              {context?.master.description}
            </p>
          )}
          <div className={styles.footer__detail__social}>
            {context?.master.media &&
              context?.master?.media
                .filter((media) => media.url !== "")
                .map((media, i) => (
                  <Link
                    href={media.url}
                    key={i}
                    target="__blank"
                    className={styles.footer__detail__social__item}
                  >
                    {media.name === "website" && (
                      <Globe width={16} height={16} />
                    )}
                    {media.name === "instagram" && (
                      <Instagram width={16} height={16} />
                    )}
                    {media.name === "facebook" && (
                      <Facebook width={16} height={16} className={styles.fb} />
                    )}
                    {media.name === "twitter" && (
                      <Twitter width={16} height={16} className={styles.tw} />
                    )}
                  </Link>
                ))}
          </div>
        </div>

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
          <h3 className={styles.footer__title}>Kontak</h3>
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
                  {i === 0 ? <MapPin width={16} height={16} /> : null}
                  {i === 1 ? (
                    <Phone width={16} height={16} fill="white" />
                  ) : null}
                  {i === 2 ? <Mail width={16} height={16} /> : null}
                </div>
                <p
                  style={
                    i === 0
                      ? { textTransform: "capitalize" }
                      : { textTransform: "none" }
                  }
                >
                  {info && info.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
