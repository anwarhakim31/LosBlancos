import styles from "./banner.module.scss";

const HomeBannerView = ({ image }: { image: string }) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.content}
        style={{ backgroundImage: `url(${image}) ` }}
      ></div>
    </div>
  );
};

export default HomeBannerView;
