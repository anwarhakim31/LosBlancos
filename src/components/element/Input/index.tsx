import styles from "./input.module.scss";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Input = ({ type, placeholder, name, id, field }: any) => {
  return (
    <input
      style={{
        paddingRight: name === "password" && "2.5rem",
      }}
      type={type}
      placeholder={placeholder}
      name={name}
      id={id}
      {...field}
      className={styles.input}
    />
  );
};

export default Input;
