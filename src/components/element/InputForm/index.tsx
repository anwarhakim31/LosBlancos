import React from "react";

interface fieldType {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface InputForm {
  type: string;
  placeholder: string;
  name: string;
  id: string;
  field?: fieldType;
}

const InputForm = ({ type, placeholder, name, id, field }: InputForm) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      id={id}
      {...field}
    />
  );
};

export default InputForm;
