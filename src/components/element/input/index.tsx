import styles from "./input.module.scss";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InputElement = ({ type, placeholder, name, id, field }: any) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      id={id}
      {...field}
      className={styles.input}
    />
  );
};

export default InputElement;
