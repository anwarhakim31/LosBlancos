import { useState } from "react";
import styles from "./input.module.scss";

const InputFile = ({ onChange }: { onChange: (file: File) => void }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        className={styles.inputname}
        placeholder="Pilih file..."
        readOnly
        value={fileName}
        id="fileName"
      />
      <label htmlFor="file-upload" className={styles.inputbutton}>
        Pilih
      </label>
      <input
        type="file"
        id="file-upload"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.inputfile}
      />
    </div>
  );
};

export default InputFile;
