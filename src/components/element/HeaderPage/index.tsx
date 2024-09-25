import styles from "./header.module.scss";

const HeaderPage = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className={styles.header}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default HeaderPage;
