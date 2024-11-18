"use client";
import { TypeMaster } from "@/services/type.module";
import React from "react";
import { createContext, ReactNode } from "react";

interface MasterContextProps {
  master: TypeMaster;
  handleUpdate: (data: TypeMaster) => void;
}

const MasterContext = createContext<MasterContextProps | null>(null);

export const useMasterContext = () => {
  return React.useContext(MasterContext);
};

const MasterProvider = ({
  children,
  data,
}: {
  children: ReactNode;
  data: TypeMaster;
}) => {
  const [master, setMaster] = React.useState(
    data || {
      logo: "/default.png",
      displayLogo: false,
      name: "",
      color: "",
      displayName: false,
      favicon: "./default.png",
      description: "",
      email: "",
      phone: "",
      googleMap: "",
      address: {
        street: "",
        postalCode: "",
        city: "",
        province: "",
        subdistrict: "",
      },
      media: [],
    }
  );

  const handleUpdate = (data: TypeMaster) => {
    setMaster((prev) => ({ ...prev, ...data }));
  };

  return (
    <MasterContext.Provider value={{ master, handleUpdate }}>
      {children}
    </MasterContext.Provider>
  );
};

export default MasterProvider;
