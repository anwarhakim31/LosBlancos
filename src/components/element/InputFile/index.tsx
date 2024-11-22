import styles from "./input.module.scss";

const InputFile = ({
  onChange,
  value,
  id,
}: {
  onChange: (file: File) => void;
  value?: string;
  id: string;
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file);
    }

    event.target.value = "";
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        className={styles.inputname}
        placeholder="Pilih file..."
        readOnly
        value={value}
        id={`${id}-filename`}
      />
      <label htmlFor={id} className={styles.inputbutton}>
        Pilih
      </label>
      <input
        type="file"
        id={id}
        name={id}
        accept="image/*"
        onChange={handleFileChange}
        className={styles.inputfile}
      />
    </div>
  );
};

export default InputFile;
